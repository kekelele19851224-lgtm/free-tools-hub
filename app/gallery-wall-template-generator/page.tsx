"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// ============================================
// Types
// ============================================

interface Frame {
  id: number;
  x: number; // percentage from left
  y: number; // percentage from top
  width: number; // percentage of wall width
  height: number; // percentage of wall height
  actualWidth: number; // inches
  actualHeight: number; // inches
}

interface Layout {
  name: string;
  frames: Frame[];
}

// ============================================
// Layout Templates (percentage-based)
// ============================================

const layoutTemplates: Record<string, Record<number, Layout[]>> = {
  grid: {
    3: [
      { name: "Horizontal Row", frames: [
        { id: 1, x: 15, y: 35, width: 20, height: 30, actualWidth: 8, actualHeight: 10 },
        { id: 2, x: 40, y: 35, width: 20, height: 30, actualWidth: 8, actualHeight: 10 },
        { id: 3, x: 65, y: 35, width: 20, height: 30, actualWidth: 8, actualHeight: 10 },
      ]},
      { name: "Vertical Stack", frames: [
        { id: 1, x: 35, y: 10, width: 30, height: 25, actualWidth: 11, actualHeight: 14 },
        { id: 2, x: 35, y: 38, width: 30, height: 25, actualWidth: 11, actualHeight: 14 },
        { id: 3, x: 35, y: 66, width: 30, height: 25, actualWidth: 11, actualHeight: 14 },
      ]},
    ],
    4: [
      { name: "2x2 Grid", frames: [
        { id: 1, x: 20, y: 15, width: 25, height: 32, actualWidth: 8, actualHeight: 10 },
        { id: 2, x: 55, y: 15, width: 25, height: 32, actualWidth: 8, actualHeight: 10 },
        { id: 3, x: 20, y: 53, width: 25, height: 32, actualWidth: 8, actualHeight: 10 },
        { id: 4, x: 55, y: 53, width: 25, height: 32, actualWidth: 8, actualHeight: 10 },
      ]},
    ],
    6: [
      { name: "2x3 Grid", frames: [
        { id: 1, x: 12, y: 20, width: 22, height: 25, actualWidth: 8, actualHeight: 10 },
        { id: 2, x: 39, y: 20, width: 22, height: 25, actualWidth: 8, actualHeight: 10 },
        { id: 3, x: 66, y: 20, width: 22, height: 25, actualWidth: 8, actualHeight: 10 },
        { id: 4, x: 12, y: 55, width: 22, height: 25, actualWidth: 8, actualHeight: 10 },
        { id: 5, x: 39, y: 55, width: 22, height: 25, actualWidth: 8, actualHeight: 10 },
        { id: 6, x: 66, y: 55, width: 22, height: 25, actualWidth: 8, actualHeight: 10 },
      ]},
    ],
    9: [
      { name: "3x3 Grid", frames: [
        { id: 1, x: 10, y: 8, width: 22, height: 26, actualWidth: 8, actualHeight: 10 },
        { id: 2, x: 39, y: 8, width: 22, height: 26, actualWidth: 8, actualHeight: 10 },
        { id: 3, x: 68, y: 8, width: 22, height: 26, actualWidth: 8, actualHeight: 10 },
        { id: 4, x: 10, y: 37, width: 22, height: 26, actualWidth: 8, actualHeight: 10 },
        { id: 5, x: 39, y: 37, width: 22, height: 26, actualWidth: 8, actualHeight: 10 },
        { id: 6, x: 68, y: 37, width: 22, height: 26, actualWidth: 8, actualHeight: 10 },
        { id: 7, x: 10, y: 66, width: 22, height: 26, actualWidth: 8, actualHeight: 10 },
        { id: 8, x: 39, y: 66, width: 22, height: 26, actualWidth: 8, actualHeight: 10 },
        { id: 9, x: 68, y: 66, width: 22, height: 26, actualWidth: 8, actualHeight: 10 },
      ]},
    ],
  },
  salon: {
    5: [
      { name: "Eclectic Mix", frames: [
        { id: 1, x: 10, y: 20, width: 28, height: 35, actualWidth: 11, actualHeight: 14 },
        { id: 2, x: 42, y: 10, width: 18, height: 22, actualWidth: 5, actualHeight: 7 },
        { id: 3, x: 65, y: 15, width: 25, height: 30, actualWidth: 8, actualHeight: 10 },
        { id: 4, x: 42, y: 40, width: 20, height: 25, actualWidth: 8, actualHeight: 10 },
        { id: 5, x: 15, y: 62, width: 22, height: 28, actualWidth: 8, actualHeight: 10 },
      ]},
      { name: "Clustered Gallery", frames: [
        { id: 1, x: 25, y: 15, width: 30, height: 38, actualWidth: 11, actualHeight: 14 },
        { id: 2, x: 58, y: 20, width: 20, height: 25, actualWidth: 8, actualHeight: 10 },
        { id: 3, x: 10, y: 25, width: 12, height: 15, actualWidth: 4, actualHeight: 6 },
        { id: 4, x: 60, y: 50, width: 25, height: 32, actualWidth: 8, actualHeight: 10 },
        { id: 5, x: 28, y: 58, width: 28, height: 35, actualWidth: 11, actualHeight: 14 },
      ]},
    ],
    7: [
      { name: "Artistic Scatter", frames: [
        { id: 1, x: 8, y: 15, width: 25, height: 30, actualWidth: 8, actualHeight: 10 },
        { id: 2, x: 38, y: 8, width: 20, height: 25, actualWidth: 8, actualHeight: 10 },
        { id: 3, x: 62, y: 12, width: 28, height: 35, actualWidth: 11, actualHeight: 14 },
        { id: 4, x: 12, y: 50, width: 18, height: 22, actualWidth: 5, actualHeight: 7 },
        { id: 5, x: 35, y: 38, width: 22, height: 28, actualWidth: 8, actualHeight: 10 },
        { id: 6, x: 60, y: 52, width: 15, height: 18, actualWidth: 5, actualHeight: 7 },
        { id: 7, x: 35, y: 70, width: 25, height: 22, actualWidth: 10, actualHeight: 8 },
      ]},
    ],
  },
  linear: {
    3: [
      { name: "Horizontal Line", frames: [
        { id: 1, x: 10, y: 35, width: 22, height: 30, actualWidth: 8, actualHeight: 10 },
        { id: 2, x: 38, y: 35, width: 24, height: 30, actualWidth: 8, actualHeight: 10 },
        { id: 3, x: 68, y: 35, width: 22, height: 30, actualWidth: 8, actualHeight: 10 },
      ]},
    ],
    4: [
      { name: "Long Row", frames: [
        { id: 1, x: 5, y: 38, width: 20, height: 24, actualWidth: 8, actualHeight: 10 },
        { id: 2, x: 28, y: 38, width: 20, height: 24, actualWidth: 8, actualHeight: 10 },
        { id: 3, x: 52, y: 38, width: 20, height: 24, actualWidth: 8, actualHeight: 10 },
        { id: 4, x: 75, y: 38, width: 20, height: 24, actualWidth: 8, actualHeight: 10 },
      ]},
    ],
    5: [
      { name: "Extended Row", frames: [
        { id: 1, x: 5, y: 38, width: 16, height: 24, actualWidth: 5, actualHeight: 7 },
        { id: 2, x: 24, y: 38, width: 16, height: 24, actualWidth: 5, actualHeight: 7 },
        { id: 3, x: 43, y: 38, width: 16, height: 24, actualWidth: 5, actualHeight: 7 },
        { id: 4, x: 62, y: 38, width: 16, height: 24, actualWidth: 5, actualHeight: 7 },
        { id: 5, x: 81, y: 38, width: 16, height: 24, actualWidth: 5, actualHeight: 7 },
      ]},
    ],
  },
  centered: {
    5: [
      { name: "Center Focus", frames: [
        { id: 1, x: 30, y: 20, width: 40, height: 45, actualWidth: 16, actualHeight: 20 },
        { id: 2, x: 8, y: 30, width: 18, height: 22, actualWidth: 5, actualHeight: 7 },
        { id: 3, x: 74, y: 30, width: 18, height: 22, actualWidth: 5, actualHeight: 7 },
        { id: 4, x: 15, y: 70, width: 20, height: 22, actualWidth: 8, actualHeight: 10 },
        { id: 5, x: 65, y: 70, width: 20, height: 22, actualWidth: 8, actualHeight: 10 },
      ]},
    ],
    7: [
      { name: "Statement Piece", frames: [
        { id: 1, x: 28, y: 15, width: 44, height: 50, actualWidth: 16, actualHeight: 20 },
        { id: 2, x: 5, y: 20, width: 18, height: 22, actualWidth: 5, actualHeight: 7 },
        { id: 3, x: 77, y: 20, width: 18, height: 22, actualWidth: 5, actualHeight: 7 },
        { id: 4, x: 5, y: 50, width: 18, height: 22, actualWidth: 5, actualHeight: 7 },
        { id: 5, x: 77, y: 50, width: 18, height: 22, actualWidth: 5, actualHeight: 7 },
        { id: 6, x: 25, y: 72, width: 22, height: 20, actualWidth: 8, actualHeight: 10 },
        { id: 7, x: 53, y: 72, width: 22, height: 20, actualWidth: 8, actualHeight: 10 },
      ]},
    ],
  },
  asymmetric: {
    4: [
      { name: "Dynamic Balance", frames: [
        { id: 1, x: 8, y: 15, width: 35, height: 45, actualWidth: 11, actualHeight: 14 },
        { id: 2, x: 50, y: 10, width: 22, height: 28, actualWidth: 8, actualHeight: 10 },
        { id: 3, x: 55, y: 45, width: 35, height: 42, actualWidth: 11, actualHeight: 14 },
        { id: 4, x: 15, y: 68, width: 25, height: 25, actualWidth: 8, actualHeight: 10 },
      ]},
    ],
    6: [
      { name: "Creative Flow", frames: [
        { id: 1, x: 5, y: 10, width: 30, height: 38, actualWidth: 11, actualHeight: 14 },
        { id: 2, x: 40, y: 5, width: 18, height: 22, actualWidth: 5, actualHeight: 7 },
        { id: 3, x: 62, y: 15, width: 28, height: 35, actualWidth: 8, actualHeight: 10 },
        { id: 4, x: 8, y: 55, width: 22, height: 28, actualWidth: 8, actualHeight: 10 },
        { id: 5, x: 38, y: 35, width: 20, height: 25, actualWidth: 8, actualHeight: 10 },
        { id: 6, x: 55, y: 58, width: 35, height: 35, actualWidth: 11, actualHeight: 14 },
      ]},
    ],
  },
};

