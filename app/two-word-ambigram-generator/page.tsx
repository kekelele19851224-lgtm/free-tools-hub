"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Letter pairing compatibility data
const letterPairs: { [key: string]: { [key: string]: { score: number; note: string } } } = {
  'A': { 'A': { score: 3, note: 'Perfect' }, 'V': { score: 3, note: 'Perfect' }, 'E': { score: 2, note: 'Good with styling' }, 'H': { score: 2, note: 'Workable' }, 'Y': { score: 2, note: 'Good' } },
  'B': { 'B': { score: 3, note: 'Perfect' }, 'D': { score: 2, note: 'Mirror flip' }, 'Q': { score: 2, note: 'Workable' } },
  'C': { 'C': { score: 3, note: 'Perfect' }, 'U': { score: 2, note: 'Good with curves' }, 'D': { score: 1, note: 'Challenging' } },
  'D': { 'D': { score: 3, note: 'Perfect' }, 'B': { score: 2, note: 'Mirror flip' }, 'P': { score: 2, note: 'Rotational' } },
  'E': { 'E': { score: 3, note: 'Perfect' }, 'A': { score: 2, note: 'Good with styling' }, 'W': { score: 2, note: 'Workable' }, '3': { score: 2, note: 'Numeric style' } },
  'F': { 'F': { score: 3, note: 'Perfect' }, 'J': { score: 2, note: 'Good rotational' }, 'L': { score: 1, note: 'Challenging' } },
  'G': { 'G': { score: 3, note: 'Perfect' }, 'C': { score: 2, note: 'Similar curves' } },
  'H': { 'H': { score: 3, note: 'Perfect symmetric' }, 'I': { score: 2, note: 'Good' }, 'A': { score: 2, note: 'Workable' } },
  'I': { 'I': { score: 3, note: 'Perfect' }, 'L': { score: 2, note: 'Good' }, 'T': { score: 2, note: 'Workable' }, 'H': { score: 2, note: 'Good' } },
  'J': { 'J': { score: 3, note: 'Perfect' }, 'F': { score: 2, note: 'Good rotational' }, 'L': { score: 2, note: 'Workable' } },
  'K': { 'K': { score: 3, note: 'Perfect' }, 'X': { score: 2, note: 'Angular match' } },
  'L': { 'L': { score: 3, note: 'Perfect' }, 'J': { score: 2, note: 'Rotational' }, 'I': { score: 2, note: 'Good' }, 'T': { score: 2, note: 'Workable' } },
  'M': { 'M': { score: 3, note: 'Perfect' }, 'W': { score: 3, note: 'Perfect flip' } },
  'N': { 'N': { score: 3, note: 'Perfect' }, 'Z': { score: 3, note: 'Perfect rotational' }, 'U': { score: 2, note: 'Workable' } },
  'O': { 'O': { score: 3, note: 'Perfect symmetric' }, '0': { score: 3, note: 'Identical' } },
  'P': { 'P': { score: 3, note: 'Perfect' }, 'D': { score: 2, note: 'Rotational' }, 'B': { score: 2, note: 'Similar shape' } },
  'Q': { 'Q': { score: 3, note: 'Perfect' }, 'O': { score: 2, note: 'Similar base' }, 'B': { score: 2, note: 'Workable' } },
  'R': { 'R': { score: 3, note: 'Perfect' }, 'A': { score: 2, note: 'Good with styling' }, 'N': { score: 1, note: 'Challenging' } },
  'S': { 'S': { score: 3, note: 'Perfect rotational' }, '5': { score: 2, note: 'Numeric style' }, 'Z': { score: 2, note: 'Workable' } },
  'T': { 'T': { score: 3, note: 'Perfect' }, 'L': { score: 2, note: 'Workable' }, 'I': { score: 2, note: 'Good' } },
  'U': { 'U': { score: 3, note: 'Perfect' }, 'N': { score: 2, note: 'Rotational' }, 'C': { score: 2, note: 'Good with curves' } },
  'V': { 'V': { score: 3, note: 'Perfect' }, 'A': { score: 3, note: 'Perfect flip' } },
  'W': { 'W': { score: 3, note: 'Perfect' }, 'M': { score: 3, note: 'Perfect flip' }, 'E': { score: 2, note: 'Workable' } },
  'X': { 'X': { score: 3, note: 'Perfect symmetric' }, 'K': { score: 2, note: 'Angular match' } },
  'Y': { 'Y': { score: 3, note: 'Perfect' }, 'A': { score: 2, note: 'Good' } },
  'Z': { 'Z': { score: 3, note: 'Perfect' }, 'N': { score: 3, note: 'Perfect rotational' }, 'S': { score: 2, note: 'Workable' } }
};

