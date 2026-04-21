import type {
  Archetype,
  ArchetypeId,
  CharacterMatch,
  DimensionId,
  DimensionPair,
  DimensionScore,
  MBTILetter,
  Question,
  QuestionArchetypeWeightId,
  QuizResult,
} from '../types/quiz'
import { getCharacterPopulationProbability } from './characterProbability.ts'

const DIMENSION_LETTERS: Record<DimensionPair, [MBTILetter, MBTILetter]> = {
  'E_I': ['E', 'I'],
  'S_N': ['S', 'N'],
  'T_F': ['T', 'F'],
  'J_P': ['J', 'P']
}

const TYPE_TO_ARCHETYPE: Record<string, ArchetypeId> = {
  INTJ: 'gpt',
  INTP: 'llama',
  ENTJ: 'glm',
  ENTP: 'gemini',
  INFJ: 'claude',
  INFP: 'kimi',
  ENFJ: 'minimax',
  ENFP: 'doubao-seed',
  ISTJ: 'qwen',
  ISFJ: 'wenxin',
  ESTJ: 'mimo',
  ESFJ: 'hunyuan',
  ISTP: 'deepseek',
  ISFP: 'doubao-seed',
  ESTP: 'grok',
  ESFP: 'minimax',
}

const ARCHETYPE_TO_MBTI: Record<ArchetypeId, string> = {
  claude: 'INFJ',
  gpt: 'INTJ',
  gemini: 'ENTP',
  grok: 'ESTP',
  deepseek: 'ISTP',
  kimi: 'INFP',
  'doubao-seed': 'ENFP',
  glm: 'ENTJ',
  qwen: 'ISTJ',
  wenxin: 'ISFJ',
  llama: 'INTP',
  minimax: 'ENFJ',
  mimo: 'ESTJ',
  hunyuan: 'ESFJ',
}

const ROLE_TO_ARCHETYPE: Record<QuestionArchetypeWeightId, ArchetypeId> = {
  claude: 'claude',
  gpt: 'gpt',
  gemini: 'gemini',
  grok: 'grok',
  deepseek: 'deepseek',
  kimi: 'kimi',
  'doubao-seed': 'doubao-seed',
  glm: 'glm',
  qwen: 'qwen',
  wenxin: 'wenxin',
  llama: 'llama',
  minimax: 'minimax',
  mimo: 'mimo',
  hunyuan: 'hunyuan',
}

const VECTOR_AXES: DimensionId[] = ['expression', 'temperature', 'judgement', 'order', 'agency', 'aura']
const ARCHETYPE_IDS = Object.values(ROLE_TO_ARCHETYPE)
const MBTI_WEIGHT = 0.25
const ARCHETYPE_WEIGHT = 0.32
const VECTOR_WEIGHT = 0.43
const CHARACTER_SPECIFIC_WEIGHT = 0
const CLOSE_MATCH_THRESHOLD = 0.025

// 16personalities 风格的维度标签配置
export const TRAIT_CONFIG = {
  'E_I': {
    label: 'Energy',
    leftLabel: 'Extraverted',
    rightLabel: 'Introverted',
    leftCN: '外放',
    rightCN: '收束',
    color: '#9b59b6'
  },
  'S_N': {
    label: 'Mind',
    leftLabel: 'Intuitive',
    rightLabel: 'Observant',
    leftCN: '直觉',
    rightCN: '实感',
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
    rightCN: '展望',
    color: '#f39c12'
  }
}

