"use client";

import { useState } from "react";
import Link from "next/link";

// 分数转换表 (基于 Caddell Prep 的数据，0-57)
const scoreConversionTable: { [key: number]: number } = {
  0: 0, 1: 16, 2: 26, 3: 37, 4: 51, 5: 65, 6: 74, 7: 83, 8: 90, 9: 98,
  10: 105, 11: 130, 12: 134, 13: 141, 14: 146, 15: 152, 16: 158, 17: 163,
  18: 168, 19: 172, 20: 177, 21: 181, 22: 186, 23: 190, 24: 194, 25: 201,
  26: 204, 27: 208, 28: 211, 29: 215, 30: 218, 31: 222, 32: 226, 33: 229,
  34: 233, 35: 236, 36: 240, 37: 243, 38: 247, 39: 250, 40: 254, 41: 257,
  42: 261, 43: 266, 44: 266, 45: 270, 46: 274, 47: 279, 48: 285, 49: 291,
  50: 297, 51: 306, 52: 315, 53: 323, 54: 333, 55: 344, 56: 355, 57: 365
};

// 8所特殊高中及其 cutoff 分数 (2024年数据)
const schools = [
  { name: "Stuyvesant High School", cutoff8: 556, cutoff9: 563, abbr: "Stuy" },
  { name: "Bronx High School of Science", cutoff8: 518, cutoff9: 525, abbr: "BxSci" },
  { name: "Brooklyn Technical High School", cutoff8: 505, cutoff9: 512, abbr: "BkTech" },
  { name: "High School of Math, Science & Engineering", cutoff8: 516, cutoff9: 520, abbr: "HSMSE" },
  { name: "High School of American Studies", cutoff8: 521, cutoff9: 526, abbr: "HSAS" },
  { name: "Brooklyn Latin School", cutoff8: 482, cutoff9: 489, abbr: "BkLatin" },
  { name: "Queens High School for Sciences", cutoff8: 527, cutoff9: 532, abbr: "QHSS" },
  { name: "Staten Island Technical High School", cutoff8: 519, cutoff9: 524, abbr: "SITHS" }
];