// Font styles for preview
const fontStyles = [
  { id: "script", label: "Script", fontFamily: "'Brush Script MT', cursive", description: "Elegant cursive style" },
  { id: "bold", label: "Bold", fontFamily: "'Arial Black', sans-serif", description: "Strong and impactful" },
  { id: "gothic", label: "Gothic", fontFamily: "'Times New Roman', serif", description: "Classic tattoo style" },
  { id: "modern", label: "Modern", fontFamily: "'Helvetica Neue', sans-serif", description: "Clean and minimal" }
];

// Ambigram types data
const ambigramTypes = [
  {
    id: "rotational",
    name: "Rotational Ambigram",
    description: "The most common type. Reads the same (or as a different word) when rotated 180°. Perfect for tattoos that can be viewed from any angle.",
    example: "LOVE ↔ LOVE (same) or LIFE ↔ DEATH (different)",
    difficulty: "Medium",
    bestFor: "Tattoos, logos, art prints"
  },
  {
    id: "mirror",
    name: "Mirror Ambigram",
    description: "Reads correctly when reflected in a mirror (horizontal flip). Creates symmetrical designs.",
    example: "MOM, WOW, OTTO",
    difficulty: "Easy",
    bestFor: "Symmetric names, window decals"
  },
  {
    id: "chain",
    name: "Chain Ambigram",
    description: "A repeating pattern where the word connects end-to-end, creating an infinite loop.",
    example: "Words that tile seamlessly",
    difficulty: "Hard",
    bestFor: "Borders, bracelets, rings"
  },
  {
    id: "figure-ground",
    name: "Figure-Ground Ambigram",
    description: "The negative space between letters forms a second word. Two words occupy the same space.",
    example: "One word in black, another appears in white space",
    difficulty: "Very Hard",
    bestFor: "Artistic logos, advanced designs"
  },
  {
    id: "3d",
    name: "3D Ambigram",
    description: "A three-dimensional design that shows different words from different viewing angles.",
    example: "View from front: WORD1, View from side: WORD2",
    difficulty: "Expert",
    bestFor: "Sculptures, 3D prints, installations"
  }
];

// Natural letter pairs that work well
const naturalPairs = [
  { pair: "M ↔ W", note: "Perfect natural flip" },
  { pair: "N ↔ Z", note: "Perfect rotational" },
  { pair: "A ↔ V", note: "Inverted triangles" },
  { pair: "S ↔ S", note: "180° identical" },
  { pair: "O ↔ O", note: "Perfect circle" },
  { pair: "H ↔ H", note: "Symmetric" },
  { pair: "X ↔ X", note: "Symmetric" },
  { pair: "I ↔ I", note: "Symmetric" }
];

