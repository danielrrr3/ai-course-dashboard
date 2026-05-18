import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const SYSTEM_PROMPT = `You are a business analyst for Noor Trading Co., a Saudi retail company. Answer using ONLY the Supabase data provided below the user's question.

Tables you will receive (as JSON):
 • sales — id, date, customer_id, product_id, amount_sar, status
 • customers — id, name, city, loyalty_tier, total_spent_sar
 • products — id, name, category, price_sar, cost_sar, stock_qty
 • expenses — id, date, category, amount_sar
 • inventory — product_id, qty_on_hand, reorder_at
 • feedback — id, customer_id, rating, comment

All amounts in SAR. If a question is ambiguous, ask ONE short clarifying question. Keep answers 2-4 sentences unless asked for a longer report.`

type Role = 'user' | 'assistant'
interface HistoryMessage { role: Role; content: string }

export async function POST(req: NextRequest) {
  try {
    const { question, data, history = [], language } = await req.json() as {
      question: string
      data?: unknown
      history?: HistoryMessage[]
      language?: string
    }

    if (!question) {
      return NextResponse.json({ error: 'question is required' }, { status: 400 })
    }

    const userContent = data
      ? `${question}\n\nDATA:\n${JSON.stringify(data)}`
      : question

    const systemPrompt = language === 'ar' ? SYSTEM_PROMPT + '\nRespond in Arabic.' : SYSTEM_PROMPT

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...history,
        { role: 'user', content: userContent },
      ],
    })

    const answer = completion.choices[0]?.message?.content ?? ''
    return NextResponse.json({ answer })
  } catch (err) {
    console.error('OpenAI error:', err)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
