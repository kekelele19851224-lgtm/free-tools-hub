"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// FAQ数据
const faqs = [
  {
    question: "What happens if a quorum is not reached?",
    answer: "If a quorum is not present, the meeting can still occur for discussion purposes, but no official votes or binding decisions can be made. The meeting may need to be adjourned and rescheduled."
  },
  {
    question: "Can a quorum requirement be changed?",
    answer: "Yes, quorum requirements are typically defined in an organization's bylaws and can be amended through the proper amendment process, which usually requires a supermajority vote."
  },
  {
    question: "Does quorum include proxy votes?",
    answer: "This depends on your organization's bylaws. Some organizations count proxy votes toward quorum, while others require physical (or virtual) presence. Check your specific governing documents."
  },
  {
    question: "What's the difference between quorum and majority vote?",
    answer: "Quorum refers to the minimum attendance required to hold a valid meeting. A majority vote refers to how many votes are needed to pass a motion once quorum is established. They are related but distinct concepts."
  },
  {
    question: "What is the most common quorum requirement?",
    answer: "The most common quorum requirement is a simple majority, meaning more than half of the members (50% + 1) must be present. However, this varies by organization and jurisdiction."
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

export default function QuorumCalculator() {
  const [totalMembers, setTotalMembers] = useState<string>("");
  const [quorumType, setQuorumType] = useState<string>("majority");
  const [customPercentage, setCustomPercentage] = useState<string>("50");
  const [result, setResult] = useState<number | null>(null);
  const [percentage, setPercentage] = useState<number | null>(null);

  const calculateQuorum = () => {
    const total = parseInt(totalMembers);
    if (isNaN(total) || total <= 0) {
      alert("Please enter a valid number of members");
      return;
    }

    let quorum: number;
    let pct: number;

    switch (quorumType) {
      case "majority":
        quorum = Math.floor(total / 2) + 1;
        pct = 50;
        break;
      case "two-thirds":
        quorum = Math.ceil((total * 2) / 3);
        pct = 66.67;
        break;
      case "three-fourths":
        quorum = Math.ceil((total * 3) / 4);
        pct = 75;
        break;
      case "custom":
        const customPct = parseFloat(customPercentage);
        if (isNaN(customPct) || customPct <= 0 || customPct > 100) {
          alert("Please enter a valid percentage (1-100)");
          return;
        }
        quorum = Math.ceil((total * customPct) / 100);
        pct = customPct;
        break;
      default:
        quorum = Math.floor(total / 2) + 1;
        pct = 50;
    }

    setResult(quorum);
    setPercentage(pct);
  };

  const reset = () => {
    setTotalMembers("");
    setQuorumType("majority");
    setCustomPercentage("50");
    setResult(null);
    setPercentage(null);
  };

  const progressPercentage = result && totalMembers 
    ? Math.round((result / parseInt(totalMembers)) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav className="text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Quorum Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title Section */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#111827", marginBottom: "12px" }}>
            Quorum Calculator
          </h1>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate the minimum number of members required for a valid vote or decision in your organization, board meeting, or assembly.
          </p>
        </div>

        {/* Calculator Section - 使用flexbox强制左右布局 */}
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
                Enter Details
              </h2>
              
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  Total Number of Members
                </label>
                <input
                  type="number"
                  value={totalMembers}
                  onChange={(e) => setTotalMembers(e.target.value)}
                  placeholder="e.g., 100"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "12px",
                    fontSize: "1.125rem",
                    outline: "none"
                  }}
                  min="1"
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  Quorum Type
                </label>
                <select
                  value={quorumType}
                  onChange={(e) => setQuorumType(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "12px",
                    fontSize: "1.125rem",
                    backgroundColor: "white",
                    cursor: "pointer"
                  }}
                >
                  <option value="majority">Simple Majority (50% + 1)</option>
                  <option value="two-thirds">Two-Thirds (66.67%)</option>
                  <option value="three-fourths">Three-Fourths (75%)</option>
                  <option value="custom">Custom Percentage</option>
                </select>
              </div>

              {quorumType === "custom" && (
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                    Custom Percentage (%)
                  </label>
                  <input
                    type="number"
                    value={customPercentage}
                    onChange={(e) => setCustomPercentage(e.target.value)}
                    placeholder="e.g., 60"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "12px",
                      fontSize: "1.125rem"
                    }}
                    min="1"
                    max="100"
                  />
                </div>
              )}

              <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                <button
                  onClick={calculateQuorum}
                  style={{
                    flex: "1",
                    backgroundColor: "#2563EB",
                    color: "white",
                    padding: "14px 24px",
                    borderRadius: "12px",
                    fontWeight: "600",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem"
                  }}
                >
                  Calculate Quorum
                </button>
                <button
                  onClick={reset}
                  style={{
                    padding: "14px 24px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "12px",
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
            <div style={{ flex: "1", minWidth: "300px", display: "flex", alignItems: "center" }}>
              <div style={{ 
                background: "linear-gradient(135deg, #EFF6FF 0%, #E0E7FF 100%)", 
                borderRadius: "16px", 
                padding: "40px",
                textAlign: "center",
                width: "100%"
              }}>
                <p style={{ fontSize: "0.875rem", fontWeight: "600", color: "#2563EB", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
                  Quorum Required
                </p>
                <p style={{ fontSize: "4.5rem", fontWeight: "bold", color: "#2563EB", marginBottom: "8px", lineHeight: "1" }}>
                  {result !== null ? result : "—"}
                </p>
                <p style={{ color: "#4B5563", marginBottom: "24px" }}>
                  {result !== null && totalMembers
                    ? `out of ${totalMembers} members (${progressPercentage}%)`
                    : "Enter values and click Calculate"}
                </p>

                {/* Progress Bar */}
                {result !== null && totalMembers && (
                  <div style={{ marginTop: "16px" }}>
                    <div style={{ width: "100%", backgroundColor: "#BFDBFE", borderRadius: "9999px", height: "12px" }}>
                      <div
                        style={{ 
                          backgroundColor: "#2563EB", 
                          height: "12px", 
                          borderRadius: "9999px",
                          width: `${progressPercentage}%`,
                          transition: "width 0.5s ease"
                        }}
                      ></div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "0.875rem", color: "#6B7280" }}>
                      <span>0</span>
                      <span>{totalMembers}</span>
                    </div>
                  </div>
                )}

                {/* Quick Info */}
                {result !== null && (
                  <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #BFDBFE" }}>
                    <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "12px" }}>
                        <p style={{ color: "#6B7280", fontSize: "0.875rem" }}>Quorum Type</p>
                        <p style={{ fontWeight: "600", color: "#111827" }}>
                          {quorumType === "majority" && "Simple Majority"}
                          {quorumType === "two-thirds" && "Two-Thirds"}
                          {quorumType === "three-fourths" && "Three-Fourths"}
                          {quorumType === "custom" && `Custom (${customPercentage}%)`}
                        </p>
                      </div>
                      <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "12px" }}>
                        <p style={{ color: "#6B7280", fontSize: "0.875rem" }}>Minimum %</p>
                        <p style={{ fontWeight: "600", color: "#111827" }}>{percentage}%</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section - 两栏布局 */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content - 左侧宽 */}
          <div style={{ flex: "2", minWidth: "400px" }}>
            {/* What is Quorum */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                What is a Quorum?
              </h2>
              <p style={{ color: "#4B5563", marginBottom: "16px", lineHeight: "1.7" }}>
                A quorum is the minimum number of members required to be present at a meeting before official business can be conducted. Without a quorum, any votes or decisions made may be considered invalid.
              </p>
              <p style={{ color: "#4B5563", lineHeight: "1.7" }}>
                The concept of quorum is essential in corporate governance, legislative bodies, non-profit organizations, homeowners associations, and any group that makes collective decisions through voting.
              </p>
            </div>

            {/* How to Calculate */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                How to Calculate Quorum
              </h2>
              <p style={{ color: "#4B5563", marginBottom: "16px", lineHeight: "1.7" }}>
                The formula for calculating quorum depends on your organization&apos;s bylaws:
              </p>
              <div style={{ 
                backgroundColor: "#F3F4F6", 
                padding: "16px", 
                borderRadius: "12px", 
                marginBottom: "16px",
                fontFamily: "monospace",
                fontSize: "0.875rem"
              }}>
                Quorum = Total Members × Required Percentage
              </div>
              <p style={{ color: "#4B5563", marginBottom: "24px", lineHeight: "1.7" }}>
                For a simple majority, divide the total number by 2 and add 1. For example, if you have 25 members, the quorum would be 13 (25 ÷ 2 = 12.5, rounded down to 12, plus 1 = 13).
              </p>
              
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827", marginBottom: "16px" }}>
                Common Quorum Types
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", padding: "16px", backgroundColor: "#EFF6FF", borderRadius: "12px" }}>
                  <span style={{ color: "#2563EB", fontWeight: "bold", marginRight: "16px", minWidth: "60px" }}>50%+1</span>
                  <div>
                    <p style={{ fontWeight: "500", color: "#111827" }}>Simple Majority</p>
                    <p style={{ fontSize: "0.875rem", color: "#4B5563" }}>Most common requirement for regular meetings</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", padding: "16px", backgroundColor: "#FFF7ED", borderRadius: "12px" }}>
                  <span style={{ color: "#EA580C", fontWeight: "bold", marginRight: "16px", minWidth: "60px" }}>66.67%</span>
                  <div>
                    <p style={{ fontWeight: "500", color: "#111827" }}>Two-Thirds</p>
                    <p style={{ fontSize: "0.875rem", color: "#4B5563" }}>Often required for amending bylaws</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", padding: "16px", backgroundColor: "#F5F3FF", borderRadius: "12px" }}>
                  <span style={{ color: "#7C3AED", fontWeight: "bold", marginRight: "16px", minWidth: "60px" }}>75%</span>
                  <div>
                    <p style={{ fontWeight: "500", color: "#111827" }}>Three-Fourths</p>
                    <p style={{ fontSize: "0.875rem", color: "#4B5563" }}>Used for major constitutional changes</p>
                  </div>
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
                  "Always check your organization's bylaws for specific quorum requirements",
                  "Count only voting members, not honorary or non-voting members",
                  "Verify quorum at the start of every meeting",
                  "Document attendance for official records"
                ].map((tip, index) => (
                  <li key={index} style={{ display: "flex", alignItems: "flex-start", marginBottom: "12px", fontSize: "0.875rem", color: "#4B5563" }}>
                    <span style={{ color: "#22C55E", marginRight: "8px", fontWeight: "bold" }}>✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <RelatedTools currentUrl="/quorum-calculator" currentCategory="Business" />
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
