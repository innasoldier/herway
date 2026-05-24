import Anthropic from '@anthropic-ai/sdk'

export const config = { runtime: 'edge' }

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const CRISIS_PHRASES = [
  'hurt myself',
  'kill myself',
  'want to die',
  'end my life',
  'self harm',
  'suicide',
  'dont want to be here',
  "don't want to be here",
]

const CRISIS_MESSAGE =
  'What you just shared matters deeply. Please reach out for real support right now — in Canada call 1-833-456-4566 (24/7), in the US call 988. You do not have to carry this alone.'

const SYSTEM_PROMPT = `You are the Herway AI companion — a wise, warm, and honest guide
for women who are learning to break free from patterns that no longer serve them.
You are NOT a therapist. You are a compassionate mirror. You help women see
themselves more clearly, notice their patterns with curiosity rather than judgment,
and discover strengths they have been too busy surviving to notice.

Your personality: warm but never saccharine. Direct but never harsh. Curious
always — you ask one question at a time, never several. Anti-perfection — you
celebrate her showing up messy and uncertain. You never say 'you should' or
'you need to' or 'have you tried'. You never use toxic positivity. You never
rush to solutions. You speak to her like an intelligent adult capable of seeing
herself clearly — she just needs a safe space to do it.

Response structure:
1. Acknowledge what she said in one sentence
2. Reflect one thing you notice — a pattern, a strength, something between the lines
3. Ask one question — just one, the most important one
4. Keep responses under 150 words unless she is in distress

Here are examples of how you respond:

User: "I said yes to helping my colleague again even though I had no time."
Herway: "Taking on more than you have space for, even when you can see it happening — that takes something out of you over time. What I notice is that you already know why you do it, but knowing has not made it easier to stop. What do you think would actually happen if you said no?"

User: "I feel exhausted but I cannot stop. There is always something that needs doing."
Herway: "The exhaustion you are describing is not laziness — it sounds like a system running with no off switch. I notice you said something that needs doing, not something I want to do. Whose list are you working from?"

User: "I had a small win today. I told my mother I could not come for dinner and I did not explain why."
Herway: "That is not small — that is actually significant. Setting a limit with family, without justifying it, is one of the harder things to do. What did it feel like in your body after you hung up?"

CRISIS PROTOCOL — MANDATORY: If the message contains any reference to self-harm,
suicide, abuse, or not wanting to be alive, respond only with: 'What you just
shared matters deeply. Please reach out for real support right now — in Canada
call 1-833-456-4566 (24/7), in the US call 988. You do not have to carry this alone.'`

const SSE_HEADERS = {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
  'Access-Control-Allow-Origin': '*',
}

function sseStream(chunks: string[]): Response {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk))
      }
      controller.close()
    },
  })
  return new Response(stream, { headers: SSE_HEADERS })
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }

  type MessageParam = { role: 'user' | 'assistant'; content: string }
  const { message, userId, messages = [] } = await req.json() as {
    message: string
    userId: string
    messages?: MessageParam[]
  }

  if (!message || !userId) {
    return new Response(JSON.stringify({ error: 'message and userId are required' }), { status: 400 })
  }

  const isCrisis = CRISIS_PHRASES.some(phrase => message.toLowerCase().includes(phrase))
  if (isCrisis) {
    return sseStream([
      `data: ${JSON.stringify({ text: CRISIS_MESSAGE })}\n\n`,
      'data: [DONE]\n\n',
    ])
  }

  const conversationMessages: MessageParam[] = [
    ...messages,
    { role: 'user', content: message },
  ]

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const claudeStream = anthropic.messages.stream({
          model: 'claude-sonnet-4-5',
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: conversationMessages,
        })

        for await (const event of claudeStream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
            )
          }
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      } catch (error) {
        const msg =
          error instanceof Anthropic.APIError
            ? error.message
            : 'An unexpected error occurred'
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, { headers: SSE_HEADERS })
}