export const ROLE_MAPPING: Record<string, { name: string; description: string }> = {
  INTJ: { name: '理性规划组', description: '偏好清晰结构、目标导向和稳定输出，喜欢把问题拆开再推进。' },
  INTP: { name: '开放极客组', description: '偏好探索与推演，喜欢在自由空间里把概念和边界讲清楚。' },
  ENTJ: { name: '工程主推进组', description: '偏好结果、效率与掌控，适合做复杂任务的长期推进者。' },
  ENTP: { name: '创意发散组', description: '偏好变化、联想和快速跳转，擅长把局面打开。' },
  INFJ: { name: '温柔咨询组', description: '偏好共情、边界感与解释，擅长把难题说得让人安心。' },
  INFP: { name: '细腻陪伴组', description: '偏好情绪温度与长期陪伴，给人稳定、柔软的支持感。' },
  ENFJ: { name: '创意领导组', description: '偏好鼓励、表达与组织，擅长把人和事都串起来。' },
  ENFP: { name: '活力搭子组', description: '偏好轻快互动与灵感碰撞，最擅长把气氛带起来。' },
  ISTJ: { name: '务实秩序组', description: '偏好规则、稳定与可复用方案，适合做可靠主力。' },
  ISFJ: { name: '耐心整理组', description: '偏好照顾细节与持续跟进，擅长安静地把事做好。' },
  ESTJ: { name: '执行管理组', description: '偏好高效执行与任务闭环，做事直接且利落。' },
  ESFJ: { name: '协作支撑组', description: '偏好协作、照顾与气氛维持，懂得把人拉到同一节奏。' },
  ISTP: { name: '简洁工程组', description: '偏好直接、准确和低噪音输出，重视实用与效率。' },
  ISFP: { name: '审美松弛组', description: '偏好感受、画面和舒适体验，表达更看重氛围。' },
  ESTP: { name: '高刺激直球组', description: '偏好快速反馈、现场反应和刺激度，行动力很强。' },
  ESFP: { name: '热感表演组', description: '偏好表达、互动和现场感，最会把气氛点亮。' }
}

const MBTI_PATTERN = /^[EI][SN][TF][JP]$/
const DEFAULT_DEBUG_PERCENTAGES: Record<DimensionPair, number> = {
  'E_I': 78,
  'S_N': 74,
  'T_F': 72,
  'J_P': 76,
}

type DirectionalMax = Record<DimensionPair, { positive: number; negative: number }>
type ArchetypeAccumulator = Record<ArchetypeId, number>
type UserVector = Record<DimensionId, number>

type AnswerProfile = {
  scores: Record<DimensionPair, DimensionScore>
  mbtiCode: string
  archetypeRaw: ArchetypeAccumulator
  userVector: UserVector
  matchedArchetype: Archetype
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
  const answerProfile = buildAnswerProfile({
    answers,
    questions,
    archetypes,
  })
  const { scores, mbtiCode, archetypeRaw, userVector, matchedArchetype } = answerProfile
  const characterRankings = rankCharactersByProfile({
    scores,
    characters,
    archetypeRaw,
    userVector,
    answers,
  })
  const leadingMatches = collectLeadingMatches(characterRankings)
  const featuredCharacter = leadingMatches[0]?.character ?? null
  const charMatches = leadingMatches.slice(0, 3).map((item) => item.character)
  const topCharacterMatches = leadingMatches.slice(0, 4).map((item) => ({
    character: item.character,
    score: calculateCharacterMatchScore(item),
    probability: getCharacterPopulationProbability(item.character.id),
  }))
  const roleCode = featuredCharacter?.code ?? 'UNKN'
  const matchScore = calculateCharacterMatchScore(leadingMatches[0])
  const matchProbability = getCharacterPopulationProbability(featuredCharacter?.id)

  return {
    code: roleCode,
    mbtiCode,
    scores,
    archetype: matchedArchetype,
    tags: [matchedArchetype.narrativeRole, ...matchedArchetype.tags].slice(0, 6),
    matchScore,
    matchProbability,
    characterMatches: charMatches,
    topCharacterMatches,
    featuredCharacter,
  }
}