// Style options
const styleOptions = [
  { id: 'grid', label: 'Grid', emoji: '🔲', description: 'Symmetric rows & columns' },
  { id: 'salon', label: 'Salon', emoji: '🎨', description: 'Eclectic gallery style' },
  { id: 'linear', label: 'Linear', emoji: '➖', description: 'Single row arrangement' },
  { id: 'centered', label: 'Centered', emoji: '⬛', description: 'Focus on center piece' },
  { id: 'asymmetric', label: 'Asymmetric', emoji: '🔀', description: 'Artistic imbalance' },
];

// Frame count options per style
const frameCountOptions: Record<string, number[]> = {
  grid: [3, 4, 6, 9],
  salon: [5, 7],
  linear: [3, 4, 5],
  centered: [5, 7],
  asymmetric: [4, 6],
};

// Common frame sizes reference
const commonFrameSizes = [
  { size: '4×6"', cm: '10×15cm', use: 'Small accents' },
  { size: '5×7"', cm: '13×18cm', use: 'Standard photos' },
  { size: '8×10"', cm: '20×25cm', use: 'Medium display' },
  { size: '11×14"', cm: '28×35cm', use: 'Large statement' },
  { size: '16×20"', cm: '40×50cm', use: 'Gallery centerpiece' },
];

