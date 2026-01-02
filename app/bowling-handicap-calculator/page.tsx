"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// 预设配置
const presets = [
  { label: "90% of 220", basis: 220, percentage: 90 },
  { label: "90% of 230", basis: 230, percentage: 90 },
  { label: "90% of 210", basis: 210, percentage: 90 },
  { label: "80% of 220", basis: 220, percentage: 80 },
  { label: "80% of 230", basis: 230, percentage: 80 },
  { label: "100% of 200", basis: 200, percentage: 100 },
];

// 技术水平判断
const getSkillLevel = (average: number): { level: string; emoji: string; color: string } => {
  if (average >= 220) return { level: "Professional", emoji: "🏆", color: "#7C3AED" };
  if (average >= 200) return { level: "Advanced", emoji: "⭐⭐⭐", color: "#059669" };
  if (average >= 180) return { level: "Competitive", emoji: "⭐⭐", color: "#2563EB" };
  if (average >= 150) return { level: "League Bowler", emoji: "⭐", color: "#F97316" };
  if (average >= 100) return { level: "Recreational", emoji: "🎳", color: "#6B7280" };
  return { level: "Beginner", emoji: "🔰", color: "#9CA3AF" };
};

// 生成 Handicap Chart
const generateHandicapChart = (basis: number, percentage: number) => {
  const chart: { average: number; handicap: number }[] = [];
  for (let avg = 100; avg <= Math.min(basis, 220); avg += 10) {
    const handicap = Math.floor((basis - avg) * (percentage / 100));
    chart.push({ average: avg, handicap: Math.max(0, handicap) });
  }
  return chart;
};

// FAQ数据
const faqs = [
  {
    question: "How to calculate your bowling handicap?",
    answer: "Bowling handicap is calculated using the formula: Handicap = (Basis Score - Your Average) × Percentage Factor. For example, if the basis is 220, your average is 160, and the percentage is 90%, your handicap would be (220-160) × 0.90 = 54 pins per game."
  },
  {
    question: "How good is a 150 average in bowling?",
    answer: "A 150 average is considered recreational to intermediate level. It's above the national average for casual bowlers (around 130-140) but below typical league bowlers (170-200). With practice, a 150 bowler can improve significantly by focusing on spare conversion and consistent releases."
  },
  {
    question: "What does 90% handicap mean in bowling?",
    answer: "The 90% means you receive 90% of the difference between the basis score and your average. This percentage factor determines how much of the gap is compensated. Higher percentages (like 100%) provide more handicap to lower-average bowlers, while lower percentages (like 80%) favor higher-average bowlers slightly."
  },
  {
    question: "Is a 170 average good in bowling?",
    answer: "Yes, a 170 average is considered good and places you in the competitive amateur range. Most league bowlers average between 150-180, so 170 puts you in the upper tier of recreational players. To reach 200+, focus on strike percentage and converting difficult spares."
  },
  {
    question: "What basis score and percentage should I use?",
    answer: "Check with your league officials for the exact rules. Common configurations are 90% of 220 (most popular), 80% of 230, or 100% of 200. The basis is typically set higher than any bowler's average in the league, usually between 200-230."
  }
];

