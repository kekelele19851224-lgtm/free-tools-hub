"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Style options
const brandStyles = [
  { id: "traditional", label: "Traditional Western", color: "#4A3728" },
  { id: "modern", label: "Modern Ranch", color: "#1F2937" },
  { id: "vintage", label: "Vintage Rustic", color: "#78350F" },
  { id: "texas", label: "Texas Classic", color: "#7C2D12" }
];

// Frame options
const frameOptions = [
  { id: "none", label: "None", icon: "—" },
  { id: "circle", label: "Circle", icon: "○" },
  { id: "diamond", label: "Diamond", icon: "◇" },
  { id: "shield", label: "Shield", icon: "🛡️" },
  { id: "rectangle", label: "Rectangle", icon: "▭" },
  { id: "horseshoe", label: "Horseshoe", icon: "🧲" }
];

// Letter style options
const letterStyles = [
  { id: "normal", label: "Normal", description: "Standard upright letters" },
  { id: "lazy", label: "Lazy", description: "Tilted 45° to the right" },
  { id: "rocking", label: "Rocking", description: "Curved base underneath" },
  { id: "running", label: "Running", description: "With a bar underneath" },
  { id: "flying", label: "Flying", description: "With wings on sides" }
];

// Decoration options
const decorationOptions = [
  { id: "none", label: "None" },
  { id: "star", label: "Star ★" },
  { id: "bar-top", label: "Bar Above —" },
  { id: "bar-bottom", label: "Bar Below —" },
  { id: "dots", label: "Dots • •" }
];

// Background options
const backgroundOptions = [
  { id: "white", label: "White", color: "#FFFFFF" },
  { id: "cream", label: "Cream", color: "#FEF3C7" },
  { id: "leather", label: "Leather", color: "#D2B48C" },
  { id: "wood", label: "Wood", color: "#DEB887" },
  { id: "dark", label: "Dark", color: "#1F2937" }
];

// Symbol gallery data
const symbolGallery = [
  { symbol: "—", name: "Bar", description: "Horizontal line placed above or below letters", example: "A̅ (Bar A)" },
  { symbol: "/", name: "Slash", description: "Diagonal line through or next to letters", example: "/A (Slash A)" },
  { symbol: "○", name: "Circle", description: "Ring around or next to letters", example: "ⓐ (Circle A)" },
  { symbol: "◇", name: "Diamond", description: "Diamond shape frame or accent", example: "◇A◇" },
  { symbol: "~", name: "Lazy", description: "Letter tilted 45° to the right", example: "Ⱥ (Lazy A)" },
  { symbol: "⌒", name: "Rocking", description: "Curved rocker base under letters", example: "A͜ (Rocking A)" },
  { symbol: "★", name: "Star", description: "Star symbol as accent or standalone", example: "★A★" },
  { symbol: "→", name: "Running", description: "Letter with horizontal bar below", example: "A̲ (Running A)" },
  { symbol: "∧", name: "Roof", description: "Inverted V above letters", example: "Â (Roof A)" },
  { symbol: "♢", name: "Open Diamond", description: "Open diamond shape", example: "♢JR♢" },
  { symbol: "⊂⊃", name: "Quarter Circle", description: "Curved quarter circle marks", example: "⊂A⊃" },
  { symbol: "†", name: "Cross", description: "Cross or plus sign", example: "†A†" }
];

// State registration info
const stateRegistration = [
  { state: "Texas", agency: "County Clerk's Office", note: "Registered per county, must be unique within county" },
  { state: "Montana", agency: "Department of Livestock", note: "Statewide registration required" },
  { state: "Wyoming", agency: "Livestock Board", note: "Brand must be recorded in Brand Book" },
  { state: "Colorado", agency: "Brand Inspection Division", note: "State-level registration" },
  { state: "Oklahoma", agency: "Brand Registration", note: "Required for cattle over 6 months" },
  { state: "Nebraska", agency: "Brand Committee", note: "Compulsory in brand area" }
];

