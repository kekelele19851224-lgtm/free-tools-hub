"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// ============================================
// Types & Data
// ============================================

// Tone options
const tones = [
  { id: 'savage', label: 'Savage', emoji: '🔥', description: 'Brutal, no mercy' },
  { id: 'funny', label: 'Funny', emoji: '😂', description: 'Humorous roast' },
  { id: 'sarcastic', label: 'Sarcastic', emoji: '😏', description: 'Witty mockery' },
  { id: 'aggressive', label: 'Aggressive', emoji: '💀', description: 'In your face' },
  { id: 'playful', label: 'Playful', emoji: '😜', description: 'Light teasing' },
  { id: 'cold', label: 'Cold', emoji: '🥶', description: 'Calm destruction' },
];

// Verse count options
const verseCounts = [
  { id: 1, label: '1 Verse', description: 'Quick roast' },
  { id: 2, label: '2 Verses', description: 'Standard track' },
  { id: 3, label: '3 Verses', description: 'Full battle' },
];

// Rhyme patterns for different tones
const rhymeWords: Record<string, string[][]> = {
  savage: [
    ['fake', 'snake', 'mistake', 'break', 'shake', 'wake'],
    ['clown', 'down', 'town', 'crown', 'drown', 'frown'],
    ['trash', 'crash', 'bash', 'flash', 'dash', 'smash'],
    ['weak', 'freak', 'sneak', 'peak', 'leak', 'speak'],
    ['lame', 'shame', 'blame', 'fame', 'game', 'name'],
  ],
  funny: [
    ['joke', 'broke', 'woke', 'choke', 'smoke', 'poke'],
    ['fool', 'cool', 'school', 'drool', 'tool', 'rule'],
    ['goofy', 'movie', 'groovy', 'smoothie'],
    ['silly', 'really', 'chilly', 'hilly', 'frilly'],
    ['clown', 'town', 'down', 'brown', 'gown', 'noun'],
  ],
  sarcastic: [
    ['please', 'tease', 'freeze', 'breeze', 'ease', 'squeeze'],
    ['right', 'bright', 'sight', 'might', 'light', 'tight'],
    ['sure', 'pure', 'cure', 'endure', 'secure', 'mature'],
    ['great', 'late', 'wait', 'fate', 'rate', 'state'],
    ['wow', 'how', 'now', 'bow', 'vow', 'allow'],
  ],
  aggressive: [
    ['dead', 'head', 'said', 'red', 'bed', 'led'],
    ['end', 'bend', 'send', 'friend', 'trend', 'spend'],
    ['done', 'run', 'gun', 'son', 'won', 'none'],
    ['floor', 'door', 'more', 'core', 'war', 'score'],
    ['face', 'place', 'race', 'case', 'base', 'trace'],
  ],
  playful: [
    ['fun', 'run', 'done', 'sun', 'one', 'ton'],
    ['play', 'day', 'way', 'say', 'stay', 'hey'],
    ['friend', 'end', 'blend', 'trend', 'send', 'bend'],
    ['laugh', 'half', 'staff', 'graph', 'path', 'bath'],
    ['smile', 'while', 'style', 'mile', 'file', 'trial'],
  ],
  cold: [
    ['ice', 'price', 'nice', 'twice', 'dice', 'slice'],
    ['chill', 'still', 'will', 'kill', 'skill', 'fill'],
    ['cold', 'told', 'bold', 'hold', 'old', 'gold'],
    ['freeze', 'please', 'breeze', 'ease', 'keys', 'trees'],
    ['stone', 'tone', 'bone', 'zone', 'phone', 'known'],
  ],
};

