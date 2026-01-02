"use client";

import Link from "next/link";

export default function Contact() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "24px" }}>Contact Us</h1>
        
        <div style={{ lineHeight: "1.8", color: "#374151" }}>
          <p style={{ marginBottom: "24px", fontSize: "1.125rem" }}>
            We would love to hear from you! Whether you have a question, suggestion, or found an issue with one of our calculators, please reach out.
          </p>

          <div style={{ backgroundColor: "white", padding: "32px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: "32px" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "16px" }}>📧 Email</h2>
            <p style={{ marginBottom: "8px" }}>
              <a href="mailto:contact@free-tools-hub.com" style={{ color: "#2563EB", fontSize: "1.125rem" }}>contact@free-tools-hub.com</a>
            </p>
            <p style={{ color: "#6B7280", fontSize: "0.875rem" }}>
              We typically respond within 24-48 hours.
            </p>
          </div>

          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginTop: "32px", marginBottom: "12px" }}>What You Can Contact Us About</h2>
          <ul style={{ marginBottom: "16px", paddingLeft: "24px" }}>
            <li style={{ marginBottom: "8px" }}>Bug reports or calculation errors</li>
            <li style={{ marginBottom: "8px" }}>Suggestions for new calculators</li>
            <li style={{ marginBottom: "8px" }}>General questions about our tools</li>
            <li style={{ marginBottom: "8px" }}>Partnership or business inquiries</li>
          </ul>
        </div>

        <div style={{ marginTop: "48px" }}>
          <Link href="/" style={{ color: "#2563EB", textDecoration: "none" }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
