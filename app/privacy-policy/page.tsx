"use client";

import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "24px" }}>Privacy Policy</h1>
        <p style={{ color: "#6B7280", marginBottom: "16px" }}>Last updated: January 2, 2026</p>
        
        <div style={{ lineHeight: "1.8", color: "#374151" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginTop: "32px", marginBottom: "12px" }}>Introduction</h2>
          <p style={{ marginBottom: "16px" }}>
            FreeToolsHub ("we," "our," or "us") operates the website free-tools-hub.com. This Privacy Policy explains how we collect, use, and protect your information when you use our website.
          </p>

          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginTop: "32px", marginBottom: "12px" }}>Information We Collect</h2>
          <p style={{ marginBottom: "16px" }}>
            We do not collect personal information directly. However, we use third-party services that may collect information:
          </p>
          <ul style={{ marginBottom: "16px", paddingLeft: "24px" }}>
            <li style={{ marginBottom: "8px" }}><strong>Google Analytics:</strong> Collects anonymous usage data to help us improve our services</li>
            <li style={{ marginBottom: "8px" }}><strong>Google AdSense:</strong> May use cookies to display relevant advertisements</li>
          </ul>

          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginTop: "32px", marginBottom: "12px" }}>Cookies</h2>
          <p style={{ marginBottom: "16px" }}>
            Our website uses cookies to enhance your experience. Third-party services like Google Analytics and Google AdSense also use cookies. You can control cookies through your browser settings.
          </p>

          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginTop: "32px", marginBottom: "12px" }}>Third-Party Advertising</h2>
          <p style={{ marginBottom: "16px" }}>
            We use Google AdSense to display advertisements. Google may use cookies to serve ads based on your prior visits to our website or other websites. You can opt out of personalized advertising by visiting Google Ads Settings.
          </p>

          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginTop: "32px", marginBottom: "12px" }}>Data Security</h2>
          <p style={{ marginBottom: "16px" }}>
            We implement appropriate security measures to protect your information. Our calculators process data locally in your browser - we do not store your calculation inputs on our servers.
          </p>

          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginTop: "32px", marginBottom: "12px" }}>Changes to This Policy</h2>
          <p style={{ marginBottom: "16px" }}>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
          </p>

          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginTop: "32px", marginBottom: "12px" }}>Contact Us</h2>
          <p style={{ marginBottom: "16px" }}>
            If you have questions about this Privacy Policy, please contact us at: contact@free-tools-hub.com
          </p>
        </div>

        <div style={{ marginTop: "48px" }}>
          <Link href="/" style={{ color: "#2563EB", textDecoration: "none" }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
