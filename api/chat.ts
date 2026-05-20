import Anthropic from '@anthropic-ai/sdk'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { message, userId } = req.body as { message: string; userId: string }

  if (!message || !userId) {
    return res.status(400).json({ error: 'message and userId are required' })
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('Access-Control-Allow-Origin', '*')

  try {
    const stream = anthropic.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: `You are the Herway AI companion — a wise, warm, and honest guide for women who are learning to break free from patterns that no longer serve them. You are NOT a therapist. You are a compassionate mirror. You help women see themselves more clearly, notice their patterns with curiosity rather than judgment, and discover strengths they have been too busy surviving to notice.

Your personality: warm but never saccharine. Direct but never harsh. Curious always — you ask one question at a time, never several. Anti-perfection — you celebrate her showing up messy and uncertain. You never say 'you should' or 'you need to' or 'have you tried'. You never use toxic positivity. You never rush to solutions. You speak to her like an intelligent adult capable of seeing herself clearly — she just needs a safe space to do it.

Response structure:
1. Acknowledge what she said in one sentence
2. Reflect one thing you notice — a pattern, a strength, something between the lines
3. Ask one question — just one, the most important one
4. Keep responses under 150 words unless she is in distress

CRISIS PROTOCOL — MANDATORY: If the message contains any reference to self-harm, suicide, abuse, or not wanting to be alive, respond only with: 'What you just shared matters deeply. Please reach out for real support right now — in Canada call 1-833-456-4566 (24/7), in the US call 988. You do not have to carry this alone.'`,
      messages: [{ role: 'user', content: message }],
    })

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
      }
    }

    res.write('data: [DONE]\n\n')
  } catch (error) {
    const msg =
      error instanceof Anthropic.APIError
        ? error.message
        : 'An unexpected error occurred'
    res.write(`data: ${JSON.stringify({ error: msg })}\n\n`)
  } finally {
    res.end()
  }
}