// FAQ data
const faqs = [
  {
    question: "What is a cattle brand?",
    answer: "A cattle brand is a permanent mark made on livestock to indicate ownership. Traditionally applied with a hot iron, brands consist of letters, numbers, and symbols arranged in a unique design. Each brand is registered to a specific ranch or owner, making it a legal proof of ownership."
  },
  {
    question: "How do I design a good cattle brand?",
    answer: "Keep it simple with 2-3 elements maximum. Use clear, distinct shapes that won't blur when applied. Avoid intricate details that are hard to read from a distance. Consider how the brand will look when healed on the animal. Traditional designs using letters, numbers, and basic shapes work best."
  },
  {
    question: "Do I need to register my cattle brand?",
    answer: "Yes, in most U.S. states with significant livestock populations, brand registration is required by law. Registration is typically done at the county or state level, depending on your location. Check with your local livestock board or county clerk for specific requirements."
  },
  {
    question: "What do 'Lazy', 'Rocking', and 'Running' mean?",
    answer: "These are traditional terms for letter modifications: 'Lazy' means tilted 45° to the side, 'Rocking' has a curved base underneath like a rocking chair, 'Running' has a horizontal bar below the letter, and 'Flying' has wing-like extensions on the sides."
  },
  {
    question: "Can I use this generator for commercial purposes?",
    answer: "Yes, the designs you create are yours to use. However, before using a brand on livestock, you must verify it's not already registered in your area and complete the proper registration process with your local authorities."
  },
  {
    question: "What file format should I use for branding iron orders?",
    answer: "Most branding iron manufacturers prefer high-resolution PNG or PDF files. Download your design in PNG format at the highest quality. Some manufacturers may also accept SVG vector files for precise fabrication."
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

export default function RanchBrandGenerator() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"designer" | "symbols" | "guide">("designer");
  
  // Designer state
  const [initials, setInitials] = useState("JR");
  const [brandStyle, setBrandStyle] = useState("traditional");
  const [frame, setFrame] = useState("none");
  const [letterStyle, setLetterStyle] = useState("normal");
  const [decoration, setDecoration] = useState("none");
  const [background, setBackground] = useState("cream");
  
  const brandRef = useRef<HTMLDivElement>(null);

  // Get current style color
  const currentStyleColor = brandStyles.find(s => s.id === brandStyle)?.color || "#4A3728";
  const currentBgColor = backgroundOptions.find(b => b.id === background)?.color || "#FEF3C7";
  const textColor = background === "dark" ? "#F5DEB3" : currentStyleColor;

  // Generate SVG brand
  const renderBrand = () => {
    const size = 280;
    const center = size / 2;
    
    // Letter transform based on style
    let letterTransform = "";
    if (letterStyle === "lazy") {
      letterTransform = `rotate(45, ${center}, ${center})`;
    }

    // Frame path
    let framePath = "";
    let frameElement = null;
    
    switch (frame) {
      case "circle":
        frameElement = (
          <circle cx={center} cy={center} r={100} fill="none" stroke={textColor} strokeWidth="6" />
        );
        break;
      case "diamond":
        frameElement = (
          <polygon 
            points={`${center},${center-110} ${center+110},${center} ${center},${center+110} ${center-110},${center}`}
            fill="none" 
            stroke={textColor} 
            strokeWidth="6"
          />
        );
        break;
      case "shield":
        frameElement = (
          <path 
            d={`M ${center-80} ${center-90} 
                L ${center+80} ${center-90} 
                L ${center+80} ${center+20} 
                Q ${center+80} ${center+100} ${center} ${center+110}
                Q ${center-80} ${center+100} ${center-80} ${center+20}
                Z`}
            fill="none" 
            stroke={textColor} 
            strokeWidth="6"
          />
        );
        break;
      case "rectangle":
        frameElement = (
          <rect x={center-90} y={center-70} width="180" height="140" fill="none" stroke={textColor} strokeWidth="6" rx="8" />
        );
        break;
      case "horseshoe":
        frameElement = (
          <path 
            d={`M ${center-70} ${center+80} 
                L ${center-70} ${center-20}
                A 70 70 0 0 1 ${center+70} ${center-20}
                L ${center+70} ${center+80}`}
            fill="none" 
            stroke={textColor} 
            strokeWidth="8"
            strokeLinecap="round"
          />
        );
        break;
    }

    // Decoration elements
    let decorationElement = null;
    switch (decoration) {
      case "star":
        decorationElement = (
          <>
            <text x={center - 80} y={center + 8} fontSize="28" fill={textColor} textAnchor="middle">★</text>
            <text x={center + 80} y={center + 8} fontSize="28" fill={textColor} textAnchor="middle">★</text>
          </>
        );
        break;
      case "bar-top":
        decorationElement = (
          <line x1={center - 60} y1={center - 50} x2={center + 60} y2={center - 50} stroke={textColor} strokeWidth="6" strokeLinecap="round" />
        );
        break;
      case "bar-bottom":
        decorationElement = (
          <line x1={center - 60} y1={center + 55} x2={center + 60} y2={center + 55} stroke={textColor} strokeWidth="6" strokeLinecap="round" />
        );
        break;
      case "dots":
        decorationElement = (
          <>
            <circle cx={center - 70} cy={center} r="8" fill={textColor} />
            <circle cx={center + 70} cy={center} r="8" fill={textColor} />
          </>
        );
        break;
    }

    // Rocking base
    let rockingElement = null;
    if (letterStyle === "rocking") {
      rockingElement = (
        <path 
          d={`M ${center - 60} ${center + 50} Q ${center} ${center + 70} ${center + 60} ${center + 50}`}
          fill="none" 
          stroke={textColor} 
          strokeWidth="5"
          strokeLinecap="round"
        />
      );
    }

    // Running bar
    let runningElement = null;
    if (letterStyle === "running") {
      runningElement = (
        <line x1={center - 50} y1={center + 45} x2={center + 50} y2={center + 45} stroke={textColor} strokeWidth="4" strokeLinecap="round" />
      );
    }

    // Flying wings
    let flyingElement = null;
    if (letterStyle === "flying") {
      flyingElement = (
        <>
          <path 
            d={`M ${center - 55} ${center} Q ${center - 90} ${center - 30} ${center - 95} ${center - 50}`}
            fill="none" 
            stroke={textColor} 
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path 
            d={`M ${center - 55} ${center + 10} Q ${center - 85} ${center - 10} ${center - 90} ${center - 25}`}
            fill="none" 
            stroke={textColor} 
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path 
            d={`M ${center + 55} ${center} Q ${center + 90} ${center - 30} ${center + 95} ${center - 50}`}
            fill="none" 
            stroke={textColor} 
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path 
            d={`M ${center + 55} ${center + 10} Q ${center + 85} ${center - 10} ${center + 90} ${center - 25}`}
            fill="none" 
            stroke={textColor} 
            strokeWidth="3"
            strokeLinecap="round"
          />
        </>
      );
    }

    // Font based on style
    let fontFamily = "Georgia, serif";
    let fontWeight = "bold";
    if (brandStyle === "modern") {
      fontFamily = "Arial Black, sans-serif";
    } else if (brandStyle === "texas") {
      fontFamily = "Times New Roman, serif";
      fontWeight = "900";
    }

    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background */}
        <rect width={size} height={size} fill={currentBgColor} />
        
        {/* Frame */}
        {frameElement}
        
        {/* Decorations */}
        {decorationElement}
        
        {/* Letter style elements */}
        {rockingElement}
        {runningElement}
        {flyingElement}
        
        {/* Main text */}
        <g transform={letterTransform}>
          <text 
            x={center} 
            y={center + 18} 
            fontSize={initials.length > 2 ? "56" : "72"}
            fontFamily={fontFamily}
            fontWeight={fontWeight}
            fill={textColor}
            textAnchor="middle"
            style={{ letterSpacing: "0.05em" }}
          >
            {initials.toUpperCase()}
          </text>
        </g>
      </svg>
    );
  };

  // Download as PNG
  const downloadPNG = async () => {
    if (!brandRef.current) return;
    
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(brandRef.current, {
        backgroundColor: currentBgColor,
        scale: 3
      });
      
      const link = document.createElement('a');
      link.download = `ranch-brand-${initials.toLowerCase()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      alert('Download failed. Please try again.');
    }
  };

  // Download as SVG
  const downloadSVG = () => {
    const svgElement = brandRef.current?.querySelector('svg');
    if (!svgElement) return;
    
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.download = `ranch-brand-${initials.toLowerCase()}.svg`;
    link.href = url;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Ranch Brand Generator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🐄</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Ranch Brand Generator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Create unique cattle brand designs for your ranch. Design with traditional Western symbols, customize your initials, and download in PNG or SVG format for free.
          </p>
        </div>

        {/* Quick Info Box */}
        <div style={{
          backgroundColor: "#FEF3C7",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #FCD34D"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>🤠</span>
            <div>
              <p style={{ fontWeight: "600", color: "#92400E", margin: "0 0 4px 0" }}>Traditional Cattle Branding</p>
              <p style={{ color: "#92400E", margin: 0, fontSize: "0.95rem" }}>
                Cattle brands have been used since ancient times to mark ownership. A good brand is simple, distinctive, and easy to read. 
                Remember to register your brand with local authorities before use.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          {[
            { id: "designer", label: "Brand Designer", icon: "🎨" },
            { id: "symbols", label: "Symbol Gallery", icon: "📖" },
            { id: "guide", label: "Registration Guide", icon: "📋" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              style={{
                padding: "12px 20px",
                borderRadius: "8px",
                border: activeTab === tab.id ? "2px solid #92400E" : "1px solid #E5E7EB",
                backgroundColor: activeTab === tab.id ? "#FEF3C7" : "white",
                color: activeTab === tab.id ? "#92400E" : "#4B5563",
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

        {/* Tab 1: Brand Designer */}
        {activeTab === "designer" && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#92400E", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🎨 Design Your Brand</h2>
              </div>
              
              <div style={{ padding: "24px" }}>
                {/* Initials Input */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Initials / Text (1-3 characters)
                  </label>
                  <input
                    type="text"
                    value={initials}
                    onChange={(e) => setInitials(e.target.value.slice(0, 3))}
                    maxLength={3}
                    placeholder="e.g., JR, ABC, 7"
                    style={{
                      width: "100%",
                      padding: "14px",
                      borderRadius: "8px",
                      border: "1px solid #E5E7EB",
                      fontSize: "1.25rem",
                      textAlign: "center",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                {/* Brand Style */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    Brand Style
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {brandStyles.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setBrandStyle(style.id)}
                        style={{
                          padding: "10px",
                          borderRadius: "8px",
                          border: brandStyle === style.id ? "2px solid #92400E" : "1px solid #E5E7EB",
                          backgroundColor: brandStyle === style.id ? "#FEF3C7" : "white",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px"
                        }}
                      >
                        <div style={{ width: "16px", height: "16px", borderRadius: "50%", backgroundColor: style.color }}></div>
                        <span style={{ fontSize: "0.85rem", color: brandStyle === style.id ? "#92400E" : "#374151" }}>{style.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Frame */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    Frame Shape
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {frameOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setFrame(opt.id)}
                        style={{
                          padding: "8px 14px",
                          borderRadius: "8px",
                          border: frame === opt.id ? "2px solid #92400E" : "1px solid #E5E7EB",
                          backgroundColor: frame === opt.id ? "#FEF3C7" : "white",
                          cursor: "pointer",
                          fontSize: "0.85rem",
                          color: frame === opt.id ? "#92400E" : "#374151"
                        }}
                      >
                        {opt.icon} {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Letter Style */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    Letter Style
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {letterStyles.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setLetterStyle(style.id)}
                        title={style.description}
                        style={{
                          padding: "8px 14px",
                          borderRadius: "8px",
                          border: letterStyle === style.id ? "2px solid #92400E" : "1px solid #E5E7EB",
                          backgroundColor: letterStyle === style.id ? "#FEF3C7" : "white",
                          cursor: "pointer",
                          fontSize: "0.85rem",
                          color: letterStyle === style.id ? "#92400E" : "#374151"
                        }}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Decoration */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    Decoration
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {decorationOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setDecoration(opt.id)}
                        style={{
                          padding: "8px 14px",
                          borderRadius: "8px",
                          border: decoration === opt.id ? "2px solid #92400E" : "1px solid #E5E7EB",
                          backgroundColor: decoration === opt.id ? "#FEF3C7" : "white",
                          cursor: "pointer",
                          fontSize: "0.85rem",
                          color: decoration === opt.id ? "#92400E" : "#374151"
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Background */}
                <div style={{ marginBottom: "0" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    Background
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {backgroundOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setBackground(opt.id)}
                        style={{
                          padding: "8px 14px",
                          borderRadius: "8px",
                          border: background === opt.id ? "2px solid #92400E" : "1px solid #E5E7EB",
                          backgroundColor: opt.color,
                          cursor: "pointer",
                          fontSize: "0.85rem",
                          color: opt.id === "dark" ? "#FEF3C7" : "#374151"
                        }}
                      >
                        {opt.label}
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
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🐄 Your Brand</h2>
              </div>
              
              <div style={{ padding: "24px" }}>
                {/* Brand Preview */}
                <div 
                  ref={brandRef}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: "24px",
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: "2px solid #E5E7EB"
                  }}
                >
                  {renderBrand()}
                </div>

                {/* Download Buttons */}
                <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
                  <button
                    onClick={downloadPNG}
                    disabled={!initials.trim()}
                    style={{
                      flex: 1,
                      padding: "14px",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: initials.trim() ? "#059669" : "#D1D5DB",
                      color: "white",
                      fontWeight: "600",
                      fontSize: "0.95rem",
                      cursor: initials.trim() ? "pointer" : "not-allowed",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    }}
                  >
                    📥 Download PNG
                  </button>
                  <button
                    onClick={downloadSVG}
                    disabled={!initials.trim()}
                    style={{
                      flex: 1,
                      padding: "14px",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: initials.trim() ? "#2563EB" : "#D1D5DB",
                      color: "white",
                      fontWeight: "600",
                      fontSize: "0.95rem",
                      cursor: initials.trim() ? "pointer" : "not-allowed",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    }}
                  >
                    📄 Download SVG
                  </button>
                </div>

                {/* Tips */}
                <div style={{ padding: "16px", backgroundColor: "#F0FDF4", borderRadius: "8px", border: "1px solid #BBF7D0" }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#166534" }}>
                    💡 <strong>Tip:</strong> SVG format is best for branding iron manufacturers. PNG is ideal for printing and digital use.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Symbol Gallery */}
        {activeTab === "symbols" && (
          <div style={{ marginBottom: "40px" }}>
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#78350F", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📖 Traditional Brand Symbols</h2>
              </div>
              
              <div style={{ padding: "24px" }}>
                <p style={{ color: "#4B5563", marginBottom: "24px", lineHeight: "1.7" }}>
                  Cattle brands use a language of symbols and modifications that have been developed over centuries. 
                  Understanding these elements helps you create a meaningful and distinctive brand.
                </p>
                
                {/* Symbol Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px", marginBottom: "32px" }}>
                  {symbolGallery.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "16px",
                        backgroundColor: "#FFFBEB",
                        borderRadius: "12px",
                        border: "1px solid #FCD34D"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                        <span style={{ fontSize: "2rem", width: "40px", textAlign: "center" }}>{item.symbol}</span>
                        <h3 style={{ margin: 0, color: "#92400E", fontSize: "1.1rem" }}>{item.name}</h3>
                      </div>
                      <p style={{ color: "#78350F", margin: "0 0 8px 0", fontSize: "0.9rem" }}>{item.description}</p>
                      <p style={{ color: "#B45309", margin: 0, fontSize: "0.85rem", fontStyle: "italic" }}>Example: {item.example}</p>
                    </div>
                  ))}
                </div>

                {/* Letter Modifications */}
                <div style={{ padding: "24px", backgroundColor: "#FEF3C7", borderRadius: "12px", border: "1px solid #FCD34D" }}>
                  <h3 style={{ margin: "0 0 16px 0", color: "#92400E" }}>📝 Letter Modification Terms</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                    {letterStyles.map((style) => (
                      <div key={style.id} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                        <span style={{ fontWeight: "bold", color: "#78350F" }}>{style.label}:</span>
                        <span style={{ color: "#92400E", fontSize: "0.9rem" }}>{style.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Registration Guide */}
        {activeTab === "guide" && (
          <div style={{ marginBottom: "40px" }}>
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#1E40AF", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📋 Brand Registration Guide</h2>
              </div>
              
              <div style={{ padding: "24px" }}>
                {/* Design Tips */}
                <div style={{ marginBottom: "32px" }}>
                  <h3 style={{ color: "#111827", marginBottom: "16px" }}>🎯 Tips for Designing a Good Brand</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
                    {[
                      { tip: "Keep it Simple", desc: "2-3 elements maximum for easy reading" },
                      { tip: "Be Distinctive", desc: "Avoid common combinations already in use" },
                      { tip: "Think Practical", desc: "Consider how it will look when applied" },
                      { tip: "Check Availability", desc: "Search existing brand registries first" },
                      { tip: "Plan for Healing", desc: "Simple brands heal clearer on hide" },
                      { tip: "Consider Size", desc: "Brand should be readable from 30+ feet" }
                    ].map((item, idx) => (
                      <div key={idx} style={{ padding: "14px", backgroundColor: "#F3F4F6", borderRadius: "8px" }}>
                        <p style={{ margin: 0, fontWeight: "600", color: "#1F2937" }}>✓ {item.tip}</p>
                        <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#6B7280" }}>{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* State Registration Table */}
                <div style={{ marginBottom: "32px" }}>
                  <h3 style={{ color: "#111827", marginBottom: "16px" }}>🏛️ State Registration Offices</h3>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#EFF6FF" }}>
                          <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>State</th>
                          <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Registration Agency</th>
                          <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stateRegistration.map((row, idx) => (
                          <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                            <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", fontWeight: "600" }}>{row.state}</td>
                            <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB" }}>{row.agency}</td>
                            <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", color: "#6B7280" }}>{row.note}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "#9CA3AF", marginTop: "8px" }}>
                    * Registration requirements vary by state. Contact your local livestock board for current requirements.
                  </p>
                </div>

                {/* Registration Steps */}
                <div style={{ padding: "24px", backgroundColor: "#ECFDF5", borderRadius: "12px", border: "1px solid #A7F3D0" }}>
                  <h3 style={{ margin: "0 0 16px 0", color: "#065F46" }}>📝 Registration Steps</h3>
                  <ol style={{ margin: 0, paddingLeft: "20px", color: "#047857", lineHeight: "2" }}>
                    <li>Design your brand using simple, distinctive elements</li>
                    <li>Search existing brand registries for conflicts</li>
                    <li>Contact your county clerk or state livestock board</li>
                    <li>Complete the brand registration application</li>
                    <li>Pay the registration fee (varies by state)</li>
                    <li>Wait for approval (usually 2-4 weeks)</li>
                    <li>Receive your brand certificate</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            {/* About Cattle Brands */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>🤠 About Cattle Brands</h2>
              
              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  Cattle branding is an ancient practice dating back thousands of years, used to mark ownership of livestock. 
                  In the American West, branding became essential during the open-range era when cattle from different ranches 
                  grazed together on public lands.
                </p>
                <p>
                  A cattle brand consists of symbols arranged in a specific design. Traditional brands use letters (initials), 
                  numbers, and basic shapes like bars, circles, and diamonds. Each brand is unique to its owner and serves as 
                  a permanent, legal mark of ownership.
                </p>
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Reading a Brand</h3>
                <p>
                  Brands are read from left to right, top to bottom, and outside to inside. Modifications like &quot;Lazy&quot; (tilted), 
                  &quot;Rocking&quot; (curved base), and &quot;Running&quot; (with bar) change how letters are interpreted and named.
                </p>
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Modern Uses</h3>
                <p>
                  Today, cattle brands serve both practical and cultural purposes. Beyond livestock identification, brands are 
                  used in ranch logos, merchandise, and as symbols of family heritage. Many ranches proudly display their 
                  registered brands on gates, signs, and products.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Facts */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "16px" }}>📊 Quick Facts</h3>
              <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.875rem", color: "#78350F", lineHeight: "1.8" }}>
                <li>Brands date back to 2700 BC in Egypt</li>
                <li>Texas alone has 200,000+ registered brands</li>
                <li>Registration costs $10-$50 typically</li>
                <li>Brands are renewed every 10 years</li>
                <li>Each brand must be unique in its county/state</li>
              </ul>
            </div>

            {/* Common Mistakes */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "24px", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>⚠️ Common Mistakes</h3>
              <div style={{ fontSize: "0.85rem", color: "#4B5563", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>❌ Too many elements (hard to read)</p>
                <p style={{ margin: "0 0 8px 0" }}>❌ Using unregistered brands</p>
                <p style={{ margin: "0 0 8px 0" }}>❌ Complex designs that blur</p>
                <p style={{ margin: "0 0 8px 0" }}>❌ Copying existing brands</p>
                <p style={{ margin: 0 }}>❌ Not checking county records</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/ranch-brand-generator" currentCategory="Lifestyle" />
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
            🐄 <strong>Disclaimer:</strong> This tool creates brand designs for visualization purposes. Before using any brand on livestock, 
            verify availability and complete proper registration with your local county clerk or state livestock board.
          </p>
        </div>
      </div>
    </div>
  );
}