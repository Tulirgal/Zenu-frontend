'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface RGB {
  r: number;
  g: number;
  b: number;
}

/** Soft ZenU-inspired bubble hues — varied, not neon. */
const COLORS: RGB[] = [
  { r: 184, g: 170, b: 255 }, // lavender
  { r: 167, g: 139, b: 250 }, // violet
  { r: 125, g: 168, b: 255 }, // blue
  { r: 125, g: 211, b: 252 }, // cyan
  { r: 167, g: 243, b: 208 }, // mint
  { r: 251, g: 182, b: 206 }, // pink
  { r: 253, g: 230, b: 200 }, // warm cream
];

const LAVENDER = { r: 224, g: 187, b: 255 };

export type BubblesEvent =
  | { type: 'spawn'; count: number }
  | { type: 'pop'; count: number; chain?: boolean }
  | { type: 'popAll'; count: number };

type BubblesFieldProps = {
  className?: string;
  reducedMotion?: boolean;
  onEvent?: (e: BubblesEvent) => void;
};

class Bubble {
  x: number;
  y: number;
  baseY: number;
  targetR: number;
  r: number;
  vx: number;
  vy: number;
  birth: number;
  life: number;
  color: RGB;
  alpha: number;
  depth: number;
  shimmer: number;
  shimmerSpeed: number;
  wobble: number;
  wobbleSpeed: number;
  isPopping: boolean;
  popStartTime: number;
  squash: number;
  static id = 0;
  id: number;

  constructor(x: number, y: number, targetR = 50) {
    this.id = Bubble.id++;
    this.x = x;
    this.y = y;
    this.baseY = y;
    this.targetR = targetR;
    this.depth = Math.random();
    this.r = this.targetR * 0.1 * (0.5 + this.depth * 0.5);
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = -(0.15 + Math.random() * 0.25) * (0.7 + this.depth * 0.3);
    this.birth = performance.now();
    this.life = 4000 + Math.random() * 3000;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.alpha = 0.7 + Math.random() * 0.25;
    this.shimmer = Math.random() * Math.PI * 2;
    this.shimmerSpeed = 0.008 + Math.random() * 0.012;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = 0.002 + Math.random() * 0.003;
    this.isPopping = false;
    this.popStartTime = 0;
    this.squash = 1;
  }

  contains(px: number, py: number): boolean {
    if (this.isPopping) return false;
    const dx = px - this.x;
    const dy = py - this.y;
    return dx * dx + dy * dy <= this.r * this.r;
  }

  nudge(dx: number, dy: number) {
    this.vx += dx;
    this.vy += dy;
  }

