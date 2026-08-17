'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackEngagement } from '@/lib/signals';
import ModulePage from '@/components/ui/ModulePage';
import { getTheme } from '@/lib/moduleThemes';
import { ZenBackLink } from '@/components/zen';

const API = process.env.NEXT_PUBLIC_API_URL || '';

interface Task {
  id: string;
  name: string;
  completed: boolean;
  created_at: string;
  completed_at?: string;
}

// ── Deterministic pseudo-random from a seed string ──────────────
function hashStr(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return h;
}

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ── SVG Garden Renderer ─────────────────────────────────────────
function buildGardenSVG(tasks: Task[]): string {
  const W = 900, H = 340, groundY = 300;

  const hills = `
    <path d="M0,${groundY - 30} Q150,${groundY - 70} 300,${groundY - 35} T600,${groundY - 40} T900,${groundY - 20} L900,${H} L0,${H} Z" fill="#3f5a49"/>
    <path d="M0,${groundY} Q200,${groundY - 25} 450,${groundY - 5} T900,${groundY - 15} L900,${H} L0,${H} Z" fill="#2c4536"/>
  `;

  const items = tasks.slice(0, 40);
  const n = Math.max(items.length, 1);
  const leafColors = ['#6b9080', '#a4c3a2', '#588157', '#3a5a40'];

  function drawSeed(rng: () => number, x: number): string {
    const jitter = (rng() - 0.5) * 6;
    return `<g transform="translate(${x + jitter},${groundY})">
      <ellipse cx="0" cy="-2" rx="5" ry="3" fill="#4a3728" opacity="0.85"/>
      <circle cx="0" cy="-5" r="2.4" fill="#588157"/>
    </g>`;
  }

  function drawTree(rng: () => number, x: number, scale: number): string {
    const trunkH = (60 + rng() * 40) * scale;
    const trunkW = (6 + rng() * 4) * scale;
    const lean = (rng() - 0.5) * 10;
    let svg = `<g transform="translate(${x},${groundY})">`;

    svg += `<path d="M ${-trunkW / 2} 0
      C ${-trunkW / 2 + lean * 0.3} ${-trunkH * 0.5},
        ${lean * 0.6} ${-trunkH * 0.6},
        ${lean} ${-trunkH}
      L ${lean + trunkW * 0.6} ${-trunkH}
      C ${lean * 0.6 + trunkW} ${-trunkH * 0.6},
        ${trunkW / 2 + lean * 0.3} ${-trunkH * 0.5},
        ${trunkW / 2} 0 Z"
      fill="#4a3728" stroke="#33261b" stroke-width="0.6"/>`;

    const branchCount = 2 + Math.floor(rng() * 3);
    for (let b = 0; b < branchCount; b++) {
      const t = 0.35 + rng() * 0.5;
      const by = -trunkH * t;
      const bx = lean * t;
      const dir = b % 2 === 0 ? -1 : 1;
      const len = (18 + rng() * 16) * scale;
      const angle = (dir * (30 + rng() * 25) * Math.PI) / 180;
      const ex = bx + Math.sin(angle) * len;
      const ey = by - Math.cos(angle) * len;
      svg += `<path d="M ${bx} ${by} Q ${(bx + ex) / 2 + dir * 8} ${(by + ey) / 2}, ${ex} ${ey}"
        stroke="#4a3728" stroke-width="${2.5 * scale}" fill="none" stroke-linecap="round"/>`;
    }

    const clusterCount = 5 + Math.floor(rng() * 5);
    const canopyCx = lean;
    const canopyCy = -trunkH - 6 * scale;
    const canopyR = (26 + rng() * 14) * scale;
    for (let c = 0; c < clusterCount; c++) {
      const ang = rng() * Math.PI * 2;
      const rad = rng() * canopyR * 0.85;
      const cx = canopyCx + Math.cos(ang) * rad;
      const cy = canopyCy + Math.sin(ang) * rad * 0.7;
      const r = (10 + rng() * 10) * scale;
      const color = leafColors[Math.floor(rng() * leafColors.length)];
      svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="0.92"/>`;
    }

    if (rng() > 0.4) {
      const flecks = 2 + Math.floor(rng() * 3);
      for (let f = 0; f < flecks; f++) {
        const ang = rng() * Math.PI * 2;
        const rad = rng() * canopyR * 0.7;
        const cx = canopyCx + Math.cos(ang) * rad;
        const cy = canopyCy + Math.sin(ang) * rad * 0.7;
        svg += `<circle cx="${cx}" cy="${cy}" r="${1.6 * scale}" fill="#f2c14e" opacity="0.85"/>`;
      }
    }

    svg += `</g>`;
    return svg;
  }

  let content = '';
  const availableWidth = W - 120;
  const maxSpacing = 85;
  const spacing = Math.min(availableWidth / n, maxSpacing);
  const totalWidth = spacing * n;
  const startX = (W - totalWidth) / 2;

  items.forEach((task, i) => {
    const x = startX + (i + 0.5) * spacing;
    const rng = mulberry32(hashStr(task.id));
    if (task.completed) {
      const scale = 0.85 + rng() * 0.5;
      content += drawTree(rng, x, scale);
    } else {
      content += drawSeed(rng, x);
    }
  });

  return hills + content;
}

// ── Main Page Component ─────────────────────────────────────────
export default function HealingGardenPage() {
  const [tasks, setTasks]       = useState<Task[]>([]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(true);
  const [adding, setAdding]     = useState(false);
  const [newTreeId, setNewTreeId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const startTime = useRef(Date.now());

  const trees  = tasks.filter(t => t.completed);
  const seeds  = tasks.filter(t => !t.completed);

  // Load tasks
  const loadTasks = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/healing-garden/tasks`, {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    trackEngagement('healing_garden', 'opened');
    loadTasks();
  }, [loadTasks]);

  // Update SVG whenever tasks change
  useEffect(() => {
    if (svgRef.current) {
      svgRef.current.innerHTML = buildGardenSVG(tasks);
    }
  }, [tasks]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || adding) return;
    setAdding(true);
    try {
      const res = await fetch(`${API}/api/healing-garden/tasks`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: input.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.task) {
          setTasks(prev => [...prev, data.task]);
          setInput('');
        }
      }
    } finally {
      setAdding(false);
    }
  };

  const handleComplete = async (taskId: string) => {
    // Optimistic update
    setTasks(prev =>
      prev.map(t => t.id === taskId ? { ...t, completed: true } : t)
    );
    setNewTreeId(taskId);
    setTimeout(() => setNewTreeId(null), 2000);

    try {
      await fetch(`${API}/api/healing-garden/tasks/${taskId}/complete`, {
        method: 'PATCH',
        credentials: 'include',
      });
      trackEngagement('healing_garden', 'completed',
        Math.round((Date.now() - startTime.current) / 1000));
    } catch (e) {
      // revert on fail
      setTasks(prev =>
        prev.map(t => t.id === taskId ? { ...t, completed: false } : t)
      );
    }
  };

  const handleDelete = async (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    try {
      await fetch(`${API}/api/healing-garden/tasks/${taskId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
    } catch (e) {
      loadTasks(); // reload on fail
    }
  };

  const theme = getTheme('healing-garden');

  return (
    <ModulePage theme={theme}>
      <div className="min-h-screen" style={{ background: 'transparent', color: theme.textPrimary }}>
        <div className="max-w-5xl mx-auto px-5 py-10 pb-20">

        <ZenBackLink section="Healing Garden" className="mb-8" />

        {/* Header */}
        <header className="text-center mb-6">
          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#f2c14e' }}>
            a quiet place for finished work
          </p>
          <h1 className="text-4xl mb-2" style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}>
            The Healing Garden
          </h1>
          <p className="text-sm leading-relaxed max-w-3xl mx-auto" style={{ color: '#c7bca7' }}>
            Plant a task when you start it. Mark it done, and watch it grow into a tree —
            a living record of everything you have accomplished.
          </p>
        </header>

        {/* Stats */}
        <div className="flex justify-center gap-10 mb-7">
          <div className="text-center">
            <div className="text-3xl mb-0.5" style={{ fontFamily: 'Georgia, serif', color: '#f2c14e' }}>
              {trees.length}
            </div>
            <div className="text-xs tracking-widest uppercase" style={{ color: '#c7bca7' }}>
              Trees Grown
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-0.5" style={{ fontFamily: 'Georgia, serif', color: '#f2c14e' }}>
              {seeds.length}
            </div>
            <div className="text-xs tracking-widest uppercase" style={{ color: '#c7bca7' }}>
              Seeds Planted
            </div>
          </div>
        </div>

        {/* Garden Scene */}
        <div
          className="relative w-full rounded-2xl overflow-x-auto overflow-y-hidden mb-6 scrollbar-thin"
          style={{
            height: 300,
            background: 'linear-gradient(180deg, #1c2a38 0%, #3a4a5a 55%, #c98a4b 100%)',
            boxShadow: '0 20px 50px -20px rgba(0,0,0,0.6)',
          }}
        >
          <div className="relative h-full w-full min-w-[760px]">
            <svg
              ref={svgRef}
              viewBox="0 0 900 340"
              preserveAspectRatio="xMidYMax slice"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            />

          {/* Fireflies */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 4, height: 4,
                background: '#f2c14e',
                boxShadow: '0 0 8px 2px #f2c14e',
                left: `${15 + i * 17}%`,
                top: `${20 + (i % 3) * 15}%`,
              }}
              animate={{ y: [0, -14, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.8 }}
            />
          ))}

          {/* New tree celebration */}
          <AnimatePresence>
            {newTreeId && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-center">
                  <div className="text-5xl mb-2">🌳</div>
                  <p className="text-sm font-semibold" style={{ color: '#f2c14e' }}>
                    A new tree grew!
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {tasks.length === 0 && !loading && (
            <div
              className="absolute bottom-4 left-0 right-0 text-center text-xs italic pointer-events-none"
              style={{ color: '#c7bca7' }}
            >
              Plant your first task below to begin your garden.
            </div>
          )}
          </div>
        </div>

        {/* Add task form */}
        <form onSubmit={handleAdd} className="flex gap-2 mb-6">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            maxLength={80}
            placeholder="Name something you want to accomplish… e.g. 'Submit assignment'"
            className="flex-1 rounded-xl px-4 py-3 text-sm"
            style={{
              background: '#233240',
              border: '1px solid rgba(237,228,211,0.12)',
              color: '#ede4d3',
              fontFamily: 'Inter, sans-serif',
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || adding}
            className="rounded-xl px-5 py-3 text-sm font-semibold disabled:opacity-40"
            style={{ background: '#f2c14e', color: '#2b2115' }}
          >
            {adding ? '...' : 'Plant seed 🌱'}
          </button>
        </form>

        {/* Task lists */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Seeds — In Progress */}
          <div
            className="rounded-2xl p-4"
            style={{ background: '#233240', border: '1px solid rgba(237,228,211,0.12)' }}
          >
            <h2 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: '#ede4d3' }}>
              🌱 In Progress
              <span className="text-xs rounded-full px-2 py-0.5" style={{ background: 'rgba(237,228,211,0.1)', color: '#c7bca7' }}>
                {seeds.length}
              </span>
            </h2>

            {loading ? (
              <div className="text-xs italic" style={{ color: '#c7bca7' }}>Loading your garden...</div>
            ) : seeds.length === 0 ? (
              <div className="text-xs italic" style={{ color: '#c7bca7' }}>Nothing planted yet — add a task above.</div>
            ) : (
              <ul className="space-y-1">
                <AnimatePresence>
                  {seeds.map(task => (
                    <motion.li
                      key={task.id}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex items-center gap-2 py-2 text-sm"
                      style={{ borderBottom: '1px solid rgba(237,228,211,0.08)' }}
                    >
                      <span className="flex-1 break-words" style={{ color: '#ede4d3' }}>
                        {task.name}
                      </span>
                      <button
                        onClick={() => handleComplete(task.id)}
                        className="text-xs rounded-lg px-2.5 py-1 flex-shrink-0"
                        style={{
                          border: '1px solid #588157',
                          color: '#a4c3a2',
                          background: 'transparent',
                        }}
                      >
                        Mark done ✓
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="text-xs rounded-lg px-2 py-1 flex-shrink-0"
                        style={{
                          border: '1px solid #c9705a',
                          color: '#c9705a',
                          background: 'transparent',
                        }}
                      >
                        ✕
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>

          {/* Trees — Done */}
          <div
            className="rounded-2xl p-4"
            style={{ background: '#233240', border: '1px solid rgba(237,228,211,0.12)' }}
          >
            <h2 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: '#ede4d3' }}>
              🌳 Grown
              <span className="text-xs rounded-full px-2 py-0.5" style={{ background: 'rgba(237,228,211,0.1)', color: '#c7bca7' }}>
                {trees.length}
              </span>
            </h2>

            {trees.length === 0 ? (
              <div className="text-xs italic" style={{ color: '#c7bca7' }}>No trees yet — finish something to grow one.</div>
            ) : (
              <ul className="space-y-1">
                <AnimatePresence>
                  {trees.map(task => (
                    <motion.li
                      key={task.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2 py-2 text-sm"
                      style={{ borderBottom: '1px solid rgba(237,228,211,0.08)' }}
                    >
                      <span className="flex-1 break-words line-through" style={{ color: '#c7bca7' }}>
                        {task.name}
                      </span>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="text-xs rounded-lg px-2 py-1 flex-shrink-0"
                        style={{
                          border: '1px solid rgba(237,228,211,0.2)',
                          color: '#c7bca7',
                          background: 'transparent',
                        }}
                      >
                        ✕
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>
        </div>

        {/* Clear garden */}
        {tasks.length > 0 && (
          <div className="text-center mt-6">
            <button
              onClick={async () => {
                if (!confirm('Clear your entire garden? This removes all seeds and trees.')) return;
                const ids = tasks.map(t => t.id);
                setTasks([]);
                for (const id of ids) {
                  await fetch(`${API}/api/healing-garden/tasks/${id}`, {
                    method: 'DELETE',
                    credentials: 'include',
                  });
                }
              }}
              className="text-xs underline opacity-50 hover:opacity-80 transition-opacity"
              style={{ color: '#c7bca7', background: 'none', border: 'none' }}
            >
              Clear entire garden
            </button>
          </div>
        )}
      </div>
      </div>
    </ModulePage>
  );
}
