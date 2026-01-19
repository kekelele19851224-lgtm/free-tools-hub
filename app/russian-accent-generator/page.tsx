"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// ============================================
// Russian Accent Conversion Function
// ============================================

const convertToRussianAccent = (text: string, level: string): string => { 
  let result = text; 
  
  if (level === 'light') { 
    // Light accent - basic changes only 
    result = result.replace(/\bW/g, 'V'); 
    result = result.replace(/\bw/g, 'v'); 
    result = result.replace(/\bTh/g, 'Z'); 
    result = result.replace(/\bth/g, 'z'); 
    result = result.replace(/th\b/gi, 'z'); 
  } else if (level === 'medium') { 
    // Medium accent - more changes 
    result = result.replace(/W/g, 'V'); 
    result = result.replace(/w/g, 'v'); 
    result = result.replace(/Th/g, 'Z'); 
    result = result.replace(/th/gi, 'z'); 
    result = result.replace(/\bH([aeiou])/g, 'Kh$1'); 
    result = result.replace(/\bh([aeiou])/g, 'kh$1'); 
  } else if (level === 'heavy') { 
    // Heavy accent - first remove articles, then transform 
    result = result.replace(/\bA\s+/g, ''); 
    result = result.replace(/\ba\s+/g, ''); 
    result = result.replace(/\bAn\s+/g, ''); 
    result = result.replace(/\ban\s+/g, ''); 
    result = result.replace(/\bThe\s+/g, ''); 
    result = result.replace(/\bthe\s+/g, ''); 
    // Then apply phonetic changes 
    result = result.replace(/W/g, 'V'); 
    result = result.replace(/w/g, 'v'); 
    result = result.replace(/Th/g, 'Z'); 
    result = result.replace(/th/gi, 'z'); 
    result = result.replace(/\bH([aeiou])/g, 'Kh$1'); 
    result = result.replace(/\bh([aeiou])/g, 'kh$1'); 
    result = result.replace(/ing\b/gi, 'ink'); 
    result = result.replace(/tion\b/gi, 'shun'); 
    result = result.replace(/\bis\b/gi, 'iz'); 
    result = result.replace(/\bI\s/g, 'I '); 
    result = result.replace(/\bwas\b/gi, 'vaz'); 
    result = result.replace(/\bhave\b/gi, 'khave'); 
    result = result.replace(/\bHave\b/g, 'Khave'); 
  } 
  
  // Clean up double spaces 
  result = result.replace(/\s+/g, ' ').trim(); 
  
  return result; 
};

// Example phrases
const examplePhrases = [
  { original: "Hello, welcome to my website!", category: "Greeting" },
  { original: "What do you think about this?", category: "Question" },
  { original: "The weather is very nice today.", category: "Small Talk" },
  { original: "I will be there in a few minutes.", category: "Statement" },
  { original: "This is not a bug, it is a feature.", category: "Tech Humor" },
  { original: "In Soviet Russia, car drives you!", category: "Classic Meme" },
  { original: "Trust me, I am an engineer.", category: "Humor" },
  { original: "Would you like some vodka with that?", category: "Stereotype" },
];

// Accent levels
const accentLevels = [
  { value: "light", label: "Light", emoji: "🟢", description: "Subtle hints" },
  { value: "medium", label: "Medium", emoji: "🟡", description: "Noticeable accent" },
  { value: "heavy", label: "Heavy", emoji: "🔴", description: "Strong accent" },
];

