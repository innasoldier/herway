export const config = { runtime: 'edge' }

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }

  try {
    const { userId } = await req.json() as { userId: string }

    if (!userId) {
      return new Response(JSON.stringify({ error: 'userId is required' }), { status: 400 })
    }

    const answersRes = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/assessment_answers?user_id=eq.${userId}&select=*`,
      {
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!answersRes.ok) {
      const err = await answersRes.text()
      return new Response(JSON.stringify({ error: `Failed to fetch answers: ${err}` }), { status: 502 })
    }

    const answers: any[] = await answersRes.json()

    if (answers.length === 0) {
      return new Response(JSON.stringify({ error: 'No assessment answers found for this user' }), { status: 404 })
    }

    const formattedAnswers = answers
      .map((a: any) => `${a.question_id} (${a.pillar}): ${a.answer}`)
      .join('\n\n')

    const aiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY ?? '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 600,
        system:
          'You are Herway. Generate a warm honest profile summary for this woman based on her assessment answers. Structure it with exactly these three headers on their own lines: YOUR STRENGTHS — YOUR GROWTH EDGES — A QUESTION FOR YOU. Under each header write 2-3 sentences. Name strengths specifically using evidence from her answers. Frame growth edges compassionately — not flaws, growing edges. The question should unlock something she has not yet seen. Under 250 words total. Write directly to her using "you".',
        messages: [
          {
            role: 'user',
            content: `Here are my assessment answers:\n\n${formattedAnswers}`,
          },
        ],
      }),
    })

    if (!aiRes.ok) {
      const err = await aiRes.text()
      return new Response(JSON.stringify({ error: `AI request failed: ${err}` }), { status: 502 })
    }

    const aiData = await aiRes.json()
    const summary: string = aiData.content?.[0]?.text ?? ''

    await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ ai_profile_summary: summary }),
      }
    )

    return new Response(JSON.stringify({ summary }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred'
    return new Response(JSON.stringify({ error: message }), { status: 500 })
  }
}