// FAQ组件
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex justify-between items-center text-left"
      >
        <h3 className="font-semibold text-gray-900 pr-4">{question}</h3>
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${isOpen ? "max-h-96 pb-4" : "max-h-0"}`}>
        <p className="text-gray-600">{answer}</p>
      </div>
    </div>
  );
}

export default function BowlingHandicapCalculator() {
  // 输入状态
  const [basisScore, setBasisScore] = useState<string>("220");
  const [percentage, setPercentage] = useState<string>("90");
  const [selectedPreset, setSelectedPreset] = useState<string>("90% of 220");
  
  // 平均分计算
  const [gameScores, setGameScores] = useState<string[]>(["", "", ""]);
  const [manualAverage, setManualAverage] = useState<string>("");
  const [useManualAverage, setUseManualAverage] = useState<boolean>(true);
  
  // 当局分数（可选）
  const [currentGameScore, setCurrentGameScore] = useState<string>("");
  
  // 结果
  const [results, setResults] = useState<{
    average: number;
    handicap: number;
    adjustedScore: number | null;
    skillLevel: { level: string; emoji: string; color: string };
    formula: string;
  } | null>(null);

  // 显示 Handicap Chart
  const [showChart, setShowChart] = useState(false);

  // 选择预设
  const selectPreset = (preset: typeof presets[0]) => {
    setBasisScore(preset.basis.toString());
    setPercentage(preset.percentage.toString());
    setSelectedPreset(preset.label);
  };

  // 从比赛分数计算平均分
  const calculateAverageFromGames = (): number | null => {
    const validScores = gameScores.filter(s => s !== "" && !isNaN(parseInt(s)));
    if (validScores.length === 0) return null;
    const sum = validScores.reduce((acc, s) => acc + parseInt(s), 0);
    return Math.floor(sum / validScores.length);
  };

  // 添加比赛
  const addGame = () => {
    if (gameScores.length < 21) {
      setGameScores([...gameScores, ""]);
    }
  };

  // 删除比赛
  const removeGame = (index: number) => {
    if (gameScores.length > 1) {
      const newScores = gameScores.filter((_, i) => i !== index);
      setGameScores(newScores);
    }
  };

  // 更新比赛分数
  const updateGameScore = (index: number, value: string) => {
    const newScores = [...gameScores];
    newScores[index] = value;
    setGameScores(newScores);
  };

  // 计算 Handicap
  const calculateHandicap = () => {
    const basis = parseInt(basisScore);
    const pct = parseFloat(percentage);

    if (isNaN(basis) || basis <= 0 || basis > 300) {
      alert("Please enter a valid basis score (1-300)");
      return;
    }
    if (isNaN(pct) || pct <= 0 || pct > 100) {
      alert("Please enter a valid percentage (1-100)");
      return;
    }

    let average: number;
    if (useManualAverage) {
      average = parseInt(manualAverage);
      if (isNaN(average) || average < 0 || average > 300) {
        alert("Please enter a valid average (0-300)");
        return;
      }
    } else {
      const calculatedAvg = calculateAverageFromGames();
      if (calculatedAvg === null) {
        alert("Please enter at least one game score");
        return;
      }
      average = calculatedAvg;
    }

    // 计算 Handicap
    const handicap = Math.max(0, Math.floor((basis - average) * (pct / 100)));
    
    // 计算调整后分数
    let adjustedScore: number | null = null;
    if (currentGameScore !== "") {
      const gameScore = parseInt(currentGameScore);
      if (!isNaN(gameScore) && gameScore >= 0 && gameScore <= 300) {
        adjustedScore = gameScore + handicap;
      }
    }

    const skillLevel = getSkillLevel(average);
    const formula = `(${basis} - ${average}) × ${pct}% = ${((basis - average) * (pct / 100)).toFixed(1)} → ${handicap}`;

    setResults({
      average,
      handicap,
      adjustedScore,
      skillLevel,
      formula
    });
  };

  // 重置
  const reset = () => {
    setBasisScore("220");
    setPercentage("90");
    setSelectedPreset("90% of 220");
    setGameScores(["", "", ""]);
    setManualAverage("");
    setCurrentGameScore("");
    setResults(null);
  };

  const handicapChart = generateHandicapChart(parseInt(basisScore) || 220, parseFloat(percentage) || 90);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav className="text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Bowling Handicap Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title Section */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#111827", marginBottom: "12px" }}>
            Bowling Handicap Calculator
          </h1>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate your bowling handicap and adjusted score instantly. Supports all common league formats including 90% of 220, 80% of 230, and custom configurations.
          </p>
        </div>

        {/* Calculator Section */}
        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "16px", 
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)", 
          border: "1px solid #E5E7EB",
          padding: "32px",
          marginBottom: "40px"
        }}>
          <div style={{ display: "flex", gap: "48px", flexWrap: "wrap" }}>
            {/* Left: Input Section */}
            <div style={{ flex: "1", minWidth: "300px" }}>
              <h2 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827", marginBottom: "20px" }}>
                League Settings
              </h2>

              {/* Quick Presets */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  Quick Presets
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {presets.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => selectPreset(preset)}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: selectedPreset === preset.label ? "2px solid #10B981" : "1px solid #E5E7EB",
                        backgroundColor: selectedPreset === preset.label ? "#ECFDF5" : "white",
                        color: selectedPreset === preset.label ? "#059669" : "#4B5563",
                        fontWeight: selectedPreset === preset.label ? "600" : "400",
                        cursor: "pointer",
                        fontSize: "0.75rem"
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Basis Score & Percentage */}
              <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
                <div style={{ flex: "1" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                    Basis Score
                  </label>
                  <input
                    type="number"
                    value={basisScore}
                    onChange={(e) => {
                      setBasisScore(e.target.value);
                      setSelectedPreset("Custom");
                    }}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      outline: "none"
                    }}
                    min="100"
                    max="300"
                  />
                </div>
                <div style={{ flex: "1" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                    Percentage
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="number"
                      value={percentage}
                      onChange={(e) => {
                        setPercentage(e.target.value);
                        setSelectedPreset("Custom");
                      }}
                      style={{
                        width: "100%",
                        padding: "10px 32px 10px 12px",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        outline: "none"
                      }}
                      min="1"
                      max="100"
                    />
                    <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>%</span>
                  </div>
                </div>
              </div>

              {/* Average Input Method Toggle */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  Your Bowling Average
                </label>
                <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                  <button
                    onClick={() => setUseManualAverage(true)}
                    style={{
                      flex: "1",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: useManualAverage ? "2px solid #10B981" : "1px solid #E5E7EB",
                      backgroundColor: useManualAverage ? "#ECFDF5" : "white",
                      color: useManualAverage ? "#059669" : "#4B5563",
                      fontWeight: useManualAverage ? "600" : "400",
                      cursor: "pointer",
                      fontSize: "0.875rem"
                    }}
                  >
                    Enter Average
                  </button>
                  <button
                    onClick={() => setUseManualAverage(false)}
                    style={{
                      flex: "1",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: !useManualAverage ? "2px solid #10B981" : "1px solid #E5E7EB",
                      backgroundColor: !useManualAverage ? "#ECFDF5" : "white",
                      color: !useManualAverage ? "#059669" : "#4B5563",
                      fontWeight: !useManualAverage ? "600" : "400",
                      cursor: "pointer",
                      fontSize: "0.875rem"
                    }}
                  >
                    Calculate from Games
                  </button>
                </div>

                {useManualAverage ? (
                  <input
                    type="number"
                    value={manualAverage}
                    onChange={(e) => setManualAverage(e.target.value)}
                    placeholder="e.g., 156"
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      outline: "none"
                    }}
                    min="0"
                    max="300"
                  />
                ) : (
                  <div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
                      {gameScores.map((score, index) => (
                        <div key={index} style={{ position: "relative", width: "80px" }}>
                          <input
                            type="number"
                            value={score}
                            onChange={(e) => updateGameScore(index, e.target.value)}
                            placeholder={`G${index + 1}`}
                            style={{
                              width: "100%",
                              padding: "8px 24px 8px 8px",
                              border: "1px solid #E5E7EB",
                              borderRadius: "6px",
                              fontSize: "0.875rem",
                              outline: "none"
                            }}
                            min="0"
                            max="300"
                          />
                          {gameScores.length > 1 && (
                            <button
                              onClick={() => removeGame(index)}
                              style={{
                                position: "absolute",
                                right: "4px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                background: "none",
                                border: "none",
                                color: "#9CA3AF",
                                cursor: "pointer",
                                fontSize: "0.875rem",
                                padding: "0 4px"
                              }}
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <button
                        onClick={addGame}
                        disabled={gameScores.length >= 21}
                        style={{
                          fontSize: "0.75rem",
                          color: gameScores.length >= 21 ? "#9CA3AF" : "#10B981",
                          background: "none",
                          border: "none",
                          cursor: gameScores.length >= 21 ? "default" : "pointer",
                          padding: "4px 0"
                        }}
                      >
                        + Add Game
                      </button>
                      {calculateAverageFromGames() !== null && (
                        <span style={{ fontSize: "0.875rem", color: "#059669", fontWeight: "500" }}>
                          Avg: {calculateAverageFromGames()}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Current Game Score (Optional) */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                  Current Game Score <span style={{ color: "#9CA3AF", fontWeight: "400" }}>- optional</span>
                </label>
                <input
                  type="number"
                  value={currentGameScore}
                  onChange={(e) => setCurrentGameScore(e.target.value)}
                  placeholder="e.g., 172"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none"
                  }}
                  min="0"
                  max="300"
                />
                <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "4px" }}>
                  Enter to calculate your adjusted (handicap) score
                </p>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={calculateHandicap}
                  style={{
                    flex: "1",
                    backgroundColor: "#10B981",
                    color: "white",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontWeight: "600",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem"
                  }}
                >
                  Calculate Handicap
                </button>
                <button
                  onClick={reset}
                  style={{
                    padding: "12px 24px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    fontWeight: "500",
                    color: "#4B5563",
                    backgroundColor: "white",
                    cursor: "pointer"
                  }}
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Right: Result Section */}
            <div style={{ flex: "1", minWidth: "300px" }}>
              {/* Main Handicap Display */}
              <div style={{ 
                background: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)", 
                borderRadius: "16px", 
                padding: "24px",
                marginBottom: "16px",
                textAlign: "center"
              }}>
                <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#059669", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                  Your Handicap
                </p>
                <p style={{ fontSize: "3.5rem", fontWeight: "bold", color: "#059669", lineHeight: "1" }}>
                  {results ? results.handicap : "—"}
                </p>
                <p style={{ color: "#065F46", marginTop: "8px", fontSize: "0.875rem" }}>
                  {results ? "pins per game" : "Enter your average above"}
                </p>
              </div>

              {/* Adjusted Score (if provided) */}
              {results && results.adjustedScore !== null && (
                <div style={{ 
                  background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)", 
                  borderRadius: "12px", 
                  padding: "16px",
                  marginBottom: "16px",
                  textAlign: "center"
                }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#2563EB", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                    Adjusted Score
                  </p>
                  <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#2563EB", lineHeight: "1" }}>
                    {results.adjustedScore}
                  </p>
                  <p style={{ color: "#1E40AF", marginTop: "4px", fontSize: "0.75rem" }}>
                    {currentGameScore} + {results.handicap} handicap
                  </p>
                </div>
              )}

              {/* Skill Level & Formula */}
              {results && (
                <div style={{ 
                  backgroundColor: "#F9FAFB", 
                  borderRadius: "12px", 
                  padding: "16px",
                  marginBottom: "16px"
                }}>
                  {/* Skill Level */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", paddingBottom: "12px", borderBottom: "1px solid #E5E7EB" }}>
                    <span style={{ fontSize: "0.875rem", color: "#6B7280" }}>Skill Level</span>
                    <span style={{ fontWeight: "600", color: results.skillLevel.color }}>
                      {results.skillLevel.emoji} {results.skillLevel.level}
                    </span>
                  </div>

                  {/* Your Average */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", paddingBottom: "12px", borderBottom: "1px solid #E5E7EB" }}>
                    <span style={{ fontSize: "0.875rem", color: "#6B7280" }}>Your Average</span>
                    <span style={{ fontWeight: "600", color: "#111827" }}>{results.average}</span>
                  </div>

                  {/* Formula */}
                  <div>
                    <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", marginBottom: "8px" }}>
                      Formula
                    </p>
                    <div style={{ 
                      backgroundColor: "white", 
                      padding: "12px", 
                      borderRadius: "8px",
                      fontFamily: "monospace",
                      fontSize: "0.875rem",
                      color: "#374151"
                    }}>
                      {results.formula}
                    </div>
                  </div>
                </div>
              )}

              {/* Handicap Chart Toggle */}
              <button
                onClick={() => setShowChart(!showChart)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  backgroundColor: "#F3F4F6",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#374151"
                }}
              >
                <span>📊 Handicap Chart ({selectedPreset})</span>
                <svg
                  className={`w-4 h-4 transform transition-transform ${showChart ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{ width: "16px", height: "16px" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showChart && (
                <div style={{ marginTop: "12px", maxHeight: "200px", overflowY: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#F3F4F6", position: "sticky", top: 0 }}>
                        <th style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "center" }}>Average</th>
                        <th style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "center" }}>Handicap</th>
                      </tr>
                    </thead>
                    <tbody>
                      {handicapChart.map((row, index) => (
                        <tr key={index} style={{ backgroundColor: results && results.average >= row.average && results.average < row.average + 10 ? "#ECFDF5" : "white" }}>
                          <td style={{ padding: "6px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.average}</td>
                          <td style={{ padding: "6px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "500" }}>{row.handicap}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section - 两栏布局 */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content - 左侧宽 */}
          <div style={{ flex: "2", minWidth: "400px" }}>
            {/* What is Bowling Handicap */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                What is a Bowling Handicap?
              </h2>
              <p style={{ color: "#4B5563", marginBottom: "16px", lineHeight: "1.7" }}>
                A bowling handicap is a scoring adjustment that levels the playing field between bowlers of different skill levels. It allows beginners and experienced bowlers to compete fairly in the same league or tournament.
              </p>
              <p style={{ color: "#4B5563", lineHeight: "1.7" }}>
                The handicap system adds bonus pins to lower-average bowlers&apos; scores, giving everyone an equal chance to win. This makes bowling leagues more inclusive and competitive for all participants.
              </p>
            </div>

            {/* How to Calculate */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                How to Calculate Bowling Handicap
              </h2>
              <p style={{ color: "#4B5563", marginBottom: "16px", lineHeight: "1.7" }}>
                The bowling handicap formula is straightforward:
              </p>
              
              <div style={{ 
                backgroundColor: "#ECFDF5", 
                padding: "20px", 
                borderRadius: "12px", 
                marginBottom: "16px",
                fontFamily: "Georgia, serif",
                fontSize: "1rem",
                lineHeight: "2",
                borderLeft: "4px solid #10B981"
              }}>
                <p style={{ fontWeight: "600", color: "#065F46" }}>Handicap = (Basis Score − Your Average) × Percentage Factor</p>
              </div>

              <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "#111827", marginBottom: "12px" }}>
                Example Calculation:
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                <div style={{ padding: "12px 16px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.875rem", color: "#4B5563" }}>
                    <strong>Basis Score:</strong> 220 (set by your league)
                  </p>
                </div>
                <div style={{ padding: "12px 16px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.875rem", color: "#4B5563" }}>
                    <strong>Your Average:</strong> 156
                  </p>
                </div>
                <div style={{ padding: "12px 16px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.875rem", color: "#4B5563" }}>
                    <strong>Percentage:</strong> 90%
                  </p>
                </div>
                <div style={{ padding: "12px 16px", backgroundColor: "#ECFDF5", borderRadius: "8px", borderLeft: "4px solid #10B981" }}>
                  <p style={{ fontSize: "0.875rem", color: "#065F46" }}>
                    <strong>Handicap:</strong> (220 − 156) × 0.90 = 57.6 → <strong>57 pins</strong>
                  </p>
                </div>
              </div>

              <p style={{ color: "#4B5563", lineHeight: "1.7" }}>
                Always round down to the nearest whole number. If you bowl a 172 game, your adjusted score would be 172 + 57 = 229.
              </p>
            </div>

            {/* Bowling Average Guide */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                Bowling Average Skill Levels
              </h2>
              <p style={{ color: "#4B5563", marginBottom: "20px", lineHeight: "1.7" }}>
                Understanding where your average falls can help you set improvement goals:
              </p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "12px", borderLeft: "4px solid #9CA3AF" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: "600", color: "#111827" }}>🔰 Beginner</span>
                    <span style={{ fontSize: "0.875rem", color: "#6B7280" }}>Below 100</span>
                  </div>
                  <p style={{ fontSize: "0.875rem", color: "#4B5563", marginTop: "4px" }}>New to bowling, learning basic techniques</p>
                </div>
                <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "12px", borderLeft: "4px solid #6B7280" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: "600", color: "#111827" }}>🎳 Recreational</span>
                    <span style={{ fontSize: "0.875rem", color: "#6B7280" }}>100-149</span>
                  </div>
                  <p style={{ fontSize: "0.875rem", color: "#4B5563", marginTop: "4px" }}>Casual player, improving consistency</p>
                </div>
                <div style={{ padding: "16px", backgroundColor: "#FFF7ED", borderRadius: "12px", borderLeft: "4px solid #F97316" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: "600", color: "#111827" }}>⭐ League Bowler</span>
                    <span style={{ fontSize: "0.875rem", color: "#6B7280" }}>150-179</span>
                  </div>
                  <p style={{ fontSize: "0.875rem", color: "#4B5563", marginTop: "4px" }}>Regular league participant, solid spare game</p>
                </div>
                <div style={{ padding: "16px", backgroundColor: "#EFF6FF", borderRadius: "12px", borderLeft: "4px solid #2563EB" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: "600", color: "#111827" }}>⭐⭐ Competitive</span>
                    <span style={{ fontSize: "0.875rem", color: "#6B7280" }}>180-199</span>
                  </div>
                  <p style={{ fontSize: "0.875rem", color: "#4B5563", marginTop: "4px" }}>Above average, tournament contender</p>
                </div>
                <div style={{ padding: "16px", backgroundColor: "#ECFDF5", borderRadius: "12px", borderLeft: "4px solid #059669" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: "600", color: "#111827" }}>⭐⭐⭐ Advanced</span>
                    <span style={{ fontSize: "0.875rem", color: "#6B7280" }}>200-219</span>
                  </div>
                  <p style={{ fontSize: "0.875rem", color: "#4B5563", marginTop: "4px" }}>Excellent skills, consistent striker</p>
                </div>
                <div style={{ padding: "16px", backgroundColor: "#F5F3FF", borderRadius: "12px", borderLeft: "4px solid #7C3AED" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: "600", color: "#111827" }}>🏆 Professional</span>
                    <span style={{ fontSize: "0.875rem", color: "#6B7280" }}>220+</span>
                  </div>
                  <p style={{ fontSize: "0.875rem", color: "#4B5563", marginTop: "4px" }}>Elite level, PBA tour quality</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - 右侧窄 */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Tips */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "24px",
              marginBottom: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                💡 Quick Tips
              </h3>
              <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
                {[
                  "Most leagues use 90% of 220 or 210",
                  "Always ask your league for exact rules",
                  "Handicap is recalculated weekly based on recent games",
                  "Focus on spare conversion to raise your average"
                ].map((tip, index) => (
                  <li key={index} style={{ display: "flex", alignItems: "flex-start", marginBottom: "12px", fontSize: "0.875rem", color: "#4B5563" }}>
                    <span style={{ color: "#10B981", marginRight: "8px", fontWeight: "bold" }}>✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Common League Formats */}
            <div style={{ 
              backgroundColor: "#FEF3C7", 
              borderRadius: "16px", 
              padding: "24px",
              marginBottom: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "12px" }}>
                🎯 Common League Formats
              </h3>
              <ul style={{ listStyle: "none", padding: "0", margin: "0", fontSize: "0.875rem", color: "#92400E" }}>
                <li style={{ marginBottom: "8px" }}>• <strong>90% of 220</strong> - Most popular</li>
                <li style={{ marginBottom: "8px" }}>• <strong>90% of 230</strong> - Higher skill leagues</li>
                <li style={{ marginBottom: "8px" }}>• <strong>80% of 220</strong> - Favors higher averages</li>
                <li style={{ marginBottom: "8px" }}>• <strong>100% of 200</strong> - Maximum parity</li>
                <li>• <strong>80% of 230</strong> - USBC tournaments</li>
              </ul>
            </div>

            <RelatedTools currentUrl="/bowling-handicap-calculator" currentCategory="Sports" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "16px", 
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          padding: "32px"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "24px" }}>
            Frequently Asked Questions
          </h2>
          <div>
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
