"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// ============================================
// Topic Sentence Templates Database
// ============================================

interface TemplateSet {
  [tone: string]: string[];
}

interface PositionTemplates {
  [position: string]: TemplateSet;
}

const templates: PositionTemplates = {
  introduction: {
    formal: [
      "{topic} represents one of the most significant issues in contemporary discourse.",
      "The importance of {topic} cannot be overstated in today's rapidly changing world.",
      "In examining {topic}, it becomes clear that careful analysis is essential.",
      "This {writingType} explores the multifaceted nature of {topic} and its implications.",
      "{topic} has emerged as a critical subject that warrants thorough examination.",
      "Understanding {topic} requires a comprehensive analysis of its various dimensions.",
      "The study of {topic} offers valuable insights into broader societal patterns.",
      "{topic} stands at the intersection of multiple important considerations.",
      "A thorough examination of {topic} reveals its significance in modern context.",
      "The complexity of {topic} demands careful scholarly attention."
    ],
    persuasive: [
      "{topic} demands immediate attention and decisive action from all stakeholders.",
      "It is essential to recognize that {topic} affects every aspect of our society.",
      "The evidence overwhelmingly demonstrates the critical importance of {topic}.",
      "Without addressing {topic}, we risk severe consequences for future generations.",
      "{topic} is undeniably one of the most pressing challenges we face today.",
      "The time has come to take {topic} seriously and implement meaningful solutions.",
      "Ignoring {topic} is no longer an option in light of mounting evidence.",
      "{topic} requires our immediate focus and commitment to change.",
      "We must acknowledge that {topic} poses significant risks that cannot be overlooked.",
      "The case for addressing {topic} has never been more compelling or urgent."
    ],
    informative: [
      "{topic} encompasses a wide range of factors that influence outcomes.",
      "To understand {topic}, one must first examine its fundamental components.",
      "{topic} can be defined as a phenomenon that affects multiple areas.",
      "The concept of {topic} has evolved significantly over recent decades.",
      "{topic} involves several interconnected elements worthy of exploration.",
      "An overview of {topic} reveals its complexity and far-reaching implications.",
      "{topic} is characterized by distinct features that set it apart.",
      "The fundamentals of {topic} provide a foundation for deeper understanding.",
      "Exploring {topic} offers insights into how systems function and interact.",
      "{topic} represents a subject of growing interest among researchers and practitioners."
    ],
    analytical: [
      "Analysis of {topic} reveals patterns that challenge conventional assumptions.",
      "Examining {topic} through multiple lenses provides a nuanced understanding.",
      "The relationship between {topic} and related factors merits careful scrutiny.",
      "A critical assessment of {topic} uncovers both opportunities and challenges.",
      "Breaking down {topic} into its constituent parts illuminates underlying mechanisms.",
      "The data surrounding {topic} suggests trends that deserve closer examination.",
      "Investigating {topic} requires consideration of various competing interpretations.",
      "A systematic review of {topic} highlights key areas requiring further study.",
      "The dynamics of {topic} can be understood through careful empirical analysis.",
      "Evaluating {topic} demands attention to both quantitative and qualitative evidence."
    ]
  },
  body: {
    formal: [
      "One key aspect of {topic} is its impact on broader societal structures.",
      "Research indicates that {topic} plays a significant role in shaping outcomes.",
      "A closer examination of {topic} reveals important underlying patterns.",
      "The relationship between {topic} and related factors is particularly noteworthy.",
      "Evidence suggests that {topic} influences multiple interconnected domains.",
      "Furthermore, {topic} demonstrates characteristics that merit detailed analysis.",
      "An important consideration regarding {topic} is its long-term implications.",
      "The significance of {topic} extends beyond its immediate manifestations.",
      "Additionally, {topic} presents both challenges and opportunities for stakeholders.",
      "The implications of {topic} are far-reaching and multidimensional."
    ],
    persuasive: [
      "The most compelling argument for addressing {topic} lies in its widespread impact.",
      "Critics who dismiss {topic} fail to recognize its fundamental importance.",
      "The benefits of engaging with {topic} far outweigh potential drawbacks.",
      "Moreover, {topic} offers solutions that could transform current approaches.",
      "Those who understand {topic} recognize the urgent need for action.",
      "The evidence supporting the significance of {topic} is irrefutable.",
      "Perhaps most importantly, {topic} has the potential to create lasting change.",
      "Skeptics of {topic} often overlook crucial supporting evidence.",
      "The positive outcomes associated with {topic} speak for themselves.",
      "Any serious consideration of this issue must acknowledge that {topic} is central."
    ],
    informative: [
      "One important characteristic of {topic} is its influence on daily practices.",
      "{topic} functions through several mechanisms that affect various outcomes.",
      "The process underlying {topic} involves multiple stages and components.",
      "Experts in the field describe {topic} as a multifaceted phenomenon.",
      "{topic} manifests differently across various contexts and populations.",
      "The development of {topic} can be traced through distinct historical phases.",
      "Several factors contribute to the current state of {topic}.",
      "{topic} operates according to principles that govern related systems.",
      "The scope of {topic} extends across multiple disciplines and sectors.",
      "Understanding {topic} requires familiarity with its core components."
    ],
    analytical: [
      "Data analysis reveals that {topic} correlates with several key variables.",
      "When examined closely, {topic} exhibits patterns that inform our understanding.",
      "The evidence regarding {topic} points to conclusions worth considering.",
      "Comparative analysis shows how {topic} differs across various contexts.",
      "Statistical findings indicate that {topic} has measurable effects.",
      "Research methodologies applied to {topic} yield consistent results.",
      "The causal mechanisms underlying {topic} can be identified through analysis.",
      "Examining {topic} from multiple perspectives reveals important distinctions.",
      "The theoretical framework surrounding {topic} helps explain observed phenomena.",
      "Empirical investigation of {topic} supports several key hypotheses."
    ]
  },
  conclusion: {
    formal: [
      "In conclusion, {topic} clearly demonstrates significance that extends beyond initial observations.",
      "The analysis of {topic} confirms its importance in contemporary discourse.",
      "Ultimately, {topic} remains a subject worthy of continued scholarly attention.",
      "This examination of {topic} has illuminated key aspects requiring further consideration.",
      "In summary, {topic} represents a complex issue with far-reaching implications.",
      "The evidence presented regarding {topic} supports the central arguments advanced.",
      "To conclude, {topic} merits the serious attention it has received in this analysis.",
      "The findings regarding {topic} contribute to our broader understanding of the field.",
      "In final analysis, {topic} emerges as a defining issue of our time.",
      "This discussion of {topic} underscores the need for continued engagement."
    ],
    persuasive: [
      "The case for taking {topic} seriously has never been more compelling.",
      "We cannot afford to ignore {topic} any longer given its profound implications.",
      "It is imperative that we act on what we know about {topic} without delay.",
      "The evidence demands that we reconsider our approach to {topic}.",
      "Future generations will judge us by how we respond to {topic} today.",
      "The time for debate about {topic} has passed; action is now required.",
      "Failure to address {topic} will result in consequences we cannot accept.",
      "Let us commit to meaningful change in how we approach {topic}.",
      "The stakes surrounding {topic} are too high to maintain the status quo.",
      "Our responsibility to address {topic} is clear and cannot be avoided."
    ],
    informative: [
      "In summary, {topic} encompasses multiple dimensions that shape its significance.",
      "The key points regarding {topic} provide a foundation for further exploration.",
      "Understanding {topic} opens doors to additional areas of inquiry.",
      "The overview of {topic} presented here highlights its most essential features.",
      "To summarize, {topic} remains a subject with much to offer those who study it.",
      "The information about {topic} covered here represents current understanding.",
      "In closing, {topic} continues to evolve as new discoveries emerge.",
      "The fundamentals of {topic} discussed provide a starting point for deeper study.",
      "This introduction to {topic} has covered its most important aspects.",
      "Further investigation of {topic} promises additional insights and discoveries."
    ],
    analytical: [
      "The analysis demonstrates that {topic} follows identifiable patterns.",
      "These findings regarding {topic} have implications for theory and practice.",
      "The evidence examined supports a nuanced understanding of {topic}.",
      "Critical evaluation reveals both strengths and limitations in approaches to {topic}.",
      "The conclusions drawn about {topic} are supported by the evidence presented.",
      "Future research on {topic} should address the questions raised by this analysis.",
      "The analytical framework applied to {topic} proves useful for interpretation.",
      "Synthesis of the evidence regarding {topic} points toward clear conclusions.",
      "The implications of these findings about {topic} extend to related areas.",
      "This analysis of {topic} contributes to ongoing scholarly conversations."
    ]
  }
};

