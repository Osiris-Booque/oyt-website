import { useState } from 'react';
import type { CSSProperties } from 'react';
import { CheckCircle2, X, Phone, Mail, MessageSquare } from 'lucide-react';

const labelStyle: CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
  textTransform: 'uppercase', color: '#7a7470', marginBottom: 5,
};

const inputStyle: CSSProperties = {
  width: '100%', boxSizing: 'border-box', padding: '10px 12px',
  borderRadius: 9, border: '1.5px solid #d8d3cc', background: '#fff',
  fontSize: 14, color: '#1e2b25', outline: 'none',
};

const ctaStyle: CSSProperties = {
  width: '100%', padding: '14px', background: '#6b9e7e', color: '#fff',
  border: 'none', borderRadius: 11, fontSize: 15, fontWeight: 700,
  cursor: 'pointer', letterSpacing: '0.01em',
};

type ModalProps = {
  onClose: () => void;
  seriesName: string;
  sessionCount: number;
  price: string;
  perSession: string;
};

export default function SeriesPurchaseModal({ onClose, seriesName, sessionCount, price, perSession }: ModalProps) {
  const [step, setStep] = useState('form');
  const [contact, setContact] = useState<string[]>([]);
  const [cardNum, setCardNum] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [processing, setProcessing] = useState(false);

  const toggleContact = (val: string) =>
    setContact(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => { setProcessing(false); setStep('success'); }, 1800);
  };

  const formatCard = (val: string) => val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (val: string) => {
    const d = val.replace(/\D/g, '').slice(0, 4);
    return d.length >= 3 ? d.slice(0, 2) + ' / ' + d.slice(2) : d;
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15,20,18,0.72)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ background: '#faf9f6', borderRadius: 20, width: '100%', maxWidth: 520, maxHeight: '92vh', overflowY: 'auto', position: 'relative', boxShadow: '0 32px 80px rgba(0,0,0,0.28)' }}>
        {step !== 'success' && (
          <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', zIndex: 1 }}>
            <X size={15} />
          </button>
        )}

        <div style={{ background: '#2d3d35', borderRadius: '20px 20px 0 0', padding: '24px 28px', color: '#fff' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8fb09a', margin: '0 0 6px' }}>Osiris Yoga Therapy</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 700, color: '#fff' }}>{seriesName} — {sessionCount}-Session Series</h3>
              <p style={{ margin: 0, fontSize: 13, color: '#a8c4b2' }}>{sessionCount} private sessions · 35 min each · Virtual via Zoom</p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 16 }}>
              <p style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>{price}</p>
              <p style={{ margin: 0, fontSize: 11, color: '#8fb09a' }}>{perSession} / session</p>
            </div>
          </div>
          {step === 'form' && (
            <div style={{ marginTop: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {['Intake assessment included', 'Personalized to your body'].map(f => (
                <span key={f} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#a8c4b2' }}>
                  <CheckCircle2 size={12} style={{ color: '#6dab85' }} /> {f}
                </span>
              ))}
            </div>
          )}
        </div>

        {step !== 'success' && (
          <div style={{ display: 'flex', padding: '0 28px', background: '#f1ede7' }}>
            {['Your info', 'Payment'].map((label, i) => {
              const active = (i === 0 && step === 'form') || (i === 1 && step === 'payment');
              const done = i === 0 && step === 'payment';
              return (
                <div key={label} onClick={() => done && setStep('form')} style={{ padding: '10px 0', marginRight: 24, borderBottom: active ? '2px solid #2d3d35' : done ? '2px solid #6dab85' : '2px solid transparent', fontSize: 12, fontWeight: active ? 700 : 500, color: active ? '#2d3d35' : done ? '#6dab85' : '#a09a93', cursor: done ? 'pointer' : 'default', userSelect: 'none' }}>
                  {label}
                </div>
              );
            })}
          </div>
        )}

        <div style={{ padding: '24px 28px' }}>
          {step === 'form' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div><label style={labelStyle}>First name</label><input style={inputStyle} placeholder="Jane" /></div>
                <div><label style={labelStyle}>Last name</label><input style={inputStyle} placeholder="Smith" /></div>
              </div>
              <div style={{ marginBottom: 12 }}><label style={labelStyle}>Email</label><input style={inputStyle} type="email" placeholder="jane@example.com" /></div>
              <div style={{ marginBottom: 20 }}><label style={labelStyle}>Phone</label><input style={inputStyle} type="tel" placeholder="(555) 000-0000" /></div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ ...labelStyle, marginBottom: 8, display: 'block' }}>Preferred contact method</label>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {[{ val: 'phone', label: 'Phone call', icon: <Phone size={13} /> }, { val: 'text', label: 'Text message', icon: <MessageSquare size={13} /> }, { val: 'email', label: 'Email', icon: <Mail size={13} /> }].map(({ val, label, icon }) => {
                    const selected = contact.includes(val);
                    return (
                      <button key={val} onClick={() => toggleContact(val)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: selected ? '1.5px solid #2d3d35' : '1.5px solid #d8d3cc', background: selected ? '#eef4f0' : '#fff', color: selected ? '#2d3d35' : '#7a7470', fontSize: 13, fontWeight: selected ? 600 : 400, cursor: 'pointer' }}>
                        {icon} {label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <button onClick={() => setStep('payment')} style={ctaStyle}>Continue to payment</button>
            </div>
          )}

          {step === 'payment' && (
            <div>
              <div style={{ background: '#fff', border: '1.5px solid #e2ddd7', borderRadius: 12, padding: '20px', marginBottom: 20 }}>
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>Card number</label>
                  <div style={{ position: 'relative' }}>
                    <input style={{ ...inputStyle, paddingRight: 44, fontFamily: 'monospace', letterSpacing: '0.08em' }} placeholder="1234 5678 9012 3456" value={cardNum} onChange={e => setCardNum(formatCard(e.target.value))} />
                    <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 18 }}>💳</span>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                  <div><label style={labelStyle}>Expiry</label><input style={{ ...inputStyle, fontFamily: 'monospace' }} placeholder="MM / YY" value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))} /></div>
                  <div><label style={labelStyle}>CVC</label><input style={{ ...inputStyle, fontFamily: 'monospace' }} placeholder="•••" maxLength={4} value={cvc} onChange={e => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))} /></div>
                </div>
                <div><label style={labelStyle}>Name on card</label><input style={inputStyle} placeholder="Jane Smith" value={cardName} onChange={e => setCardName(e.target.value)} /></div>
              </div>
              <div style={{ background: '#f5f3ef', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                <span style={{ color: '#5a5650' }}>{seriesName} — {sessionCount}-Session Series</span>
                <span style={{ fontWeight: 700, color: '#2d3d35', fontSize: 15 }}>{price}</span>
              </div>
              <button onClick={handlePay} disabled={processing} style={{ ...ctaStyle, background: processing ? '#8fb09a' : '#2d3d35', cursor: processing ? 'default' : 'pointer' }}>
                {processing ? 'Processing…' : `Pay ${price}`}
              </button>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 14 }}>
                <svg width="12" height="14" viewBox="0 0 12 14" fill="none"><rect x="1" y="5" width="10" height="8" rx="1.5" stroke="#a09a93" strokeWidth="1.2"/><path d="M3.5 5V3.5a2.5 2.5 0 015 0V5" stroke="#a09a93" strokeWidth="1.2"/></svg>
                <span style={{ fontSize: 11, color: '#a09a93' }}>Secured by Stripe · 256-bit encryption</span>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#eef4f0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <CheckCircle2 size={32} style={{ color: '#3d8a5c' }} />
              </div>
              <p style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8fb09a', margin: '0 0 8px', fontWeight: 600 }}>SUCCESS</p>
              <h3 style={{ margin: '0 0 12px', fontSize: 22, fontWeight: 800, color: '#1e2b25', lineHeight: 1.2 }}>Your reservation is confirmed.</h3>
              <p style={{ margin: '0 0 20px', fontSize: 14, color: '#5a5650', lineHeight: 1.6 }}>
                Your reservation confirmation has been sent to you via email. We will reach out to you with instructions for the next step within three business days.
              </p>
              <div style={{ background: '#f1ede7', borderRadius: 12, padding: '16px', textAlign: 'left', marginBottom: 24 }}>
                <p style={{ margin: '0 0 6px', fontWeight: 700, fontSize: 13, color: '#2d3d35' }}>{seriesName} — {sessionCount}-Session Series</p>
                <p style={{ margin: 0, fontSize: 12, color: '#7a7470' }}>{sessionCount} private sessions · 35 min each · Virtual via Zoom</p>
              </div>
              <button onClick={onClose} style={{ ...ctaStyle, background: '#f1ede7', color: '#2d3d35' }}>Close</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

