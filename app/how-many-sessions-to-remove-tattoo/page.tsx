"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// ============================================
// Types & Data
// ============================================

// Tattoo sizes
const tattooSizes = [
  { id: 'tiny', label: 'Tiny', description: 'Less than 1 sq inch (fingernail size)', sqInch: 0.5, points: 1 },
  { id: 'small', label: 'Small', description: '1-4 sq inches (business card)', sqInch: 2.5, points: 2 },
  { id: 'medium', label: 'Medium', description: '4-12 sq inches (palm size)', sqInch: 8, points: 3 },
  { id: 'large', label: 'Large', description: '12-36 sq inches (hand size)', sqInch: 24, points: 4 },
  { id: 'xlarge', label: 'Extra Large', description: '36+ sq inches (half sleeve+)', sqInch: 50, points: 5 },
];

// Ink colors
const inkColors = [
  { id: 'black', label: 'Black Only', description: 'Easiest to remove', emoji: '⬛', points: 1 },
  { id: 'blackred', label: 'Black + Red/Orange', description: 'Relatively easy', emoji: '🔴', points: 2 },
  { id: 'multi', label: 'Multicolor', description: 'Multiple wavelengths needed', emoji: '🌈', points: 3 },
  { id: 'difficult', label: 'Green/Blue/Yellow', description: 'Most resistant colors', emoji: '💚', points: 4 },
];

// Body locations (based on blood flow/lymphatic drainage)
const bodyLocations = [
  { id: 'head', label: 'Head/Neck/Upper Back', description: 'Best blood flow, fastest clearing', emoji: '👤', points: 1 },
  { id: 'torso', label: 'Chest/Stomach/Upper Arms', description: 'Good circulation', emoji: '💪', points: 2 },
  { id: 'limbs', label: 'Lower Arms/Thighs/Calves', description: 'Moderate circulation', emoji: '🦵', points: 3 },
  { id: 'extremities', label: 'Hands/Feet/Fingers/Ankles', description: 'Poor circulation, slowest', emoji: '🖐️', points: 4 },
];

// Tattoo age
const tattooAges = [
  { id: 'new', label: 'New (< 1 year)', description: 'Fresh ink, fully saturated', points: 3 },
  { id: 'medium', label: '1-5 years', description: 'Some natural fading', points: 2 },
  { id: 'old', label: 'Old (5+ years)', description: 'Significant natural fading', points: 1 },
];

// Tattoo type
const tattooTypes = [
  { id: 'amateur', label: 'Amateur/DIY', description: 'Stick & poke, home done', points: 1 },
  { id: 'professional', label: 'Professional Studio', description: 'Machine tattooed, dense ink', points: 2 },
];

// Skin types (Fitzpatrick scale)
const skinTypes = [
  { id: 'light', label: 'Light (Type I-II)', description: 'Always burns, rarely tans', points: 1 },
  { id: 'medium', label: 'Medium (Type III-IV)', description: 'Sometimes burns, tans gradually', points: 2 },
  { id: 'dark', label: 'Dark (Type V-VI)', description: 'Rarely burns, tans easily', points: 3 },
];

// Layering/cover-up
const layeringOptions = [
  { id: 'none', label: 'No Layering', description: 'Single layer of ink', points: 0 },
  { id: 'coverup', label: 'Cover-up/Layered', description: 'Multiple layers of ink', points: 2 },
];

// Quick reference data
const quickReferenceData = [
  { type: 'Small black tattoo', sessions: '3-6', timeline: '4-9 months', difficulty: 'Easy' },
  { type: 'Small color tattoo', sessions: '6-10', timeline: '9-15 months', difficulty: 'Moderate' },
  { type: 'Large black tattoo', sessions: '6-10', timeline: '9-18 months', difficulty: 'Moderate' },
  { type: 'Large color tattoo', sessions: '10-15+', timeline: '15-24+ months', difficulty: 'Hard' },
  { type: 'Eyebrow tattoo', sessions: '4-8', timeline: '6-12 months', difficulty: 'Moderate' },
  { type: 'Finger tattoo', sessions: '6-10', timeline: '9-18 months', difficulty: 'Hard' },
  { type: 'Cover-up removal', sessions: '10-15+', timeline: '15-24+ months', difficulty: 'Hard' },
  { type: 'Sleeve tattoo', sessions: '12-20+', timeline: '18-30+ months', difficulty: 'Very Hard' },
];

