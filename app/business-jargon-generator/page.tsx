"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// ============================================
// Types & Data
// ============================================

// Generation modes
const modes = [
  { id: 'phrase', label: 'Single Phrase', emoji: '🎯', description: 'Quick buzzword combo' },
  { id: 'sentence', label: 'Full Sentence', emoji: '📝', description: 'Complete jargon sentence' },
  { id: 'paragraph', label: 'Paragraph', emoji: '📄', description: 'Wall of corporate text' },
  { id: 'translator', label: 'Jargon Translator', emoji: '🔄', description: 'Convert plain English' },
];

// Industries
const industries = [
  { id: 'general', label: 'General Business', emoji: '💼' },
  { id: 'tech', label: 'IT / Tech', emoji: '💻' },
  { id: 'marketing', label: 'Marketing', emoji: '📈' },
  { id: 'finance', label: 'Finance', emoji: '💰' },
  { id: 'hr', label: 'HR / People Ops', emoji: '👥' },
  { id: 'consulting', label: 'Consulting', emoji: '🏢' },
  { id: 'startup', label: 'Startup', emoji: '🚀' },
];

// Tone options
const tones = [
  { id: 'professional', label: 'Professional', emoji: '😐', description: 'Usable in real work' },
  { id: 'funny', label: 'Funny / BS', emoji: '😂', description: 'Maximum buzzword overload' },
];

// Word libraries
const verbs: Record<string, string[]> = {
  general: ['leverage', 'synergize', 'optimize', 'streamline', 'facilitate', 'implement', 'maximize', 'utilize', 'enhance', 'accelerate', 'transform', 'enable', 'empower', 'drive', 'deliver'],
  tech: ['deploy', 'iterate', 'scale', 'refactor', 'architect', 'integrate', 'automate', 'migrate', 'containerize', 'orchestrate', 'debug', 'ship', 'push', 'spin up', 'sunset'],
  marketing: ['amplify', 'engage', 'convert', 'retarget', 'personalize', 'optimize', 'A/B test', 'segment', 'nurture', 'brand', 'position', 'differentiate', 'storytell', 'viral', 'growth hack'],
  finance: ['capitalize', 'amortize', 'diversify', 'hedge', 'liquidate', 'monetize', 'underwrite', 'securitize', 'arbitrage', 'leverage', 'consolidate', 'restructure', 'divest', 'IPO', 'bootstrap'],
  hr: ['onboard', 'upskill', 'reskill', 'empower', 'engage', 'retain', 'develop', 'coach', 'mentor', 'align', 'collaborate', 'recognize', 'incentivize', 'nurture', 'cultivate'],
  consulting: ['advise', 'assess', 'benchmark', 'diagnose', 'recommend', 'implement', 'transform', 'restructure', 'optimize', 'strategize', 'analyze', 'evaluate', 'synthesize', 'frame', 'scope'],
  startup: ['pivot', 'disrupt', 'iterate', 'scale', 'bootstrap', 'hustle', 'hack', 'ship', 'launch', 'validate', 'monetize', 'grow', 'fundraise', 'exit', 'unicorn'],
};