// Sentence type labels
const sentenceTypes = [
  { type: "Declarative", description: "Makes a direct statement" },
  { type: "Assertive", description: "States a strong position" },
  { type: "Preview", description: "Outlines what follows" },
  { type: "Transitional", description: "Connects to previous ideas" },
  { type: "Analytical", description: "Sets up analysis" }
];

// Writing type labels
const writingTypes: { [key: string]: { label: string; emoji: string } } = {
  essay: { label: "Essay", emoji: "📝" },
  research: { label: "Research Paper", emoji: "📚" },
  blog: { label: "Blog Post", emoji: "💻" },
  speech: { label: "Speech", emoji: "🎤" },
  report: { label: "Report", emoji: "📊" }
};

// Position labels
const positionLabels: { [key: string]: { label: string; emoji: string; desc: string } } = {
  introduction: { label: "Introduction", emoji: "🚀", desc: "Opening paragraph" },
  body: { label: "Body Paragraph", emoji: "📄", desc: "Supporting paragraphs" },
  conclusion: { label: "Conclusion", emoji: "🎯", desc: "Closing paragraph" }
};

// Tone labels
const toneLabels: { [key: string]: { label: string; emoji: string; desc: string } } = {
  formal: { label: "Formal", emoji: "🎓", desc: "Academic and professional" },
  persuasive: { label: "Persuasive", emoji: "💪", desc: "Convincing and compelling" },
  informative: { label: "Informative", emoji: "💡", desc: "Educational and clear" },
  analytical: { label: "Analytical", emoji: "🔬", desc: "Critical and evaluative" }
};

