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
import { getTheme } from '@/lib/moduleThemes';
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

  const getModuleKey = () => {
    if (!pathname || pathname === '/') return 'home';
    if (pathname.startsWith('/breathing')) return 'breathing';
    if (pathname.startsWith('/meditation')) return 'mindfulness';
    if (pathname.startsWith('/journal')) return 'diary';
    if (pathname.startsWith('/art')) return 'doodle';
    if (pathname.startsWith('/healing-garden')) return 'healing-garden';
    if (pathname.startsWith('/innercompass')) return 'innercompass';
    return 'home';
  };

  const theme = getTheme(getModuleKey());

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 md:hidden border-t pb-safe shadow-zen-floating"
      style={{
        background: theme.cardBg,
        borderColor: theme.cardBorder,
        backdropFilter: 'blur(32px) saturate(220%)',
        WebkitBackdropFilter: 'blur(32px) saturate(220%)',
      }}
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
                'min-h-11 transition-all duration-200',
                'focus-visible:outline-2 focus-visible:outline-offset-[-2px]',
                !active && 'opacity-60 hover:opacity-100',
              )}
              style={{
                outlineColor: theme.accentColor,
                color: active ? theme.accentColor : theme.textPrimary,
              }}
            >
              {active && (
                reducedMotion ? (
                  <div className="absolute inset-x-3 inset-y-2 rounded-zen-md" style={{ background: theme.accentLight }} />
                ) : (
                  <motion.div
                    layoutId="zen-bottom-nav-pill"
                    className="absolute inset-x-3 inset-y-2 rounded-zen-md"
                    style={{ background: theme.accentLight }}
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
                  className="h-5 w-5"
                  style={{
                    fill: active ? theme.accentLight : 'transparent'
                  }}
                  strokeWidth={active ? 2.2 : 1.8}
                  aria-hidden="true"
                />
              </motion.div>

              <span
                className="relative z-10 text-[10px] font-medium leading-none tracking-wide"
                style={{ color: active ? theme.accentColor : theme.textPrimary }}
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
