"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// ============================================
// Types & Data
// ============================================

// Generation modes
const modes = [
  { id: 'idea', label: 'Story Idea', emoji: '💡', description: 'One-line story concept' },
  { id: 'plot', label: 'Full Plot', emoji: '📖', description: 'Complete story outline' },
  { id: 'prompt', label: 'Story Prompt', emoji: '✨', description: 'Writing inspiration' },
  { id: 'quest', label: 'Character + Quest', emoji: '⚔️', description: 'Hero and mission combo' },
];

// Sub-genres
const subgenres = [
  { id: 'epic', label: 'Epic / High Fantasy', emoji: '🏰' },
  { id: 'dark', label: 'Dark Fantasy', emoji: '🌑' },
  { id: 'urban', label: 'Urban Fantasy', emoji: '🌃' },
  { id: 'romantic', label: 'Romantic Fantasy', emoji: '💕' },
  { id: 'comic', label: 'Comic / Light Fantasy', emoji: '😄' },
  { id: 'mythic', label: 'Mythic Fantasy', emoji: '🏛️' },
  { id: 'grimdark', label: 'Grimdark', emoji: '💀' },
];

// Protagonists
const protagonists: Record<string, string[]> = {
  epic: ['a humble farm boy destined for greatness', 'a disgraced knight seeking redemption', 'a young princess fleeing her kingdom', 'an orphan raised by monks with hidden powers', 'a battle-weary general who lost everything'],
  dark: ['a cursed warrior bound to a demon', 'a plague doctor hiding a terrible secret', 'a fallen paladin consumed by vengeance', 'a necromancer seeking to resurrect a loved one', 'a monster hunter becoming what they hunt'],
  urban: ['a detective who can see ghosts', 'a barista who accidentally bound a demon', 'a tattoo artist whose ink comes alive', 'a subway musician with reality-bending songs', 'a librarian guarding ancient magical texts'],
  romantic: ['a healer forbidden to love', 'a prince betrothed to their enemy', 'a shapeshifter hiding their true form from their beloved', 'a time traveler falling for someone in the past', 'a fae creature learning human emotions'],
  comic: ['an incompetent wizard with lucky accidents', 'a dragon who is terrified of fire', 'a hero allergic to adventure', 'a talking sword with strong opinions', 'a necromancer whose undead unionize'],
  mythic: ['a demigod discovering their divine parent', 'a mortal chosen by the gods', 'a forgotten deity seeking worshippers', 'a hero descending into the underworld', 'a titan imprisoned for millennia'],
  grimdark: ['a mercenary with no loyalties', 'a torturer questioning their purpose', 'a child soldier hardened by war', 'a betrayed advisor plotting revenge', 'a dying king with nothing left to lose'],
};

// Settings
const settings: Record<string, string[]> = {
  epic: ['a vast kingdom threatened by an ancient evil', 'the last free city against an empire', 'a realm where magic is fading', 'lands divided by a centuries-old war', 'a world recovering from a cataclysm'],
  dark: ['a plague-ridden empire on the brink of collapse', 'cursed lands where the sun never rises', 'a city built on the bones of gods', 'a kingdom where nightmares walk freely', 'battlefields haunted by restless dead'],
  urban: ['a modern city hiding magical secrets', 'a metropolis where supernatural creatures live in secret', 'a town at the crossroads of realms', 'a city built over a sealed hellgate', 'a neighborhood where reality is thin'],
  romantic: ['rival magical academies', 'a masquerade ball that lasts forever', 'kingdoms united by an arranged marriage', 'a enchanted forest where time flows differently', 'a castle caught between two warring fae courts'],
  comic: ['a wizard school with terrible safety standards', 'a dungeon that keeps failing health inspections', 'a kingdom run by bureaucratic chaos', 'a tavern at the center of every adventure', 'a dragon\'s hoard that\'s mostly junk'],
  mythic: ['Mount Olympus and the mortal realm below', 'the edge of the world where gods dwell', 'ancient temples holding primordial power', 'the river between life and death', 'a labyrinth built by divine hands'],
  grimdark: ['a dying world with scarce resources', 'an empire rotting from within', 'lands scarred by magical warfare', 'a frozen wasteland hiding dark secrets', 'a city ruled by corrupt nobles and crime lords'],
};

