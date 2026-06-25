import { useState } from 'react';
import { User, Clock, MessageCircle, CheckCircle2, Star, X, Phone, Mail, MessageSquare } from 'lucide-react';

const SESSIONS = [
  { num: 1, title: 'Befriending the Body', desc: 'Establishes the neurological and somatic foundation. We move through the full arc of the yoga therapy framework — awareness, acceptance, choice, discernment, truth, and flow — as one integrated experience.' },
  { num: 2, title: 'Befriending the Strength', desc: 'Explores where strength lives in the body and how the nervous system holds or withholds it. Grounded in proprioception and the mind-body connection.' },
  { num: 3, title: 'Befriending the Balance', desc: 'Draws on vestibular processing and somatic stability research to guide you toward greater embodied equilibrium through acceptance rather than resistance.' },
  { num: 4, title: 'Befriending the Yin', desc: 'Parasympathetic nervous system activation and connective tissue release. Slow, intentional practice that down-regulates the stress response.' },
];

const OUTCOMES = [
  'Increased interoceptive awareness and connection to physical sensations',
  'Enhanced somatic resilience, stability, and embodied confidence',
  'Greater parasympathetic nervous system regulation and capacity for rest',
  'Integration of strength, balance, and ease into daily life and relationships',
];

const TESTIMONIALS = [
  { name: 'Dana M.', quote: 'After two years of back pain, this was the first thing that actually helped. Thoughtful, unhurried, completely adapted to my body.', stars: 5 },
  { name: 'Chris W.', quote: 'I came in skeptical. I left with a completely different relationship to how I move. The assessment alone was worth it.', stars: 5 },
  { name: 'Priya S.', quote: 'Not like any yoga class I\'ve taken before. This feels like working with someone who actually sees you.', stars: 5 },
];

const labelStyle = {
  display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
  textTransform: 'uppercase', color: '#7a7470', marginBottom: 5,
};

const inputStyle = {
  width: '100%', boxSizing: 'border-box', padding: '10px 12px',
  borderRadius: 9, border: '1.5px solid #d8d3cc', background: '#fff',
  fontSize: 14, color: '#1e2b25', outline: 'none',
};

const ctaStyle = {
  width: '100%', padding: '14px', background: '#2d3d35', color: '#fff',
  border: 'none', borderRadius: 11, fontSize: 15, fontWeight: 700,
  cursor: 'pointer', letterSpacing: '0.01em',
};

function Stars({ count }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={13} style={{ fill: '#c9a84c', color: '#c9a84c' }} />
      ))}
    </div>
  );
}

