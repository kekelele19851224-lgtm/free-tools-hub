"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// ============================================
// Types & Data
// ============================================

// Input modes
const inputModes = [
  { id: 'date', label: 'Date', emoji: '📅', description: 'Birthday, anniversary, special date' },
  { id: 'number', label: 'Number', emoji: '🔢', description: 'Lucky number, jersey, year' },
];

// Date formats
const dateFormats = [
  { id: 'mm-dd-yyyy', label: 'MM • DD • YYYY', example: 'III • XIV • MCMXCII' },
  { id: 'dd-mm-yyyy', label: 'DD • MM • YYYY', example: 'XIV • III • MCMXCII' },
  { id: 'yyyy-mm-dd', label: 'YYYY • MM • DD', example: 'MCMXCII • III • XIV' },
  { id: 'mm-dd', label: 'MM • DD', example: 'III • XIV' },
  { id: 'yyyy', label: 'YYYY Only', example: 'MCMXCII' },
];

// Separators
const separators = [
  { id: 'dot', label: '•', name: 'Dot' },
  { id: 'dash', label: '-', name: 'Dash' },
  { id: 'slash', label: '/', name: 'Slash' },
  { id: 'space', label: ' ', name: 'Space' },
  { id: 'none', label: '', name: 'None' },
];

// Font styles for preview
const fontStyles = [
  { id: 'classic', name: 'Classic Serif', fontFamily: 'Times New Roman, serif', fontWeight: '400' },
  { id: 'modern', name: 'Modern Sans', fontFamily: 'Arial, sans-serif', fontWeight: '400' },
  { id: 'elegant', name: 'Elegant Script', fontFamily: 'Georgia, serif', fontWeight: '400', fontStyle: 'italic' },
  { id: 'bold', name: 'Bold Strong', fontFamily: 'Impact, sans-serif', fontWeight: '700' },
  { id: 'thin', name: 'Thin Minimal', fontFamily: 'Helvetica Neue, sans-serif', fontWeight: '200' },
  { id: 'mono', name: 'Monospace', fontFamily: 'Courier New, monospace', fontWeight: '400' },
];

// Popular placements
const placements = [
  { name: 'Inner Wrist', desc: 'Classic & visible' },
  { name: 'Collarbone', desc: 'Following bone line' },
  { name: 'Inner Forearm', desc: 'Horizontal display' },
  { name: 'Ribcage', desc: 'Intimate & hidden' },
  { name: 'Spine', desc: 'Vertical elegance' },
  { name: 'Behind Ear', desc: 'Subtle & delicate' },
];

// Roman numeral values
const romanNumerals: [number, string][] = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

// FAQ data
const faqs = [
  {
    question: "How do Roman numerals work?",
    answer: "Roman numerals use seven letters: I (1), V (5), X (10), L (50), C (100), D (500), and M (1000). Numbers are formed by combining these letters. When a smaller numeral appears before a larger one, it's subtracted (IV = 4). When it appears after, it's added (VI = 6)."
  },
  {
    question: "What's the most popular format for date tattoos?",
    answer: "The most popular format uses dots (•) as separators, like III • XIV • MCMXCII for March 14, 1992. This creates visual balance and is easy to read. The MM • DD • YYYY format is most common in the US, while DD • MM • YYYY is preferred in Europe."
  },
  {
    question: "Can Roman numerals represent zero?",
    answer: "No, the Roman numeral system doesn't have a symbol for zero. If your date includes a zero (like the month 01), it would simply be represented as I. Some modern adaptations use 'N' (from Latin 'nulla') but this isn't traditional."
  },
  {
    question: "What are good numbers for Roman numeral tattoos?",
    answer: "Popular choices include: birth dates, wedding anniversaries, graduation years, memorial dates for loved ones, lucky numbers, sports jersey numbers, or significant years. Couples often get matching date tattoos for their anniversary."
  },
  {
    question: "Where is the best placement for Roman numeral tattoos?",
    answer: "Popular placements include: the inner wrist (visible and classic), collarbone (following the bone line), inner forearm (good for longer dates), ribcage (intimate and hidden), spine (vertical elegance), and behind the ear (subtle and delicate)."
  },
  {
    question: "How do I write large numbers in Roman numerals?",
    answer: "Numbers up to 3,999 use standard symbols. For 4,000 and above, a line (vinculum) is placed over the numeral to multiply by 1,000. For example, V̅ = 5,000 and X̅ = 10,000. However, most tattoo dates fall well within the standard range."
  }
];

