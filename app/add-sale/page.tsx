import AddSaleForm from '../components/AddSaleForm'

export default function AddSalePage() {
  return (
    <div style={{ position: 'relative', zIndex: 1 }}>

      {/* Hero banner */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '44px 52px 48px',
        background: 'linear-gradient(160deg, #E8906A 0%, #D4785A 20%, #C4A07A 45%, #A89090 65%, #C8B090 80%, #E0C898 100%)',
      }}>
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%',
          background: 'linear-gradient(180deg, transparent 0%, rgba(247,238,228,0.6) 60%, var(--bg) 100%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '-40px', right: '-40px',
          width: '280px', height: '280px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,220,190,0.5) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.75)', marginBottom: '10px',
          }}>Sales</p>
          <h1 style={{
            fontFamily: 'var(--font-serif)', fontSize: '38px', fontWeight: 400,
            color: '#FFF8F0', margin: '0 0 10px', letterSpacing: '-0.02em',
            lineHeight: 1.1, textShadow: '0 1px 12px rgba(120,50,20,0.25)',
          }}>New Entry</h1>
          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: '14px',
            color: 'rgba(255,248,240,0.8)', margin: 0, fontWeight: 400,
          }}>
            Record a new sale transaction in the database
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '32px 52px 44px' }}>
        <div style={{
          background: 'rgba(255,252,247,0.8)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '32px 36px',
          boxShadow: '0 2px 8px rgba(140,70,30,0.06), 0 8px 24px rgba(140,70,30,0.04)',
          maxWidth: '620px',
        }}>
          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'var(--text-lo)', margin: '0 0 24px',
          }}>Sale Details</p>
          <AddSaleForm />
        </div>
      </div>

    </div>
  )
}