// FAQ数据
const faqs = [
  {
    question: "How is the SHSAT scored?",
    answer: "The SHSAT has two sections: ELA and Math. Each section has 57 questions, but only 47 are scored (10 are experimental field questions). Your raw score (correct answers) is converted to a scaled score using a curve, then both sections are added for your composite score. The maximum composite score is around 700."
  },
  {
    question: "What is a good SHSAT score?",
    answer: "A 'good' score depends on which school you're targeting. For Stuyvesant (the most competitive), you typically need 556+. For Brooklyn Tech, around 505+ is usually sufficient. Aim to answer 100+ questions correctly out of 114 to be competitive for top schools."
  },
  {
    question: "Why are there 57 questions but only 47 count?",
    answer: "The DOE includes 10 'field test' questions in each section to try out new questions for future tests. These don't count toward your score, but you won't know which ones they are, so you should answer all 57 questions in each section."
  },
  {
    question: "How accurate is this calculator?",
    answer: "This calculator provides a conservative estimate based on publicly available conversion data. The actual DOE conversion varies each year based on test difficulty. Use this as a guide for practice tests, not as an exact prediction of your official score."
  },
  {
    question: "What's the difference between 8th and 9th grade cutoffs?",
    answer: "9th grade cutoffs are typically slightly higher because fewer seats are available for 9th grade applicants. Most students take the SHSAT in 8th grade, but 9th graders can also apply for remaining seats."
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

export default function SHSATScoreCalculator() {
  const [inputMode, setInputMode] = useState<"separate" | "combined">("separate");
  const [elaCorrect, setElaCorrect] = useState<string>("");
  const [mathCorrect, setMathCorrect] = useState<string>("");
  const [totalCorrect, setTotalCorrect] = useState<string>("");
  const [gradeLevel, setGradeLevel] = useState<"8" | "9">("8");
  const [showConversionTable, setShowConversionTable] = useState(false);

  const [results, setResults] = useState<{
    elaRaw: number;
    mathRaw: number;
    elaScaled: number;
    mathScaled: number;
    totalRaw: number;
    totalScaled: number;
    percentage: number;
  } | null>(null);

  const getScaledScore = (raw: number): number => {
    if (raw < 0) return 0;
    if (raw > 57) return scoreConversionTable[57];
    return scoreConversionTable[raw] || 0;
  };

  const calculateScore = () => {
    let elaRaw: number, mathRaw: number;

    if (inputMode === "separate") {
      elaRaw = parseInt(elaCorrect) || 0;
      mathRaw = parseInt(mathCorrect) || 0;

      if (elaRaw < 0 || elaRaw > 57) {
        alert("ELA correct answers must be between 0 and 57");
        return;
      }
      if (mathRaw < 0 || mathRaw > 57) {
        alert("Math correct answers must be between 0 and 57");
        return;
      }
    } else {
      const total = parseInt(totalCorrect) || 0;
      if (total < 0 || total > 114) {
        alert("Total correct answers must be between 0 and 114");
        return;
      }
      // 平均分配到两个部分
      elaRaw = Math.floor(total / 2);
      mathRaw = total - elaRaw;
    }

    const elaScaled = getScaledScore(elaRaw);
    const mathScaled = getScaledScore(mathRaw);
    const totalRaw = elaRaw + mathRaw;
    const totalScaled = elaScaled + mathScaled;
    const percentage = (totalRaw / 114) * 100;

    setResults({
      elaRaw,
      mathRaw,
      elaScaled,
      mathScaled,
      totalRaw,
      totalScaled,
      percentage
    });
  };

  const reset = () => {
    setElaCorrect("");
    setMathCorrect("");
    setTotalCorrect("");
    setResults(null);
  };

  const getCutoff = (school: typeof schools[0]) => {
    return gradeLevel === "8" ? school.cutoff8 : school.cutoff9;
  };

  const getAdmissionStatus = (score: number, cutoff: number) => {
    const diff = score - cutoff;
    if (diff >= 0) {
      return { admitted: true, diff };
    }
    return { admitted: false, diff };
  };

  // 计算还需要答对多少题才能达到某个分数
  const getQuestionsNeeded = (currentScore: number, targetScore: number): number => {
    if (currentScore >= targetScore) return 0;
    // 粗略估算：中间分数段每3-4分约1题
    const pointsNeeded = targetScore - currentScore;
    return Math.ceil(pointsNeeded / 3.5);
  };

  // 找到最近可达成的学校
  const getNextReachableSchool = () => {
    if (!results) return null;
    
    const sortedSchools = [...schools]
      .map(s => ({ ...s, cutoff: getCutoff(s), diff: getCutoff(s) - results.totalScaled }))
      .filter(s => s.diff > 0)
      .sort((a, b) => a.diff - b.diff);
    
    return sortedSchools[0] || null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav className="text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">SHSAT Score Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title Section */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#111827", marginBottom: "12px" }}>
            SHSAT Score Calculator
          </h1>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate your SHSAT score and see which NYC Specialized High Schools you qualify for. Get instant results with 2024 cutoff scores.
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
                Enter Your Scores
              </h2>

              {/* Grade Level Toggle */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  Grade Level
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => setGradeLevel("8")}
                    style={{
                      flex: "1",
                      padding: "10px 16px",
                      borderRadius: "8px",
                      border: gradeLevel === "8" ? "2px solid #F97316" : "1px solid #E5E7EB",
                      backgroundColor: gradeLevel === "8" ? "#FFF7ED" : "white",
                      color: gradeLevel === "8" ? "#EA580C" : "#4B5563",
                      fontWeight: gradeLevel === "8" ? "600" : "400",
                      cursor: "pointer"
                    }}
                  >
                    8th Grade
                  </button>
                  <button
                    onClick={() => setGradeLevel("9")}
                    style={{
                      flex: "1",
                      padding: "10px 16px",
                      borderRadius: "8px",
                      border: gradeLevel === "9" ? "2px solid #F97316" : "1px solid #E5E7EB",
                      backgroundColor: gradeLevel === "9" ? "#FFF7ED" : "white",
                      color: gradeLevel === "9" ? "#EA580C" : "#4B5563",
                      fontWeight: gradeLevel === "9" ? "600" : "400",
                      cursor: "pointer"
                    }}
                  >
                    9th Grade
                  </button>
                </div>
              </div>

              {/* Input Mode Toggle */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  Input Method
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => setInputMode("separate")}
                    style={{
                      flex: "1",
                      padding: "10px 16px",
                      borderRadius: "8px",
                      border: inputMode === "separate" ? "2px solid #F97316" : "1px solid #E5E7EB",
                      backgroundColor: inputMode === "separate" ? "#FFF7ED" : "white",
                      color: inputMode === "separate" ? "#EA580C" : "#4B5563",
                      fontWeight: inputMode === "separate" ? "600" : "400",
                      cursor: "pointer",
                      fontSize: "0.875rem"
                    }}
                  >
                    ELA + Math
                  </button>
                  <button
                    onClick={() => setInputMode("combined")}
                    style={{
                      flex: "1",
                      padding: "10px 16px",
                      borderRadius: "8px",
                      border: inputMode === "combined" ? "2px solid #F97316" : "1px solid #E5E7EB",
                      backgroundColor: inputMode === "combined" ? "#FFF7ED" : "white",
                      color: inputMode === "combined" ? "#EA580C" : "#4B5563",
                      fontWeight: inputMode === "combined" ? "600" : "400",
                      cursor: "pointer",
                      fontSize: "0.875rem"
                    }}
                  >
                    Total (114)
                  </button>
                </div>
              </div>

              {/* Input Fields */}
              {inputMode === "separate" ? (
                <>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                      ELA Correct Answers (0-57)
                    </label>
                    <input
                      type="number"
                      value={elaCorrect}
                      onChange={(e) => setElaCorrect(e.target.value)}
                      placeholder="e.g., 45"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        outline: "none"
                      }}
                      min="0"
                      max="57"
                    />
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                      Math Correct Answers (0-57)
                    </label>
                    <input
                      type="number"
                      value={mathCorrect}
                      onChange={(e) => setMathCorrect(e.target.value)}
                      placeholder="e.g., 48"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        outline: "none"
                      }}
                      min="0"
                      max="57"
                    />
                  </div>
                </>
              ) : (
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                    Total Correct Answers (0-114)
                  </label>
                  <input
                    type="number"
                    value={totalCorrect}
                    onChange={(e) => setTotalCorrect(e.target.value)}
                    placeholder="e.g., 93"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      outline: "none"
                    }}
                    min="0"
                    max="114"
                  />
                  <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "4px" }}>
                    Score will be split evenly between ELA and Math
                  </p>
                </div>
              )}

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={calculateScore}
                  style={{
                    flex: "1",
                    backgroundColor: "#F97316",
                    color: "white",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontWeight: "600",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem"
                  }}
                >
                  Calculate Score
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
            <div style={{ flex: "1.2", minWidth: "320px" }}>
              {/* Main Score Display */}
              <div style={{ 
                background: "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)", 
                borderRadius: "16px", 
                padding: "24px",
                marginBottom: "20px",
                textAlign: "center"
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "8px" }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#EA580C", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Composite Score
                  </p>
                  <span style={{ 
                    fontSize: "0.625rem", 
                    backgroundColor: "#FED7AA", 
                    color: "#C2410C", 
                    padding: "2px 6px", 
                    borderRadius: "4px",
                    fontWeight: "500"
                  }}>
                    Conservative Est.
                  </span>
                </div>
                <p style={{ fontSize: "3.5rem", fontWeight: "bold", color: "#EA580C", lineHeight: "1" }}>
                  {results ? results.totalScaled : "—"}
                </p>
                <p style={{ color: "#9A3412", marginTop: "8px", fontSize: "0.875rem" }}>
                  {results 
                    ? `${results.totalRaw}/114 correct (${results.percentage.toFixed(1)}%)`
                    : "Enter your scores above"}
                </p>

                {/* Section Breakdown */}
                {results && (
                  <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #FDBA74" }}>
                    <div>
                      <p style={{ fontSize: "0.75rem", color: "#9A3412" }}>ELA</p>
                      <p style={{ fontWeight: "600", color: "#EA580C" }}>{results.elaScaled}</p>
                      <p style={{ fontSize: "0.75rem", color: "#9A3412" }}>({results.elaRaw}/57)</p>
                    </div>
                    <div>
                      <p style={{ fontSize: "0.75rem", color: "#9A3412" }}>Math</p>
                      <p style={{ fontWeight: "600", color: "#EA580C" }}>{results.mathScaled}</p>
                      <p style={{ fontSize: "0.75rem", color: "#9A3412" }}>({results.mathRaw}/57)</p>
                    </div>
                  </div>
                )}
              </div>

              {/* School Admission Results */}
              {results && (
                <div style={{ 
                  backgroundColor: "#F9FAFB", 
                  borderRadius: "12px", 
                  padding: "16px"
                }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", marginBottom: "12px" }}>
                    {gradeLevel}th Grade Admission Results (2024 Cutoffs)
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {schools.map((school, index) => {
                      const cutoff = getCutoff(school);
                      const status = getAdmissionStatus(results.totalScaled, cutoff);
                      return (
                        <div 
                          key={index}
                          style={{ 
                            display: "flex", 
                            justifyContent: "space-between", 
                            alignItems: "center",
                            padding: "10px 12px",
                            backgroundColor: status.admitted ? "#ECFDF5" : "white",
                            borderRadius: "8px",
                            border: status.admitted ? "1px solid #A7F3D0" : "1px solid #E5E7EB"
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "1.125rem" }}>
                              {status.admitted ? "✅" : "❌"}
                            </span>
                            <span style={{ 
                              fontWeight: "500", 
                              color: status.admitted ? "#065F46" : "#4B5563",
                              fontSize: "0.875rem"
                            }}>
                              {school.name}
                            </span>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <span style={{ 
                              fontSize: "0.75rem", 
                              color: status.admitted ? "#059669" : "#DC2626",
                              fontWeight: "500"
                            }}>
                              {status.admitted 
                                ? `+${status.diff}` 
                                : `${status.diff}`}
                            </span>
                            <span style={{ fontSize: "0.75rem", color: "#9CA3AF", marginLeft: "4px" }}>
                              ({cutoff})
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Next Reachable School Tip */}
                  {(() => {
                    const nextSchool = getNextReachableSchool();
                    if (nextSchool) {
                      const questionsNeeded = getQuestionsNeeded(results.totalScaled, nextSchool.cutoff);
                      return (
                        <div style={{ 
                          marginTop: "16px", 
                          padding: "12px", 
                          backgroundColor: "#FEF3C7", 
                          borderRadius: "8px",
                          fontSize: "0.875rem",
                          color: "#92400E"
                        }}>
                          💡 <strong>Tip:</strong> Answer ~{questionsNeeded} more questions correctly to reach {nextSchool.abbr} ({nextSchool.cutoff})
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              )}

              {/* Target Tips */}
              {!results && (
                <div style={{ 
                  backgroundColor: "#EFF6FF", 
                  borderRadius: "12px", 
                  padding: "16px",
                  fontSize: "0.875rem",
                  color: "#1E40AF"
                }}>
                  <p style={{ fontWeight: "600", marginBottom: "8px" }}>🎯 Score Targets:</p>
                  <ul style={{ margin: "0", paddingLeft: "20px", lineHeight: "1.8" }}>
                    <li><strong>100+ correct</strong> → Competitive for Stuyvesant</li>
                    <li><strong>90+ correct</strong> → Competitive for Bronx Science</li>
                    <li><strong>85+ correct</strong> → Competitive for Brooklyn Tech</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "400px" }}>
            {/* What is SHSAT */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                What is the SHSAT?
              </h2>
              <p style={{ color: "#4B5563", marginBottom: "16px", lineHeight: "1.7" }}>
                The Specialized High Schools Admissions Test (SHSAT) is the entrance exam for eight of New York City&apos;s nine Specialized High Schools. These elite public schools include Stuyvesant, Bronx Science, Brooklyn Tech, and five others.
              </p>
              <p style={{ color: "#4B5563", lineHeight: "1.7" }}>
                The test consists of two sections: English Language Arts (ELA) and Mathematics. Each section contains 57 questions, though only 47 are scored—the remaining 10 are experimental &quot;field test&quot; questions that don&apos;t count toward your score.
              </p>
            </div>

            {/* How Scoring Works */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                How SHSAT Scoring Works
              </h2>
              <p style={{ color: "#4B5563", marginBottom: "16px", lineHeight: "1.7" }}>
                The SHSAT uses a non-linear scoring curve. Your raw score (correct answers) is converted to a scaled score, and the conversion is not proportional:
              </p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                <div style={{ padding: "12px 16px", backgroundColor: "#FFF7ED", borderRadius: "8px", borderLeft: "4px solid #F97316" }}>
                  <p style={{ fontSize: "0.875rem", color: "#9A3412" }}>
                    <strong>Middle range:</strong> +1 raw point ≈ +3-4 scaled points
                  </p>
                </div>
                <div style={{ padding: "12px 16px", backgroundColor: "#FFF7ED", borderRadius: "8px", borderLeft: "4px solid #F97316" }}>
                  <p style={{ fontSize: "0.875rem", color: "#9A3412" }}>
                    <strong>Top/bottom range:</strong> +1 raw point ≈ +10-20 scaled points
                  </p>
                </div>
              </div>

              <p style={{ color: "#4B5563", marginBottom: "16px", lineHeight: "1.7" }}>
                This means improving from good to excellent has a bigger impact than improving from poor to average. Focus on mastering your stronger subject for maximum score gains.
              </p>

              {/* Conversion Table Toggle */}
              <button
                onClick={() => setShowConversionTable(!showConversionTable)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 16px",
                  backgroundColor: "#F3F4F6",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#374151"
                }}
              >
                {showConversionTable ? "Hide" : "Show"} Score Conversion Table
                <svg
                  className={`w-4 h-4 transform transition-transform ${showConversionTable ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showConversionTable && (
                <div style={{ marginTop: "16px", overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#F3F4F6" }}>
                        <th style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "center" }}>Raw</th>
                        <th style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "center" }}>Scaled</th>
                        <th style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "center" }}>Raw</th>
                        <th style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "center" }}>Scaled</th>
                        <th style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "center" }}>Raw</th>
                        <th style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "center" }}>Scaled</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: 20 }, (_, i) => (
                        <tr key={i}>
                          <td style={{ padding: "6px", border: "1px solid #E5E7EB", textAlign: "center" }}>{i}</td>
                          <td style={{ padding: "6px", border: "1px solid #E5E7EB", textAlign: "center" }}>{scoreConversionTable[i]}</td>
                          <td style={{ padding: "6px", border: "1px solid #E5E7EB", textAlign: "center" }}>{i + 20}</td>
                          <td style={{ padding: "6px", border: "1px solid #E5E7EB", textAlign: "center" }}>{scoreConversionTable[i + 20]}</td>
                          <td style={{ padding: "6px", border: "1px solid #E5E7EB", textAlign: "center" }}>{i + 40 <= 57 ? i + 40 : ""}</td>
                          <td style={{ padding: "6px", border: "1px solid #E5E7EB", textAlign: "center" }}>{i + 40 <= 57 ? scoreConversionTable[i + 40] : ""}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* 2024 Cutoff Scores */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                2024 SHSAT Cutoff Scores
              </h2>
              <p style={{ color: "#4B5563", marginBottom: "20px", lineHeight: "1.7" }}>
                Cutoff scores vary each year based on applicant performance and available seats. Here are the estimated cutoffs for the 2024 admissions cycle:
              </p>
              
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F3F4F6" }}>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>School</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>8th Grade</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>9th Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schools.map((school, index) => (
                      <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "white" : "#F9FAFB" }}>
                        <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>{school.name}</td>
                        <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{school.cutoff8}</td>
                        <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{school.cutoff9}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
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
                  "Answer all 114 questions—there's no penalty for guessing",
                  "Master your stronger subject for bigger score gains",
                  "Aim for 100+ correct to be Stuyvesant-competitive",
                  "Track your practice test progress over time"
                ].map((tip, index) => (
                  <li key={index} style={{ display: "flex", alignItems: "flex-start", marginBottom: "12px", fontSize: "0.875rem", color: "#4B5563" }}>
                    <span style={{ color: "#F97316", marginRight: "8px", fontWeight: "bold" }}>✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Important Note */}
            <div style={{ 
              backgroundColor: "#FEF3C7", 
              borderRadius: "16px", 
              padding: "24px",
              marginBottom: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "12px" }}>
                ⚠️ Important Note
              </h3>
              <p style={{ fontSize: "0.875rem", color: "#92400E", lineHeight: "1.6" }}>
                This calculator provides <strong>conservative estimates</strong> for practice purposes. Actual DOE scoring curves vary each year. Use this to track progress, not as an exact prediction.
              </p>
            </div>

            {/* Related Tools */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                Related Tools
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { href: "/quorum-calculator", name: "Quorum Calculator", desc: "Calculate meeting quorum requirements" },
                  { href: "/productivity-calculator", name: "Productivity Calculator", desc: "Measure work efficiency" },
                  { href: "/black-scholes-calculator", name: "Black-Scholes Calculator", desc: "Calculate option prices" }
                ].map((tool, index) => (
                  <Link 
                    key={index}
                    href={tool.href} 
                    style={{ 
                      display: "block",
                      padding: "12px", 
                      borderRadius: "12px", 
                      border: "1px solid #E5E7EB",
                      textDecoration: "none"
                    }}
                  >
                    <p style={{ fontWeight: "500", color: "#111827", marginBottom: "4px" }}>{tool.name}</p>
                    <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>{tool.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
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