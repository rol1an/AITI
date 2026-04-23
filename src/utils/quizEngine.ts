import type {
  Archetype,
  ArchetypeId,
  CharacterMatch,
  DimensionPair,
  DimensionScore,
  MBTILetter,
  Question,
  QuizResult,
} from '../types/quiz'
import { getCharacterPopulationProbability } from './characterProbability.ts'

const DIMENSION_ORDER: DimensionPair[] = ['E_I', 'S_N', 'T_F', 'J_P']

const DIMENSION_LETTERS: Record<DimensionPair, [MBTILetter, MBTILetter]> = {
  'E_I': ['E', 'I'],
  'S_N': ['S', 'N'],
  'T_F': ['T', 'F'],
  'J_P': ['J', 'P'],
}

// Temporary mapping from old 5-dimension keys to MBTI 4 (will be updated when questions are re-mapped)
const LEGACY_DIMENSION_MAP: Record<string, DimensionPair> = {
  'D_P': 'E_I',  // Direct=E, Prelude=I
  'F_E': 'T_F',  // Fact=T, Emotion=F
  'W_S': 'S_N',  // Written/formal≈S, Casual/spoken≈N
  'C_H': 'J_P',  // Confident/assertive=J, Humble/open=P
  'V_I': 'S_N',  // Evidence=S, Impression=N
}

// Map MBTI type → archetype. ISFP and ESFP redirect to nearest model.
const TYPE_TO_ARCHETYPE: Record<string, ArchetypeId> = {
  INFP: 'doubao-seed',
  INFJ: 'claude',
  ENFP: 'minimax',
  ENFJ: 'gemini',
  INTJ: 'gpt',
  INTP: 'llama',
  ENTJ: 'glm',
  ENTP: 'grok',
  ESTJ: 'qwen',
  ISTJ: 'wenxin',
  ISFJ: 'kimi',
  ESFJ: 'hunyuan',
  ISTP: 'deepseek',
  ESTP: 'mimo',
  // Redirects
  ISFP: 'doubao-seed',
  ESFP: 'minimax',
}

const ARCHETYPE_TO_MBTI: Record<ArchetypeId, string> = {
  'doubao-seed': 'INFP',
  'claude':      'INFJ',
  'minimax':     'ENFP',
  'gemini':      'ENFJ',
  'gpt':         'INTJ',
  'llama':       'INTP',
  'glm':         'ENTJ',
  'grok':        'ENTP',
  'qwen':        'ESTJ',
  'wenxin':      'ISTJ',
  'kimi':        'ISFJ',
  'hunyuan':     'ESFJ',
  'deepseek':    'ISTP',
  'mimo':        'ESTP',
}

// 16personalities-style trait config for MBTI 4 dimensions
export const TRAIT_CONFIG = {
  'E_I': {
    label: 'Energy',
    leftLabel: 'Extraverted',
    rightLabel: 'Introverted',
    leftCN: '外向',
    rightCN: '内向',
    color: '#9b59b6'
  },
  'S_N': {
    label: 'Mind',
    leftLabel: 'Observant',
    rightLabel: 'Intuitive',
    leftCN: '实感',
    rightCN: '直觉',
    color: '#3498db'
  },
  'T_F': {
    label: 'Nature',
    leftLabel: 'Thinking',
    rightLabel: 'Feeling',
    leftCN: '理性',
    rightCN: '共情',
    color: '#e74c3c'
  },
  'J_P': {
    label: 'Tactics',
    leftLabel: 'Judging',
    rightLabel: 'Prospecting',
    leftCN: '判断',
    rightCN: '感知',
    color: '#f39c12'
  },
}

function isAnsweredValue(value: number) {
  return value >= -3 && value <= 3
}

function resolveDimensionPair(dim: string): DimensionPair | null {
  if (DIMENSION_ORDER.includes(dim as DimensionPair)) return dim as DimensionPair
  return LEGACY_DIMENSION_MAP[dim] ?? null
}

