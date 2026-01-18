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
  tailStyle: "normal" | "cloud" | "burst" | "dotted" | "pixel" | "manga";
}

const bubbleStyles: { [key: string]: BubbleStyle } = {
  speech: {
    name: "Speech",
    emoji: "💬",
    description: "Classic dialogue bubble",
    tailStyle: "normal"
  },
  thought: {
    name: "Thought",
    emoji: "💭",
    description: "Cloud-like thinking bubble",
    tailStyle: "cloud"
  },
  shout: {
    name: "Shout",
    emoji: "💥",
    description: "Explosive exclamation",
    tailStyle: "burst"
  },
  whisper: {
    name: "Whisper",
    emoji: "🤫",
    description: "Soft dotted bubble",
    tailStyle: "dotted"
  },
  pixel: {
    name: "Pixel",
    emoji: "👾",
    description: "Retro game style",
    tailStyle: "pixel"
  },
  comic: {
    name: "Comic",
    emoji: "📚",
    description: "Western comic style",
    tailStyle: "normal"
  },
  manga: {
    name: "Manga",
    emoji: "🎌",
    description: "Japanese manga style",
    tailStyle: "manga"
  },
  cloud: {
    name: "Cloud",
    emoji: "☁️",
    description: "Dreamy cloud shape",
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

  // Get tail position values
  const getTailPositionStyle = () => {
    const isLeft = tailPosition.includes("left");
    const isRight = tailPosition.includes("right");
    const isHorizontal = tailPosition === "left" || tailPosition === "right";
    
    return { isLeft, isRight, isHorizontal };
  };

  // Render the bubble based on style
  const renderBubble = () => {
    const { isLeft, isRight, isHorizontal } = getTailPositionStyle();

    // Thought bubble - classic comic thought with bumpy edges
    if (bubbleStyle === "thought") {
      return (
        <div style={{ position: "relative", padding: "20px" }}>
          <svg width="280" height="170" viewBox="0 0 280 170" style={{ overflow: "visible" }}>
            {/* Bumpy cloud shape for thought */}
            <path 
              d={`
                M 70,70 
                Q 30,70 35,45 
                Q 40,20 80,25 
                Q 100,5 140,15 
                Q 180,5 200,25 
                Q 240,20 245,45 
                Q 250,70 210,70 
                Q 250,85 240,105 
                Q 230,125 190,115 
                Q 175,135 140,125 
                Q 105,135 90,115 
                Q 50,125 40,105 
                Q 30,85 70,70 
                Z 
              `}
              fill={currentColor.bg} 
              stroke={currentColor.border} 
              strokeWidth="3" 
            />
            {/* Thought bubble tail - small circles */}
            <circle cx={isRight ? 210 : isLeft ? 70 : 140} cy="135" r="10" fill={currentColor.bg} stroke={currentColor.border} strokeWidth="2" />
            <circle cx={isRight ? 225 : isLeft ? 55 : 140} cy="150" r="7" fill={currentColor.bg} stroke={currentColor.border} strokeWidth="2" />
            <circle cx={isRight ? 238 : isLeft ? 42 : 140} cy="162" r="4" fill={currentColor.bg} stroke={currentColor.border} strokeWidth="2" />
            {/* Text */}
            <foreignObject x="55" y="30" width="170" height="85">
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                height: "100%", 
                textAlign: "center", 
                fontSize: getFontSize(), 
                fontWeight: "500", 
                color: currentColor.text, 
                padding: "10px", 
                lineHeight: "1.3", 
                wordBreak: "break-word" 
              }}>
                {text} 
              </div> 
            </foreignObject> 
          </svg> 
        </div> 
      ); 
    }

    // Cloud bubble - soft fluffy cloud shape 
    if (bubbleStyle === "cloud") { 
      return ( 
        <div style={{ position: "relative", padding: "20px" }}> 
          <svg width="280" height="160" viewBox="0 0 280 160" style={{ overflow: "visible" }}> 
            {/* Soft cloud using circles */} 
            <ellipse cx="140" cy="60" rx="90" ry="45" fill={currentColor.bg} stroke={currentColor.border} strokeWidth="3" /> 
            <circle cx="70" cy="55" r="35" fill={currentColor.bg} stroke={currentColor.border} strokeWidth="3" /> 
            <circle cx="210" cy="55" r="35" fill={currentColor.bg} stroke={currentColor.border} strokeWidth="3" /> 
            <circle cx="100" cy="35" r="30" fill={currentColor.bg} stroke={currentColor.border} strokeWidth="3" /> 
            <circle cx="180" cy="35" r="30" fill={currentColor.bg} stroke={currentColor.border} strokeWidth="3" /> 
            <circle cx="140" cy="30" r="25" fill={currentColor.bg} stroke={currentColor.border} strokeWidth="3" /> 
            {/* Cover inner strokes */} 
            <ellipse cx="140" cy="55" rx="85" ry="40" fill={currentColor.bg} /> 
            <circle cx="70" cy="55" r="30" fill={currentColor.bg} /> 
            <circle cx="210" cy="55" r="30" fill={currentColor.bg} /> 
            <circle cx="100" cy="38" r="25" fill={currentColor.bg} /> 
            <circle cx="180" cy="38" r="25" fill={currentColor.bg} /> 
            <circle cx="140" cy="33" r="20" fill={currentColor.bg} /> 
            {/* Wavy tail for cloud - different from thought */} 
            <path 
              d={ 
                isRight 
                  ? "M 200,95 Q 220,105 215,120 Q 210,135 230,145" 
                  : isLeft 
                  ? "M 80,95 Q 60,105 65,120 Q 70,135 50,145" 
                  : "M 140,95 Q 145,110 140,125 Q 135,140 140,155" 
              } 
              fill="none" 
              stroke={currentColor.border} 
              strokeWidth="3" 
              strokeLinecap="round" 
            /> 
            {/* Text */} 
            <foreignObject x="50" y="25" width="180" height="70"> 
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                height: "100%", 
                textAlign: "center", 
                fontSize: getFontSize(), 
                fontWeight: "400", 
                fontStyle: "italic", 
                color: currentColor.text, 
                padding: "10px", 
                lineHeight: "1.3", 
                wordBreak: "break-word" 
              }}> 
                {text} 
              </div> 
            </foreignObject> 
          </svg> 
        </div> 
      ); 
    }

    // Shout bubble - spiky
    if (bubbleStyle === "shout") {
      return (
        <div style={{ position: "relative", padding: "20px" }}>
          <svg width="280" height="150" viewBox="0 0 280 150" style={{ overflow: "visible" }}>
            {/* Spiky burst shape */}
            <polygon
              points="140,5 160,30 190,10 180,40 220,25 195,55 240,50 200,75 240,100 195,95 220,125 180,110 190,140 160,120 140,145 120,120 90,140 100,110 60,125 85,95 40,100 80,75 40,50 85,55 60,25 100,40 90,10 120,30"
              fill={currentColor.bg}
              stroke={currentColor.border}
              strokeWidth="3"
              strokeLinejoin="round"
            />
            {/* Text */}
            <foreignObject x="60" y="40" width="160" height="70">
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                textAlign: "center",
                fontSize: getFontSize(),
                fontWeight: "800",
                color: currentColor.text,
                padding: "5px",
                lineHeight: "1.2",
                wordBreak: "break-word"
              }}>
                {text}
              </div>
            </foreignObject>
          </svg>
        </div>
      );
    }

    // Pixel bubble
    if (bubbleStyle === "pixel") {
      return (
        <div style={{ position: "relative", padding: "20px" }}>
          <svg width="280" height="140" viewBox="0 0 280 140" style={{ overflow: "visible", imageRendering: "pixelated" }}>
            {/* Pixel rectangle with stepped corners */}
            <path
              d={`
                M 20,10 
                L 260,10 
                L 260,90 
                L ${isRight ? 240 : isLeft ? 80 : 160},90
                L ${isRight ? 240 : isLeft ? 80 : 160},110
                L ${isRight ? 220 : isLeft ? 60 : 140},110
                L ${isRight ? 220 : isLeft ? 60 : 140},130
                L ${isRight ? 200 : isLeft ? 40 : 120},130
                L ${isRight ? 200 : isLeft ? 40 : 120},110
                L ${isRight ? 180 : isLeft ? 20 : 100},110
                L ${isRight ? 180 : isLeft ? 20 : 100},90
                L 20,90 
                Z
              `}
              fill={currentColor.bg}
              stroke={currentColor.border}
              strokeWidth="4"
            />
            {/* Text */}
            <foreignObject x="30" y="20" width="220" height="65">
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                textAlign: "center",
                fontSize: getFontSize(),
                fontWeight: "500",
                color: currentColor.text,
                fontFamily: "'Courier New', monospace",
                padding: "5px",
                lineHeight: "1.3",
                wordBreak: "break-word"
              }}>
                {text}
              </div>
            </foreignObject>
          </svg>
        </div>
      );
    }

    // Comic bubble - bold rounded with thick border
    if (bubbleStyle === "comic") {
      return (
        <div style={{ position: "relative", padding: "20px" }}>
          <svg width="280" height="150" viewBox="0 0 280 150" style={{ overflow: "visible" }}>
            {/* Main comic bubble - more rounded */}
            <ellipse cx="140" cy="60" rx="120" ry="55" fill={currentColor.bg} stroke={currentColor.border} strokeWidth="5" />
            {/* Tail */}
            <polygon
              points={
                isRight ? "200,95 230,130 180,100" :
                isLeft ? "80,95 50,130 100,100" :
                "130,95 140,130 150,95"
              }
              fill={currentColor.bg}
              stroke={currentColor.border}
              strokeWidth="5"
              strokeLinejoin="round"
            />
            {/* Cover the line inside */}
            <ellipse cx="140" cy="60" rx="115" ry="50" fill={currentColor.bg} />
            {/* Text */}
            <foreignObject x="40" y="20" width="200" height="80">
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                textAlign: "center",
                fontSize: getFontSize(),
                fontWeight: "700",
                color: currentColor.text,
                fontFamily: "'Comic Sans MS', 'Chalkboard', cursive",
                padding: "10px",
                lineHeight: "1.3",
                wordBreak: "break-word"
              }}>
                {text}
              </div>
            </foreignObject>
          </svg>
        </div>
      );
    }

    // Manga bubble - sharp pointed tail, more angular
    if (bubbleStyle === "manga") {
      return (
        <div style={{ position: "relative", padding: "20px" }}>
          <svg width="280" height="150" viewBox="0 0 280 150" style={{ overflow: "visible" }}>
            {/* Main manga bubble - slightly angular ellipse */}
            <ellipse cx="140" cy="55" rx="115" ry="50" fill={currentColor.bg} stroke={currentColor.border} strokeWidth="2" />
            {/* Sharp pointed tail */}
            <polygon
              points={
                isRight ? "190,90 250,140 170,95" :
                isLeft ? "90,90 30,140 110,95" :
                "135,90 140,140 145,90"
              }
              fill={currentColor.bg}
              stroke={currentColor.border}
              strokeWidth="2"
              strokeLinejoin="miter"
            />
            {/* Cover the line inside */}
            <ellipse cx="140" cy="55" rx="112" ry="47" fill={currentColor.bg} />
            {/* Text */}
            <foreignObject x="40" y="15" width="200" height="80">
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                textAlign: "center",
                fontSize: getFontSize(),
                fontWeight: "500",
                color: currentColor.text,
                padding: "10px",
                lineHeight: "1.3",
                wordBreak: "break-word"
              }}>
                {text}
              </div>
            </foreignObject>
          </svg>
        </div>
      );
    }

    // Whisper bubble - dotted border
    if (bubbleStyle === "whisper") {
      return (
        <div style={{ position: "relative", padding: "20px" }}>
          <svg width="280" height="140" viewBox="0 0 280 140" style={{ overflow: "visible" }}>
            {/* Dotted rectangle bubble */}
            <rect
              x="20" y="10" width="240" height="85" rx="20" ry="20"
              fill={currentColor.bg}
              stroke={currentColor.border}
              strokeWidth="3"
              strokeDasharray="8,6"
            />
            {/* Dotted tail */}
            <path
              d={
                isRight ? "M 200,95 Q 220,110 210,130" :
                isLeft ? "M 80,95 Q 60,110 70,130" :
                "M 140,95 L 140,125"
              }
              fill="none"
              stroke={currentColor.border}
              strokeWidth="3"
              strokeDasharray="6,4"
              strokeLinecap="round"
            />
            {/* Text */}
            <foreignObject x="35" y="20" width="210" height="65">
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                textAlign: "center",
                fontSize: getFontSize(),
                fontWeight: "400",
                fontStyle: "italic",
                color: currentColor.text,
                opacity: 0.8,
                padding: "5px",
                lineHeight: "1.3",
                wordBreak: "break-word"
              }}>
                {text}
              </div>
            </foreignObject>
          </svg>
        </div>
      );
    }

    // Default Speech bubble
    return (
      <div style={{ position: "relative", padding: "20px" }}>
        <svg width="280" height="140" viewBox="0 0 280 140" style={{ overflow: "visible" }}>
          <polygon
            points={
              isHorizontal
                ? (tailPosition === "left" ? "25,45 5,52 25,60" : "255,45 275,52 255,60")
                : (isRight ? "195,85 220,120 170,85" :
                   isLeft ? "85,85 60,120 110,85" :
                   "130,85 140,120 150,85")
            }
            fill={currentColor.bg}
            stroke={currentColor.border}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <rect
            x="20" y="10" width="240" height="80" rx="25" ry="25"
            fill={currentColor.bg}
            stroke={currentColor.border}
            strokeWidth="3"
          />
          {!isHorizontal && (
            <rect
              x={isRight ? "170" : isLeft ? "85" : "130"}
              y="82"
              width="40"
              height="10"
              fill={currentColor.bg}
            />
          )}
          {isHorizontal && (
            <rect
              x={tailPosition === "left" ? "18" : "252"}
              y="43"
              width="12"
              height="20"
              fill={currentColor.bg}
            />
          )}
          <foreignObject x="35" y="15" width="210" height="70">
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              textAlign: "center",
              fontSize: getFontSize(),
              fontWeight: "500",
              color: currentColor.text,
              padding: "5px",
              lineHeight: "1.3",
              wordBreak: "break-word"
            }}>
              {text}
            </div>
          </foreignObject>
        </svg>
      </div>
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
                padding: "20px",
                minHeight: "220px",
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
                  <div ref={bubbleRef}>
                    {renderBubble()}
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
