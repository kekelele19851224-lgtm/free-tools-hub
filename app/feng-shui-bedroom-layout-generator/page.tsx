"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Position types
type Position = "top" | "bottom" | "left" | "right";

// Bed position evaluation
interface BedPosition {
  id: string;
  x: number;
  y: number;
  label: string;
  score: number;
  issues: string[];
  isCommand: boolean;
}

// FAQ data
const faqs = [
  {
    question: "What is the command position in feng shui?",
    answer: "The command position is the most powerful placement for your bed. It means you can see the door while lying in bed, but you're not directly in line with it. Your bed should have a solid wall behind the headboard, and ideally have space on both sides. This position gives you a sense of security and control, allowing for better rest and more positive energy flow."
  },
  {
    question: "Why shouldn't my bed face the door directly?",
    answer: "In feng shui, having your bed directly in line with the door is called the 'coffin position' or 'death position' because it resembles how the deceased are carried out feet-first. This position exposes you to harsh energy (chi) rushing through the door, leading to restless sleep, anxiety, and depleted energy. Always position your bed so you can see the door but aren't directly aligned with it."
  },
  {
    question: "Can I have a mirror facing my bed?",
    answer: "Feng shui advises against mirrors facing the bed. Mirrors are believed to bounce energy around the room, which can disturb sleep and cause restlessness. Some traditions also believe mirrors can attract a third party into relationships. If you must have a mirror in the bedroom, position it so you can't see your reflection while lying in bed, or cover it at night."
  },
  {
    question: "What's the best direction for my bed to face?",
    answer: "The ideal bed direction varies by individual based on your Kua number in feng shui. However, general guidelines suggest: facing East promotes health and family harmony, facing Southeast attracts wealth, facing South enhances fame and recognition, and facing Southwest strengthens love and relationships. Avoid having your head pointing toward the door or window."
  },
  {
    question: "Is it bad feng shui to have my bed under a window?",
    answer: "Yes, placing your bed under a window is considered poor feng shui. Windows allow chi to flow in and out, creating instability behind your head while you sleep. This can lead to restless sleep, health issues, and a lack of support in life. If unavoidable, use heavy curtains, a solid headboard, and keep windows closed at night to minimize the negative effects."
  },
  {
    question: "What should I avoid storing under my bed?",
    answer: "For good feng shui, keep the area under your bed clear to allow chi to circulate freely. Avoid storing: shoes (carry negative energy from outside), old items or clutter (stagnant energy), work-related items (disrupts rest), exercise equipment (too active), and anything sharp or broken. If storage is necessary, stick to soft items like clean linens or off-season clothing."
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

export default function FengShuiBedroomLayoutGenerator() {
  // Input state
  const [doorPosition, setDoorPosition] = useState<Position>("bottom");
  const [windowPositions, setWindowPositions] = useState<Position[]>(["top"]);
  const [hasBathroomDoor, setHasBathroomDoor] = useState<boolean>(false);
  const [bathroomPosition, setBathroomPosition] = useState<Position>("right");
  const [hasMirror, setHasMirror] = useState<boolean>(false);
  const [hasBeam, setHasBeam] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);

  // Toggle window position
  const toggleWindow = (pos: Position) => {
    setWindowPositions(prev =>
      prev.includes(pos)
        ? prev.filter(p => p !== pos)
        : [...prev, pos]
    );
  };

  // Calculate bed positions and scores
  const bedAnalysis = useMemo(() => {
    if (!showResults) return null;

    // Define 9 possible bed positions (3x3 grid, excluding center)
    const positions: BedPosition[] = [
      { id: "top-left", x: 15, y: 15, label: "Top Left", score: 100, issues: [], isCommand: false },
      { id: "top-center", x: 50, y: 15, label: "Top Center", score: 100, issues: [], isCommand: false },
      { id: "top-right", x: 85, y: 15, label: "Top Right", score: 100, issues: [], isCommand: false },
      { id: "middle-left", x: 15, y: 50, label: "Middle Left", score: 100, issues: [], isCommand: false },
      { id: "middle-right", x: 85, y: 50, label: "Middle Right", score: 100, issues: [], isCommand: false },
      { id: "bottom-left", x: 15, y: 85, label: "Bottom Left", score: 100, issues: [], isCommand: false },
      { id: "bottom-center", x: 50, y: 85, label: "Bottom Center", score: 100, issues: [], isCommand: false },
      { id: "bottom-right", x: 85, y: 85, label: "Bottom Right", score: 100, issues: [], isCommand: false },
    ];

    // Apply feng shui rules
    positions.forEach(pos => {
      // Rule 1: Directly in line with door (coffin position) - major penalty
      if (doorPosition === "bottom" && pos.id.includes("bottom-center")) {
        pos.score -= 50;
        pos.issues.push("Directly in line with door (coffin position)");
      }
      if (doorPosition === "top" && pos.id.includes("top-center")) {
        pos.score -= 50;
        pos.issues.push("Directly in line with door (coffin position)");
      }
      if (doorPosition === "left" && pos.id.includes("middle-left")) {
        pos.score -= 50;
        pos.issues.push("Directly in line with door (coffin position)");
      }
      if (doorPosition === "right" && pos.id.includes("middle-right")) {
        pos.score -= 50;
        pos.issues.push("Directly in line with door (coffin position)");
      }

      // Rule 2: Too close to door - penalty
      if (doorPosition === "bottom" && pos.id.includes("bottom")) {
        pos.score -= 20;
        pos.issues.push("Too close to door");
      }
      if (doorPosition === "top" && pos.id.includes("top")) {
        pos.score -= 20;
        pos.issues.push("Too close to door");
      }
      if (doorPosition === "left" && pos.id.includes("left")) {
        pos.score -= 20;
        pos.issues.push("Too close to door");
      }
      if (doorPosition === "right" && pos.id.includes("right")) {
        pos.score -= 20;
        pos.issues.push("Too close to door");
      }

      // Rule 3: Under window - penalty
      windowPositions.forEach(winPos => {
        if (winPos === "top" && pos.id.includes("top")) {
          pos.score -= 25;
          pos.issues.push("Headboard under window");
        }
        if (winPos === "bottom" && pos.id.includes("bottom")) {
          pos.score -= 15;
          pos.issues.push("Feet facing window");
        }
        if (winPos === "left" && pos.id.includes("left")) {
          pos.score -= 15;
          pos.issues.push("Side exposed to window");
        }
        if (winPos === "right" && pos.id.includes("right")) {
          pos.score -= 15;
          pos.issues.push("Side exposed to window");
        }
      });

      // Rule 4: Near bathroom door - penalty
      if (hasBathroomDoor) {
        if (bathroomPosition === "top" && pos.id.includes("top")) {
          pos.score -= 20;
          pos.issues.push("Near bathroom door (negative energy)");
        }
        if (bathroomPosition === "bottom" && pos.id.includes("bottom")) {
          pos.score -= 20;
          pos.issues.push("Near bathroom door (negative energy)");
        }
        if (bathroomPosition === "left" && pos.id.includes("left")) {
          pos.score -= 20;
          pos.issues.push("Near bathroom door (negative energy)");
        }
        if (bathroomPosition === "right" && pos.id.includes("right")) {
          pos.score -= 20;
          pos.issues.push("Near bathroom door (negative energy)");
        }
      }

      // Rule 5: Command position bonus - can see door, solid wall behind, not in line
      const canSeeDoor = (
        (doorPosition === "bottom" && !pos.id.includes("top")) ||
        (doorPosition === "top" && !pos.id.includes("bottom")) ||
        (doorPosition === "left" && !pos.id.includes("right")) ||
        (doorPosition === "right" && !pos.id.includes("left"))
      );
      
      const hasWallBehind = (
        pos.id.includes("top") || 
        pos.id.includes("left") || 
        pos.id.includes("right")
      );

      const notInLine = !pos.issues.some(i => i.includes("coffin"));

      if (canSeeDoor && hasWallBehind && notInLine && pos.score >= 60) {
        pos.isCommand = true;
        pos.score += 15;
      }

      // Cap score
      pos.score = Math.max(0, Math.min(100, pos.score));
    });

    // Sort by score
    const sortedPositions = [...positions].sort((a, b) => b.score - a.score);
    const bestPosition = sortedPositions[0];
    const worstPositions = sortedPositions.filter(p => p.score < 50);

    // Overall score
    let overallScore = bestPosition.score;
    if (hasMirror) overallScore -= 10;
    if (hasBeam) overallScore -= 15;
    overallScore = Math.max(0, Math.min(100, overallScore));

    return {
      positions,
      bestPosition,
      worstPositions,
      overallScore,
      tips: generateTips(doorPosition, windowPositions, hasBathroomDoor, hasMirror, hasBeam)
    };
  }, [showResults, doorPosition, windowPositions, hasBathroomDoor, bathroomPosition, hasMirror, hasBeam]);

  // Generate tips
  function generateTips(door: Position, windows: Position[], bathroom: boolean, mirror: boolean, beam: boolean): string[] {
    const tips: string[] = [];
    
    // Best position tip based on door
    if (door === "bottom") {
      tips.push("Place your bed in the top corners of the room, diagonally from the door for the command position.");
    } else if (door === "top") {
      tips.push("Place your bed in the bottom corners, ensuring you can see the door from bed.");
    } else if (door === "left") {
      tips.push("Position your bed on the right side of the room with a view of the door.");
    } else {
      tips.push("Position your bed on the left side of the room with a view of the door.");
    }

    if (windows.includes("top")) {
      tips.push("Avoid placing headboard against the window wall. Use heavy curtains if unavoidable.");
    }

    if (bathroom) {
      tips.push("Keep bathroom door closed at night. Consider placing a plant near the bathroom door to absorb negative energy.");
    }

    if (mirror) {
      tips.push("Cover or reposition mirrors so you can't see your reflection while lying in bed.");
    }

    if (beam) {
      tips.push("Avoid sleeping directly under a beam. Use a canopy bed or hang two bamboo flutes to remedy beam energy.");
    }

    tips.push("Use pairs of items (nightstands, lamps) on both sides of the bed for balanced energy.");
    tips.push("Choose calming colors: soft blues, greens, earth tones, or gentle pinks for romance.");

    return tips;
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#059669";
    if (score >= 60) return "#D97706";
    return "#DC2626";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Poor";
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Feng Shui Bedroom Layout Generator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🔮</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Feng Shui Bedroom Layout Generator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Generate the optimal bed placement for your bedroom based on feng shui principles. Simply select your door and window positions to get personalized recommendations.
          </p>
        </div>

        {/* Main Calculator */}
        <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
          {/* Input Section */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #E5E7EB",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#7C3AED", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🚪 Room Setup</h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {/* Door Position */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.95rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                  Where is your main door?
                </label>
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gridTemplateRows: "auto auto auto",
                  gap: "8px",
                  maxWidth: "240px",
                  margin: "0 auto"
                }}>
                  <div></div>
                  <button
                    onClick={() => setDoorPosition("top")}
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      border: doorPosition === "top" ? "2px solid #7C3AED" : "1px solid #D1D5DB",
                      backgroundColor: doorPosition === "top" ? "#F5F3FF" : "white",
                      color: doorPosition === "top" ? "#7C3AED" : "#374151",
                      cursor: "pointer",
                      fontWeight: "600"
                    }}
                  >
                    🚪 Top
                  </button>
                  <div></div>
                  
                  <button
                    onClick={() => setDoorPosition("left")}
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      border: doorPosition === "left" ? "2px solid #7C3AED" : "1px solid #D1D5DB",
                      backgroundColor: doorPosition === "left" ? "#F5F3FF" : "white",
                      color: doorPosition === "left" ? "#7C3AED" : "#374151",
                      cursor: "pointer",
                      fontWeight: "600"
                    }}
                  >
                    🚪 Left
                  </button>
                  <div style={{ 
                    backgroundColor: "#F3F4F6", 
                    borderRadius: "8px", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    fontSize: "0.8rem",
                    color: "#6B7280"
                  }}>
                    Room
                  </div>
                  <button
                    onClick={() => setDoorPosition("right")}
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      border: doorPosition === "right" ? "2px solid #7C3AED" : "1px solid #D1D5DB",
                      backgroundColor: doorPosition === "right" ? "#F5F3FF" : "white",
                      color: doorPosition === "right" ? "#7C3AED" : "#374151",
                      cursor: "pointer",
                      fontWeight: "600"
                    }}
                  >
                    🚪 Right
                  </button>
                  
                  <div></div>
                  <button
                    onClick={() => setDoorPosition("bottom")}
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      border: doorPosition === "bottom" ? "2px solid #7C3AED" : "1px solid #D1D5DB",
                      backgroundColor: doorPosition === "bottom" ? "#F5F3FF" : "white",
                      color: doorPosition === "bottom" ? "#7C3AED" : "#374151",
                      cursor: "pointer",
                      fontWeight: "600"
                    }}
                  >
                    🚪 Bottom
                  </button>
                  <div></div>
                </div>
              </div>

              {/* Window Positions */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.95rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                  Where are your windows? (Select all)
                </label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
                  {(["top", "bottom", "left", "right"] as Position[]).map((pos) => (
                    <button
                      key={pos}
                      onClick={() => toggleWindow(pos)}
                      style={{
                        padding: "10px 20px",
                        borderRadius: "8px",
                        border: windowPositions.includes(pos) ? "2px solid #0EA5E9" : "1px solid #D1D5DB",
                        backgroundColor: windowPositions.includes(pos) ? "#E0F2FE" : "white",
                        color: windowPositions.includes(pos) ? "#0369A1" : "#374151",
                        cursor: "pointer",
                        fontWeight: "500"
                      }}
                    >
                      🪟 {pos.charAt(0).toUpperCase() + pos.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bathroom Door */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={hasBathroomDoor}
                    onChange={(e) => setHasBathroomDoor(e.target.checked)}
                    style={{ width: "20px", height: "20px" }}
                  />
                  <span style={{ fontSize: "0.95rem", color: "#374151", fontWeight: "500" }}>
                    🚽 Has attached bathroom
                  </span>
                </label>
                {hasBathroomDoor && (
                  <div style={{ marginTop: "12px", marginLeft: "32px" }}>
                    <select
                      value={bathroomPosition}
                      onChange={(e) => setBathroomPosition(e.target.value as Position)}
                      style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "0.9rem" }}
                    >
                      <option value="top">Top wall</option>
                      <option value="bottom">Bottom wall</option>
                      <option value="left">Left wall</option>
                      <option value="right">Right wall</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Mirror */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={hasMirror}
                    onChange={(e) => setHasMirror(e.target.checked)}
                    style={{ width: "20px", height: "20px" }}
                  />
                  <span style={{ fontSize: "0.95rem", color: "#374151", fontWeight: "500" }}>
                    🪞 Has mirror in bedroom
                  </span>
                </label>
              </div>

              {/* Beam */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={hasBeam}
                    onChange={(e) => setHasBeam(e.target.checked)}
                    style={{ width: "20px", height: "20px" }}
                  />
                  <span style={{ fontSize: "0.95rem", color: "#374151", fontWeight: "500" }}>
                    🏗️ Has ceiling beam
                  </span>
                </label>
              </div>

              {/* Generate Button */}
              <button
                onClick={() => setShowResults(true)}
                style={{
                  width: "100%",
                  padding: "16px",
                  backgroundColor: "#7C3AED",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                🔮 Generate Feng Shui Layout
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="calc-results" style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #E5E7EB",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🛏️ Recommended Layout</h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {bedAnalysis ? (
                <>
                  {/* Visual Room Layout */}
                  <div style={{ 
                    position: "relative",
                    width: "100%",
                    paddingTop: "100%",
                    backgroundColor: "#F9FAFB",
                    borderRadius: "12px",
                    border: "2px solid #E5E7EB",
                    marginBottom: "20px"
                  }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
                      {/* Door indicator */}
                      <div style={{
                        position: "absolute",
                        ...(doorPosition === "top" ? { top: 0, left: "50%", transform: "translateX(-50%)" } : {}),
                        ...(doorPosition === "bottom" ? { bottom: 0, left: "50%", transform: "translateX(-50%)" } : {}),
                        ...(doorPosition === "left" ? { left: 0, top: "50%", transform: "translateY(-50%)" } : {}),
                        ...(doorPosition === "right" ? { right: 0, top: "50%", transform: "translateY(-50%)" } : {}),
                        backgroundColor: "#7C3AED",
                        color: "white",
                        padding: "4px 12px",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        fontWeight: "600"
                      }}>
                        🚪 Door
                      </div>

                      {/* Window indicators */}
                      {windowPositions.map((pos) => (
                        <div key={pos} style={{
                          position: "absolute",
                          ...(pos === "top" ? { top: 0, left: "20%", } : {}),
                          ...(pos === "bottom" ? { bottom: 0, left: "20%" } : {}),
                          ...(pos === "left" ? { left: 0, top: "20%" } : {}),
                          ...(pos === "right" ? { right: 0, top: "20%" } : {}),
                          backgroundColor: "#0EA5E9",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "0.7rem",
                          fontWeight: "600"
                        }}>
                          🪟
                        </div>
                      ))}

                      {/* Bed positions */}
                      {bedAnalysis.positions.map((pos) => (
                        <div
                          key={pos.id}
                          style={{
                            position: "absolute",
                            left: `${pos.x}%`,
                            top: `${pos.y}%`,
                            transform: "translate(-50%, -50%)",
                            width: "60px",
                            height: "40px",
                            backgroundColor: pos.isCommand ? "#059669" : pos.score >= 60 ? "#FCD34D" : "#FEE2E2",
                            border: pos.isCommand ? "3px solid #047857" : pos.score >= 60 ? "2px solid #F59E0B" : "2px solid #EF4444",
                            borderRadius: "6px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.65rem",
                            fontWeight: "600",
                            color: pos.isCommand ? "white" : "#374151"
                          }}
                        >
                          <span>🛏️</span>
                          <span>{pos.score}</span>
                        </div>
                      ))}

                      {/* Legend */}
                      <div style={{
                        position: "absolute",
                        bottom: "8px",
                        right: "8px",
                        backgroundColor: "rgba(255,255,255,0.95)",
                        padding: "8px",
                        borderRadius: "6px",
                        fontSize: "0.65rem"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px" }}>
                          <div style={{ width: "12px", height: "12px", backgroundColor: "#059669", borderRadius: "2px" }}></div>
                          <span>Command Position</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px" }}>
                          <div style={{ width: "12px", height: "12px", backgroundColor: "#FCD34D", borderRadius: "2px" }}></div>
                          <span>Good</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <div style={{ width: "12px", height: "12px", backgroundColor: "#FEE2E2", borderRadius: "2px" }}></div>
                          <span>Avoid</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div style={{ 
                    backgroundColor: "#F5F3FF", 
                    padding: "16px", 
                    borderRadius: "12px", 
                    textAlign: "center",
                    marginBottom: "16px"
                  }}>
                    <p style={{ fontSize: "0.8rem", color: "#6B7280", marginBottom: "4px" }}>Best Position Score</p>
                    <p style={{ 
                      fontSize: "2.5rem", 
                      fontWeight: "bold", 
                      color: getScoreColor(bedAnalysis.bestPosition.score),
                      margin: "0 0 4px 0"
                    }}>
                      {bedAnalysis.bestPosition.score}/100
                    </p>
                    <p style={{ 
                      fontSize: "0.9rem", 
                      color: getScoreColor(bedAnalysis.bestPosition.score),
                      fontWeight: "600",
                      margin: 0
                    }}>
                      {getScoreLabel(bedAnalysis.bestPosition.score)} Feng Shui
                    </p>
                  </div>

                  {/* Best Position */}
                  <div style={{ backgroundColor: "#ECFDF5", padding: "16px", borderRadius: "12px", marginBottom: "16px", border: "1px solid #A7F3D0" }}>
                    <h4 style={{ color: "#065F46", margin: "0 0 8px 0", fontSize: "0.95rem" }}>✅ Best Bed Position</h4>
                    <p style={{ color: "#047857", margin: 0, fontWeight: "600" }}>
                      {bedAnalysis.bestPosition.label}
                      {bedAnalysis.bestPosition.isCommand && " (Command Position)"}
                    </p>
                  </div>

                  {/* Issues to avoid */}
                  {bedAnalysis.worstPositions.length > 0 && (
                    <div style={{ backgroundColor: "#FEF2F2", padding: "16px", borderRadius: "12px", border: "1px solid #FECACA" }}>
                      <h4 style={{ color: "#991B1B", margin: "0 0 8px 0", fontSize: "0.95rem" }}>❌ Positions to Avoid</h4>
                      {bedAnalysis.worstPositions.slice(0, 3).map((pos) => (
                        <div key={pos.id} style={{ marginBottom: "8px" }}>
                          <p style={{ color: "#DC2626", fontWeight: "600", margin: "0 0 4px 0", fontSize: "0.85rem" }}>
                            {pos.label} ({pos.score}/100)
                          </p>
                          <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.8rem", color: "#7F1D1D" }}>
                            {pos.issues.map((issue, idx) => (
                              <li key={idx}>{issue}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#9CA3AF" }}>
                  <span style={{ fontSize: "4rem" }}>🔮</span>
                  <p style={{ marginTop: "16px" }}>Select your room details and click &quot;Generate&quot; to see feng shui recommendations</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tips Section */}
        {bedAnalysis && (
          <div style={{ 
            backgroundColor: "white", 
            borderRadius: "16px", 
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)", 
            border: "1px solid #E5E7EB", 
            padding: "32px",
            marginBottom: "40px"
          }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>💡 Personalized Feng Shui Tips</h2>
            <div style={{ display: "grid", gap: "12px" }}>
              {bedAnalysis.tips.map((tip, idx) => (
                <div key={idx} style={{ display: "flex", gap: "12px", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <span style={{ color: "#7C3AED", fontWeight: "bold" }}>✦</span>
                  <p style={{ margin: 0, color: "#374151", fontSize: "0.95rem" }}>{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            {/* Command Position Explained */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>🎯 The Command Position</h2>
              <p style={{ color: "#4B5563", lineHeight: "1.7", marginBottom: "16px" }}>
                The command position is the cornerstone of bedroom feng shui. When your bed is in the command position, you have a clear view of the door while lying down, but you&apos;re not directly in line with it. This placement provides a sense of security and control, allowing your subconscious to fully relax during sleep.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                <div style={{ padding: "16px", backgroundColor: "#ECFDF5", borderRadius: "12px" }}>
                  <h4 style={{ color: "#065F46", margin: "0 0 8px 0" }}>✅ Do</h4>
                  <ul style={{ margin: 0, paddingLeft: "20px", color: "#047857", fontSize: "0.9rem" }}>
                    <li>See the door from bed</li>
                    <li>Have solid wall behind headboard</li>
                    <li>Place bed diagonally from door</li>
                    <li>Have space on both sides</li>
                  </ul>
                </div>
                <div style={{ padding: "16px", backgroundColor: "#FEF2F2", borderRadius: "12px" }}>
                  <h4 style={{ color: "#991B1B", margin: "0 0 8px 0" }}>❌ Don&apos;t</h4>
                  <ul style={{ margin: 0, paddingLeft: "20px", color: "#DC2626", fontSize: "0.9rem" }}>
                    <li>Align feet with door</li>
                    <li>Place headboard under window</li>
                    <li>Push bed against corner</li>
                    <li>Block view of door</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bedroom Feng Shui Rules */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>📋 Essential Bedroom Feng Shui Rules</h2>
              <div style={{ display: "grid", gap: "16px" }}>
                {[
                  { rule: "Solid Headboard", desc: "Choose a solid headboard attached to the bed for stability and support in life.", icon: "🛏️" },
                  { rule: "No Mirrors Facing Bed", desc: "Mirrors bounce energy and can disturb sleep. Cover or reposition them.", icon: "🪞" },
                  { rule: "Pairs for Romance", desc: "Use matching nightstands and lamps to attract and maintain relationships.", icon: "💑" },
                  { rule: "Clear Under-Bed Space", desc: "Keep area under bed clear for chi flow. No storage if possible.", icon: "✨" },
                  { rule: "Electronics Away", desc: "Remove TVs, computers, and exercise equipment from bedroom.", icon: "📵" },
                  { rule: "Calming Colors", desc: "Use soft, muted colors. Avoid bright reds or blacks as dominant colors.", icon: "🎨" }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "16px", padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "12px" }}>
                    <span style={{ fontSize: "1.5rem" }}>{item.icon}</span>
                    <div>
                      <h4 style={{ margin: "0 0 4px 0", color: "#111827" }}>{item.rule}</h4>
                      <p style={{ margin: 0, color: "#6B7280", fontSize: "0.9rem" }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Bagua Areas */}
            <div style={{ backgroundColor: "#F5F3FF", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #DDD6FE" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#5B21B6", marginBottom: "16px" }}>☯️ Bagua Areas</h3>
              <div style={{ fontSize: "0.85rem", color: "#6D28D9" }}>
                {[
                  { area: "Southeast", meaning: "Wealth & Abundance", color: "Purple, Green" },
                  { area: "South", meaning: "Fame & Reputation", color: "Red" },
                  { area: "Southwest", meaning: "Love & Marriage", color: "Pink, Red" },
                  { area: "East", meaning: "Health & Family", color: "Green, Blue" },
                  { area: "West", meaning: "Children & Creativity", color: "White, Metal" },
                  { area: "Northeast", meaning: "Knowledge & Wisdom", color: "Blue" },
                  { area: "North", meaning: "Career & Path", color: "Black, Blue" },
                  { area: "Northwest", meaning: "Helpful People", color: "Gray, White" }
                ].map((item, idx) => (
                  <div key={idx} style={{ padding: "8px 0", borderBottom: idx < 7 ? "1px solid #DDD6FE" : "none" }}>
                    <p style={{ fontWeight: "600", margin: "0 0 2px 0" }}>{item.area}</p>
                    <p style={{ margin: 0, fontSize: "0.8rem", opacity: 0.9 }}>{item.meaning}</p>
                    <p style={{ margin: 0, fontSize: "0.75rem", opacity: 0.7 }}>Colors: {item.color}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Tips */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "12px" }}>⚡ Quick Tips</h3>
              <ul style={{ margin: 0, paddingLeft: "20px", color: "#92400E", fontSize: "0.85rem" }}>
                <li style={{ marginBottom: "8px" }}>Always close bathroom door at night</li>
                <li style={{ marginBottom: "8px" }}>Use blackout curtains for better sleep</li>
                <li style={{ marginBottom: "8px" }}>Add plants for positive energy</li>
                <li style={{ marginBottom: "8px" }}>Keep bedroom clutter-free</li>
                <li>Use dim, warm lighting</li>
              </ul>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/feng-shui-bedroom-layout-generator" currentCategory="Lifestyle" />
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
            🔮 <strong>Disclaimer:</strong> This tool provides general feng shui guidance based on traditional principles. Individual results may vary. For personalized advice, consider consulting a feng shui professional.
          </p>
        </div>
      </div>
    </div>
  );
}