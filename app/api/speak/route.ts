import { NextRequest } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()

    if (!text) {
      return new Response(JSON.stringify({ error: 'text is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'nova',
      input: text,
    })

    return new Response(mp3.body, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Transfer-Encoding': 'chunked',
      },
    })
  } catch (err) {
    console.error('TTS error:', err)
    return new Response(JSON.stringify({ error: 'Speech synthesis failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
