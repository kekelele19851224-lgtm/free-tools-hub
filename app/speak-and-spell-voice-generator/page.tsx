"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// ============================================
// Types & Data
// ============================================

// Preset phrases
const presetPhrases = [
  { text: "That is correct!", emoji: "✅" },
  { text: "Wrong, try again", emoji: "❌" },
  { text: "Spell the word", emoji: "📝" },
  { text: "You win!", emoji: "🏆" },
  { text: "Say it", emoji: "🗣️" },
  { text: "Good job!", emoji: "👏" },
  { text: "Hello", emoji: "👋" },
  { text: "Goodbye", emoji: "👋" },
  { text: "Please try again", emoji: "🔄" },
  { text: "Now spell", emoji: "✏️" },
  { text: "That is incorrect", emoji: "🚫" },
  { text: "You are correct", emoji: "🎯" },
];

// Sample words to spell
const sampleWords = [
  "APPLE", "BANANA", "CAT", "DOG", "ELEPHANT",
  "FLOWER", "GUITAR", "HOUSE", "IGLOO", "JUNGLE",
  "KITE", "LEMON", "MONKEY", "NURSE", "ORANGE",
];

// FAQ data
const faqs = [
  {
    question: "What is Speak & Spell?",
    answer: "Speak & Spell was an educational electronic toy created by Texas Instruments in 1978. It was one of the first handheld electronic devices with a visual display to use text-to-speech synthesis. The toy helped children learn to spell words by speaking them aloud and having users type the correct spelling."
  },
  {
    question: "How does this voice generator work?",
    answer: "This tool uses the Web Speech API built into modern browsers to generate text-to-speech audio. We adjust the pitch and rate settings to create a retro, robotic sound reminiscent of the original Speak & Spell device. The actual voice may vary depending on your browser and operating system."
  },
  {
    question: "Why does the voice sound different on different devices?",
    answer: "The Web Speech API uses voices installed on your device or provided by your browser. Different operating systems (Windows, Mac, iOS, Android) have different built-in voices, which is why the sound may vary. For the most robotic effect, try selecting voices like 'Microsoft David' on Windows or 'Alex' on Mac."
  },
  {
    question: "What is Spell Mode?",
    answer: "Spell Mode breaks down the text into individual letters and speaks them one by one, just like the original Speak & Spell would when teaching spelling. For example, 'CAT' becomes 'C... A... T'. This is great for spelling practice and creating that authentic Speak & Spell experience."
  },
  {
    question: "Can I download the audio?",
    answer: "The Web Speech API generates audio in real-time and doesn't provide a direct download option. However, you can use screen recording software or audio capture tools to record the output if needed for your projects."
  },
  {
    question: "Is this the actual Speak & Spell voice?",
    answer: "No, this is a simulation that aims to recreate the retro, robotic feel of the original Speak & Spell. The original device used a custom speech synthesis chip (TMS5100) with a unique voice that cannot be exactly replicated through modern TTS systems. This tool provides a nostalgic approximation."
  }
];

// FAQ component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #E85D04" }}>
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
        <h3 style={{ fontWeight: "600", color: "#FED7AA", paddingRight: "16px", margin: 0, fontSize: "1rem" }}>{question}</h3>
        <svg style={{ width: "20px", height: "20px", color: "#FB923C", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div style={{ maxHeight: isOpen ? "500px" : "0", overflow: "hidden", transition: "max-height 0.3s ease-out" }}>
        <p style={{ color: "#FDBA74", paddingBottom: "16px", margin: 0, lineHeight: "1.7" }}>{answer}</p>
      </div>
    </div>
  );
}

