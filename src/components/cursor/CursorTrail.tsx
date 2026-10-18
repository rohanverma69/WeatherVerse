import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  initialSize: number;
  alpha: number;
  decay: number;
  rotation: number;
  rotSpeed: number;
  color: string;
  shape: 'star' | 'circle';
}

const COLORS = [
  '#00F2FE', // Neon Cyan
  '#38BDF8', // Sky Blue
  '#A855F7', // Purple
  '#C084FC', // Light Violet
  '#FDE047', // Solar Gold
  '#FFFFFF', // Pure Starlight White
];

export const CursorTrail: React.FC<{ enabled?: boolean }> = ({ enabled = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const orbRef = useRef<HTMLDivElement | null>(null);
  const [isPointerDevice, setIsPointerDevice] = useState(false);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);

  useEffect(() => {
    // Check for touch device or reduced motion
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!hasFinePointer || prefersReducedMotion || !enabled) {
      setIsPointerDevice(false);
      return;
    }

    setIsPointerDevice(true);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    // Screen resizing
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Mouse coordinates
    let mouseX = -100;
    let mouseY = -100;
    let orbX = -100;
    let orbY = -100;
    let lastSpawnX = -100;
    let lastSpawnY = -100;

    const spawnSparkles = (x: number, y: number, count = 2) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.5 + 0.3;
        const size = Math.random() * 4 + 2;
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const shape = Math.random() > 0.4 ? 'star' : 'circle';

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed + 0.2, // subtle gravity
          size,
          initialSize: size,
          alpha: 1,
          decay: Math.random() * 0.025 + 0.015,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.1,
          color,
          shape,
        });
      }
      if (particles.length > 120) {
        particles.splice(0, particles.length - 120);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Distance moved since last spawn
      const dist = Math.hypot(mouseX - lastSpawnX, mouseY - lastSpawnY);
      if (dist > 8) {
        spawnSparkles(mouseX, mouseY, 2);
        lastSpawnX = mouseX;
        lastSpawnY = mouseY;
      }

      // Check if hovering interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = Boolean(
          target.closest('button, a, input, select, textarea, [role="button"], .clickable, .glass-panel-interactive')
        );
        setIsHoveringInteractive(isClickable);
      }
    };

    const handleClick = (e: MouseEvent) => {
      // Extra burst of sparkles on click
      spawnSparkles(e.clientX, e.clientY, 14);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    // Draw 4-pointed star
    const drawStar = (cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      ctx.fill();
    };

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth orb interpolation
      orbX += (mouseX - orbX) * 0.22;
      orbY += (mouseY - orbY) * 0.22;

      if (orbRef.current) {
        orbRef.current.style.transform = `translate3d(${orbX - 16}px, ${orbY - 16}px, 0)`;
      }

      // Update and render particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        p.rotation += p.rotSpeed;
        p.size = Math.max(0.2, p.initialSize * (p.alpha > 0 ? p.alpha : 0));

        if (p.alpha <= 0 || p.size <= 0.2) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;

        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.shape === 'star') {
          drawStar(0, 0, 4, p.size * 1.5, p.size * 0.5);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [enabled]);

  if (!isPointerDevice || !enabled) {
    return null;
  }

  return (
    <>
      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9998]"
        style={{ width: '100vw', height: '100vh' }}
        aria-hidden="true"
      />

      {/* Smooth Spring Orb */}
      <div
        ref={orbRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9999] transition-all duration-150 ease-out will-change-transform ${
          isHoveringInteractive
            ? 'w-10 h-10 -ml-1 -mt-1 bg-cyan-400/20 border border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.8)] rounded-full scale-125 backdrop-blur-[1px]'
            : 'w-8 h-8 bg-gradient-to-br from-cyan-400/40 via-violet-400/30 to-white/60 border border-white/50 shadow-[0_0_15px_rgba(0,242,254,0.6)] rounded-full'
        }`}
        aria-hidden="true"
      >
        {/* Tiny center starlight dot */}
        <div className="absolute inset-0 m-auto w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_6px_#fff]" />
      </div>
    </>
  );
};
