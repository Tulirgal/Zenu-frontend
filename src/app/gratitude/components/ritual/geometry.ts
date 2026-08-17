'use client';

import { useCallback, useLayoutEffect, useState, type RefObject } from 'react';

export type Point = { x: number; y: number };

export function getElementCenter(el: Element | null): Point | null {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return {
    x: r.left + r.width / 2,
    y: r.top + r.height / 2,
  };
}

/** Live center of a ref element in viewport coordinates. */
export function useElementPoint(ref: RefObject<Element | null>, active = true): Point | null {
  const [point, setPoint] = useState<Point | null>(null);

  const measure = useCallback(() => {
    setPoint(getElementCenter(ref.current));
  }, [ref]);

  useLayoutEffect(() => {
    if (!active) return;
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [active, measure]);

  return point;
}

/** Quadratic bezier point for curved orb flight. */
export function quadPoint(t: number, a: Point, b: Point, c: Point): Point {
  const u = 1 - t;
  return {
    x: u * u * a.x + 2 * u * t * b.x + t * t * c.x,
    y: u * u * a.y + 2 * u * t * b.y + t * t * c.y,
  };
}

export function peakBetween(from: Point, to: Point, lift = 80): Point {
  return {
    x: (from.x + to.x) / 2,
    y: Math.min(from.y, to.y) - lift,
  };
}
