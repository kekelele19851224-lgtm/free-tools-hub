"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// ============================================
// Bubble Styles Configuration
// ============================================

interface BubbleStyle {
  name: string;
  emoji: string;
  description: string;
  borderRadius: string;
  border: string;
  background: string;
  tailStyle: "normal" | "cloud" | "burst" | "dotted" | "pixel";
}

const bubbleStyles: { [key: string]: BubbleStyle } = {
  speech: {
    name: "Speech",
    emoji: "💬",
    description: "Classic dialogue bubble",
    borderRadius: "20px",
    border: "3px solid #000",
    background: "#FFFFFF",
    tailStyle: "normal"
  },
  thought: {
    name: "Thought",
    emoji: "💭",
    description: "Cloud-like thinking bubble",
    borderRadius: "50%",
    border: "3px solid #000",
    background: "#FFFFFF",
    tailStyle: "cloud"
  },
  shout: {
    name: "Shout",
    emoji: "💥",
    description: "Explosive exclamation",
    borderRadius: "0",
    border: "3px solid #000",
    background: "#FFE66D",
    tailStyle: "burst"
  },
  whisper: {
    name: "Whisper",
    emoji: "🤫",
    description: "Soft dotted bubble",
    borderRadius: "20px",
    border: "3px dashed #666",
    background: "#F5F5F5",
    tailStyle: "dotted"
  },
  pixel: {
    name: "Pixel",
    emoji: "👾",
    description: "Retro game style",
    borderRadius: "0",
    border: "4px solid #000",
    background: "#FFFFFF",
    tailStyle: "pixel"
  },
  comic: {
    name: "Comic",
    emoji: "📚",
    description: "Western comic style",
    borderRadius: "30px 30px 30px 5px",
    border: "4px solid #000",
    background: "#FFFFFF",
    tailStyle: "normal"
  },
  manga: {
    name: "Manga",
    emoji: "🎌",
    description: "Japanese manga style",
    borderRadius: "10px",
    border: "2px solid #000",
    background: "#FFFFFF",
    tailStyle: "normal"
  },
  cloud: {
    name: "Cloud",
    emoji: "☁️",
    description: "Dreamy cloud shape",
    borderRadius: "50%",
    border: "3px solid #87CEEB",
    background: "#E8F4FD",
    tailStyle: "cloud"
  }
};

// Color themes
const colorThemes: { [key: string]: { bg: string; border: string; text: string; name: string } } = {
  white: { bg: "#FFFFFF", border: "#000000", text: "#000000", name: "Classic White" },
  yellow: { bg: "#FFF9C4", border: "#F9A825", text: "#5D4037", name: "Sunny Yellow" },
  blue: { bg: "#E3F2FD", border: "#1976D2", text: "#0D47A1", name: "Cool Blue" },
  pink: { bg: "#FCE4EC", border: "#E91E63", text: "#880E4F", name: "Sweet Pink" },
  green: { bg: "#E8F5E9", border: "#4CAF50", text: "#1B5E20", name: "Fresh Green" },
  purple: { bg: "#F3E5F5", border: "#9C27B0", text: "#4A148C", name: "Magic Purple" },
  orange: { bg: "#FFF3E0", border: "#FF9800", text: "#E65100", name: "Warm Orange" },
  red: { bg: "#FFEBEE", border: "#F44336", text: "#B71C1C", name: "Bold Red" }
};

// Tail positions
const tailPositions = [
  { value: "bottom-left", label: "Bottom Left", emoji: "↙️" },
  { value: "bottom-center", label: "Bottom Center", emoji: "⬇️" },
  { value: "bottom-right", label: "Bottom Right", emoji: "↘️" },
  { value: "left", label: "Left", emoji: "⬅️" },
  { value: "right", label: "Right", emoji: "➡️" }
];