export default function SpeakAndSpellVoiceGenerator() {
  const [text, setText] = useState('');
  const [pitch, setPitch] = useState(0.8);
  const [rate, setRate] = useState(0.7);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [spellMode, setSpellMode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [displayText, setDisplayText] = useState('SPEAK & SPELL');
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      
      const loadVoices = () => {
        const availableVoices = synthRef.current?.getVoices() || [];
        // Filter to English voices for better compatibility
        const englishVoices = availableVoices.filter(v => v.lang.startsWith('en'));
        setVoices(englishVoices.length > 0 ? englishVoices : availableVoices);
        
        // Try to select a robotic-sounding voice by default
        const preferredVoices = ['Microsoft David', 'Microsoft Mark', 'Alex', 'Daniel', 'Google US English'];
        const defaultVoice = availableVoices.find(v => 
          preferredVoices.some(pv => v.name.includes(pv))
        );
        if (defaultVoice) {
          setSelectedVoice(defaultVoice.name);
        } else if (availableVoices.length > 0) {
          setSelectedVoice(availableVoices[0].name);
        }
      };

      loadVoices();
      synthRef.current.onvoiceschanged = loadVoices;
    } else {
      setIsSupported(false);
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Speak function
  const speak = (textToSpeak: string, isSpellMode: boolean = spellMode) => {
    if (!synthRef.current || !textToSpeak.trim()) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    let finalText = textToSpeak.trim();
    
    // In spell mode, add pauses between letters
    if (isSpellMode) {
      finalText = textToSpeak.toUpperCase().split('').filter(c => c !== ' ').join('... ');
    }

    setDisplayText(textToSpeak.toUpperCase().slice(0, 20));
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(finalText);
    utterance.pitch = pitch;
    utterance.rate = rate;
    
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onend = () => {
      setIsSpeaking(false);
      setDisplayText('SPEAK & SPELL');
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setDisplayText('ERROR');
    };

    synthRef.current.speak(utterance);
  };

  // Stop speaking
  const stop = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      setDisplayText('SPEAK & SPELL');
    }
  };

  // Speak a random word
  const speakRandomWord = () => {
    const word = sampleWords[Math.floor(Math.random() * sampleWords.length)];
    setText(word);
    speak(`Spell the word... ${word}`, false);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#1C1917" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "#292524", borderBottom: "1px solid #E85D04" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#A8A29E" }}>
            <Link href="/" style={{ color: "#A8A29E", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#FB923C" }}>Speak and Spell Voice Generator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "2.5rem" }}>🔊</span>
            <h1 style={{ fontSize: "clamp(1.75rem, 5vw, 2.25rem)", fontWeight: "bold", color: "#FB923C", margin: 0 }}>
              Speak and Spell Voice Generator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#A8A29E", maxWidth: "800px" }}>
            Recreate the classic 80s robotic voice! Enter any text and hear it spoken 
            in a retro text-to-speech style inspired by the iconic Texas Instruments toy.
          </p>
        </div>

        {/* Info Box */}
        <div style={{
          backgroundColor: "#E85D04",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>📢</span>
            <div>
              <p style={{ fontWeight: "600", color: "#FFFFFF", margin: "0 0 4px 0" }}>
                <strong>Browser Audio Required</strong>
              </p>
              <p style={{ color: "#FED7AA", margin: 0, fontSize: "0.95rem" }}>
                This tool uses your browser&apos;s built-in text-to-speech. Make sure your volume is on! 
                The voice may sound different depending on your browser and operating system.
              </p>
            </div>
          </div>
        </div>

        {!isSupported && (
          <div style={{
            backgroundColor: "#7F1D1D",
            borderRadius: "12px",
            padding: "20px 24px",
            marginBottom: "32px",
            border: "1px solid #DC2626"
          }}>
            <p style={{ color: "#FCA5A5", margin: 0, textAlign: "center" }}>
              ⚠️ Sorry, your browser doesn&apos;t support the Web Speech API. Please try Chrome, Edge, or Safari.
            </p>
          </div>
        )}

        {/* Main Grid */}
        <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
          {/* Input Panel */}
          <div style={{
            backgroundColor: "#292524",
            borderRadius: "16px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
            border: "3px solid #78350F",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#E85D04", padding: "16px 24px" }}>
              <h2 style={{ color: "#FFFFFF", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                ⌨️ Enter Text
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              {/* Text Input */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#FB923C", marginBottom: "10px", fontWeight: "600" }}>
                  💬 Text to Speak
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type something to speak..."
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    border: "2px solid #78350F",
                    borderRadius: "8px",
                    backgroundColor: "#1C1917",
                    color: "#FFFFFF",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                    resize: "vertical",
                    fontFamily: "monospace"
                  }}
                />
              </div>

              {/* Spell Mode Toggle */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                  <div style={{
                    width: "50px",
                    height: "26px",
                    backgroundColor: spellMode ? "#E85D04" : "#44403C",
                    borderRadius: "13px",
                    position: "relative",
                    transition: "background-color 0.2s"
                  }}>
                    <div style={{
                      width: "22px",
                      height: "22px",
                      backgroundColor: "#FFFFFF",
                      borderRadius: "50%",
                      position: "absolute",
                      top: "2px",
                      left: spellMode ? "26px" : "2px",
                      transition: "left 0.2s"
                    }} />
                  </div>
                  <input
                    type="checkbox"
                    checked={spellMode}
                    onChange={(e) => setSpellMode(e.target.checked)}
                    style={{ display: "none" }}
                  />
                  <div>
                    <span style={{ color: "#FB923C", fontWeight: "600" }}>Spell Mode</span>
                    <p style={{ color: "#A8A29E", fontSize: "0.8rem", margin: "2px 0 0 0" }}>
                      Spell out each letter (C... A... T)
                    </p>
                  </div>
                </label>
              </div>

              {/* Pitch Slider */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <label style={{ fontSize: "0.9rem", color: "#FB923C", fontWeight: "600" }}>
                    🎵 Pitch
                  </label>
                  <span style={{ color: "#A8A29E", fontSize: "0.85rem" }}>{pitch.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={pitch}
                  onChange={(e) => setPitch(parseFloat(e.target.value))}
                  style={{
                    width: "100%",
                    accentColor: "#E85D04"
                  }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "#78716C" }}>
                  <span>Low (Robotic)</span>
                  <span>High</span>
                </div>
              </div>

              {/* Rate Slider */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <label style={{ fontSize: "0.9rem", color: "#FB923C", fontWeight: "600" }}>
                    ⚡ Speed
                  </label>
                  <span style={{ color: "#A8A29E", fontSize: "0.85rem" }}>{rate.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="2"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                  style={{
                    width: "100%",
                    accentColor: "#E85D04"
                  }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "#78716C" }}>
                  <span>Slow</span>
                  <span>Fast</span>
                </div>
              </div>

              {/* Voice Selection */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#FB923C", marginBottom: "10px", fontWeight: "600" }}>
                  🎤 Voice
                </label>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #78350F",
                    borderRadius: "8px",
                    backgroundColor: "#1C1917",
                    color: "#FFFFFF",
                    fontSize: "0.9rem",
                    cursor: "pointer"
                  }}
                >
                  {voices.map((voice) => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={() => speak(text)}
                  disabled={!isSupported || isSpeaking || !text.trim()}
                  style={{
                    flex: 1,
                    padding: "16px",
                    backgroundColor: isSpeaking ? "#78350F" : "#E85D04",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "1.1rem",
                    fontWeight: "700",
                    cursor: isSpeaking || !text.trim() ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    opacity: !text.trim() ? 0.5 : 1
                  }}
                >
                  {isSpeaking ? "🔊 Speaking..." : "▶️ Speak"}
                </button>
                {isSpeaking && (
                  <button
                    onClick={stop}
                    style={{
                      padding: "16px 24px",
                      backgroundColor: "#DC2626",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "10px",
                      fontSize: "1.1rem",
                      fontWeight: "700",
                      cursor: "pointer"
                    }}
                  >
                    ⏹️ Stop
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Display Panel */}
          <div className="calc-results" style={{
            backgroundColor: "#292524",
            borderRadius: "16px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
            border: "3px solid #78350F",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#C2410C", padding: "16px 24px" }}>
              <h2 style={{ color: "#FFFFFF", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                📺 Display
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              {/* LCD Display */}
              <div style={{
                backgroundColor: "#365314",
                borderRadius: "8px",
                padding: "24px",
                marginBottom: "24px",
                border: "4px solid #1C1917",
                boxShadow: "inset 0 2px 10px rgba(0,0,0,0.5)"
              }}>
                <div style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: "clamp(1.5rem, 4vw, 2rem)",
                  color: "#84CC16",
                  textAlign: "center",
                  textShadow: "0 0 10px #84CC16",
                  letterSpacing: "4px",
                  fontWeight: "700"
                }}>
                  {displayText}
                </div>
              </div>

              {/* Preset Phrases */}
              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ color: "#FB923C", fontSize: "1rem", marginBottom: "12px", fontWeight: "600" }}>
                  🎯 Quick Phrases
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                  {presetPhrases.map((phrase, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setText(phrase.text);
                        speak(phrase.text, false);
                      }}
                      disabled={isSpeaking || !isSupported}
                      style={{
                        padding: "10px 8px",
                        backgroundColor: "#44403C",
                        border: "2px solid #78350F",
                        borderRadius: "8px",
                        cursor: isSpeaking ? "not-allowed" : "pointer",
                        color: "#FED7AA",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                        opacity: isSpeaking ? 0.5 : 1
                      }}
                    >
                      {phrase.emoji} {phrase.text}
                    </button>
                  ))}
                </div>
              </div>

              {/* Random Word Button */}
              <button
                onClick={speakRandomWord}
                disabled={isSpeaking || !isSupported}
                style={{
                  width: "100%",
                  padding: "14px",
                  backgroundColor: "#78350F",
                  color: "#FED7AA",
                  border: "2px solid #E85D04",
                  borderRadius: "10px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: isSpeaking ? "not-allowed" : "pointer",
                  opacity: isSpeaking ? 0.5 : 1
                }}
              >
                🎲 Random Spelling Word
              </button>

              {/* Tips */}
              <div style={{
                marginTop: "20px",
                padding: "16px",
                backgroundColor: "#1C1917",
                borderRadius: "8px",
                border: "1px solid #44403C"
              }}>
                <h4 style={{ color: "#FB923C", margin: "0 0 8px 0", fontSize: "0.9rem" }}>💡 Tips for Best Results</h4>
                <ul style={{ margin: 0, paddingLeft: "16px", color: "#A8A29E", fontSize: "0.8rem", lineHeight: "1.7" }}>
                  <li>Lower pitch = more robotic sound</li>
                  <li>Slower speed = clearer pronunciation</li>
                  <li>Enable Spell Mode for letter-by-letter</li>
                  <li>Try different voices for unique effects</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* History Box */}
        <div style={{ 
          backgroundColor: "#292524", 
          borderRadius: "16px", 
          boxShadow: "0 4px 6px rgba(0,0,0,0.3)", 
          border: "3px solid #78350F", 
          padding: "32px",
          marginBottom: "32px"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#FB923C", marginBottom: "20px" }}>
            📜 About Speak & Spell
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
            <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#1C1917", borderRadius: "12px", border: "1px solid #44403C" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>📅</div>
              <div style={{ color: "#FB923C", fontWeight: "700", fontSize: "1.25rem" }}>1978</div>
              <div style={{ color: "#A8A29E", fontSize: "0.85rem" }}>Year Introduced</div>
            </div>
            <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#1C1917", borderRadius: "12px", border: "1px solid #44403C" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🏭</div>
              <div style={{ color: "#FB923C", fontWeight: "700", fontSize: "1.25rem" }}>Texas Instruments</div>
              <div style={{ color: "#A8A29E", fontSize: "0.85rem" }}>Manufacturer</div>
            </div>
            <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#1C1917", borderRadius: "12px", border: "1px solid #44403C" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🎵</div>
              <div style={{ color: "#FB923C", fontWeight: "700", fontSize: "1.25rem" }}>TMS5100</div>
              <div style={{ color: "#A8A29E", fontSize: "0.85rem" }}>Speech Chip</div>
            </div>
            <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#1C1917", borderRadius: "12px", border: "1px solid #44403C" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>📚</div>
              <div style={{ color: "#FB923C", fontWeight: "700", fontSize: "1.25rem" }}>200+ Words</div>
              <div style={{ color: "#A8A29E", fontSize: "0.85rem" }}>Built-in Vocabulary</div>
            </div>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "#292524", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.3)", border: "3px solid #78350F", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#FB923C", marginBottom: "20px" }}>
                🎮 The Legacy of Speak & Spell
              </h2>

              <div style={{ color: "#A8A29E", lineHeight: "1.8" }}>
                <p>
                  The Speak & Spell was a groundbreaking educational toy that introduced millions of children 
                  to the world of technology and learning. Its distinctive robotic voice became iconic, 
                  appearing in movies like <strong style={{ color: "#FB923C" }}>E.T. the Extra-Terrestrial</strong> (1982) 
                  where E.T. famously uses it to &quot;phone home.&quot;
                </p>

                <h3 style={{ color: "#FB923C", marginTop: "24px", marginBottom: "12px" }}>Why People Love It</h3>
                <div style={{
                  backgroundColor: "#1C1917",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #44403C"
                }}>
                  <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "2", color: "#A8A29E" }}>
                    <li><strong style={{ color: "#FB923C" }}>Nostalgia:</strong> Brings back childhood memories of the 80s</li>
                    <li><strong style={{ color: "#FB923C" }}>Unique Voice:</strong> The robotic speech is instantly recognizable</li>
                    <li><strong style={{ color: "#FB923C" }}>Pop Culture:</strong> Featured in movies, games (FNAF), and music</li>
                    <li><strong style={{ color: "#FB923C" }}>Education:</strong> Helped generations learn to spell</li>
                    <li><strong style={{ color: "#FB923C" }}>Technology Pioneer:</strong> First portable TTS device</li>
                  </ul>
                </div>

                <h3 style={{ color: "#FB923C", marginTop: "24px", marginBottom: "12px" }}>Modern Uses</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", marginTop: "16px" }}>
                  {[
                    { name: 'YouTube Videos', desc: 'Retro content' },
                    { name: 'Music Production', desc: 'Unique vocals' },
                    { name: 'Game Development', desc: 'Retro aesthetics' },
                    { name: 'Educational Apps', desc: 'Spelling practice' },
                    { name: 'Podcasts', desc: 'Sound effects' },
                    { name: 'Social Media', desc: 'Viral content' },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "12px",
                        backgroundColor: "#1C1917",
                        borderRadius: "8px",
                        border: "1px solid #44403C"
                      }}
                    >
                      <p style={{ margin: 0, color: "#FB923C", fontWeight: "600", fontSize: "0.9rem" }}>{item.name}</p>
                      <p style={{ margin: "4px 0 0 0", color: "#78716C", fontSize: "0.75rem" }}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Fun Facts */}
            <div style={{ backgroundColor: "#E85D04", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#FFFFFF", marginBottom: "16px" }}>⚡ Fun Facts</h3>
              <div style={{ fontSize: "0.85rem", lineHeight: "1.9", color: "#FED7AA" }}>
                <p style={{ margin: "0 0 8px 0" }}>🎬 Featured in E.T. (1982)</p>
                <p style={{ margin: "0 0 8px 0" }}>🎸 Used by Kraftwerk & Depeche Mode</p>
                <p style={{ margin: "0 0 8px 0" }}>🎮 Inspiration for FNAF games</p>
                <p style={{ margin: 0 }}>💰 Original price: $50 (1978)</p>
              </div>
            </div>

            {/* Browser Support */}
            <div style={{ backgroundColor: "#1C1917", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "2px solid #78350F" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#FB923C", marginBottom: "16px" }}>🌐 Browser Support</h3>
              <p style={{ fontSize: "0.85rem", color: "#A8A29E", lineHeight: "1.7", margin: 0 }}>
                ✅ Chrome (Best)<br/>
                ✅ Edge<br/>
                ✅ Safari<br/>
                ✅ Firefox<br/>
                ⚠️ Mobile browsers may vary
              </p>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/speak-and-spell-voice-generator" currentCategory="Generator" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "#292524", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.3)", border: "3px solid #78350F", padding: "32px", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#FB923C", marginBottom: "24px" }}>
            Frequently Asked Questions
          </h2>
          <div>
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ padding: "16px", backgroundColor: "#292524", borderRadius: "8px", border: "2px solid #78350F" }}>
          <p style={{ fontSize: "0.75rem", color: "#FB923C", textAlign: "center", margin: 0 }}>
            🔊 <strong>Disclaimer:</strong> This is a simulation inspired by the classic Speak & Spell toy. 
            It is not affiliated with Texas Instruments. The voice generated uses your browser&apos;s built-in 
            text-to-speech and may not exactly replicate the original device&apos;s voice.
          </p>
        </div>
      </div>
    </div>
  );
}