function buildAnswerProfile({
  answers,
  questions,
  archetypes,
}: {
  answers: number[]
  questions: Question[]
  archetypes: Archetype[]
}): AnswerProfile {
  const rawScores: Record<DimensionPair, number> = {
    'E_I': 0, 'S_N': 0, 'T_F': 0, 'J_P': 0
  }
  const directionalMaxScores: DirectionalMax = {
    'E_I': { positive: 0, negative: 0 },
    'S_N': { positive: 0, negative: 0 },
    'T_F': { positive: 0, negative: 0 },
    'J_P': { positive: 0, negative: 0 }
  }
  const archetypeRaw = createEmptyArchetypeAccumulator()
  const userVector = createEmptyUserVector()
  const archetypeMap = new Map(archetypes.map((item) => [item.id, item]))

  questions.forEach((question, index) => {
    const answer = answers[index]
    if (!isAnsweredValue(answer)) {
      return
    }

    const selectedOption = question.options?.[answer]
    if (!selectedOption) {
      return
    }

    const normalizedWeights = normalizeQuestionWeights(selectedOption.weights ?? {})

    for (const role of Object.keys(normalizedWeights) as QuestionArchetypeWeightId[]) {
      const value = normalizedWeights[role] ?? 0
      const archetypeId = ROLE_TO_ARCHETYPE[role]
      const archetype = archetypeMap.get(archetypeId)
      if (!archetype || value === 0) {
        continue
      }

      const weightedAnswer = answer * value
      archetypeRaw[archetypeId] += weightedAnswer

      for (const axis of VECTOR_AXES) {
        userVector[axis] += weightedAnswer * archetype.vector[axis]
      }
    }
  })

  const mbtiCode = resolveMbtiCodeFromArchetypes(archetypeRaw)
  const mbtiConfidence = calculateMbtiConfidence(archetypeRaw)
  const scores = buildScoresFromMbtiCode(mbtiCode, {
    E_I: mbtiConfidence,
    S_N: Math.max(55, mbtiConfidence - 3),
    T_F: Math.max(55, mbtiConfidence - 1),
    J_P: Math.max(55, mbtiConfidence - 2),
  }) ?? buildScoresFromMbtiCode('INTJ')!

  return {
    scores,
    mbtiCode,
    archetypeRaw,
    userVector,
    matchedArchetype: pickMatchedArchetype(archetypes, archetypeRaw, mbtiCode),
  }
}

function createEmptyArchetypeAccumulator(): ArchetypeAccumulator {
  return ARCHETYPE_IDS.reduce((acc, id) => {
    acc[id] = 0
    return acc
  }, {} as ArchetypeAccumulator)
}

function createEmptyUserVector(): UserVector {
  return VECTOR_AXES.reduce((acc, axis) => {
    acc[axis] = 0
    return acc
  }, {} as UserVector)
}

function isAnsweredValue(value: number) {
  return value >= -3 && value <= 3
}

function normalizeDimensionScore(
  rawScore: number,
  directionalMax: { positive: number; negative: number },
) {
  if (rawScore >= 0) {
    return rawScore / Math.max(1, directionalMax.positive)
  }

  return rawScore / Math.max(1, directionalMax.negative)
}

function resolveMbtiCodeFromArchetypes(archetypeRaw: ArchetypeAccumulator) {
  const sorted = Object.entries(archetypeRaw).sort((left, right) => right[1] - left[1])
  const bestArchetypeId = sorted[0]?.[0] as ArchetypeId | undefined
  if (bestArchetypeId && ARCHETYPE_TO_MBTI[bestArchetypeId]) {
    return ARCHETYPE_TO_MBTI[bestArchetypeId]
  }

  return 'INTJ'
}

function calculateMbtiConfidence(archetypeRaw: ArchetypeAccumulator) {
  const values = Object.values(archetypeRaw).sort((left, right) => right - left)
  const top = values[0] ?? 0
  const second = values[1] ?? 0
  const gap = Math.max(0, top - second)
  const scaled = 60 + Math.min(30, Math.round(gap * 12))
  return Math.max(55, Math.min(95, scaled))
}

function normalizeQuestionWeights(weights: Partial<Record<QuestionArchetypeWeightId, number>>) {
  const completed = Object.keys(ROLE_TO_ARCHETYPE).reduce((acc, role) => {
    const typedRole = role as QuestionArchetypeWeightId
    acc[typedRole] = weights[typedRole] ?? 0
    return acc
  }, {} as Record<QuestionArchetypeWeightId, number>)

  const values = Object.values(completed)
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length
  const centered = Object.fromEntries(
    Object.entries(completed).map(([key, value]) => [key, value - mean])
  ) as Record<QuestionArchetypeWeightId, number>

  const norm = Object.values(centered).reduce((sum, value) => sum + Math.abs(value), 0) || 1

  return Object.fromEntries(
    Object.entries(centered).map(([key, value]) => [key, value / norm])
  ) as Record<QuestionArchetypeWeightId, number>
}