// Conflicts
const conflicts: Record<string, string[]> = {
  epic: ['must unite the fractured kingdoms against a dark lord', 'must find the legendary artifacts before evil does', 'must fulfill an ancient prophecy they don\'t understand', 'must stop a ritual that would end the world', 'must lead a rebellion against a tyrant'],
  dark: ['must break a curse before it consumes them', 'must hunt down the monster they\'re becoming', 'must choose between saving the world or someone they love', 'must pay an impossible price for forbidden power', 'must stop an apocalypse they accidentally started'],
  urban: ['must navigate supernatural politics while staying hidden', 'must stop an ancient evil awakening in the modern world', 'must choose between their normal life and magical destiny', 'must protect mundane people from magical threats', 'must balance two worlds pulling them apart'],
  romantic: ['must choose between love and duty to their kingdom', 'must break the curse keeping them from their soulmate', 'must prove their love despite an ancient feud', 'must sacrifice their happiness to save their beloved', 'must navigate forbidden love across enemy lines'],
  comic: ['must save the world through sheer dumb luck', 'must complete a quest while everything goes wrong', 'must pretend to be competent while winging it', 'must deal with magical mishaps causing chaos', 'must defeat a villain who keeps explaining their plans'],
  mythic: ['must complete impossible labors to earn their place', 'must defy the gods without being destroyed', 'must retrieve something from the realm of the dead', 'must prove worthy of divine power', 'must prevent a war between the gods'],
  grimdark: ['must survive in a world with no heroes', 'must make terrible choices with no good options', 'must betray everything they believed in', 'must become a monster to fight monsters', 'must find meaning in a brutal, uncaring world'],
};

// Magic systems
const magicSystems: Record<string, string[]> = {
  epic: ['elemental magic drawn from ancient ley lines', 'a structured system of spoken spells and gestures', 'magic tied to bloodlines and noble houses', 'power granted by bonding with magical creatures', 'arcane knowledge preserved in wizard towers'],
  dark: ['blood magic requiring sacrifice', 'power borrowed from otherworldly entities', 'necromancy and communion with the dead', 'corruption-based magic with terrible costs', 'forbidden arts sealed away for good reason'],
  urban: ['magic hidden in everyday objects and rituals', 'power flowing through urban infrastructure', 'spells disguised as technology', 'supernatural abilities awakened by trauma', 'ancient magic adapting to modern times'],
  romantic: ['magic fueled by emotion and connection', 'soulbond abilities shared between lovers', 'enchantments woven through music and art', 'fae magic bound by promises and bargains', 'transformation magic tied to true self'],
  comic: ['magic that works in unexpected ways', 'spells with ridiculous side effects', 'power that only activates inconveniently', 'magical items with questionable design', 'a system where confidence matters more than skill'],
  mythic: ['divine powers granted by the gods', 'primordial forces of creation and destruction', 'magic woven into the fabric of fate', 'power drawn from sacred places and objects', 'abilities tied to mythological creatures'],
  grimdark: ['magic with brutal physical costs', 'power that corrupts the user', 'scarce and dangerous supernatural abilities', 'forbidden knowledge driving users mad', 'magic as a weapon of war and oppression'],
};

// Antagonists
const antagonists: Record<string, string[]> = {
  epic: ['a dark lord awakening from ancient imprisonment', 'a corrupted former hero', 'an empire seeking to conquer all', 'an ancient evil prophesied to return', 'a council of villains united in darkness'],
  dark: ['a being of pure malevolence', 'a tragic villain shaped by suffering', 'an entity that feeds on despair', 'a monster wearing a human face', 'the protagonist\'s own dark nature'],
  urban: ['an ancient vampire carving out territory', 'a corporation hiding supernatural experiments', 'a cult awakening forgotten gods', 'a powerful mage breaking the masquerade', 'supernatural creatures tired of hiding'],
  romantic: ['a jealous rival with dark magic', 'family members opposing the union', 'a curse cast by a spurned lover', 'duty and tradition standing in the way', 'a prophecy threatening to separate them'],
  comic: ['a villain with an over-complicated plan', 'a dark lord with a surprisingly valid point', 'an evil overlord with management problems', 'a nemesis who keeps forgetting the hero', 'a world-ending threat that\'s easily distracted'],
  mythic: ['a jealous god seeking vengeance', 'a titan breaking free from imprisonment', 'a monster born from divine mistakes', 'fate itself working against the hero', 'a primordial force of chaos'],
  grimdark: ['systems of oppression with no single face', 'a pragmatic villain who might be right', 'the consequences of past atrocities', 'allies who become enemies', 'the protagonist themselves'],
};