export function calculateQuizResult({
  answers,
  questions,
  archetypes,
  characters,
}: {
  answers: number[]
  questions: Question[]
  archetypes: Archetype[]
  characters: CharacterMatch[]
}): QuizResult {
  const voteCounts: Record<DimensionPair, [number, number]> = {
    'E_I': [0, 0],
    'S_N': [0, 0],
    'T_F': [0, 0],
    'J_P': [0, 0],
  }

  questions.forEach((question, index) => {
    const answer = answers[index]
    if (!isAnsweredValue(answer)) return
    const dim = resolveDimensionPair(question.dimension)
    if (!dim) return
    // sign=-1 means option A maps to the SECOND letter of the pair (reversed)
    const sign = (question.sign ?? 1) as 1 | -1
    let voteIndex = answer === 0 ? 0 : 1
    if (sign === -1) voteIndex = 1 - voteIndex
    voteCounts[dim][voteIndex]++
  })

  const scores: Record<DimensionPair, DimensionScore> = {} as Record<DimensionPair, DimensionScore>
  let mbtiCode = ''

  for (const dim of DIMENSION_ORDER) {
    const [firstCount, secondCount] = voteCounts[dim]
    const total = firstCount + secondCount
    const [firstLetter, secondLetter] = DIMENSION_LETTERS[dim]

    let dominant: MBTILetter
    let percentage: number

    if (total === 0) {
      dominant = firstLetter
      percentage = 50
    } else if (firstCount >= secondCount) {
      dominant = firstLetter
      percentage = Math.round((firstCount / total) * 100)
    } else {
      dominant = secondLetter
      percentage = Math.round((secondCount / total) * 100)
    }

    const sign = dominant === firstLetter ? 1 : -1
    scores[dim] = { pair: dim, score: sign * (percentage - 50), dominant, percentage }
    mbtiCode += dominant
  }

  // Apply ISFP→INFP, ESFP→ENFP redirects
  const normalizedMbti = mbtiCode in TYPE_TO_ARCHETYPE ? mbtiCode : 'INFJ'
  const archetypeId = TYPE_TO_ARCHETYPE[normalizedMbti] ?? 'claude'
  const matchedArchetype = archetypes.find((a) => a.id === archetypeId) ?? archetypes[0]

  const featuredCharacter = characters.find((c) => c.archetypeId === archetypeId) ?? null

  // Build topCharacterMatches sorted by MBTI distance
  const rankedMatches = buildTopMatches(mbtiCode, scores, characters)

  const topCharacterMatches = rankedMatches.slice(0, 4).map((item) => ({
    character: item.character,
    score: item.score,
    probability: getCharacterPopulationProbability(item.character.id),
  }))

  const characterMatches = topCharacterMatches.slice(0, 3).map((item) => item.character)
  const matchScore = topCharacterMatches[0]?.score ?? 75
  const matchProbability = getCharacterPopulationProbability(featuredCharacter?.id)

  return {
    code: featuredCharacter?.code ?? archetypeId.toUpperCase(),
    mbtiCode,
    scores,
    archetype: matchedArchetype,
    tags: [matchedArchetype.narrativeRole, ...matchedArchetype.tags].slice(0, 6),
    matchScore,
    matchProbability,
    characterMatches,
    topCharacterMatches,
    featuredCharacter,
  }
}

function mbtiDistance(a: string, b: string): number {
  let dist = 0
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] !== b[i]) dist++
  }
  return dist
}

function buildTopMatches(
  userMbti: string,
  scores: Record<DimensionPair, DimensionScore>,
  characters: CharacterMatch[],
) {
  // Score each archetype by MBTI distance + how well the percentages align
  const archetypeScores = (Object.keys(ARCHETYPE_TO_MBTI) as ArchetypeId[]).map((id) => {
    const modelMbti = ARCHETYPE_TO_MBTI[id]
    const dist = mbtiDistance(userMbti, modelMbti)
    // Convert distance (0-4) to match score (60-99)
    // dist 0 → 99, dist 1 → 85, dist 2 → 75, dist 3 → 65, dist 4 → 60
    const baseScore = [99, 85, 75, 65, 60][dist] ?? 60
    // Boost by average percentage strength
    const avgPct = DIMENSION_ORDER.reduce((sum, dim) => sum + scores[dim].percentage, 0) / 4
    const boost = Math.round((avgPct - 50) * 0.15)
    return { id, score: Math.min(99, baseScore + boost) }
  }).sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    // Tie-break: user's top result comes first
    const userTopId = TYPE_TO_ARCHETYPE[userMbti]
    if (a.id === userTopId) return -1
    if (b.id === userTopId) return 1
    return 0
  })

  return archetypeScores.map(({ id, score }) => {
    const character = characters.find((c) => c.archetypeId === id)
    return { character: character!, score }
  }).filter((item) => item.character != null)
}

