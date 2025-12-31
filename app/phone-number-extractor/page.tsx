"use client";

import { useState } from "react";
import Link from "next/link";

// FAQ数据
const faqs = [
  {
    question: "How do I extract phone numbers from text?",
    answer: "Simply paste your text containing phone numbers into the input box, select your preferred options (like removing duplicates or filtering by format), and click 'Extract Phone Numbers'. The tool will instantly find and list all phone numbers in your text."
  },
  {
    question: "Can I extract phone numbers from PDF files?",
    answer: "Yes! To extract phone numbers from a PDF, first open your PDF document and copy the text content (Ctrl+C or Cmd+C), then paste it into our input box. The extractor will find all phone numbers in the pasted text."
  },
  {
    question: "What phone number formats are supported?",
    answer: "Our extractor supports all common formats including: US formats like (555) 123-4567, 555-123-4567, 555.123.4567; international formats with country codes like +1, +44, +91; and toll-free numbers like 1-800-555-1234."
  },
  {
    question: "How do I extract only US phone numbers?",
    answer: "Use the 'Format Filter' dropdown and select 'US Only'. This will filter results to show only phone numbers that match US formatting patterns, including numbers with +1 country code and standard 10-digit formats."
  },
  {
    question: "Is this phone number extractor free to use?",
    answer: "Yes, this tool is 100% free with no limits. You can extract as many phone numbers as you need, and all processing happens in your browser - your data is never sent to any server."
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

// 电话号码格式类型
interface ExtractedNumber {
  original: string;
  normalized: string;
  format: string;
}

export default function PhoneNumberExtractor() {
  const [inputText, setInputText] = useState("");
  const [removeDuplicates, setRemoveDuplicates] = useState(true);
  const [includeInternational, setIncludeInternational] = useState(true);
  const [formatFilter, setFormatFilter] = useState("all");
  const [results, setResults] = useState<ExtractedNumber[]>([]);
  const [duplicatesRemoved, setDuplicatesRemoved] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // 提取电话号码
  const extractPhoneNumbers = () => {
    if (!inputText.trim()) {
      alert("Please paste some text first");
      return;
    }

    // 综合正则表达式匹配多种电话格式
    const phonePatterns = [
      // International with + (e.g., +1 555 123 4567, +44 20 7946 0958)
      /\+\d{1,3}[\s.-]?\(?\d{1,4}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,4}[\s.-]?\d{0,4}/g,
      // US format with parentheses (e.g., (555) 123-4567)
      /\(\d{3}\)[\s.-]?\d{3}[\s.-]?\d{4}/g,
      // US format with dashes/dots/spaces (e.g., 555-123-4567, 555.123.4567)
      /\b\d{3}[\s.-]\d{3}[\s.-]\d{4}\b/g,
      // US format with country code (e.g., 1-800-555-1234)
      /\b1[\s.-]?\d{3}[\s.-]?\d{3}[\s.-]?\d{4}\b/g,
      // 10 consecutive digits
      /\b\d{10}\b/g,
      // 11 consecutive digits (with country code)
      /\b\d{11}\b/g,
    ];

    const foundNumbers: ExtractedNumber[] = [];
    const seenNormalized = new Set<string>();

    phonePatterns.forEach(pattern => {
      const matches = inputText.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const normalized = match.replace(/[\s.\-()]/g, "");
          
          // 检测格式类型
          let format = "other";
          if (match.startsWith("+1") || /^1?\d{10}$/.test(normalized)) {
            format = "us";
          } else if (match.startsWith("+44")) {
            format = "uk";
          } else if (match.startsWith("+")) {
            format = "international";
          } else if (/^\d{10}$/.test(normalized)) {
            format = "us";
          }

          // 根据筛选条件过滤
          if (formatFilter === "us" && format !== "us") return;
          if (formatFilter === "uk" && format !== "uk") return;
          if (formatFilter === "international" && !match.startsWith("+")) return;
          if (!includeInternational && match.startsWith("+") && !match.startsWith("+1")) return;

          // 去重处理
          if (removeDuplicates) {
            if (seenNormalized.has(normalized)) {
              return;
            }
            seenNormalized.add(normalized);
          }

          foundNumbers.push({
            original: match.trim(),
            normalized,
            format
          });
        });
      }
    });

    // 计算去重数量
    const allMatches: string[] = [];
    phonePatterns.forEach(pattern => {
      const matches = inputText.match(pattern);
      if (matches) allMatches.push(...matches);
    });
    
    const uniqueCount = new Set(allMatches.map(m => m.replace(/[\s.\-()]/g, ""))).size;
    setDuplicatesRemoved(allMatches.length - uniqueCount);

    // 去除结果中的重复项（基于normalized）
    const uniqueResults: ExtractedNumber[] = [];
    const seen = new Set<string>();
    foundNumbers.forEach(num => {
      if (!seen.has(num.normalized)) {
        seen.add(num.normalized);
        uniqueResults.push(num);
      }
    });

    setResults(uniqueResults);
  };

  // 清空
  const clearAll = () => {
    setInputText("");
    setResults([]);
    setDuplicatesRemoved(0);
  };

  // 复制单个号码
  const copyNumber = (number: string, index: number) => {
    navigator.clipboard.writeText(number);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  // 复制全部
  const copyAll = () => {
    const allNumbers = results.map(r => r.original).join("\n");
    navigator.clipboard.writeText(allNumbers);
    alert(`Copied ${results.length} phone numbers to clipboard!`);
  };

  // 下载CSV
  const downloadCSV = () => {
    const csvContent = "Phone Number,Normalized,Format\n" + 
      results.map(r => `"${r.original}","${r.normalized}","${r.format}"`).join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "phone_numbers.csv";
    link.click();
  };

  // 获取格式标签颜色
  const getFormatBadge = (format: string) => {
    switch (format) {
      case "us":
        return { bg: "#DBEAFE", color: "#1D4ED8", label: "US" };
      case "uk":
        return { bg: "#FEE2E2", color: "#DC2626", label: "UK" };
      case "international":
        return { bg: "#D1FAE5", color: "#059669", label: "Intl" };
      default:
        return { bg: "#F3F4F6", color: "#6B7280", label: "Other" };
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
            <span className="text-gray-900">Phone Number Extractor</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title Section */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#111827", marginBottom: "12px" }}>
            Phone Number Extractor
          </h1>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Extract phone numbers from any text instantly. Supports US, UK, and international formats. Perfect for extracting contacts from emails, documents, PDFs, and web content.
          </p>
        </div>

        {/* Extractor Section */}
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
                Paste Your Text
              </h2>

              {/* Text Input */}
              <div style={{ marginBottom: "20px" }}>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste any text containing phone numbers here...&#10;&#10;Example:&#10;Contact John at (555) 123-4567 or email him.&#10;Mary's number is 800-555-1234.&#10;International: +44 20 7946 0958"
                  style={{
                    width: "100%",
                    height: "200px",
                    padding: "12px 16px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    resize: "vertical",
                    outline: "none",
                    fontFamily: "inherit"
                  }}
                />
              </div>

              {/* Options */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "12px" }}>
                  ⚙️ Options
                </label>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={removeDuplicates}
                      onChange={(e) => setRemoveDuplicates(e.target.checked)}
                      style={{ width: "16px", height: "16px", accentColor: "#2563EB" }}
                    />
                    <span style={{ fontSize: "0.875rem", color: "#4B5563" }}>Remove duplicates</span>
                  </label>
                  
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={includeInternational}
                      onChange={(e) => setIncludeInternational(e.target.checked)}
                      style={{ width: "16px", height: "16px", accentColor: "#2563EB" }}
                    />
                    <span style={{ fontSize: "0.875rem", color: "#4B5563" }}>Include international numbers</span>
                  </label>
                </div>
              </div>

              {/* Format Filter */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  📍 Format Filter
                </label>
                <select
                  value={formatFilter}
                  onChange={(e) => setFormatFilter(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    outline: "none",
                    backgroundColor: "white"
                  }}
                >
                  <option value="all">All Formats</option>
                  <option value="us">US Only (+1, xxx-xxx-xxxx)</option>
                  <option value="uk">UK Only (+44)</option>
                  <option value="international">International Only (+xx)</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={extractPhoneNumbers}
                  style={{
                    flex: "1",
                    backgroundColor: "#2563EB",
                    color: "white",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontWeight: "600",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem"
                  }}
                >
                  🔍 Extract Phone Numbers
                </button>
                <button
                  onClick={clearAll}
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
                  Clear
                </button>
              </div>
            </div>

            {/* Right: Result Section */}
            <div style={{ flex: "1", minWidth: "300px" }}>
              {/* Result Header */}
              <div style={{ 
                background: "linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)", 
                borderRadius: "16px", 
                padding: "24px",
                marginBottom: "16px",
                textAlign: "center"
              }}>
                <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#1D4ED8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                  Phone Numbers Found
                </p>
                <p style={{ fontSize: "3rem", fontWeight: "bold", color: "#1D4ED8", lineHeight: "1" }}>
                  {results.length > 0 ? results.length : "—"}
                </p>
                <p style={{ color: "#1E40AF", marginTop: "8px", fontSize: "0.875rem" }}>
                  {results.length > 0 
                    ? (duplicatesRemoved > 0 ? `${duplicatesRemoved} duplicates removed` : "unique numbers")
                    : "Paste text and click extract"}
                </p>
              </div>

              {/* Results List */}
              {results.length > 0 && (
                <div style={{ 
                  backgroundColor: "#F9FAFB", 
                  borderRadius: "12px", 
                  padding: "16px",
                  marginBottom: "16px",
                  maxHeight: "280px",
                  overflowY: "auto"
                }}>
                  {results.map((result, index) => {
                    const badge = getFormatBadge(result.format);
                    return (
                      <div 
                        key={index}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "10px 12px",
                          backgroundColor: "white",
                          borderRadius: "8px",
                          marginBottom: "8px",
                          border: "1px solid #E5E7EB"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ 
                            fontWeight: "500", 
                            color: "#111827",
                            fontFamily: "monospace",
                            fontSize: "0.95rem"
                          }}>
                            {result.original}
                          </span>
                          <span style={{
                            padding: "2px 8px",
                            borderRadius: "4px",
                            fontSize: "0.7rem",
                            fontWeight: "600",
                            backgroundColor: badge.bg,
                            color: badge.color
                          }}>
                            {badge.label}
                          </span>
                        </div>
                        <button
                          onClick={() => copyNumber(result.original, index)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "1rem",
                            padding: "4px 8px"
                          }}
                          title="Copy number"
                        >
                          {copiedIndex === index ? "✅" : "📋"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Export Buttons */}
              {results.length > 0 && (
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={copyAll}
                    style={{
                      flex: "1",
                      padding: "12px",
                      backgroundColor: "#F3F4F6",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#374151"
                    }}
                  >
                    📋 Copy All
                  </button>
                  <button
                    onClick={downloadCSV}
                    style={{
                      flex: "1",
                      padding: "12px",
                      backgroundColor: "#F3F4F6",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#374151"
                    }}
                  >
                    ⬇️ Download CSV
                  </button>
                </div>
              )}

              {/* Empty State */}
              {results.length === 0 && (
                <div style={{ 
                  backgroundColor: "#F9FAFB", 
                  borderRadius: "12px", 
                  padding: "24px",
                  textAlign: "center"
                }}>
                  <p style={{ fontSize: "2.5rem", marginBottom: "12px" }}>📱</p>
                  <p style={{ color: "#6B7280", fontSize: "0.875rem" }}>
                    Extracted phone numbers will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section - 两栏布局 */}
        <div style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content - 左侧宽 */}
          <div style={{ flex: "2", minWidth: "400px" }}>
            {/* How to Use */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                How to Use This Phone Number Extractor
              </h2>
              <p style={{ color: "#4B5563", marginBottom: "16px", lineHeight: "1.7" }}>
                Our free phone number extractor tool makes it easy to find and extract all phone numbers from any text. Follow these simple steps:
              </p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { step: "1", title: "Paste Your Text", desc: "Copy text from any source (email, document, website) and paste it into the input box." },
                  { step: "2", title: "Set Options", desc: "Choose whether to remove duplicates and include international numbers." },
                  { step: "3", title: "Click Extract", desc: "Hit the 'Extract Phone Numbers' button to find all phone numbers instantly." },
                  { step: "4", title: "Export Results", desc: "Copy individual numbers, copy all, or download as CSV file." }
                ].map((item, index) => (
                  <div key={index} style={{ display: "flex", gap: "12px", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                    <div style={{ 
                      width: "28px", 
                      height: "28px", 
                      borderRadius: "50%", 
                      backgroundColor: "#2563EB", 
                      color: "white", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      fontWeight: "600",
                      fontSize: "0.875rem",
                      flexShrink: 0
                    }}>
                      {item.step}
                    </div>
                    <div>
                      <p style={{ fontWeight: "600", color: "#111827", marginBottom: "2px" }}>{item.title}</p>
                      <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Extract from PDF */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                Extract Phone Numbers from PDF Documents
              </h2>
              <p style={{ color: "#4B5563", marginBottom: "16px", lineHeight: "1.7" }}>
                Need to extract phone numbers from a PDF file? It&apos;s easy! Simply open your PDF document, select all text (Ctrl+A or Cmd+A), copy it (Ctrl+C or Cmd+C), and paste it into our extractor tool.
              </p>
              
              <div style={{ 
                backgroundColor: "#DBEAFE", 
                padding: "16px", 
                borderRadius: "12px",
                borderLeft: "4px solid #2563EB"
              }}>
                <p style={{ fontWeight: "600", color: "#1D4ED8", marginBottom: "8px" }}>💡 Pro Tip</p>
                <p style={{ fontSize: "0.875rem", color: "#1E40AF" }}>
                  This method also works for extracting phone numbers from LinkedIn profiles, Instagram bios, Facebook pages, and any other web content. Just copy and paste!
                </p>
              </div>
            </div>

            {/* Supported Formats */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                US Phone Number Formats Supported
              </h2>
              <p style={{ color: "#4B5563", marginBottom: "16px", lineHeight: "1.7" }}>
                Our extractor automatically recognizes all common US and international phone number formats:
              </p>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
                {[
                  { format: "(555) 123-4567", desc: "Standard US" },
                  { format: "555-123-4567", desc: "Dashes" },
                  { format: "555.123.4567", desc: "Dots" },
                  { format: "555 123 4567", desc: "Spaces" },
                  { format: "1-800-555-1234", desc: "Toll-free" },
                  { format: "+1 555 123 4567", desc: "Country code" },
                  { format: "+44 20 7946 0958", desc: "UK format" },
                  { format: "+91 98765 43210", desc: "International" }
                ].map((item, index) => (
                  <div key={index} style={{ padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                    <p style={{ fontFamily: "monospace", fontWeight: "600", color: "#111827", marginBottom: "2px" }}>{item.format}</p>
                    <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - 右侧窄 */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Use Cases */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "24px",
              marginBottom: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                📱 Common Use Cases
              </h3>
              <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
                {[
                  "Extract contacts from emails",
                  "Build marketing call lists",
                  "Process PDF documents",
                  "Clean up CRM data",
                  "Gather leads from websites",
                  "Organize contact databases"
                ].map((item, index) => (
                  <li key={index} style={{ display: "flex", alignItems: "flex-start", marginBottom: "12px", fontSize: "0.875rem", color: "#4B5563" }}>
                    <span style={{ color: "#2563EB", marginRight: "8px", fontWeight: "bold" }}>✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Features */}
            <div style={{ 
              backgroundColor: "#DBEAFE", 
              borderRadius: "16px", 
              padding: "24px",
              marginBottom: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#1D4ED8", marginBottom: "12px" }}>
                ✨ Features
              </h3>
              <ul style={{ listStyle: "none", padding: "0", margin: "0", fontSize: "0.875rem", color: "#1E40AF" }}>
                <li style={{ marginBottom: "8px" }}>• 100% Free, no limits</li>
                <li style={{ marginBottom: "8px" }}>• Instant extraction</li>
                <li style={{ marginBottom: "8px" }}>• Duplicate removal</li>
                <li style={{ marginBottom: "8px" }}>• Multiple formats</li>
                <li style={{ marginBottom: "8px" }}>• CSV export</li>
                <li>• Privacy safe (browser-only)</li>
              </ul>
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
                  { href: "/alliteration-generator", name: "Alliteration Generator", desc: "Create catchy phrases" },
                  { href: "/horse-name-generator", name: "Horse Name Generator", desc: "Generate unique names" },
                  { href: "/productivity-calculator", name: "Productivity Calculator", desc: "Measure work efficiency" }
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