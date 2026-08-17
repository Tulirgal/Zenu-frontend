import os

file_path = "src/components/home/HomeYourSpace.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Add imports
if "import { useState } from 'react';" not in content:
    content = content.replace("import Link from 'next/link';", "import { useState } from 'react';\nimport Link from 'next/link';\nimport { motion, AnimatePresence } from 'framer-motion';\nimport { ChevronDown } from 'lucide-react';")
else:
    # already has useState, add others if missing
    if "framer-motion" not in content:
        content = content.replace("import Link from 'next/link';", "import Link from 'next/link';\nimport { motion, AnimatePresence } from 'framer-motion';\nimport { ChevronDown } from 'lucide-react';")

# Define ALL_MODULES
all_modules = """const ALL_MODULES = [
  { id: 'breathing', name: 'Zen Breath Zone', description: 'A gentle rhythm for your nervous system.', route: '/breathing', icon: '🌬️' },
  { id: 'mindfulness', name: 'Meditate', description: 'Stillness in a few quiet minutes.', route: '/mindfulness', icon: '🧘' },
  { id: 'chatbot_seviyan', name: 'Seviyan', description: 'Talk it through with a calm companion.', route: '/chat', icon: '💬' },
  { id: 'diary', name: 'My Diary', description: 'Reflect on your day.', route: '/diary', icon: '📖' },
  { id: 'journal_gratitude', name: 'Gratitude Journal', description: 'Count your blessings.', route: '/gratitude', icon: '🌸' },
  { id: 'doodle_dreams', name: 'Doodle Dreams Studio', description: 'Soft patterns when words feel heavy.', route: '/doodle', icon: '🎨' },
  { id: 'bubble_canvas', name: 'Bubble Canvas', description: 'Pop stress away.', route: '/bubble', icon: '🫧' },
  { id: 'burst_it_out', name: 'Burst It Out', description: 'A short release when energy builds.', route: '/burst', icon: '💥' },
  { id: 'scribble_pad', name: 'Scribble Pad', description: 'Express freely.', route: '/scribble', icon: '✏️' },
  { id: 'healing_garden', name: 'Healing Garden', description: 'Grow your streak.', route: '/healing-garden', icon: '🌿' },
  { id: 'inner_compass', name: 'Inner Compass', description: 'Find your direction.', route: '/inner-compass', icon: '🧭' },
];"""

# Replace SpaceItem and SPACE_ITEMS with ALL_MODULES
import re
content = re.sub(r'type SpaceItem = \{.*?\};\n\nconst SPACE_ITEMS: SpaceItem\[\] = \[.*?\];', all_modules, content, flags=re.DOTALL)

# Add state hook inside HomeYourSpace
content = content.replace(
    "export function HomeYourSpace({ className }: { className?: string }) {",
    "export function HomeYourSpace({ className }: { className?: string }) {\n  const INITIAL_SHOW = 6;\n  const [showAll, setShowAll] = useState(false);\n  const visibleModules = showAll ? ALL_MODULES : ALL_MODULES.slice(0, INITIAL_SHOW);\n"
)

# Replace the grid content
old_grid = """      <div
        className={cn(
          'flex gap-3 overflow-x-auto pb-2 -mx-4 pl-4 pr-6 snap-x snap-mandatory',
          '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          'md:mx-0 md:px-0 md:pr-0 md:overflow-visible md:pb-0 md:snap-none',
          'md:grid md:grid-cols-3 lg:grid-cols-6 md:gap-3.5 lg:gap-4',
        )}
      >
        {SPACE_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'group relative overflow-hidden rounded-zen-xl',
              'bg-zen-surface border border-zen-border-soft/60',
              'transition-colors duration-zen-fast ease-zen-out',
              'active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-zen-primary focus-visible:outline-offset-2',
              // Mobile rail — ~2.5 cards visible on 390–430
              'shrink-0 w-[8.25rem] snap-start p-3.5 min-h-[8.5rem]',
              // Desktop — wider cards with room for descriptions
              'md:w-auto md:min-h-[11.5rem] md:p-5 md:shrink',
            )}
          >
            <div
              className={cn(
                'absolute -right-2 -bottom-3 h-16 w-16 rounded-full bg-gradient-to-tl to-transparent opacity-95 md:h-20 md:w-20 md:-right-3 md:-bottom-4',
                item.glowClass,
              )}
              aria-hidden="true"
            />
            <div className="relative z-10 flex h-full flex-col">
              <h3 className="font-ui text-[0.8125rem] font-semibold text-zen-fg tracking-tight leading-snug md:text-[1.0625rem]">
                {item.title}
              </h3>
              <p className="hidden md:block font-ui text-[0.875rem] text-zen-fg-muted mt-2 leading-snug line-clamp-2">
                {item.description}
              </p>
              <div className={cn('mt-auto pt-4 flex items-end justify-between', item.accentClass)}>
                <span
                  className={cn(
                    'inline-flex h-7 w-7 items-center justify-center rounded-full',
                    'bg-zen-bg-subtle/90 text-zen-fg-muted text-xs',
                    'group-hover:bg-zen-fg group-hover:text-white',
                    'transition-colors duration-zen-fast',
                  )}
                  aria-hidden="true"
                >
                  →
                </span>
                <SpaceMark identity={item.identity} compact />
              </div>
            </div>
          </Link>
        ))}
      </div>"""

