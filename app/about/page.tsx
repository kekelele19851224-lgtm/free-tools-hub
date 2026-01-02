"use client";

import Link from "next/link";

export default function About() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "24px" }}>About FreeToolsHub</h1>
        
        <div style={{ lineHeight: "1.8", color: "#374151" }}>
          <p style={{ marginBottom: "16px", fontSize: "1.125rem" }}>
            FreeToolsHub provides free, easy-to-use online calculators and tools to help you make informed decisions.
          </p>

          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginTop: "32px", marginBottom: "12px" }}>Our Mission</h2>
          <p style={{ marginBottom: "16px" }}>
            We believe everyone should have access to helpful calculation tools without paying for expensive software or consulting professionals for simple estimates. Our goal is to provide accurate, user-friendly calculators for everyday needs.
          </p>

          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginTop: "32px", marginBottom: "12px" }}>What We Offer</h2>
          <ul style={{ marginBottom: "16px", paddingLeft: "24px" }}>
            <li style={{ marginBottom: "8px" }}><strong>Financial Calculators:</strong> Payment fees, ROI calculations, and more</li>
            <li style={{ marginBottom: "8px" }}><strong>Home & Construction:</strong> Material estimates, cost calculators</li>
            <li style={{ marginBottom: "8px" }}><strong>Real Estate:</strong> Title insurance, home inspection costs</li>
            <li style={{ marginBottom: "8px" }}><strong>Legal:</strong> Spousal support, fee calculations</li>
          </ul>

          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginTop: "32px", marginBottom: "12px" }}>Accuracy & Disclaimer</h2>
          <p style={{ marginBottom: "16px" }}>
            We strive to keep our calculators accurate and up-to-date. However, all results are estimates and should not replace professional advice. Always consult qualified professionals for important financial, legal, or construction decisions.
          </p>

          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginTop: "32px", marginBottom: "12px" }}>Contact Us</h2>
          <p style={{ marginBottom: "16px" }}>
            Have questions, suggestions, or found an error? We would love to hear from you!
          </p>
          <p style={{ marginBottom: "16px" }}>
            Email: <a href="mailto:contact@free-tools-hub.com" style={{ color: "#2563EB" }}>contact@free-tools-hub.com</a>
          </p>
        </div>

        <div style={{ marginTop: "48px" }}>
          <Link href="/" style={{ color: "#2563EB", textDecoration: "none" }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
