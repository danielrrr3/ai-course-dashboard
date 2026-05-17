'use client'

import { useActionState, useCallback, useEffect, useState } from 'react'
import { addSale, type SaleFormState } from '../actions/sales'

const STATUSES        = ['Completed', 'Processing', 'Returned', 'Shipped']
const PAYMENT_METHODS = ['Bank Transfer', 'Cash', 'Credit Card']
const CATEGORIES      = ['Clothing', 'Electronics', 'Food & Beverage', 'Home & Garden', 'Services']

const inputBase: React.CSSProperties = {
  width: '100%',
  padding: '10px 13px',
  fontFamily: 'var(--font-sans)',
  fontSize: '14px',
  color: 'var(--text-hi)',
  background: 'rgba(255,255,255,0.75)',
  border: '1.5px solid var(--border)',
  borderRadius: '10px',
  outline: 'none',
  transition: 'border-color 0.15s',
}

const lbl: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-sans)',
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--text-lo)',
  marginBottom: '6px',
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null
  return (
    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'var(--red)', margin: '5px 0 0' }}>
      {msg}
    </p>
  )
}

function Required() {
  return <span style={{ color: 'var(--accent)' }}> *</span>
}

// ── Outer wrapper manages success/reset state ────────────────────────────────

export default function AddSaleForm() {
  const [formKey, setFormKey]   = useState(0)
  const [done, setDone]         = useState(false)

  const handleSuccess = useCallback(() => setDone(true), [])
  const handleReset   = () => { setDone(false); setFormKey(k => k + 1) }

  if (done) {
    return (
      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'rgba(46,125,82,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <circle cx="13" cy="13" r="11" stroke="var(--green)" strokeWidth="1.5"/>
            <path d="M8.5 13.5l3.5 3.5 6.5-7" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 style={{
          fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 400,
          color: 'var(--text-hi)', margin: '0 0 10px',
        }}>
          Entry saved
        </h2>
        <p style={{
          fontFamily: 'var(--font-sans)', fontSize: 14,
          color: 'var(--text-mid)', margin: '0 0 28px',
        }}>
          The sale was added to the database successfully.
        </p>
        <button
          onClick={handleReset}
          style={{
            fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600,
            color: '#FFF8F0', background: 'var(--accent)',
            border: 'none', borderRadius: 10, padding: '11px 24px',
            cursor: 'pointer',
          }}
        >
          Add another entry
        </button>
      </div>
    )
  }

  return <SaleForm key={formKey} onSuccess={handleSuccess} />
}

// ── Inner form with server action ────────────────────────────────────────────

function SaleForm({ onSuccess }: { onSuccess: () => void }) {
  const [state, formAction, isPending] = useActionState(addSale, {} as SaleFormState)

  useEffect(() => {
    if (state.success) onSuccess()
  }, [state.success, onSuccess])

  const e = (f: 'date' | 'amount_sar' | 'status' | 'general') => state.errors?.[f]

  const borderFor = (f: 'date' | 'amount_sar' | 'status') =>
    e(f) ? { ...inputBase, border: '1.5px solid var(--red)' } : inputBase

  return (
    <form action={formAction}>

      {/* General / database error */}
      {e('general') && (
        <div style={{
          background: 'rgba(184,50,50,0.07)',
          border: '1px solid rgba(184,50,50,0.2)',
          borderRadius: 10,
          padding: '12px 16px',
          marginBottom: 20,
          fontFamily: 'var(--font-sans)',
          fontSize: 13,
          color: 'var(--red)',
        }}>
          {e('general')}
        </div>
      )}

      {/* Row: Date + Amount */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <label style={lbl} htmlFor="date">Date<Required /></label>
          <input
            id="date" name="date" type="date" required
            defaultValue={new Date().toISOString().split('T')[0]}
            style={borderFor('date')}
          />
          <FieldError msg={e('date')} />
        </div>
        <div>
          <label style={lbl} htmlFor="amount_sar">Amount (SAR)<Required /></label>
          <input
            id="amount_sar" name="amount_sar" type="number"
            step="0.01" min="0.01" placeholder="0.00"
            style={borderFor('amount_sar')}
          />
          <FieldError msg={e('amount_sar')} />
        </div>
      </div>

      {/* Status */}
      <div style={{ marginBottom: 16 }}>
        <label style={lbl} htmlFor="status">Status<Required /></label>
        <select id="status" name="status" defaultValue="" style={borderFor('status')}>
          <option value="" disabled>Select status…</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <FieldError msg={e('status')} />
      </div>

      {/* Row: Customer + Product */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <label style={lbl} htmlFor="customer_name">Customer Name</label>
          <input
            id="customer_name" name="customer_name" type="text"
            placeholder="e.g. Ahmed Al-Rashid"
            style={inputBase}
          />
        </div>
        <div>
          <label style={lbl} htmlFor="product">Product</label>
          <input
            id="product" name="product" type="text"
            placeholder="e.g. Espresso Machine"
            style={inputBase}
          />
        </div>
      </div>

      {/* Row: Category + Payment */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <label style={lbl} htmlFor="category">Category</label>
          <select id="category" name="category" defaultValue="" style={inputBase}>
            <option value="">Select category…</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={lbl} htmlFor="payment_method">Payment Method</label>
          <select id="payment_method" name="payment_method" defaultValue="" style={inputBase}>
            <option value="">Select payment…</option>
            {PAYMENT_METHODS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {/* Notes */}
      <div style={{ marginBottom: 28 }}>
        <label style={lbl} htmlFor="notes">Notes</label>
        <textarea
          id="notes" name="notes" rows={3}
          placeholder="Any additional notes…"
          style={{ ...inputBase, resize: 'vertical' }}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        style={{
          width: '100%',
          fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600,
          color: '#FFF8F0',
          background: isPending ? 'rgba(196,83,42,0.55)' : 'var(--accent)',
          border: 'none', borderRadius: 12,
          padding: '13px 28px',
          cursor: isPending ? 'not-allowed' : 'pointer',
          transition: 'background 0.15s',
        }}
      >
        {isPending ? 'Saving…' : 'Save entry'}
      </button>
    </form>
  )
}