  update(now: number, deltaTime: number, reducedMotion: boolean): boolean {
    const dt = deltaTime / 16.67;
    const age = now - this.birth;

    if (this.isPopping) {
      const popAge = now - this.popStartTime;
      const popDuration = reducedMotion ? 180 : 280;
      const popProgress = Math.min(1, popAge / popDuration);

      // Compress → expand → fade
      if (popProgress < 0.25) {
        const t = popProgress / 0.25;
        this.squash = 1 - t * 0.22;
        this.r = this.targetR * (0.5 + this.depth * 0.5) * (1 - t * 0.08);
      } else {
        const t = (popProgress - 0.25) / 0.75;
        const eased = 1 - Math.pow(1 - t, 3);
        this.squash = 0.78 + eased * 0.55;
        this.r = this.targetR * (0.5 + this.depth * 0.5) * (0.92 + eased * 0.55);
        this.alpha = (1 - eased) * 0.85;
      }
      return popProgress < 1;
    }

    if (age > this.life) {
      this.startPop();
      return true;
    }

    const growthProgress = Math.min(1, age / Math.min(1200, this.life * 0.3));
    const growthEased = growthProgress * (2 - growthProgress);
    this.r = this.targetR * (0.5 + this.depth * 0.5) * (0.1 + 0.9 * growthEased);
    this.squash = 1;

    this.wobble += this.wobbleSpeed * dt * (reducedMotion ? 0.35 : 1);
    this.shimmer += this.shimmerSpeed * dt * (reducedMotion ? 0.35 : 1);

    this.x += (this.vx + Math.sin(this.wobble) * (reducedMotion ? 0.05 : 0.15)) * dt;
    this.y += this.vy * dt;

    this.vx *= Math.pow(0.995, dt);
    this.vy *= Math.pow(0.998, dt);

    return true;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { r: R, g: G, b: B } = this.color;
    const shimmerIntensity = 0.4 + 0.3 * Math.sin(this.shimmer);
    const displayR = this.r;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(1 / this.squash, this.squash);
    ctx.translate(-this.x, -this.y);

    const outerGlow = ctx.createRadialGradient(
      this.x,
      this.y,
      displayR * 0.3,
      this.x,
      this.y,
      displayR * 1.4,
    );
    outerGlow.addColorStop(0, `rgba(${R}, ${G}, ${B}, ${this.alpha * 0.3})`);
    outerGlow.addColorStop(0.6, `rgba(${R}, ${G}, ${B}, ${this.alpha * 0.12})`);
    outerGlow.addColorStop(1, `rgba(${R}, ${G}, ${B}, 0)`);

    ctx.fillStyle = outerGlow;
    ctx.beginPath();
    ctx.arc(this.x, this.y, displayR * 1.4, 0, Math.PI * 2);
    ctx.fill();

    const mainGrad = ctx.createRadialGradient(
      this.x - displayR * 0.3,
      this.y - displayR * 0.3,
      displayR * 0.05,
      this.x,
      this.y,
      displayR,
    );
    mainGrad.addColorStop(0, `rgba(255, 255, 255, ${this.alpha * 0.95})`);
    mainGrad.addColorStop(0.2, `rgba(${Math.min(255, R + 30)}, ${Math.min(255, G + 30)}, ${Math.min(255, B + 30)}, ${this.alpha * 0.85})`);
    mainGrad.addColorStop(0.5, `rgba(${R}, ${G}, ${B}, ${this.alpha * 0.7})`);
    mainGrad.addColorStop(0.85, `rgba(${R * 0.8}, ${G * 0.8}, ${B * 0.8}, ${this.alpha * 0.5})`);
    mainGrad.addColorStop(1, `rgba(${R * 0.6}, ${G * 0.6}, ${B * 0.6}, ${this.alpha * 0.2})`);

    ctx.fillStyle = mainGrad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, displayR, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = shimmerIntensity * 0.4;

    const shimmerGrad = ctx.createRadialGradient(
      this.x + Math.cos(this.shimmer) * displayR * 0.3,
      this.y + Math.sin(this.shimmer) * displayR * 0.3,
      0,
      this.x,
      this.y,
      displayR * 0.9,
    );
    shimmerGrad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    shimmerGrad.addColorStop(0.5, `rgba(${LAVENDER.r}, ${LAVENDER.g}, ${LAVENDER.b}, 0.4)`);
    shimmerGrad.addColorStop(1, `rgba(${R}, ${G}, ${B}, 0)`);

    ctx.fillStyle = shimmerGrad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, displayR * 0.9, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;

    ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha * 0.9})`;
    ctx.beginPath();
    ctx.ellipse(
      this.x - displayR * 0.35,
      this.y - displayR * 0.35,
      displayR * 0.25,
      displayR * 0.18,
      -0.6,
      0,
      Math.PI * 2,
    );
    ctx.fill();

    ctx.strokeStyle = `rgba(255, 255, 255, ${this.alpha * 0.55})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(this.x, this.y, displayR, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  startPop() {
    if (!this.isPopping) {
      this.isPopping = true;
      this.popStartTime = performance.now();
    }
  }

  forcePop() {
    this.startPop();
  }
}

class PopRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: RGB;

  constructor(x: number, y: number, startRadius: number) {
    this.x = x;
    this.y = y;
    this.radius = startRadius;
    this.maxRadius = startRadius * 3.2;
    this.alpha = 0.7;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  update(deltaTime: number): boolean {
    const dt = deltaTime / 16.67;
    this.radius += 4.2 * dt;
    this.alpha -= 0.028 * dt;
    return this.alpha > 0 && this.radius < this.maxRadius;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { r: R, g: G, b: B } = this.color;
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${Math.min(255, R + 40)}, ${Math.min(255, G + 40)}, ${Math.min(255, B + 40)}, 0.8)`;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 0.8, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth = 1.25;
    ctx.stroke();
    ctx.restore();
  }
}

class Sparkle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: RGB;
  alpha: number;
  birth: number;
  life: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.1 + Math.random() * 1.8;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed - 0.5;
    this.size = 1 + Math.random() * 2;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.alpha = 0.9;
    this.birth = performance.now();
    this.life = 420 + Math.random() * 280;
  }

  update(deltaTime: number): boolean {
    const dt = deltaTime / 16.67;
    const age = performance.now() - this.birth;
    if (age > this.life) return false;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vy += 0.08 * dt;
    this.vx *= Math.pow(0.98, dt);
    this.alpha = (1 - age / this.life) * 0.9;
    return true;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { r: R, g: G, b: B } = this.color;
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.strokeStyle = `rgba(${Math.min(255, R + 60)}, ${Math.min(255, G + 60)}, ${Math.min(255, B + 60)}, 0.9)`;
    ctx.lineWidth = this.size;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(this.x - this.size * 2, this.y);
    ctx.lineTo(this.x + this.size * 2, this.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(this.x, this.y - this.size * 2);
    ctx.lineTo(this.x, this.y + this.size * 2);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

/**
 * Playable canvas field — preserves spawn/drag/Space/Enter; adds hit-test pop.
 */
export function BubblesField({
  className,
  reducedMotion = false,
  onEvent,
}: BubblesFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<Bubble[]>([]);
  const ripplesRef = useRef<PopRipple[]>([]);
  const sparklesRef = useRef<Sparkle[]>([]);
  const onEventRef = useRef(onEvent);
  const reducedRef = useRef(reducedMotion);
  onEventRef.current = onEvent;
  reducedRef.current = reducedMotion;

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext('2d', { alpha: true, willReadFrequently: false });
    if (!ctx) return;

    let DPR = Math.min(2, window.devicePixelRatio || 1);
    let lastFrame = 0;
    let raf = 0;
    let isPressed = false;
    let mouseX = 0;
    let mouseY = 0;
    let trailTimer = 0;
    let poppedThisDown = false;

    // Stable ambient glows (avoid Math.random every frame flicker)
    const ambients = Array.from({ length: 5 }, (_, i) => ({
      x: 0.18 + (i % 3) * 0.28,
      y: 0.28 + Math.floor(i / 3) * 0.35,
      radius: 90 + i * 18,
      color: COLORS[i % COLORS.length],
      phase: i * 1.2,
    }));

    const resize = () => {
      DPR = Math.min(2, window.devicePixelRatio || 1);
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (w < 2 || h < 2) return;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      // Clamp existing bubbles into new bounds
      for (const b of bubblesRef.current) {
        b.x = Math.min(Math.max(b.x, b.r), w - b.r);
        b.y = Math.min(Math.max(b.y, b.r), h - b.r);
      }
    };

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    const spawnAt = (x: number, y: number, count: number, spread = 40) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * spread;
        bubblesRef.current.push(
          new Bubble(
            x + Math.cos(angle) * distance,
            y + Math.sin(angle) * distance,
            35 + Math.random() * 50,
          ),
        );
      }
      onEventRef.current?.({ type: 'spawn', count });
    };

    const popBubble = (bubble: Bubble, chain = false) => {
      if (bubble.isPopping) return;
      bubble.startPop();
      // Nudge neighbors
      for (const other of bubblesRef.current) {
        if (other === bubble || other.isPopping) continue;
        const dx = other.x - bubble.x;
        const dy = other.y - bubble.y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < bubble.r + other.r + 70) {
          const force = (1 - dist / (bubble.r + other.r + 70)) * 1.1;
          other.nudge((dx / dist) * force, (dy / dist) * force * 0.7);
        }
      }
      onEventRef.current?.({ type: 'pop', count: 1, chain });
    };

    const hitTest = (x: number, y: number): Bubble | null => {
      // Prefer front-most (higher depth)
      let hit: Bubble | null = null;
      for (const b of bubblesRef.current) {
        if (b.contains(x, y)) {
          if (!hit || b.depth >= hit.depth) hit = b;
        }
      }
      return hit;
    };

    const onPointerDown = (ev: PointerEvent) => {
      ev.preventDefault();
      canvas.setPointerCapture(ev.pointerId);
      isPressed = true;
      poppedThisDown = false;
      const rect = canvas.getBoundingClientRect();
      mouseX = ev.clientX - rect.left;
      mouseY = ev.clientY - rect.top;

      const hit = hitTest(mouseX, mouseY);
      if (hit) {
        popBubble(hit);
        poppedThisDown = true;
        return;
      }

      const count = 4 + Math.floor(Math.random() * 4);
      spawnAt(mouseX, mouseY, count);
    };

    const onPointerMove = (ev: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = ev.clientX - rect.left;
      mouseY = ev.clientY - rect.top;

      // Light disturb while dragging over bubbles
      if (isPressed && !poppedThisDown) {
        for (const b of bubblesRef.current) {
          if (b.isPopping) continue;
          const dx = b.x - mouseX;
          const dy = b.y - mouseY;
          const dist = Math.hypot(dx, dy);
          if (dist < b.r + 28 && dist > 0.1) {
            b.nudge((dx / dist) * 0.08, (dy / dist) * 0.06);
          }
        }
      }
    };

    const onPointerUp = (ev: PointerEvent) => {
      isPressed = false;
      try {
        canvas.releasePointerCapture(ev.pointerId);
      } catch {
        /* ignore */
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        const W = canvas.width / DPR;
        const H = canvas.height / DPR;
        const cx = W / 2;
        const cy = H - 80;
        const count = 8 + Math.floor(Math.random() * 8);
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2;
          const bubble = new Bubble(
            cx + Math.cos(angle) * 15,
            cy + Math.sin(angle) * 15,
            45 + Math.random() * 40,
          );
          bubble.vx = Math.cos(angle) * 0.4;
          bubble.vy = Math.sin(angle) * 0.3 - 0.2;
          bubblesRef.current.push(bubble);
        }
        onEventRef.current?.({ type: 'spawn', count });
      } else if (e.code === 'Enter') {
        e.preventDefault();
        const n = bubblesRef.current.filter((b) => !b.isPopping).length;
        bubblesRef.current.forEach((b) => b.forcePop());
        if (n > 0) onEventRef.current?.({ type: 'popAll', count: n });
      }
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
    window.addEventListener('keydown', onKeyDown);

    const animate = (now: number) => {
      raf = requestAnimationFrame(animate);
      if (now - lastFrame < 1000 / 60) return;
      const deltaTime = now - lastFrame || 16;
      lastFrame = now;

      const W = canvas.width / DPR;
      const H = canvas.height / DPR;
      const reduced = reducedRef.current;

      ctx.clearRect(0, 0, W, H);

      ctx.save();
      ctx.globalAlpha = reduced ? 0.04 : 0.07;
      for (const a of ambients) {
        const pulse = 0.85 + 0.15 * Math.sin(now * 0.0004 + a.phase);
        const x = W * a.x;
        const y = H * a.y;
        const radius = a.radius * pulse;
        const glow = ctx.createRadialGradient(x, y, 0, x, y, radius);
        glow.addColorStop(0, `rgba(${a.color.r}, ${a.color.g}, ${a.color.b}, 0.28)`);
        glow.addColorStop(0.55, `rgba(${a.color.r}, ${a.color.g}, ${a.color.b}, 0.1)`);
        glow.addColorStop(1, `rgba(${a.color.r}, ${a.color.g}, ${a.color.b}, 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Drag trails only when spawning (not after a pop on this press)
      if (isPressed && !poppedThisDown) {
        trailTimer += deltaTime;
        if (trailTimer > 120) {
          trailTimer = 0;
          bubblesRef.current.push(
            new Bubble(
              mouseX + (Math.random() - 0.5) * 30,
              mouseY + (Math.random() - 0.5) * 30,
              25 + Math.random() * 30,
            ),
          );
        }
      }

      // Soft pairwise separation (playful, light)
      const list = bubblesRef.current;
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          const a = list[i];
          const b = list[j];
          if (a.isPopping || b.isPopping) continue;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy);
          const min = (a.r + b.r) * 0.92;
          if (dist > 0.1 && dist < min) {
            const push = ((min - dist) / min) * 0.045;
            const nx = dx / dist;
            const ny = dy / dist;
            a.nudge(-nx * push, -ny * push);
            b.nudge(nx * push, ny * push);
          }
        }
      }

      list.sort((a, b) => a.depth - b.depth);

      for (let i = list.length - 1; i >= 0; i--) {
        const bubble = list[i];
        const alive = bubble.update(now, deltaTime, reduced);

        if (!alive || bubble.y + bubble.r < -200 || bubble.x < -200 || bubble.x > W + 200) {
          if (bubble.isPopping) {
            ripplesRef.current.push(new PopRipple(bubble.x, bubble.y, bubble.r));
            const sparkleCount = reduced ? 3 : 7;
            for (let j = 0; j < sparkleCount; j++) {
              sparklesRef.current.push(new Sparkle(bubble.x, bubble.y));
            }
          }
          list.splice(i, 1);
          continue;
        }
        bubble.draw(ctx);
      }

      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const ripple = ripplesRef.current[i];
        if (!ripple.update(deltaTime)) {
          ripplesRef.current.splice(i, 1);
          continue;
        }
        ripple.draw(ctx);
      }

      for (let i = sparklesRef.current.length - 1; i >= 0; i--) {
        const sparkle = sparklesRef.current[i];
        if (!sparkle.update(deltaTime)) {
          sparklesRef.current.splice(i, 1);
          continue;
        }
        sparkle.draw(ctx);
      }
    };

    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className={cn('relative h-full w-full min-h-0 touch-none overflow-hidden', className)}
      style={{ touchAction: 'none' }}
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full cursor-crosshair touch-none"
        style={{ touchAction: 'none' }}
        aria-label="Bubbles play field"
        role="application"
      />
    </div>
  );
}