// FAQ data
const faqs = [
  {
    question: "How many sessions to fully remove a tattoo?",
    answer: "Most tattoos require 6-12 sessions for complete removal, spaced 6-8 weeks apart. Small black tattoos may need only 3-6 sessions, while large colorful tattoos can require 10-20+ sessions. The total timeline typically ranges from 6 months to 2+ years depending on various factors like ink color, tattoo size, location, and your body's immune response."
  },
  {
    question: "Can tattoos be 100% removed?",
    answer: "Most tattoos can be removed to the point where they're no longer visible to the naked eye, but 100% complete removal isn't always guaranteed. Factors like ink color (greens and blues are hardest), ink depth, scarring, and skin type affect results. About 90% of tattoos can achieve excellent removal with modern laser technology, while some may have slight ghosting or texture changes."
  },
  {
    question: "How bad does tattoo removal hurt on a scale of 1 to 10?",
    answer: "Most people rate laser tattoo removal pain between 4-7 out of 10, often describing it as a rubber band snapping against the skin combined with heat. Pain varies by body location (bony areas hurt more), individual tolerance, and laser type. Numbing cream, cooling devices, and breaks during treatment can significantly reduce discomfort."
  },
  {
    question: "How much does it cost to remove a 2 inch tattoo?",
    answer: "A 2-inch tattoo typically costs $150-$300 per session, with 4-8 sessions needed for removal. Total cost ranges from $600-$2,400 depending on ink colors, location, and clinic pricing. Black ink tattoos on the lower end, multicolor on the higher end. Many clinics offer package discounts of 10-20% when you prepay for multiple sessions."
  },
  {
    question: "Is it better to wait longer between tattoo removal sessions?",
    answer: "Yes, waiting 8-12 weeks between sessions (instead of the minimum 6 weeks) often produces better results. Your immune system continues breaking down ink particles between sessions, so longer intervals allow more fading. Some clinics now recommend 10-12 week gaps, which can reduce total sessions needed and give better outcomes."
  },
  {
    question: "How many sessions to remove a small black tattoo?",
    answer: "Small black tattoos typically require 3-6 laser sessions for complete removal. Black ink responds best to laser treatment as it absorbs all wavelengths. If the tattoo is old (5+ years), amateur-done, or in a location with good blood flow (upper body), you may need fewer sessions. Professional, dense black tattoos may need 6-8 sessions."
  }
];

// FAQ component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #E5E7EB" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          padding: "16px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          textAlign: "left",
          background: "none",
          border: "none",
          cursor: "pointer"
        }}
      >
        <h3 style={{ fontWeight: "600", color: "#111827", paddingRight: "16px", margin: 0, fontSize: "1rem" }}>{question}</h3>
        <svg style={{ width: "20px", height: "20px", color: "#6B7280", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div style={{ maxHeight: isOpen ? "500px" : "0", overflow: "hidden", transition: "max-height 0.3s ease-out" }}>
        <p style={{ color: "#4B5563", paddingBottom: "16px", margin: 0, lineHeight: "1.7" }}>{answer}</p>
      </div>
    </div>
  );
}

