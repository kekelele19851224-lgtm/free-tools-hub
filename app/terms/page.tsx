"use client";

import Link from "next/link";

export default function Terms() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "24px" }}>Terms of Service</h1>
        <p style={{ color: "#6B7280", marginBottom: "16px" }}>Last updated: January 2, 2026</p>
        
        <div style={{ lineHeight: "1.8", color: "#374151" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginTop: "32px", marginBottom: "12px" }}>Acceptance of Terms</h2>
          <p style={{ marginBottom: "16px" }}>
            By accessing and using FreeToolsHub (free-tools-hub.com), you accept and agree to be bound by these Terms of Service.
          </p>

          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginTop: "32px", marginBottom: "12px" }}>Use of Services</h2>
          <p style={{ marginBottom: "16px" }}>
            Our website provides free online calculators and tools for informational purposes only. You agree to use these tools responsibly and in compliance with applicable laws.
          </p>

          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginTop: "32px", marginBottom: "12px" }}>Disclaimer</h2>
          <p style={{ marginBottom: "16px" }}>
            All calculators and tools are provided "as is" without warranty of any kind. Results are estimates only and should not be considered professional advice. We are not responsible for any decisions made based on the calculations provided.
          </p>
          <ul style={{ marginBottom: "16px", paddingLeft: "24px" }}>
            <li style={{ marginBottom: "8px" }}>Financial calculators are not financial advice - consult a professional</li>
            <li style={{ marginBottom: "8px" }}>Legal calculators are not legal advice - consult an attorney</li>
            <li style={{ marginBottom: "8px" }}>Construction calculators are estimates - consult contractors for accurate quotes</li>
          </ul>

          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginTop: "32px", marginBottom: "12px" }}>Intellectual Property</h2>
          <p style={{ marginBottom: "16px" }}>
            All content on this website, including text, graphics, logos, and software, is the property of FreeToolsHub and is protected by copyright laws.
          </p>

          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginTop: "32px", marginBottom: "12px" }}>Limitation of Liability</h2>
          <p style={{ marginBottom: "16px" }}>
            FreeToolsHub shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of our website or reliance on any information provided.
          </p>

          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginTop: "32px", marginBottom: "12px" }}>Changes to Terms</h2>
          <p style={{ marginBottom: "16px" }}>
            We reserve the right to modify these terms at any time. Continued use of the website after changes constitutes acceptance of the new terms.
          </p>

          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginTop: "32px", marginBottom: "12px" }}>Contact</h2>
          <p style={{ marginBottom: "16px" }}>
            For questions about these Terms, contact us at: contact@free-tools-hub.com
          </p>
        </div>

        <div style={{ marginTop: "48px" }}>
          <Link href="/" style={{ color: "#2563EB", textDecoration: "none" }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