// Twists
const twists: Record<string, string[]> = {
  epic: ['The mentor was the villain all along', 'The prophecy was misinterpreted', 'The hero\'s family has dark secrets', 'The legendary weapon is sentient and has its own agenda', 'The true enemy is something far worse than expected'],
  dark: ['The hero becomes the very thing they fought', 'Salvation requires becoming damned', 'The loved one they\'re saving doesn\'t want to be saved', 'The villain was trying to prevent something worse', 'There is no cure—only acceptance'],
  urban: ['Magic was never really hidden—just ignored', 'The mundane world is the illusion', 'The hero\'s normal life was a spell', 'The masquerade benefits the wrong side', 'Technology and magic are the same thing'],
  romantic: ['The love interest has been dead all along', 'Their soulmate bond was artificially created', 'Happily ever after requires giving up their powers', 'Their love could destroy the world', 'They\'ve lived this romance before and always fail'],
  comic: ['The dark lord just wants to retire', 'The prophecy was a typo', 'The great evil is actually a massive misunderstanding', 'The hero succeeds by accident and everyone thinks they\'re a genius', 'The villain becomes the hero\'s biggest fan'],
  mythic: ['The gods are not what they claim to be', 'The hero is unknowingly the villain of another story', 'Death is not the end—just a transition', 'The myths were propaganda', 'The hero must become a new god'],
  grimdark: ['Everyone the hero trusted was compromised', 'Victory costs more than defeat would have', 'The hero was the villain\'s pawn all along', 'There are no winners, only survivors', 'The cycle will repeat no matter what'],
};

// Story templates
const storyTitles: Record<string, string[]> = {
  epic: ['The {noun} of {place}', 'Chronicles of the {adj} {noun}', 'The Last {noun}', '{name}\'s {noun}', 'The {adj} Throne'],
  dark: ['A {noun} of {darkNoun}', 'The {adj} {noun}', 'Where {darkNoun} Dwells', 'Blood of the {noun}', 'The {noun}\'s Curse'],
  urban: ['Midnight in {city}', 'The {adj} {noun} Files', '{noun} After Dark', 'City of {noun}', 'The {noun} Underground'],
  romantic: ['A Court of {noun} and {noun}', 'The {noun}\'s {noun}', '{adj} Hearts', 'Bound by {noun}', 'The {noun} Bargain'],
  comic: ['The {adj} {noun} (and Other Problems)', 'How to {verb} Your {noun}', 'A {noun}\'s Guide to {noun}', 'The {noun} Misadventure', 'Oops, I {verb} the {noun}'],
  mythic: ['The {noun} of the Gods', '{name} and the {adj} {noun}', 'Tales of the {noun}', 'The {adj} Labyrinth', 'When Gods {verb}'],
  grimdark: ['The {noun} of {noun}', 'No {noun} for the {adj}', 'Ashes of {noun}', 'The {adj} Price', 'A {noun} in {darkNoun}'],
};

const titleWords = {
  noun: ['Crown', 'Sword', 'Shadow', 'Flame', 'Storm', 'Throne', 'Kingdom', 'Dragon', 'Mage', 'Knight', 'Raven', 'Wolf', 'Rose', 'Thorn', 'Star', 'Moon', 'Blade', 'Shield', 'Realm', 'Quest'],
  adj: ['Fallen', 'Rising', 'Eternal', 'Broken', 'Silver', 'Golden', 'Crimson', 'Shadowed', 'Lost', 'Hidden', 'Ancient', 'Forgotten', 'Last', 'First', 'Burning', 'Frozen'],
  darkNoun: ['Shadows', 'Darkness', 'Nightmares', 'Despair', 'Ashes', 'Ruin', 'Bones', 'Blood', 'Decay', 'Void'],
  place: ['Eldoria', 'Thornwood', 'Ashenvale', 'Stormhold', 'Ravenmoor', 'Dragonspire', 'Shadowfen', 'Crystalheim', 'Ironforge', 'Mythral'],
  name: ['Aelindra', 'Kael', 'Theron', 'Lyra', 'Mordecai', 'Seraphina', 'Zephyr', 'Nyx', 'Orion', 'Isolde'],
  city: ['New Avalon', 'Shadow Chicago', 'Fae York', 'Neo London', 'Mystic Bay', 'Port Arcana'],
  verb: ['Summoned', 'Awakened', 'Betrayed', 'Saved', 'Destroyed', 'Tamed', 'Freed', 'Cursed'],
};