// FAQ data
const faqs = [
  {
    question: "What is a topic sentence?",
    answer: "A topic sentence is the first sentence of a paragraph that states the main idea or focus of that paragraph. It serves as a mini-thesis for the paragraph, telling readers what to expect. A strong topic sentence is specific, relates to the overall thesis, and provides a clear direction for the supporting sentences that follow."
  },
  {
    question: "How do I write a good topic sentence?",
    answer: "A good topic sentence should: 1) State the main point of the paragraph clearly, 2) Be specific enough to be covered in one paragraph, 3) Connect to your thesis statement, 4) Avoid being too broad or too narrow, 5) Engage the reader's interest. It should introduce your idea without giving away all the details."
  },
  {
    question: "Where should a topic sentence be placed?",
    answer: "Topic sentences are typically placed at the beginning of a paragraph, but they can also appear at the end (for dramatic effect) or in the middle (when building up to a point). In academic writing, placing the topic sentence first is most common as it immediately tells readers what the paragraph is about."
  },
  {
    question: "What's the difference between a topic sentence and a thesis statement?",
    answer: "A thesis statement presents the main argument of your entire essay and typically appears in the introduction. A topic sentence presents the main idea of a single paragraph. Think of the thesis as the \"big picture\" claim, while topic sentences are the supporting claims that help prove your thesis."
  },
  {
    question: "How long should a topic sentence be?",
    answer: "A topic sentence should typically be one sentence, ranging from 15-25 words. It should be concise enough to be clear but detailed enough to convey the paragraph's main point. Avoid overly complex sentences that try to do too much—save the details for the supporting sentences."
  },
  {
    question: "Can I use this for academic writing?",
    answer: "Yes! This generator creates topic sentences suitable for essays, research papers, reports, and other academic writing. The formal and analytical tone options are particularly useful for academic contexts. However, always review and customize the generated sentences to fit your specific assignment and argument."
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

// Helper function
function getRandomItems<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

interface GeneratedSentence {
  sentence: string;
  type: string;
  typeDescription: string;
  strength: "Strong" | "Medium" | "Good";
}

export default function TopicSentenceGenerator() {
  const [topic, setTopic] = useState("");
  const [writingType, setWritingType] = useState("essay");
  const [position, setPosition] = useState("introduction");
  const [tone, setTone] = useState("formal");
  const [generatedSentences, setGeneratedSentences] = useState<GeneratedSentence[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [error, setError] = useState("");

  // Generate function
  const generateSentences = () => {
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }
    setError("");

    const templateList = templates[position]?.[tone] || templates.introduction.formal;
    const selectedTemplates = getRandomItems(templateList, 5);

    const results: GeneratedSentence[] = selectedTemplates.map((template, index) => {
      // Replace placeholders
      let sentence = template
        .replace(/{topic}/g, topic.trim())
        .replace(/{writingType}/g, writingTypes[writingType]?.label.toLowerCase() || "essay");

      // Assign sentence type
      const typeIndex = index % sentenceTypes.length;
      const sentenceType = sentenceTypes[typeIndex];

      // Determine strength
      const strengths: ("Strong" | "Medium" | "Good")[] = ["Strong", "Strong", "Good", "Medium", "Good"];

      return {
        sentence,
        type: sentenceType.type,
        typeDescription: sentenceType.description,
        strength: strengths[index]
      };
    });

    setGeneratedSentences(results);
    setCopiedIndex(null);
  };

  // Copy function
  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Get strength color
  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case "Strong": return "#10B981";
      case "Good": return "#3B82F6";
      case "Medium": return "#F59E0B";
      default: return "#6B7280";
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#EFF6FF" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #BFDBFE" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Topic Sentence Generator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "2.5rem" }}>✍️</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Topic Sentence Generator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Generate strong, clear topic sentences for your essays, research papers, and other writing. 
            Perfect for students and writers who need compelling paragraph openers.
          </p>
        </div>

        {/* Tip Box */}
        <div style={{
          backgroundColor: "#2563EB",
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
              <p style={{ color: "#BFDBFE", margin: 0, fontSize: "0.95rem" }}>
                A strong topic sentence should be specific, relate to your thesis, and tell readers exactly what the paragraph will discuss.
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
            border: "1px solid #BFDBFE",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#2563EB", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                ⚙️ Settings
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              {/* Topic Input */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                  📝 Your Topic / Main Idea *
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., climate change, social media impact, artificial intelligence"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: error ? "2px solid #EF4444" : "1px solid #D1D5DB",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
                {error && (
                  <p style={{ color: "#EF4444", fontSize: "0.85rem", margin: "8px 0 0 0" }}>{error}</p>
                )}
              </div>

              {/* Writing Type */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                  📄 Writing Type
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {Object.entries(writingTypes).map(([key, { label, emoji }]) => (
                    <button
                      key={key}
                      onClick={() => setWritingType(key)}
                      style={{
                        padding: "10px 16px",
                        borderRadius: "8px",
                        border: writingType === key ? "2px solid #2563EB" : "1px solid #D1D5DB",
                        backgroundColor: writingType === key ? "#EFF6FF" : "white",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        fontWeight: writingType === key ? "600" : "400",
                        color: writingType === key ? "#2563EB" : "#4B5563",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      <span>{emoji}</span>
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Paragraph Position */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                  📍 Paragraph Position
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {Object.entries(positionLabels).map(([key, { label, emoji, desc }]) => (
                    <button
                      key={key}
                      onClick={() => setPosition(key)}
                      style={{
                        padding: "12px 16px",
                        borderRadius: "8px",
                        border: position === key ? "2px solid #2563EB" : "1px solid #D1D5DB",
                        backgroundColor: position === key ? "#EFF6FF" : "white",
                        cursor: "pointer",
                        flex: 1,
                        textAlign: "center"
                      }}
                    >
                      <div style={{ fontSize: "1.2rem", marginBottom: "4px" }}>{emoji}</div>
                      <div style={{ fontWeight: position === key ? "600" : "400", color: position === key ? "#2563EB" : "#374151", fontSize: "0.85rem" }}>
                        {label}
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "#9CA3AF", marginTop: "2px" }}>
                        {desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                  🎭 Tone / Style
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                  {Object.entries(toneLabels).map(([key, { label, emoji, desc }]) => (
                    <button
                      key={key}
                      onClick={() => setTone(key)}
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        border: tone === key ? "2px solid #2563EB" : "1px solid #D1D5DB",
                        backgroundColor: tone === key ? "#EFF6FF" : "white",
                        cursor: "pointer",
                        textAlign: "left"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                        <span>{emoji}</span>
                        <span style={{ fontWeight: tone === key ? "600" : "400", color: tone === key ? "#2563EB" : "#374151", fontSize: "0.9rem" }}>
                          {label}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>
                        {desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateSentences}
                style={{
                  width: "100%",
                  padding: "16px",
                  backgroundColor: "#2563EB",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                ✨ Generate Topic Sentences
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="calc-results" style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #BFDBFE",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#1D4ED8", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                📜 Generated Sentences
              </h2>
            </div>

            <div style={{ padding: "24px", maxHeight: "600px", overflowY: "auto" }}>
              {generatedSentences.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#6B7280" }}>
                  <p style={{ fontSize: "3rem", margin: "0 0 12px 0" }}>✍️</p>
                  <p style={{ margin: 0 }}>Enter your topic and click Generate</p>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem" }}>You&apos;ll get 5 different topic sentence options</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {generatedSentences.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "16px",
                        backgroundColor: "#F8FAFC",
                        borderRadius: "12px",
                        border: "1px solid #E2E8F0"
                      }}
                    >
                      {/* Sentence */}
                      <p style={{ margin: "0 0 12px 0", color: "#1E293B", fontSize: "1rem", lineHeight: "1.6", fontStyle: "italic" }}>
                        &ldquo;{item.sentence}&rdquo;
                      </p>

                      {/* Meta info */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          <span style={{
                            padding: "4px 10px",
                            backgroundColor: "#2563EB",
                            color: "white",
                            borderRadius: "20px",
                            fontSize: "0.75rem",
                            fontWeight: "500"
                          }}>
                            {item.type}
                          </span>
                          <span style={{
                            padding: "4px 10px",
                            backgroundColor: getStrengthColor(item.strength),
                            color: "white",
                            borderRadius: "20px",
                            fontSize: "0.75rem",
                            fontWeight: "500"
                          }}>
                            {item.strength}
                          </span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(item.sentence, index)}
                          style={{
                            padding: "6px 12px",
                            backgroundColor: copiedIndex === index ? "#10B981" : "#2563EB",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "0.8rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px"
                          }}
                        >
                          {copiedIndex === index ? "✓ Copied!" : "📋 Copy"}
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={generateSentences}
                    style={{
                      padding: "12px",
                      backgroundColor: "transparent",
                      color: "#2563EB",
                      border: "2px dashed #BFDBFE",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                      cursor: "pointer",
                      marginTop: "8px"
                    }}
                  >
                    🔄 Generate More Options
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #BFDBFE", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
                ✍️ What Makes a Great Topic Sentence?
              </h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  A topic sentence is the cornerstone of effective paragraph writing. It tells your reader what the paragraph 
                  is about and sets expectations for the content that follows. Mastering topic sentences will significantly 
                  improve your academic and professional writing.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Key Elements of a Strong Topic Sentence</h3>
                <div style={{
                  backgroundColor: "#EFF6FF",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #BFDBFE"
                }}>
                  <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "2" }}>
                    <li><strong>Specificity:</strong> Focused on one main idea, not too broad or narrow</li>
                    <li><strong>Clarity:</strong> Easy to understand, no ambiguous language</li>
                    <li><strong>Connection:</strong> Links to your thesis statement</li>
                    <li><strong>Direction:</strong> Hints at what supporting details will follow</li>
                    <li><strong>Interest:</strong> Engages the reader and makes them want to continue</li>
                  </ul>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Topic Sentence Types</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", margin: "16px 0" }}>
                  <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
                    <strong>📢 Declarative</strong>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#57534E" }}>
                      Makes a direct statement about the topic
                    </p>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
                    <strong>💪 Assertive</strong>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#57534E" }}>
                      States a strong position or claim
                    </p>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
                    <strong>👀 Preview</strong>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#57534E" }}>
                      Outlines what the paragraph will cover
                    </p>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
                    <strong>🔗 Transitional</strong>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#57534E" }}>
                      Connects to previous paragraph ideas
                    </p>
                  </div>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Examples by Position</h3>
                <div style={{ margin: "16px 0" }}>
                  <div style={{ padding: "16px", backgroundColor: "#F0FDF4", borderRadius: "8px", marginBottom: "12px", border: "1px solid #86EFAC" }}>
                    <strong style={{ color: "#166534" }}>🚀 Introduction:</strong>
                    <p style={{ margin: "8px 0 0 0", fontStyle: "italic", color: "#166534" }}>
                      &ldquo;Climate change represents one of the most significant challenges facing humanity in the 21st century.&rdquo;
                    </p>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#EFF6FF", borderRadius: "8px", marginBottom: "12px", border: "1px solid #93C5FD" }}>
                    <strong style={{ color: "#1E40AF" }}>📄 Body Paragraph:</strong>
                    <p style={{ margin: "8px 0 0 0", fontStyle: "italic", color: "#1E40AF" }}>
                      &ldquo;One key factor contributing to climate change is the increasing level of greenhouse gas emissions.&rdquo;
                    </p>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#FEF3C7", borderRadius: "8px", border: "1px solid #FCD34D" }}>
                    <strong style={{ color: "#92400E" }}>🎯 Conclusion:</strong>
                    <p style={{ margin: "8px 0 0 0", fontStyle: "italic", color: "#92400E" }}>
                      &ldquo;In conclusion, addressing climate change requires coordinated global action and individual commitment.&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Tips */}
            <div style={{ backgroundColor: "#2563EB", borderRadius: "16px", padding: "24px", marginBottom: "24px", color: "white" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "16px" }}>💡 Quick Tips</h3>
              <div style={{ fontSize: "0.85rem", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>✓ One main idea per paragraph</p>
                <p style={{ margin: "0 0 8px 0" }}>✓ Be specific, not vague</p>
                <p style={{ margin: "0 0 8px 0" }}>✓ Avoid starting with &ldquo;I think&rdquo;</p>
                <p style={{ margin: "0 0 8px 0" }}>✓ Connect to your thesis</p>
                <p style={{ margin: 0 }}>✓ Keep it concise (15-25 words)</p>
              </div>
            </div>

            {/* Common Mistakes */}
            <div style={{ backgroundColor: "#FEF2F2", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FECACA" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#DC2626", marginBottom: "16px" }}>❌ Avoid These Mistakes</h3>
              <div style={{ fontSize: "0.85rem", color: "#B91C1C", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>• Too broad or general</p>
                <p style={{ margin: "0 0 8px 0" }}>• Announcing the topic</p>
                <p style={{ margin: "0 0 8px 0" }}>• Including too many ideas</p>
                <p style={{ margin: "0 0 8px 0" }}>• Being too specific</p>
                <p style={{ margin: 0 }}>• Stating obvious facts</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/topic-sentence-generator" currentCategory="Writing" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #BFDBFE", padding: "32px", marginBottom: "24px" }}>
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
        <div style={{ padding: "16px", backgroundColor: "#EFF6FF", borderRadius: "8px", border: "1px solid #BFDBFE" }}>
          <p style={{ fontSize: "0.75rem", color: "#1D4ED8", textAlign: "center", margin: 0 }}>
            ✍️ <strong>Note:</strong> Generated sentences are starting points. Always customize them to fit your specific 
            argument, thesis, and writing style. Good writing requires personal voice and original thought.
          </p>
        </div>
      </div>
    </div>
  );
}