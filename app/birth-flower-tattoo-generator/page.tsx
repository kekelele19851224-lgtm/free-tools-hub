"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// ============================================
// Birth Flower Database
// ============================================

interface BirthFlower {
  month: string;
  monthNum: number;
  flower: string;
  altFlower?: string;
  emoji: string;
  meaning: string[];
  colors: string[];
  placements: string[];
  description: string;
}

const birthFlowers: BirthFlower[] = [
  {
    month: "January",
    monthNum: 1,
    flower: "Carnation",
    altFlower: "Snowdrop",
    emoji: "🌸",
    meaning: ["Love", "Fascination", "Distinction", "Devotion"],
    colors: ["Pink", "Red", "White", "Purple"],
    placements: ["Wrist", "Ankle", "Shoulder", "Behind Ear"],
    description: "Carnations symbolize deep love and affection. They represent the strength and warmth needed to endure winter months."
  },
  {
    month: "February",
    monthNum: 2,
    flower: "Violet",
    altFlower: "Primrose",
    emoji: "💜",
    meaning: ["Faithfulness", "Humility", "Spiritual Wisdom", "Modesty"],
    colors: ["Purple", "Blue", "White", "Yellow"],
    placements: ["Wrist", "Ankle", "Collarbone", "Inner Arm"],
    description: "Violets represent faithfulness and virtue. Their delicate appearance makes them perfect for subtle, meaningful tattoos."
  },
  {
    month: "March",
    monthNum: 3,
    flower: "Daffodil",
    altFlower: "Jonquil",
    emoji: "🌷",
    meaning: ["New Beginnings", "Rebirth", "Hope", "Prosperity"],
    colors: ["Yellow", "White", "Orange", "Gold"],
    placements: ["Forearm", "Shoulder", "Ribcage", "Thigh"],
    description: "Daffodils herald the arrival of spring and symbolize new beginnings. They represent hope and the promise of renewal."
  },
  {
    month: "April",
    monthNum: 4,
    flower: "Daisy",
    altFlower: "Sweet Pea",
    emoji: "🌼",
    meaning: ["Innocence", "Purity", "True Love", "New Beginnings"],
    colors: ["White", "Yellow", "Pink", "Purple"],
    placements: ["Wrist", "Ankle", "Behind Ear", "Finger"],
    description: "Daisies represent innocence and purity. Their simple beauty makes them ideal for minimalist tattoo designs."
  },
  {
    month: "May",
    monthNum: 5,
    flower: "Lily of the Valley",
    altFlower: "Hawthorn",
    emoji: "🌿",
    meaning: ["Sweetness", "Humility", "Return of Happiness", "Motherhood"],
    colors: ["White", "Green", "Cream"],
    placements: ["Spine", "Ribcage", "Forearm", "Shoulder Blade"],
    description: "Lily of the Valley symbolizes the return of happiness. Its delicate bell-shaped flowers create elegant, flowing tattoo designs."
  },
  {
    month: "June",
    monthNum: 6,
    flower: "Rose",
    altFlower: "Honeysuckle",
    emoji: "🌹",
    meaning: ["Love", "Passion", "Beauty", "Romance"],
    colors: ["Red", "Pink", "White", "Yellow", "Orange"],
    placements: ["Forearm", "Shoulder", "Thigh", "Back", "Chest"],
    description: "Roses are timeless symbols of love and beauty. Different colors carry different meanings, from passionate love to friendship."
  },
  {
    month: "July",
    monthNum: 7,
    flower: "Larkspur",
    altFlower: "Water Lily",
    emoji: "💐",
    meaning: ["Positivity", "Dignity", "Grace", "Strong Bonds"],
    colors: ["Purple", "Blue", "Pink", "White"],
    placements: ["Spine", "Forearm", "Calf", "Upper Arm"],
    description: "Larkspur represents an open heart and strong bonds of love. Its tall, elegant spikes create stunning vertical tattoo designs."
  },
  {
    month: "August",
    monthNum: 8,
    flower: "Gladiolus",
    altFlower: "Poppy",
    emoji: "🌺",
    meaning: ["Strength", "Integrity", "Sincerity", "Honor"],
    colors: ["Red", "Pink", "Purple", "Yellow", "Orange"],
    placements: ["Forearm", "Calf", "Spine", "Side"],
    description: "Gladiolus symbolizes strength of character. The sword-shaped leaves represent moral integrity and sincerity."
  },
  {
    month: "September",
    monthNum: 9,
    flower: "Aster",
    altFlower: "Morning Glory",
    emoji: "⭐",
    meaning: ["Love", "Wisdom", "Faith", "Patience"],
    colors: ["Purple", "Pink", "Blue", "White"],
    placements: ["Wrist", "Ankle", "Shoulder", "Behind Ear"],
    description: "Asters symbolize wisdom and devotion. Star-shaped blooms represent love, elegance, and daintiness in tattoo form."
  },
  {
    month: "October",
    monthNum: 10,
    flower: "Marigold",
    altFlower: "Cosmos",
    emoji: "🏵️",
    meaning: ["Passion", "Creativity", "Warmth", "Positive Energy"],
    colors: ["Orange", "Yellow", "Red", "Gold"],
    placements: ["Forearm", "Shoulder", "Thigh", "Ankle"],
    description: "Marigolds represent the warmth of the sun and creative passion. Their bold colors make striking, vibrant tattoos."
  },
  {
    month: "November",
    monthNum: 11,
    flower: "Chrysanthemum",
    altFlower: "Peony",
    emoji: "🌻",
    meaning: ["Joy", "Longevity", "Loyalty", "Optimism"],
    colors: ["Yellow", "White", "Purple", "Red", "Orange"],
    placements: ["Back", "Thigh", "Shoulder", "Forearm"],
    description: "Chrysanthemums symbolize joy and longevity. In many cultures, they represent life, rebirth, and the beauty of autumn."
  },
  {
    month: "December",
    monthNum: 12,
    flower: "Poinsettia",
    altFlower: "Holly",
    emoji: "❄️",
    meaning: ["Celebration", "Success", "Good Cheer", "Purity"],
    colors: ["Red", "White", "Pink", "Cream"],
    placements: ["Shoulder", "Forearm", "Ribcage", "Back"],
    description: "Poinsettias symbolize good cheer and success. Their star-shaped leaves make beautiful, festive tattoo designs."
  }
];

