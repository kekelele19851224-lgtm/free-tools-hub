"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Moon signs (Rashis) in order
const moonSigns = [
  { id: 0, english: "Aries", sanskrit: "Mesha", symbol: "♈", element: "Fire" },
  { id: 1, english: "Taurus", sanskrit: "Vrishabha", symbol: "♉", element: "Earth" },
  { id: 2, english: "Gemini", sanskrit: "Mithuna", symbol: "♊", element: "Air" },
  { id: 3, english: "Cancer", sanskrit: "Karka", symbol: "♋", element: "Water" },
  { id: 4, english: "Leo", sanskrit: "Simha", symbol: "♌", element: "Fire" },
  { id: 5, english: "Virgo", sanskrit: "Kanya", symbol: "♍", element: "Earth" },
  { id: 6, english: "Libra", sanskrit: "Tula", symbol: "♎", element: "Air" },
  { id: 7, english: "Scorpio", sanskrit: "Vrishchika", symbol: "♏", element: "Water" },
  { id: 8, english: "Sagittarius", sanskrit: "Dhanu", symbol: "♐", element: "Fire" },
  { id: 9, english: "Capricorn", sanskrit: "Makara", symbol: "♑", element: "Earth" },
  { id: 10, english: "Aquarius", sanskrit: "Kumbha", symbol: "♒", element: "Air" },
  { id: 11, english: "Pisces", sanskrit: "Meena", symbol: "♓", element: "Water" }
];

// Saturn transit data (Vedic/Sidereal)
const saturnTransits = [
  { sign: 9, start: "2020-01-24", end: "2022-04-29" },   // Capricorn
  { sign: 10, start: "2022-04-29", end: "2025-03-29" },  // Aquarius
  { sign: 11, start: "2025-03-29", end: "2027-06-03" },  // Pisces
  { sign: 0, start: "2027-06-03", end: "2029-08-30" },   // Aries
  { sign: 1, start: "2029-08-30", end: "2032-04-01" }    // Taurus (approx)
];

// Current Saturn position (as of Jan 2026)
const currentSaturnSign = 11; // Pisces

// Get sign that is N positions before/after
const getRelativeSign = (sign: number, offset: number): number => {
  return (sign + offset + 12) % 12;
};

// Phase descriptions
const phaseInfo = {
  rising: {
    name: "Rising Phase (1st Phase)",
    sanskrit: "Udaya",
    duration: "~2.5 years",
    description: "Saturn transits the 12th house from your Moon sign. This phase brings increased expenses, sleep disturbances, and subtle challenges. It marks the beginning of the Sade Sati period.",
    effects: [
      "Increased expenses and financial pressure",
      "Sleep issues and mental restlessness",
      "Hidden enemies may become active",
      "Foreign travel or relocation possible",
      "Spiritual awakening begins"
    ],
    severity: 60
  },
  peak: {
    name: "Peak Phase (2nd Phase)",
    sanskrit: "Madhya",
    duration: "~2.5 years",
    description: "Saturn transits directly over your Moon sign. This is the most intense phase, affecting mental peace, relationships, and overall life circumstances.",
    effects: [
      "Mental stress and emotional turbulence",
      "Health issues, especially mental health",
      "Challenges in relationships and family",
      "Career obstacles and delays",
      "Deep karmic lessons and transformation"
    ],
    severity: 90
  },
  setting: {
    name: "Setting Phase (3rd Phase)",
    sanskrit: "Astama",
    duration: "~2.5 years",
    description: "Saturn transits the 2nd house from your Moon sign. This phase affects finances, family relationships, and speech. Relief begins as the period concludes.",
    effects: [
      "Financial fluctuations",
      "Family tensions and disputes",
      "Speech-related issues",
      "Gradual improvement towards the end",
      "Lessons learned begin to integrate"
    ],
    severity: 70
  }
};

// Remedies
const remedies = [
  { icon: "🙏", title: "Hanuman Chalisa", description: "Recite Hanuman Chalisa daily, especially on Saturdays" },
  { icon: "🪔", title: "Light Sesame Oil Lamp", description: "Light a lamp with sesame oil on Saturday evenings" },
  { icon: "💙", title: "Wear Blue/Black", description: "Wear dark blue or black clothes on Saturdays" },
  { icon: "🍚", title: "Feed the Poor", description: "Donate food to the needy, especially on Saturdays" },
  { icon: "⚫", title: "Donate Iron/Black Items", description: "Donate iron, black sesame, or black cloth" },
  { icon: "🕉️", title: "Shani Mantra", description: "Chant 'Om Sham Shanicharaya Namah' 108 times" }
];