const adjectives: Record<string, string[]> = {
  general: ['holistic', 'synergistic', 'best-in-class', 'world-class', 'cutting-edge', 'mission-critical', 'value-added', 'data-driven', 'customer-centric', 'results-oriented', 'forward-thinking', 'innovative', 'strategic', 'transformative', 'scalable'],
  tech: ['agile', 'robust', 'scalable', 'cloud-native', 'full-stack', 'serverless', 'microservice-based', 'AI-powered', 'blockchain-enabled', 'real-time', 'distributed', 'fault-tolerant', 'high-availability', 'containerized', 'API-first'],
  marketing: ['viral', 'engaging', 'compelling', 'authentic', 'omnichannel', 'data-driven', 'personalized', 'targeted', 'conversion-optimized', 'brand-aligned', 'influencer-approved', 'SEO-friendly', 'mobile-first', 'snackable', 'shareable'],
  finance: ['liquid', 'diversified', 'risk-adjusted', 'tax-efficient', 'high-yield', 'investment-grade', 'accretive', 'capital-efficient', 'cash-flow positive', 'margin-expanding', 'debt-free', 'recession-proof', 'alpha-generating', 'ESG-compliant', 'sustainable'],
  hr: ['inclusive', 'diverse', 'engaged', 'high-performing', 'self-directed', 'cross-functional', 'collaborative', 'empowered', 'purpose-driven', 'growth-minded', 'resilient', 'agile', 'emotionally intelligent', 'culturally aligned', 'values-driven'],
  consulting: ['strategic', 'tactical', 'operational', 'transformational', 'best-practice', 'industry-leading', 'data-driven', 'evidence-based', 'client-centric', 'outcome-focused', 'bespoke', 'tailored', 'comprehensive', 'integrated', 'end-to-end'],
  startup: ['disruptive', 'innovative', 'lean', 'agile', 'scalable', 'venture-backed', 'growth-stage', 'product-market fit', 'capital-efficient', 'founder-led', 'mission-driven', 'category-defining', 'first-mover', 'unicorn-potential', '10x'],
};

const nouns: Record<string, string[]> = {
  general: ['synergy', 'paradigm', 'ecosystem', 'bandwidth', 'deliverables', 'stakeholders', 'KPIs', 'ROI', 'value proposition', 'core competencies', 'best practices', 'learnings', 'takeaways', 'action items', 'verticals'],
  tech: ['stack', 'pipeline', 'infrastructure', 'architecture', 'codebase', 'repository', 'deployment', 'sprint', 'backlog', 'standup', 'retrospective', 'MVP', 'tech debt', 'endpoints', 'microservices'],
  marketing: ['funnel', 'pipeline', 'touchpoints', 'personas', 'segments', 'campaigns', 'impressions', 'engagement', 'conversions', 'CTR', 'CAC', 'LTV', 'brand equity', 'thought leadership', 'content strategy'],
  finance: ['portfolio', 'returns', 'margins', 'EBITDA', 'runway', 'burn rate', 'cap table', 'valuation', 'due diligence', 'term sheet', 'equity', 'debt', 'liquidity', 'cash flow', 'balance sheet'],
  hr: ['talent', 'pipeline', 'culture', 'engagement', 'retention', 'development', 'performance', 'feedback', 'recognition', 'benefits', 'compensation', 'headcount', 'succession planning', 'employee experience', 'EVP'],
  consulting: ['framework', 'methodology', 'workstream', 'deliverable', 'engagement', 'scope', 'findings', 'recommendations', 'implementation', 'change management', 'stakeholder alignment', 'governance', 'roadmap', 'maturity model', 'capability'],
  startup: ['traction', 'runway', 'burn rate', 'ARR', 'MRR', 'churn', 'CAC', 'LTV', 'product-market fit', 'hockey stick', 'Series A', 'term sheet', 'cap table', 'pitch deck', 'moat'],
};

