"use client";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

export default function PineStrawCalculator() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Pine Straw Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
            Pine Straw Calculator
          </h1>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px", marginTop: "12px" }}>
            Calculate how many bales of pine straw you need for landscaping. Get coverage estimates for different depths with DIY and professional installation costs.
          </p>
        </div>

        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
          <p style={{ color: "#4B5563" }}>
            This tool is coming soon. In the meantime, explore other home calculators from the homepage.
          </p>
        </div>

        <div style={{ marginTop: "24px" }}>
          <RelatedTools currentUrl="/pine-straw-calculator" currentCategory="Home" />
        </div>
      </div>
    </div>
  );
}