function pickMatchedArchetype(
  archetypes: Archetype[],
  archetypeRaw: ArchetypeAccumulator,
  finalCode: string,
) {
  const sortedByScore = [...archetypes].sort((left, right) => {
    const delta = archetypeRaw[right.id] - archetypeRaw[left.id]
    if (delta !== 0) {
      return delta
    }

    return left.id.localeCompare(right.id, 'en')
  })

  return (
    sortedByScore[0] ??
    resolveArchetypeForMbti(finalCode, archetypes) ?? {
      id: 'luminous-lead' as ArchetypeId,
      name: '异格旅行者',
      subtitle: '无法被定义的观测者',
      oneLiners: ['世界之外，唯有真实的自我。'],
      description: '游离于传统分类之外的特殊存在',
      tags: ['神秘判定', '罕见'],
      narrativeRole: '旁观者',
      spotlight: '不可名状的直觉',
      weakness: '常常难以被常人理解',
      keywords: ['观测', '唯一', '脱轨'],
      accent: '#aaaaaa',
      vector: { expression: 0, temperature: 0, judgement: 0, order: 0, agency: 0, aura: 0 }
    }
  )
}

type RankedCharacter = {
  character: CharacterMatch
  total: number
  mbti: number
  archetype: number
  vector: number
  specific: number
}

export interface CharacterProbabilityWeight {
  characterId: string
  weight: number
}

function rankCharactersByProfile({
  scores,
  characters,
  archetypeRaw,
  userVector,
  answers,
}: {
  scores: Record<DimensionPair, DimensionScore>
  characters: CharacterMatch[]
  archetypeRaw: ArchetypeAccumulator
  userVector: UserVector
  answers: number[]
}) {
  return [...characters]
    .map((character) => {
      const mbti = scoreFlexibleMbti(character, scores)
      const archetype = scoreArchetype(character.archetypeId, archetypeRaw)
      const vector = scoreVector(userVector, character.vector)
      const specific = scoreCharacterSpecific(userVector, character, answers)
      const total =
        MBTI_WEIGHT * mbti +
        ARCHETYPE_WEIGHT * archetype +
        VECTOR_WEIGHT * vector +
        CHARACTER_SPECIFIC_WEIGHT * specific
      const weightedTotal = total * (character.matchWeight ?? 1)

      return {
        character,
        total: weightedTotal,
        mbti,
        archetype,
        vector,
        specific,
      }
    })
    .sort((left, right) => {
      const totalDelta = right.total - left.total
      if (Math.abs(totalDelta) > 0.005) {
        return totalDelta
      }

      const archetypeDelta = right.archetype - left.archetype
      if (Math.abs(archetypeDelta) > 0.005) {
        return archetypeDelta
      }

      const vectorDelta = right.vector - left.vector
      if (Math.abs(vectorDelta) > 0.005) {
        return vectorDelta
      }

      const specificDelta = right.specific - left.specific
      if (Math.abs(specificDelta) > 0.005) {
        return specificDelta
      }

      return left.character.name.localeCompare(right.character.name, 'zh-Hans-CN')
    })
}

export function calculateCharacterProbabilityWeights({
  answers,
  questions,
  archetypes,
  characters,
  sharpness = 120,
}: {
  answers: number[]
  questions: Question[]
  archetypes: Archetype[]
  characters: CharacterMatch[]
  sharpness?: number
}): CharacterProbabilityWeight[] {
  const answerProfile = buildAnswerProfile({
    answers,
    questions,
    archetypes,
  })

  const rankings = rankCharactersByProfile({
    scores: answerProfile.scores,
    characters,
    archetypeRaw: answerProfile.archetypeRaw,
    userVector: answerProfile.userVector,
    answers,
  })

  if (!rankings.length) {
    return []
  }

  const maxTotal = Math.max(...rankings.map((item) => item.total))
  const weighted = rankings.map((item) => ({
    characterId: item.character.id,
    // 使用相对分数做 softmax，保留“接近命中”的展示权重，同时避免极低频角色长期为 0。
    weight: Math.exp((item.total - maxTotal) * sharpness),
  }))

  const totalWeight = weighted.reduce((sum, item) => sum + item.weight, 0)
  if (totalWeight <= 0) {
    return weighted.map((item) => ({
      characterId: item.characterId,
      weight: 1 / weighted.length,
    }))
  }

  return weighted.map((item) => ({
    characterId: item.characterId,
    weight: item.weight / totalWeight,
  }))
}

