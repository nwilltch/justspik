import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'JustSpik — Reflex Speech Training';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fafaf9',
          backgroundImage:
            'radial-gradient(circle at 25px 25px, #e7e5e4 2%, transparent 0%), radial-gradient(circle at 75px 75px, #e7e5e4 2%, transparent 0%)',
          backgroundSize: '100px 100px',
          padding: '60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '9999px',
              backgroundColor: '#2563eb',
            }}
          />
          <div
            style={{
              fontSize: '48px',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              color: '#1c1917',
              fontFamily: 'sans-serif',
            }}
          >
            just<span style={{ color: '#2563eb' }}>spik</span>
          </div>
        </div>

        <div
          style={{
            fontSize: '60px',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#1c1917',
            textAlign: 'center',
            lineHeight: 1.15,
            maxWidth: '900px',
            marginBottom: '24px',
            fontFamily: 'sans-serif',
          }}
        >
          Reflex Speech Training
        </div>

        <div
          style={{
            fontSize: '26px',
            fontWeight: 500,
            color: '#78716c',
            textAlign: 'center',
            maxWidth: '750px',
            lineHeight: 1.4,
            marginBottom: '40px',
            fontFamily: 'sans-serif',
          }}
        >
          Entraîne tes réflexes d’élocution sous chrono. Répète à l’oral, fluidifie ta parole et bats tes records.
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 28px',
            backgroundColor: '#2563eb',
            borderRadius: '9999px',
            color: '#ffffff',
            fontSize: '22px',
            fontWeight: 600,
            fontFamily: 'sans-serif',
          }}
        >
          <span>🎙️</span>
          <span>justspik.com</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
