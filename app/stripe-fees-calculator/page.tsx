"use client";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

export default function StripeFeesCalculator() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav className="text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Stripe Fees Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", marginBottom: "12px" }}>
            Stripe Fees Calculator
          </h1>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate Stripe processing fees and see your net receipts. Reverse calculate the amount to charge to receive a target amount. Supports domestic, international cards and ACH.
          </p>
        </div>

        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "16px", 
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)", 
          border: "1px solid #E5E7EB",
          padding: "32px"
        }}>
          <p style={{ color: "#4B5563" }}>
            This tool is coming soon. Explore other finance calculators from the homepage.
          </p>
        </div>

        <div style={{ marginTop: "24px" }}>
          <RelatedTools currentUrl="/stripe-fees-calculator" currentCategory="Finance" />
        </div>
      </div>
    </div>
  );
}