const phrases: Record<string, string[]> = {
  general: ['move the needle', 'circle back', 'low-hanging fruit', 'touch base', 'deep dive', 'boil the ocean', 'run it up the flagpole', 'think outside the box', 'take it offline', 'put a pin in it', 'open the kimono', 'drink the Kool-Aid', 'peel the onion', 'sharpen the saw', 'move the goalposts'],
  tech: ['ship it', 'push to prod', 'it works on my machine', 'let\'s not reinvent the wheel', 'this is a feature not a bug', 'let\'s table that for the retro', 'we need to refactor', 'tech debt is killing us', 'let\'s do a spike', 'we\'re in the weeds', 'that\'s out of scope', 'let\'s timebox this', 'we need more bandwidth', 'let\'s sync async', 'LGTM'],
  marketing: ['go viral', 'create buzz', 'build brand awareness', 'capture mindshare', 'drive engagement', 'own the conversation', 'leverage influencers', 'create thumb-stopping content', 'optimize the funnel', 'nurture the lead', 'close the loop', 'double down on what works', 'test and learn', 'fail fast', 'growth hack'],
  finance: ['crunch the numbers', 'run the model', 'stress test the assumptions', 'sanity check the projections', 'pressure test the thesis', 'pencil it out', 'back of the envelope', 'in the black', 'in the red', 'raise a round', 'extend the runway', 'hit our numbers', 'make the quarter', 'beat consensus', 'price it in'],
  hr: ['lean in', 'bring your whole self', 'have a growth mindset', 'embrace feedback', 'model the behavior', 'walk the talk', 'lead with empathy', 'foster psychological safety', 'champion diversity', 'build bridges', 'break down silos', 'invest in our people', 'develop our bench', 'retain top talent', 'create a culture of'],
  consulting: ['unpack that', 'pressure test', 'stress test', 'sanity check', 'gut check', 'take a step back', 'zoom out', 'get granular', 'drill down', 'bubble up', 'socialize the idea', 'get buy-in', 'align stakeholders', 'manage up', 'right-size'],
  startup: ['fail fast', 'move fast and break things', 'done is better than perfect', 'launch and iterate', 'find product-market fit', 'nail it then scale it', 'be scrappy', 'hustle harder', 'crush it', '10x your growth', 'hockey stick growth', 'get to ramen profitable', 'default alive', 'blitzscale', 'go big or go home'],
};

const funnyExtras = ['at the end of the day', 'when all is said and done', 'going forward', 'in this space', 'quite frankly', 'to be honest', 'net-net', 'bottom line', 'long story short', 'with all due respect', 'let me be clear', 'make no mistake', 'needless to say', 'it is what it is', 'the fact of the matter is'];

// Sentence templates
const sentenceTemplates = [
  "We need to {verb} our {adjective} {noun} to {verb} {noun}.",
  "Let's {phrase} and {verb} the {adjective} {noun}.",
  "Moving forward, we'll {verb} {noun} to drive {adjective} {noun}.",
  "Our {adjective} approach will {verb} {noun} across all {noun}.",
  "By {verb}ing our {noun}, we can achieve {adjective} {noun}.",
  "The key is to {verb} {adjective} {noun} while we {phrase}.",
  "It's critical that we {verb} our {noun} to remain {adjective}.",
  "Let's {phrase} to {verb} our {adjective} {noun} strategy.",
];

const funnyTemplates = [
  "We need to {verb} our {adjective} {noun} to {verb} {noun}, {extra}.",
  "Let's {phrase}, {phrase}, and {verb} the {adjective} {noun}.",
  "{extra}, we must {verb} our {adjective} {noun} to {verb} {noun} at scale.",
  "Our {adjective}, {adjective} approach will {verb} {noun} across all {noun}, {extra}.",
  "By {verb}ing and {verb}ing our {noun}, we can achieve {adjective}, {adjective} {noun}.",
];

// Translator replacements
const translatorMap: Record<string, string[]> = {
  'work together': ['synergize', 'collaborate cross-functionally', 'align our efforts'],
  'work': ['execute', 'deliver', 'drive outcomes'],
  'meeting': ['sync', 'touchpoint', 'alignment session'],
  'talk': ['have a dialogue', 'interface', 'engage in discourse'],
  'email': ['reach out via electronic correspondence', 'ping', 'circle back via async'],
  'problem': ['challenge', 'opportunity for improvement', 'growth area'],
  'idea': ['thought leadership', 'innovative concept', 'strategic initiative'],
  'plan': ['roadmap', 'strategic framework', 'action plan'],
  'goal': ['north star', 'key objective', 'target outcome'],
  'team': ['squad', 'cross-functional unit', 'pod'],
  'boss': ['leadership', 'key stakeholder', 'executive sponsor'],
  'customers': ['end users', 'key accounts', 'valued partners'],
  'money': ['capital', 'resources', 'budget allocation'],
  'profit': ['margin expansion', 'value creation', 'bottom-line impact'],
  'sales': ['revenue generation', 'commercial outcomes', 'go-to-market success'],
  'help': ['enable', 'empower', 'support'],
  'use': ['leverage', 'utilize', 'deploy'],
  'make': ['create', 'develop', 'architect'],
  'think': ['ideate', 'brainstorm', 'conceptualize'],
  'tell': ['communicate', 'cascade', 'socialize'],
  'start': ['kick off', 'initiate', 'launch'],
  'finish': ['close out', 'finalize', 'bring to completion'],
  'fast': ['with velocity', 'expeditiously', 'in an accelerated timeline'],
  'slow': ['measured', 'deliberate', 'phased'],
  'good': ['best-in-class', 'world-class', 'industry-leading'],
  'bad': ['suboptimal', 'challenged', 'an opportunity area'],
  'big': ['at scale', 'enterprise-grade', 'significant'],
  'small': ['targeted', 'focused', 'right-sized'],
  'new': ['innovative', 'cutting-edge', 'next-generation'],
  'old': ['legacy', 'established', 'mature'],
  'important': ['mission-critical', 'high-priority', 'strategic'],
  'soon': ['in the near term', 'on the horizon', 'in the coming sprint'],
  'later': ['down the road', 'in a future phase', 'as a follow-up item'],
  'now': ['immediately', 'with urgency', 'as a top priority'],
};