// FAQ data
const faqs = [
  {
    question: "How do I plan a gallery wall layout?",
    answer: "Start by measuring your wall space and deciding on a style (grid, salon, linear, etc.). Use our generator to visualize different layouts. Consider the spacing between frames (typically 2-3 inches), ensure proper eye-level positioning (center at 57-60 inches from floor), and lay out your frames on the floor first before hanging."
  },
  {
    question: "What is the best spacing for a gallery wall?",
    answer: "The ideal spacing between frames is typically 2-3 inches (5-7.5 cm). For a cohesive look, keep spacing consistent throughout. Smaller frames can be closer together (1.5-2 inches), while larger frames benefit from slightly more space (3-4 inches). Our layouts use optimal spacing ratios."
  },
  {
    question: "How high should I hang pictures on a gallery wall?",
    answer: "The center of your gallery wall arrangement should be at eye level, which is typically 57-60 inches (145-152 cm) from the floor. This is the standard museum hanging height. For areas with seating, you may want to hang slightly lower, around 48-52 inches from the floor."
  },
  {
    question: "What frame sizes work best for gallery walls?",
    answer: "A mix of sizes creates visual interest. Common sizes include 4×6\", 5×7\", 8×10\", 11×14\", and 16×20\". For grid layouts, use uniform sizes. For salon or eclectic styles, mix 2-3 different sizes. Include one larger 'anchor' piece (16×20\" or bigger) to ground the arrangement."
  },
  {
    question: "How many pictures should be in a gallery wall?",
    answer: "Gallery walls typically work best with 3-12 frames. Smaller walls (under 4 feet wide) suit 3-5 frames. Medium walls (4-8 feet) can handle 5-9 frames. Large walls (over 8 feet) can accommodate 9+ frames. Start with fewer and add more over time if desired."
  },
  {
    question: "Should gallery wall frames be the same size?",
    answer: "Not necessarily! Grid layouts look best with uniform frame sizes for a clean, modern look. Salon and eclectic styles benefit from mixed sizes to create visual interest. The key is balance—if using different sizes, distribute them evenly so no area feels too heavy or sparse."
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

export default function GalleryWallTemplateGenerator() {
  const [wallWidth, setWallWidth] = useState(72); // inches
  const [wallHeight, setWallHeight] = useState(60); // inches
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');
  const [selectedStyle, setSelectedStyle] = useState('grid');
  const [frameCount, setFrameCount] = useState(4);
  const [currentLayout, setCurrentLayout] = useState<Layout | null>(null);
  const [layoutIndex, setLayoutIndex] = useState(0);

  // Convert units for display
  const convertToDisplay = (inches: number) => {
    return unit === 'cm' ? Math.round(inches * 2.54) : inches;
  };

  const convertFromInput = (value: number) => {
    return unit === 'cm' ? value / 2.54 : value;
  };

  // Generate layout
  const generateLayout = () => {
    const styleLayouts = layoutTemplates[selectedStyle];
    if (!styleLayouts) return;
    
    // Find layouts for the selected frame count
    let availableLayouts = styleLayouts[frameCount];
    
    // If no exact match, find closest
    if (!availableLayouts) {
      const counts = Object.keys(styleLayouts).map(Number);
      const closest = counts.reduce((prev, curr) => 
        Math.abs(curr - frameCount) < Math.abs(prev - frameCount) ? curr : prev
      );
      availableLayouts = styleLayouts[closest];
      setFrameCount(closest);
    }
    
    if (availableLayouts && availableLayouts.length > 0) {
      const newIndex = (layoutIndex + 1) % availableLayouts.length;
      setLayoutIndex(newIndex);
      setCurrentLayout(availableLayouts[newIndex]);
    }
  };

  // Calculate actual positions based on wall size
  const getActualPosition = (frame: Frame) => {
    const actualX = (frame.x / 100) * wallWidth;
    const actualY = (frame.y / 100) * wallHeight;
    return {
      fromLeft: Math.round(actualX * 10) / 10,
      fromTop: Math.round(actualY * 10) / 10,
      centerX: Math.round((actualX + (frame.width / 100 * wallWidth) / 2) * 10) / 10,
      centerY: Math.round((actualY + (frame.height / 100 * wallHeight) / 2) * 10) / 10,
    };
  };

  // Update frame count when style changes
  const handleStyleChange = (style: string) => {
    setSelectedStyle(style);
    const availableCounts = frameCountOptions[style];
    if (!availableCounts.includes(frameCount)) {
      setFrameCount(availableCounts[0]);
    }
    setCurrentLayout(null);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FFFBEB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #FDE68A" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Gallery Wall Template Generator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "2.5rem" }}>🖼️</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Gallery Wall Template Generator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Plan your perfect gallery wall layout. Enter your wall dimensions, choose a style, 
            and get frame positions with measurements for easy hanging.
          </p>
        </div>

        {/* Tip Box */}
        <div style={{
          backgroundColor: "#92400E",
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
              <p style={{ color: "#FDE68A", margin: 0, fontSize: "0.95rem" }}>
                Hang the center of your gallery wall at eye level (57-60 inches from the floor). 
                Keep 2-3 inches between frames for a cohesive look.
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
            border: "1px solid #FDE68A",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#92400E", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                ⚙️ Wall Settings
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              {/* Unit Toggle */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                  📏 Measurement Unit
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => setUnit('inches')}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "8px",
                      border: unit === 'inches' ? "2px solid #92400E" : "1px solid #E5E7EB",
                      backgroundColor: unit === 'inches' ? "#FFFBEB" : "white",
                      cursor: "pointer",
                      fontWeight: unit === 'inches' ? "600" : "400",
                      color: unit === 'inches' ? "#92400E" : "#4B5563"
                    }}
                  >
                    Inches
                  </button>
                  <button
                    onClick={() => setUnit('cm')}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "8px",
                      border: unit === 'cm' ? "2px solid #92400E" : "1px solid #E5E7EB",
                      backgroundColor: unit === 'cm' ? "#FFFBEB" : "white",
                      cursor: "pointer",
                      fontWeight: unit === 'cm' ? "600" : "400",
                      color: unit === 'cm' ? "#92400E" : "#4B5563"
                    }}
                  >
                    Centimeters
                  </button>
                </div>
              </div>

              {/* Wall Dimensions */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    ↔️ Wall Width ({unit})
                  </label>
                  <input
                    type="number"
                    value={convertToDisplay(wallWidth)}
                    onChange={(e) => setWallWidth(convertFromInput(Number(e.target.value)))}
                    min={24}
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
                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    ↕️ Wall Height ({unit})
                  </label>
                  <input
                    type="number"
                    value={convertToDisplay(wallHeight)}
                    onChange={(e) => setWallHeight(convertFromInput(Number(e.target.value)))}
                    min={24}
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
              </div>

              {/* Layout Style */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                  🎨 Layout Style
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                  {styleOptions.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => handleStyleChange(style.id)}
                      style={{
                        padding: "12px 8px",
                        borderRadius: "8px",
                        border: selectedStyle === style.id ? "2px solid #92400E" : "1px solid #E5E7EB",
                        backgroundColor: selectedStyle === style.id ? "#FFFBEB" : "white",
                        cursor: "pointer",
                        textAlign: "center"
                      }}
                    >
                      <div style={{ fontSize: "1.3rem", marginBottom: "4px" }}>{style.emoji}</div>
                      <div style={{ 
                        fontSize: "0.8rem", 
                        fontWeight: selectedStyle === style.id ? "600" : "400",
                        color: selectedStyle === style.id ? "#92400E" : "#4B5563"
                      }}>
                        {style.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Frame Count */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                  🖼️ Number of Frames
                </label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {frameCountOptions[selectedStyle]?.map((count) => (
                    <button
                      key={count}
                      onClick={() => setFrameCount(count)}
                      style={{
                        padding: "10px 20px",
                        borderRadius: "8px",
                        border: frameCount === count ? "2px solid #92400E" : "1px solid #E5E7EB",
                        backgroundColor: frameCount === count ? "#FFFBEB" : "white",
                        cursor: "pointer",
                        fontWeight: frameCount === count ? "600" : "400",
                        color: frameCount === count ? "#92400E" : "#4B5563",
                        fontSize: "1rem"
                      }}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateLayout}
                style={{
                  width: "100%",
                  padding: "16px",
                  backgroundColor: "#92400E",
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
                ✨ Generate Layout
              </button>
              {currentLayout && (
                <p style={{ textAlign: "center", fontSize: "0.8rem", color: "#6B7280", marginTop: "8px" }}>
                  Click again for a different variation
                </p>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="calc-results" style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #FDE68A",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#B45309", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                🖼️ Layout Preview
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              {/* SVG Preview */}
              <div style={{
                backgroundColor: "#F5F5F4",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "20px",
                border: "2px dashed #D6D3D1"
              }}>
                {!currentLayout ? (
                  <div style={{ textAlign: "center", padding: "60px 20px", color: "#9CA3AF" }}>
                    <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🎯</div>
                    <p style={{ margin: 0 }}>Configure your settings and click Generate!</p>
                  </div>
                ) : (
                  <svg
                    viewBox="0 0 100 83"
                    style={{ width: "100%", height: "auto", maxHeight: "300px" }}
                  >
                    {/* Wall background */}
                    <rect x="0" y="0" width="100" height="83" fill="#FAF5FF" stroke="#E5E7EB" strokeWidth="0.5" />
                    
                    {/* Frames */}
                    {currentLayout.frames.map((frame) => (
                      <g key={frame.id}>
                        {/* Frame shadow */}
                        <rect
                          x={frame.x + 0.5}
                          y={frame.y + 0.5}
                          width={frame.width}
                          height={frame.height}
                          fill="#D6D3D1"
                        />
                        {/* Frame */}
                        <rect
                          x={frame.x}
                          y={frame.y}
                          width={frame.width}
                          height={frame.height}
                          fill="#FAFAF9"
                          stroke="#78716C"
                          strokeWidth="0.8"
                        />
                        {/* Frame number */}
                        <text
                          x={frame.x + frame.width / 2}
                          y={frame.y + frame.height / 2 + 2}
                          textAnchor="middle"
                          fontSize="5"
                          fill="#78716C"
                          fontWeight="bold"
                        >
                          {frame.id}
                        </text>
                      </g>
                    ))}
                  </svg>
                )}
                
                {currentLayout && (
                  <p style={{ textAlign: "center", color: "#92400E", fontWeight: "600", marginTop: "12px", marginBottom: 0 }}>
                    {currentLayout.name}
                  </p>
                )}
              </div>

              {/* Frame Details */}
              {currentLayout && (
                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "#111827", marginBottom: "12px" }}>
                    📐 Frame Positions ({unit})
                  </h3>
                  <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#FFFBEB" }}>
                          <th style={{ padding: "8px", textAlign: "left", borderBottom: "1px solid #FDE68A" }}>#</th>
                          <th style={{ padding: "8px", textAlign: "left", borderBottom: "1px solid #FDE68A" }}>Size</th>
                          <th style={{ padding: "8px", textAlign: "left", borderBottom: "1px solid #FDE68A" }}>From Left</th>
                          <th style={{ padding: "8px", textAlign: "left", borderBottom: "1px solid #FDE68A" }}>From Top</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentLayout.frames.map((frame) => {
                          const pos = getActualPosition(frame);
                          return (
                            <tr key={frame.id}>
                              <td style={{ padding: "8px", borderBottom: "1px solid #E5E7EB", fontWeight: "600" }}>{frame.id}</td>
                              <td style={{ padding: "8px", borderBottom: "1px solid #E5E7EB" }}>
                                {frame.actualWidth}×{frame.actualHeight}&quot;
                              </td>
                              <td style={{ padding: "8px", borderBottom: "1px solid #E5E7EB" }}>
                                {convertToDisplay(pos.fromLeft)}{unit === 'cm' ? 'cm' : '"'}
                              </td>
                              <td style={{ padding: "8px", borderBottom: "1px solid #E5E7EB" }}>
                                {convertToDisplay(pos.fromTop)}{unit === 'cm' ? 'cm' : '"'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Frame Size Reference */}
        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "16px", 
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)", 
          border: "1px solid #FDE68A", 
          padding: "32px",
          marginBottom: "32px"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
            📏 Common Frame Sizes
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px" }}>
            {commonFrameSizes.map((item, idx) => (
              <div 
                key={idx}
                style={{
                  padding: "16px",
                  backgroundColor: "#FFFBEB",
                  borderRadius: "8px",
                  textAlign: "center",
                  border: "1px solid #FDE68A"
                }}
              >
                <div style={{ fontSize: "1.1rem", fontWeight: "600", color: "#92400E", marginBottom: "4px" }}>{item.size}</div>
                <div style={{ fontSize: "0.8rem", color: "#6B7280", marginBottom: "4px" }}>{item.cm}</div>
                <div style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>{item.use}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #FDE68A", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
                🎨 How to Create the Perfect Gallery Wall
              </h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  A gallery wall transforms blank walls into stunning displays of art, photos, and memories. 
                  Whether you prefer a clean grid layout or an eclectic salon style, proper planning is key to success.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Step-by-Step Guide</h3>
                <div style={{
                  backgroundColor: "#FFFBEB",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #FDE68A"
                }}>
                  <ol style={{ margin: 0, paddingLeft: "20px", lineHeight: "2" }}>
                    <li><strong>Measure your wall</strong> - Get accurate width and height measurements</li>
                    <li><strong>Choose a layout style</strong> - Grid for modern, salon for eclectic</li>
                    <li><strong>Select frame sizes</strong> - Mix sizes or keep uniform</li>
                    <li><strong>Test on the floor</strong> - Arrange frames before hanging</li>
                    <li><strong>Use paper templates</strong> - Trace frames and tape to wall first</li>
                    <li><strong>Start from center</strong> - Work outward from focal point</li>
                  </ol>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Layout Styles Explained</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", margin: "16px 0" }}>
                  <div style={{ padding: "16px", backgroundColor: "#FFFBEB", borderRadius: "8px", border: "1px solid #FDE68A" }}>
                    <strong>🔲 Grid</strong>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#92400E" }}>
                      Clean, symmetrical rows and columns. Best for modern spaces.
                    </p>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#FFFBEB", borderRadius: "8px", border: "1px solid #FDE68A" }}>
                    <strong>🎨 Salon</strong>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#92400E" }}>
                      Eclectic mix of sizes. Creates a collected, artistic feel.
                    </p>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#FFFBEB", borderRadius: "8px", border: "1px solid #FDE68A" }}>
                    <strong>➖ Linear</strong>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#92400E" }}>
                      Single row arrangement. Perfect for hallways and narrow spaces.
                    </p>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#FFFBEB", borderRadius: "8px", border: "1px solid #FDE68A" }}>
                    <strong>⬛ Centered</strong>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#92400E" }}>
                      Large focal piece with smaller frames around it.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Hanging Tips */}
            <div style={{ backgroundColor: "#92400E", borderRadius: "16px", padding: "24px", marginBottom: "24px", color: "white" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "16px" }}>📌 Hanging Tips</h3>
              <div style={{ fontSize: "0.85rem", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>• Eye level = 57-60&quot; from floor</p>
                <p style={{ margin: "0 0 8px 0" }}>• Keep 2-3&quot; between frames</p>
                <p style={{ margin: "0 0 8px 0" }}>• Use paper templates first</p>
                <p style={{ margin: "0 0 8px 0" }}>• Start with center frame</p>
                <p style={{ margin: 0 }}>• Use level for straight lines</p>
              </div>
            </div>

            {/* Tools Needed */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "16px" }}>🧰 Tools You Need</h3>
              <div style={{ fontSize: "0.85rem", color: "#B45309", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>• Measuring tape</p>
                <p style={{ margin: "0 0 8px 0" }}>• Level (or phone app)</p>
                <p style={{ margin: "0 0 8px 0" }}>• Pencil</p>
                <p style={{ margin: "0 0 8px 0" }}>• Hammer & nails</p>
                <p style={{ margin: 0 }}>• Painter&apos;s tape</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/gallery-wall-template-generator" currentCategory="Home" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #FDE68A", padding: "32px", marginBottom: "24px" }}>
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
        <div style={{ padding: "16px", backgroundColor: "#FFFBEB", borderRadius: "8px", border: "1px solid #FDE68A" }}>
          <p style={{ fontSize: "0.75rem", color: "#92400E", textAlign: "center", margin: 0 }}>
            🖼️ <strong>Note:</strong> Measurements are approximate and for planning purposes. 
            Always double-check your specific frame dimensions before hanging.
          </p>
        </div>
      </div>
    </div>
  );
}