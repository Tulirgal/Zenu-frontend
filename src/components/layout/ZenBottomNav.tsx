"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Activity,
  Bot,
  LayoutDashboard,
  Palette,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { cn } from '@/lib/utils';
import { isZenFocusRoute } from '@/lib/zenFocus';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const BOTTOM_NAV = [
  { href: '/',           label: 'Home',     icon: LayoutDashboard, exact: true },
  { href: '/breathing',  label: 'Wellness', icon: Activity         },
  { href: '/journal',    label: 'Create',   icon: Palette          },
  { href: '/bubbles',    label: 'Explore',  icon: Sparkles         },
  { href: '/chat',       label: 'Seviyan',  icon: Bot              },
] as const;

const springIcon = { type: 'spring' as const, stiffness: 500, damping: 35 };

export default function ZenBottomNav() {
  const { user } = useAuth();
  const pathname = usePathname();
  const reducedMotion = usePrefersReducedMotion();

  if (!user || isZenFocusRoute(pathname)) return null;

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 md:hidden glass-floating border-t border-white/60 pb-safe"
      aria-label="Mobile navigation"
    >
      <div className="flex items-stretch h-16 min-h-16">
        {BOTTOM_NAV.map((item) => {
          const { href, label, icon: Icon } = item;
          const exact = 'exact' in item && item.exact;
          const active = exact
            ? pathname === href
            : (pathname?.startsWith(href) ?? false);

          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 flex-1 relative',
                'min-h-11 transition-colors duration-100',
                'focus-visible:outline-2 focus-visible:outline-zen-primary focus-visible:outline-offset-[-2px]',
                active ? 'text-zen-secondary' : 'text-zen-fg-subtle hover:text-zen-fg-muted',
              )}
            >
              {active && (
                reducedMotion ? (
                  <div className="absolute inset-x-3 inset-y-2 rounded-zen-md bg-zen-secondary-soft" />
                ) : (
                  <motion.div
                    layoutId="zen-bottom-nav-pill"
                    className="absolute inset-x-3 inset-y-2 rounded-zen-md bg-zen-secondary-soft"
                    transition={springIcon}
                  />
                )
              )}

              <motion.div
                animate={reducedMotion ? { scale: 1 } : { scale: active ? 1.06 : 1 }}
                transition={reducedMotion ? { duration: 0.15 } : springIcon}
                className="relative z-10"
              >
                <Icon
                  className={cn('h-5 w-5', active && 'fill-zen-secondary/10')}
                  strokeWidth={active ? 2.2 : 1.8}
                  aria-hidden="true"
                />
              </motion.div>

              <span
                className={cn(
                  'relative z-10 text-[10px] font-medium leading-none tracking-wide',
                  active ? 'text-zen-secondary' : 'text-zen-fg-subtle',
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