// FAQ data
const faqs = [
  {
    question: "How do I create a speech bubble?",
    answer: "Simply enter your text in the text box, choose a bubble style (speech, thought, shout, etc.), select a color theme, and click 'Generate Bubble'. Your custom speech bubble will be created instantly and you can download it as a PNG image."
  },
  {
    question: "What are the different types of speech bubbles?",
    answer: "We offer 8 different bubble styles: Speech (classic dialogue), Thought (cloud-like for inner thoughts), Shout (explosive for exclamations), Whisper (dotted for soft speech), Pixel (retro game style), Comic (Western comic style), Manga (Japanese style), and Cloud (dreamy style)."
  },
  {
    question: "Can I use these bubbles for memes?",
    answer: "Absolutely! Our speech bubble generator is perfect for creating memes. You can download the bubble as a transparent PNG and overlay it on any image using your favorite image editor. The bubbles work great for social media posts, Discord, and meme creation."
  },
  {
    question: "How do I download my speech bubble?",
    answer: "After generating your bubble, click the 'Download PNG' button below the preview. The bubble will be saved as a high-quality PNG image with a transparent background (for most styles), ready to use in your projects."
  },
  {
    question: "What's the difference between speech and thought bubbles?",
    answer: "Speech bubbles have a pointed tail indicating someone is speaking out loud. Thought bubbles have a cloud-like shape with small circles as the tail, indicating inner thoughts or dreams. Use speech bubbles for dialogue and thought bubbles for internal monologue."
  },
  {
    question: "Can I customize the bubble colors?",
    answer: "Yes! We offer 8 color themes: Classic White, Sunny Yellow, Cool Blue, Sweet Pink, Fresh Green, Magic Purple, Warm Orange, and Bold Red. Each theme changes the background color, border color, and text color to create a cohesive look."
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

export default function CartoonBubbleGenerator() {
  const [text, setText] = useState("Hello! This is my speech bubble!");
  const [bubbleStyle, setBubbleStyle] = useState("speech");
  const [colorTheme, setColorTheme] = useState("white");
  const [tailPosition, setTailPosition] = useState("bottom-left");
  const [fontSize, setFontSize] = useState("medium");
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const bubbleRef = useRef<HTMLDivElement>(null);

  // Generate bubble
  const generateBubble = () => {
    if (!text.trim()) return;
    setGenerated(true);
  };

  // Download as PNG
  const downloadPNG = async () => {
    if (!bubbleRef.current) return;
    
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(bubbleRef.current, {
        backgroundColor: null,
        scale: 2
      });
      
      const link = document.createElement('a');
      link.download = 'speech-bubble.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating PNG:', error);
      alert('PNG download requires html2canvas library. Please copy the text instead.');
    }
  };

  // Copy text
  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Get current style and color
  const currentStyle = bubbleStyles[bubbleStyle];
  const currentColor = colorThemes[colorTheme];

  // Get font size
  const getFontSize = () => {
    switch (fontSize) {
      case "small": return "14px";
      case "medium": return "18px";
      case "large": return "24px";
      case "xlarge": return "32px";
      default: return "18px";
    }
  };

  // Render tail based on style and position
  const renderTail = () => {
    const tailColor = currentColor.bg;
    const borderColor = currentColor.border;
    
    if (currentStyle.tailStyle === "cloud") {
      // Cloud/thought bubble tail (small circles)
      return (
        <div style={{
          position: "absolute",
          bottom: "-30px",
          left: tailPosition.includes("left") ? "30px" : tailPosition.includes("right") ? "auto" : "50%",
          right: tailPosition.includes("right") ? "30px" : "auto",
          transform: tailPosition === "bottom-center" ? "translateX(-50%)" : "none",
          display: "flex",
          flexDirection: "column",
          alignItems: tailPosition.includes("left") ? "flex-start" : tailPosition.includes("right") ? "flex-end" : "center",
          gap: "2px"
        }}>
          <div style={{
            width: "15px",
            height: "15px",
            borderRadius: "50%",
            backgroundColor: tailColor,
            border: `2px solid ${borderColor}`
          }} />
          <div style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: tailColor,
            border: `2px solid ${borderColor}`
          }} />
          <div style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: tailColor,
            border: `2px solid ${borderColor}`
          }} />
        </div>
      );
    }

    if (currentStyle.tailStyle === "pixel") {
      // Pixel style tail
      return (
        <div style={{
          position: "absolute",
          bottom: "-20px",
          left: tailPosition.includes("left") ? "20px" : tailPosition.includes("right") ? "auto" : "50%",
          right: tailPosition.includes("right") ? "20px" : "auto",
          transform: tailPosition === "bottom-center" ? "translateX(-50%)" : "none"
        }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ width: "20px", height: "8px", backgroundColor: tailColor, borderLeft: `4px solid ${borderColor}`, borderRight: `4px solid ${borderColor}` }} />
            <div style={{ width: "12px", height: "8px", backgroundColor: tailColor, borderLeft: `4px solid ${borderColor}`, borderRight: `4px solid ${borderColor}`, marginLeft: tailPosition.includes("right") ? "auto" : "0" }} />
            <div style={{ width: "4px", height: "8px", backgroundColor: borderColor, marginLeft: tailPosition.includes("right") ? "auto" : "0" }} />
          </div>
        </div>
      );
    }

    // Normal triangle tail
    const isLeft = tailPosition.includes("left");
    const isRight = tailPosition.includes("right");
    const isHorizontal = tailPosition === "left" || tailPosition === "right";

    if (isHorizontal) {
      return (
        <div style={{
          position: "absolute",
          top: "50%",
          left: tailPosition === "left" ? "-20px" : "auto",
          right: tailPosition === "right" ? "-20px" : "auto",
          transform: "translateY(-50%)",
          width: 0,
          height: 0,
          borderTop: "15px solid transparent",
          borderBottom: "15px solid transparent",
          borderRight: tailPosition === "left" ? `20px solid ${tailColor}` : "none",
          borderLeft: tailPosition === "right" ? `20px solid ${tailColor}` : "none",
          filter: `drop-shadow(${tailPosition === "left" ? "-2px" : "2px"} 0 0 ${borderColor})`
        }} />
      );
    }

    return (
      <div style={{
        position: "absolute",
        bottom: "-20px",
        left: isLeft ? "30px" : isRight ? "auto" : "50%",
        right: isRight ? "30px" : "auto",
        transform: !isLeft && !isRight ? "translateX(-50%)" : "none",
        width: 0,
        height: 0,
        borderLeft: "15px solid transparent",
        borderRight: "15px solid transparent",
        borderTop: `25px solid ${tailColor}`,
        filter: `drop-shadow(0 3px 0 ${borderColor})`
      }} />
    );
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F5F3FF" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #DDD6FE" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Cartoon Bubble Generator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "2.5rem" }}>💬</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Cartoon Speech Bubble Generator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Create custom speech bubbles, thought bubbles, and comic bubbles for free. 
            Perfect for memes, comics, social media, and Discord.
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
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "white", margin: "0 0 4px 0" }}>
                <strong>Create Your Perfect Bubble</strong>
              </p>
              <p style={{ color: "#DDD6FE", margin: 0, fontSize: "0.95rem" }}>
                Enter your text, choose a style and color, then download your custom speech bubble as a PNG image!
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
            border: "1px solid #DDD6FE",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#7C3AED", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                ⚙️ Customize Your Bubble
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              {/* Text Input */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                  💬 Enter Your Text
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type your message here..."
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none",
                    boxSizing: "border-box",
                    resize: "vertical",
                    fontFamily: "inherit"
                  }}
                />
              </div>

              {/* Bubble Style */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                  🎨 Bubble Style
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                  {Object.entries(bubbleStyles).map(([key, style]) => (
                    <button
                      key={key}
                      onClick={() => setBubbleStyle(key)}
                      style={{
                        padding: "10px 6px",
                        borderRadius: "8px",
                        border: bubbleStyle === key ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                        backgroundColor: bubbleStyle === key ? "#F5F3FF" : "white",
                        cursor: "pointer",
                        textAlign: "center"
                      }}
                    >
                      <div style={{ fontSize: "1.2rem", marginBottom: "4px" }}>{style.emoji}</div>
                      <div style={{ 
                        fontSize: "0.7rem", 
                        fontWeight: bubbleStyle === key ? "600" : "400",
                        color: bubbleStyle === key ? "#7C3AED" : "#4B5563"
                      }}>
                        {style.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Theme */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                  🖌️ Color Theme
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                  {Object.entries(colorThemes).map(([key, color]) => (
                    <button
                      key={key}
                      onClick={() => setColorTheme(key)}
                      style={{
                        padding: "8px",
                        borderRadius: "8px",
                        border: colorTheme === key ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                        backgroundColor: color.bg,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px"
                      }}
                    >
                      <div style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        backgroundColor: color.border,
                        border: "2px solid white"
                      }} />
                      <span style={{ fontSize: "0.7rem", color: color.text, fontWeight: colorTheme === key ? "600" : "400" }}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tail Position */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                  📍 Tail Position
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {tailPositions.map((pos) => (
                    <button
                      key={pos.value}
                      onClick={() => setTailPosition(pos.value)}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: tailPosition === pos.value ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                        backgroundColor: tailPosition === pos.value ? "#F5F3FF" : "white",
                        cursor: "pointer",
                        fontSize: "0.8rem",
                        fontWeight: tailPosition === pos.value ? "600" : "400",
                        color: tailPosition === pos.value ? "#7C3AED" : "#4B5563",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      <span>{pos.emoji}</span>
                      <span>{pos.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                  📏 Text Size
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[
                    { value: "small", label: "Small" },
                    { value: "medium", label: "Medium" },
                    { value: "large", label: "Large" },
                    { value: "xlarge", label: "X-Large" }
                  ].map((size) => (
                    <button
                      key={size.value}
                      onClick={() => setFontSize(size.value)}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        border: fontSize === size.value ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                        backgroundColor: fontSize === size.value ? "#F5F3FF" : "white",
                        cursor: "pointer",
                        flex: 1,
                        fontSize: "0.85rem",
                        fontWeight: fontSize === size.value ? "600" : "400",
                        color: fontSize === size.value ? "#7C3AED" : "#4B5563"
                      }}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateBubble}
                disabled={!text.trim()}
                style={{
                  width: "100%",
                  padding: "16px",
                  backgroundColor: !text.trim() ? "#E5E7EB" : "#7C3AED",
                  color: !text.trim() ? "#9CA3AF" : "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  cursor: !text.trim() ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                ✨ Generate Bubble
              </button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="calc-results" style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #DDD6FE",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#6D28D9", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                👁️ Preview
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              {/* Preview Area */}
              <div style={{
                backgroundColor: "#F3F4F6",
                borderRadius: "12px",
                padding: "40px",
                minHeight: "250px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px"
              }}>
                {!generated ? (
                  <div style={{ textAlign: "center", color: "#6B7280" }}>
                    <p style={{ fontSize: "3rem", margin: "0 0 12px 0" }}>💬</p>
                    <p style={{ margin: 0 }}>Enter text and click Generate</p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem" }}>Your bubble will appear here</p>
                  </div>
                ) : (
                  <div 
                    ref={bubbleRef}
                    style={{ position: "relative", padding: "20px" }}
                  >
                    {/* Bubble */}
                    <div style={{
                      padding: "20px 30px",
                      backgroundColor: currentColor.bg,
                      border: `${currentStyle.border.split(' ')[0]} ${currentStyle.border.split(' ')[1]} ${currentColor.border}`,
                      borderRadius: bubbleStyle === "shout" ? "0" : currentStyle.borderRadius,
                      maxWidth: "300px",
                      minWidth: "120px",
                      position: "relative",
                      boxShadow: bubbleStyle === "shout" ? "none" : "2px 2px 0 rgba(0,0,0,0.1)",
                      clipPath: bubbleStyle === "shout" 
                        ? "polygon(0% 15%, 15% 15%, 15% 0%, 30% 15%, 50% 0%, 50% 15%, 70% 0%, 70% 15%, 85% 0%, 85% 15%, 100% 15%, 100% 30%, 100% 50%, 100% 70%, 100% 85%, 85% 85%, 85% 100%, 70% 85%, 50% 100%, 50% 85%, 30% 100%, 30% 85%, 15% 100%, 15% 85%, 0% 85%, 0% 70%, 0% 50%, 0% 30%)"
                        : "none"
                    }}>
                      <p style={{
                        margin: 0,
                        fontSize: getFontSize(),
                        fontWeight: bubbleStyle === "shout" ? "700" : "500",
                        color: currentColor.text,
                        textAlign: "center",
                        fontFamily: bubbleStyle === "pixel" ? "monospace" : 
                                   bubbleStyle === "comic" ? "'Comic Sans MS', cursive" : 
                                   "inherit",
                        lineHeight: "1.4",
                        wordBreak: "break-word"
                      }}>
                        {text}
                      </p>
                    </div>
                    
                    {/* Tail */}
                    {bubbleStyle !== "shout" && renderTail()}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {generated && (
                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={downloadPNG}
                    style={{
                      flex: 1,
                      padding: "12px",
                      backgroundColor: "#7C3AED",
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
                    📥 Download PNG
                  </button>
                  <button
                    onClick={copyText}
                    style={{
                      flex: 1,
                      padding: "12px",
                      backgroundColor: copied ? "#10B981" : "#6D28D9",
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

        {/* Bubble Styles Reference */}
        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "16px", 
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)", 
          border: "1px solid #DDD6FE", 
          padding: "32px",
          marginBottom: "32px"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
            🎨 Speech Bubble Styles Guide
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            {Object.entries(bubbleStyles).map(([key, style]) => (
              <div 
                key={key}
                style={{
                  padding: "16px",
                  backgroundColor: "#F9FAFB",
                  borderRadius: "12px",
                  textAlign: "center",
                  border: "1px solid #E5E7EB"
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "8px" }}>{style.emoji}</div>
                <h4 style={{ margin: "0 0 4px 0", color: "#111827", fontWeight: "600" }}>{style.name}</h4>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#6B7280" }}>{style.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #DDD6FE", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
                💬 How to Use Speech Bubbles
              </h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  Speech bubbles are essential elements in comics, memes, and visual storytelling. They help convey 
                  dialogue, thoughts, and emotions in a visual format that&apos;s instantly recognizable and engaging.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Common Uses for Speech Bubbles</h3>
                <div style={{
                  backgroundColor: "#F5F3FF",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #DDD6FE"
                }}>
                  <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "2" }}>
                    <li><strong>Memes:</strong> Add funny captions to images for social media</li>
                    <li><strong>Comics:</strong> Create dialogue for your comic strip characters</li>
                    <li><strong>Social Media:</strong> Make engaging posts for Instagram, Twitter, Discord</li>
                    <li><strong>Presentations:</strong> Add visual interest to slides and documents</li>
                    <li><strong>Marketing:</strong> Create eye-catching promotional materials</li>
                  </ul>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Choosing the Right Bubble Style</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", margin: "16px 0" }}>
                  <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
                    <strong>💬 Speech Bubble</strong>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#57534E" }}>
                      For normal dialogue and conversation
                    </p>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
                    <strong>💭 Thought Bubble</strong>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#57534E" }}>
                      For inner thoughts and dreams
                    </p>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
                    <strong>💥 Shout Bubble</strong>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#57534E" }}>
                      For yelling, excitement, or emphasis
                    </p>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
                    <strong>🤫 Whisper Bubble</strong>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#57534E" }}>
                      For soft speech or secrets
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Tips */}
            <div style={{ backgroundColor: "#7C3AED", borderRadius: "16px", padding: "24px", marginBottom: "24px", color: "white" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "16px" }}>💡 Pro Tips</h3>
              <div style={{ fontSize: "0.85rem", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>• Keep text short and punchy</p>
                <p style={{ margin: "0 0 8px 0" }}>• Match bubble style to emotion</p>
                <p style={{ margin: "0 0 8px 0" }}>• Use colors that contrast well</p>
                <p style={{ margin: "0 0 8px 0" }}>• Position tail toward speaker</p>
                <p style={{ margin: 0 }}>• Larger text = more impact</p>
              </div>
            </div>

            {/* Use Cases */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "16px" }}>🎯 Popular Uses</h3>
              <div style={{ fontSize: "0.85rem", color: "#B45309", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>• Discord server graphics</p>
                <p style={{ margin: "0 0 8px 0" }}>• Social media memes</p>
                <p style={{ margin: "0 0 8px 0" }}>• Comic strip creation</p>
                <p style={{ margin: "0 0 8px 0" }}>• Marketing materials</p>
                <p style={{ margin: 0 }}>• Educational content</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/cartoon-bubble-generator" currentCategory="Entertainment" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #DDD6FE", padding: "32px", marginBottom: "24px" }}>
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
        <div style={{ padding: "16px", backgroundColor: "#F5F3FF", borderRadius: "8px", border: "1px solid #DDD6FE" }}>
          <p style={{ fontSize: "0.75rem", color: "#6D28D9", textAlign: "center", margin: 0 }}>
            💬 <strong>Note:</strong> Speech bubbles generated are free to use for personal and commercial purposes. 
            For PNG download, the html2canvas library is required.
          </p>
        </div>
      </div>
    </div>
  );
}