// Prompts for Story Prompt mode
const writingPrompts: Record<string, string[]> = {
  epic: [
    'Write about a chosen one who refuses the call to adventure.',
    'Your hero discovers the legendary sword is a pacifist.',
    'The dark lord wants to negotiate a peace treaty.',
    'A prophecy is fulfilled in the most unexpected way.',
    'Write from the perspective of the sidekick who does all the real work.',
  ],
  dark: [
    'The hero realizes they\'ve been the villain all along.',
    'Write about the cost of using forbidden magic.',
    'A healer must choose who lives and who dies.',
    'The monster under the bed is afraid of what\'s outside.',
    'Victory came at a price no one can live with.',
  ],
  urban: [
    'Magic exists but it\'s regulated like a utility company.',
    'A supernatural creature tries to file their taxes.',
    'The last payphone in the city is a portal.',
    'Your Uber driver is a centuries-old vampire.',
    'A witch\'s familiar wants to unionize.',
  ],
  romantic: [
    'Two rivals are forced to fake a relationship for political reasons.',
    'A ghost falls in love with the person investigating their murder.',
    'Enemies must share the only bed in the enchanted inn.',
    'A love potion reveals what was already true.',
    'Write about a first date in a world where magic is real.',
  ],
  comic: [
    'The dark lord\'s minions start a labor union.',
    'A dragon\'s hoard is entirely emotional support items.',
    'The chosen one\'s prophecy has a typo.',
    'Write a heist where everything goes right for the wrong reasons.',
    'A necromancer\'s undead army just wants to dance.',
  ],
  mythic: [
    'A god gets stuck in a mortal body during rush hour.',
    'Write about what Olympus is like on a slow day.',
    'A hero must complete a task the gods themselves failed.',
    'The underworld has a surprisingly good HR department.',
    'Write a myth explaining why cats always land on their feet.',
  ],
  grimdark: [
    'There are no heroes, only survivors.',
    'Write about a soldier\'s last letter home.',
    'The villain won years ago; this is what comes after.',
    'A mercy killing that might not have been necessary.',
    'Hope is a dangerous thing in a world like this.',
  ],
};

// FAQ data
const faqs = [
  {
    question: "What is a fantasy story generator?",
    answer: "A fantasy story generator is a creative tool that helps writers, game masters, and storytellers create unique fantasy narratives. It combines various story elements like protagonists, settings, conflicts, and magic systems to produce original story ideas, plot outlines, and writing prompts in the fantasy genre."
  },
  {
    question: "How do I use this fantasy plot generator?",
    answer: "Simply select your preferred generation mode (Story Idea, Full Plot, Story Prompt, or Character + Quest), choose a fantasy sub-genre that interests you, and optionally enable the Plot Twist feature. Then click 'Generate Story' to create unique fantasy content. You can regenerate as many times as you like until you find inspiration that speaks to you."
  },
  {
    question: "Can I use these generated stories for my novel or D&D campaign?",
    answer: "Absolutely! All generated content is free to use for any purpose, including novels, short stories, D&D campaigns, RPG sessions, screenplays, or any other creative project. We encourage you to use these as starting points and develop them further with your own unique voice and ideas."
  },
  {
    question: "What's the difference between the fantasy sub-genres?",
    answer: "Each sub-genre has distinct characteristics: Epic/High Fantasy features grand quests and world-saving adventures; Dark Fantasy explores horror elements and moral ambiguity; Urban Fantasy places magic in modern settings; Romantic Fantasy focuses on love stories with magical elements; Comic Fantasy uses humor; Mythic Fantasy draws from mythology; and Grimdark presents brutal, realistic worlds."
  },
  {
    question: "What makes a good fantasy story?",
    answer: "Great fantasy stories typically include compelling characters with clear motivations, a well-developed magic system with consistent rules, an immersive world with rich history, meaningful conflicts that test the protagonist, and themes that resonate with readers. Our generator provides these foundational elements to help you build engaging narratives."
  },
  {
    question: "How is this different from AI story generators?",
    answer: "While AI generators create text using language models, our tool uses carefully curated story elements and proven narrative structures to generate story frameworks. This gives you more creative control and produces consistent, genre-appropriate results that serve as excellent starting points for your own storytelling."
  }
];

// FAQ component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #4C1D95" }}>
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
        <h3 style={{ fontWeight: "600", color: "#111827", paddingRight: "16px", margin: 0, fontSize: "1rem" }}>{question}</h3>
        <svg style={{ width: "20px", height: "20px", color: "#6B7280", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div style={{ maxHeight: isOpen ? "500px" : "0", overflow: "hidden", transition: "max-height 0.3s ease-out" }}>
        <p style={{ color: "#4B5563", paddingBottom: "16px", margin: 0, lineHeight: "1.7" }}>{answer}</p>
      </div>
    </div>
  );
}

// Helper functions
function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateTitle(genre: string): string {
  const templates = storyTitles[genre] || storyTitles.epic;
  let title = getRandomItem(templates);
  
  title = title.replace(/{noun}/g, () => getRandomItem(titleWords.noun));
  title = title.replace(/{adj}/g, () => getRandomItem(titleWords.adj));
  title = title.replace(/{darkNoun}/g, () => getRandomItem(titleWords.darkNoun));
  title = title.replace(/{place}/g, () => getRandomItem(titleWords.place));
  title = title.replace(/{name}/g, () => getRandomItem(titleWords.name));
  title = title.replace(/{city}/g, () => getRandomItem(titleWords.city));
  title = title.replace(/{verb}/g, () => getRandomItem(titleWords.verb));
  
  return title;
}