// FAQ data
const faqs = [
  {
    question: "What is business jargon?",
    answer: "Business jargon refers to specialized language and buzzwords commonly used in corporate environments. Terms like 'synergy', 'leverage', 'circle back', and 'move the needle' are examples. While sometimes useful for concise communication among professionals, jargon can also obscure meaning and make communication less clear."
  },
  {
    question: "Why do people use corporate buzzwords?",
    answer: "People use corporate buzzwords for several reasons: to fit into workplace culture, sound more professional, communicate complex ideas quickly among peers, or sometimes to obscure a lack of substance. While some jargon serves legitimate purposes, overuse can make communication confusing and inauthentic."
  },
  {
    question: "What are common business jargon phrases?",
    answer: "Common business jargon includes: 'circle back' (follow up), 'low-hanging fruit' (easy wins), 'move the needle' (make impact), 'deep dive' (thorough analysis), 'synergy' (combined effect), 'leverage' (use effectively), 'bandwidth' (capacity), 'touch base' (connect), and 'take it offline' (discuss separately)."
  },
  {
    question: "How can I sound more professional in meetings?",
    answer: "While our generator is partly for fun, genuine professional communication is actually clearer without excessive jargon. Focus on being concise, specific, and authentic. Use jargon sparingly and only when it genuinely aids understanding. The best communicators translate complex ideas into simple language."
  },
  {
    question: "Is using business jargon good or bad?",
    answer: "It depends on context. Some jargon serves as useful shorthand among professionals who share common understanding. However, overuse can alienate newcomers, obscure meaning, and make you seem less authentic. The key is balance - use jargon purposefully, not as a crutch or to sound impressive."
  },
  {
    question: "What industries have the most jargon?",
    answer: "Consulting, finance, tech startups, and marketing are notorious for heavy jargon use. Each industry has its own vocabulary - tech has 'agile' and 'sprint', finance has 'runway' and 'burn rate', marketing has 'funnel' and 'engagement'. Our generator covers multiple industries to help you speak their language."
  }
];

// FAQ component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #E5E7EB" }}>
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

function getWords(industry: string) {
  return {
    verbs: verbs[industry] || verbs.general,
    adjectives: adjectives[industry] || adjectives.general,
    nouns: nouns[industry] || nouns.general,
    phrases: phrases[industry] || phrases.general,
  };
}