// FAQ component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #D4AF37" }}>
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
        <h3 style={{ fontWeight: "600", color: "#D4AF37", paddingRight: "16px", margin: 0, fontSize: "1rem" }}>{question}</h3>
        <svg style={{ width: "20px", height: "20px", color: "#6B7280", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div style={{ maxHeight: isOpen ? "500px" : "0", overflow: "hidden", transition: "max-height 0.3s ease-out" }}>
        <p style={{ color: "#D1D5DB", paddingBottom: "16px", margin: 0, lineHeight: "1.7" }}>{answer}</p>
      </div>
    </div>
  );
}

// Convert number to Roman numeral
function toRoman(num: number): string {
  if (num <= 0 || num > 3999) return '';
  let result = '';
  let remaining = num;
  
  for (const [value, symbol] of romanNumerals) {
    while (remaining >= value) {
      result += symbol;
      remaining -= value;
    }
  }
  
  return result;
}

// Get breakdown of Roman numeral
function getRomanBreakdown(num: number): { value: number; symbol: string }[] {
  const breakdown: { value: number; symbol: string }[] = [];
  let remaining = num;
  
  for (const [value, symbol] of romanNumerals) {
    while (remaining >= value) {
      breakdown.push({ value, symbol });
      remaining -= value;
    }
  }
  
  return breakdown;
}