// FAQ data
const faqs = [
  {
    question: "How to create an ambigram with two names?",
    answer: "To create a two-name ambigram: 1) Write the first name normally, 2) Write the second name upside down below it, 3) Align both words letter by letter, 4) Merge similar letters into shared strokes. Use cursive fonts for better flow. For unequal length names, add flourishes or adjust letter spacing. Our Letter Match Analyzer above can help you identify which letter pairs work best together."
  },
  {
    question: "Is there a free online ambigram generator for two names?",
    answer: "Yes, there are several free ambigram generators online including our tool above, FlipScript (limited free version), The Dressed Mole-Rat Ambigenerator, and Ambimatic (Android app). Most free tools work best when both words have the same length. For professional quality or complex designs, consider hiring a calligraphy artist or using paid services."
  },
  {
    question: "Can AI create ambigram?",
    answer: "Yes, AI tools like DALL-E, Midjourney, and specialized ambigram generators can create ambigrams. However, AI-generated ambigrams often require refinement for readability. AI works best for generating initial concepts, but for tattoo-quality designs, human artists typically produce cleaner, more balanced results. Tools like Fotor and Clipfly offer AI-powered ambigram generation."
  },
  {
    question: "What is a two-word ambigram called?",
    answer: "A two-word ambigram where each word appears when rotated 180° is called a 'rotational ambigram' or 'symbiotogram.' When both words are different (like LIFE/DEATH), it's specifically called an 'asymmetric rotational ambigram.' When the same word appears both ways (like SWIMS), it's a 'symmetric rotational ambigram.'"
  },
  {
    question: "What words make good ambigrams?",
    answer: "Words with these letter combinations work best: M/W pairs, N/Z pairs, A/V pairs, S (rotates to itself), O (symmetric), and words with similar letter structures. Names like 'Anna,' words like 'NOON,' 'SWIMS,' and pairs like 'LOVE/LIFE' are popular choices. Shorter words (4-6 letters) are easier than longer ones."
  },
  {
    question: "How much does a custom ambigram tattoo cost?",
    answer: "A custom ambigram design from a professional artist typically costs $30-$150 depending on complexity. The actual tattoo cost varies by size and location but ranges from $100-$500+. Many tattoo artists offer design services, or you can commission a calligrapher and bring the design to your tattoo artist."
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
        <svg
          style={{
            width: "20px",
            height: "20px",
            color: "#6B7280",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
            flexShrink: 0
          }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div style={{
        maxHeight: isOpen ? "500px" : "0",
        overflow: "hidden",
        transition: "max-height 0.2s ease-out"
      }}>
        <p style={{ color: "#4B5563", paddingBottom: "16px", margin: 0, lineHeight: "1.6" }}>{answer}</p>
      </div>
    </div>
  );
}

export default function TwoWordAmbigramGenerator() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"preview" | "analyzer" | "types">("preview");
  
  // Preview state (Tab 1)
  const [word1, setWord1] = useState("");
  const [word2, setWord2] = useState("");
  const [selectedFont, setSelectedFont] = useState("script");
  const [primaryColor, setPrimaryColor] = useState("#1e40af");
  const [isRotated, setIsRotated] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  
  // Analyzer state (Tab 2)
  const [analyzeWord1, setAnalyzeWord1] = useState("");
  const [analyzeWord2, setAnalyzeWord2] = useState("");

  // Get font family
  const getFontFamily = () => {
    return fontStyles.find(f => f.id === selectedFont)?.fontFamily || fontStyles[0].fontFamily;
  };

  // Analyze letter pairs
  const analyzeLetterPairs = () => {
    if (!analyzeWord1 || !analyzeWord2) return null;
    
    const w1 = analyzeWord1.toUpperCase();
    const w2 = analyzeWord2.toUpperCase();
    const maxLen = Math.max(w1.length, w2.length);
    const pairs: { letter1: string; letter2: string; score: number; note: string }[] = [];
    
    for (let i = 0; i < maxLen; i++) {
      const l1 = w1[i] || '-';
      const l2 = w2[w2.length - 1 - i] || '-'; // Reverse order for rotation
      
      let score = 1;
      let note = "May need creative styling";
      
      if (l1 === '-' || l2 === '-') {
        score = 0;
        note = "Length mismatch - add flourish";
      } else if (l1 === l2) {
        score = 3;
        note = "Perfect match";
      } else if (letterPairs[l1]?.[l2]) {
        score = letterPairs[l1][l2].score;
        note = letterPairs[l1][l2].note;
      } else if (letterPairs[l2]?.[l1]) {
        score = letterPairs[l2][l1].score;
        note = letterPairs[l2][l1].note;
      }
      
      pairs.push({ letter1: l1, letter2: l2, score, note });
    }
    
    const avgScore = pairs.reduce((sum, p) => sum + p.score, 0) / pairs.length;
    
    return { pairs, avgScore, word1Length: w1.length, word2Length: w2.length };
  };

  const analysisResult = analyzeLetterPairs();

  // Download preview as image (simplified - shows instructions)
  const handleDownload = () => {
    alert("To save this ambigram:\n\n1. Take a screenshot of the preview\n2. Or use browser's 'Print to PDF' feature\n3. For high-quality designs, consider professional ambigram services\n\nTip: This preview is a concept guide - final tattoo designs should be refined by an artist.");
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Two Word Ambigram Generator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🔄</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Two Word Ambigram Generator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Create ambigram designs with two words that read differently when rotated 180°. Perfect for tattoos, logos, and art. Preview your design and analyze letter compatibility.
          </p>
        </div>

        {/* Quick Info Box */}
        <div style={{
          backgroundColor: "#EFF6FF",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #BFDBFE"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "#1E40AF", margin: "0 0 4px 0" }}>What is a Two-Word Ambigram?</p>
              <p style={{ color: "#1E40AF", margin: 0, fontSize: "0.95rem" }}>
                An ambigram is a typographical design that reads as one word right-side up and a different word when rotated 180°. 
                Popular examples include LIFE/DEATH, LOVE/HATE, and name combinations for couples.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          {[
            { id: "preview", label: "Ambigram Preview", icon: "🎨" },
            { id: "analyzer", label: "Letter Match Analyzer", icon: "🔍" },
            { id: "types", label: "Ambigram Types Guide", icon: "📚" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              style={{
                padding: "12px 20px",
                borderRadius: "8px",
                border: activeTab === tab.id ? "2px solid #2563EB" : "1px solid #E5E7EB",
                backgroundColor: activeTab === tab.id ? "#EFF6FF" : "white",
                color: activeTab === tab.id ? "#1D4ED8" : "#4B5563",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Preview */}
        {activeTab === "preview" && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#2563EB", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🎨 Create Your Ambigram</h2>
              </div>
              
              <div style={{ padding: "24px" }}>
                {/* Word 1 Input */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Word 1 (Right-side up)
                  </label>
                  <input
                    type="text"
                    value={word1}
                    onChange={(e) => setWord1(e.target.value.toUpperCase())}
                    placeholder="e.g., LOVE"
                    maxLength={12}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "1px solid #E5E7EB",
                      fontSize: "1.1rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                {/* Word 2 Input */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Word 2 (Upside down)
                  </label>
                  <input
                    type="text"
                    value={word2}
                    onChange={(e) => setWord2(e.target.value.toUpperCase())}
                    placeholder="e.g., HATE"
                    maxLength={12}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "1px solid #E5E7EB",
                      fontSize: "1.1rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                {/* Font Selection */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Font Style
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {fontStyles.map((font) => (
                      <button
                        key={font.id}
                        onClick={() => setSelectedFont(font.id)}
                        style={{
                          padding: "12px",
                          borderRadius: "8px",
                          border: selectedFont === font.id ? "2px solid #2563EB" : "1px solid #E5E7EB",
                          backgroundColor: selectedFont === font.id ? "#EFF6FF" : "white",
                          cursor: "pointer",
                          textAlign: "left"
                        }}
                      >
                        <span style={{ fontFamily: font.fontFamily, fontSize: "1rem", display: "block" }}>{font.label}</span>
                        <span style={{ fontSize: "0.7rem", color: "#6B7280" }}>{font.description}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Picker */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Color
                  </label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {["#1e40af", "#000000", "#dc2626", "#059669", "#7c3aed", "#d97706"].map((color) => (
                      <button
                        key={color}
                        onClick={() => setPrimaryColor(color)}
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "8px",
                          backgroundColor: color,
                          border: primaryColor === color ? "3px solid #000" : "1px solid #E5E7EB",
                          cursor: "pointer"
                        }}
                      />
                    ))}
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      style={{ width: "40px", height: "40px", borderRadius: "8px", cursor: "pointer" }}
                    />
                  </div>
                </div>

                {/* Rotate Button */}
                <button
                  onClick={() => setIsRotated(!isRotated)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB",
                    backgroundColor: "#F3F4F6",
                    color: "#374151",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px"
                  }}
                >
                  🔄 Rotate 180° to See Word 2
                </button>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="calc-results" style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>👁️ Preview</h2>
              </div>
              
              <div style={{ padding: "24px" }}>
                {/* Preview Display */}
                <div
                  ref={previewRef}
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "2px dashed #E5E7EB",
                    borderRadius: "12px",
                    padding: "40px 20px",
                    textAlign: "center",
                    marginBottom: "20px",
                    minHeight: "200px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "transform 0.5s ease"
                  }}
                >
                  {word1 || word2 ? (
                    <div style={{ transform: isRotated ? "rotate(180deg)" : "none", transition: "transform 0.5s ease" }}>
                      <div style={{
                        fontFamily: getFontFamily(),
                        fontSize: "clamp(2rem, 8vw, 4rem)",
                        fontWeight: "bold",
                        color: primaryColor,
                        letterSpacing: "0.1em",
                        lineHeight: "1.2"
                      }}>
                        {word1 || "WORD1"}
                      </div>
                      <div style={{
                        fontFamily: getFontFamily(),
                        fontSize: "clamp(1rem, 4vw, 1.5rem)",
                        color: "#9CA3AF",
                        marginTop: "8px",
                        transform: "rotate(180deg)"
                      }}>
                        {word2 || "WORD2"}
                      </div>
                    </div>
                  ) : (
                    <p style={{ color: "#9CA3AF", margin: 0 }}>Enter words above to see preview</p>
                  )}
                </div>

                {/* Currently Showing */}
                <div style={{
                  backgroundColor: isRotated ? "#FEF3C7" : "#ECFDF5",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  textAlign: "center",
                  marginBottom: "20px"
                }}>
                  <p style={{ margin: 0, fontWeight: "600", color: isRotated ? "#92400E" : "#065F46" }}>
                    Currently showing: {isRotated ? (word2 || "WORD2") : (word1 || "WORD1")}
                  </p>
                </div>

                {/* Download Button */}
                <button
                  onClick={handleDownload}
                  disabled={!word1 && !word2}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: (!word1 && !word2) ? "#E5E7EB" : "#2563EB",
                    color: (!word1 && !word2) ? "#9CA3AF" : "white",
                    fontWeight: "600",
                    fontSize: "1rem",
                    cursor: (!word1 && !word2) ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px"
                  }}
                >
                  📥 Save / Download Tips
                </button>

                {/* Note */}
                <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "#FEF3C7", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.8rem", color: "#92400E", margin: 0, lineHeight: "1.5" }}>
                    <strong>Note:</strong> This is a concept preview. For tattoo-quality designs, the letters need to be 
                    artistically merged so each letter works for both words. Consider hiring a professional calligrapher 
                    for your final design.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Letter Match Analyzer */}
        {activeTab === "analyzer" && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#7C3AED", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🔍 Analyze Letter Compatibility</h2>
              </div>
              
              <div style={{ padding: "24px" }}>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    First Word
                  </label>
                  <input
                    type="text"
                    value={analyzeWord1}
                    onChange={(e) => setAnalyzeWord1(e.target.value)}
                    placeholder="e.g., LOVE"
                    maxLength={12}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "1px solid #E5E7EB",
                      fontSize: "1.1rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Second Word
                  </label>
                  <input
                    type="text"
                    value={analyzeWord2}
                    onChange={(e) => setAnalyzeWord2(e.target.value)}
                    placeholder="e.g., HATE"
                    maxLength={12}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "1px solid #E5E7EB",
                      fontSize: "1.1rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                {/* Natural Pairs Reference */}
                <div style={{ backgroundColor: "#F5F3FF", padding: "16px", borderRadius: "12px" }}>
                  <h4 style={{ margin: "0 0 12px 0", color: "#5B21B6", fontSize: "0.9rem" }}>✨ Best Natural Letter Pairs</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {naturalPairs.map((pair, idx) => (
                      <div key={idx} style={{ fontSize: "0.85rem", color: "#374151" }}>
                        <strong>{pair.pair}</strong>
                        <span style={{ color: "#6B7280", fontSize: "0.75rem" }}> - {pair.note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="calc-results" style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#DC2626", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Compatibility Analysis</h2>
              </div>
              
              <div style={{ padding: "24px" }}>
                {analysisResult ? (
                  <>
                    {/* Overall Score */}
                    <div style={{
                      backgroundColor: analysisResult.avgScore >= 2.5 ? "#ECFDF5" : analysisResult.avgScore >= 1.5 ? "#FEF3C7" : "#FEE2E2",
                      padding: "20px",
                      borderRadius: "12px",
                      textAlign: "center",
                      marginBottom: "20px"
                    }}>
                      <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: "0 0 4px 0" }}>Overall Compatibility</p>
                      <p style={{
                        fontSize: "2rem",
                        fontWeight: "bold",
                        margin: "0 0 4px 0",
                        color: analysisResult.avgScore >= 2.5 ? "#059669" : analysisResult.avgScore >= 1.5 ? "#D97706" : "#DC2626"
                      }}>
                        {analysisResult.avgScore >= 2.5 ? "Excellent" : analysisResult.avgScore >= 1.5 ? "Workable" : "Challenging"}
                      </p>
                      <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0 }}>
                        Score: {analysisResult.avgScore.toFixed(1)} / 3.0
                      </p>
                    </div>

                    {/* Length Warning */}
                    {analysisResult.word1Length !== analysisResult.word2Length && (
                      <div style={{
                        backgroundColor: "#FEF3C7",
                        padding: "12px",
                        borderRadius: "8px",
                        marginBottom: "16px",
                        border: "1px solid #FCD34D"
                      }}>
                        <p style={{ margin: 0, fontSize: "0.85rem", color: "#92400E" }}>
                          ⚠️ Words have different lengths ({analysisResult.word1Length} vs {analysisResult.word2Length}). 
                          You&apos;ll need flourishes or creative spacing to balance the design.
                        </p>
                      </div>
                    )}

                    {/* Letter by Letter Analysis */}
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151" }}>Letter-by-Letter Match</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {analysisResult.pairs.map((pair, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "10px 12px",
                            backgroundColor: pair.score === 3 ? "#ECFDF5" : pair.score === 2 ? "#FEF3C7" : "#FEE2E2",
                            borderRadius: "8px"
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontWeight: "bold", fontSize: "1.1rem", fontFamily: "monospace" }}>
                              {pair.letter1}
                            </span>
                            <span style={{ color: "#6B7280" }}>↔</span>
                            <span style={{ fontWeight: "bold", fontSize: "1.1rem", fontFamily: "monospace" }}>
                              {pair.letter2}
                            </span>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <span style={{
                              fontSize: "0.8rem",
                              padding: "2px 8px",
                              borderRadius: "4px",
                              backgroundColor: pair.score === 3 ? "#059669" : pair.score === 2 ? "#D97706" : "#DC2626",
                              color: "white"
                            }}>
                              {pair.score === 3 ? "✓ Great" : pair.score === 2 ? "○ Good" : "✗ Hard"}
                            </span>
                            <p style={{ margin: "4px 0 0 0", fontSize: "0.75rem", color: "#6B7280" }}>{pair.note}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center", color: "#9CA3AF", padding: "40px 20px" }}>
                    <span style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}>🔍</span>
                    <p style={{ margin: 0 }}>Enter two words to analyze their compatibility</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Ambigram Types Guide */}
        {activeTab === "types" && (
          <div style={{ marginBottom: "40px" }}>
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#0891B2", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📚 Types of Ambigrams</h2>
              </div>
              
              <div style={{ padding: "24px" }}>
                <div style={{ display: "grid", gap: "16px" }}>
                  {ambigramTypes.map((type) => (
                    <div
                      key={type.id}
                      style={{
                        padding: "20px",
                        backgroundColor: "#F9FAFB",
                        borderRadius: "12px",
                        border: "1px solid #E5E7EB"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
                        <h3 style={{ margin: 0, color: "#111827", fontSize: "1.1rem" }}>{type.name}</h3>
                        <span style={{
                          fontSize: "0.75rem",
                          padding: "4px 10px",
                          borderRadius: "12px",
                          backgroundColor: type.difficulty === "Easy" ? "#ECFDF5" : type.difficulty === "Medium" ? "#FEF3C7" : "#FEE2E2",
                          color: type.difficulty === "Easy" ? "#059669" : type.difficulty === "Medium" ? "#D97706" : "#DC2626"
                        }}>
                          {type.difficulty}
                        </span>
                      </div>
                      <p style={{ color: "#4B5563", margin: "0 0 12px 0", lineHeight: "1.6", fontSize: "0.95rem" }}>
                        {type.description}
                      </p>
                      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "0.85rem" }}>
                        <div>
                          <strong style={{ color: "#6B7280" }}>Example:</strong>{" "}
                          <span style={{ color: "#374151" }}>{type.example}</span>
                        </div>
                        <div>
                          <strong style={{ color: "#6B7280" }}>Best for:</strong>{" "}
                          <span style={{ color: "#374151" }}>{type.bestFor}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            {/* How to Create */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>📝 How to Create a Two-Word Ambigram</h2>
              
              <div style={{ display: "grid", gap: "16px" }}>
                <div style={{ padding: "16px", backgroundColor: "#EFF6FF", borderRadius: "12px" }}>
                  <h4 style={{ color: "#1E40AF", margin: "0 0 8px 0" }}>Step 1: Choose Your Words</h4>
                  <p style={{ color: "#374151", margin: 0, fontSize: "0.9rem" }}>
                    Select two words of similar length. Words with 4-6 letters work best. Popular pairs include names (couples&apos; names), 
                    opposites (LOVE/HATE), or meaningful concepts (LIFE/DEATH, FAITH/HOPE).
                  </p>
                </div>
                
                <div style={{ padding: "16px", backgroundColor: "#F5F3FF", borderRadius: "12px" }}>
                  <h4 style={{ color: "#5B21B6", margin: "0 0 8px 0" }}>Step 2: Analyze Letter Pairs</h4>
                  <p style={{ color: "#374151", margin: 0, fontSize: "0.9rem" }}>
                    Write word 1 normally and word 2 upside down. Align them to see which letters need to share the same space. 
                    Use our Letter Match Analyzer to check compatibility. Look for natural pairs like M/W, N/Z, A/V.
                  </p>
                </div>
                
                <div style={{ padding: "16px", backgroundColor: "#ECFDF5", borderRadius: "12px" }}>
                  <h4 style={{ color: "#065F46", margin: "0 0 8px 0" }}>Step 3: Design the Letters</h4>
                  <p style={{ color: "#374151", margin: 0, fontSize: "0.9rem" }}>
                    Merge each letter pair into a single design that reads as both letters. Use cursive/script fonts for smoother 
                    transitions. Add flourishes to handle length differences or difficult letter pairs.
                  </p>
                </div>
                
                <div style={{ padding: "16px", backgroundColor: "#FEF3C7", borderRadius: "12px" }}>
                  <h4 style={{ color: "#92400E", margin: "0 0 8px 0" }}>Step 4: Refine and Test</h4>
                  <p style={{ color: "#374151", margin: 0, fontSize: "0.9rem" }}>
                    Rotate your design 180° to verify both words are readable. Adjust letter weights and spacing until both 
                    orientations are clear. For tattoos, have a professional calligrapher finalize the design.
                  </p>
                </div>
              </div>
            </div>

            {/* Popular Combinations */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>💡 Popular Ambigram Word Combinations</h2>
              
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F5F3FF" }}>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Word Pair</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Difficulty</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Common Use</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { pair: "LOVE / HATE", difficulty: "Medium", use: "Tattoos, art" },
                      { pair: "LIFE / DEATH", difficulty: "Hard", use: "Memorial tattoos" },
                      { pair: "FAITH / HOPE", difficulty: "Medium", use: "Religious tattoos" },
                      { pair: "ANGEL / DEVIL", difficulty: "Hard", use: "Duality themes" },
                      { pair: "DREAM / REALITY", difficulty: "Very Hard", use: "Philosophical art" },
                      { pair: "Names (Same length)", difficulty: "Varies", use: "Couples, weddings" },
                      { pair: "FAMILY / FOREVER", difficulty: "Hard", use: "Family tattoos" },
                      { pair: "TRUE / LOVE", difficulty: "Medium", use: "Romantic designs" }
                    ].map((row, idx) => (
                      <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                        <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "600" }}>{row.pair}</td>
                        <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>
                          <span style={{
                            fontSize: "0.8rem",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            backgroundColor: row.difficulty === "Medium" ? "#FEF3C7" : row.difficulty === "Hard" ? "#FEE2E2" : row.difficulty === "Varies" ? "#EFF6FF" : "#FEE2E2",
                            color: row.difficulty === "Medium" ? "#D97706" : row.difficulty === "Varies" ? "#2563EB" : "#DC2626"
                          }}>
                            {row.difficulty}
                          </span>
                        </td>
                        <td style={{ padding: "12px", border: "1px solid #E5E7EB" }}>{row.use}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Design Tips */}
            <div style={{ backgroundColor: "#EFF6FF", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #BFDBFE" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#1E40AF", marginBottom: "16px" }}>✏️ Design Tips</h3>
              <ul style={{ margin: 0, paddingLeft: "20px", color: "#374151", fontSize: "0.9rem", lineHeight: "1.8" }}>
                <li>Use <strong>script/cursive</strong> fonts for smoother letter merging</li>
                <li><strong>Same-length words</strong> are easiest to design</li>
                <li>Add <strong>flourishes</strong> to balance unequal lengths</li>
                <li>Test readability at <strong>small sizes</strong> (tattoo size)</li>
                <li><strong>Bold letters</strong> are easier to read when rotated</li>
                <li>Avoid letters with <strong>no rotational pair</strong> (Q, G are hard)</li>
              </ul>
            </div>

            {/* Tools & Resources */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "24px", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>🔗 Related Resources</h3>
              <div style={{ fontSize: "0.875rem", color: "#374151" }}>
                {[
                  { name: "FlipScript", desc: "Professional ambigram designs" },
                  { name: "Ambimatic App", desc: "Android ambigram maker" },
                  { name: "Custom Calligraphers", desc: "Fiverr, Etsy artists" },
                  { name: "Tattoo Artists", desc: "Many do custom ambigrams" }
                ].map((item, idx) => (
                  <div key={idx} style={{ padding: "8px 0", borderBottom: idx < 3 ? "1px solid #E5E7EB" : "none" }}>
                    <strong>{item.name}</strong>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/two-word-ambigram-generator" currentCategory="Lifestyle" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "24px" }}>Frequently Asked Questions</h2>
          <div>
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ padding: "16px", backgroundColor: "#F3F4F6", borderRadius: "8px" }}>
          <p style={{ fontSize: "0.75rem", color: "#6B7280", textAlign: "center", margin: 0 }}>
            🔄 <strong>Disclaimer:</strong> This tool provides concept previews and compatibility analysis to help you plan ambigram designs. 
            For tattoo-quality results, we recommend working with a professional calligrapher or ambigram artist who can create 
            properly merged letterforms. The preview shown is for planning purposes only.
          </p>
        </div>
      </div>
    </div>
  );
}