// Verse templates by tone
const verseTemplates: Record<string, string[][]> = {
  savage: [
    [
      "Yo {TARGET}, let me tell you something real",
      "Your whole existence is a joke, that's the deal",
      "You talk big but we all know you're {ADJ1}",
      "Every time you step up, man, you looking {ADJ2}",
      "I don't even gotta try to make you look {RHYME1}",
      "Your career's a disaster, yeah it's gonna {RHYME1_VERB}",
    ],
    [
      "They call you {TARGET}, but I call you a {NOUN1}",
      "Running your mouth but you ain't saying nothing profound",
      "You're softer than tissue, weaker than a {NOUN2}",
      "Step to me again and watch your whole world {RHYME2}",
      "I'm the real deal, you're just a cheap {RHYME2_NOUN}",
      "Face the facts homie, you're destined to {RHYME2_VERB}",
    ],
    [
      "{TARGET} thinks they're hard but they're {ADJ3}",
      "I've seen more talent in a parking lot {NOUN3}",
      "You can't compete, you don't have the {NOUN4}",
      "Every bar I spit hits you right in the {RHYME3}",
      "Keep my name out your mouth before I {RHYME3_VERB}",
      "This ain't a battle, it's a {RHYME3_NOUN} massacre",
    ],
  ],
  funny: [
    [
      "Yo {TARGET}, why you looking like a confused {NOUN1}",
      "Your style is so outdated, man it's truly {ADJ1}",
      "I heard you tried to rap but you sound like a {NOUN2}",
      "Even my grandma got more bars than you, she's {ADJ2}",
      "You're the human version of a participation {RHYME1}",
      "No wonder everybody thinks you're such a {RHYME1_NOUN}",
    ],
    [
      "Let's talk about {TARGET} and their fashion {NOUN3}",
      "Looking like you got dressed in the dark with passion",
      "Your haircut screams 'I did this with a {NOUN4}'",
      "Your whole vibe is giving off that awkward {RHYME2}",
      "I'm not saying you're ugly but mirrors tend to {RHYME2_VERB}",
      "When they see your face they simply {RHYME2_VERB2}",
    ],
    [
      "{TARGET} walks in and the whole room goes {ADJ3}",
      "Not from respect, they're just trying not to {VERB1}",
      "Your jokes are so bad even crickets stay {ADJ4}",
      "You're the human equivalent of a sad {RHYME3}",
      "Keep trying though, one day you might {RHYME3_VERB}",
      "Until then enjoy being everyone's {RHYME3_NOUN}",
    ],
  ],
  sarcastic: [
    [
      "Oh wow {TARGET}, you're so incredibly {ADJ1}",
      "Said literally no one ever, that's the {NOUN1}",
      "Your confidence is amazing, truly {ADJ2}",
      "Considering you've got the talent of a {NOUN2}",
      "But sure, keep thinking you're the {RHYME1}",
      "While the rest of us try not to {RHYME1_VERB}",
    ],
    [
      "Congratulations {TARGET} on being so {ADJ3}",
      "Your mediocrity really sets you {NOUN3}",
      "I'm sure one day you'll achieve something {ADJ4}",
      "Like maybe tying your shoes without a {NOUN4}",
      "Oh you think you're clever? That's so {RHYME2}",
      "Almost as funny as watching paint {RHYME2_VERB}",
    ],
    [
      "Please {TARGET}, tell us more about your {NOUN5}",
      "We're all so fascinated, truly {ADJ5}",
      "Your stories are as exciting as watching {NOUN6}",
      "Your personality has the depth of a {RHYME3}",
      "But don't worry, I'm sure someone will {RHYME3_VERB}",
      "About all the nothing you {RHYME3_VERB2}",
    ],
  ],
  aggressive: [
    [
      "{TARGET}, I'm about to end your whole {NOUN1}",
      "You stepped to the wrong one, now face the {NOUN2}",
      "I don't play games when it comes to this {NOUN3}",
      "You're nothing but a target and I never {RHYME1}",
      "Every word I spit is designed to {RHYME1_VERB}",
      "Your reputation? Watch it {RHYME1_VERB2}",
    ],
    [
      "You thought you could come at me? {TARGET}, please",
      "I'll bring you down to your {NOUN4} with ease",
      "This ain't a game and I ain't here to {VERB1}",
      "I'm here to show everyone you're a {RHYME2}",
      "Your whole squad knows that you're about to {RHYME2_VERB}",
      "When these bars hit, you're gonna {RHYME2_VERB2}",
    ],
    [
      "Final warning {TARGET}, better stay in your {NOUN5}",
      "Cross me again and you'll meet your {NOUN6}",
      "I built my name while you were being {ADJ1}",
      "Now watch me put you in a lyrical {RHYME3}",
      "Don't even try to {RHYME3_VERB}, it's too late",
      "Accept your {RHYME3_NOUN} and seal your fate",
    ],
  ],
  playful: [
    [
      "Hey {TARGET}, don't take this the wrong {NOUN1}",
      "But your dance moves look like a confused {NOUN2}",
      "I'm just teasing, you know we're still {ADJ1}",
      "Even though your cooking tastes kinda {ADJ2}",
      "We can still hang, you're kinda {RHYME1}",
      "In that 'bless your heart' kinda {RHYME1_NOUN}",
    ],
    [
      "Yo {TARGET}, remember when you tried to {VERB1}",
      "And ended up looking like a goofy {NOUN3}",
      "It's all love though, you make us {VERB2}",
      "Even when you're being extra {RHYME2}",
      "Your confidence is honestly {RHYME2_ADJ}",
      "The way you own it is lowkey {RHYME2_ADJ2}",
    ],
    [
      "Shoutout to {TARGET} for always being {ADJ3}",
      "Your fashion sense is certainly {ADJ4}",
      "No one else could rock that {NOUN4}",
      "You're unique, I'll give you that {RHYME3}",
      "Keep being you, don't ever {RHYME3_VERB}",
      "You're one of a kind, that's a {RHYME3_NOUN}",
    ],
  ],
  cold: [
    [
      "{TARGET}, I'll keep this brief and {ADJ1}",
      "You're not worth the energy, that's the {NOUN1}",
      "While you were talking, I was making {NOUN2}",
      "Your whole existence barely makes a {RHYME1}",
      "I don't hate you, I just don't {RHYME1_VERB}",
      "You're not my rival, you're just {RHYME1_ADJ}",
    ],
    [
      "Look {TARGET}, let me make this {ADJ2}",
      "You and I are not even in the same {NOUN3}",
      "I move in silence while you make {NOUN4}",
      "The difference between us? Pure {RHYME2}",
      "You'll never reach the level where I {RHYME2_VERB}",
      "That's not an insult, it's just {RHYME2_NOUN}",
    ],
    [
      "In conclusion {TARGET}, you're simply {ADJ3}",
      "Not terrible, just aggressively {ADJ4}",
      "I won't remember this battle {NOUN5}",
      "You'll be forgotten like last year's {RHYME3}",
      "Don't feel bad, most people {RHYME3_VERB}",
      "To stand out you'd need to {RHYME3_VERB2}",
    ],
  ],
};