interface StoryResult {
  title: string;
  premise?: string;
  setting?: string;
  protagonist?: string;
  conflict?: string;
  magic?: string;
  antagonist?: string;
  twist?: string;
  prompt?: string;
  quest?: string;
}

export default function FantasyStoryGenerator() {
  const [mode, setMode] = useState('plot');
  const [genre, setGenre] = useState('epic');
  const [includeTwist, setIncludeTwist] = useState(false);
  const [results, setResults] = useState<StoryResult[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [lockedElements, setLockedElements] = useState<Record<string, string>>({});

  // Generate story
  const generate = () => {
    const newResults: StoryResult[] = [];

    for (let i = 0; i < 3; i++) {
      const result: StoryResult = {
        title: generateTitle(genre),
      };

      if (mode === 'idea') {
        const protag = lockedElements.protagonist || getRandomItem(protagonists[genre] || protagonists.epic);
        const conf = lockedElements.conflict || getRandomItem(conflicts[genre] || conflicts.epic);
        result.premise = `${protag.charAt(0).toUpperCase() + protag.slice(1)} who ${conf}.`;
      } else if (mode === 'plot') {
        result.setting = lockedElements.setting || getRandomItem(settings[genre] || settings.epic);
        result.protagonist = lockedElements.protagonist || getRandomItem(protagonists[genre] || protagonists.epic);
        result.conflict = lockedElements.conflict || getRandomItem(conflicts[genre] || conflicts.epic);
        result.magic = lockedElements.magic || getRandomItem(magicSystems[genre] || magicSystems.epic);
        result.antagonist = lockedElements.antagonist || getRandomItem(antagonists[genre] || antagonists.epic);
        if (includeTwist) {
          result.twist = lockedElements.twist || getRandomItem(twists[genre] || twists.epic);
        }
      } else if (mode === 'prompt') {
        result.prompt = getRandomItem(writingPrompts[genre] || writingPrompts.epic);
      } else if (mode === 'quest') {
        result.protagonist = lockedElements.protagonist || getRandomItem(protagonists[genre] || protagonists.epic);
        result.setting = lockedElements.setting || getRandomItem(settings[genre] || settings.epic);
        result.quest = lockedElements.conflict || getRandomItem(conflicts[genre] || conflicts.epic);
        result.antagonist = lockedElements.antagonist || getRandomItem(antagonists[genre] || antagonists.epic);
      }

      newResults.push(result);
    }

    setResults(newResults);
  };

  // Copy to clipboard
  const copyResult = (result: StoryResult, index: number) => {
    let text = `📖 ${result.title}\n\n`;
    if (result.premise) text += `Premise: ${result.premise}\n`;
    if (result.setting) text += `Setting: ${result.setting}\n`;
    if (result.protagonist) text += `Protagonist: ${result.protagonist}\n`;
    if (result.conflict) text += `Conflict: ${result.conflict}\n`;
    if (result.magic) text += `Magic System: ${result.magic}\n`;
    if (result.antagonist) text += `Antagonist: ${result.antagonist}\n`;
    if (result.twist) text += `Plot Twist: ${result.twist}\n`;
    if (result.prompt) text += `Writing Prompt: ${result.prompt}\n`;
    if (result.quest) text += `Quest: ${result.quest}\n`;
    
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  // Lock/unlock element
  const toggleLock = (key: string, value: string) => {
    setLockedElements(prev => {
      if (prev[key] === value) {
        const newLocked = { ...prev };
        delete newLocked[key];
        return newLocked;
      }
      return { ...prev, [key]: value };
    });
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F5F3FF" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #C4B5FD" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Fantasy Story Generator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "2.5rem" }}>🐉</span>
            <h1 style={{ fontSize: "clamp(1.75rem, 5vw, 2.25rem)", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Fantasy Story Generator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Generate epic fantasy plots, story ideas, and writing prompts. Perfect for novelists, 
            D&D game masters, and anyone seeking magical inspiration!
          </p>
        </div>

        {/* Tip Box */}
        <div style={{
          backgroundColor: "#7C3AED",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>✨</span>
            <div>
              <p style={{ fontWeight: "600", color: "white", margin: "0 0 4px 0" }}>
                <strong>Pro Tip</strong>
              </p>
              <p style={{ color: "#DDD6FE", margin: 0, fontSize: "0.95rem" }}>
                Click the 🔒 icon on any story element to lock it, then regenerate to keep 
                that element while getting new ideas for everything else!
              </p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
          {/* Input Panel */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #C4B5FD",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#7C3AED", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                🔮 Configure Your Story
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              {/* Generation Mode */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                  📝 Generation Mode
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                  {modes.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMode(m.id)}
                      style={{
                        padding: "12px 10px",
                        borderRadius: "8px",
                        border: mode === m.id ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                        backgroundColor: mode === m.id ? "#F5F3FF" : "white",
                        cursor: "pointer",
                        textAlign: "left"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span>{m.emoji}</span>
                        <span style={{ 
                          fontWeight: mode === m.id ? "600" : "500",
                          color: mode === m.id ? "#7C3AED" : "#374151",
                          fontSize: "0.85rem"
                        }}>
                          {m.label}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "#6B7280", marginTop: "2px", marginLeft: "22px" }}>
                        {m.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sub-genre */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                  📚 Sub-Genre
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {subgenres.map((sg) => (
                    <button
                      key={sg.id}
                      onClick={() => setGenre(sg.id)}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: genre === sg.id ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                        backgroundColor: genre === sg.id ? "#F5F3FF" : "white",
                        cursor: "pointer",
                        fontWeight: genre === sg.id ? "600" : "400",
                        color: genre === sg.id ? "#7C3AED" : "#4B5563",
                        fontSize: "0.8rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      <span>{sg.emoji}</span> {sg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Plot Twist Toggle */}
              {(mode === 'plot' || mode === 'quest') && (
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                    <div 
                      onClick={() => setIncludeTwist(!includeTwist)}
                      style={{
                        width: "48px",
                        height: "26px",
                        backgroundColor: includeTwist ? "#7C3AED" : "#D1D5DB",
                        borderRadius: "13px",
                        position: "relative",
                        transition: "background-color 0.2s",
                        cursor: "pointer"
                      }}
                    >
                      <div style={{
                        width: "22px",
                        height: "22px",
                        backgroundColor: "white",
                        borderRadius: "50%",
                        position: "absolute",
                        top: "2px",
                        left: includeTwist ? "24px" : "2px",
                        transition: "left 0.2s",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                      }} />
                    </div>
                    <span style={{ fontSize: "0.9rem", color: "#374151", fontWeight: "600" }}>
                      🌀 Include Plot Twist
                    </span>
                  </label>
                </div>
              )}

              {/* Locked Elements Display */}
              {Object.keys(lockedElements).length > 0 && (
                <div style={{ marginBottom: "20px", padding: "12px", backgroundColor: "#FEF3C7", borderRadius: "8px", border: "1px solid #FCD34D" }}>
                  <p style={{ fontSize: "0.8rem", color: "#92400E", margin: "0 0 8px 0", fontWeight: "600" }}>
                    🔒 Locked Elements:
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    {Object.keys(lockedElements).map(key => (
                      <span 
                        key={key}
                        onClick={() => toggleLock(key, lockedElements[key])}
                        style={{ 
                          fontSize: "0.75rem", 
                          backgroundColor: "#FDE68A", 
                          padding: "2px 8px", 
                          borderRadius: "4px",
                          cursor: "pointer",
                          color: "#92400E"
                        }}
                      >
                        {key} ✕
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={generate}
                style={{
                  width: "100%",
                  padding: "16px",
                  backgroundColor: "#7C3AED",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                ✨ Generate Story
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="calc-results" style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #C4B5FD",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#5B21B6", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                📖 Generated Stories
              </h2>
              {results.length > 0 && (
                <button
                  onClick={generate}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "rgba(255,255,255,0.2)",
                    color: "white",
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

            <div style={{ padding: "16px", maxHeight: "600px", overflowY: "auto" }}>
              {results.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#9CA3AF" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🏰</div>
                  <p style={{ margin: 0 }}>Choose your settings and generate your epic tale!</p>
                </div>
              ) : (
                <div style={{ display: "grid", gap: "16px" }}>
                  {results.map((result, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "20px",
                        backgroundColor: "#F5F3FF",
                        borderRadius: "12px",
                        border: "1px solid #C4B5FD"
                      }}
                    >
                      <h3 style={{ 
                        margin: "0 0 16px 0", 
                        color: "#5B21B6", 
                        fontSize: "1.2rem",
                        fontWeight: "700"
                      }}>
                        📖 {result.title}
                      </h3>
                      
                      {result.premise && (
                        <p style={{ margin: "0 0 12px 0", color: "#1F2937", lineHeight: "1.6" }}>
                          <strong>Premise:</strong> {result.premise}
                        </p>
                      )}
                      
                      {result.prompt && (
                        <p style={{ margin: "0 0 12px 0", color: "#1F2937", lineHeight: "1.6", fontStyle: "italic", fontSize: "1.05rem" }}>
                          &ldquo;{result.prompt}&rdquo;
                        </p>
                      )}
                      
                      {result.setting && (
                        <div style={{ marginBottom: "8px", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                          <span 
                            onClick={() => toggleLock('setting', result.setting!)}
                            style={{ cursor: "pointer", opacity: lockedElements.setting === result.setting ? 1 : 0.4 }}
                          >
                            {lockedElements.setting === result.setting ? '🔒' : '🔓'}
                          </span>
                          <p style={{ margin: 0, color: "#1F2937", lineHeight: "1.5", flex: 1 }}>
                            <strong style={{ color: "#7C3AED" }}>🌍 Setting:</strong> {result.setting}
                          </p>
                        </div>
                      )}
                      
                      {result.protagonist && (
                        <div style={{ marginBottom: "8px", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                          <span 
                            onClick={() => toggleLock('protagonist', result.protagonist!)}
                            style={{ cursor: "pointer", opacity: lockedElements.protagonist === result.protagonist ? 1 : 0.4 }}
                          >
                            {lockedElements.protagonist === result.protagonist ? '🔒' : '🔓'}
                          </span>
                          <p style={{ margin: 0, color: "#1F2937", lineHeight: "1.5", flex: 1 }}>
                            <strong style={{ color: "#7C3AED" }}>👤 Protagonist:</strong> {result.protagonist}
                          </p>
                        </div>
                      )}
                      
                      {result.conflict && (
                        <div style={{ marginBottom: "8px", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                          <span 
                            onClick={() => toggleLock('conflict', result.conflict!)}
                            style={{ cursor: "pointer", opacity: lockedElements.conflict === result.conflict ? 1 : 0.4 }}
                          >
                            {lockedElements.conflict === result.conflict ? '🔒' : '🔓'}
                          </span>
                          <p style={{ margin: 0, color: "#1F2937", lineHeight: "1.5", flex: 1 }}>
                            <strong style={{ color: "#7C3AED" }}>⚔️ Conflict:</strong> {result.conflict}
                          </p>
                        </div>
                      )}
                      
                      {result.quest && (
                        <div style={{ marginBottom: "8px", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                          <span 
                            onClick={() => toggleLock('conflict', result.quest!)}
                            style={{ cursor: "pointer", opacity: lockedElements.conflict === result.quest ? 1 : 0.4 }}
                          >
                            {lockedElements.conflict === result.quest ? '🔒' : '🔓'}
                          </span>
                          <p style={{ margin: 0, color: "#1F2937", lineHeight: "1.5", flex: 1 }}>
                            <strong style={{ color: "#7C3AED" }}>🎯 Quest:</strong> {result.quest}
                          </p>
                        </div>
                      )}
                      
                      {result.magic && (
                        <div style={{ marginBottom: "8px", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                          <span 
                            onClick={() => toggleLock('magic', result.magic!)}
                            style={{ cursor: "pointer", opacity: lockedElements.magic === result.magic ? 1 : 0.4 }}
                          >
                            {lockedElements.magic === result.magic ? '🔒' : '🔓'}
                          </span>
                          <p style={{ margin: 0, color: "#1F2937", lineHeight: "1.5", flex: 1 }}>
                            <strong style={{ color: "#7C3AED" }}>🔮 Magic:</strong> {result.magic}
                          </p>
                        </div>
                      )}
                      
                      {result.antagonist && (
                        <div style={{ marginBottom: "8px", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                          <span 
                            onClick={() => toggleLock('antagonist', result.antagonist!)}
                            style={{ cursor: "pointer", opacity: lockedElements.antagonist === result.antagonist ? 1 : 0.4 }}
                          >
                            {lockedElements.antagonist === result.antagonist ? '🔒' : '🔓'}
                          </span>
                          <p style={{ margin: 0, color: "#1F2937", lineHeight: "1.5", flex: 1 }}>
                            <strong style={{ color: "#7C3AED" }}>😈 Antagonist:</strong> {result.antagonist}
                          </p>
                        </div>
                      )}
                      
                      {result.twist && (
                        <div style={{ marginBottom: "8px", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                          <span 
                            onClick={() => toggleLock('twist', result.twist!)}
                            style={{ cursor: "pointer", opacity: lockedElements.twist === result.twist ? 1 : 0.4 }}
                          >
                            {lockedElements.twist === result.twist ? '🔒' : '🔓'}
                          </span>
                          <p style={{ margin: 0, color: "#1F2937", lineHeight: "1.5", flex: 1 }}>
                            <strong style={{ color: "#DC2626" }}>🌀 Plot Twist:</strong> {result.twist}
                          </p>
                        </div>
                      )}
                      
                      <button
                        onClick={() => copyResult(result, idx)}
                        style={{
                          marginTop: "12px",
                          padding: "8px 16px",
                          backgroundColor: copiedIndex === idx ? "#059669" : "#7C3AED",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "0.85rem",
                          fontWeight: "500"
                        }}
                      >
                        {copiedIndex === idx ? "✓ Copied!" : "📋 Copy Story"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sub-genre Guide */}
        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "16px", 
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)", 
          border: "1px solid #C4B5FD", 
          padding: "32px",
          marginBottom: "32px"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
            📚 Fantasy Sub-Genre Guide
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            {[
              { emoji: '🏰', name: 'Epic Fantasy', desc: 'Grand quests, chosen ones, world-ending threats' },
              { emoji: '🌑', name: 'Dark Fantasy', desc: 'Horror elements, moral ambiguity, grim consequences' },
              { emoji: '🌃', name: 'Urban Fantasy', desc: 'Magic in modern cities, hidden supernatural worlds' },
              { emoji: '💕', name: 'Romantic Fantasy', desc: 'Love stories with magical elements and stakes' },
              { emoji: '😄', name: 'Comic Fantasy', desc: 'Humor, parody, and lighthearted adventures' },
              { emoji: '🏛️', name: 'Mythic Fantasy', desc: 'Gods, heroes, and mythology-inspired tales' },
            ].map((item, idx) => (
              <div 
                key={idx}
                style={{
                  padding: "16px",
                  backgroundColor: "#F5F3FF",
                  borderRadius: "8px",
                  border: "1px solid #C4B5FD"
                }}
              >
                <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>{item.emoji}</div>
                <h3 style={{ margin: "0 0 4px 0", color: "#5B21B6", fontSize: "1rem" }}>{item.name}</h3>
                <p style={{ margin: 0, color: "#6B7280", fontSize: "0.85rem" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #C4B5FD", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
                ✍️ How to Write Great Fantasy Stories
              </h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  Fantasy storytelling has captivated readers for centuries, from ancient myths to modern epics. 
                  Whether you&apos;re writing a novel or planning a D&D campaign, these elements make fantasy memorable.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Essential Elements</h3>
                <div style={{
                  backgroundColor: "#F5F3FF",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #C4B5FD"
                }}>
                  <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "2" }}>
                    <li><strong>Compelling protagonist:</strong> Give them flaws, desires, and growth</li>
                    <li><strong>Consistent magic system:</strong> Rules make magic meaningful</li>
                    <li><strong>Rich world-building:</strong> History, cultures, and geography</li>
                    <li><strong>High stakes:</strong> Something important must be at risk</li>
                    <li><strong>Memorable antagonist:</strong> Villains need motivation too</li>
                  </ul>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Common Tropes to Embrace (or Subvert)</h3>
                <div style={{
                  backgroundColor: "#FEF3C7",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #FCD34D"
                }}>
                  <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "2", color: "#92400E" }}>
                    <li>The Chosen One prophecy</li>
                    <li>Found family and unlikely companions</li>
                    <li>Ancient evil awakening</li>
                    <li>Magic schools and mentors</li>
                    <li>Quest for a powerful artifact</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Ideas */}
            <div style={{ backgroundColor: "#7C3AED", borderRadius: "16px", padding: "24px", marginBottom: "24px", color: "white" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "16px" }}>⚡ Quick Inspiration</h3>
              <div style={{ fontSize: "0.85rem", lineHeight: "2" }}>
                <p style={{ margin: "0 0 4px 0" }}>🗡️ What if the sword chooses wrong?</p>
                <p style={{ margin: "0 0 4px 0" }}>🐉 What if dragons are misunderstood?</p>
                <p style={{ margin: "0 0 4px 0" }}>👑 What if the villain already won?</p>
                <p style={{ margin: "0 0 4px 0" }}>🔮 What if magic has a terrible cost?</p>
                <p style={{ margin: 0 }}>🌍 What if two worlds are merging?</p>
              </div>
            </div>

            {/* Writing Tips */}
            <div style={{ backgroundColor: "#ECFDF5", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #6EE7B7" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "16px" }}>💡 Pro Tips</h3>
              <p style={{ fontSize: "0.85rem", color: "#047857", lineHeight: "1.7", margin: 0 }}>
                Use our generator as a starting point, then ask yourself: &ldquo;What would make this 
                unexpected?&rdquo; The best stories come from twisting familiar elements into something new.
              </p>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/fantasy-story-generator" currentCategory="Writing" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #C4B5FD", padding: "32px", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "24px" }}>
            Frequently Asked Questions
          </h2>
          <div>
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ padding: "16px", backgroundColor: "#F5F3FF", borderRadius: "8px", border: "1px solid #C4B5FD" }}>
          <p style={{ fontSize: "0.75rem", color: "#7C3AED", textAlign: "center", margin: 0 }}>
            🐉 <strong>Disclaimer:</strong> All generated content is free to use for any creative purpose. 
            These are starting points—let your imagination take them further!
          </p>
        </div>
      </div>
    </div>
  );
}