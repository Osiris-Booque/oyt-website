import { useState } from 'react';
import SeriesPurchaseModal from '../../components/checkout/SeriesPurchaseModal';
import { SERIES, priceLabel, perSessionLabel } from '../../config/series';
import { User, Clock, MessageCircle, CheckCircle2, Star } from 'lucide-react';

const SESSIONS = [
  { num: 1, title: 'Befriending the Body', desc: 'Spiritual and energetic identity is not separate from the body — it is expressed through it. This opening session grounds the soul work in somatic reality, developing interoceptive awareness and establishing a compassionate relationship with physical experience as the foundation for the deeper energetic work ahead.' },
  { num: 2, title: 'Befriending the Two Spirit', desc: 'Both sides of you are real. Both deserve space. Drawing on the Two-Spirit concept as a framework for exploring inner duality, this session guides you in recognizing, honoring, and integrating the opposites you carry. Research in psychosynthesis and Jungian somatic psychology supports the therapeutic value of engaging with inner dualities rather than suppressing them.' },
  { num: 3, title: 'Befriending the Feminine', desc: 'Your feminine energy is not a phase. It is a frequency. This session draws on somatic and depth psychology frameworks to guide you in reconnecting with feminine qualities — receptivity, intuition, cyclical awareness, self-compassion, and creative expression. These are universal therapeutic capacities present in all people.' },
  { num: 4, title: 'Befriending the Masculine', desc: 'Grounded presence is the most powerful thing you can offer. This session draws on somatic and depth psychology frameworks to guide you in reconnecting with masculine qualities — focus, clarity, assertive expression, and aligned action. The masculine here is not about dominance. It is about alignment.' },
];

const OUTCOMES = [
  'Recognition and embodied integration of inner dualities and energies',
  'Deeper somatic connection to feminine and masculine therapeutic capacities',
  'Greater parasympathetic nervous system regulation and capacity for rest',
  'Reduced internal conflict between contrasting energies or identities',
  'Embodied alignment between inner experience and outward expression',
];

const TESTIMONIALS = [
  { name: 'Dana M.', quote: 'After two years of back pain, this was the first thing that actually helped. Thoughtful, unhurried, completely adapted to my body.', stars: 5 },
  { name: 'Chris W.', quote: 'I came in skeptical. I left with a completely different relationship to how I move. The assessment alone was worth it.', stars: 5 },
  { name: 'Priya S.', quote: "Not like any yoga class I've taken before. This feels like working with someone who actually sees you.", stars: 5 },
];

const SERIES_CONFIG = SERIES.soul;
const SERIES_NAME = SERIES_CONFIG.name;
const SESSION_COUNT = SERIES_CONFIG.sessionCount;
const PRICE_LABEL = priceLabel(SERIES_CONFIG);
const PER_SESSION_LABEL = perSessionLabel(SERIES_CONFIG);

const HERO_META = [
  { Icon: Clock, text: '35 min sessions' },
  { Icon: User, text: '1:1 with your instructor' },
  { Icon: MessageCircle, text: 'Virtual via Zoom' },
];

function Stars({ count }: { count: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={13} style={{ fill: '#c9a84c', color: '#c9a84c' }} />
      ))}
    </div>
  );
}