// Chorus templates by tone
const chorusTemplates: Record<string, string[]> = {
  savage: [
    "🔥 [CHORUS] 🔥",
    "{TARGET} ain't ready, {TARGET} ain't real",
    "Everybody knows exactly how I feel",
    "Step up to the mic if you want this smoke",
    "Watch me end your career with every word I spoke",
  ],
  funny: [
    "😂 [CHORUS] 😂",
    "{TARGET}, {TARGET}, what can I say",
    "You make us laugh in the weirdest way",
    "Not with you but at you, that's the truth",
    "You're the gift that keeps on giving, living proof",
  ],
  sarcastic: [
    "😏 [CHORUS] 😏",
    "Oh {TARGET}, you're such a star",
    "We're all so impressed by who you are",
    "Please, keep talking, we're so amazed",
    "By the nothing you've done in all your days",
  ],
  aggressive: [
    "💀 [CHORUS] 💀",
    "{TARGET} got a problem, {TARGET} gonna learn",
    "Play with fire and you're gonna burn",
    "This the last time you disrespect my name",
    "After this verse, nothing's gonna be the same",
  ],
  playful: [
    "😜 [CHORUS] 😜",
    "{TARGET}, {TARGET}, you're so goofy",
    "But that's okay, we still think you're groovy",
    "This roast is all in fun, don't be mad",
    "You're the best worst friend I ever had",
  ],
  cold: [
    "🥶 [CHORUS] 🥶",
    "{TARGET} who? Never heard that name",
    "Another forgettable face in the game",
    "I'll move on and forget this quick",
    "You're not worth more than a single spit",
  ],
};

