import { Link } from 'react-router-dom';
import { PROGRAM, FOCAL_POINTS, FOCAL_POINT_LIST } from '../../config/series';
import { User, MessageCircle, CheckCircle2, Star } from 'lucide-react';

const FOCAL = FOCAL_POINTS.body;
const OTHER_FOCAL = FOCAL_POINT_LIST.filter(f => f.key !== FOCAL.key);

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


const HERO_META = [
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

export default function TheBodyPage() {

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#faf9f6', color: '#1e2b25', minHeight: '100vh' }}>

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
            One of three focal points explored across Phase 0, for those whose relationship with their physical self is where the deepest work lives.
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
        <div style={{
          marginTop: -28, position: 'relative', zIndex: 10,
          background: '#fff', borderRadius: 20,
          boxShadow: '0 4px 32px rgba(18,30,24,0.10)',
          overflow: 'hidden', marginBottom: 56,
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, padding: '40px 44px', alignItems: 'start' }}>
          <div>
            <p style={{ margin: '0 0 6px', fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6d8f7b', fontWeight: 600 }}>Focal point &middot; Phase 0</p>
            <h2 style={{ margin: '0 0 20px', fontSize: 30, fontWeight: 800, color: '#1e2b25' }}>The Body</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {['Intake assessment included', 'Personalized to your body', 'Phoenix Rising method'].map(f => (
                <span key={f} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 16, color: '#4a6b59' }}>
                  <CheckCircle2 size={17} style={{ color: '#6dab85', flexShrink: 0 }} /> {f}
                </span>
              ))}
            </div>
            <p style={{ margin: '0 0 22px', fontSize: 15, color: '#7d8a82', lineHeight: 1.55, maxWidth: '46ch' }}>This focal point is explored as part of Phase 0 — it is not booked separately. Pricing, structure, and enrolment all live on the program page.</p>
            <Link to={PROGRAM.path} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#2d3d35', color: '#fff', borderRadius: 11, padding: '14px 28px', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
              See {PROGRAM.name} &rarr;
            </Link>
          </div>

          <div style={{ borderLeft: '1px solid #e8e3db', paddingLeft: 36, minWidth: 220 }}>
            <p style={{ margin: '0 0 14px', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8fb09a', fontWeight: 600 }}>Also in {PROGRAM.name}</p>
            {OTHER_FOCAL.map(o => (
              <Link key={o.key} to={o.path} style={{ display: 'block', marginBottom: 16, textDecoration: 'none' }}>
                <p style={{ margin: '0 0 2px', fontSize: 16, fontWeight: 700, color: '#2d3d35' }}>{o.name} &rarr;</p>
                <p style={{ margin: 0, fontSize: 13, color: '#7d8a82' }}>{o.lens}</p>
              </Link>
            ))}
            <p style={{ margin: '20px 0 0', fontSize: 13, color: '#7d8a82', lineHeight: 1.5 }}>
              All three are explored across the same {PROGRAM.sessionCount} sessions.
            </p>
          </div>
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
          <p style={{ margin: '0 0 10px', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8fb09a', fontWeight: 600 }}>Within the program</p>
          <h2 style={{ margin: '0 0 24px', fontSize: 26, fontWeight: 800 }}>What this focal point explores</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {SESSIONS.map(s => (
              <div key={s.title} style={{ background: '#fff', border: '1.5px solid #e8e3db', borderRadius: 14, padding: '20px 22px', display: 'flex', gap: 16 }}>
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
            <p style={{ margin: 0, fontSize: 15, color: '#a8a89e', lineHeight: 1.5 }}>This focal point is one of three explored across Phase 0. Pricing and enrolment are on the program page.</p>
          </div>
          <div style={{ flexShrink: 0 }}>
            <Link
              to={PROGRAM.path}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#6dab85', color: '#fff', borderRadius: 11, padding: '15px 32px', fontSize: 17, fontWeight: 700, whiteSpace: 'nowrap', textDecoration: 'none' }}
            >
              See {PROGRAM.name} &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
