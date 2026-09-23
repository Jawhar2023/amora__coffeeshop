interface TopDownCarProps {
  width: number;
  height: number;
  body: string;
  bodyDark: string;
  variant?: 'player' | 'traffic';
  scale?: number;
}

// A drawn top-down car silhouette (hood/roof/trunk, glass, lights, mirrors)
// instead of a side-view emoji, so it reads correctly on a vertical road.
export default function TopDownCar({ width, height, body, bodyDark, variant = 'traffic', scale = 1 }: TopDownCarProps) {
  return (
    <div style={{ width, height, transform: `scale(${scale})`, transformOrigin: 'center' }} className="relative">
      {/* contact shadow */}
      <div
        className="absolute rounded-full bg-black/35 blur-[3px]"
        style={{ left: '10%', right: '10%', bottom: -3, height: height * 0.14 }}
      />

      {/* side mirrors */}
      <span className="absolute rounded-sm" style={{ left: -3, top: '30%', width: 5, height: 8, background: bodyDark }} />
      <span className="absolute rounded-sm" style={{ right: -3, top: '30%', width: 5, height: 8, background: bodyDark }} />

      {/* body */}
      <div
        className="absolute inset-0 rounded-[40%_40%_22%_22%/28%_28%_14%_14%]"
        style={{
          background: `linear-gradient(180deg, ${body} 0%, ${bodyDark} 100%)`,
          boxShadow: '0 3px 6px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(0,0,0,0.18)',
        }}
      >
        {/* center shine */}
        <div
          className="absolute rounded-full opacity-40"
          style={{ left: '46%', top: '6%', width: '8%', height: '55%', background: 'linear-gradient(180deg, rgba(255,255,255,0.9), transparent)' }}
        />

        {/* windshield (front glass) */}
        <div
          className="absolute rounded-[45%/60%]"
          style={{
            left: '16%',
            right: '16%',
            top: '14%',
            height: '20%',
            background: 'linear-gradient(180deg, #cfe8ff 0%, #6fa8dc 55%, #2c5282 100%)',
            opacity: 0.92,
          }}
        />

        {/* rear glass */}
        <div
          className="absolute rounded-[45%/60%]"
          style={{
            left: '18%',
            right: '18%',
            bottom: '10%',
            height: '13%',
            background: 'linear-gradient(0deg, #cfe8ff 0%, #6fa8dc 60%, #2c5282 100%)',
            opacity: 0.85,
          }}
        />

        {/* racing stripe for the player's car */}
        {variant === 'player' && (
          <div className="absolute rounded-full bg-white/85" style={{ left: '47%', top: '6%', bottom: '6%', width: '6%' }} />
        )}

        {/* headlights */}
        <span className="absolute rounded-full" style={{ left: '10%', top: '3%', width: '15%', height: '6%', background: '#fef9c3' }} />
        <span className="absolute rounded-full" style={{ right: '10%', top: '3%', width: '15%', height: '6%', background: '#fef9c3' }} />

        {/* taillights */}
        <span className="absolute rounded-full" style={{ left: '12%', bottom: '3%', width: '12%', height: '5%', background: '#ef4444' }} />
        <span className="absolute rounded-full" style={{ right: '12%', bottom: '3%', width: '12%', height: '5%', background: '#ef4444' }} />
      </div>
    </div>
  );
}