export default function TattooRemovalSessionEstimator() {
  // Tab state
  const [activeTab, setActiveTab] = useState<'estimator' | 'reference' | 'cost'>('estimator');

  // Estimator states
  const [size, setSize] = useState('small');
  const [color, setColor] = useState('black');
  const [location, setLocation] = useState('torso');
  const [age, setAge] = useState('medium');
  const [type, setType] = useState('professional');
  const [skin, setSkin] = useState('light');
  const [layering, setLayering] = useState('none');

  // Cost estimator states
  const [costSize, setCostSize] = useState('small');
  const [costSessions, setCostSessions] = useState(6);
  const [costPerSession, setCostPerSession] = useState(250);

  // Calculate sessions based on Kirby-Desai inspired scoring
  const calculateSessions = () => {
    const sizeData = tattooSizes.find(s => s.id === size);
    const colorData = inkColors.find(c => c.id === color);
    const locationData = bodyLocations.find(l => l.id === location);
    const ageData = tattooAges.find(a => a.id === age);
    const typeData = tattooTypes.find(t => t.id === type);
    const skinData = skinTypes.find(s => s.id === skin);
    const layerData = layeringOptions.find(l => l.id === layering);

    const totalPoints = 
      (sizeData?.points || 2) +
      (colorData?.points || 1) +
      (locationData?.points || 2) +
      (ageData?.points || 2) +
      (typeData?.points || 2) +
      (skinData?.points || 1) +
      (layerData?.points || 0);

    // Convert points to sessions (roughly 1 point = 1 session, with adjustments)
    const baseSessions = totalPoints;
    const minSessions = Math.max(3, Math.round(baseSessions * 0.7));
    const maxSessions = Math.round(baseSessions * 1.3);

    // Calculate timeline (6-8 weeks between sessions)
    const minMonths = Math.round(minSessions * 1.5);
    const maxMonths = Math.round(maxSessions * 2);

    // Calculate cost estimate
    const sizeMultiplier = sizeData?.sqInch || 2.5;
    const costPerSessionMin = Math.round(100 + sizeMultiplier * 15);
    const costPerSessionMax = Math.round(200 + sizeMultiplier * 20);
    const totalCostMin = costPerSessionMin * minSessions;
    const totalCostMax = costPerSessionMax * maxSessions;

    // Factor analysis
    const factors: { text: string; impact: 'positive' | 'negative' | 'neutral' }[] = [];
    
    if (colorData?.id === 'black') factors.push({ text: 'Black ink is easiest to remove', impact: 'positive' });
    else if (colorData?.id === 'difficult') factors.push({ text: 'Green/blue/yellow are hardest to remove', impact: 'negative' });
    else if (colorData?.id === 'multi') factors.push({ text: 'Multiple colors need different wavelengths', impact: 'negative' });
    
    if (ageData?.id === 'old') factors.push({ text: 'Old tattoo has natural fading', impact: 'positive' });
    else if (ageData?.id === 'new') factors.push({ text: 'New tattoo has fresh, dense ink', impact: 'negative' });
    
    if (locationData?.id === 'head') factors.push({ text: 'Upper body has best circulation', impact: 'positive' });
    else if (locationData?.id === 'extremities') factors.push({ text: 'Hands/feet have poor circulation', impact: 'negative' });
    
    if (typeData?.id === 'amateur') factors.push({ text: 'Amateur tattoo has less dense ink', impact: 'positive' });
    else factors.push({ text: 'Professional tattoo has dense, deep ink', impact: 'negative' });
    
    if (skinData?.id === 'dark') factors.push({ text: 'Darker skin needs lower settings', impact: 'negative' });
    
    if (layerData?.id === 'coverup') factors.push({ text: 'Cover-up has multiple ink layers', impact: 'negative' });

    return {
      minSessions,
      maxSessions,
      avgSessions: Math.round((minSessions + maxSessions) / 2),
      minMonths,
      maxMonths,
      costPerSessionMin,
      costPerSessionMax,
      totalCostMin,
      totalCostMax,
      factors,
      totalPoints,
    };
  };

  const estimate = calculateSessions();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FDF2F8" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #FBCFE8" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Tattoo Removal Session Estimator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "2.5rem" }}>✨</span>
            <h1 style={{ fontSize: "clamp(1.75rem, 5vw, 2.25rem)", fontWeight: "bold", color: "#111827", margin: 0 }}>
              How Many Sessions to Remove Tattoo?
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Estimate how many laser sessions you&apos;ll need to remove your tattoo. Get personalized 
            results based on size, color, location, and other key factors.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#BE185D",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "white", margin: "0 0 8px 0" }}>
                <strong>Quick Answer: How Many Sessions?</strong>
              </p>
              <div style={{ color: "#FBCFE8", fontSize: "0.95rem", lineHeight: "1.8" }}>
                <p style={{ margin: "0" }}>• <strong>Small black tattoo:</strong> 3-6 sessions</p>
                <p style={{ margin: "0" }}>• <strong>Large black tattoo:</strong> 6-10 sessions</p>
                <p style={{ margin: "0" }}>• <strong>Small color tattoo:</strong> 6-10 sessions</p>
                <p style={{ margin: "0" }}>• <strong>Large color tattoo:</strong> 10-15+ sessions</p>
                <p style={{ margin: "0", marginTop: "8px", fontSize: "0.85rem" }}>Sessions spaced 6-8 weeks apart. Total timeline: 6 months to 2+ years.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab('estimator')}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === 'estimator' ? "#BE185D" : "white",
              color: activeTab === 'estimator' ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}
          >
            🎯 Session Estimator
          </button>
          <button
            onClick={() => setActiveTab('reference')}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === 'reference' ? "#BE185D" : "white",
              color: activeTab === 'reference' ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}
          >
            📋 Quick Reference
          </button>
          <button
            onClick={() => setActiveTab('cost')}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === 'cost' ? "#BE185D" : "white",
              color: activeTab === 'cost' ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}
          >
            💰 Cost Calculator
          </button>
        </div>

        {/* Session Estimator Tab */}
        {activeTab === 'estimator' && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #FBCFE8",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#BE185D", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  🎯 Describe Your Tattoo
                </h2>
              </div>

              <div style={{ padding: "24px", maxHeight: "600px", overflowY: "auto" }}>
                {/* Tattoo Size */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    📏 Tattoo Size
                  </label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #D1D5DB",
                      borderRadius: "8px",
                      fontSize: "0.95rem",
                      boxSizing: "border-box",
                      backgroundColor: "white"
                    }}
                  >
                    {tattooSizes.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.label} - {s.description}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ink Color */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    🎨 Ink Colors
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {inkColors.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setColor(c.id)}
                        style={{
                          padding: "12px",
                          borderRadius: "8px",
                          border: color === c.id ? "2px solid #BE185D" : "1px solid #E5E7EB",
                          backgroundColor: color === c.id ? "#FDF2F8" : "white",
                          cursor: "pointer",
                          textAlign: "left"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span>{c.emoji}</span>
                          <span style={{ 
                            fontWeight: color === c.id ? "600" : "500",
                            color: color === c.id ? "#BE185D" : "#374151",
                            fontSize: "0.85rem"
                          }}>
                            {c.label}
                          </span>
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "#6B7280", marginTop: "4px", marginLeft: "24px" }}>
                          {c.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Body Location */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    📍 Body Location
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {bodyLocations.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => setLocation(l.id)}
                        style={{
                          padding: "12px",
                          borderRadius: "8px",
                          border: location === l.id ? "2px solid #BE185D" : "1px solid #E5E7EB",
                          backgroundColor: location === l.id ? "#FDF2F8" : "white",
                          cursor: "pointer",
                          textAlign: "left"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span>{l.emoji}</span>
                          <span style={{ 
                            fontWeight: location === l.id ? "600" : "500",
                            color: location === l.id ? "#BE185D" : "#374151",
                            fontSize: "0.8rem"
                          }}>
                            {l.label}
                          </span>
                        </div>
                        <div style={{ fontSize: "0.65rem", color: "#6B7280", marginTop: "4px", marginLeft: "28px" }}>
                          {l.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tattoo Age */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    📅 Tattoo Age
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                    {tattooAges.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => setAge(a.id)}
                        style={{
                          padding: "12px 8px",
                          borderRadius: "8px",
                          border: age === a.id ? "2px solid #BE185D" : "1px solid #E5E7EB",
                          backgroundColor: age === a.id ? "#FDF2F8" : "white",
                          cursor: "pointer",
                          textAlign: "center"
                        }}
                      >
                        <div style={{ 
                          fontWeight: age === a.id ? "600" : "500",
                          color: age === a.id ? "#BE185D" : "#374151",
                          fontSize: "0.85rem"
                        }}>
                          {a.label}
                        </div>
                        <div style={{ fontSize: "0.65rem", color: "#6B7280", marginTop: "4px" }}>
                          {a.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tattoo Type */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    🖊️ Tattoo Type
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {tattooTypes.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setType(t.id)}
                        style={{
                          padding: "12px",
                          borderRadius: "8px",
                          border: type === t.id ? "2px solid #BE185D" : "1px solid #E5E7EB",
                          backgroundColor: type === t.id ? "#FDF2F8" : "white",
                          cursor: "pointer",
                          textAlign: "center"
                        }}
                      >
                        <div style={{ 
                          fontWeight: type === t.id ? "600" : "500",
                          color: type === t.id ? "#BE185D" : "#374151",
                          fontSize: "0.9rem"
                        }}>
                          {t.label}
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "#6B7280", marginTop: "4px" }}>
                          {t.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skin Type */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    👤 Skin Tone (Fitzpatrick Scale)
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                    {skinTypes.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSkin(s.id)}
                        style={{
                          padding: "12px 8px",
                          borderRadius: "8px",
                          border: skin === s.id ? "2px solid #BE185D" : "1px solid #E5E7EB",
                          backgroundColor: skin === s.id ? "#FDF2F8" : "white",
                          cursor: "pointer",
                          textAlign: "center"
                        }}
                      >
                        <div style={{ 
                          fontWeight: skin === s.id ? "600" : "500",
                          color: skin === s.id ? "#BE185D" : "#374151",
                          fontSize: "0.85rem"
                        }}>
                          {s.label}
                        </div>
                        <div style={{ fontSize: "0.6rem", color: "#6B7280", marginTop: "4px" }}>
                          {s.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Layering */}
                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    📚 Ink Layering
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {layeringOptions.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => setLayering(l.id)}
                        style={{
                          padding: "12px",
                          borderRadius: "8px",
                          border: layering === l.id ? "2px solid #BE185D" : "1px solid #E5E7EB",
                          backgroundColor: layering === l.id ? "#FDF2F8" : "white",
                          cursor: "pointer",
                          textAlign: "center"
                        }}
                      >
                        <div style={{ 
                          fontWeight: layering === l.id ? "600" : "500",
                          color: layering === l.id ? "#BE185D" : "#374151",
                          fontSize: "0.9rem"
                        }}>
                          {l.label}
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "#6B7280", marginTop: "4px" }}>
                          {l.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="calc-results" style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #FBCFE8",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#9D174D", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📊 Your Estimate
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Main Result */}
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <div style={{ fontSize: "0.9rem", color: "#6B7280", marginBottom: "8px" }}>Estimated Sessions Needed</div>
                  <div style={{ fontSize: "3rem", fontWeight: "bold", color: "#BE185D" }}>
                    {estimate.minSessions} - {estimate.maxSessions}
                  </div>
                  <div style={{ fontSize: "1rem", color: "#6B7280" }}>sessions</div>
                </div>

                {/* Timeline */}
                <div style={{ 
                  backgroundColor: "#FDF2F8", 
                  borderRadius: "12px", 
                  padding: "20px",
                  marginBottom: "20px",
                  border: "1px solid #FBCFE8",
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: "0.85rem", color: "#9D174D", marginBottom: "4px", fontWeight: "600" }}>
                    ⏱️ Total Timeline
                  </div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#BE185D" }}>
                    {estimate.minMonths} - {estimate.maxMonths} months
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#6B7280", marginTop: "4px" }}>
                    (Sessions spaced 6-8 weeks apart)
                  </div>
                </div>

                {/* Factor Analysis */}
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "0.9rem", fontWeight: "600", color: "#374151", marginBottom: "12px" }}>
                    Factors Affecting Your Estimate
                  </h3>
                  <div style={{ display: "grid", gap: "8px" }}>
                    {estimate.factors.map((factor, idx) => (
                      <div 
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "8px 12px",
                          backgroundColor: factor.impact === 'positive' ? "#ECFDF5" : factor.impact === 'negative' ? "#FEF2F2" : "#F9FAFB",
                          borderRadius: "6px",
                          fontSize: "0.85rem"
                        }}
                      >
                        <span>{factor.impact === 'positive' ? '✅' : factor.impact === 'negative' ? '⚠️' : 'ℹ️'}</span>
                        <span style={{ color: factor.impact === 'positive' ? "#059669" : factor.impact === 'negative' ? "#DC2626" : "#6B7280" }}>
                          {factor.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cost Estimate */}
                <div style={{ 
                  backgroundColor: "#F9FAFB", 
                  borderRadius: "12px", 
                  padding: "16px",
                  marginBottom: "16px"
                }}>
                  <h3 style={{ fontSize: "0.9rem", fontWeight: "600", color: "#374151", marginTop: 0, marginBottom: "12px" }}>
                    💰 Estimated Cost
                  </h3>
                  <div style={{ fontSize: "0.85rem", lineHeight: "1.8" }}>
                    <p style={{ margin: "0", display: "flex", justifyContent: "space-between" }}>
                      <span>Per Session:</span>
                      <span style={{ fontWeight: "600" }}>${estimate.costPerSessionMin} - ${estimate.costPerSessionMax}</span>
                    </p>
                    <p style={{ margin: "0", display: "flex", justifyContent: "space-between", borderTop: "1px solid #E5E7EB", paddingTop: "8px", marginTop: "8px" }}>
                      <span><strong>Total Cost:</strong></span>
                      <span style={{ fontWeight: "700", color: "#BE185D" }}>${estimate.totalCostMin.toLocaleString()} - ${estimate.totalCostMax.toLocaleString()}</span>
                    </p>
                  </div>
                </div>

                {/* Tips */}
                <div style={{
                  backgroundColor: "#FEF3C7",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #FCD34D"
                }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "#92400E", margin: "0 0 8px 0" }}>
                    💡 Tips for Better Results
                  </p>
                  <ul style={{ fontSize: "0.8rem", color: "#B45309", margin: 0, paddingLeft: "16px", lineHeight: "1.8" }}>
                    <li>Wait 8-12 weeks between sessions for better fading</li>
                    <li>Stay hydrated and maintain good immune health</li>
                    <li>Avoid sun exposure on the treated area</li>
                    <li>Don&apos;t smoke - it slows ink elimination</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Reference Tab */}
        {activeTab === 'reference' && (
          <div style={{ marginBottom: "32px" }}>
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #FBCFE8",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#BE185D", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📋 Quick Reference: Sessions by Tattoo Type
                </h2>
              </div>

              <div style={{ padding: "24px", overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#FDF2F8" }}>
                      <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #FBCFE8" }}>Tattoo Type</th>
                      <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: "600", borderBottom: "2px solid #FBCFE8" }}>Sessions</th>
                      <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: "600", borderBottom: "2px solid #FBCFE8" }}>Timeline</th>
                      <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: "600", borderBottom: "2px solid #FBCFE8" }}>Difficulty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quickReferenceData.map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid #E5E7EB" }}>
                        <td style={{ padding: "12px 16px", fontWeight: "500" }}>{row.type}</td>
                        <td style={{ padding: "12px 16px", textAlign: "center", color: "#BE185D", fontWeight: "600" }}>{row.sessions}</td>
                        <td style={{ padding: "12px 16px", textAlign: "center" }}>{row.timeline}</td>
                        <td style={{ padding: "12px 16px", textAlign: "center" }}>
                          <span style={{
                            padding: "4px 12px",
                            borderRadius: "12px",
                            fontSize: "0.75rem",
                            fontWeight: "500",
                            backgroundColor: 
                              row.difficulty === 'Easy' ? '#ECFDF5' :
                              row.difficulty === 'Moderate' ? '#FEF3C7' :
                              row.difficulty === 'Hard' ? '#FEE2E2' : '#FEE2E2',
                            color:
                              row.difficulty === 'Easy' ? '#059669' :
                              row.difficulty === 'Moderate' ? '#D97706' :
                              row.difficulty === 'Hard' ? '#DC2626' : '#DC2626'
                          }}>
                            {row.difficulty}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={{ marginTop: "24px", padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <h3 style={{ fontSize: "0.9rem", fontWeight: "600", color: "#374151", marginTop: 0, marginBottom: "12px" }}>
                    📝 Important Notes
                  </h3>
                  <ul style={{ fontSize: "0.85rem", color: "#4B5563", margin: 0, paddingLeft: "20px", lineHeight: "1.8" }}>
                    <li><strong>Sessions are spaced 6-8 weeks apart</strong> to allow skin healing and ink particle clearance</li>
                    <li><strong>Black ink</strong> is always easiest - it absorbs all laser wavelengths</li>
                    <li><strong>Green, blue, and yellow</strong> are most resistant and may need specialized lasers</li>
                    <li><strong>Older tattoos</strong> (5+ years) often need fewer sessions due to natural fading</li>
                    <li><strong>Results vary</strong> based on individual immune response and aftercare</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cost Calculator Tab */}
        {activeTab === 'cost' && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #FBCFE8",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#BE185D", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  💰 Cost Calculator
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Tattoo Size */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    📏 Tattoo Size
                  </label>
                  <select
                    value={costSize}
                    onChange={(e) => setCostSize(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #D1D5DB",
                      borderRadius: "8px",
                      fontSize: "0.95rem",
                      boxSizing: "border-box",
                      backgroundColor: "white"
                    }}
                  >
                    {tattooSizes.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.label} - {s.description}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Number of Sessions */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    🔢 Number of Sessions: {costSessions}
                  </label>
                  <input
                    type="range"
                    min={3}
                    max={20}
                    value={costSessions}
                    onChange={(e) => setCostSessions(Number(e.target.value))}
                    style={{ width: "100%" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#6B7280" }}>
                    <span>3 sessions</span>
                    <span>20 sessions</span>
                  </div>
                </div>

                {/* Cost Per Session */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    💵 Cost Per Session: ${costPerSession}
                  </label>
                  <input
                    type="range"
                    min={100}
                    max={500}
                    step={25}
                    value={costPerSession}
                    onChange={(e) => setCostPerSession(Number(e.target.value))}
                    style={{ width: "100%" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#6B7280" }}>
                    <span>$100 (small/basic)</span>
                    <span>$500 (large/premium)</span>
                  </div>
                </div>

                {/* Average Costs Reference */}
                <div style={{
                  backgroundColor: "#F9FAFB",
                  borderRadius: "8px",
                  padding: "16px"
                }}>
                  <h3 style={{ fontSize: "0.85rem", fontWeight: "600", color: "#374151", marginTop: 0, marginBottom: "12px" }}>
                    📊 Typical Session Costs
                  </h3>
                  <div style={{ fontSize: "0.8rem", color: "#4B5563", lineHeight: "1.8" }}>
                    <p style={{ margin: 0 }}>• Tiny tattoo: $100-$150/session</p>
                    <p style={{ margin: 0 }}>• Small tattoo: $150-$250/session</p>
                    <p style={{ margin: 0 }}>• Medium tattoo: $250-$350/session</p>
                    <p style={{ margin: 0 }}>• Large tattoo: $350-$500/session</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="calc-results" style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #FBCFE8",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#9D174D", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📊 Cost Estimate
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Total Cost */}
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <div style={{ fontSize: "0.9rem", color: "#6B7280", marginBottom: "8px" }}>Estimated Total Cost</div>
                  <div style={{ fontSize: "3rem", fontWeight: "bold", color: "#BE185D" }}>
                    ${(costSessions * costPerSession).toLocaleString()}
                  </div>
                </div>

                {/* Breakdown */}
                <div style={{ 
                  backgroundColor: "#FDF2F8", 
                  borderRadius: "12px", 
                  padding: "20px",
                  marginBottom: "20px"
                }}>
                  <div style={{ fontSize: "0.9rem", lineHeight: "2" }}>
                    <p style={{ margin: "0", display: "flex", justifyContent: "space-between" }}>
                      <span>Sessions:</span>
                      <span style={{ fontWeight: "600" }}>{costSessions}</span>
                    </p>
                    <p style={{ margin: "0", display: "flex", justifyContent: "space-between" }}>
                      <span>Cost per Session:</span>
                      <span style={{ fontWeight: "600" }}>${costPerSession}</span>
                    </p>
                    <p style={{ margin: "0", display: "flex", justifyContent: "space-between" }}>
                      <span>Timeline:</span>
                      <span style={{ fontWeight: "600" }}>{Math.round(costSessions * 1.75)} months</span>
                    </p>
                    <div style={{ borderTop: "2px solid #FBCFE8", marginTop: "12px", paddingTop: "12px" }}>
                      <p style={{ margin: "0", display: "flex", justifyContent: "space-between", fontSize: "1.1rem" }}>
                        <span><strong>Total:</strong></span>
                        <span style={{ fontWeight: "700", color: "#BE185D" }}>${(costSessions * costPerSession).toLocaleString()}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Money Saving Tips */}
                <div style={{
                  backgroundColor: "#ECFDF5",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #A7F3D0"
                }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "#065F46", margin: "0 0 8px 0" }}>
                    💰 Ways to Save
                  </p>
                  <ul style={{ fontSize: "0.8rem", color: "#047857", margin: 0, paddingLeft: "16px", lineHeight: "1.8" }}>
                    <li>Ask about package deals (10-20% off)</li>
                    <li>Some clinics offer financing options</li>
                    <li>Prices vary by location - compare clinics</li>
                    <li>Off-peak times may have discounts</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ink Color Difficulty Chart */}
        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "16px", 
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)", 
          border: "1px solid #FBCFE8", 
          padding: "32px",
          marginBottom: "32px"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
            🎨 Ink Color Removal Difficulty
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px" }}>
            {[
              { color: 'Black', difficulty: 'Easiest', sessions: '3-6', bg: '#1F2937', text: 'white' },
              { color: 'Dark Blue', difficulty: 'Easy', sessions: '4-8', bg: '#1E3A8A', text: 'white' },
              { color: 'Red', difficulty: 'Moderate', sessions: '5-10', bg: '#DC2626', text: 'white' },
              { color: 'Orange', difficulty: 'Moderate', sessions: '6-10', bg: '#EA580C', text: 'white' },
              { color: 'Purple', difficulty: 'Hard', sessions: '8-12', bg: '#7C3AED', text: 'white' },
              { color: 'Green', difficulty: 'Very Hard', sessions: '10-15+', bg: '#16A34A', text: 'white' },
              { color: 'Light Blue', difficulty: 'Very Hard', sessions: '10-15+', bg: '#0EA5E9', text: 'white' },
              { color: 'Yellow', difficulty: 'Hardest', sessions: '12-20+', bg: '#EAB308', text: 'black' },
            ].map((item, idx) => (
              <div 
                key={idx}
                style={{
                  padding: "16px",
                  backgroundColor: item.bg,
                  borderRadius: "12px",
                  textAlign: "center",
                  color: item.text
                }}
              >
                <div style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "4px" }}>
                  {item.color}
                </div>
                <div style={{ fontSize: "0.75rem", opacity: 0.9, marginBottom: "4px" }}>
                  {item.difficulty}
                </div>
                <div style={{ fontSize: "0.85rem", fontWeight: "700" }}>
                  {item.sessions}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #FBCFE8", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
                ✨ How Laser Tattoo Removal Works
              </h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  Laser tattoo removal uses high-intensity light beams to break down ink particles in your skin. 
                  Your immune system then gradually flushes out these tiny particles over the following weeks, 
                  which is why sessions must be spaced 6-8 weeks apart.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Key Factors That Affect Sessions</h3>
                <div style={{
                  backgroundColor: "#FDF2F8",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #FBCFE8"
                }}>
                  <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "2" }}>
                    <li><strong>Ink Color:</strong> Black absorbs all wavelengths (easiest). Green/blue/yellow need specific wavelengths (hardest)</li>
                    <li><strong>Ink Density:</strong> Professional tattoos have more ink deposited deeper - more sessions needed</li>
                    <li><strong>Location:</strong> Areas with good blood flow (chest, upper back) clear faster than extremities</li>
                    <li><strong>Skin Tone:</strong> Darker skin needs lower laser settings to avoid damage, requiring more sessions</li>
                    <li><strong>Immune Health:</strong> Your body does the actual removal - healthy immune system = faster results</li>
                  </ul>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>What to Expect</h3>
                <ul style={{ paddingLeft: "20px", lineHeight: "2" }}>
                  <li><strong>Session length:</strong> 15-60 minutes depending on tattoo size</li>
                  <li><strong>Pain level:</strong> Like rubber band snaps + heat (numbing available)</li>
                  <li><strong>Healing time:</strong> 1-2 weeks per session</li>
                  <li><strong>Visible fading:</strong> Usually noticeable after 2-3 sessions</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Did You Know */}
            <div style={{ backgroundColor: "#BE185D", borderRadius: "16px", padding: "24px", marginBottom: "24px", color: "white" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "16px" }}>📊 Did You Know?</h3>
              <div style={{ fontSize: "0.9rem", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 12px 0" }}>Average tattoos need <strong>10 sessions</strong> for complete removal</p>
                <p style={{ margin: "0 0 12px 0" }}>Black ink responds <strong>3x faster</strong> than green/blue</p>
                <p style={{ margin: "0" }}>Newer <strong>PicoSure lasers</strong> can reduce sessions by 25%</p>
              </div>
            </div>

            {/* Warning Signs */}
            <div style={{ backgroundColor: "#FEF2F2", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FECACA" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#991B1B", marginBottom: "16px" }}>⚠️ Avoid If:</h3>
              <ul style={{ fontSize: "0.85rem", color: "#B91C1C", lineHeight: "1.8", margin: 0, paddingLeft: "16px" }}>
                <li>Currently pregnant/nursing</li>
                <li>Taking photosensitive medications</li>
                <li>Have active skin infections</li>
                <li>Recent sun exposure/tan</li>
              </ul>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/how-many-sessions-to-remove-tattoo" currentCategory="Health" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #FBCFE8", padding: "32px", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "24px" }}>
            Frequently Asked Questions
          </h2>
          <div>
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ padding: "16px", backgroundColor: "#FDF2F8", borderRadius: "8px", border: "1px solid #FBCFE8" }}>
          <p style={{ fontSize: "0.75rem", color: "#9D174D", textAlign: "center", margin: 0 }}>
            ✨ <strong>Disclaimer:</strong> These estimates are based on typical removal experiences and the Kirby-Desai scale. 
            Actual results vary based on individual factors. Always consult with a qualified laser removal specialist 
            for a personalized assessment.
          </p>
        </div>
      </div>
    </div>
  );
}