export default function RomanNumeralTattooGenerator() {
  const [mode, setMode] = useState('date');
  const [dateFormat, setDateFormat] = useState('mm-dd-yyyy');
  const [separator, setSeparator] = useState('dot');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [year, setYear] = useState('');
  const [number, setNumber] = useState('');
  const [result, setResult] = useState('');
  const [originalValue, setOriginalValue] = useState('');
  const [copied, setCopied] = useState(false);

  // Set today's date
  const setToday = () => {
    const today = new Date();
    setMonth(String(today.getMonth() + 1));
    setDay(String(today.getDate()));
    setYear(String(today.getFullYear()));
  };

  // Set this year
  const setThisYear = () => {
    setYear(String(new Date().getFullYear()));
    setMonth('');
    setDay('');
    setDateFormat('yyyy');
  };

  // Generate Roman numeral
  const generate = () => {
    const sep = separators.find(s => s.id === separator)?.label || ' ';
    
    if (mode === 'number') {
      const num = parseInt(number);
      if (isNaN(num) || num <= 0 || num > 3999) {
        setResult('Please enter a valid number (1-3999)');
        setOriginalValue('');
        return;
      }
      setResult(toRoman(num));
      setOriginalValue(number);
    } else {
      const m = parseInt(month);
      const d = parseInt(day);
      const y = parseInt(year);
      
      const parts: string[] = [];
      let original: string[] = [];
      
      if (dateFormat === 'mm-dd-yyyy') {
        if (m) { parts.push(toRoman(m)); original.push(String(m)); }
        if (d) { parts.push(toRoman(d)); original.push(String(d)); }
        if (y) { parts.push(toRoman(y)); original.push(String(y)); }
      } else if (dateFormat === 'dd-mm-yyyy') {
        if (d) { parts.push(toRoman(d)); original.push(String(d)); }
        if (m) { parts.push(toRoman(m)); original.push(String(m)); }
        if (y) { parts.push(toRoman(y)); original.push(String(y)); }
      } else if (dateFormat === 'yyyy-mm-dd') {
        if (y) { parts.push(toRoman(y)); original.push(String(y)); }
        if (m) { parts.push(toRoman(m)); original.push(String(m)); }
        if (d) { parts.push(toRoman(d)); original.push(String(d)); }
      } else if (dateFormat === 'mm-dd') {
        if (m) { parts.push(toRoman(m)); original.push(String(m)); }
        if (d) { parts.push(toRoman(d)); original.push(String(d)); }
      } else if (dateFormat === 'yyyy') {
        if (y) { parts.push(toRoman(y)); original.push(String(y)); }
      }
      
      if (parts.length === 0 || parts.some(p => p === '')) {
        setResult('Please enter valid date values');
        setOriginalValue('');
        return;
      }
      
      setResult(parts.join(` ${sep} `).trim());
      setOriginalValue(original.join(sep === '' ? ' / ' : ` ${sep} `));
    }
  };

  // Copy to clipboard
  const copyResult = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#1C1C1C" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "#2D2D2D", borderBottom: "1px solid #D4AF37" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#9CA3AF" }}>
            <Link href="/" style={{ color: "#9CA3AF", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#D4AF37" }}>Roman Numeral Tattoo Generator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "2.5rem" }}>🏛️</span>
            <h1 style={{ fontSize: "clamp(1.75rem, 5vw, 2.25rem)", fontWeight: "bold", color: "#D4AF37", margin: 0 }}>
              Roman Numeral Tattoo Generator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#9CA3AF", maxWidth: "800px" }}>
            Convert dates and numbers into elegant Roman numerals for your tattoo. 
            Preview in multiple fonts and copy your design instantly.
          </p>
        </div>

        {/* Tip Box */}
        <div style={{
          backgroundColor: "#D4AF37",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "#1C1C1C", margin: "0 0 4px 0" }}>
                <strong>Pro Tip</strong>
              </p>
              <p style={{ color: "#2D2D2D", margin: 0, fontSize: "0.95rem" }}>
                The dot separator (•) is the most popular choice for date tattoos. 
                It creates visual balance and is easy to read at any size.
              </p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
          {/* Input Panel */}
          <div style={{
            backgroundColor: "#2D2D2D",
            borderRadius: "16px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
            border: "1px solid #D4AF37",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#D4AF37", padding: "16px 24px" }}>
              <h2 style={{ color: "#1C1C1C", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                ⚙️ Create Your Design
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              {/* Input Mode */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#D4AF37", marginBottom: "10px", fontWeight: "600" }}>
                  📝 Input Type
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                  {inputModes.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMode(m.id)}
                      style={{
                        padding: "12px 10px",
                        borderRadius: "8px",
                        border: mode === m.id ? "2px solid #D4AF37" : "1px solid #4B5563",
                        backgroundColor: mode === m.id ? "rgba(212, 175, 55, 0.1)" : "transparent",
                        cursor: "pointer",
                        textAlign: "left"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span>{m.emoji}</span>
                        <span style={{ 
                          fontWeight: mode === m.id ? "600" : "500",
                          color: mode === m.id ? "#D4AF37" : "#9CA3AF",
                          fontSize: "0.9rem"
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

              {mode === 'date' && (
                <>
                  {/* Date Format */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#D4AF37", marginBottom: "10px", fontWeight: "600" }}>
                      📅 Date Format
                    </label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {dateFormats.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setDateFormat(f.id)}
                          style={{
                            padding: "8px 12px",
                            borderRadius: "8px",
                            border: dateFormat === f.id ? "2px solid #D4AF37" : "1px solid #4B5563",
                            backgroundColor: dateFormat === f.id ? "rgba(212, 175, 55, 0.1)" : "transparent",
                            cursor: "pointer",
                            color: dateFormat === f.id ? "#D4AF37" : "#9CA3AF",
                            fontSize: "0.8rem"
                          }}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date Inputs */}
                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                      <label style={{ fontSize: "0.9rem", color: "#D4AF37", fontWeight: "600" }}>
                        🗓️ Enter Date
                      </label>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={setToday}
                          style={{
                            padding: "4px 10px",
                            backgroundColor: "rgba(212, 175, 55, 0.2)",
                            color: "#D4AF37",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "0.75rem",
                            cursor: "pointer"
                          }}
                        >
                          Today
                        </button>
                        <button
                          onClick={setThisYear}
                          style={{
                            padding: "4px 10px",
                            backgroundColor: "rgba(212, 175, 55, 0.2)",
                            color: "#D4AF37",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "0.75rem",
                            cursor: "pointer"
                          }}
                        >
                          This Year
                        </button>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.5fr", gap: "12px" }}>
                      {(dateFormat !== 'yyyy') && (
                        <div>
                          <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>Month</label>
                          <input
                            type="number"
                            min="1"
                            max="12"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            placeholder="1-12"
                            style={{
                              width: "100%",
                              padding: "10px 12px",
                              border: "1px solid #4B5563",
                              borderRadius: "8px",
                              backgroundColor: "#1C1C1C",
                              color: "#FFFFFF",
                              fontSize: "0.9rem",
                              boxSizing: "border-box"
                            }}
                          />
                        </div>
                      )}
                      {(dateFormat !== 'yyyy' && dateFormat !== 'mm-dd') && (
                        <div>
                          <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>Day</label>
                          <input
                            type="number"
                            min="1"
                            max="31"
                            value={day}
                            onChange={(e) => setDay(e.target.value)}
                            placeholder="1-31"
                            style={{
                              width: "100%",
                              padding: "10px 12px",
                              border: "1px solid #4B5563",
                              borderRadius: "8px",
                              backgroundColor: "#1C1C1C",
                              color: "#FFFFFF",
                              fontSize: "0.9rem",
                              boxSizing: "border-box"
                            }}
                          />
                        </div>
                      )}
                      {dateFormat === 'mm-dd' && (
                        <div>
                          <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>Day</label>
                          <input
                            type="number"
                            min="1"
                            max="31"
                            value={day}
                            onChange={(e) => setDay(e.target.value)}
                            placeholder="1-31"
                            style={{
                              width: "100%",
                              padding: "10px 12px",
                              border: "1px solid #4B5563",
                              borderRadius: "8px",
                              backgroundColor: "#1C1C1C",
                              color: "#FFFFFF",
                              fontSize: "0.9rem",
                              boxSizing: "border-box"
                            }}
                          />
                        </div>
                      )}
                      <div style={{ gridColumn: dateFormat === 'yyyy' ? '1 / -1' : 'auto' }}>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>Year</label>
                        <input
                          type="number"
                          min="1"
                          max="3999"
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                          placeholder="1900-2099"
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            border: "1px solid #4B5563",
                            borderRadius: "8px",
                            backgroundColor: "#1C1C1C",
                            color: "#FFFFFF",
                            fontSize: "0.9rem",
                            boxSizing: "border-box"
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Separator */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#D4AF37", marginBottom: "10px", fontWeight: "600" }}>
                      ✨ Separator
                    </label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {separators.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setSeparator(s.id)}
                          style={{
                            padding: "10px 16px",
                            borderRadius: "8px",
                            border: separator === s.id ? "2px solid #D4AF37" : "1px solid #4B5563",
                            backgroundColor: separator === s.id ? "rgba(212, 175, 55, 0.1)" : "transparent",
                            cursor: "pointer",
                            color: separator === s.id ? "#D4AF37" : "#9CA3AF",
                            fontSize: "0.9rem",
                            minWidth: "60px"
                          }}
                        >
                          <span style={{ fontWeight: "600" }}>{s.label || '∅'}</span>
                          <div style={{ fontSize: "0.65rem", marginTop: "2px" }}>{s.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {mode === 'number' && (
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#D4AF37", marginBottom: "10px", fontWeight: "600" }}>
                    🔢 Enter Number (1-3999)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="3999"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="Enter any number from 1 to 3999"
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      border: "1px solid #4B5563",
                      borderRadius: "8px",
                      backgroundColor: "#1C1C1C",
                      color: "#FFFFFF",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                  />
                  <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "8px" }}>
                    Popular: Lucky numbers, jersey numbers, anniversaries, memorial years
                  </p>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={generate}
                style={{
                  width: "100%",
                  padding: "16px",
                  backgroundColor: "#D4AF37",
                  color: "#1C1C1C",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                🏛️ Generate Roman Numerals
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="calc-results" style={{
            backgroundColor: "#2D2D2D",
            borderRadius: "16px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
            border: "1px solid #D4AF37",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#B8860B", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ color: "#1C1C1C", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                ✨ Your Roman Numeral
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              {!result ? (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#6B7280" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🏛️</div>
                  <p style={{ margin: 0 }}>Enter a date or number to generate your Roman numeral tattoo design</p>
                </div>
              ) : result.includes('Please') ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#EF4444" }}>
                  <p style={{ margin: 0 }}>{result}</p>
                </div>
              ) : (
                <>
                  {/* Main Result */}
                  <div style={{ 
                    textAlign: "center", 
                    padding: "32px 20px", 
                    backgroundColor: "#1C1C1C", 
                    borderRadius: "12px",
                    marginBottom: "20px",
                    border: "2px solid #D4AF37"
                  }}>
                    <p style={{ 
                      fontSize: "clamp(1.5rem, 5vw, 2.5rem)", 
                      fontWeight: "700", 
                      color: "#D4AF37", 
                      margin: "0 0 12px 0",
                      fontFamily: "Times New Roman, serif",
                      letterSpacing: "4px"
                    }}>
                      {result}
                    </p>
                    {originalValue && (
                      <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0 }}>
                        Original: {originalValue}
                      </p>
                    )}
                    <button
                      onClick={copyResult}
                      style={{
                        marginTop: "16px",
                        padding: "10px 24px",
                        backgroundColor: copied ? "#059669" : "#D4AF37",
                        color: copied ? "white" : "#1C1C1C",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        fontWeight: "600"
                      }}
                    >
                      {copied ? "✓ Copied!" : "📋 Copy to Clipboard"}
                    </button>
                  </div>

                  {/* Font Previews */}
                  <div>
                    <h3 style={{ color: "#D4AF37", fontSize: "1rem", marginBottom: "12px", fontWeight: "600" }}>
                      🎨 Font Previews
                    </h3>
                    <div style={{ display: "grid", gap: "8px" }}>
                      {fontStyles.map((font) => (
                        <div
                          key={font.id}
                          style={{
                            padding: "16px",
                            backgroundColor: "#1C1C1C",
                            borderRadius: "8px",
                            border: "1px solid #4B5563",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                          }}
                        >
                          <span style={{ fontSize: "0.8rem", color: "#6B7280" }}>{font.name}</span>
                          <span style={{ 
                            fontSize: "1.2rem", 
                            color: "#FFFFFF",
                            fontFamily: font.fontFamily,
                            fontWeight: font.fontWeight,
                            fontStyle: font.fontStyle || 'normal',
                            letterSpacing: "2px"
                          }}>
                            {result}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Roman Numeral Reference */}
        <div style={{ 
          backgroundColor: "#2D2D2D", 
          borderRadius: "16px", 
          boxShadow: "0 4px 6px rgba(0,0,0,0.3)", 
          border: "1px solid #D4AF37", 
          padding: "32px",
          marginBottom: "32px"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#D4AF37", marginBottom: "20px" }}>
            📖 Roman Numeral Reference
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "12px" }}>
            {[
              { symbol: 'I', value: '1' },
              { symbol: 'V', value: '5' },
              { symbol: 'X', value: '10' },
              { symbol: 'L', value: '50' },
              { symbol: 'C', value: '100' },
              { symbol: 'D', value: '500' },
              { symbol: 'M', value: '1000' },
            ].map((item, idx) => (
              <div 
                key={idx}
                style={{
                  padding: "16px",
                  backgroundColor: "#1C1C1C",
                  borderRadius: "8px",
                  textAlign: "center",
                  border: "1px solid #4B5563"
                }}
              >
                <div style={{ fontSize: "1.5rem", color: "#D4AF37", fontWeight: "700", fontFamily: "Times New Roman, serif" }}>{item.symbol}</div>
                <div style={{ fontSize: "0.85rem", color: "#9CA3AF", marginTop: "4px" }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "#2D2D2D", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.3)", border: "1px solid #D4AF37", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#D4AF37", marginBottom: "20px" }}>
                ✍️ Roman Numeral Tattoo Ideas
              </h2>

              <div style={{ color: "#9CA3AF", lineHeight: "1.8" }}>
                <p>
                  Roman numeral tattoos have become a timeless way to commemorate significant dates and numbers. 
                  Their elegant, classical appearance makes them perfect for meaningful body art.
                </p>

                <h3 style={{ color: "#D4AF37", marginTop: "24px", marginBottom: "12px" }}>Popular Dates to Commemorate</h3>
                <div style={{
                  backgroundColor: "#1C1C1C",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #4B5563"
                }}>
                  <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "2", color: "#9CA3AF" }}>
                    <li><strong style={{ color: "#D4AF37" }}>Birth dates:</strong> Your own or a loved one&apos;s</li>
                    <li><strong style={{ color: "#D4AF37" }}>Wedding anniversaries:</strong> When you said &quot;I do&quot;</li>
                    <li><strong style={{ color: "#D4AF37" }}>Memorial dates:</strong> Honoring those who passed</li>
                    <li><strong style={{ color: "#D4AF37" }}>Graduation years:</strong> Academic achievements</li>
                    <li><strong style={{ color: "#D4AF37" }}>Sobriety dates:</strong> Celebrating recovery</li>
                  </ul>
                </div>

                <h3 style={{ color: "#D4AF37", marginTop: "24px", marginBottom: "12px" }}>Popular Placements</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", marginTop: "16px" }}>
                  {placements.map((place, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "12px",
                        backgroundColor: "#1C1C1C",
                        borderRadius: "8px",
                        border: "1px solid #4B5563"
                      }}
                    >
                      <p style={{ margin: 0, color: "#D4AF37", fontWeight: "600", fontSize: "0.9rem" }}>{place.name}</p>
                      <p style={{ margin: "4px 0 0 0", color: "#6B7280", fontSize: "0.75rem" }}>{place.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Conversions */}
            <div style={{ backgroundColor: "#D4AF37", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#1C1C1C", marginBottom: "16px" }}>⚡ Common Years</h3>
              <div style={{ fontSize: "0.85rem", lineHeight: "2", color: "#2D2D2D" }}>
                <p style={{ margin: "0 0 4px 0" }}><strong>1990</strong> = MCMXC</p>
                <p style={{ margin: "0 0 4px 0" }}><strong>1995</strong> = MCMXCV</p>
                <p style={{ margin: "0 0 4px 0" }}><strong>2000</strong> = MM</p>
                <p style={{ margin: "0 0 4px 0" }}><strong>2010</strong> = MMX</p>
                <p style={{ margin: "0 0 4px 0" }}><strong>2020</strong> = MMXX</p>
                <p style={{ margin: 0 }}><strong>2025</strong> = MMXXV</p>
              </div>
            </div>

            {/* Tips */}
            <div style={{ backgroundColor: "#1C1C1C", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #D4AF37" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#D4AF37", marginBottom: "16px" }}>💡 Tattoo Tips</h3>
              <p style={{ fontSize: "0.85rem", color: "#9CA3AF", lineHeight: "1.7", margin: 0 }}>
                Always double-check your Roman numerals before getting inked! 
                Show your tattoo artist the original date alongside the converted numerals 
                to ensure accuracy.
              </p>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/roman-numeral-tattoo-generator" currentCategory="Converter" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "#2D2D2D", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.3)", border: "1px solid #D4AF37", padding: "32px", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#D4AF37", marginBottom: "24px" }}>
            Frequently Asked Questions
          </h2>
          <div>
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ padding: "16px", backgroundColor: "#2D2D2D", borderRadius: "8px", border: "1px solid #D4AF37" }}>
          <p style={{ fontSize: "0.75rem", color: "#D4AF37", textAlign: "center", margin: 0 }}>
            🏛️ <strong>Disclaimer:</strong> Always verify your Roman numeral conversion before getting a tattoo. 
            Show both the original date and the Roman numeral to your tattoo artist for confirmation.
          </p>
        </div>
      </div>
    </div>
  );
}