export default function BusinessJargonGenerator() {
  const [mode, setMode] = useState('sentence');
  const [industry, setIndustry] = useState('general');
  const [tone, setTone] = useState('professional');
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Generate jargon
  const generate = () => {
    const words = getWords(industry);
    const newResults: string[] = [];
    const isFunny = tone === 'funny';

    if (mode === 'translator') {
      // Translate input text
      if (!inputText.trim()) {
        setResults(['Please enter some text to translate!']);
        return;
      }
      
      let translated = inputText.toLowerCase();
      
      // Sort keys by length (longest first) to avoid partial replacements
      const sortedKeys = Object.keys(translatorMap).sort((a, b) => b.length - a.length);
      
      for (const key of sortedKeys) {
        const replacements = translatorMap[key];
        const regex = new RegExp(`\\b${key}\\b`, 'gi');
        if (regex.test(translated)) {
          const replacement = getRandomItem(replacements);
          translated = translated.replace(regex, replacement);
        }
      }
      
      // Capitalize first letter
      translated = translated.charAt(0).toUpperCase() + translated.slice(1);
      
      // Add jargon flourishes for funny mode
      if (isFunny) {
        translated = getRandomItem(funnyExtras) + ', ' + translated.charAt(0).toLowerCase() + translated.slice(1);
        translated = translated.charAt(0).toUpperCase() + translated.slice(1);
        translated += ' ' + getRandomItem(funnyExtras) + '.';
      }
      
      newResults.push(translated);
      
      // Generate a few more variations
      for (let i = 0; i < 2; i++) {
        let variant = inputText.toLowerCase();
        for (const key of sortedKeys) {
          const replacements = translatorMap[key];
          const regex = new RegExp(`\\b${key}\\b`, 'gi');
          if (regex.test(variant)) {
            const replacement = getRandomItem(replacements);
            variant = variant.replace(regex, replacement);
          }
        }
        variant = variant.charAt(0).toUpperCase() + variant.slice(1);
        if (isFunny && Math.random() > 0.5) {
          variant = getRandomItem(funnyExtras) + ', ' + variant.charAt(0).toLowerCase() + variant.slice(1);
          variant = variant.charAt(0).toUpperCase() + variant.slice(1);
        }
        if (!newResults.includes(variant)) {
          newResults.push(variant);
        }
      }
    } else if (mode === 'phrase') {
      // Generate single phrases
      for (let i = 0; i < 5; i++) {
        const phrase = `${getRandomItem(words.verbs)} ${getRandomItem(words.adjectives)} ${getRandomItem(words.nouns)}`;
        if (!newResults.includes(phrase)) {
          newResults.push(phrase);
        }
      }
    } else if (mode === 'sentence') {
      // Generate full sentences
      const templates = isFunny ? funnyTemplates : sentenceTemplates;
      
      for (let i = 0; i < 5; i++) {
        let sentence = getRandomItem(templates);
        sentence = sentence.replace(/{verb}/g, () => getRandomItem(words.verbs));
        sentence = sentence.replace(/{adjective}/g, () => getRandomItem(words.adjectives));
        sentence = sentence.replace(/{noun}/g, () => getRandomItem(words.nouns));
        sentence = sentence.replace(/{phrase}/g, () => getRandomItem(words.phrases));
        sentence = sentence.replace(/{extra}/g, () => getRandomItem(funnyExtras));
        
        if (!newResults.includes(sentence)) {
          newResults.push(sentence);
        }
      }
    } else if (mode === 'paragraph') {
      // Generate a paragraph
      for (let p = 0; p < 3; p++) {
        const sentences: string[] = [];
        const numSentences = isFunny ? 5 : 4;
        const templates = isFunny ? funnyTemplates : sentenceTemplates;
        
        for (let i = 0; i < numSentences; i++) {
          let sentence = getRandomItem(templates);
          sentence = sentence.replace(/{verb}/g, () => getRandomItem(words.verbs));
          sentence = sentence.replace(/{adjective}/g, () => getRandomItem(words.adjectives));
          sentence = sentence.replace(/{noun}/g, () => getRandomItem(words.nouns));
          sentence = sentence.replace(/{phrase}/g, () => getRandomItem(words.phrases));
          sentence = sentence.replace(/{extra}/g, () => getRandomItem(funnyExtras));
          sentences.push(sentence);
        }
        
        newResults.push(sentences.join(' '));
      }
    }

    setResults(newResults);
  };

  // Copy to clipboard
  const copyResult = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FFF7ED" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #FED7AA" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Business Jargon Generator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "2.5rem" }}>💼</span>
            <h1 style={{ fontSize: "clamp(1.75rem, 5vw, 2.25rem)", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Business Jargon Generator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Generate corporate buzzwords, business speak, and professional jargon for meetings, 
            emails, and presentations. Or just have fun with ridiculous corporate BS!
          </p>
        </div>

        {/* Tip Box */}
        <div style={{
          backgroundColor: "#EA580C",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "white", margin: "0 0 4px 0" }}>
                <strong>Pro Tip</strong>
              </p>
              <p style={{ color: "#FED7AA", margin: 0, fontSize: "0.95rem" }}>
                Use &quot;Jargon Translator&quot; mode to convert your plain English sentences 
                into impressive corporate speak instantly!
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
            border: "1px solid #FED7AA",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#EA580C", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                ⚙️ Configure Your Jargon
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
                        border: mode === m.id ? "2px solid #EA580C" : "1px solid #E5E7EB",
                        backgroundColor: mode === m.id ? "#FFF7ED" : "white",
                        cursor: "pointer",
                        textAlign: "left"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span>{m.emoji}</span>
                        <span style={{ 
                          fontWeight: mode === m.id ? "600" : "500",
                          color: mode === m.id ? "#EA580C" : "#374151",
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

              {/* Industry */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                  🏢 Industry
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {industries.map((ind) => (
                    <button
                      key={ind.id}
                      onClick={() => setIndustry(ind.id)}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: industry === ind.id ? "2px solid #EA580C" : "1px solid #E5E7EB",
                        backgroundColor: industry === ind.id ? "#FFF7ED" : "white",
                        cursor: "pointer",
                        fontWeight: industry === ind.id ? "600" : "400",
                        color: industry === ind.id ? "#EA580C" : "#4B5563",
                        fontSize: "0.8rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      <span>{ind.emoji}</span> {ind.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                  🎭 Tone
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                  {tones.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTone(t.id)}
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        border: tone === t.id ? "2px solid #EA580C" : "1px solid #E5E7EB",
                        backgroundColor: tone === t.id ? "#FFF7ED" : "white",
                        cursor: "pointer",
                        textAlign: "center"
                      }}
                    >
                      <div style={{ fontSize: "1.3rem", marginBottom: "4px" }}>{t.emoji}</div>
                      <div style={{ 
                        fontWeight: tone === t.id ? "600" : "500",
                        color: tone === t.id ? "#EA580C" : "#374151",
                        fontSize: "0.85rem"
                      }}>
                        {t.label}
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "#6B7280", marginTop: "2px" }}>
                        {t.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Input for Translator Mode */}
              {mode === 'translator' && (
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    ✏️ Text to Translate
                  </label>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter plain English text... e.g., 'We need to work together to solve this problem'"
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #D1D5DB",
                      borderRadius: "8px",
                      fontSize: "0.95rem",
                      boxSizing: "border-box",
                      resize: "none",
                      fontFamily: "inherit"
                    }}
                  />
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={generate}
                style={{
                  width: "100%",
                  padding: "16px",
                  backgroundColor: "#EA580C",
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
                ✨ Generate Jargon
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="calc-results" style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #FED7AA",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#C2410C", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                📋 Generated Jargon
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

            <div style={{ padding: "16px", maxHeight: "500px", overflowY: "auto" }}>
              {results.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#9CA3AF" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🎯</div>
                  <p style={{ margin: 0 }}>Configure your settings and click Generate!</p>
                </div>
              ) : (
                <div style={{ display: "grid", gap: "12px" }}>
                  {results.map((result, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "16px",
                        backgroundColor: "#FFF7ED",
                        borderRadius: "8px",
                        border: "1px solid #FED7AA"
                      }}
                    >
                      <p style={{ 
                        margin: "0 0 12px 0", 
                        color: "#1F2937", 
                        lineHeight: "1.6",
                        fontSize: mode === 'paragraph' ? '0.9rem' : '1rem'
                      }}>
                        {result}
                      </p>
                      <button
                        onClick={() => copyResult(result, idx)}
                        style={{
                          padding: "6px 14px",
                          backgroundColor: copiedIndex === idx ? "#059669" : "#EA580C",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                          fontWeight: "500"
                        }}
                      >
                        {copiedIndex === idx ? "✓ Copied!" : "📋 Copy"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Common Buzzwords Reference */}
        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "16px", 
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)", 
          border: "1px solid #FED7AA", 
          padding: "32px",
          marginBottom: "32px"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
            📚 Common Corporate Buzzwords
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px" }}>
            {['Synergy', 'Leverage', 'Bandwidth', 'Circle back', 'Deep dive', 'Move the needle', 'Low-hanging fruit', 'Touch base', 'Paradigm shift', 'Value-add', 'Scalable', 'Actionable'].map((word, idx) => (
              <div 
                key={idx}
                style={{
                  padding: "12px",
                  backgroundColor: "#FFF7ED",
                  borderRadius: "8px",
                  textAlign: "center",
                  border: "1px solid #FED7AA",
                  fontSize: "0.9rem",
                  color: "#EA580C",
                  fontWeight: "500"
                }}
              >
                {word}
              </div>
            ))}
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #FED7AA", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
                🗣️ The Art of Corporate Speak
              </h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  Business jargon has become a staple of corporate communication. While sometimes mocked, 
                  these terms serve as shorthand among professionals and can make you sound more &quot;in the know.&quot;
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>When to Use Jargon</h3>
                <div style={{
                  backgroundColor: "#FFF7ED",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #FED7AA"
                }}>
                  <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "2" }}>
                    <li><strong>In meetings:</strong> Quick shorthand when everyone understands</li>
                    <li><strong>With executives:</strong> Match their communication style</li>
                    <li><strong>Industry contexts:</strong> When precision matters</li>
                    <li><strong>For humor:</strong> Satirize corporate culture</li>
                  </ul>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>When to Avoid It</h3>
                <div style={{
                  backgroundColor: "#FEF2F2",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #FECACA"
                }}>
                  <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "2", color: "#991B1B" }}>
                    <li>When clarity is more important than sounding smart</li>
                    <li>With new team members or external audiences</li>
                    <li>In customer-facing communications</li>
                    <li>When you don&apos;t actually know what you&apos;re saying</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Jargon Decoder */}
            <div style={{ backgroundColor: "#EA580C", borderRadius: "16px", padding: "24px", marginBottom: "24px", color: "white" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "16px" }}>🔍 Jargon Decoder</h3>
              <div style={{ fontSize: "0.85rem", lineHeight: "2" }}>
                <p style={{ margin: "0 0 4px 0" }}><strong>Synergy</strong> = Working together</p>
                <p style={{ margin: "0 0 4px 0" }}><strong>Bandwidth</strong> = Time/capacity</p>
                <p style={{ margin: "0 0 4px 0" }}><strong>Circle back</strong> = Follow up later</p>
                <p style={{ margin: "0 0 4px 0" }}><strong>Deep dive</strong> = Analyze thoroughly</p>
                <p style={{ margin: 0 }}><strong>Take offline</strong> = Discuss privately</p>
              </div>
            </div>

            {/* Fun Fact */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "16px" }}>😂 Fun Fact</h3>
              <p style={{ fontSize: "0.85rem", color: "#B45309", lineHeight: "1.7", margin: 0 }}>
                Studies show that overusing business jargon can actually make you seem <em>less</em> competent. 
                The best communicators explain complex ideas in simple terms!
              </p>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/business-jargon-generator" currentCategory="Business" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #FED7AA", padding: "32px", marginBottom: "24px" }}>
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
        <div style={{ padding: "16px", backgroundColor: "#FFF7ED", borderRadius: "8px", border: "1px solid #FED7AA" }}>
          <p style={{ fontSize: "0.75rem", color: "#EA580C", textAlign: "center", margin: 0 }}>
            💼 <strong>Disclaimer:</strong> This tool is for entertainment and educational purposes. 
            While business jargon has its place, clear communication is usually more effective than buzzword-heavy speak!
          </p>
        </div>
      </div>
    </div>
  );
}