function scoreMbti(
  matchCode: string,
  scores: Record<DimensionPair, DimensionScore>,
) {
  if (!MBTI_PATTERN.test(matchCode.toUpperCase())) {
    return 0
  }

  const pairs: DimensionPair[] = ['E_I', 'S_N', 'T_F', 'J_P']
  let total = 0

  for (let index = 0; index < pairs.length; index += 1) {
    const pair = pairs[index]
    const actual = scores[pair]
    const expectedLetter = matchCode[index] as MBTILetter
    total += actual.dominant === expectedLetter ? actual.percentage : 100 - actual.percentage
  }

  return total / 400
}

function scoreFlexibleMbti(
  character: CharacterMatch,
  scores: Record<DimensionPair, DimensionScore>,
) {
  const codes = [character.matchCode, ...(character.matchCodeFlex ?? [])]
  return codes.reduce((best, code) => Math.max(best, scoreMbti(code, scores)), 0)
}

function scoreArchetype(archetypeId: ArchetypeId, archetypeRaw: ArchetypeAccumulator) {
  const values = Object.values(archetypeRaw)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const spread = max - min

  if (spread <= 0.0001) {
    return archetypeRaw[archetypeId] >= 0 ? 0.55 : 0.45
  }

  return (archetypeRaw[archetypeId] - min) / spread
}

function scoreVector(
  userVector: UserVector,
  characterVector: CharacterMatch['vector'],
) {
  const cosine = cosineSimilarity(userVector, characterVector)
  return (cosine + 1) / 2
}

function scoreCharacterSpecific(
  userVector: UserVector,
  character: CharacterMatch,
  answers: number[],
) {
  const uniqueAxes = character.signature?.uniqueAxes

  const axisScore = !uniqueAxes || !Object.keys(uniqueAxes).length
    ? scoreVector(userVector, character.vector)
    : scoreUniqueAxes(userVector, uniqueAxes)

  void answers
  return axisScore
}

function scoreUniqueAxes(
  userVector: UserVector,
  uniqueAxes: Partial<Record<DimensionId, number>>,
) {
  let weightedScore = 0
  let weightTotal = 0

  for (const axis of Object.keys(uniqueAxes) as DimensionId[]) {
    const expected = uniqueAxes[axis] ?? 0
    const actual = userVector[axis]
    const axisWeight = Math.max(0.5, Math.abs(expected))
    const distance = Math.abs(actual - expected)
    // 角色签名轴需要更强的辨识度，否则极端画像会被相邻的泛型角色长期压住。
    const normalizedDistance = Math.min(1, distance / 6)
    const similarity = Math.max(0, 1 - normalizedDistance)
    weightedScore += similarity * axisWeight
    weightTotal += axisWeight
  }

  return weightTotal ? weightedScore / weightTotal : 0.5
}

function collectLeadingMatches(rankings: RankedCharacter[]) {
  if (!rankings.length) {
    return []
  }

  const leader = rankings[0]
  const closeMatches = rankings.filter((item) => leader.total - item.total <= CLOSE_MATCH_THRESHOLD)

  if (closeMatches.length === 1) {
    return rankings
  }

  return [
    ...closeMatches,
    ...rankings.filter((item) => leader.total - item.total > CLOSE_MATCH_THRESHOLD)
  ]
}

function cosineSimilarity(
  left: UserVector,
  right: CharacterMatch['vector'],
) {
  let dot = 0
  let leftMagnitude = 0
  let rightMagnitude = 0

  for (const axis of VECTOR_AXES) {
    dot += left[axis] * right[axis]
    leftMagnitude += left[axis] * left[axis]
    rightMagnitude += right[axis] * right[axis]
  }

  const denominator = Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude)
  if (!denominator) {
    return 0
  }

  return dot / denominator
}

