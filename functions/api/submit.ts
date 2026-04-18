// /api/submit — 记录一次问卷提交（总记录 + 答题明细）
// 纯落盘接口，快速返回 204，不阻塞用户

import {
  str,
  num,
  isValidCode,
  isValidUuid,
  validateAnswers,
  checkRateLimit,
} from './_shared'

// 题目总数，需与前端题库保持一致
const EXPECTED_QUESTION_COUNT = 60

export async function onRequestPost(context: any) {
  const { DB } = context.env as { DB: D1Database }

  // --- 限流 ---
  const ip = context.request.headers.get('CF-Connecting-IP') || 'unknown'
  const allowed = await checkRateLimit(DB, ip, 10)
  if (!allowed) return new Response(null, { status: 429 })

  // --- 解析 payload ---
  let raw: any
  try {
    raw = await context.request.json()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  // 白名单提取字段
  const submissionId = str(raw.submissionId, 64)
  const appVersion = str(raw.appVersion, 16)
  const archetypeCode = str(raw.archetypeCode, 32)
  const characterCode = str(raw.characterCode, 32)
  const durationMs = num(raw.durationMs, 1000, 3600000) // 1s ~ 1h

  // 必填校验
  if (!submissionId || !appVersion || !archetypeCode || !characterCode) {
    return new Response('Missing required fields', { status: 400 })
  }
  if (!isValidUuid(submissionId)) {
    return new Response('Invalid submissionId', { status: 400 })
  }
  if (!isValidCode(archetypeCode) || !isValidCode(characterCode)) {
    return new Response('Invalid code format', { status: 400 })
  }
  // duration_ms < 3s 的请求几乎不可能是真人
  if (durationMs === null) {
    return new Response('Invalid durationMs', { status: 400 })
  }

  // 四维分数校验（0~100 范围）
  const ds = raw.dimensionScores
  const ei = num(ds?.ei, 0, 100)
  const sn = num(ds?.sn, 0, 100)
  const tf = num(ds?.tf, 0, 100)
  const jp = num(ds?.jp, 0, 100)
  if (ei === null || sn === null || tf === null || jp === null) {
    return new Response('Invalid dimensionScores', { status: 400 })
  }

  // answers 校验
  if (raw.answers !== undefined) {
    const validated = validateAnswers(raw.answers, EXPECTED_QUESTION_COUNT)
    if (validated === null) {
      return new Response('Invalid answers', { status: 400 })
    }
  }

  const now = new Date().toISOString()

  try {
    await DB.prepare(
      `INSERT OR IGNORE INTO submissions (id, created_at, app_version, archetype_code, character_code, ei_score, sn_score, tf_score, jp_score, duration_ms)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      submissionId,
      now,
      appVersion,
      archetypeCode,
      characterCode,
      ei,
      sn,
      tf,
      jp,
      durationMs,
    ).run()

    // 写入答题明细
    if (raw.answers !== undefined) {
      const validated = validateAnswers(raw.answers, EXPECTED_QUESTION_COUNT)
      if (validated && validated.length > 0) {
        const stmt = DB.prepare(
          `INSERT OR IGNORE INTO submission_answers (submission_id, question_id, answer_value)
           VALUES (?, ?, ?)`
        )
        const batch = validated.map((a) =>
          stmt.bind(submissionId, a.questionId, a.answerValue)
        )
        await DB.batch(batch)
      }
    }

    return new Response(null, { status: 204 })
  } catch (err) {
    console.error('Submit error:', err)
    // 依然返回 204，不暴露内部错误
    return new Response(null, { status: 204 })
  }
}
