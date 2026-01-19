"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// ============================================
// Types
// ============================================

interface GravestoneStyle {
  id: string;
  name: string;
  emoji: string;
}

interface PresetTemplate {
  name: string;
  title: string;
  years: string;
  epitaph: string;
}

// ============================================
// Data
// ============================================

const gravestoneStyles: GravestoneStyle[] = [
  { id: 'classic', name: 'Classic', emoji: '🪦' },
  { id: 'rectangular', name: 'Rectangle', emoji: '⬛' },
  { id: 'cross', name: 'Cross', emoji: '✝️' },
  { id: 'gothic', name: 'Gothic', emoji: '🏛️' },
  { id: 'cartoon', name: 'Cartoon', emoji: '😄' },
  { id: 'halloween', name: 'Halloween', emoji: '🎃' },
];

const stoneColors = [
  { id: 'gray', name: 'Gray', color: '#6B7280', textColor: '#F9FAFB' },
  { id: 'dark', name: 'Dark', color: '#1F2937', textColor: '#F9FAFB' },
  { id: 'brown', name: 'Brown', color: '#78350F', textColor: '#FEF3C7' },
  { id: 'white', name: 'White', color: '#E5E7EB', textColor: '#1F2937' },
  { id: 'moss', name: 'Moss', color: '#4B5563', textColor: '#D1FAE5' },
];

const fontStyles = [
  { id: 'serif', name: 'Serif', font: 'Georgia, serif' },
  { id: 'gothic', name: 'Gothic', font: '"Times New Roman", serif' },
  { id: 'modern', name: 'Modern', font: 'Arial, sans-serif' },
];

const presetTemplates: PresetTemplate[] = [
  { name: '💀 My Diet', title: 'HERE LIES', years: 'My Diet', epitaph: '"I\'ll start Monday" - Never Started' },
  { name: '😴 Sleep Schedule', title: 'R.I.P.', years: 'My Sleep Schedule', epitaph: '2020 - 2025\nGone but not forgotten' },
  { name: '😤 My Patience', title: 'IN MEMORY OF', years: 'My Patience', epitaph: 'It was nice while it lasted' },
  { name: '💸 My Savings', title: 'HERE LIES', years: 'My Savings', epitaph: 'Killed by Online Shopping' },
  { name: '📱 My Free Time', title: 'R.I.P.', years: 'My Free Time', epitaph: 'Murdered by Social Media' },
  { name: '🎮 My Productivity', title: 'GONE TOO SOON', years: 'My Productivity', epitaph: 'Lost to Video Games' },
];

