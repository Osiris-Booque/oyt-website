import type { CSSProperties } from 'react';
import { Clock, User, MessageCircle, CheckCircle2 } from 'lucide-react';

export type TeamProgram = {
  /** Uppercase label above the consult card, e.g. "GOVERNMENT ENGAGEMENT" */
  engagementLabel: string;
  title: string;
  intro: string;
  heroImage: string;
  heroMeta: { text: string }[];
  /** Checkmark assurances inside the consult card */
  consultPoints: string[];
  ctaLabel: string;
  ctaHref: string;
  /** Fine print under the consult card CTA */
  pricingNote: string;
  whyHeading: string;
  whyBody: string;
  included: string[];
  howBody: string;
  practiceBody: string;
  closingBody: string;
};

const eyebrow: CSSProperties = {
  margin: '0 0 10px', fontSize: 11, letterSpacing: '0.12em',
  textTransform: 'uppercase', color: '#8fb09a', fontWeight: 600,
};

const sectionHeading: CSSProperties = {
  margin: '0 0 16px', fontSize: 26, fontWeight: 800, lineHeight: 1.15, color: '#1e2b25',
};

const bodyText: CSSProperties = {
  margin: 0, fontSize: 15, color: '#4a5e52', lineHeight: 1.7,
};

const HERO_ICONS = [Clock, User, MessageCircle];

export default function TeamProgramLayout({ program }: { program: TeamProgram }) {
  return (
    <div style={{ background: '#f7f5f1', minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          src={program.heroImage}
          alt={program.title}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(18,30,24,0.86) 0%, rgba(18,30,24,0.58) 60%, rgba(18,30,24,0.74) 100%)' }} />
        <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto', padding: '56px 24px 48px' }}>
          <p style={{ margin: '0 0 12px', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#8fb09a', fontWeight: 600 }}>
            Group Programs · Osiris Yoga Therapy
          </p>
          <h1 style={{ margin: '0 0 14px', fontSize: 'clamp(34px,5.5vw,58px)', fontWeight: 800, color: '#fff', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
            {program.title}
          </h1>
          <p style={{ margin: '0 0 28px', fontSize: 17, color: '#c5d9cc', maxWidth: 560, lineHeight: 1.6 }}>
            {program.intro}
          </p>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {program.heroMeta.map(({ text }, i) => {
              const Icon = HERO_ICONS[i];
              return (
                <span key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#a8c4b2' }}>
                  <Icon size={14} /> {text}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>

        {/* ── CONSULT CARD ── */}
        <div style={{ marginTop: -28, position: 'relative', zIndex: 10, background: '#fff', borderRadius: 20, boxShadow: '0 4px 32px rgba(18,30,24,0.10)', overflow: 'hidden', marginBottom: 56, padding: '28px 32px' }}>
          <p style={{ margin: '0 0 12px', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8fb09a', fontWeight: 600 }}>
            {program.engagementLabel}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
            {program.consultPoints.map(point => (
              <span key={point} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#5a7a6a' }}>
                <CheckCircle2 size={13} style={{ color: '#6dab85' }} /> {point}
              </span>
            ))}
          </div>
          <a
            href={program.ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', background: '#2d3d35', color: '#fff', borderRadius: 11, padding: '13px 28px', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}
          >
            {program.ctaLabel}
          </a>
          <p style={{ margin: '10px 0 0', fontSize: 12, color: '#a09a93' }}>{program.pricingNote}</p>
        </div>

        {/* ── WHY ── */}
        <div style={{ marginBottom: 56, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          <div>
            <p style={eyebrow}>Why</p>
            <h2 style={sectionHeading}>{program.whyHeading}</h2>
            <p style={bodyText}>{program.whyBody}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={eyebrow}>What&#39;s included</p>
            {program.included.map(item => (
              <div key={item} style={{ background: '#fff', border: '1.5px solid #e8e3db', borderRadius: 12, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <CheckCircle2 size={16} style={{ color: '#6dab85', marginTop: 1, flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: 14, color: '#3a4e42', lineHeight: 1.5 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── HOW ── */}
        <div style={{ marginBottom: 56 }}>
          <p style={eyebrow}>How</p>
          <h2 style={sectionHeading}>How this works</h2>
          <p style={{ ...bodyText, maxWidth: 760 }}>{program.howBody}</p>
        </div>

        {/* ── WHAT ── */}
        <div style={{ marginBottom: 56 }}>
          <p style={eyebrow}>What</p>
          <h2 style={sectionHeading}>What it looks like in practice</h2>
          <p style={{ ...bodyText, maxWidth: 760 }}>{program.practiceBody}</p>
        </div>

        {/* ── CLOSING CTA ── */}
        <div style={{ background: '#2d3d35', borderRadius: 20, padding: '40px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 800, color: '#fff' }}>Ready to begin?</h3>
            <p style={{ margin: 0, fontSize: 15, color: '#a8a89e', lineHeight: 1.5 }}>{program.closingBody}</p>
          </div>
          <a
            href={program.ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            style={{ background: '#a8d4b4', color: '#1e2b25', borderRadius: 11, padding: '13px 28px', fontSize: 15, fontWeight: 700, whiteSpace: 'nowrap', textDecoration: 'none', flexShrink: 0 }}
          >
            {program.ctaLabel}
          </a>
        </div>
      </div>
    </div>
  );
}