new_grid = """      <div
        className={cn(
          'flex gap-3 overflow-x-auto pb-2 -mx-4 pl-4 pr-6 snap-x snap-mandatory',
          '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          'md:mx-0 md:px-0 md:pr-0 md:overflow-visible md:pb-0 md:snap-none',
          'md:grid md:grid-cols-3 lg:grid-cols-6 md:gap-3.5 lg:gap-4',
        )}
      >
        <AnimatePresence>
          {visibleModules.map((module, i) => {
            const glowClass = 'from-zen-emotion-calm-soft';
            const accentClass = 'text-zen-emotion-calm';

            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i >= INITIAL_SHOW ? (i - INITIAL_SHOW) * 0.05 : 0 }}
              >
                <Link
                  href={module.route}
                  className={cn(
                    'group relative overflow-hidden rounded-zen-xl',
                    'bg-zen-surface border border-zen-border-soft/60',
                    'transition-colors duration-zen-fast ease-zen-out',
                    'active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-zen-primary focus-visible:outline-offset-2',
                    // Mobile rail — ~2.5 cards visible on 390–430
                    'shrink-0 w-[8.25rem] snap-start p-3.5 min-h-[8.5rem]',
                    // Desktop — wider cards with room for descriptions
                    'md:w-auto md:min-h-[11.5rem] md:p-5 md:shrink',
                    'block h-full'
                  )}
                >
                  <div
                    className={cn(
                      'absolute -right-2 -bottom-3 h-16 w-16 rounded-full bg-gradient-to-tl to-transparent opacity-95 md:h-20 md:w-20 md:-right-3 md:-bottom-4',
                      glowClass,
                    )}
                    aria-hidden="true"
                  />
                  <div className="relative z-10 flex h-full flex-col">
                    <h3 className="font-ui text-[0.8125rem] font-semibold text-zen-fg tracking-tight leading-snug md:text-[1.0625rem]">
                      {module.name}
                    </h3>
                    <p className="hidden md:block font-ui text-[0.875rem] text-zen-fg-muted mt-2 leading-snug line-clamp-2">
                      {module.description}
                    </p>
                    <div className={cn('mt-auto pt-4 flex items-end justify-between', accentClass)}>
                      <span
                        className={cn(
                          'inline-flex h-7 w-7 items-center justify-center rounded-full',
                          'bg-zen-bg-subtle/90 text-zen-fg-muted text-xs',
                          'group-hover:bg-zen-fg group-hover:text-white',
                          'transition-colors duration-zen-fast',
                        )}
                        aria-hidden="true"
                      >
                        →
                      </span>
                      <span className="text-2xl leading-none opacity-80">{module.icon}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {!showAll && ALL_MODULES.length > INITIAL_SHOW && (
        <div className="flex justify-center mt-4 hidden md:flex">
          <motion.button
            onClick={() => setShowAll(true)}
            className={cn(
              'inline-flex items-center gap-2',
              'font-ui text-[0.875rem] text-zen-fg-muted hover:text-zen-fg',
              'px-5 py-2.5 rounded-zen-xl',
              'border border-zen-border-soft/55 bg-zen-surface',
              'hover:bg-zen-surface-raised transition-all duration-150',
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Show {ALL_MODULES.length - INITIAL_SHOW} more modules
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </motion.button>
        </div>
      )}

      {showAll && (
        <div className="flex justify-center mt-4 hidden md:flex">
          <button
            onClick={() => setShowAll(false)}
            className="font-ui text-[0.8125rem] text-zen-fg-subtle hover:text-zen-fg transition-colors underline"
          >
            Show less
          </button>
        </div>
      )}"""

content = content.replace(old_grid, new_grid)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Applied changes to HomeYourSpace.tsx")
