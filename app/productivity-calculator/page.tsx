"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// FAQ数据
const faqs = [
  {
    question: "What is a good productivity rate?",
    answer: "A 'good' productivity rate varies by industry. In manufacturing, producing more units per hour than the industry average is considered good. For service businesses, it might be measured by revenue per employee. Generally, any improvement over your previous baseline indicates progress."
  },
  {
    question: "How do I measure productivity for service businesses?",
    answer: "For service businesses, use revenue or billable hours as your output. For example, a consulting firm might measure productivity as revenue generated per consultant per hour. You can also track completed tasks, projects delivered, or clients served."
  },
  {
    question: "What's the difference between productivity and efficiency?",
    answer: "Productivity measures how much output you generate from your inputs (e.g., $100 per hour worked). Efficiency measures how well you use resources to achieve a goal (e.g., completing a task with minimal waste). You can be productive but inefficient, or efficient but not very productive."
  },
  {
    question: "How can I improve my productivity?",
    answer: "Key strategies include: eliminating distractions, batching similar tasks, using time-blocking techniques, automating repetitive work, taking regular breaks to maintain focus, setting clear goals, and tracking your metrics to identify improvement areas."
  },
  {
    question: "Can this calculator be used for personal productivity?",
    answer: "Yes! For personal use, define your 'output' as tasks completed, words written, or any measurable goal. Your 'input' is the time spent. This helps you understand your personal work patterns and identify your most productive hours."
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

export default function ProductivityCalculator() {
  const [totalOutput, setTotalOutput] = useState<string>("");
  const [employees, setEmployees] = useState<string>("");
  const [totalHours, setTotalHours] = useState<string>("");
  const [outputType, setOutputType] = useState<string>("revenue");
  
  const [productivityPerHour, setProductivityPerHour] = useState<number | null>(null);
  const [productivityPerEmployee, setProductivityPerEmployee] = useState<number | null>(null);
  const [productivityPerEmployeePerHour, setProductivityPerEmployeePerHour] = useState<number | null>(null);

  const calculateProductivity = () => {
    const output = parseFloat(totalOutput);
    const numEmployees = parseInt(employees);
    const hours = parseFloat(totalHours);

    if (isNaN(output) || output <= 0) {
      alert("Please enter a valid output value");
      return;
    }
    if (isNaN(numEmployees) || numEmployees <= 0) {
      alert("Please enter a valid number of employees");
      return;
    }
    if (isNaN(hours) || hours <= 0) {
      alert("Please enter valid total hours");
      return;
    }

    const perHour = output / hours;
    const perEmployee = output / numEmployees;
    const perEmployeePerHour = output / hours; // This is total productivity per hour

    setProductivityPerHour(perHour);
    setProductivityPerEmployee(perEmployee);
    setProductivityPerEmployeePerHour(perEmployee / (hours / numEmployees));
  };

  const reset = () => {
    setTotalOutput("");
    setEmployees("");
    setTotalHours("");
    setOutputType("revenue");
    setProductivityPerHour(null);
    setProductivityPerEmployee(null);
    setProductivityPerEmployeePerHour(null);
  };

  const formatOutput = (value: number | null) => {
    if (value === null) return "—";
    if (outputType === "revenue") {
      return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getUnitLabel = () => {
    switch (outputType) {
      case "revenue": return "revenue";
      case "units": return "units";
      case "tasks": return "tasks";
      default: return "output";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav className="text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Productivity Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title Section */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#111827", marginBottom: "12px" }}>
            Productivity Calculator
          </h1>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate your productivity per hour and per employee. Measure work efficiency and optimize your team&apos;s performance with data-driven insights.
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
                Enter Your Data
              </h2>
              
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  Output Type
                </label>
                <select
                  value={outputType}
                  onChange={(e) => setOutputType(e.target.value)}
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
                  <option value="revenue">Revenue ($)</option>
                  <option value="units">Units Produced</option>
                  <option value="tasks">Tasks Completed</option>
                </select>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  Total Output {outputType === "revenue" ? "($)" : ""}
                </label>
                <input
                  type="number"
                  value={totalOutput}
                  onChange={(e) => setTotalOutput(e.target.value)}
                  placeholder={outputType === "revenue" ? "e.g., 10000" : "e.g., 500"}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "12px",
                    fontSize: "1.125rem",
                    outline: "none"
                  }}
                  min="0"
                  step="any"
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  Number of Employees
                </label>
                <input
                  type="number"
                  value={employees}
                  onChange={(e) => setEmployees(e.target.value)}
                  placeholder="e.g., 5"
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
                  Total Hours Worked
                </label>
                <input
                  type="number"
                  value={totalHours}
                  onChange={(e) => setTotalHours(e.target.value)}
                  placeholder="e.g., 200"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "12px",
                    fontSize: "1.125rem",
                    outline: "none"
                  }}
                  min="0"
                  step="any"
                />
                <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "4px" }}>
                  Total hours worked by all employees combined
                </p>
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                <button
                  onClick={calculateProductivity}
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
                  Calculate Productivity
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
                background: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)", 
                borderRadius: "16px", 
                padding: "40px",
                textAlign: "center",
                width: "100%"
              }}>
                <p style={{ fontSize: "0.875rem", fontWeight: "600", color: "#059669", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
                  Productivity Per Hour
                </p>
                <p style={{ fontSize: "3.5rem", fontWeight: "bold", color: "#059669", marginBottom: "8px", lineHeight: "1" }}>
                  {formatOutput(productivityPerHour)}
                </p>
                <p style={{ color: "#4B5563", marginBottom: "24px" }}>
                  {productivityPerHour !== null
                    ? `${getUnitLabel()} per hour`
                    : "Enter values and click Calculate"}
                </p>

                {/* Additional Metrics */}
                {productivityPerHour !== null && (
                  <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #A7F3D0" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "16px" }}>
                        <p style={{ color: "#6B7280", fontSize: "0.75rem", marginBottom: "4px" }}>Per Employee</p>
                        <p style={{ fontWeight: "bold", color: "#111827", fontSize: "1.25rem" }}>
                          {formatOutput(productivityPerEmployee)}
                        </p>
                      </div>
                      <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "16px" }}>
                        <p style={{ color: "#6B7280", fontSize: "0.75rem", marginBottom: "4px" }}>Per Employee/Hour</p>
                        <p style={{ fontWeight: "bold", color: "#111827", fontSize: "1.25rem" }}>
                          {formatOutput(productivityPerEmployeePerHour)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Summary */}
                {productivityPerHour !== null && totalOutput && employees && totalHours && (
                  <div style={{ marginTop: "16px", padding: "16px", backgroundColor: "white", borderRadius: "8px", textAlign: "left" }}>
                    <p style={{ fontSize: "0.875rem", color: "#4B5563" }}>
                      <strong>{employees}</strong> employee{parseInt(employees) > 1 ? "s" : ""} worked <strong>{totalHours}</strong> total hours to produce <strong>{outputType === "revenue" ? "$" : ""}{parseFloat(totalOutput).toLocaleString()}</strong> {outputType !== "revenue" ? getUnitLabel() : ""} in output.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section - 两栏布局 */}
        <div style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content - 左侧宽 */}
          <div style={{ flex: "2", minWidth: "400px" }}>
            {/* What is Productivity */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                What is Productivity?
              </h2>
              <p style={{ color: "#4B5563", marginBottom: "16px", lineHeight: "1.7" }}>
                Productivity is a measure of how efficiently resources (time, labor, capital) are converted into valuable output. It&apos;s typically expressed as a ratio of output to input, such as revenue per hour worked or units produced per employee.
              </p>
              <p style={{ color: "#4B5563", lineHeight: "1.7" }}>
                Understanding and tracking productivity is essential for businesses of all sizes. It helps identify inefficiencies, optimize resource allocation, benchmark against competitors, and make data-driven decisions to improve profitability and growth.
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
                How to Calculate Productivity
              </h2>
              <p style={{ color: "#4B5563", marginBottom: "16px", lineHeight: "1.7" }}>
                The basic productivity formula is simple:
              </p>
              <div style={{ 
                backgroundColor: "#F3F4F6", 
                padding: "16px", 
                borderRadius: "12px", 
                marginBottom: "16px",
                fontFamily: "monospace",
                fontSize: "0.875rem"
              }}>
                Productivity = Total Output ÷ Total Input
              </div>
              <p style={{ color: "#4B5563", marginBottom: "24px", lineHeight: "1.7" }}>
                For example, if your team generates $50,000 in revenue over 1,000 hours of work, your productivity is $50 per hour. This simple metric can reveal powerful insights about your business efficiency.
              </p>
              
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827", marginBottom: "16px" }}>
                Common Productivity Metrics
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", padding: "16px", backgroundColor: "#ECFDF5", borderRadius: "12px" }}>
                  <span style={{ color: "#059669", fontWeight: "bold", marginRight: "16px", minWidth: "120px" }}>Per Hour</span>
                  <div>
                    <p style={{ fontWeight: "500", color: "#111827" }}>Output ÷ Total Hours</p>
                    <p style={{ fontSize: "0.875rem", color: "#4B5563" }}>Most common metric for measuring work efficiency</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", padding: "16px", backgroundColor: "#EFF6FF", borderRadius: "12px" }}>
                  <span style={{ color: "#2563EB", fontWeight: "bold", marginRight: "16px", minWidth: "120px" }}>Per Employee</span>
                  <div>
                    <p style={{ fontWeight: "500", color: "#111827" }}>Output ÷ Number of Employees</p>
                    <p style={{ fontSize: "0.875rem", color: "#4B5563" }}>Useful for comparing team performance and headcount planning</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", padding: "16px", backgroundColor: "#FFF7ED", borderRadius: "12px" }}>
                  <span style={{ color: "#EA580C", fontWeight: "bold", marginRight: "16px", minWidth: "120px" }}>Per Labor $</span>
                  <div>
                    <p style={{ fontWeight: "500", color: "#111827" }}>Output ÷ Labor Cost</p>
                    <p style={{ fontSize: "0.875rem", color: "#4B5563" }}>Shows return on investment for your workforce</p>
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
                  "Track productivity consistently over time to identify trends",
                  "Compare productivity across different teams or departments",
                  "Consider quality alongside quantity when measuring output",
                  "Use industry benchmarks to set realistic productivity goals"
                ].map((tip, index) => (
                  <li key={index} style={{ display: "flex", alignItems: "flex-start", marginBottom: "12px", fontSize: "0.875rem", color: "#4B5563" }}>
                    <span style={{ color: "#22C55E", marginRight: "8px", fontWeight: "bold" }}>✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <RelatedTools currentUrl="/productivity-calculator" currentCategory="Lifestyle" />
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
