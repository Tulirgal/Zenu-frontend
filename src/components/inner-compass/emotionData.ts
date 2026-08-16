export interface TertiaryData {
  affirmation: string;
  tip: string;
  modules: Array<{ name: string; route: string; emoji: string }>;
}

export type TertiaryEmotion = string;
export type SecondaryEmotion = string;
export type PrimaryEmotion =
  | 'angry'
  | 'disgusted'
  | 'sad'
  | 'happy'
  | 'surprised'
  | 'fearful'
  | 'bad';

export interface EmotionData {
  [key: string]: {
    [secondary: string]: TertiaryEmotion[];
  };
}

export const tertiaryData: Record<string, TertiaryData> = {
  // ANGRY subtree
  betrayed: {
    affirmation: "Being betrayed by someone you trusted is one of the deepest hurts. Your anger is not an overreaction — it is love meeting a broken promise. You are allowed to feel this fully.",
    tip: "Write out what happened without filtering yourself — getting it out of your head reduces its weight.",
    modules: [
      { name: "My Diary", route: "/diary", emoji: "📖" },
      { name: "Burst It OUT", route: "/burst", emoji: "💥" },
      { name: "Talk to Seviyan", route: "/chat", emoji: "💬" },
    ],
  },
  resentful: {
    affirmation: "Resentment builds when something you needed was not given. That is not your fault. Carrying it is exhausting though — writing it out can help you see what you actually need.",
    tip: "Journaling resentment without judgment often reveals the unmet need underneath.",
    modules: [
      { name: "My Diary", route: "/diary", emoji: "📖" },
      { name: "Burst It OUT", route: "/burst", emoji: "💥" },
      { name: "Gratitude Journal", route: "/gratitude", emoji: "🌸" },
    ],
  },
  disrespected: {
    affirmation: "Your dignity matters. Feeling disrespected is a signal that a real boundary was crossed. You are not being too sensitive — you are being human.",
    tip: "Physical release first, then clarity. Try breathing or the burst module before thinking it through.",
    modules: [
      { name: "Zen Breath Zone", route: "/breathing", emoji: "🌬️" },
      { name: "Burst It OUT", route: "/burst", emoji: "💥" },
      { name: "Talk to Seviyan", route: "/chat", emoji: "💬" },
    ],
  },
  ridiculed: {
    affirmation: "Being ridiculed stings because it targets the parts of you that are real. Remember — people who ridicule others are usually dealing with something inside themselves. This says nothing true about your worth.",
    tip: "Creative expression can help you reclaim your voice after it has been mocked.",
    modules: [
      { name: "Scribble Pad", route: "/scribble", emoji: "✏️" },
      { name: "Doodle Dreams", route: "/doodle", emoji: "🎨" },
      { name: "Talk to Seviyan", route: "/chat", emoji: "💬" },
    ],
  },
  indignant: {
    affirmation: "Indignation means your sense of fairness was violated. That moral clarity is a strength. Channel it — do not let it fester.",
    tip: "Writing out what should have happened can help you process what did.",
    modules: [
      { name: "My Diary", route: "/diary", emoji: "📖" },
      { name: "Burst It OUT", route: "/burst", emoji: "💥" },
      { name: "Zen Breath Zone", route: "/breathing", emoji: "🌬️" },
    ],
  },
  violated: {
    affirmation: "When a boundary is crossed without consent, the body and mind both react strongly. What you are feeling is a natural response to something that was not okay. Please be gentle with yourself.",
    tip: "Talking to someone — even an AI companion — can help you process this safely.",
    modules: [
      { name: "Talk to Seviyan", route: "/chat", emoji: "💬" },
      { name: "Mindfulness Studio", route: "/mindfulness", emoji: "🧘" },
      { name: "Zen Breath Zone", route: "/breathing", emoji: "🌬️" },
    ],
  },
  furious: {
    affirmation: "Fury is anger at full volume. Something important was seriously threatened or harmed. This intensity needs somewhere to go — give it a safe outlet before it burns you from the inside.",
    tip: "Physical release is the fastest way to discharge fury safely.",
    modules: [
      { name: "Burst It OUT", route: "/burst", emoji: "💥" },
      { name: "Bubble Canvas", route: "/bubble", emoji: "🫧" },
      { name: "Zen Breath Zone", route: "/breathing", emoji: "🌬️" },
    ],
  },
  jealous: {
    affirmation: "Jealousy often points to something you deeply want for yourself. It is not a character flaw — it is information. What is it showing you that you actually desire?",
    tip: "Writing honestly about jealousy without shame is surprisingly clarifying.",
    modules: [
      { name: "My Diary", route: "/diary", emoji: "📖" },
      { name: "Talk to Seviyan", route: "/chat", emoji: "💬" },
      { name: "Gratitude Journal", route: "/gratitude", emoji: "🌸" },
    ],
  },
  provoked: {
    affirmation: "Something or someone pushed your buttons deliberately or carelessly. Your reaction is human. Taking a moment before responding is not weakness — it is strategy.",
    tip: "A breathing reset gives you the pause you need before reacting.",
    modules: [
      { name: "Zen Breath Zone", route: "/breathing", emoji: "🌬️" },
      { name: "Burst It OUT", route: "/burst", emoji: "💥" },
      { name: "Mindfulness Studio", route: "/mindfulness", emoji: "🧘" },
    ],
  },
  hostile: {
    affirmation: "Hostility builds when we have felt threatened for too long. Your guard is up because something taught you it needed to be. That protection made sense once — and you are safe enough right now to let a little of it down.",
    tip: "Mindfulness helps lower the defensive wall without making you vulnerable.",
    modules: [
      { name: "Mindfulness Studio", route: "/mindfulness", emoji: "🧘" },
      { name: "Zen Breath Zone", route: "/breathing", emoji: "🌬️" },
      { name: "Talk to Seviyan", route: "/chat", emoji: "💬" },
    ],
  },
  infuriated: {
    affirmation: "Being infuriated means something crossed a line that really mattered. That reaction is real and valid. Find a way to release the energy safely before making any decisions.",
    tip: "Physical expression of emotion — scribbling, bursting, breathing — comes before thinking.",
    modules: [
      { name: "Burst It OUT", route: "/burst", emoji: "💥" },
      { name: "Scribble Pad", route: "/scribble", emoji: "✏️" },
      { name: "Zen Breath Zone", route: "/breathing", emoji: "🌬️" },
    ],
  },
  annoyed: {
    affirmation: "Annoyance is friction — small things rubbing the wrong way. It is often a sign you need more space, rest, or simply a reset. Give yourself permission to step away for a moment.",
    tip: "Even three minutes of something calm can dissolve annoyance completely.",
    modules: [
      { name: "Bubble Canvas", route: "/bubble", emoji: "🫧" },
      { name: "Zen Breath Zone", route: "/breathing", emoji: "🌬️" },
      { name: "Doodle Dreams", route: "/doodle", emoji: "🎨" },
    ],
  },
  withdrawn: {
    affirmation: "Withdrawing is sometimes the wisest thing — your system is protecting you. Honour that need for space while also keeping one small thread of connection alive.",
    tip: "Gentle solo activities keep you present without demanding too much.",
    modules: [
      { name: "Healing Garden", route: "/healing-garden", emoji: "🌿" },
      { name: "Scribble Pad", route: "/scribble", emoji: "✏️" },
      { name: "My Diary", route: "/diary", emoji: "📖" },
    ],
  },
  numb: {
    affirmation: "Numbness is often what happens after feeling too much for too long — your mind's protection. You do not need to force yourself to feel. Be here gently, without pressure.",
    tip: "Gentle sensory experiences — slow breathing, soft visuals — help you reconnect gradually.",
    modules: [
      { name: "Zen Breath Zone", route: "/breathing", emoji: "🌬️" },
      { name: "Bubble Canvas", route: "/bubble", emoji: "🫧" },
      { name: "Talk to Seviyan", route: "/chat", emoji: "💬" },
    ],
  },
  skeptical: {
    affirmation: "Skepticism means your mind is protecting you from being misled. That instinct has value. Make sure it is protecting you and not closing you off from things that could genuinely help.",
    tip: "Writing out what you are skeptical about helps separate useful caution from fear.",
    modules: [
      { name: "My Diary", route: "/diary", emoji: "📖" },
      { name: "Talk to Seviyan", route: "/chat", emoji: "💬" },
    ],
  },
  dismissive: {
    affirmation: "When we feel dismissive, it is often because something is hitting too close to something we are not ready to look at. That is okay. You do not have to open every door today.",
    tip: "Mindfulness helps you observe your own reactions without judgment.",
    modules: [
      { name: "Mindfulness Studio", route: "/mindfulness", emoji: "🧘" },
      { name: "My Diary", route: "/diary", emoji: "📖" },
    ],
  },
  // DISGUSTED subtree
  judgmental: {
    affirmation: "Noticing that you are being judgmental is itself a moment of self-awareness — most people do not catch it. Ask yourself what standard is not being met, and whether that standard is fair to apply here.",
    tip: "Journaling your judgments without acting on them is a healthy release.",
    modules: [
      { name: "My Diary", route: "/diary", emoji: "📖" },
      { name: "Mindfulness Studio", route: "/mindfulness", emoji: "🧘" },
    ],
  },
  embarrassed: {
    affirmation: "Embarrassment is the pain of feeling seen in a way we did not choose. It fades faster than it feels like it will. You are not defined by this moment.",
    tip: "Writing about embarrassment privately often makes it lose its power.",
    modules: [
      { name: "My Diary", route: "/diary", emoji: "📖" },
      { name: "Talk to Seviyan", route: "/chat", emoji: "💬" },
      { name: "Gratitude Journal", route: "/gratitude", emoji: "🌸" },
    ],
  },
  appalled: {
    affirmation: "Something crossed a moral line for you — your values reacted strongly. That reaction reflects the quality of your character. Take a breath and give yourself space to process this.",
    tip: "Breathe first. Moral shock needs time to settle before you can respond well.",
    modules: [
      { name: "Zen Breath Zone", route: "/breathing", emoji: "🌬️" },
      { name: "My Diary", route: "/diary", emoji: "📖" },
    ],
  },
  revolted: {
    affirmation: "Revulsion is a strong signal from your gut — something deeply conflicts with your values or sense of safety. Trust that signal. You are allowed to remove yourself from what feels wrong.",
    tip: "Grounding your body helps after a strong visceral reaction.",
    modules: [
      { name: "Mindfulness Studio", route: "/mindfulness", emoji: "🧘" },
      { name: "Zen Breath Zone", route: "/breathing", emoji: "🌬️" },
    ],
  },
  nauseated: {
    affirmation: "When something makes you feel sick with disgust, your body is communicating something your mind might be struggling to put into words. Listen to it — and give yourself space.",
    tip: "Physical calm first — breathing helps settle both body and mind.",
    modules: [
      { name: "Zen Breath Zone", route: "/breathing", emoji: "🌬️" },
      { name: "Bubble Canvas", route: "/bubble", emoji: "🫧" },
    ],
  },
  detestable: {
    affirmation: "Feeling detestable about yourself is usually a harsh inner critic speaking — not the truth. You are not your worst moment or your worst thought. You are the one who noticed and wants to do better.",
    tip: "Gratitude directed inward — even for small things — gently counters self-loathing.",
    modules: [
      { name: "Talk to Seviyan", route: "/chat", emoji: "💬" },
      { name: "Gratitude Journal", route: "/gratitude", emoji: "🌸" },
      { name: "Mindfulness Studio", route: "/mindfulness", emoji: "🧘" },
    ],
  },
  horrified: {
    affirmation: "Horror is the mind encountering something it was not prepared for. Give yourself time. You do not have to make sense of it right now — just let your nervous system settle.",
    tip: "Safe, gentle inputs help your system recover from shock.",
    modules: [
      { name: "Mindfulness Studio", route: "/mindfulness", emoji: "🧘" },
      { name: "Zen Breath Zone", route: "/breathing", emoji: "🌬️" },
      { name: "Talk to Seviyan", route: "/chat", emoji: "💬" },
    ],
  },
  hesitant: {
    affirmation: "Hesitation is wisdom in disguise — your instincts are asking you to slow down before you commit. That is not weakness. That is good judgment. Take the time you need.",
    tip: "Writing out what is making you hesitate often makes the decision clearer.",
    modules: [
      { name: "My Diary", route: "/diary", emoji: "📖" },
      { name: "Talk to Seviyan", route: "/chat", emoji: "💬" },
    ],
  },
  // SAD subtree
  disappointed: {
    affirmation: "Disappointment means you cared enough to hope. That is not weakness — it is heart. Give yourself room to feel this without rushing past it.",
    tip: "Writing about what you hoped for can help you process what happened.",
    modules: [
      { name: "Gratitude Journal", route: "/gratitude", emoji: "🌸" },
      { name: "My Diary", route: "/diary", emoji: "📖" },
      { name: "Talk to Seviyan", route: "/chat", emoji: "💬" },
    ],
  },
  inferior: {
    affirmation: "Feeling inferior is usually comparison doing its cruelest work. You are not behind — you are on your own path, which looks different from everyone else's by design.",
    tip: "Gratitude toward your own progress — however small — rebuilds self-worth.",
    modules: [
      { name: "Gratitude Journal", route: "/gratitude", emoji: "🌸" },
      { name: "Talk to Seviyan", route: "/chat", emoji: "💬" },
      { name: "Healing Garden", route: "/healing-garden", emoji: "🌿" },
    ],
  },
  empty: {
    affirmation: "Emptiness is exhausting in a quiet way — it asks something of you without giving anything. You do not have to fill it immediately. Sit with it gently, and let something small come in.",
    tip: "Creative expression can fill emptiness without demanding words for it.",
    modules: [
      { name: "Doodle Dreams", route: "/doodle", emoji: "🎨" },
      { name: "Scribble Pad", route: "/scribble", emoji: "✏️" },
      { name: "Talk to Seviyan", route: "/chat", emoji: "💬" },
    ],
  },
  powerless: {
    affirmation: "Powerlessness is one of the heaviest feelings — it means something important is beyond your control. What is in your control right now, even if it is very small? Start there.",
    tip: "The Healing Garden is about doing small completable things — it directly rebuilds a sense of agency.",
    modules: [
      { name: "Healing Garden", route: "/healing-garden", emoji: "🌿" },
      { name: "Talk to Seviyan", route: "/chat", emoji: "💬" },
      { name: "Zen Breath Zone", route: "/breathing", emoji: "🌬️" },
    ],
  },
  grief: {
    affirmation: "Grief has no timeline and no right way. Whatever you are feeling — numbness, waves of pain, strange calm — it is all part of love not knowing where to go. You are doing it right.",
    tip: "Let creative expression hold what words cannot.",
    modules: [
      { name: "Scribble Pad", route: "/scribble", emoji: "✏️" },
      { name: "My Diary", route: "/diary", emoji: "📖" },
      { name: "Talk to Seviyan", route: "/chat", emoji: "💬" },
    ],
  },
  fragile: {
    affirmation: "Feeling fragile means something has already taken a lot from you. That is real — you have been carrying more than people know. Being gentle with yourself right now is not weakness. It is the only wise response.",
    tip: "Softness heals fragility — try something calm and without pressure.",
    modules: [
      { name: "Mindfulness Studio", route: "/mindfulness", emoji: "🧘" },
      { name: "Bubble Canvas", route: "/bubble", emoji: "🫧" },
      { name: "Talk to Seviyan", route: "/chat", emoji: "💬" },
    ],
  },
  rejected: {
    affirmation: "Rejection hurts because belonging matters — it is a fundamental human need. Being turned away from something you wanted says nothing permanent about your worth. It says something did not fit, right now, in this context.",
    tip: "Counter the rejection story with small evidence of where you do belong.",
    modules: [
      { name: "Gratitude Journal", route: "/gratitude", emoji: "🌸" },
      { name: "Talk to Seviyan", route: "/chat", emoji: "💬" },
      { name: "My Diary", route: "/diary", emoji: "📖" },
    ],
  },
  abandoned: {
    affirmation: "Feeling abandoned touches something very deep — a core need for safety and belonging. You are not actually alone right now, even if it feels that way. Reach toward something or someone, even gently.",
    tip: "Connection — even small — is the antidote to abandonment.",
    modules: [
      { name: "Talk to Seviyan", route: "/chat", emoji: "💬" },
      { name: "Gratitude Journal", route: "/gratitude", emoji: "🌸" },
      { name: "Healing Garden", route: "/healing-garden", emoji: "🌿" },
    ],
  },
  isolated: {
    affirmation: "Isolation makes the world feel very small and very far away. You are not as alone as it feels right now. Something small and warm can help bridge that distance.",
    tip: "Even a short conversation helps — connection does not have to be big.",
    modules: [
      { name: "Talk to Seviyan", route: "/chat", emoji: "💬" },
      { name: "Gratitude Journal", route: "/gratitude", emoji: "🌸" },
      { name: "Healing Garden", route: "/healing-garden", emoji: "🌿" },
    ],
  },
  // HAPPY subtree
  inspired: {
    affirmation: "Inspiration is rare and real — something unlocked in you. Do not let it pass without capturing it. Act on even a small part of it right now, while the feeling is alive.",
    tip: "Create something — anything — before the inspiration fades.",
    modules: [
      { name: "Doodle Dreams", route: "/doodle", emoji: "🎨" },
      { name: "My Diary", route: "/diary", emoji: "📖" },
      { name: "Healing Garden", route: "/healing-garden", emoji: "🌿" },
    ],
  },
  hopeful: {
    affirmation: "Hope is a choice your heart is making right now. That is a brave and beautiful thing. Write it down so future-you can find it when it is needed most.",
    tip: "Capturing hope in writing makes it more durable.",
    modules: [
      { name: "Gratitude Journal", route: "/gratitude", emoji: "🌸" },
      { name: "My Diary", route: "/diary", emoji: "📖" },
      { name: "Healing Garden", route: "/healing-garden", emoji: "🌿" },
    ],
  },
  playful: {
    affirmation: "Playfulness is one of the most healing states a human can be in. Do not apologize for it — lean into it. Make something fun and let yourself enjoy it fully.",
    tip: "Play for its own sake — no goal, no product, just enjoyment.",
    modules: [
      { name: "Bubble Canvas", route: "/bubble", emoji: "🫧" },
      { name: "Doodle Dreams", route: "/doodle", emoji: "🎨" },
      { name: "Scribble Pad", route: "/scribble", emoji: "✏️" },
    ],
  },
  affectionate: {
    affirmation: "Feeling affectionate means your heart is open right now — that is a gift. Let yourself feel it fully and if you can, direct it somewhere: to a person, to yourself, to something you love.",
    tip: "Write about who or what you feel this toward.",
    modules: [
      { name: "Gratitude Journal", route: "/gratitude", emoji: "🌸" },
      { name: "My Diary", route: "/diary", emoji: "📖" },
    ],
  },
  loving: {
    affirmation: "Love is the most powerful thing you carry. When you feel it clearly, that is worth paying attention to and expressing — even quietly, even just on paper.",
    tip: "Gratitude journaling channels love into something lasting.",
    modules: [
      { name: "Gratitude Journal", route: "/gratitude", emoji: "🌸" },
      { name: "My Diary", route: "/diary", emoji: "📖" },
      { name: "Healing Garden", route: "/healing-garden", emoji: "🌿" },
    ],
  },
  content: {
    affirmation: "Contentment is underrated — it is the feeling of enough, right now. Stay here a little longer. Let this settle into your body. You earned this peace.",
    tip: "Deepen this contentment with a gentle mindfulness practice.",
    modules: [
      { name: "Mindfulness Studio", route: "/mindfulness", emoji: "🧘" },
      { name: "Gratitude Journal", route: "/gratitude", emoji: "🌸" },
      { name: "Healing Garden", route: "/healing-garden", emoji: "🌿" },
    ],
  },
  courageous: {
    affirmation: "You are feeling brave right now — that is not an accident. Something in you is ready. Move while this window is open. Courage is a muscle and you are using it.",
    tip: "Plant a big task in your Healing Garden while you feel this way.",
    modules: [
      { name: "Healing Garden", route: "/healing-garden", emoji: "🌿" },
      { name: "My Diary", route: "/diary", emoji: "📖" },
    ],
  },
  creative: {
    affirmation: "Creative energy is flowing right now — that is precious. Everything you make while feeling this way will have something real in it. Use this window.",
    tip: "Start something new — even a small experiment — right now.",
    modules: [
      { name: "Doodle Dreams", route: "/doodle", emoji: "🎨" },
      { name: "Scribble Pad", route: "/scribble", emoji: "✏️" },
      { name: "Healing Garden", route: "/healing-garden", emoji: "🌿" },
    ],
  },
  respected: {
    affirmation: "Feeling respected means something was given to you that you deserved — acknowledgment of your worth. Sit with that. Let it be real. You can be proud of what earned this.",
    tip: "Write about what you did or who you are that brought this about.",
    modules: [
      { name: "Gratitude Journal", route: "/gratitude", emoji: "🌸" },
      { name: "My Diary", route: "/diary", emoji: "📖" },
    ],
  },
  valued: {
    affirmation: "Being valued is one of the deepest needs a person has — and right now it is being met. Notice this fully. Remember how it feels so you can seek it out again.",
    tip: "Capture this feeling before it fades.",
    modules: [
      { name: "Gratitude Journal", route: "/gratitude", emoji: "🌸" },
      { name: "My Diary", route: "/diary", emoji: "📖" },
      { name: "Healing Garden", route: "/healing-garden", emoji: "🌿" },
    ],
  },
  successful: {
    affirmation: "You did something and it worked. Do not rush past this — let yourself feel it completely. Success that is not acknowledged does not motivate the next attempt.",
    tip: "Mark this in your Healing Garden as a tree grown.",
    modules: [
      { name: "Healing Garden", route: "/healing-garden", emoji: "🌿" },
      { name: "Gratitude Journal", route: "/gratitude", emoji: "🌸" },
      { name: "My Diary", route: "/diary", emoji: "📖" },
    ],
  },
  confident: {
    affirmation: "Confidence is not the absence of doubt — it is moving forward despite it. You feel ready right now. Trust that. Use this energy while it is available to you.",
    tip: "Write down what you are about to do while you feel this way.",
    modules: [
      { name: "Healing Garden", route: "/healing-garden", emoji: "🌿" },
      { name: "My Diary", route: "/diary", emoji: "📖" },
    ],
  },
  curious: {
    affirmation: "Curiosity is one of the most alive feelings there is — it means you are engaged with the world and want to understand it better. Follow this thread. See where it goes.",
    tip: "Make something based on what you are curious about.",
    modules: [
      { name: "Doodle Dreams", route: "/doodle", emoji: "🎨" },
      { name: "My Diary", route: "/diary", emoji: "📖" },
    ],
  },
  inquisitive: {
    affirmation: "Your mind is asking questions — that is intelligence doing its job. Write the questions down. Some of them hold more than you realize.",
    tip: "Questions journaled often answer themselves over time.",
    modules: [
      { name: "My Diary", route: "/diary", emoji: "📖" },
      { name: "Talk to Seviyan", route: "/chat", emoji: "💬" },
    ],
  },
  free: {
    affirmation: "Freedom is rare and worth celebrating. Something that was heavy has lifted. Breathe into this space — it belongs to you right now.",
    tip: "Create freely — no rules, no judgment, just expression.",
    modules: [
      { name: "Scribble Pad", route: "/scribble", emoji: "✏️" },
      { name: "Doodle Dreams", route: "/doodle", emoji: "🎨" },
      { name: "Gratitude Journal", route: "/gratitude", emoji: "🌸" },
    ],
  },
  excited: {
    affirmation: "That spark of excitement is rare and real — let it breathe. Your energy right now is a gift. Channel it into something that matters to you before it disperses.",
    tip: "Use this energy to plant something new in your Healing Garden.",
    modules: [
      { name: "Healing Garden", route: "/healing-garden", emoji: "🌿" },
      { name: "Doodle Dreams", route: "/doodle", emoji: "🎨" },
      { name: "Gratitude Journal", route: "/gratitude", emoji: "🌸" },
    ],
  },
  // SURPRISED subtree
  shocked: {
    affirmation: "Your system just received something it was not ready for. That is okay. You do not need to react immediately. Take five slow breaths and let your mind catch up to what happened.",
    tip: "Your nervous system needs to settle before you can think clearly.",
    modules: [
      { name: "Zen Breath Zone", route: "/breathing", emoji: "🌬️" },
      { name: "Mindfulness Studio", route: "/mindfulness", emoji: "🧘" },
    ],
  },
  dismayed: {
    affirmation: "Dismay is the feeling of seeing something you hoped would be different turn out not to be. Give yourself time to adjust your expectations. This is a real process that takes real time.",
    tip: "Writing out what you hoped for versus what happened brings clarity.",
    modules: [
      { name: "My Diary", route: "/diary", emoji: "📖" },
      { name: "Talk to Seviyan", route: "/chat", emoji: "💬" },
    ],
  },
  disillusioned: {
    affirmation: "Disillusionment is painful but it is also growth — you are seeing something more clearly than you did before. The clarity, even though it hurts, is worth having.",
    tip: "Journal what you thought versus what you now know — this processes the gap.",
    modules: [
      { name: "My Diary", route: "/diary", emoji: "📖" },
      { name: "Talk to Seviyan", route: "/chat", emoji: "💬" },
      { name: "Gratitude Journal", route: "/gratitude", emoji: "🌸" },
    ],
  },
  perplexed: {
    affirmation: "Perplexity means something is more complex than it first appeared — and your mind is working hard to make sense of it. That is good thinking. Give it the time it needs.",
    tip: "Writing out what you do and do not understand often brings clarity.",
    modules: [
      { name: "My Diary", route: "/diary", emoji: "📖" },
      { name: "Talk to Seviyan", route: "/chat", emoji: "💬" },
    ],
  },
  awe: {
    affirmation: "Awe is one of the most expansive feelings a human can have — it means something made you feel small in the best possible way. The world is bigger and more beautiful than ordinary life lets you see. Stay here a moment.",
    tip: "Capture this feeling — it is worth preserving.",
    modules: [
      { name: "My Diary", route: "/diary", emoji: "📖" },
      { name: "Doodle Dreams", route: "/doodle", emoji: "🎨" },
      { name: "Gratitude Journal", route: "/gratitude", emoji: "🌸" },
    ],
  },
  astonished: {
    affirmation: "Something exceeded what you thought was possible — and that is genuinely wonderful. Let that expand your sense of what is possible for you too.",
    tip: "Write this moment down so future-you can find it.",
    modules: [
      { name: "Gratitude Journal", route: "/gratitude", emoji: "🌸" },
      { name: "My Diary", route: "/diary", emoji: "📖" },
    ],
  },
  eager: {
    affirmation: "Eagerness is energy leaning forward into something good. That momentum is valuable — use it. Start something right now, even something small.",
    tip: "Plant a new task in your Healing Garden while this energy is live.",
    modules: [
      { name: "Healing Garden", route: "/healing-garden", emoji: "🌿" },
      { name: "Doodle Dreams", route: "/doodle", emoji: "🎨" },
    ],
  },
  energetic: {
    affirmation: "You have energy right now — that is a resource. Point it at something that matters to you. This window is worth using.",
    tip: "Creative bursts are most productive when you actually start — even imperfectly.",
    modules: [
      { name: "Healing Garden", route: "/healing-garden", emoji: "🌿" },
      { name: "Scribble Pad", route: "/scribble", emoji: "✏️" },
      { name: "Burst It OUT", route: "/burst", emoji: "💥" },
    ],
  },
  // FEARFUL subtree
  helpless: {
    affirmation: "Feeling helpless means you care about an outcome that feels beyond your reach. That caring is real and valid. Start with what is in your control — even the smallest action rebuilds agency.",
    tip: "The Healing Garden is specifically designed to rebuild your sense of agency through small completable tasks.",
    modules: [
      { name: "Healing Garden", route: "/healing-garden", emoji: "🌿" },
      { name: "Talk to Seviyan", route: "/chat", emoji: "💬" },
      { name: "Zen Breath Zone", route: "/breathing", emoji: "🌬️" },
    ],
  },
  frightened: {
    affirmation: "Fear is not a sign of weakness — it means something matters to you. You are braver than you feel right now. One step at a time is enough. You do not have to handle everything at once.",
    tip: "Ground yourself in your body before doing anything else.",
    modules: [
      { name: "Zen Breath Zone", route: "/breathing", emoji: "🌬️" },
      { name: "Talk to Seviyan", route: "/chat", emoji: "💬" },
      { name: "Mindfulness Studio", route: "/mindfulness", emoji: "🧘" },
    ],
  },
  overwhelmed: {
    affirmation: "You are carrying a lot — too much at once. That is genuinely hard and it makes sense that you feel this way. You do not need to handle it all right now. Just this breath, just this moment.",
    tip: "Grounding yourself in the present moment first makes everything else more manageable.",
    modules: [
      { name: "Zen Breath Zone", route: "/breathing", emoji: "🌬️" },
      { name: "Mindfulness Studio", route: "/mindfulness", emoji: "🧘" },
      { name: "Talk to Seviyan", route: "/chat", emoji: "💬" },
    ],
  },
  worried: {
    affirmation: "Worry means you care about an outcome — that caring is love or responsibility showing up as tension. Write out what you are worried about and let it breathe outside of your head.",
    tip: "Getting worries onto paper reduces their power over you significantly.",
    modules: [
      { name: "My Diary", route: "/diary", emoji: "📖" },
      { name: "Zen Breath Zone", route: "/breathing", emoji: "🌬️" },
      { name: "Talk to Seviyan", route: "/chat", emoji: "💬" },
    ],
  },
  inadequate: {
    affirmation: "Feeling inadequate is often the gap between where you are and where you think you should be. That gap is almost always smaller than it feels, and the benchmark is usually unfair. You are enough at this stage.",
    tip: "Gratitude toward your own progress rebuilds self-worth gently.",
    modules: [
      { name: "Gratitude Journal", route: "/gratitude", emoji: "🌸" },
      { name: "Talk to Seviyan", route: "/chat", emoji: "💬" },
      { name: "Healing Garden", route: "/healing-garden", emoji: "🌿" },
    ],
  },
  worthless: {
    affirmation: "That voice telling you that you are worthless is lying. It is your exhausted, hurt mind — not the truth about you. You matter in ways you cannot fully see right now. Please talk to someone.",
    tip: "Please reach out — to Seviyan, to someone you trust, or to a counsellor.",
    modules: [
      { name: "Talk to Seviyan", route: "/chat", emoji: "💬" },
      { name: "Gratitude Journal", route: "/gratitude", emoji: "🌸" },
      { name: "Mindfulness Studio", route: "/mindfulness", emoji: "🧘" },
    ],
  },
  insignificant: {
    affirmation: "Feeling insignificant is one of loneliness's cruelest tricks. The fact that you notice this and named it means you are more self-aware than most. That awareness itself is significant.",
    tip: "Making something — anything — reminds you that you can affect the world.",
    modules: [
      { name: "Healing Garden", route: "/healing-garden", emoji: "🌿" },
      { name: "Scribble Pad", route: "/scribble", emoji: "✏️" },
      { name: "Talk to Seviyan", route: "/chat", emoji: "💬" },
    ],
  },
  excluded: {
    affirmation: "Being excluded triggers something very primal — the need to belong is as real as hunger. This pain is valid. It does not mean you do not deserve to be included — it means the right space has not found you yet.",
    tip: "Small acts of self-belonging help while you wait for the right community.",
    modules: [
      { name: "Talk to Seviyan", route: "/chat", emoji: "💬" },
      { name: "Gratitude Journal", route: "/gratitude", emoji: "🌸" },
      { name: "My Diary", route: "/diary", emoji: "📖" },
    ],
  },
  persecuted: {
    affirmation: "Feeling like the world is against you is an exhausting place to be. Whether it is truly external or partly internal, the pain is real. Please talk to someone you trust about what is happening.",
    tip: "An honest conversation — with Seviyan or someone you trust — helps reality-check this feeling.",
    modules: [
      { name: "Talk to Seviyan", route: "/chat", emoji: "💬" },
      { name: "My Diary", route: "/diary", emoji: "📖" },
      { name: "Mindfulness Studio", route: "/mindfulness", emoji: "🧘" },
    ],
  },
  nervous: {
    affirmation: "Nervousness means something ahead matters to you. That is not a bad sign — it means you care. Channel this energy forward. Preparation and one breath at a time.",
    tip: "Breathing exercises are clinically proven to reduce pre-event nervous system activation.",
    modules: [
      { name: "Zen Breath Zone", route: "/breathing", emoji: "🌬️" },
      { name: "Mindfulness Studio", route: "/mindfulness", emoji: "🧘" },
      { name: "Bubble Canvas", route: "/bubble", emoji: "🫧" },
    ],
  },
  exposed: {
    affirmation: "Feeling exposed means your guard came down — whether by choice or not. That vulnerability is not a flaw. It is the cost of being real. Be gentle with yourself while you rebuild.",
    tip: "Gentle, private expression helps you process without further exposure.",
    modules: [
      { name: "My Diary", route: "/diary", emoji: "📖" },
      { name: "Scribble Pad", route: "/scribble", emoji: "✏️" },
      { name: "Talk to Seviyan", route: "/chat", emoji: "💬" },
    ],
  },
  // BAD subtree
  indifferent: {
    affirmation: "Indifference is sometimes protection — when everything has felt too much for too long, the mind steps back. That is okay. You do not have to care about everything right now.",
    tip: "Gentle, low-pressure activities can help you reconnect without forcing it.",
    modules: [
      { name: "Bubble Canvas", route: "/bubble", emoji: "🫧" },
      { name: "Scribble Pad", route: "/scribble", emoji: "✏️" },
      { name: "Healing Garden", route: "/healing-garden", emoji: "🌿" },
    ],
  },
  apathetic: {
    affirmation: "Apathy often follows a period of over-caring — you gave too much and now there is nothing left. This is your mind asking for rest, not failing. Give yourself genuine rest without guilt.",
    tip: "Rest is not laziness. Your system needs to replenish before you can care again.",
    modules: [
      { name: "Mindfulness Studio", route: "/mindfulness", emoji: "🧘" },
      { name: "Zen Breath Zone", route: "/breathing", emoji: "🌬️" },
      { name: "Bubble Canvas", route: "/bubble", emoji: "🫧" },
    ],
  },
  pressured: {
    affirmation: "External pressure — from deadlines, people, expectations — compresses you from the outside. Name what is pressuring you, then separate what is actually urgent from what just feels urgent.",
    tip: "Writing out all your pressures and tagging them as real vs perceived reduces the pile significantly.",
    modules: [
      { name: "My Diary", route: "/diary", emoji: "📖" },
      { name: "Zen Breath Zone", route: "/breathing", emoji: "🌬️" },
      { name: "Healing Garden", route: "/healing-garden", emoji: "🌿" },
    ],
  },
  rushed: {
    affirmation: "Feeling rushed is your body telling you the pace is not sustainable. Something needs to slow down — even briefly. Thirty seconds of actual stillness right now will help more than you expect.",
    tip: "Even one box breathing cycle interrupts the rushed feeling.",
    modules: [
      { name: "Zen Breath Zone", route: "/breathing", emoji: "🌬️" },
      { name: "Bubble Canvas", route: "/bubble", emoji: "🫧" },
      { name: "Mindfulness Studio", route: "/mindfulness", emoji: "🧘" },
    ],
  },
  stressed: {
    affirmation: "Stress is your system working too hard for too long. You have been in high gear. Something needs to release — not everything needs a solution right now. Let something out first.",
    tip: "Physical release first — breathing, bursting, scribbling — then think.",
    modules: [
      { name: "Burst It OUT", route: "/burst", emoji: "💥" },
      { name: "Zen Breath Zone", route: "/breathing", emoji: "🌬️" },
      { name: "Mindfulness Studio", route: "/mindfulness", emoji: "🧘" },
    ],
  },
  "out of control": {
    affirmation: "When everything feels out of control, the most grounding thing you can do is find one tiny thing within your control and do it. Not to fix everything — just to remind yourself you have agency.",
    tip: "The Healing Garden is built exactly for this — small, completable, within your control.",
    modules: [
      { name: "Healing Garden", route: "/healing-garden", emoji: "🌿" },
      { name: "Zen Breath Zone", route: "/breathing", emoji: "🌬️" },
      { name: "Talk to Seviyan", route: "/chat", emoji: "💬" },
    ],
  },
  sleepy: {
    affirmation: "Your body is asking for rest — that is not laziness. If you cannot sleep right now, at least give your nervous system something gentle and unstimulating. You have permission to slow all the way down.",
    tip: "Even five minutes of guided stillness helps a tired mind more than scrolling.",
    modules: [
      { name: "Mindfulness Studio", route: "/mindfulness", emoji: "🧘" },
      { name: "Zen Breath Zone", route: "/breathing", emoji: "🌬️" },
      { name: "Bubble Canvas", route: "/bubble", emoji: "🫧" },
    ],
  },
  unfocused: {
    affirmation: "An unfocused mind is often an overstimulated one — too many tabs open. You do not need to force focus. Reset first, then return. One thing at a time.",
    tip: "A short breathing reset clears mental clutter faster than trying harder to focus.",
    modules: [
      { name: "Zen Breath Zone", route: "/breathing", emoji: "🌬️" },
      { name: "Mindfulness Studio", route: "/mindfulness", emoji: "🧘" },
      { name: "Healing Garden", route: "/healing-garden", emoji: "🌿" },
    ],
  },
};