// Adjectives by tone
const adjectives: Record<string, string[]> = {
  savage: ['pathetic', 'worthless', 'trash', 'wack', 'basic', 'weak', 'soft', 'fake', 'lame', 'corny'],
  funny: ['goofy', 'silly', 'ridiculous', 'hilarious', 'clumsy', 'dorky', 'wacky', 'awkward', 'quirky', 'weird'],
  sarcastic: ['impressive', 'remarkable', 'stunning', 'brilliant', 'talented', 'special', 'unique', 'extraordinary', 'amazing', 'incredible'],
  aggressive: ['finished', 'done', 'dead', 'buried', 'destroyed', 'demolished', 'obliterated', 'crushed', 'ended', 'wrecked'],
  playful: ['funny', 'cute', 'sweet', 'adorable', 'endearing', 'charming', 'lovable', 'precious', 'amusing', 'entertaining'],
  cold: ['irrelevant', 'forgettable', 'basic', 'ordinary', 'average', 'typical', 'unremarkable', 'plain', 'dull', 'bland'],
};

// Nouns by tone
const nouns: Record<string, string[]> = {
  savage: ['joke', 'clown', 'failure', 'disaster', 'waste', 'fraud', 'phony', 'loser', 'amateur', 'wannabe'],
  funny: ['potato', 'penguin', 'noodle', 'pickle', 'muppet', 'donut', 'sock', 'toaster', 'walrus', 'burrito'],
  sarcastic: ['genius', 'masterpiece', 'legend', 'icon', 'prodigy', 'visionary', 'pioneer', 'champion', 'hero', 'star'],
  aggressive: ['grave', 'coffin', 'end', 'doom', 'demise', 'downfall', 'destruction', 'ruin', 'wreckage', 'carnage'],
  playful: ['goofball', 'buddy', 'pal', 'friend', 'homie', 'dude', 'character', 'comedian', 'joker', 'clown'],
  cold: ['nobody', 'nothing', 'zero', 'void', 'blank', 'shadow', 'footnote', 'afterthought', 'whisper', 'dust'],
};

// FAQ data
const faqs = [
  {
    question: "What is a diss track?",
    answer: "A diss track is a song or rap that criticizes, mocks, or insults a specific person, group, or rival. It's a popular form of expression in hip-hop culture, often used in rap battles, friendly roasts, or to address conflicts. Famous examples include Eminem's responses to various rappers and the Tupac vs. Notorious B.I.G. rivalry."
  },
  {
    question: "How do I write a good diss track?",
    answer: "A great diss track combines clever wordplay, solid rhyme schemes, and specific references to your target. Key elements include: strong punchlines that land with impact, consistent flow and rhythm, personal but not overly offensive content, creative metaphors and comparisons, and a memorable chorus that reinforces your message."
  },
  {
    question: "Can I use these generated lyrics?",
    answer: "Yes! The lyrics generated by this tool are free to use for personal entertainment, practice, friendly roasts, social media content, or as inspiration for your own creative work. We recommend customizing and adding your own personal touches to make them truly unique."
  },
  {
    question: "What makes a diss track effective?",
    answer: "Effective diss tracks balance humor with clever insults, maintain a consistent flow, and include specific references that the audience can relate to. The best disses are memorable, quotable, and delivered with confidence. Avoid going too personal or offensive - the goal is to showcase lyrical skill, not cause real harm."
  },
  {
    question: "What's the difference between the tones?",
    answer: "Savage is brutal and direct. Funny focuses on humor and comedic roasts. Sarcastic uses irony and mock praise. Aggressive is intense and confrontational. Playful is light-hearted teasing between friends. Cold is calm, dismissive destruction that treats the target as beneath notice."
  },
  {
    question: "How can I improve my freestyle skills?",
    answer: "Practice regularly using generated lyrics as a starting point. Focus on rhythm and flow, learn to think quickly, build a vocabulary of rhymes, study successful battle rappers, and practice freestyling over different beats. Use this generator to get ideas and then try to come up with your own variations."
  }
];

// FAQ component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #8B5CF6" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          padding: "16px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          textAlign: "left",
          background: "none",
          border: "none",
          cursor: "pointer"
        }}
      >
        <h3 style={{ fontWeight: "600", color: "#E9D5FF", paddingRight: "16px", margin: 0, fontSize: "1rem" }}>{question}</h3>
        <svg style={{ width: "20px", height: "20px", color: "#A78BFA", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div style={{ maxHeight: isOpen ? "500px" : "0", overflow: "hidden", transition: "max-height 0.3s ease-out" }}>
        <p style={{ color: "#C4B5FD", paddingBottom: "16px", margin: 0, lineHeight: "1.7" }}>{answer}</p>
      </div>
    </div>
  );
}

