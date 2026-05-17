'use server'

import { supabase } from '../../lib/supabase'

export type SaleFormState = {
  success?: boolean
  errors?: Partial<Record<'date' | 'amount_sar' | 'status' | 'general', string>>
}

const VALID_STATUSES = new Set(['Completed', 'Processing', 'Returned', 'Shipped'])

export async function addSale(_prev: SaleFormState, formData: FormData): Promise<SaleFormState> {
  const date        = (formData.get('date')           as string | null)?.trim() ?? ''
  const customerName= (formData.get('customer_name')  as string | null)?.trim() || null
  const product     = (formData.get('product')        as string | null)?.trim() || null
  const category    = (formData.get('category')       as string | null)?.trim() || null
  const amountStr   = (formData.get('amount_sar')     as string | null)?.trim() ?? ''
  const status      = (formData.get('status')         as string | null)?.trim() ?? ''
  const paymentMethod = (formData.get('payment_method') as string | null)?.trim() || null
  const notes       = (formData.get('notes')          as string | null)?.trim() || null

  const errors: SaleFormState['errors'] = {}

  if (!date) {
    errors.date = 'Date is required'
  } else if (isNaN(Date.parse(date))) {
    errors.date = 'Enter a valid date'
  }

  const amount = Number(amountStr)
  if (!amountStr) {
    errors.amount_sar = 'Amount is required'
  } else if (isNaN(amount) || amount <= 0) {
    errors.amount_sar = 'Amount must be a positive number'
  }

  if (!status) {
    errors.status = 'Status is required'
  } else if (!VALID_STATUSES.has(status)) {
    errors.status = 'Select a valid status'
  }

  if (Object.keys(errors).length > 0) return { errors }

  const { error } = await supabase.from('sales').insert({
    date,
    customer_name: customerName,
    product,
    category,
    amount_sar: amount,
    status,
    payment_method: paymentMethod,
    notes,
  })

  if (error) return { errors: { general: `Database error: ${error.message}` } }

  return { success: true }
}