// Tattoo styles
const tattooStyles: { [key: string]: { label: string; emoji: string; description: string } } = {
  minimalist: { label: "Minimalist", emoji: "✨", description: "Clean lines, simple design" },
  fineline: { label: "Fine Line", emoji: "〰️", description: "Delicate, detailed linework" },
  watercolor: { label: "Watercolor", emoji: "🎨", description: "Soft, flowing colors" },
  outline: { label: "Outline", emoji: "⭕", description: "Bold outlines only" },
  botanical: { label: "Botanical", emoji: "🌿", description: "Scientific, realistic style" },
  geometric: { label: "Geometric", emoji: "💎", description: "Mixed with geometric shapes" }
};

// FAQ data
const faqs = [
  {
    question: "What are the 12 birth month flowers?",
    answer: "The 12 birth month flowers are: January - Carnation, February - Violet, March - Daffodil, April - Daisy, May - Lily of the Valley, June - Rose, July - Larkspur, August - Gladiolus, September - Aster, October - Marigold, November - Chrysanthemum, and December - Poinsettia. Each flower carries unique symbolism and meaning."
  },
  {
    question: "What is the rarest birth flower?",
    answer: "Lily of the Valley (May) is often considered one of the rarest birth flowers because it only blooms for a short period in spring and is relatively difficult to cultivate. Its delicate bell-shaped flowers make it a highly sought-after choice for elegant, meaningful tattoos."
  },
  {
    question: "Can I combine multiple birth flowers in one tattoo?",
    answer: "Yes! Combining birth flowers is a beautiful way to honor multiple loved ones in a single design. Family birth flower bouquet tattoos are very popular, where you combine the birth flowers of family members, partners, or close friends into one cohesive design."
  },
  {
    question: "What does my birth flower mean?",
    answer: "Each birth flower carries specific symbolic meanings. For example, roses (June) represent love and passion, while daffodils (March) symbolize new beginnings. Use our generator to discover the full meaning of your birth flower and find the perfect design that resonates with you."
  },
  {
    question: "Where should I place a birth flower tattoo?",
    answer: "Popular placements include the wrist, ankle, forearm, shoulder blade, and behind the ear for smaller designs. For larger bouquet tattoos, consider the forearm, thigh, back, or ribcage. The best placement depends on the size of your design and how visible you want it to be."
  },
  {
    question: "How do I show this design to my tattoo artist?",
    answer: "You can copy the design details from our generator and share them with your tattoo artist. Include the flower name, style preference, meanings you want to incorporate, and any names or text. Professional tattoo artists can then create a custom design based on your preferences."
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

export default function BirthFlowerTattooGenerator() {
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [name, setName] = useState("");
  const [style, setStyle] = useState("minimalist");
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  // Toggle month selection
  const toggleMonth = (monthNum: number) => {
    if (selectedMonths.includes(monthNum)) {
      setSelectedMonths(selectedMonths.filter(m => m !== monthNum));
    } else {
      setSelectedMonths([...selectedMonths, monthNum].sort((a, b) => a - b));
    }
  };

  // Generate tattoo design
  const generateTattoo = () => {
    if (selectedMonths.length === 0) return;
    setGenerated(true);
    setCopied(false);
  };

  // Get selected flowers
  const getSelectedFlowers = () => {
    return birthFlowers.filter(f => selectedMonths.includes(f.monthNum));
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    const flowers = getSelectedFlowers();
    let text = `🌸 Birth Flower Tattoo Design\n\n`;
    text += `Style: ${tattooStyles[style].label}\n`;
    if (name) text += `Name: ${name}\n`;
    text += `\n--- Flowers ---\n`;
    flowers.forEach(f => {
      text += `\n${f.emoji} ${f.month} - ${f.flower}\n`;
      text += `Meaning: ${f.meaning.join(", ")}\n`;
      text += `Colors: ${f.colors.join(", ")}\n`;
      text += `Suggested Placement: ${f.placements.join(", ")}\n`;
    });
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const selectedFlowers = getSelectedFlowers();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FDF2F8" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #FBCFE8" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Birth Flower Tattoo Generator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "2.5rem" }}>🌸</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Birth Flower Tattoo Generator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Discover your birth flower and create a meaningful tattoo design. Combine multiple birth flowers 
            for a family bouquet tattoo with names.
          </p>
        </div>

        {/* Tip Box */}
        <div style={{
          backgroundColor: "#DB2777",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "white", margin: "0 0 4px 0" }}>
                <strong>Create Your Perfect Design</strong>
              </p>
              <p style={{ color: "#FBCFE8", margin: 0, fontSize: "0.95rem" }}>
                Select one month for your birth flower, or multiple months to create a family birth flower bouquet tattoo!
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
            border: "1px solid #FBCFE8",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#DB2777", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                🗓️ Select Birth Month(s)
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              {/* Month Selection */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                  Click to select one or more months
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                  {birthFlowers.map((flower) => (
                    <button
                      key={flower.monthNum}
                      onClick={() => toggleMonth(flower.monthNum)}
                      style={{
                        padding: "12px 8px",
                        borderRadius: "8px",
                        border: selectedMonths.includes(flower.monthNum) ? "2px solid #DB2777" : "1px solid #E5E7EB",
                        backgroundColor: selectedMonths.includes(flower.monthNum) ? "#FDF2F8" : "white",
                        cursor: "pointer",
                        textAlign: "center"
                      }}
                    >
                      <div style={{ fontSize: "1.2rem", marginBottom: "4px" }}>{flower.emoji}</div>
                      <div style={{ 
                        fontSize: "0.75rem", 
                        fontWeight: selectedMonths.includes(flower.monthNum) ? "600" : "400",
                        color: selectedMonths.includes(flower.monthNum) ? "#DB2777" : "#4B5563"
                      }}>
                        {flower.month.slice(0, 3)}
                      </div>
                    </button>
                  ))}
                </div>
                {selectedMonths.length > 0 && (
                  <p style={{ fontSize: "0.85rem", color: "#DB2777", marginTop: "8px", marginBottom: 0 }}>
                    {selectedMonths.length === 1 ? "1 month selected" : `${selectedMonths.length} months selected (Bouquet)`}
                  </p>
                )}
              </div>

              {/* Name Input */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                  ✏️ Add Name (Optional)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Sarah, Mom & Dad, Family"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              {/* Style Selection */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                  🎨 Tattoo Style
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                  {Object.entries(tattooStyles).map(([key, { label, emoji, description }]) => (
                    <button
                      key={key}
                      onClick={() => setStyle(key)}
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        border: style === key ? "2px solid #DB2777" : "1px solid #E5E7EB",
                        backgroundColor: style === key ? "#FDF2F8" : "white",
                        cursor: "pointer",
                        textAlign: "left"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                        <span>{emoji}</span>
                        <span style={{ 
                          fontWeight: style === key ? "600" : "400",
                          color: style === key ? "#DB2777" : "#374151",
                          fontSize: "0.85rem"
                        }}>
                          {label}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "#9CA3AF" }}>
                        {description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateTattoo}
                disabled={selectedMonths.length === 0}
                style={{
                  width: "100%",
                  padding: "16px",
                  backgroundColor: selectedMonths.length === 0 ? "#E5E7EB" : "#DB2777",
                  color: selectedMonths.length === 0 ? "#9CA3AF" : "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  cursor: selectedMonths.length === 0 ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                🌸 Generate Birth Flower Tattoo
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="calc-results" style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #FBCFE8",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#BE185D", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                🌷 Your Tattoo Design
              </h2>
            </div>

            <div style={{ padding: "24px", maxHeight: "600px", overflowY: "auto" }}>
              {!generated || selectedMonths.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#6B7280" }}>
                  <p style={{ fontSize: "3rem", margin: "0 0 12px 0" }}>🌸</p>
                  <p style={{ margin: 0 }}>Select your birth month(s) and click Generate</p>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem" }}>Discover your birth flower and its meaning</p>
                </div>
              ) : (
                <div>
                  {/* Design Preview */}
                  <div style={{
                    backgroundColor: "#FDF2F8",
                    borderRadius: "12px",
                    padding: "24px",
                    textAlign: "center",
                    marginBottom: "20px",
                    border: "2px dashed #FBCFE8"
                  }}>
                    {/* Flower Emojis with Style Effects */}
                    <div style={{
                      fontSize: "3rem",
                      marginBottom: "16px",
                      letterSpacing: "8px",
                      filter: style === "minimalist" ? "grayscale(100%)" :
                              style === "watercolor" ? "blur(1px) saturate(1.5)" :
                              style === "outline" ? "contrast(2) brightness(1.1)" :
                              style === "botanical" ? "sepia(30%) saturate(1.2)" :
                              "none",
                      opacity: style === "minimalist" ? 0.8 : 1,
                      transition: "all 0.3s ease"
                    }}>
                      {selectedFlowers.map(f => f.emoji).join("")}
                    </div>

                    {/* Style-specific visual frame */}
                    {style === "geometric" && (
                      <div style={{
                        position: "relative",
                        display: "inline-block",
                        padding: "20px 40px",
                        marginBottom: "16px"
                      }}>
                        <div style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          border: "2px solid #DB2777",
                          transform: "rotate(45deg)",
                          borderRadius: "4px"
                        }} />
                        <div style={{
                          position: "absolute",
                          top: "-5px",
                          left: "-5px",
                          right: "-5px",
                          bottom: "-5px",
                          border: "1px solid #F9A8D4",
                          borderRadius: "50%"
                        }} />
                      </div>
                    )}

                    {/* Flower Names */}
                    <div style={{
                      fontSize: "1.25rem",
                      fontWeight: "600",
                      color: "#BE185D",
                      marginBottom: "8px",
                      fontFamily: style === "botanical" ? "Georgia, serif" : "inherit",
                      letterSpacing: style === "minimalist" ? "2px" : "normal",
                      textTransform: style === "minimalist" ? "uppercase" : "none"
                    }}>
                      {selectedFlowers.length === 1 
                        ? `${selectedFlowers[0].month} - ${selectedFlowers[0].flower}`
                        : "Birth Flower Bouquet"
                      }
                    </div>

                    {/* Name if provided */}
                    {name && (
                      <div style={{
                        fontFamily: style === "fineline" || style === "botanical" ? "Georgia, serif" :
                                    style === "minimalist" ? "Arial, sans-serif" : "Georgia, serif",
                        fontStyle: style === "minimalist" ? "normal" : "italic",
                        fontSize: style === "minimalist" ? "1.2rem" : "1.5rem",
                        fontWeight: style === "minimalist" ? "300" : "400",
                        color: "#DB2777",
                        margin: "16px 0",
                        letterSpacing: style === "minimalist" ? "4px" : "normal",
                        textTransform: style === "minimalist" ? "lowercase" : "none"
                      }}>
                        {style === "minimalist" ? name : `~ ${name} ~`}
                      </div>
                    )}

                    {/* Style Badge */}
                    <span style={{
                      display: "inline-block",
                      padding: "6px 16px",
                      backgroundColor: "#DB2777",
                      color: "white",
                      borderRadius: style === "geometric" ? "0" : "20px",
                      fontSize: "0.8rem",
                      fontWeight: "500",
                      border: style === "outline" ? "2px solid white" : "none",
                      boxShadow: style === "watercolor" ? "0 4px 15px rgba(219, 39, 119, 0.4)" : "none"
                    }}>
                      {tattooStyles[style].emoji} {tattooStyles[style].label} Style
                    </span>

                    {/* Style Preview Description */}
                    <p style={{
                      fontSize: "0.75rem",
                      color: "#9CA3AF",
                      marginTop: "12px",
                      marginBottom: 0,
                      fontStyle: "italic"
                    }}>
                      {style === "minimalist" && "Clean, simple lines with minimal detail"}
                      {style === "fineline" && "Delicate linework with subtle shading"}
                      {style === "watercolor" && "Soft, flowing colors like a painting"}
                      {style === "outline" && "Bold outlines with high contrast"}
                      {style === "botanical" && "Scientific illustration style"}
                      {style === "geometric" && "Flowers with geometric shapes"}
                    </p>
                  </div>

                  {/* Flower Details */}
                  {selectedFlowers.map((flower, index) => (
                    <div 
                      key={flower.monthNum}
                      style={{
                        padding: "16px",
                        backgroundColor: index % 2 === 0 ? "#FEFCE8" : "#F0FDF4",
                        borderRadius: "12px",
                        marginBottom: "12px",
                        border: "1px solid #E5E7EB"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                        <span style={{ fontSize: "1.5rem" }}>{flower.emoji}</span>
                        <div>
                          <h4 style={{ margin: 0, color: "#111827", fontWeight: "600" }}>
                            {flower.month} - {flower.flower}
                          </h4>
                          {flower.altFlower && (
                            <span style={{ fontSize: "0.8rem", color: "#6B7280" }}>
                              Alt: {flower.altFlower}
                            </span>
                          )}
                        </div>
                      </div>

                      <p style={{ fontSize: "0.85rem", color: "#4B5563", margin: "0 0 12px 0", lineHeight: "1.5" }}>
                        {flower.description}
                      </p>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "0.8rem" }}>
                        <div>
                          <strong style={{ color: "#6B7280" }}>Meaning:</strong>
                          <div style={{ color: "#374151", marginTop: "4px" }}>
                            {flower.meaning.join(", ")}
                          </div>
                        </div>
                        <div>
                          <strong style={{ color: "#6B7280" }}>Colors:</strong>
                          <div style={{ color: "#374151", marginTop: "4px" }}>
                            {flower.colors.join(", ")}
                          </div>
                        </div>
                      </div>

                      <div style={{ marginTop: "12px", fontSize: "0.8rem" }}>
                        <strong style={{ color: "#6B7280" }}>Best Placements:</strong>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "6px" }}>
                          {flower.placements.map((place, i) => (
                            <span 
                              key={i}
                              style={{
                                padding: "4px 10px",
                                backgroundColor: "white",
                                borderRadius: "4px",
                                fontSize: "0.75rem",
                                color: "#6B7280",
                                border: "1px solid #E5E7EB"
                              }}
                            >
                              {place}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                    <button
                      onClick={copyToClipboard}
                      style={{
                        flex: 1,
                        padding: "12px",
                        backgroundColor: copied ? "#10B981" : "#DB2777",
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
                      {copied ? "✓ Copied!" : "📋 Copy Details"}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedMonths([]);
                        setName("");
                        setGenerated(false);
                      }}
                      style={{
                        flex: 1,
                        padding: "12px",
                        backgroundColor: "transparent",
                        color: "#DB2777",
                        border: "2px solid #FBCFE8",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        fontWeight: "500",
                        cursor: "pointer"
                      }}
                    >
                      🔄 Start Over
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Birth Flowers Reference Table */}
        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "16px", 
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)", 
          border: "1px solid #FBCFE8", 
          padding: "32px",
          marginBottom: "32px"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
            🌸 The 12 Birth Month Flowers
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#FDF2F8" }}>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #FBCFE8" }}>Month</th>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #FBCFE8" }}>Flower</th>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #FBCFE8" }}>Meaning</th>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #FBCFE8" }}>Colors</th>
                </tr>
              </thead>
              <tbody>
                {birthFlowers.map((flower, index) => (
                  <tr key={flower.monthNum} style={{ backgroundColor: index % 2 === 0 ? "white" : "#FEFCE8" }}>
                    <td style={{ padding: "12px", borderBottom: "1px solid #E5E7EB" }}>
                      <span style={{ marginRight: "8px" }}>{flower.emoji}</span>
                      {flower.month}
                    </td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #E5E7EB", fontWeight: "500" }}>
                      {flower.flower}
                    </td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #E5E7EB", color: "#6B7280" }}>
                      {flower.meaning.slice(0, 2).join(", ")}
                    </td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #E5E7EB", color: "#6B7280" }}>
                      {flower.colors.slice(0, 3).join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #FBCFE8", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
                🌷 Birth Flower Tattoo Ideas & Inspiration
              </h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  Birth flower tattoos are a beautiful way to celebrate your identity, honor loved ones, or mark significant 
                  life events. Each month has a designated flower with unique symbolism, making these tattoos deeply personal 
                  and meaningful.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Popular Birth Flower Tattoo Styles</h3>
                <div style={{
                  backgroundColor: "#FDF2F8",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #FBCFE8"
                }}>
                  <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "2" }}>
                    <li><strong>Minimalist:</strong> Clean, simple lines perfect for small placements</li>
                    <li><strong>Fine Line:</strong> Delicate, detailed work that ages beautifully</li>
                    <li><strong>Watercolor:</strong> Soft, flowing colors that mimic paintings</li>
                    <li><strong>Botanical:</strong> Realistic, scientific illustration style</li>
                    <li><strong>Geometric:</strong> Flowers combined with geometric shapes</li>
                  </ul>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Family Birth Flower Bouquet Ideas</h3>
                <p>
                  One of the most meaningful ways to use birth flowers is creating a family bouquet tattoo. 
                  Combine the birth flowers of your children, parents, siblings, or partner into one beautiful design. 
                  You can also add names, dates, or initials to personalize it further.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", margin: "16px 0" }}>
                  <div style={{ padding: "16px", backgroundColor: "#F0FDF4", borderRadius: "8px", border: "1px solid #86EFAC" }}>
                    <strong>👨‍👩‍👧‍👦 Family Bouquet</strong>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#166534" }}>
                      Combine each family member&apos;s birth flower
                    </p>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#FEF3C7", borderRadius: "8px", border: "1px solid #FCD34D" }}>
                    <strong>💑 Couple Tattoo</strong>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#92400E" }}>
                      Your birth flower + partner&apos;s birth flower
                    </p>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#EFF6FF", borderRadius: "8px", border: "1px solid #93C5FD" }}>
                    <strong>👶 Children&apos;s Flowers</strong>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#1E40AF" }}>
                      Honor your kids with their birth flowers
                    </p>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#FDF2F8", borderRadius: "8px", border: "1px solid #F9A8D4" }}>
                    <strong>🎂 Memorial Tattoo</strong>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#BE185D" }}>
                      Remember loved ones with their birth flower
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Placement Guide */}
            <div style={{ backgroundColor: "#DB2777", borderRadius: "16px", padding: "24px", marginBottom: "24px", color: "white" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "16px" }}>📍 Popular Placements</h3>
              <div style={{ fontSize: "0.85rem", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>• Wrist - Small, visible</p>
                <p style={{ margin: "0 0 8px 0" }}>• Ankle - Delicate, feminine</p>
                <p style={{ margin: "0 0 8px 0" }}>• Forearm - Medium size</p>
                <p style={{ margin: "0 0 8px 0" }}>• Shoulder - Easy to cover</p>
                <p style={{ margin: "0 0 8px 0" }}>• Ribcage - Large designs</p>
                <p style={{ margin: 0 }}>• Behind Ear - Subtle, hidden</p>
              </div>
            </div>

            {/* Tips */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "16px" }}>💡 Tattoo Tips</h3>
              <div style={{ fontSize: "0.85rem", color: "#B45309", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>• Research your artist&apos;s style</p>
                <p style={{ margin: "0 0 8px 0" }}>• Consider size vs placement</p>
                <p style={{ margin: "0 0 8px 0" }}>• Fine lines age differently</p>
                <p style={{ margin: "0 0 8px 0" }}>• Black ink lasts longest</p>
                <p style={{ margin: 0 }}>• Share design details clearly</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/birth-flower-tattoo-generator" currentCategory="Entertainment" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #FBCFE8", padding: "32px", marginBottom: "24px" }}>
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
        <div style={{ padding: "16px", backgroundColor: "#FDF2F8", borderRadius: "8px", border: "1px solid #FBCFE8" }}>
          <p style={{ fontSize: "0.75rem", color: "#BE185D", textAlign: "center", margin: 0 }}>
            🌸 <strong>Note:</strong> This generator provides birth flower information and design inspiration. 
            For actual tattoo artwork, please consult with a professional tattoo artist who can create a custom design for you.
          </p>
        </div>
      </div>
    </div>
  );
}