// Helper function to get random item from array
function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Helper function to shuffle array
function shuffleArray<T>(arr: T[]): T[] {
  const newArr = [...arr];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

// Generate lyrics function
function generateLyrics(target: string, tone: string, details: string, verseCount: number): string {
  const templates = verseTemplates[tone] || verseTemplates.savage;
  const chorus = chorusTemplates[tone] || chorusTemplates.savage;
  const adjs = adjectives[tone] || adjectives.savage;
  const nounList = nouns[tone] || nouns.savage;
  const rhymes = rhymeWords[tone] || rhymeWords.savage;
  
  const shuffledTemplates = shuffleArray(templates);
  const verses: string[] = [];
  
  // Generate intro
  verses.push("🎤 [INTRO] 🎤");
  verses.push(`Yeah, yeah, let's talk about ${target}...`);
  verses.push("");
  
  // Generate verses
  for (let i = 0; i < Math.min(verseCount, shuffledTemplates.length); i++) {
    verses.push(`📝 [VERSE ${i + 1}] 📝`);
    
    const template = shuffledTemplates[i];
    const shuffledAdjs = shuffleArray(adjs);
    const shuffledNouns = shuffleArray(nounList);
    const selectedRhymes = shuffleArray(rhymes);
    
    template.forEach((line, lineIndex) => {
      let processedLine = line
        .replace(/{TARGET}/g, target)
        .replace(/{ADJ1}/g, shuffledAdjs[0] || 'weak')
        .replace(/{ADJ2}/g, shuffledAdjs[1] || 'fake')
        .replace(/{ADJ3}/g, shuffledAdjs[2] || 'lame')
        .replace(/{ADJ4}/g, shuffledAdjs[3] || 'soft')
        .replace(/{ADJ5}/g, shuffledAdjs[4] || 'basic')
        .replace(/{NOUN1}/g, shuffledNouns[0] || 'joke')
        .replace(/{NOUN2}/g, shuffledNouns[1] || 'clown')
        .replace(/{NOUN3}/g, shuffledNouns[2] || 'failure')
        .replace(/{NOUN4}/g, shuffledNouns[3] || 'fraud')
        .replace(/{NOUN5}/g, shuffledNouns[4] || 'waste')
        .replace(/{NOUN6}/g, shuffledNouns[5] || 'loser')
        .replace(/{VERB1}/g, getRandomItem(['laugh', 'cry', 'run', 'hide', 'quit']))
        .replace(/{VERB2}/g, getRandomItem(['smile', 'think', 'wonder', 'question']))
        .replace(/{RHYME1}/g, selectedRhymes[0]?.[0] || 'break')
        .replace(/{RHYME1_VERB}/g, selectedRhymes[0]?.[1] || 'shake')
        .replace(/{RHYME1_VERB2}/g, selectedRhymes[0]?.[2] || 'wake')
        .replace(/{RHYME1_NOUN}/g, selectedRhymes[0]?.[3] || 'mistake')
        .replace(/{RHYME1_ADJ}/g, selectedRhymes[0]?.[4] || 'fake')
        .replace(/{RHYME2}/g, selectedRhymes[1]?.[0] || 'down')
        .replace(/{RHYME2_VERB}/g, selectedRhymes[1]?.[1] || 'drown')
        .replace(/{RHYME2_VERB2}/g, selectedRhymes[1]?.[2] || 'frown')
        .replace(/{RHYME2_NOUN}/g, selectedRhymes[1]?.[3] || 'clown')
        .replace(/{RHYME2_ADJ}/g, selectedRhymes[1]?.[4] || 'brown')
        .replace(/{RHYME2_ADJ2}/g, selectedRhymes[1]?.[5] || 'sound')
        .replace(/{RHYME3}/g, selectedRhymes[2]?.[0] || 'trash')
        .replace(/{RHYME3_VERB}/g, selectedRhymes[2]?.[1] || 'crash')
        .replace(/{RHYME3_VERB2}/g, selectedRhymes[2]?.[2] || 'smash')
        .replace(/{RHYME3_NOUN}/g, selectedRhymes[2]?.[3] || 'bash');
      
      verses.push(processedLine);
    });
    
    verses.push("");
    
    // Add chorus after first verse and before last verse
    if (i === 0 || i === verseCount - 1) {
      chorus.forEach(line => {
        verses.push(line.replace(/{TARGET}/g, target));
      });
      verses.push("");
    }
  }
  
  // Add details reference if provided
  if (details.trim()) {
    verses.push("💬 [OUTRO] 💬");
    verses.push(`And one more thing about ${target}...`);
    verses.push(`They know what they did - ${details}`);
    verses.push("Mic drop. 🎤⬇️");
  } else {
    verses.push("🎤⬇️ [END] 🎤⬇️");
  }
  
  return verses.join('\n');
}

export default function DissTrackLyricsGenerator() {
  const [target, setTarget] = useState('');
  const [tone, setTone] = useState('savage');
  const [details, setDetails] = useState('');
  const [verseCount, setVerseCount] = useState(2);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate lyrics
  const generate = () => {
    if (!target.trim()) {
      setResult('⚠️ Please enter a target name to diss!');
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate generation delay for effect
    setTimeout(() => {
      const lyrics = generateLyrics(target.trim(), tone, details.trim(), verseCount);
      setResult(lyrics);
      setIsGenerating(false);
    }, 500);
  };

  // Copy to clipboard
  const copyResult = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Regenerate
  const regenerate = () => {
    if (target.trim()) {
      generate();
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0F0F1A" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "#1A1A2E", borderBottom: "1px solid #8B5CF6" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#9CA3AF" }}>
            <Link href="/" style={{ color: "#9CA3AF", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#A78BFA" }}>Diss Track Lyrics Generator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "2.5rem" }}>🎤</span>
            <h1 style={{ fontSize: "clamp(1.75rem, 5vw, 2.25rem)", fontWeight: "bold", color: "#A78BFA", margin: 0 }}>
              Diss Track Lyrics Generator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#9CA3AF", maxWidth: "800px" }}>
            Generate savage, funny, or playful diss track lyrics instantly. 
            Perfect for rap battles, roasting friends, or creative entertainment.
          </p>
        </div>

        {/* Tip Box */}
        <div style={{
          backgroundColor: "#8B5CF6",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "#FFFFFF", margin: "0 0 4px 0" }}>
                <strong>Pro Tip</strong>
              </p>
              <p style={{ color: "#E9D5FF", margin: 0, fontSize: "0.95rem" }}>
                Add specific details about your target for more personalized and impactful lyrics. 
                The more context you give, the better the roast!
              </p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
          {/* Input Panel */}
          <div style={{
            backgroundColor: "#1A1A2E",
            borderRadius: "16px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
            border: "1px solid #8B5CF6",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#8B5CF6", padding: "16px 24px" }}>
              <h2 style={{ color: "#FFFFFF", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                🎯 Create Your Diss Track
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              {/* Target Name */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#A78BFA", marginBottom: "10px", fontWeight: "600" }}>
                  🎯 Target Name *
                </label>
                <input
                  type="text"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="Who are you dissing? (e.g., Jake, My Ex, Karen)"
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    border: "1px solid #4B5563",
                    borderRadius: "8px",
                    backgroundColor: "#0F0F1A",
                    color: "#FFFFFF",
                    fontSize: "1rem",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              {/* Tone Selection */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#A78BFA", marginBottom: "10px", fontWeight: "600" }}>
                  🎭 Tone / Style
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                  {tones.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTone(t.id)}
                      style={{
                        padding: "12px 10px",
                        borderRadius: "8px",
                        border: tone === t.id ? "2px solid #8B5CF6" : "1px solid #4B5563",
                        backgroundColor: tone === t.id ? "rgba(139, 92, 246, 0.15)" : "transparent",
                        cursor: "pointer",
                        textAlign: "left"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span>{t.emoji}</span>
                        <span style={{ 
                          fontWeight: tone === t.id ? "600" : "500",
                          color: tone === t.id ? "#A78BFA" : "#9CA3AF",
                          fontSize: "0.9rem"
                        }}>
                          {t.label}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "#6B7280", marginTop: "2px", marginLeft: "22px" }}>
                        {t.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Verse Count */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#A78BFA", marginBottom: "10px", fontWeight: "600" }}>
                  📝 Number of Verses
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {verseCounts.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setVerseCount(v.id)}
                      style={{
                        flex: 1,
                        padding: "12px 10px",
                        borderRadius: "8px",
                        border: verseCount === v.id ? "2px solid #8B5CF6" : "1px solid #4B5563",
                        backgroundColor: verseCount === v.id ? "rgba(139, 92, 246, 0.15)" : "transparent",
                        cursor: "pointer",
                        textAlign: "center"
                      }}
                    >
                      <div style={{ 
                        fontWeight: verseCount === v.id ? "600" : "500",
                        color: verseCount === v.id ? "#A78BFA" : "#9CA3AF",
                        fontSize: "0.9rem"
                      }}>
                        {v.label}
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "#6B7280", marginTop: "2px" }}>
                        {v.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Details (Optional) */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#A78BFA", marginBottom: "10px", fontWeight: "600" }}>
                  💬 Details / Beef (Optional)
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Why are you dissing them? Any specific traits, weaknesses, or situations to roast?"
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    border: "1px solid #4B5563",
                    borderRadius: "8px",
                    backgroundColor: "#0F0F1A",
                    color: "#FFFFFF",
                    fontSize: "0.95rem",
                    boxSizing: "border-box",
                    resize: "vertical"
                  }}
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={generate}
                disabled={isGenerating}
                style={{
                  width: "100%",
                  padding: "16px",
                  backgroundColor: isGenerating ? "#6B7280" : "#8B5CF6",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  cursor: isGenerating ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                {isGenerating ? "🔥 Generating Fire..." : "🎤 Generate Diss Track"}
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="calc-results" style={{
            backgroundColor: "#1A1A2E",
            borderRadius: "16px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
            border: "1px solid #8B5CF6",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#7C3AED", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ color: "#FFFFFF", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                🔥 Your Diss Track
              </h2>
              {result && !result.startsWith('⚠️') && (
                <button
                  onClick={regenerate}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "rgba(255,255,255,0.2)",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "0.8rem",
                    cursor: "pointer"
                  }}
                >
                  🔄 Regenerate
                </button>
              )}
            </div>

            <div style={{ padding: "24px" }}>
              {!result ? (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#6B7280" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🎤</div>
                  <p style={{ margin: 0 }}>Enter a target name and hit generate to create your diss track lyrics</p>
                </div>
              ) : result.startsWith('⚠️') ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#F87171" }}>
                  <p style={{ margin: 0 }}>{result}</p>
                </div>
              ) : (
                <>
                  {/* Lyrics Display */}
                  <div style={{ 
                    backgroundColor: "#0F0F1A", 
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "16px",
                    border: "1px solid #4B5563",
                    maxHeight: "400px",
                    overflowY: "auto"
                  }}>
                    <pre style={{ 
                      color: "#E9D5FF", 
                      margin: 0,
                      fontFamily: "'Courier New', monospace",
                      fontSize: "0.9rem",
                      lineHeight: "1.8",
                      whiteSpace: "pre-wrap",
                      wordWrap: "break-word"
                    }}>
                      {result}
                    </pre>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      onClick={copyResult}
                      style={{
                        flex: 1,
                        padding: "12px 20px",
                        backgroundColor: copied ? "#059669" : "#8B5CF6",
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "0.95rem",
                        fontWeight: "600"
                      }}
                    >
                      {copied ? "✓ Copied!" : "📋 Copy Lyrics"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tone Guide */}
        <div style={{ 
          backgroundColor: "#1A1A2E", 
          borderRadius: "16px", 
          boxShadow: "0 4px 6px rgba(0,0,0,0.3)", 
          border: "1px solid #8B5CF6", 
          padding: "32px",
          marginBottom: "32px"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#A78BFA", marginBottom: "20px" }}>
            🎭 Tone Guide
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px" }}>
            {tones.map((t) => (
              <div 
                key={t.id}
                style={{
                  padding: "16px",
                  backgroundColor: "#0F0F1A",
                  borderRadius: "12px",
                  border: "1px solid #4B5563"
                }}
              >
                <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>{t.emoji}</div>
                <div style={{ color: "#A78BFA", fontWeight: "600", marginBottom: "4px" }}>{t.label}</div>
                <div style={{ color: "#9CA3AF", fontSize: "0.8rem" }}>{t.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "#1A1A2E", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.3)", border: "1px solid #8B5CF6", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#A78BFA", marginBottom: "20px" }}>
                ✍️ How to Write a Fire Diss Track
              </h2>

              <div style={{ color: "#9CA3AF", lineHeight: "1.8" }}>
                <p>
                  Diss tracks have been a cornerstone of hip-hop culture since the genre&apos;s earliest days. 
                  From friendly roasts to legendary rap beefs, the art of the diss requires wit, wordplay, and delivery.
                </p>

                <h3 style={{ color: "#A78BFA", marginTop: "24px", marginBottom: "12px" }}>Key Elements of a Great Diss Track</h3>
                <div style={{
                  backgroundColor: "#0F0F1A",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #4B5563"
                }}>
                  <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "2", color: "#9CA3AF" }}>
                    <li><strong style={{ color: "#A78BFA" }}>Punchlines:</strong> Hard-hitting lines that make an impact</li>
                    <li><strong style={{ color: "#A78BFA" }}>Rhyme Schemes:</strong> Consistent rhyming patterns for flow</li>
                    <li><strong style={{ color: "#A78BFA" }}>Wordplay:</strong> Clever double meanings and metaphors</li>
                    <li><strong style={{ color: "#A78BFA" }}>Specificity:</strong> Personal references that hit home</li>
                    <li><strong style={{ color: "#A78BFA" }}>Delivery:</strong> Confidence and attitude in every bar</li>
                  </ul>
                </div>

                <h3 style={{ color: "#A78BFA", marginTop: "24px", marginBottom: "12px" }}>Popular Uses</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", marginTop: "16px" }}>
                  {[
                    { name: 'Rap Battles', desc: 'Competition freestyle' },
                    { name: 'Friend Roasts', desc: 'Playful teasing' },
                    { name: 'Social Media', desc: 'Viral content' },
                    { name: 'Practice', desc: 'Improve your skills' },
                    { name: 'Entertainment', desc: 'Just for fun' },
                    { name: 'Gaming', desc: 'Trash talk opponents' },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "12px",
                        backgroundColor: "#0F0F1A",
                        borderRadius: "8px",
                        border: "1px solid #4B5563"
                      }}
                    >
                      <p style={{ margin: 0, color: "#A78BFA", fontWeight: "600", fontSize: "0.9rem" }}>{item.name}</p>
                      <p style={{ margin: "4px 0 0 0", color: "#6B7280", fontSize: "0.75rem" }}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Examples */}
            <div style={{ backgroundColor: "#8B5CF6", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#FFFFFF", marginBottom: "16px" }}>⚡ Classic Punchline Formats</h3>
              <div style={{ fontSize: "0.85rem", lineHeight: "1.9", color: "#E9D5FF" }}>
                <p style={{ margin: "0 0 8px 0" }}>🎤 &quot;You&apos;re so [adjective], even [comparison]&quot;</p>
                <p style={{ margin: "0 0 8px 0" }}>🎤 &quot;They call you [name] but I call you [insult]&quot;</p>
                <p style={{ margin: "0 0 8px 0" }}>🎤 &quot;I [action] while you [weak action]&quot;</p>
                <p style={{ margin: 0 }}>🎤 &quot;Your [thing] is like [funny comparison]&quot;</p>
              </div>
            </div>

            {/* Tips */}
            <div style={{ backgroundColor: "#0F0F1A", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #8B5CF6" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#A78BFA", marginBottom: "16px" }}>💡 Pro Tips</h3>
              <p style={{ fontSize: "0.85rem", color: "#9CA3AF", lineHeight: "1.7", margin: 0 }}>
                • Keep it fun - the best disses make people laugh<br/>
                • Practice your delivery out loud<br/>
                • Add personal touches to generated lyrics<br/>
                • Know your audience and their humor limits
              </p>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/diss-track-lyrics-generator" currentCategory="Generator" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "#1A1A2E", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.3)", border: "1px solid #8B5CF6", padding: "32px", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#A78BFA", marginBottom: "24px" }}>
            Frequently Asked Questions
          </h2>
          <div>
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ padding: "16px", backgroundColor: "#1A1A2E", borderRadius: "8px", border: "1px solid #8B5CF6" }}>
          <p style={{ fontSize: "0.75rem", color: "#A78BFA", textAlign: "center", margin: 0 }}>
            🎤 <strong>Disclaimer:</strong> This tool is for entertainment purposes only. 
            Please use responsibly and avoid creating content that could genuinely hurt or harass others. 
            Keep it fun, keep it friendly!
          </p>
        </div>
      </div>
    </div>
  );
}