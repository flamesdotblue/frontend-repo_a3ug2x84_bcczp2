import React, { useEffect, useRef, useState } from 'react';

/*
  Interactive starfield with upward drift.
  - Default: stars drift slowly upward with slight x jitter.
  - Hover: stars accelerate and align into a horizontal band (gentle, centered).
*/
const StarfieldCanvas = ({ className = '' }) => {
  const canvasRef = useRef(null);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * DPR;
    canvas.height = height * DPR;
    ctx.scale(DPR, DPR);

    const STAR_COUNT = Math.floor((width * height) / 5000);

    const stars = Array.from({ length: STAR_COUNT }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.5 + 0.3,
      speed: Math.random() * 0.2 + 0.1,
      jitter: (Math.random() - 0.5) * 0.2,
    }));

    let rafId;
    let last = performance.now();

    const centerBandY = height * 0.5;

    const render = (t) => {
      const dt = Math.min((t - last) / 16.67, 2); // normalize to ~60fps steps
      last = t;

      ctx.clearRect(0, 0, width, height);

      for (const s of stars) {
        if (!hover) {
          s.y -= s.speed * dt;
          s.x += s.jitter * dt;
          if (s.y < -5) {
            s.y = height + 5;
            s.x = Math.random() * width;
          }
        } else {
          // Accelerate and gently move y toward center band
          const accel = 0.6 * dt;
          s.y += (centerBandY - s.y) * 0.08 * dt + accel;
          // Slight smoothing of x to form a line
          s.x += (Math.round(s.x / 12) * 12 - s.x) * 0.04 * dt;
        }

        const alpha = hover ? 0.8 : 0.6;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#E6E6E6';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (hover) {
        // Gentle glow line indicating alignment
        const grd = ctx.createLinearGradient(0, centerBandY - 20, 0, centerBandY + 20);
        grd.addColorStop(0, 'rgba(168,202,186,0)');
        grd.addColorStop(0.5, 'rgba(168,202,186,0.15)');
        grd.addColorStop(1, 'rgba(168,202,186,0)');
        ctx.fillStyle = grd;
        ctx.fillRect(0, centerBandY - 20, width, 40);
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    const onResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * DPR;
      canvas.height = height * DPR;
      ctx.scale(DPR, DPR);
    };

    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
    };
  }, [hover]);

  return (
    <div
      className={`relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden bg-[#0D1B2A] ${className}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {/* Subtle vignette */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
    </div>
  );
};

export default StarfieldCanvas;