// FAQ data
const faqs = [
  {
    question: "How do I make a Russian accent?",
    answer: "The key features of a Russian accent in English include: replacing 'W' sounds with 'V' (what → vhat), replacing 'TH' sounds with 'Z' (the → ze, think → zink), sometimes adding 'Kh' before vowels (hello → khello), and speaking with a slightly lower, more monotone pitch. Our generator automatically applies these rules to any English text."
  },
  {
    question: "What is a Russian accent like?",
    answer: "A Russian accent is characterized by harder consonant sounds, rolled R's, the substitution of W with V, TH with Z or D, and a more consistent rhythm compared to English. Russian speakers may also omit articles (a, an, the) and use different intonation patterns. The accent often sounds deeper and more resonant."
  },
  {
    question: "Can I use this for videos and memes?",
    answer: "Absolutely! Our Russian accent generator is perfect for creating memes, video scripts, social media content, roleplaying, creative writing, and entertainment purposes. The converted text and audio can be used freely for your projects."
  },
  {
    question: "How does the text-to-speech feature work?",
    answer: "Our tool uses your browser's built-in Web Speech API to read the converted text aloud. You can adjust the speech rate to hear the accent faster or slower. Note that voice quality may vary depending on your browser and operating system."
  },
  {
    question: "What's the difference between accent levels?",
    answer: "Light accent applies basic W→V and TH→Z changes. Medium accent adds more transformations like H→Kh before vowels. Heavy accent includes all rules plus article removal and additional phonetic changes for a stronger, more stereotypical Russian accent effect."
  },
  {
    question: "Is this an accurate Russian accent?",
    answer: "This generator creates a stylized, entertainment-focused version of a Russian accent in English. Real Russian accents vary greatly depending on the speaker's region, education, and exposure to English. This tool is designed for fun and creative purposes, not linguistic accuracy."
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

export default function RussianAccentGenerator() {
  const [inputText, setInputText] = useState("Hello, welcome to my website. What do you think about this?");
  const [outputText, setOutputText] = useState("");
  const [accentLevel, setAccentLevel] = useState("medium");
  const [speechRate, setSpeechRate] = useState(0.9);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  // Check speech synthesis support
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.speechSynthesis) {
      setSpeechSupported(false);
    }
  }, []);

  // Convert text when input or accent level changes
  useEffect(() => {
    if (inputText.trim()) {
      const converted = convertToRussianAccent(inputText, accentLevel);
      setOutputText(converted);
    } else {
      setOutputText("");
    }
  }, [inputText, accentLevel]);

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Text to speech
  const speakText = () => {
    if (!speechSupported || !outputText) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(outputText);
    utterance.rate = speechRate;
    utterance.pitch = 0.85; // Slightly lower pitch for Russian feel
    
    // Try to find a suitable voice
    const voices = window.speechSynthesis.getVoices();
    const russianVoice = voices.find(v => v.lang.startsWith('ru'));
    const englishVoice = voices.find(v => v.lang.startsWith('en'));
    
    if (russianVoice) {
      utterance.voice = russianVoice;
    } else if (englishVoice) {
      utterance.voice = englishVoice;
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  // Stop speaking
  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Use example phrase
  const useExample = (phrase: string) => {
    setInputText(phrase);
  };

  // Clear all
  const clearAll = () => {
    setInputText("");
    setOutputText("");
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FEF2F2" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #FECACA" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Russian Accent Generator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "2.5rem" }}>🇷🇺</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Russian Accent Generator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Transform English text into Russian-accented English. Perfect for memes, videos, 
            creative writing, and entertainment. Free text converter with speech playback.
          </p>
        </div>

        {/* Tip Box */}
        <div style={{
          backgroundColor: "#DC2626",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>🎭</span>
            <div>
              <p style={{ fontWeight: "600", color: "white", margin: "0 0 4px 0" }}>
                <strong>Entertainment Tool</strong>
              </p>
              <p style={{ color: "#FECACA", margin: 0, fontSize: "0.95rem" }}>
                Type or paste English text below to convert it to Russian-accented English. Adjust the accent strength and listen to the result!
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
            border: "1px solid #FECACA",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#DC2626", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                ✍️ Enter English Text
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              {/* Accent Level */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                  🎚️ Accent Strength
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {accentLevels.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setAccentLevel(level.value)}
                      style={{
                        flex: 1,
                        padding: "12px 8px",
                        borderRadius: "8px",
                        border: accentLevel === level.value ? "2px solid #DC2626" : "1px solid #E5E7EB",
                        backgroundColor: accentLevel === level.value ? "#FEF2F2" : "white",
                        cursor: "pointer",
                        textAlign: "center"
                      }}
                    >
                      <div style={{ fontSize: "1.3rem", marginBottom: "4px" }}>{level.emoji}</div>
                      <div style={{ fontSize: "0.85rem", fontWeight: accentLevel === level.value ? "600" : "400", color: accentLevel === level.value ? "#DC2626" : "#4B5563" }}>
                        {level.label}
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "#9CA3AF", marginTop: "2px" }}>
                        {level.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Input */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                  📝 Your Text
                </label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type or paste English text here..."
                  rows={6}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none",
                    boxSizing: "border-box",
                    resize: "vertical",
                    fontFamily: "inherit",
                    lineHeight: "1.6"
                  }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "0.8rem", color: "#6B7280" }}>
                  <span>{inputText.length} characters</span>
                  <button
                    onClick={clearAll}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#DC2626",
                      cursor: "pointer",
                      fontSize: "0.8rem"
                    }}
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Example Phrases */}
              <div>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                  💡 Try an Example
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {examplePhrases.slice(0, 4).map((phrase, idx) => (
                    <button
                      key={idx}
                      onClick={() => useExample(phrase.original)}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "20px",
                        border: "1px solid #FECACA",
                        backgroundColor: "#FEF2F2",
                        cursor: "pointer",
                        fontSize: "0.8rem",
                        color: "#991B1B",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {phrase.category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Output Panel */}
          <div className="calc-results" style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #FECACA",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#B91C1C", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                🇷🇺 Russian Accent Result
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              {/* Output Text */}
              <div style={{
                backgroundColor: "#F9FAFB",
                borderRadius: "12px",
                padding: "20px",
                minHeight: "150px",
                marginBottom: "20px",
                border: "1px solid #E5E7EB"
              }}>
                {outputText ? (
                  <p style={{ 
                    margin: 0, 
                    fontSize: "1.1rem", 
                    lineHeight: "1.8", 
                    color: "#111827",
                    fontStyle: "italic"
                  }}>
                    &ldquo;{outputText}&rdquo;
                  </p>
                ) : (
                  <p style={{ margin: 0, color: "#9CA3AF", textAlign: "center", paddingTop: "40px" }}>
                    Enter text to see the Russian accent version...
                  </p>
                )}
              </div>

              {/* Speech Controls */}
              {speechSupported && outputText && (
                <div style={{ marginBottom: "20px", padding: "16px", backgroundColor: "#FEF2F2", borderRadius: "8px", border: "1px solid #FECACA" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    🔊 Speech Settings
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                    <span style={{ fontSize: "0.8rem", color: "#6B7280" }}>Speed:</span>
                    <input
                      type="range"
                      min="0.5"
                      max="1.5"
                      step="0.1"
                      value={speechRate}
                      onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                      style={{ flex: 1 }}
                    />
                    <span style={{ fontSize: "0.8rem", color: "#6B7280", minWidth: "40px" }}>{speechRate}x</span>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={isSpeaking ? stopSpeaking : speakText}
                      style={{
                        flex: 1,
                        padding: "10px",
                        backgroundColor: isSpeaking ? "#991B1B" : "#DC2626",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        fontWeight: "500",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px"
                      }}
                    >
                      {isSpeaking ? "⏹️ Stop" : "▶️ Play Audio"}
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {outputText && (
                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={copyToClipboard}
                    style={{
                      flex: 1,
                      padding: "12px",
                      backgroundColor: copied ? "#059669" : "#DC2626",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px"
                    }}
                  >
                    {copied ? "✓ Copied!" : "📋 Copy Text"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Conversion Examples */}
        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "16px", 
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)", 
          border: "1px solid #FECACA", 
          padding: "32px",
          marginBottom: "32px"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
            🔤 Common Conversions
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            {[
              { from: "What", to: "Vhat" },
              { from: "The", to: "Ze" },
              { from: "This", to: "Zis" },
              { from: "Think", to: "Zink" },
              { from: "Welcome", to: "Velcome" },
              { from: "Hello", to: "Khello" },
              { from: "With", to: "Viz" },
              { from: "Weather", to: "Veazer" },
            ].map((item, idx) => (
              <div 
                key={idx}
                style={{
                  padding: "16px",
                  backgroundColor: "#FEF2F2",
                  borderRadius: "8px",
                  textAlign: "center",
                  border: "1px solid #FECACA"
                }}
              >
                <div style={{ fontSize: "0.9rem", color: "#6B7280", marginBottom: "4px" }}>{item.from}</div>
                <div style={{ fontSize: "0.8rem", color: "#DC2626", margin: "4px 0" }}>↓</div>
                <div style={{ fontSize: "1.1rem", fontWeight: "600", color: "#991B1B" }}>{item.to}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #FECACA", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
                🎭 How to Speak with a Russian Accent
              </h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  The Russian accent is one of the most recognizable accents in English. Whether you&apos;re 
                  preparing for a role, creating content, or just having fun, understanding the key features 
                  of a Russian accent can help you sound more authentic.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Key Features of a Russian Accent</h3>
                <div style={{
                  backgroundColor: "#FEF2F2",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #FECACA"
                }}>
                  <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "2" }}>
                    <li><strong>W → V:</strong> &ldquo;What&rdquo; becomes &ldquo;Vhat&rdquo;, &ldquo;Welcome&rdquo; becomes &ldquo;Velcome&rdquo;</li>
                    <li><strong>TH → Z:</strong> &ldquo;The&rdquo; becomes &ldquo;Ze&rdquo;, &ldquo;Think&rdquo; becomes &ldquo;Zink&rdquo;</li>
                    <li><strong>Harder consonants:</strong> Russian has no soft &ldquo;th&rdquo; sound</li>
                    <li><strong>Rolled R&apos;s:</strong> More prominent R sounds</li>
                    <li><strong>Article omission:</strong> Sometimes dropping &ldquo;a&rdquo;, &ldquo;an&rdquo;, &ldquo;the&rdquo;</li>
                  </ul>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Popular Uses</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", margin: "16px 0" }}>
                  <div style={{ padding: "16px", backgroundColor: "#FEF2F2", borderRadius: "8px", border: "1px solid #FECACA" }}>
                    <strong>🎬 Video Content</strong>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#991B1B" }}>
                      YouTube videos, TikToks, and social media content
                    </p>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#FEF2F2", borderRadius: "8px", border: "1px solid #FECACA" }}>
                    <strong>😂 Memes</strong>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#991B1B" }}>
                      Creating funny captions and meme text
                    </p>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#FEF2F2", borderRadius: "8px", border: "1px solid #FECACA" }}>
                    <strong>🎭 Acting</strong>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#991B1B" }}>
                      Practicing character voices and accents
                    </p>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#FEF2F2", borderRadius: "8px", border: "1px solid #FECACA" }}>
                    <strong>✍️ Creative Writing</strong>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#991B1B" }}>
                      Writing dialogue for Russian characters
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Tips */}
            <div style={{ backgroundColor: "#DC2626", borderRadius: "16px", padding: "24px", marginBottom: "24px", color: "white" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "16px" }}>💡 Pro Tips</h3>
              <div style={{ fontSize: "0.85rem", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>• Lower your pitch slightly</p>
                <p style={{ margin: "0 0 8px 0" }}>• Speak more monotone</p>
                <p style={{ margin: "0 0 8px 0" }}>• Emphasize consonants</p>
                <p style={{ margin: "0 0 8px 0" }}>• Roll your R&apos;s when possible</p>
                <p style={{ margin: 0 }}>• Keep a steady rhythm</p>
              </div>
            </div>

            {/* Famous Phrases */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "16px" }}>🌟 Classic Lines</h3>
              <div style={{ fontSize: "0.85rem", color: "#B45309", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 12px 0", fontStyle: "italic" }}>&ldquo;In Soviet Russia...&rdquo;</p>
                <p style={{ margin: "0 0 12px 0", fontStyle: "italic" }}>&ldquo;Is not bug, is feature&rdquo;</p>
                <p style={{ margin: "0 0 12px 0", fontStyle: "italic" }}>&ldquo;Trust me, I am engineer&rdquo;</p>
                <p style={{ margin: 0, fontStyle: "italic" }}>&ldquo;Very nice, yes?&rdquo;</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/russian-accent-generator" currentCategory="Entertainment" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #FECACA", padding: "32px", marginBottom: "24px" }}>
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
        <div style={{ padding: "16px", backgroundColor: "#FEF2F2", borderRadius: "8px", border: "1px solid #FECACA" }}>
          <p style={{ fontSize: "0.75rem", color: "#991B1B", textAlign: "center", margin: 0 }}>
            🎭 <strong>Disclaimer:</strong> This tool is designed for entertainment and creative purposes only. 
            It creates a stylized, stereotypical representation of a Russian accent and is not intended to 
            accurately represent how all Russian speakers speak English.
          </p>
        </div>
      </div>
    </div>
  );
}