// FAQ data
const faqs = [
  {
    question: "How do I know my Sade Sati period?",
    answer: "Sade Sati begins when Saturn (Shani) enters the zodiac sign immediately before your Moon sign and ends when it leaves the sign immediately after your Moon sign. Since Saturn spends about 2.5 years in each sign, the entire period lasts approximately 7.5 years. To know if you're in Sade Sati, you need to know your Moon sign (not Sun sign) from your Vedic birth chart, then check Saturn's current position."
  },
  {
    question: "What happens in the last 2.5 years of Sade Sati?",
    answer: "The last 2.5 years (Setting Phase) occurs when Saturn transits the 2nd house from your Moon sign. This phase primarily affects finances, family relationships, and speech. While challenges continue, they are generally less intense than the Peak Phase. Many people experience gradual relief and begin to see the fruits of lessons learned. Financial matters stabilize towards the end, and family harmony improves."
  },
  {
    question: "Which rashi is facing Sade Sati now (2026)?",
    answer: "As of 2026, Saturn is transiting through Pisces (Meena). Currently: Aries (Mesha) Moon signs are in the Rising Phase (1st phase), Pisces (Meena) Moon signs are in the Peak Phase (2nd phase), and Aquarius (Kumbha) Moon signs are in the Setting Phase (3rd phase). Saturn will remain in Pisces until June 2027."
  },
  {
    question: "What happens when Sade Sati ends?",
    answer: "When Sade Sati ends, most people experience significant relief from the challenges they faced. The period after Sade Sati often brings stability, clarity, and the rewards of hard work done during the difficult period. Many find their lives transformed positively—stronger, wiser, and more resilient. However, the transition is gradual rather than sudden, and the lessons learned during Sade Sati continue to benefit for years."
  },
  {
    question: "Which phase of Sade Sati is worse?",
    answer: "The Peak Phase (2nd phase), when Saturn transits directly over your Moon sign, is generally considered the most challenging. This phase affects the mind directly since Moon represents the mind in Vedic astrology. However, the actual impact varies greatly depending on Saturn's position in your birth chart, other planetary aspects, and your individual karma. Some people experience the Rising Phase as more difficult, especially if they have challenging 12th house placements."
  },
  {
    question: "Does Sade Sati affect everyone negatively?",
    answer: "No, Sade Sati doesn't affect everyone negatively. For people with well-placed Saturn in their birth chart (especially Taurus and Libra ascendants where Saturn is Yogakaraka), Sade Sati can bring positive results like career growth, discipline, and spiritual advancement. The effects depend on multiple factors including your birth chart, current planetary periods (Dasha), and how you respond to challenges. Many successful people have achieved great things during their Sade Sati."
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

export default function SadeSatiCalculator() {
  const [selectedSign, setSelectedSign] = useState<number | null>(null);

  // Calculate Sade Sati status
  const getSadeSatiStatus = (moonSign: number) => {
    const sign12th = getRelativeSign(moonSign, -1); // 12th from Moon
    const sign1st = moonSign; // Moon sign itself
    const sign2nd = getRelativeSign(moonSign, 1); // 2nd from Moon

    if (currentSaturnSign === sign12th) {
      return { inSadeSati: true, phase: "rising", info: phaseInfo.rising };
    } else if (currentSaturnSign === sign1st) {
      return { inSadeSati: true, phase: "peak", info: phaseInfo.peak };
    } else if (currentSaturnSign === sign2nd) {
      return { inSadeSati: true, phase: "setting", info: phaseInfo.setting };
    }
    return { inSadeSati: false, phase: null, info: null };
  };

  // Get all signs status for overview
  const getAllSignsStatus = () => {
    return moonSigns.map(sign => {
      const status = getSadeSatiStatus(sign.id);
      return { ...sign, ...status };
    });
  };

  const selectedStatus = selectedSign !== null ? getSadeSatiStatus(selectedSign) : null;
  const selectedSignInfo = selectedSign !== null ? moonSigns[selectedSign] : null;

  // Calculate timeline
  const getTimeline = (moonSign: number) => {
    const sign12th = getRelativeSign(moonSign, -1);
    const sign2nd = getRelativeSign(moonSign, 1);
    
    const startTransit = saturnTransits.find(t => t.sign === sign12th);
    const endTransit = saturnTransits.find(t => t.sign === sign2nd);
    
    return {
      start: startTransit?.start || "N/A",
      end: endTransit?.end || "N/A"
    };
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Sade Sati Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🪐</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Sade Sati Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Check if you&apos;re going through Shani Sade Sati based on your Moon sign. 
            Find your current phase, timeline, and remedies for Saturn&apos;s 7.5-year transit.
          </p>
        </div>

        {/* Current Saturn Status Box */}
        <div style={{
          backgroundColor: "#1E1B4B",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          color: "white"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "2rem" }}>🪐</span>
            <div>
              <p style={{ margin: "0 0 4px 0", fontSize: "0.9rem", opacity: 0.8 }}>Current Saturn (Shani) Position</p>
              <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold" }}>
                {moonSigns[currentSaturnSign].symbol} {moonSigns[currentSaturnSign].english} ({moonSigns[currentSaturnSign].sanskrit}) 
                <span style={{ fontSize: "0.9rem", fontWeight: "normal", marginLeft: "12px", opacity: 0.8 }}>
                  March 2025 - June 2027
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Calculator */}
        <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
          {/* Input Panel */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #E5E7EB",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#4C1D95", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🌙 Select Your Moon Sign (Rashi)</h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              <p style={{ fontSize: "0.9rem", color: "#6B7280", marginBottom: "16px" }}>
                Your Moon sign is determined by the position of Moon at your birth time. 
                If you don&apos;t know your Moon sign, you can find it from your Vedic birth chart (Kundli).
              </p>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                {moonSigns.map((sign) => {
                  const status = getSadeSatiStatus(sign.id);
                  return (
                    <button
                      key={sign.id}
                      onClick={() => setSelectedSign(sign.id)}
                      style={{
                        padding: "12px 8px",
                        borderRadius: "10px",
                        border: selectedSign === sign.id ? "2px solid #4C1D95" : "1px solid #E5E7EB",
                        backgroundColor: selectedSign === sign.id ? "#EDE9FE" : status.inSadeSati ? "#FEF3C7" : "white",
                        cursor: "pointer",
                        textAlign: "center",
                        position: "relative"
                      }}
                    >
                      <div style={{ fontSize: "1.5rem", marginBottom: "4px" }}>{sign.symbol}</div>
                      <div style={{ fontSize: "0.85rem", fontWeight: "600", color: selectedSign === sign.id ? "#4C1D95" : "#374151" }}>
                        {sign.english}
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "#6B7280" }}>{sign.sanskrit}</div>
                      {status.inSadeSati && (
                        <div style={{
                          position: "absolute",
                          top: "4px",
                          right: "4px",
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: status.phase === "peak" ? "#DC2626" : status.phase === "rising" ? "#F59E0B" : "#059669"
                        }} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                <p style={{ margin: "0 0 8px 0", fontSize: "0.8rem", fontWeight: "600", color: "#374151" }}>Legend:</p>
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "0.75rem" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#F59E0B" }}></span> Rising Phase
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#DC2626" }}></span> Peak Phase
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#059669" }}></span> Setting Phase
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="calc-results" style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #E5E7EB",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#7C3AED", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Your Sade Sati Status</h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {selectedSign === null ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#6B7280" }}>
                  <span style={{ fontSize: "3rem", display: "block", marginBottom: "16px" }}>🌙</span>
                  <p style={{ margin: 0 }}>Select your Moon sign to check your Sade Sati status</p>
                </div>
              ) : selectedStatus?.inSadeSati ? (
                <>
                  {/* In Sade Sati */}
                  <div style={{
                    backgroundColor: "#FEF2F2",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "20px",
                    border: "1px solid #FECACA",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#991B1B" }}>
                      {selectedSignInfo?.symbol} {selectedSignInfo?.english} ({selectedSignInfo?.sanskrit}) Moon Sign
                    </p>
                    <p style={{ margin: "0 0 8px 0", fontSize: "1.5rem", fontWeight: "bold", color: "#DC2626" }}>
                      ⚠️ You are in Sade Sati
                    </p>
                    <p style={{ margin: 0, fontSize: "1.1rem", color: "#B91C1C", fontWeight: "600" }}>
                      {selectedStatus.info?.name}
                    </p>
                  </div>

                  {/* Phase Details */}
                  <div style={{ marginBottom: "20px" }}>
                    <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem", color: "#374151" }}>Phase Details</h3>
                    <div style={{ backgroundColor: "#F9FAFB", borderRadius: "8px", padding: "16px" }}>
                      <p style={{ margin: "0 0 12px 0", fontSize: "0.9rem", color: "#4B5563", lineHeight: "1.6" }}>
                        {selectedStatus.info?.description}
                      </p>
                      
                      {/* Severity Bar */}
                      <div style={{ marginBottom: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span style={{ fontSize: "0.8rem", color: "#6B7280" }}>Intensity Level</span>
                          <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "#DC2626" }}>{selectedStatus.info?.severity}%</span>
                        </div>
                        <div style={{ height: "8px", backgroundColor: "#E5E7EB", borderRadius: "4px", overflow: "hidden" }}>
                          <div style={{
                            height: "100%",
                            width: `${selectedStatus.info?.severity}%`,
                            backgroundColor: selectedStatus.phase === "peak" ? "#DC2626" : selectedStatus.phase === "rising" ? "#F59E0B" : "#059669",
                            borderRadius: "4px"
                          }} />
                        </div>
                      </div>

                      <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", fontWeight: "600", color: "#374151" }}>Common Effects:</p>
                      <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.85rem", color: "#4B5563" }}>
                        {selectedStatus.info?.effects.map((effect, idx) => (
                          <li key={idx} style={{ marginBottom: "4px" }}>{effect}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div style={{ marginBottom: "20px" }}>
                    <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem", color: "#374151" }}>Your Sade Sati Timeline</h3>
                    <div style={{ backgroundColor: "#EDE9FE", borderRadius: "8px", padding: "16px" }}>
                      {(() => {
                        const timeline = getTimeline(selectedSign);
                        return (
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem" }}>
                            <div style={{ textAlign: "center" }}>
                              <p style={{ margin: 0, color: "#6D28D9", fontWeight: "600" }}>Start</p>
                              <p style={{ margin: 0, color: "#5B21B6" }}>{timeline.start}</p>
                            </div>
                            <div style={{ flex: 1, margin: "0 16px", height: "4px", backgroundColor: "#C4B5FD", borderRadius: "2px", position: "relative" }}>
                              <div style={{
                                position: "absolute",
                                top: "-8px",
                                left: selectedStatus.phase === "rising" ? "15%" : selectedStatus.phase === "peak" ? "50%" : "85%",
                                transform: "translateX(-50%)",
                                width: "20px",
                                height: "20px",
                                backgroundColor: "#7C3AED",
                                borderRadius: "50%",
                                border: "3px solid white",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                              }} />
                            </div>
                            <div style={{ textAlign: "center" }}>
                              <p style={{ margin: 0, color: "#6D28D9", fontWeight: "600" }}>End</p>
                              <p style={{ margin: 0, color: "#5B21B6" }}>{timeline.end}</p>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </>
              ) : (
                /* Not in Sade Sati */
                <div style={{
                  backgroundColor: "#ECFDF5",
                  borderRadius: "12px",
                  padding: "24px",
                  textAlign: "center",
                  border: "1px solid #6EE7B7"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#065F46" }}>
                    {selectedSignInfo?.symbol} {selectedSignInfo?.english} ({selectedSignInfo?.sanskrit}) Moon Sign
                  </p>
                  <p style={{ margin: "0 0 12px 0", fontSize: "1.5rem", fontWeight: "bold", color: "#059669" }}>
                    ✅ You are NOT in Sade Sati
                  </p>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#047857" }}>
                    Saturn is currently not transiting through your Moon sign or adjacent signs. 
                    Enjoy this period of relative ease from Saturn&apos;s direct influence.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* All Signs Overview */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#1E1B4B", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🌟 All Moon Signs - Current Sade Sati Status (2026)</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#F3F4F6" }}>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Moon Sign</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Sanskrit</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Sade Sati Status</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Phase</th>
                </tr>
              </thead>
              <tbody>
                {getAllSignsStatus().map((sign, idx) => (
                  <tr key={sign.id} style={{ backgroundColor: sign.inSadeSati ? "#FEF3C7" : idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>
                      <span style={{ marginRight: "8px" }}>{sign.symbol}</span>{sign.english}
                    </td>
                    <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#6B7280" }}>
                      {sign.sanskrit}
                    </td>
                    <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center" }}>
                      {sign.inSadeSati ? (
                        <span style={{ color: "#DC2626", fontWeight: "600" }}>⚠️ In Sade Sati</span>
                      ) : (
                        <span style={{ color: "#059669" }}>✅ Not in Sade Sati</span>
                      )}
                    </td>
                    <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center" }}>
                      {sign.phase === "rising" && <span style={{ color: "#F59E0B", fontWeight: "500" }}>Rising (1st)</span>}
                      {sign.phase === "peak" && <span style={{ color: "#DC2626", fontWeight: "600" }}>Peak (2nd)</span>}
                      {sign.phase === "setting" && <span style={{ color: "#059669", fontWeight: "500" }}>Setting (3rd)</span>}
                      {!sign.phase && <span style={{ color: "#9CA3AF" }}>—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Remedies Section */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#4C1D95", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>💎 Remedies for Sade Sati</h2>
          </div>
          <div style={{ padding: "24px" }}>
            <p style={{ marginBottom: "20px", color: "#4B5563" }}>
              Traditional Vedic remedies to help reduce the challenging effects of Sade Sati. 
              These remedies are meant to appease Saturn and bring positive energy.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
              {remedies.map((remedy, idx) => (
                <div key={idx} style={{
                  padding: "16px",
                  backgroundColor: "#F5F3FF",
                  borderRadius: "10px",
                  border: "1px solid #DDD6FE"
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                    <span style={{ fontSize: "1.5rem" }}>{remedy.icon}</span>
                    <div>
                      <h3 style={{ margin: "0 0 4px 0", fontSize: "1rem", color: "#4C1D95", fontWeight: "600" }}>{remedy.title}</h3>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#6D28D9" }}>{remedy.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>🪐 Understanding Sade Sati</h2>
              
              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  <strong>Sade Sati</strong> (साढ़े साती) is a significant period in Vedic astrology lasting approximately 
                  <strong> 7.5 years</strong>. The term &quot;Sade Sati&quot; literally means &quot;seven and a half&quot; in Hindi. 
                  This period occurs when Saturn (Shani) transits through the 12th, 1st, and 2nd houses from your natal Moon sign.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>The Three Phases</h3>
                
                <p><strong>1. Rising Phase (Udaya) - 12th House Transit</strong></p>
                <p>
                  Saturn enters the sign before your Moon sign. This phase often brings increased expenses, 
                  sleep issues, and subtle challenges. It&apos;s the beginning of the karmic cycle.
                </p>
                
                <p><strong>2. Peak Phase (Madhya) - 1st House Transit</strong></p>
                <p>
                  Saturn transits directly over your Moon sign. This is the most intense phase, 
                  directly affecting your mind, emotions, and overall well-being. Major life changes often occur.
                </p>
                
                <p><strong>3. Setting Phase (Astama) - 2nd House Transit</strong></p>
                <p>
                  Saturn moves to the sign after your Moon. This phase affects finances, family, 
                  and speech. Gradual relief begins as the period concludes.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Is Sade Sati Always Bad?</h3>
                <p>
                  Contrary to popular belief, Sade Sati is not always negative. Its effects depend on 
                  Saturn&apos;s placement in your birth chart and other factors. For Taurus and Libra ascendants, 
                  Saturn is a Yogakaraka (beneficial planet), and Sade Sati can bring career growth and success. 
                  Many successful people have achieved great things during their Sade Sati period.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Facts */}
            <div style={{ backgroundColor: "#1E1B4B", borderRadius: "16px", padding: "24px", marginBottom: "24px", color: "white" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "16px" }}>🪐 Saturn Quick Facts</h3>
              <div style={{ fontSize: "0.85rem", lineHeight: "2" }}>
                <p style={{ margin: 0 }}>📍 Current Position: <strong>Pisces</strong></p>
                <p style={{ margin: 0 }}>⏱️ Transit Duration: <strong>~2.5 years/sign</strong></p>
                <p style={{ margin: 0 }}>🔄 Full Zodiac Cycle: <strong>~29.5 years</strong></p>
                <p style={{ margin: 0 }}>📅 Sade Sati Duration: <strong>7.5 years</strong></p>
                <p style={{ margin: 0 }}>🌟 Ruling Signs: <strong>Capricorn, Aquarius</strong></p>
              </div>
            </div>

            {/* Currently Affected */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "16px" }}>⚠️ Currently in Sade Sati</h3>
              <div style={{ fontSize: "0.9rem", color: "#78350F" }}>
                <p style={{ margin: "0 0 8px 0" }}>♈ <strong>Aries (Mesha)</strong> - Rising</p>
                <p style={{ margin: "0 0 8px 0" }}>♓ <strong>Pisces (Meena)</strong> - Peak</p>
                <p style={{ margin: 0 }}>♒ <strong>Aquarius (Kumbha)</strong> - Setting</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/sade-sati-calculator" currentCategory="Lifestyle" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "24px" }}>Frequently Asked Questions</h2>
          <div>
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ padding: "16px", backgroundColor: "#F3F4F6", borderRadius: "8px" }}>
          <p style={{ fontSize: "0.75rem", color: "#6B7280", textAlign: "center", margin: 0 }}>
            🪐 <strong>Disclaimer:</strong> This calculator provides general information based on Vedic astrology principles. 
            Sade Sati effects vary greatly depending on individual birth charts and other planetary positions. 
            For personalized predictions, please consult a qualified Vedic astrologer. 
            This tool is for educational and entertainment purposes only.
          </p>
        </div>
      </div>
    </div>
  );
}