'use client';

import React, { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  BookOpen,
  Bot,
  ChevronDown,
  Flame,
  Heart,
  LogOut,
  Menu,
  Palette,
  PenTool,
  Sparkles,
  Wind,
  Zap,
  Compass,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { cn } from '@/lib/utils';
import { isZenFocusRoute } from '@/lib/zenFocus';
import { getTheme } from '@/lib/moduleThemes';
import {
  ZenSheet,
  ZenSheetContent,
  ZenSheetHeader,
  ZenSheetTitle,
} from '@/components/zen/ZenSheet';

function hexToHslTuple(hex: string): string {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

const NAV_GROUPS = [
  {
    label: 'Wellness',
    items: [
      { href: '/breathing',    label: 'Breathe',        icon: Wind,     description: 'Breathing exercises' },
      { href: '/meditation',   label: 'Meditate',       icon: Sparkles, description: 'Guided meditation sessions' },
    ],
  },
  {
    label: 'Create',
    items: [
      { href: '/journal',   label: 'Journal',     icon: BookOpen, description: 'Your private journal' },
      { href: '/gratitude', label: 'Gratitude',   icon: Heart,    description: 'Daily gratitude practice' },
      { href: '/art',       label: 'Art',         icon: Palette,  description: 'Mindful mandala creation' },
      { href: '/scribble',  label: 'Scribble',    icon: PenTool,  description: 'Free-form expressive drawing' },
    ],
  },
  {
    label: 'Explore',
    items: [
      { href: '/bubbles',      label: 'Bubbles',      icon: Zap,     description: 'Calming bubble experience' },
      { href: '/burst',        label: 'Burst',        icon: Flame,   description: 'Release stress with bursts' },
      { href: '/innercompass', label: 'Inner Compass', icon: Compass, description: 'Guided self-reflection' },
    ],
  },
] as const;

function AccordionGroup({
  group,
  isOpen,
  onToggle,
  isCollapsed,
  theme,
}: {
  group: typeof NAV_GROUPS[number];
  isOpen: boolean;
  onToggle: () => void;
  isCollapsed: boolean;
  theme: ReturnType<typeof getTheme>;
}) {
  const pathname = usePathname();
  const isGroupActive = group.items.some(i => pathname?.startsWith(i.href));

  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center gap-2 mb-4">
        <div className="h-px w-8 bg-zen-border-soft mb-2" />
        {group.items.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={cn(
                'flex items-center justify-center w-10 h-10 rounded-zen-md transition-all duration-200',
                !isActive && 'opacity-60 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10'
              )}
              style={
                isActive
                  ? { color: theme.accentColor, backgroundColor: theme.accentLight }
                  : { color: theme.textPrimary }
              }
            >
              <Icon className="h-5 w-5" />
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="mb-2">
      <button
        onClick={onToggle}
        className={cn(
          'w-full flex items-center justify-between px-3 py-2 rounded-zen-md transition-all duration-200',
          'text-[0.6875rem] font-semibold uppercase tracking-[0.1em]',
          !isGroupActive && 'opacity-70 hover:opacity-100'
        )}
        style={{
          color: isGroupActive ? theme.textPrimary : theme.textPrimary,
          opacity: isGroupActive ? 1 : undefined,
        }}
      >
        <span>{group.label}</span>
        <ChevronDown
          className={cn('h-3.5 w-3.5 transition-transform duration-200', isOpen && 'rotate-180')}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-0.5 pl-1 py-1">
              {group.items.map((item) => {
                const isActive = pathname?.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-zen-lg transition-all duration-200 text-[0.875rem]',
                      isActive ? 'font-medium' : 'opacity-70 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10'
                    )}
                    style={
                      isActive
                        ? { color: theme.accentColor, backgroundColor: theme.accentLight }
                        : { color: theme.textPrimary }
                    }
                  >
                    <Icon className="h-4 w-4 shrink-0 opacity-80" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ZenNavigation() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  // Expanded by default
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);

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
  
  const themeVars = useMemo(() => {
    const fg = hexToHslTuple(theme.textPrimary);
    const muted = hexToHslTuple(theme.textSecondary);
    return {
      '--zen-fg': fg,
      '--zen-fg-muted': muted,
      '--zen-fg-subtle': muted,
      '--zen-surface': 'transparent', // Let cardBg take over
    } as React.CSSProperties;
  }, [theme]);
  
  // Track open accordions. Expand all by default
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    'Wellness': true,
    'Create': true,
    'Explore': true,
  });

  const toggleGroup = (label: string) => {
    setOpenGroups(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const handleSignOut = useCallback(async () => {
    try {
      const { authClient } = await import('@/lib/authClient');
      await authClient.signOut();
    } catch (err) {
      console.error('Sign out failed', err);
    }
  }, []);

  const displayName = useMemo(() => {
    if (!user) return 'You';
    return user.username ?? user.fullName ?? user.email?.split('@')[0] ?? 'Traveler';
  }, [user]);

  if (isZenFocusRoute(pathname)) return null;

  if (!user) {
    return (
      <nav 
        className="sticky top-0 z-50 h-16 w-full bg-white border-b border-zen-border-soft" 
        aria-label="Main navigation"
      >
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group" aria-label="ZenU home">
            <div className="relative h-8 w-8">
              <Image src="/icons/icon-192.jpeg" alt="ZenU Logo" fill className="rounded-full object-cover shadow-zen-subtle" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-zen-primary to-zen-secondary opacity-0 blur-md group-hover:opacity-40 transition-opacity duration-300" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-zen-primary to-zen-secondary bg-clip-text text-transparent">
              ZenU
            </span>
          </Link>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href="/signin"
              className="px-3 py-1.5 text-sm font-medium text-zen-fg-muted hover:text-zen-fg transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="px-4 py-1.5 text-sm font-semibold bg-zen-primary text-white rounded-zen-full hover:bg-zen-primary-hover transition-colors shadow-zen-subtle"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      {/* Mobile top chrome — hamburger + logo + notification */}
      <nav
        className="md:hidden sticky top-0 z-50 h-14 pt-safe w-full flex items-center justify-between px-4 shrink-0 border-b shadow-zen-floating"
        style={{
          background: theme.cardBg,
          borderColor: theme.cardBorder,
          backdropFilter: 'blur(32px) saturate(220%)',
          WebkitBackdropFilter: 'blur(32px) saturate(220%)',
          ...themeVars,
        }}
        aria-label="Mobile header"
      >
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMobileNavOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-zen-full text-zen-fg-muted hover:bg-zen-bg-subtle hover:text-zen-fg active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-zen-primary focus-visible:outline-offset-2"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
          <Link href="/" className="flex items-center gap-2 min-w-0">
            <Image
              src="/icons/icon-192.jpeg"
              alt=""
              width={28}
              height={28}
              className="rounded-full"
            />
            <span className="text-base font-semibold tracking-tight text-zen-fg truncate">
              ZenU
            </span>
          </Link>
        </div>

        <div className="relative">
          <button
            type="button"
            aria-label="Notifications"
            aria-expanded={notifyOpen}
            onClick={() => setNotifyOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-zen-full text-zen-fg-muted hover:bg-zen-bg-subtle hover:text-zen-fg active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-zen-primary focus-visible:outline-offset-2"
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
          </button>
          {notifyOpen ? (
            <div
              role="dialog"
              aria-label="Notifications"
              className="absolute right-0 top-12 z-30 w-56 rounded-zen-xl border border-zen-border-soft bg-zen-surface p-4 shadow-zen-elevated"
            >
              <p className="zen-body-sm text-zen-fg-muted text-center py-1">
                You&apos;re all caught up.
              </p>
            </div>
          ) : null}
        </div>
      </nav>

      <ZenSheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <ZenSheetContent 
          side="left" 
          className="p-0 pt-safe flex flex-col shadow-zen-floating"
          style={{
            background: theme.cardBg,
            borderColor: theme.cardBorder,
            backdropFilter: 'blur(32px) saturate(220%)',
            WebkitBackdropFilter: 'blur(32px) saturate(220%)',
            ...themeVars,
          }}
        >
          <ZenSheetHeader className="px-5 pt-5 pb-3 text-left border-b" style={{ borderColor: theme.cardBorder }}>
            <ZenSheetTitle className="text-lg font-semibold text-zen-fg">Menu</ZenSheetTitle>
          </ZenSheetHeader>
          <div className="flex-1 overflow-y-auto px-3 py-4">
            <Link
              href="/"
              onClick={() => setMobileNavOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-zen-lg text-sm mb-1 transition-all duration-200',
                pathname === '/' ? 'font-medium' : 'opacity-70 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10'
              )}
              style={
                pathname === '/'
                  ? { color: theme.accentColor, backgroundColor: theme.accentLight }
                  : { color: theme.textPrimary }
              }
            >
              <Heart className="h-4 w-4" />
              Home
            </Link>
            <Link
              href="/chat"
              onClick={() => setMobileNavOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-zen-lg text-sm mb-4 transition-all duration-200',
                pathname?.startsWith('/chat') ? 'font-medium' : 'opacity-70 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10'
              )}
              style={
                pathname?.startsWith('/chat')
                  ? { color: theme.accentColor, backgroundColor: theme.accentLight }
                  : { color: theme.textPrimary }
              }
            >
              <Bot className="h-4 w-4" />
              Seviyan
            </Link>
            {NAV_GROUPS.map((group) => (
              <div key={group.label} className="mb-4">
                <p className="px-3 mb-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.1em]" style={{ color: theme.textPrimary, opacity: 0.6 }}>
                  {group.label}
                </p>
                <div className="flex flex-col gap-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = pathname?.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileNavOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-zen-lg text-sm transition-all duration-200',
                          active ? 'font-medium' : 'opacity-70 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10'
                        )}
                        style={
                          active
                            ? { color: theme.accentColor, backgroundColor: theme.accentLight }
                            : { color: theme.textPrimary }
                        }
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t p-4 pb-[max(1rem,env(safe-area-inset-bottom))]" style={{ borderColor: theme.cardBorder }}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0" style={{ backgroundColor: theme.accentLight, color: theme.accentColor }}>
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium truncate" style={{ color: theme.textPrimary }}>{displayName}</span>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={loading}
                className="p-2 rounded-full opacity-70 hover:opacity-100 hover:text-zen-danger hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                style={{ color: theme.textPrimary }}
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </ZenSheetContent>
      </ZenSheet>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 252 }}
        className="hidden md:flex flex-col h-full z-40 transition-all duration-300 shrink-0 overflow-hidden border-r shadow-zen-floating"
        style={{
          background: theme.cardBg,
          borderColor: theme.cardBorder,
          backdropFilter: 'blur(32px) saturate(220%)',
          WebkitBackdropFilter: 'blur(32px) saturate(220%)',
          ...themeVars,
        }}
      >
        <div className="flex items-center justify-between p-4 h-16 shrink-0">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden flex items-center gap-3 shrink-0"
              >
                <Link href="/" className="flex items-center gap-3 group shrink-0">
                  <div className="relative h-9 w-9 shrink-0">
                    <Image src="/icons/icon-192.jpeg" alt="ZenU Logo" fill className="rounded-full object-cover" />
                  </div>
                  <span className="text-xl font-semibold tracking-tight text-zen-fg font-ui">
                    ZenU
                  </span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-zen-md text-zen-fg-subtle hover:bg-zen-bg-subtle hover:text-zen-fg transition-colors mx-auto"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-3 custom-scrollbar">
          {user ? (
            <div className="flex flex-col gap-1">
              <Link
                href="/"
                className={cn(
                  'flex items-center gap-3 rounded-zen-lg transition-all duration-200',
                  isCollapsed ? 'justify-center w-10 h-10 mx-auto' : 'px-3 py-2',
                  pathname === '/' ? 'font-medium' : 'opacity-70 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10'
                )}
                style={
                  pathname === '/'
                    ? { color: theme.accentColor, backgroundColor: theme.accentLight }
                    : { color: theme.textPrimary }
                }
                title="Home"
              >
                <Heart className={cn('shrink-0', isCollapsed ? 'h-5 w-5' : 'h-4 w-4')} />
                {!isCollapsed && <span className="text-[0.875rem]">Home</span>}
              </Link>

              <Link
                href="/chat"
                className={cn(
                  'flex items-center gap-3 rounded-zen-lg transition-all duration-200 mb-3',
                  isCollapsed ? 'justify-center w-10 h-10 mx-auto' : 'px-3 py-2',
                  pathname?.startsWith('/chat') ? 'font-medium' : 'opacity-70 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10'
                )}
                style={
                  pathname?.startsWith('/chat')
                    ? { color: theme.accentColor, backgroundColor: theme.accentLight }
                    : { color: theme.textPrimary }
                }
                title="Seviyan"
              >
                <Bot className={cn('shrink-0', isCollapsed ? 'h-5 w-5' : 'h-4 w-4')} />
                {!isCollapsed && <span className="text-[0.875rem]">Seviyan</span>}
              </Link>

              {NAV_GROUPS.map((group) => (
                <AccordionGroup
                  key={group.label}
                  group={group}
                  isOpen={openGroups[group.label]}
                  onToggle={() => toggleGroup(group.label)}
                  isCollapsed={isCollapsed}
                  theme={theme}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3 px-2">
              {!isCollapsed && <p className="text-sm opacity-80 mb-2" style={{ color: theme.textPrimary }}>Welcome to ZenU</p>}
              <Link href="/signin" className={cn('flex justify-center px-4 py-2 text-sm font-medium rounded-zen-md opacity-80 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10', isCollapsed && 'px-0')} style={{ color: theme.textPrimary }}>
                {isCollapsed ? <LogOut className="h-5 w-5 rotate-180" /> : 'Sign in'}
              </Link>
              {!isCollapsed && (
                <Link href="/signup" className="px-4 py-2 text-sm text-center font-semibold bg-zen-primary text-white rounded-zen-md hover:bg-zen-primary-hover shadow-zen-subtle">
                  Get started
                </Link>
              )}
            </div>
          )}
        </div>

        {user && (
          <div className="shrink-0 p-3 overflow-hidden">
            {isCollapsed ? (
              <div className="flex flex-col gap-2 items-center">
                <div className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0" style={{ backgroundColor: theme.accentLight, color: theme.accentColor }}>
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={handleSignOut}
                  disabled={loading}
                  className="p-2 rounded-full opacity-70 hover:opacity-100 hover:text-zen-danger hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                  style={{ color: theme.textPrimary }}
                  title="Sign out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3 p-2 rounded-zen-xl w-full">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0" style={{ backgroundColor: theme.accentLight, color: theme.accentColor }}>
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col overflow-hidden" style={{ color: theme.textPrimary }}>
                    <span className="text-sm font-medium truncate">{displayName}</span>
                    <span className="text-xs opacity-60 truncate">Student</span>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  disabled={loading}
                  className="p-2 shrink-0 rounded-full opacity-70 hover:opacity-100 hover:text-zen-danger hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                  style={{ color: theme.textPrimary }}
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </motion.aside>
    </>
  );
}