export function createDebugQuizResult({
  characterId,
  archetypes,
  characters,
}: {
  characterId: string
  archetypes: Archetype[]
  characters: CharacterMatch[]
}): QuizResult | null {
  const requestedId = characterId.trim().toLowerCase()
  const character = characters.find((item) => item.id === requestedId)
  if (!character) return null

  const matchedArchetype =
    archetypes.find((item) => item.id === character.archetypeId) ??
    archetypes.find((item) => item.id === 'claude') ??
    null
  if (!matchedArchetype) return null

  const mbtiCode = ARCHETYPE_TO_MBTI[character.archetypeId] ?? 'INFJ'
  const scores = buildScoresFromMbtiCode(mbtiCode) ?? buildScoresFromMbtiCode('INFJ')!

  return {
    code: character.code,
    mbtiCode,
    scores,
    archetype: matchedArchetype,
    tags: [matchedArchetype.narrativeRole, ...matchedArchetype.tags].slice(0, 6),
    matchScore: 92,
    matchProbability: getCharacterPopulationProbability(character.id),
    characterMatches: [character],
    topCharacterMatches: [{
      character,
      score: 92,
      probability: getCharacterPopulationProbability(character.id),
    }],
    featuredCharacter: character,
  }
}

const MBTI_PATTERN = /^[EI][SN][TF][JP]$/

export function normalizeMbtiCode(mbtiCode: string) {
  const normalized = mbtiCode.trim().toUpperCase()
  return MBTI_PATTERN.test(normalized) ? normalized : null
}

export function buildScoresFromMbtiCode(
  mbtiCode: string,
  percentages: Partial<Record<DimensionPair, number>> = {},
): Record<DimensionPair, DimensionScore> | null {
  const normalized = normalizeMbtiCode(mbtiCode)
  if (!normalized) return null

  return DIMENSION_ORDER.reduce((acc, pair, index) => {
    const dominant = normalized[index] as MBTILetter
    const [firstLetter] = DIMENSION_LETTERS[pair]
    const percentage = Math.max(50, Math.min(99, percentages[pair] ?? 78))
    const sign = dominant === firstLetter ? 1 : -1
    acc[pair] = { pair, score: sign * (percentage - 50), dominant, percentage }
    return acc
  }, {} as Record<DimensionPair, DimensionScore>)
}

export function getRoleForType(_type: string): { name: string; description: string } {
  return { name: '', description: '' }
}

export function resolveArchetypeForMbti(mbtiCode: string, archetypes: Archetype[]) {
  const normalized = normalizeMbtiCode(mbtiCode)
  if (!normalized) return null
  const archetypeId = TYPE_TO_ARCHETYPE[normalized]
  return archetypes.find((a) => a.id === archetypeId) ?? archetypes[0] ?? null
}

export function rankCharactersForMbti({
  characters,
}: {
  characters: CharacterMatch[]
  mbtiCode: string
  preferredCharacterId?: string | null
}) {
  return characters
}

export interface CharacterProbabilityWeight {
  characterId: string
  weight: number
}

export function calculateCharacterProbabilityWeights({
  characters,
}: {
  answers: number[]
  questions: Question[]
  archetypes: Archetype[]
  characters: CharacterMatch[]
  sharpness?: number
}): CharacterProbabilityWeight[] {
  return characters.map((c) => ({ characterId: c.id, weight: 1 / characters.length }))
}