function Modal({ onClose, seriesName, sessionCount, price, perSession }) {
  const [step, setStep] = useState('form');
  const [contact, setContact] = useState([]);
  const [cardNum, setCardNum] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [processing, setProcessing] = useState(false);

  const toggleContact = (val) =>
    setContact(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => { setProcessing(false); setStep('success'); }, 1800);
  };

  const formatCard = (val) => val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (val) => {
    const d = val.replace(/\D/g, '').slice(0, 4);
    return d.length >= 3 ? d.slice(0, 2) + ' / ' + d.slice(2) : d;
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(15,20,18,0.72)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px',
    }}>
      <div style={{
        background: '#faf9f6', borderRadius: 20, width: '100%', maxWidth: 520,
        maxHeight: '92vh', overflowY: 'auto', position: 'relative',
        boxShadow: '0 32px 80px rgba(0,0,0,0.28)',
      }}>
        {step !== 'success' && (
          <button onClick={onClose} style={{
            position: 'absolute', top: 16, right: 16,
            background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%',
            width: 32, height: 32, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', zIndex: 1,
          }}>
            <X size={15} />
          </button>
        )}

        <div style={{ background: '#2d3d35', borderRadius: '20px 20px 0 0', padding: '24px 28px', color: '#fff' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8fb09a', margin: '0 0 6px' }}>
            Osiris Yoga Therapy
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 700, color: '#fff' }}>
                {seriesName} — {sessionCount}-Session Series
              </h3>
              <p style={{ margin: 0, fontSize: 13, color: '#a8c4b2' }}>
                {sessionCount} private sessions · 35 min each · Virtual via Zoom
              </p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 16 }}>
              <p style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>{price}</p>
              <p style={{ margin: 0, fontSize: 11, color: '#8fb09a' }}>{perSession} / session</p>
            </div>
          </div>
          {step === 'form' && (
            <div style={{ marginTop: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {['Intake assessment included', 'Personalized to your body', 'Cancel 48h in advance'].map(f => (
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
                <div key={label} onClick={() => done && setStep('form')} style={{
                  padding: '10px 0', marginRight: 24,
                  borderBottom: active ? '2px solid #2d3d35' : done ? '2px solid #6dab85' : '2px solid transparent',
                  fontSize: 12, fontWeight: active ? 700 : 500,
                  color: active ? '#2d3d35' : done ? '#6dab85' : '#a09a93',
                  cursor: done ? 'pointer' : 'default', userSelect: 'none',
                }}>
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
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Email</label>
                <input style={inputStyle} type="email" placeholder="jane@example.com" />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Phone</label>
                <input style={inputStyle} type="tel" placeholder="(555) 000-0000" />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ ...labelStyle, marginBottom: 8, display: 'block' }}>Preferred contact method</label>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {[
                    { val: 'phone', label: 'Phone call', icon: <Phone size={13} /> },
                    { val: 'text', label: 'Text message', icon: <MessageSquare size={13} /> },
                    { val: 'email', label: 'Email', icon: <Mail size={13} /> },
                  ].map(({ val, label, icon }) => {
                    const selected = contact.includes(val);
                    return (
                      <button key={val} onClick={() => toggleContact(val)} style={{
                        display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
                        borderRadius: 8, border: selected ? '1.5px solid #2d3d35' : '1.5px solid #d8d3cc',
                        background: selected ? '#eef4f0' : '#fff',
                        color: selected ? '#2d3d35' : '#7a7470',
                        fontSize: 13, fontWeight: selected ? 600 : 400, cursor: 'pointer',
                      }}>
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
                    <input
                      style={{ ...inputStyle, paddingRight: 44, fontFamily: 'monospace', letterSpacing: '0.08em' }}
                      placeholder="1234 5678 9012 3456"
                      value={cardNum}
                      onChange={e => setCardNum(formatCard(e.target.value))}
                    />
                    <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 18 }}>💳</span>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                  <div>
                    <label style={labelStyle}>Expiry</label>
                    <input style={{ ...inputStyle, fontFamily: 'monospace' }} placeholder="MM / YY" value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))} />
                  </div>
                  <div>
                    <label style={labelStyle}>CVC</label>
                    <input style={{ ...inputStyle, fontFamily: 'monospace' }} placeholder="•••" maxLength={4} value={cvc} onChange={e => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Name on card</label>
                  <input style={inputStyle} placeholder="Jane Smith" value={cardName} onChange={e => setCardName(e.target.value)} />
                </div>
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

export default function TheBodyPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#faf9f6', color: '#1e2b25', minHeight: '100vh' }}>
      {modalOpen && <Modal onClose={() => setModalOpen(false)} seriesName="The Body" sessionCount={4} price="$340" perSession="$85" />}

      <section style={{ position: 'relative', minHeight: 380, overflow: 'hidden' }}>
        <img
          src="https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=1920&h=700&fit=crop"
          alt="Yoga therapy session"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(18,30,24,0.82) 0%, rgba(18,30,24,0.5) 60%, rgba(18,30,24,0.7) 100%)' }} />
        <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto', padding: '56px 24px 48px' }}>
          <p style={{ margin: '0 0 12px', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#8fb09a', fontWeight: 600 }}>
            Private Sessions · Osiris Yoga Therapy
          </p>
          <h1 style={{ margin: '0 0 14px', fontSize: 'clamp(38px,6vw,64px)', fontWeight: 800, color: '#fff', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
            The Body
          </h1>
          <p style={{ margin: '0 0 28px', fontSize: 17, color: '#c5d9cc', maxWidth: 480, lineHeight: 1.6 }}>
            A 4-session yoga therapy series for people whose relationship with their physical self is where the deepest work lives.
          </p>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[[Clock, '35 min sessions'], [User, '1:1 with your instructor'], [MessageCircle, 'Virtual via Zoom']].map(([Icon, text]) => (
              <span key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#a8c4b2' }}>
                <Icon size={14} /> {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{
          marginTop: -28, position: 'relative', zIndex: 10,
          background: '#fff', borderRadius: 20,
          boxShadow: '0 4px 32px rgba(18,30,24,0.10)',
          overflow: 'hidden', marginBottom: 56,
          display: 'grid', gridTemplateColumns: '1fr auto',
        }}>
          <div style={{ padding: '28px 32px' }}>
            <p style={{ margin: '0 0 4px', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8fb09a', fontWeight: 600 }}>4-Session Series</p>
            <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 800, color: '#1e2b25' }}>The Body</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
              {['Intake assessment included', 'Personalized to your body', 'Cancel 48h in advance', 'Phoenix Rising method'].map(f => (
                <span key={f} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#5a7a6a' }}>
                  <CheckCircle2 size={13} style={{ color: '#6dab85' }} /> {f}
                </span>
              ))}
            </div>
            <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setModalOpen(true)}} style={{ background: '#2d3d35', color: '#fff', border: 'none', borderRadius: 11, padding: '13px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
              Reserve your series
            </button>
            <p style={{ margin: '10px 0 0', fontSize: 12, color: '#a09a93' }}>You&#39;ll complete intake and scheduling after booking.</p>
          </div>
          <div style={{ background: '#2d3d35', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '28px 36px', minWidth: 160 }}>
            <p style={{ margin: '0 0 4px', fontSize: 36, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>$340</p>
            <p style={{ margin: '0 0 8px', fontSize: 13, color: '#8fb09a' }}>total · $85 per session</p>
            <div style={{ width: 40, height: 1, background: '#3d5a49', margin: '8px 0' }} />
            <p style={{ margin: 0, fontSize: 11, color: '#6dab85', fontWeight: 600, textAlign: 'center', lineHeight: 1.4 }}>One-time payment<br />No subscription</p>
          </div>
        </div>

        <div style={{ marginBottom: 56, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          <div>
            <p style={{ margin: '0 0 10px', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8fb09a', fontWeight: 600 }}>Why this practice</p>
            <h2 style={{ margin: '0 0 16px', fontSize: 26, fontWeight: 800, lineHeight: 1.15 }}>Why the body?</h2>
            <p style={{ margin: '0 0 14px', fontSize: 15, color: '#4a5e52', lineHeight: 1.7 }}>
              The body keeps the score — and it has been keeping score for a long time. Tension that lives in the shoulders. A breath that never fully lands. A nervous system perpetually braced for what might come next. These aren&#39;t character flaws. They are intelligent adaptations. And they deserve more than a stretch class.
            </p>
            <p style={{ margin: '0 0 14px', fontSize: 15, color: '#4a5e52', lineHeight: 1.7 }}>
              Drawing from Phoenix Rising Yoga Therapy and research in interoception — the brain&#39;s capacity to sense internal body states — these sessions develop the kind of self-awareness that changes how you move through every room, every relationship, every decision. Not by fixing what&#39;s wrong. By coming home to what&#39;s already there.
            </p>
            <p style={{ margin: 0, fontSize: 15, color: '#4a5e52', lineHeight: 1.7 }}>
              This is not a fitness or movement program. It is a yoga therapy practice grounded in somatic neuroscience and the therapeutic principles of Phoenix Rising Yoga Therapy.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ margin: '0 0 10px', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8fb09a', fontWeight: 600 }}>What you&#39;ll gain</p>
            {OUTCOMES.map(o => (
              <div key={o} style={{ background: '#fff', border: '1.5px solid #e8e3db', borderRadius: 12, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <CheckCircle2 size={16} style={{ color: '#6dab85', marginTop: 1, flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: 14, color: '#3a4e42', lineHeight: 1.5 }}>{o}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 56 }}>
          <p style={{ margin: '0 0 10px', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8fb09a', fontWeight: 600 }}>What&#39;s included</p>
          <h2 style={{ margin: '0 0 24px', fontSize: 26, fontWeight: 800 }}>Your four sessions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {SESSIONS.map(s => (
              <div key={s.title} style={{ background: '#fff', border: '1.5px solid #e8e3db', borderRadius: 14, padding: '20px 22px', display: 'flex', gap: 16 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#eef4f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#2d3d35', flexShrink: 0 }}>
                  {s.num}
                </div>
                <div>
                  <p style={{ margin: '0 0 5px', fontSize: 15, fontWeight: 700, color: '#1e2b25' }}>{s.title}</p>
                  <p style={{ margin: 0, fontSize: 13, color: '#5a7a6a', lineHeight: 1.55 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 56 }}>
          <p style={{ margin: '0 0 10px', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8fb09a', fontWeight: 600 }}>Client experiences</p>
          <h2 style={{ margin: '0 0 24px', fontSize: 26, fontWeight: 800 }}>What clients say</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} style={{ background: '#fff', border: '1.5px solid #e8e3db', borderRadius: 14, padding: '20px' }}>
                <Stars count={t.stars} />
                <p style={{ margin: '12px 0 16px', fontSize: 14, color: '#4a5e52', lineHeight: 1.6 }}>&#8220;{t.quote}&#8221;</p>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: '#1e2b25' }}>{t.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#2d3d35', borderRadius: 20, padding: '40px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 800, color: '#fff' }}>Ready to begin?</h3>
            <p style={{ margin: 0, fontSize: 15, color: '#a8a89e', lineHeight: 1.5 }}>Reserve your series today. Scheduling and intake happen after you book.</p>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{ margin: '0 0 2px', fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>$340</p>
            <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setModalOpen(true)}} style={{ marginTop: 10, background: '#a8d4b4', color: '#1e2b25', border: 'none', borderRadius: 11, padding: '13px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Reserve your series
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