// FAQ data
const faqs = [
  {
    question: "Are gravestone generators free?",
    answer: "Yes! Our gravestone generator is completely free to use. You can create unlimited tombstone images, customize them with your own text, and download them as PNG files without any cost or registration required."
  },
  {
    question: "How do I make a gravestone meme?",
    answer: "Simply choose a gravestone style, enter your custom text (like 'Here Lies My Diet'), optionally add dates and an epitaph, customize the colors and font, then click 'Download PNG' to save your meme. You can also use our preset templates for popular meme formats."
  },
  {
    question: "Can I download my gravestone image?",
    answer: "Yes! Click the 'Download PNG' button to save your gravestone image to your device. The image is high-quality and perfect for sharing on social media, messaging apps, or using in other projects."
  },
  {
    question: "What are gravestone generators used for?",
    answer: "Gravestone generators are primarily used for creating humorous memes about things that have 'died' (like bad habits, free time, or patience). They're also popular for Halloween decorations, creative projects, game assets, and commemorating the end of TV shows, trends, or eras."
  },
  {
    question: "Can I use these images commercially?",
    answer: "The images you create are yours to use. However, if you use recognizable names, brands, or copyrighted content in your text, you should be aware of potential trademark or copyright issues. For personal memes and social media, you're generally fine."
  },
  {
    question: "What gravestone styles are available?",
    answer: "We offer 6 different styles: Classic (rounded top), Rectangle (simple block), Cross (with cross design), Gothic (pointed arch), Cartoon (fun/playful), and Halloween (spooky themed). Each style can be customized with different colors and fonts."
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

// Gravestone SVG Component
function GravestoneSVG({ 
  style, 
  stoneColor, 
  textColor, 
  font, 
  title, 
  years, 
  epitaph 
}: { 
  style: string;
  stoneColor: string;
  textColor: string;
  font: string;
  title: string;
  years: string;
  epitaph: string;
}) {
  // Render different gravestone shapes
  const renderStone = () => {
    switch (style) {
      case 'classic':
        return (
          <path d="M50 20 Q50 5 100 5 L200 5 Q250 5 250 20 L250 280 L50 280 Z" fill={stoneColor} stroke="#374151" strokeWidth="3"/>
        );
      case 'rectangular':
        return (
          <rect x="50" y="10" width="200" height="270" fill={stoneColor} stroke="#374151" strokeWidth="3"/>
        );
      case 'cross':
        return (
          <>
            <rect x="75" y="5" width="150" height="275" fill={stoneColor} stroke="#374151" strokeWidth="3"/>
            <rect x="40" y="25" width="220" height="40" fill={stoneColor} stroke="#374151" strokeWidth="3"/>
          </>
        );
      case 'gothic':
        return (
          <path d="M50 280 L50 80 Q50 20 150 5 Q250 20 250 80 L250 280 Z" fill={stoneColor} stroke="#374151" strokeWidth="3"/>
        );
      case 'cartoon':
        return (
          <>
            <path d="M60 280 L60 40 Q60 10 150 10 Q240 10 240 40 L240 280 Z" fill={stoneColor} stroke="#374151" strokeWidth="4"/>
            <ellipse cx="150" cy="45" rx="60" ry="20" fill={stoneColor} stroke="#374151" strokeWidth="2"/>
          </>
        );
      case 'halloween':
        return (
          <>
            <path d="M50 280 L50 60 Q50 20 100 10 L150 5 L200 10 Q250 20 250 60 L250 280 Z" fill={stoneColor} stroke="#374151" strokeWidth="3"/>
            {/* Skull decoration */}
            <circle cx="150" cy="55" r="20" fill={textColor} opacity="0.3"/>
            <circle cx="143" cy="52" r="5" fill={stoneColor}/>
            <circle cx="157" cy="52" r="5" fill={stoneColor}/>
            <path d="M145 62 L150 68 L155 62" stroke={stoneColor} strokeWidth="2" fill="none"/>
          </>
        );
      default:
        return (
          <path d="M50 20 Q50 5 100 5 L200 5 Q250 5 250 20 L250 280 L50 280 Z" fill={stoneColor} stroke="#374151" strokeWidth="3"/>
        );
    }
  };

  // Calculate text positions based on style
  const getTitleY = () => style === 'cross' ? 100 : 80;
  const getYearsY = () => style === 'cross' ? 135 : 130;
  const getEpitaphY = () => style === 'cross' ? 175 : 180;

  // Split epitaph into lines
  const epitaphLines = epitaph.split('\n').slice(0, 3);

  return (
    <svg viewBox="0 0 300 300" style={{ width: "100%", maxWidth: "300px", height: "auto" }}>
      {/* Ground */}
      <rect x="0" y="275" width="300" height="25" fill="#4B5563"/>
      <rect x="30" y="278" width="240" height="5" fill="#374151"/>
      
      {/* Grass tufts */}
      <path d="M40 275 Q45 265 50 275" stroke="#22C55E" strokeWidth="2" fill="none"/>
      <path d="M70 275 Q75 268 80 275" stroke="#22C55E" strokeWidth="2" fill="none"/>
      <path d="M220 275 Q225 265 230 275" stroke="#22C55E" strokeWidth="2" fill="none"/>
      <path d="M250 275 Q255 268 260 275" stroke="#22C55E" strokeWidth="2" fill="none"/>
      
      {/* Stone */}
      {renderStone()}
      
      {/* RIP or Title */}
      <text 
        x="150" 
        y={getTitleY()} 
        textAnchor="middle" 
        fill={textColor} 
        fontFamily={font} 
        fontSize={style === 'cross' ? "16" : (title.length > 15 ? "16" : "20")} 
        fontWeight="bold" 
      > 
        {title} 
      </text>
      
      {/* Years/Name */}
      <text 
        x="150" 
        y={getYearsY()} 
        textAnchor="middle" 
        fill={textColor} 
        fontFamily={font} 
        fontSize={style === 'cross' ? "13" : (years.length > 20 ? "14" : "18")} 
        fontWeight="bold" 
      > 
        {years} 
      </text>
      
      {/* Epitaph */}
      {epitaphLines.map((line, idx) => ( 
        <text 
          key={idx} 
          x="150" 
          y={getEpitaphY() + (idx * (style === 'cross' ? 18 : 22))} 
          textAnchor="middle" 
          fill={textColor} 
          fontFamily={font} 
          fontSize={style === 'cross' ? "10" : (line.length > 25 ? "11" : "13")} 
          fontStyle="italic" 
        > 
          {line} 
        </text> 
      ))}
    </svg>
  );
}

export default function GravestoneGenerator() {
  const [selectedStyle, setSelectedStyle] = useState('classic');
  const [selectedColor, setSelectedColor] = useState('gray');
  const [selectedFont, setSelectedFont] = useState('serif');
  const [title, setTitle] = useState('R.I.P.');
  const [years, setYears] = useState('My Free Time');
  const [epitaph, setEpitaph] = useState('2020 - 2025\nGone but not forgotten');
  const [isDownloading, setIsDownloading] = useState(false);
  
  const previewRef = useRef<HTMLDivElement>(null);

  // Get current color settings
  const currentColor = stoneColors.find(c => c.id === selectedColor) || stoneColors[0];
  const currentFont = fontStyles.find(f => f.id === selectedFont) || fontStyles[0];

  // Apply preset template
  const applyPreset = (preset: PresetTemplate) => {
    setTitle(preset.title);
    setYears(preset.years);
    setEpitaph(preset.epitaph);
  };

  // Download as PNG
  const downloadPNG = async () => {
    if (!previewRef.current) return;
    
    setIsDownloading(true);
    
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(previewRef.current, {
        backgroundColor: '#F3F4F6',
        scale: 3,
      });
      
      const link = document.createElement('a');
      link.download = 'gravestone.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Download failed:', error);
    }
    
    setIsDownloading(false);
  };

  // Reset to default
  const resetForm = () => {
    setSelectedStyle('classic');
    setSelectedColor('gray');
    setSelectedFont('serif');
    setTitle('R.I.P.');
    setYears('');
    setEpitaph('');
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F3F4F6" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Gravestone Generator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "2.5rem" }}>🪦</span>
            <h1 style={{ fontSize: "clamp(1.75rem, 5vw, 2.25rem)", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Gravestone Generator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Create funny tombstone memes for things that have &quot;died&quot; - your diet, sleep schedule, 
            patience, or anything else! Free online tool with instant PNG download.
          </p>
        </div>

        {/* Tip Box */}
        <div style={{
          backgroundColor: "#374151",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💀</span>
            <div>
              <p style={{ fontWeight: "600", color: "white", margin: "0 0 4px 0" }}>
                <strong>Meme Tip</strong>
              </p>
              <p style={{ color: "#D1D5DB", margin: 0, fontSize: "0.95rem" }}>
                Use this to &quot;bury&quot; bad habits, lost free time, or anything you want to humorously commemorate. 
                Perfect for social media and messaging!
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
            border: "1px solid #E5E7EB",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#374151", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                ⚙️ Customize Your Gravestone
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              {/* Gravestone Style */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                  🪦 Gravestone Style
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                  {gravestoneStyles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      style={{
                        padding: "12px 8px",
                        borderRadius: "8px",
                        border: selectedStyle === style.id ? "2px solid #374151" : "1px solid #E5E7EB",
                        backgroundColor: selectedStyle === style.id ? "#F3F4F6" : "white",
                        cursor: "pointer",
                        textAlign: "center"
                      }}
                    >
                      <div style={{ fontSize: "1.3rem", marginBottom: "4px" }}>{style.emoji}</div>
                      <div style={{ 
                        fontSize: "0.75rem", 
                        fontWeight: selectedStyle === style.id ? "600" : "400",
                        color: selectedStyle === style.id ? "#374151" : "#6B7280"
                      }}>
                        {style.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stone Color */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                  🎨 Stone Color
                </label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {stoneColors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color.id)}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "8px",
                        border: selectedColor === color.id ? "3px solid #111827" : "2px solid #E5E7EB",
                        backgroundColor: color.color,
                        cursor: "pointer",
                        position: "relative"
                      }}
                      title={color.name}
                    >
                      {selectedColor === color.id && (
                        <span style={{ color: color.textColor, fontSize: "1rem" }}>✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Style */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                  ✏️ Font Style
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {fontStyles.map((font) => (
                    <button
                      key={font.id}
                      onClick={() => setSelectedFont(font.id)}
                      style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "8px",
                        border: selectedFont === font.id ? "2px solid #374151" : "1px solid #E5E7EB",
                        backgroundColor: selectedFont === font.id ? "#F3F4F6" : "white",
                        cursor: "pointer",
                        fontFamily: font.font,
                        fontWeight: selectedFont === font.id ? "600" : "400",
                        color: selectedFont === font.id ? "#374151" : "#6B7280"
                      }}
                    >
                      {font.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title Input */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                  📝 Title / Header
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="R.I.P. / HERE LIES / IN MEMORY OF"
                  maxLength={20}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              {/* Years/Name Input */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                  💀 Name / Subject
                </label>
                <input
                  type="text"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  placeholder="My Diet / My Sleep / 1990 - 2025"
                  maxLength={30}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              {/* Epitaph Input */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                  ✍️ Epitaph (Press Enter for new line)
                </label>
                <textarea
                  value={epitaph}
                  onChange={(e) => setEpitaph(e.target.value)}
                  placeholder="Gone but not forgotten..."
                  rows={3}
                  maxLength={100}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                    resize: "none",
                    fontFamily: "inherit"
                  }}
                />
              </div>

              {/* Quick Presets */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                  ⚡ Quick Presets
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                  {presetTemplates.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => applyPreset(preset)}
                      style={{
                        padding: "10px 12px",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB",
                        backgroundColor: "#F9FAFB",
                        cursor: "pointer",
                        fontSize: "0.8rem",
                        textAlign: "left",
                        color: "#374151"
                      }}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={resetForm}
                  style={{
                    flex: 1,
                    padding: "14px",
                    backgroundColor: "#F3F4F6",
                    color: "#374151",
                    border: "1px solid #D1D5DB",
                    borderRadius: "10px",
                    fontSize: "1rem",
                    fontWeight: "500",
                    cursor: "pointer"
                  }}
                >
                  🔄 Reset
                </button>
              </div>
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
            <div style={{ backgroundColor: "#1F2937", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                🪦 Preview
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              {/* Preview Area */}
              <div 
                ref={previewRef}
                style={{
                  backgroundColor: "#F3F4F6",
                  borderRadius: "12px",
                  padding: "20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "20px",
                  minHeight: "320px"
                }}
              >
                <GravestoneSVG
                  style={selectedStyle}
                  stoneColor={currentColor.color}
                  textColor={currentColor.textColor}
                  font={currentFont.font}
                  title={title}
                  years={years}
                  epitaph={epitaph}
                />
              </div>

              {/* Download Button */}
              <button
                onClick={downloadPNG}
                disabled={isDownloading}
                style={{
                  width: "100%",
                  padding: "16px",
                  backgroundColor: isDownloading ? "#9CA3AF" : "#374151",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  cursor: isDownloading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                {isDownloading ? "⏳ Generating..." : "📥 Download PNG"}
              </button>

              <p style={{ textAlign: "center", fontSize: "0.8rem", color: "#6B7280", marginTop: "12px", marginBottom: 0 }}>
                High-quality image • Free to use • No watermark
              </p>
            </div>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
                💀 How to Use the Gravestone Generator
              </h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  The gravestone generator is perfect for creating humorous memes that commemorate the 
                  &quot;death&quot; of something - whether it&apos;s your diet, productivity, or patience. 
                  It&apos;s a fun way to express relatable struggles through humor.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Popular Uses</h3>
                <div style={{
                  backgroundColor: "#F3F4F6",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #E5E7EB"
                }}>
                  <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "2" }}>
                    <li><strong>Memes:</strong> &quot;RIP My Sleep Schedule&quot;, &quot;Here Lies My Diet&quot;</li>
                    <li><strong>Social Media:</strong> Relatable content for Instagram, Twitter, TikTok</li>
                    <li><strong>Halloween:</strong> Spooky decorations and party invites</li>
                    <li><strong>Farewell Posts:</strong> When apps, shows, or trends end</li>
                    <li><strong>Gaming:</strong> Character deaths, game over screens</li>
                  </ul>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Tips for Great Gravestone Memes</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", margin: "16px 0" }}>
                  <div style={{ padding: "16px", backgroundColor: "#F3F4F6", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
                    <strong>🎯 Be Relatable</strong>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#6B7280" }}>
                      Universal struggles = more shares
                    </p>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#F3F4F6", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
                    <strong>😂 Keep It Light</strong>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#6B7280" }}>
                      Humorous epitaphs work best
                    </p>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#F3F4F6", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
                    <strong>📱 Be Timely</strong>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#6B7280" }}>
                      Reference current events/trends
                    </p>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#F3F4F6", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
                    <strong>✨ Match the Style</strong>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#6B7280" }}>
                      Use Halloween style for spooky memes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Popular Ideas */}
            <div style={{ backgroundColor: "#374151", borderRadius: "16px", padding: "24px", marginBottom: "24px", color: "white" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "16px" }}>💡 Meme Ideas</h3>
              <div style={{ fontSize: "0.85rem", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>• RIP My Motivation</p>
                <p style={{ margin: "0 0 8px 0" }}>• Here Lies My Wallet</p>
                <p style={{ margin: "0 0 8px 0" }}>• In Memory of Monday</p>
                <p style={{ margin: "0 0 8px 0" }}>• RIP My New Year Goals</p>
                <p style={{ margin: 0 }}>• Gone: My Social Life</p>
              </div>
            </div>

            {/* When to Use */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "16px" }}>📅 Best Times</h3>
              <div style={{ fontSize: "0.85rem", color: "#B45309", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>• Monday mornings</p>
                <p style={{ margin: "0 0 8px 0" }}>• After failed resolutions</p>
                <p style={{ margin: "0 0 8px 0" }}>• End of vacation</p>
                <p style={{ margin: "0 0 8px 0" }}>• Halloween season</p>
                <p style={{ margin: 0 }}>• When shows get cancelled</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/gravestone-generator" currentCategory="Entertainment" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px", marginBottom: "24px" }}>
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
        <div style={{ padding: "16px", backgroundColor: "#F3F4F6", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
          <p style={{ fontSize: "0.75rem", color: "#6B7280", textAlign: "center", margin: 0 }}>
            🪦 <strong>Disclaimer:</strong> This tool is for entertainment and humor purposes only. 
            Please use responsibly and avoid content that could be offensive or hurtful to others.
          </p>
        </div>
      </div>
    </div>
  );
}
