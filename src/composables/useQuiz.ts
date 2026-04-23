import { computed, reactive, readonly, ref } from 'vue'

import questionsData from '../data/aitiQuestions.json'
import archetypesData from '../data/aitiArchetypes.json'
import charactersData from '../data/aitiCharacters.json'

import type { Archetype, CharacterMatch, Question, QuizRecord, QuizResult } from '../types/quiz'
import { hydrateCharacterVisual, hydrateQuizRecord } from '../utils/characterVisuals'
import { calculateQuizResult, createDebugQuizResult } from '../utils/quizEngine'
import { clearLastRecord, loadLastRecord, saveLastRecord } from '../utils/storage'
import { tm } from '../i18n'

const questions = ref<Question[]>((questionsData as Question[]) ?? [])
const archetypes = ref<Archetype[]>((archetypesData as Archetype[]) ?? [])
const characters = ref<CharacterMatch[]>((charactersData as CharacterMatch[]).map(hydrateCharacterVisual))

// Locale-aware computed refs — auto-update when locale changes
const localizedQuestions = computed<Question[]>(() => {
  type QTrans = { text: string; optionA: string; optionB: string }
  const trans = tm<QTrans[] | undefined>('quiz.questions')
  if (!Array.isArray(trans) || trans.length === 0) return questions.value
  return questions.value.map((q, i) => {
    const t = trans[i]
    if (!t) return q
    const opts = q.options ?? []
    return {
      ...q,
      text: t.text ?? q.text,
      options: [
        { ...(opts[0] ?? {}), label: t.optionA ?? opts[0]?.label ?? '' },
        { ...(opts[1] ?? {}), label: t.optionB ?? opts[1]?.label ?? '' },
      ],
    }
  })
})

const localizedArchetypes = computed<Archetype[]>(() => {
  type ATrans = Partial<Pick<Archetype, 'subtitle' | 'description' | 'narrativeRole' | 'spotlight' | 'weakness' | 'minefield' | 'oneLiners' | 'mbtiReason' | 'tags' | 'keywords'>>
  const trans = tm<Record<string, ATrans> | undefined>('archetypes')
  if (!trans || typeof trans !== 'object') return archetypes.value
  return archetypes.value.map((a) => {
    const t = (trans as Record<string, ATrans>)[a.id]
    if (!t) return a
    return { ...a, ...t }
  })
})

const localizedCharacters = computed<CharacterMatch[]>(() => {
  type CTrans = { title?: string; note?: string; tags?: string[]; soulmateReason?: string; rivalDescription?: string }
  const trans = tm<Record<string, CTrans> | undefined>('characters')
  if (!trans || typeof trans !== 'object') return characters.value
  return characters.value.map((c) => {
    const t = (trans as Record<string, CTrans>)[c.id]
    if (!t) return c
    return {
      ...c,
      title: t.title ?? c.title,
      note: t.note ?? c.note,
      tags: t.tags ?? c.tags,
      soulmate: c.soulmate && t.soulmateReason
        ? { ...c.soulmate, reason: t.soulmateReason }
        : c.soulmate,
      rival: c.rival && t.rivalDescription
        ? { ...c.rival, description: t.rivalDescription }
        : c.rival,
    }
  })
})

// 数据是否已就绪
const dataReady = computed(() => questions.value.length > 0)

const UNANSWERED = -10

function isAnsweredValue(value: number) {
  return value >= -3 && value <= 3
}

const emptyAnswers = () => Array.from({ length: questions.value.length }, () => UNANSWERED)

const state = reactive({
  currentIndex: 0,
  answers: emptyAnswers(),
  startedAt: null as string | null,
  latestRecord: hydrateQuizRecord(loadLastRecord() as QuizRecord | null),
})

const currentQuestion = computed(() => localizedQuestions.value[state.currentIndex] ?? null)
const selectedOptionIndex = computed(() => state.answers[state.currentIndex] ?? UNANSWERED)
const progress = computed(() => (questions.value.length ? (state.currentIndex + 1) / questions.value.length : 0))
const answeredCount = computed(() => state.answers.filter((answer) => isAnsweredValue(answer)).length)
const firstUnansweredIndex = computed(() => state.answers.findIndex((answer) => !isAnsweredValue(answer)))
const canGoNext = computed(() => isAnsweredValue(selectedOptionIndex.value))
const canGoPrev = computed(() => state.currentIndex > 0)
const isComplete = computed(() => state.answers.every((answer) => isAnsweredValue(answer)))
const latestResult = computed(() => state.latestRecord?.result ?? null)

function selectOption(optionIndex: number) {
  if (!isAnsweredValue(optionIndex)) return
  if (!state.startedAt) {
    state.startedAt = new Date().toISOString()
  }
  state.answers[state.currentIndex] = optionIndex
}

function selectOptionAt(questionIndex: number, optionValue: number) {
  if (!isAnsweredValue(optionValue)) return
  if (questionIndex < 0 || questionIndex >= questions.value.length) return
  if (!state.startedAt) {
    state.startedAt = new Date().toISOString()
  }
  state.answers[questionIndex] = optionValue
}

function goNext() {
  if (canGoNext.value && state.currentIndex < questions.value.length - 1) {
    state.currentIndex += 1
  }
}

function goPrev() {
  if (canGoPrev.value) {
    state.currentIndex -= 1
  }
}

function jumpToQuestion(index: number) {
  if (index >= 0 && index < questions.value.length) {
    state.currentIndex = index
  }
}

function resetQuiz(clearHistory = false) {
  state.currentIndex = 0
  state.answers = emptyAnswers()
  state.startedAt = null

  if (clearHistory) {
    state.latestRecord = null
    clearLastRecord()
  }
}

function finalizeQuiz(): QuizResult | null {
  if (!isComplete.value) {
    return null
  }

  const result = calculateQuizResult({
    answers: state.answers,
    questions: questions.value,
    archetypes: localizedArchetypes.value,
    characters: localizedCharacters.value,
  })

  const submissionId = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

  const record: QuizRecord = {
    answers: [...state.answers],
    createdAt: new Date().toISOString(),
    startedAt: state.startedAt || undefined,
    submissionId,
    result,
  }

  state.latestRecord = hydrateQuizRecord(record)
  try {
    saveLastRecord(record)
  } catch (error) {
    console.warn('Failed to persist latest quiz record', error)
  }

  return result
}

function resumeLastResult() {
  state.latestRecord = hydrateQuizRecord(loadLastRecord())
}

export function useQuiz() {
  return {
    ensureData: async () => {
      questions.value = (questionsData as Question[]) ?? []
      archetypes.value = (archetypesData as Archetype[]) ?? []
      characters.value = (charactersData as CharacterMatch[]).map(hydrateCharacterVisual)
      // 如果 answers 长度和 questions 不匹配，重置
      if (state.answers.length !== questions.value.length) {
        state.answers = emptyAnswers()
      }
    },
    dataReady,
    questions: localizedQuestions,
    archetypes: localizedArchetypes,
    characters: localizedCharacters,
    state: readonly(state),
    currentQuestion,
    selectedOptionIndex,
    progress,
    answeredCount,
    firstUnansweredIndex,
    canGoNext,
    canGoPrev,
    isComplete,
    latestResult,
    selectOption,
    selectOptionAt,
    goNext,
    goPrev,
    jumpToQuestion,
    resetQuiz,
    finalizeQuiz,
    resumeLastResult,
    createDebugResult: (characterId: string): QuizResult | null =>
      createDebugQuizResult({
        characterId,
        archetypes: localizedArchetypes.value,
        characters: localizedCharacters.value,
      }),
  }
}