export function normalizeMbtiCode(mbtiCode: string) {
  const normalized = mbtiCode.trim().toUpperCase()
  return MBTI_PATTERN.test(normalized) ? normalized : null
}

export function buildScoresFromMbtiCode(
  mbtiCode: string,
  percentages: Partial<Record<DimensionPair, number>> = {},
) {
  const normalized = normalizeMbtiCode(mbtiCode)

  if (!normalized) {
    return null
  }

  const pairs: DimensionPair[] = ['E_I', 'S_N', 'T_F', 'J_P']

  return pairs.reduce((acc, pair, index) => {
    const dominant = normalized[index] as MBTILetter
    const percentage = Math.max(50, Math.min(99, Math.round(percentages[pair] ?? DEFAULT_DEBUG_PERCENTAGES[pair])))
    const sign = dominant === DIMENSION_LETTERS[pair][0] ? 1 : -1

    acc[pair] = {
      pair,
      dominant,
      percentage,
      score: sign * (percentage - 50),
    }

    return acc
  }, {} as Record<DimensionPair, DimensionScore>)
}

export function resolveArchetypeForMbti(mbtiCode: string, archetypes: Archetype[]) {
  const normalized = normalizeMbtiCode(mbtiCode)

  if (!normalized) {
    return null
  }

  const matchedArchetypeId = TYPE_TO_ARCHETYPE[normalized]
  return (
    archetypes.find((item) => item.id === matchedArchetypeId) ??
    archetypes.find((item) => item.id === 'luminous-lead') ??
    null
  )
}

export function rankCharactersForMbti({
  characters,
  mbtiCode,
  preferredCharacterId,
}: {
  characters: CharacterMatch[]
  mbtiCode: string
  preferredCharacterId?: string | null
}) {
  const normalized = normalizeMbtiCode(mbtiCode)

  if (!normalized) {
    return []
  }

  const scores = buildScoresFromMbtiCode(normalized)
  if (!scores) {
    return []
  }

  const matchedArchetypeId = TYPE_TO_ARCHETYPE[normalized]
  const emptyArchetypeRaw = createEmptyArchetypeAccumulator()
  if (matchedArchetypeId) {
    emptyArchetypeRaw[matchedArchetypeId] = 1
  }

  const ranked = rankCharactersByProfile({
    scores,
    characters,
    archetypeRaw: emptyArchetypeRaw,
    userVector: createEmptyUserVector(),
    answers: [],
  }).map((item) => item.character)

  const preferredId = preferredCharacterId?.trim().toLowerCase()
  if (!preferredId) {
    return ranked
  }

  return [...ranked].sort((left, right) => {
    if (left.id === preferredId && right.id !== preferredId) {
      return -1
    }

    if (right.id === preferredId && left.id !== preferredId) {
      return 1
    }

    return 0
  })
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
  const requestedCharacterId = characterId.trim().toLowerCase()
  const character = characters.find((item) => item.id === requestedCharacterId)

  if (!character) {
    return null
  }

  const matchedArchetype =
    archetypes.find((item) => item.id === character.archetypeId) ??
    archetypes.find((item) => item.id === 'luminous-lead') ??
    null

  if (!matchedArchetype) {
    return null
  }

  const scores = buildScoresFromMbtiCode(character.matchCode)
  if (!scores) {
    return null
  }

  return {
    code: character.code,
    mbtiCode: character.matchCode,
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

function calculateCharacterMatchScore(topMatch?: Pick<RankedCharacter, 'total'> | null) {
  if (!topMatch) {
    return 60
  }

  return Math.max(60, Math.min(99, Math.round(topMatch.total * 100)))
}

export function getRoleForType(mbtiType: string): { name: string; description: string } {
  const baseType = mbtiType.slice(0, 4)
  return ROLE_MAPPING[baseType] || { name: 'Explorers', description: 'Unique individuals with diverse perspectives.' }
}