export const emotions: EmotionData = {
  angry: {
    "let down": ["betrayed", "resentful"],
    "humiliated": ["disrespected", "ridiculed"],
    "bitter": ["indignant", "violated"],
    "mad": ["furious", "jealous"],
    "aggressive": ["provoked", "hostile"],
    "frustrated": ["infuriated", "annoyed"],
    "distant": ["withdrawn", "numb"],
    "critical": ["skeptical", "dismissive"]
  },
  disgusted: {
    "disapproving": ["judgmental", "embarrassed"],
    "disappointed": ["appalled", "revolted"],
    "awful": ["nauseated", "detestable"],
    "repelled": ["horrified", "hesitant"]
  },
  sad: {
    "hurt": ["embarrassed", "disappointed"],
    "depressed": ["inferior", "empty"],
    "despair": ["powerless", "grief"],
    "vulnerable": ["fragile", "rejected"],
    "lonely": ["abandoned", "isolated"]
  },
  happy: {
    "optimistic": ["inspired", "hopeful"],
    "intimate": ["playful", "affectionate"],
    "peaceful": ["loving", "content"],
    "powerful": ["courageous", "creative"],
    "accepted": ["respected", "valued"],
    "proud": ["successful", "confident"],
    "interested": ["curious", "inquisitive"],
    "joyful": ["free", "excited"]
  },
  surprised: {
    "startled": ["shocked", "dismayed"],
    "confused": ["disillusioned", "perplexed"],
    "amazed": ["awe", "astonished"],
    "excited": ["eager", "energetic"]
  },
  fearful: {
    "scared": ["helpless", "frightened"],
    "anxious": ["overwhelmed", "worried"],
    "insecure": ["inadequate", "inferior"],
    "weak": ["worthless", "insignificant"],
    "rejected": ["excluded", "persecuted"],
    "threatened": ["nervous", "exposed"]
  },
  bad: {
    "bored": ["indifferent", "apathetic"],
    "busy": ["pressured", "rushed"],
    "stressed": ["overwhelmed", "out of control"],
    "tired": ["sleepy", "unfocused"]
  }
};