export default function TheSoulPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#faf9f6', color: '#1e2b25', minHeight: '100vh' }}>
      {modalOpen && <SeriesPurchaseModal onClose={() => setModalOpen(false)} seriesName={SERIES_NAME} sessionCount={SESSION_COUNT} price={PRICE_LABEL} perSession={PER_SESSION_LABEL} />}

      <section style={{ position: 'relative', minHeight: 380, overflow: 'hidden' }}>
        <img
          src="https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=1920&h=700&fit=crop"
          alt="Yoga therapy session"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(18,30,24,0.82) 0%, rgba(18,30,24,0.5) 60%, rgba(18,30,24,0.7) 100%)' }} />
        <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto', padding: '56px 24px 48px' }}>
          <p style={{ margin: '0 0 12px', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#8fb09a', fontWeight: 600 }}>Private Sessions · Osiris Yoga Therapy</p>
          <h1 style={{ margin: '0 0 14px', fontSize: 'clamp(38px,6vw,64px)', fontWeight: 800, color: '#fff', lineHeight: 1.05, letterSpacing: '-0.02em' }}>The Soul</h1>
          <p style={{ margin: '0 0 28px', fontSize: 17, color: '#c5d9cc', maxWidth: 480, lineHeight: 1.6 }}>
            A 4-session yoga therapy series for people whose relationship with their energetic identity, inner dualities, and spiritual self is where the deepest work lives.
          </p>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {HERO_META.map(({ Icon, text }) => (
              <span key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#a8c4b2' }}>
                <Icon size={14} /> {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ marginTop: -28, position: 'relative', zIndex: 10, background: '#fff', borderRadius: 20, boxShadow: '0 4px 32px rgba(18,30,24,0.10)', overflow: 'hidden', marginBottom: 56, display: 'grid', gridTemplateColumns: '1fr auto' }}>
          <div style={{ padding: '40px 44px' }}>
            <p style={{ margin: '0 0 6px', fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6d8f7b', fontWeight: 600 }}>4-Session Series</p>
            <h2 style={{ margin: '0 0 20px', fontSize: 30, fontWeight: 800, color: '#1e2b25' }}>The Soul</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {['Intake assessment included', 'Personalized to your body', 'Phoenix Rising method'].map(f => (
                <span key={f} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 16, color: '#4a6b59' }}>
                  <CheckCircle2 size={17} style={{ color: '#6dab85', flexShrink: 0 }} /> {f}
                </span>
              ))}
            </div>
            <p style={{ margin: 0, fontSize: 15, color: '#7d8a82', lineHeight: 1.55, maxWidth: '46ch' }}>We&#39;ll contact you for intake and scheduling separately after purchasing this series.</p>
          </div>
          <div style={{ background: '#2d3d35', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 44px', minWidth: 280 }}>
            <p style={{ margin: '0 0 10px', fontSize: 52, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>{PRICE_LABEL}</p>
            <p style={{ margin: 0, fontSize: 15, color: '#8fb09a', fontWeight: 600, textAlign: 'center', lineHeight: 1.45 }}>One-time payment<br />No subscription</p>
            <div style={{ width: 56, height: 1, background: '#3d5a49', margin: '18px 0' }} />
            <p style={{ margin: 0, fontSize: 16, color: '#6dab85', fontWeight: 600 }}>only {PER_SESSION_LABEL} per session</p>
            <button
              onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setModalOpen(true); }}
              onMouseEnter={e => { e.currentTarget.style.color = '#1e2b25'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#fff'; }}
              style={{ marginTop: 24, width: '100%', background: '#6dab85', color: '#fff', border: 'none', borderRadius: 11, padding: '15px 32px', fontSize: 17, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'color 0.2s' }}
            >
              Start This Series
            </button>
          </div>
        </div>

        <div style={{ marginBottom: 56, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          <div>
            <p style={{ margin: '0 0 10px', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8fb09a', fontWeight: 600 }}>Why this practice</p>
            <h2 style={{ margin: '0 0 16px', fontSize: 26, fontWeight: 800, lineHeight: 1.15 }}>Why the soul?</h2>
            <p style={{ margin: '0 0 14px', fontSize: 15, color: '#4a5e52', lineHeight: 1.7 }}>
              This track is for people whose energetic identity, inner dualities, and spiritual self is where the deepest work lives. We move through the Two Spirit essence, the feminine, and the masculine — exploring how the energies you carry and the dualities within you shape how you inhabit your body and move through the world.
            </p>
            <p style={{ margin: '0 0 14px', fontSize: 15, color: '#4a5e52', lineHeight: 1.7 }}>
              Drawing from Phoenix Rising Yoga Therapy and research in interoception, these sessions develop the kind of self-awareness that changes how you move through every room, every relationship, every decision. Not by fixing what&#39;s wrong. By coming home to what&#39;s already there.
            </p>
            <p style={{ margin: 0, fontSize: 15, color: '#4a5e52', lineHeight: 1.7 }}>
              This is not a spiritual bypass. It is embodied soul work, grounded in yoga therapy principles and somatic psychology.
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
          <div style={{ flex: '1 1 320px', minWidth: 0 }}>
            <h3 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 800, color: '#fff' }}>Ready to begin?</h3>
            <p style={{ margin: 0, fontSize: 15, color: '#a8a89e', lineHeight: 1.5 }}>We&#39;ll contact you for intake and scheduling separately after purchasing this series.</p>
          </div>
          <div style={{ flexShrink: 0 }}>
            <button
              onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setModalOpen(true); }}
              onMouseEnter={e => { e.currentTarget.style.color = '#1e2b25'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#fff'; }}
              style={{ background: '#6dab85', color: '#fff', border: 'none', borderRadius: 11, padding: '15px 32px', fontSize: 17, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'color 0.2s' }}
            >
              Start This Series
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
