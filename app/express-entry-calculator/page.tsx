"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Age points tables
const agePointsSingle: Record<number, number> = {
  17: 0, 18: 99, 19: 105,
  20: 110, 21: 110, 22: 110, 23: 110, 24: 110, 25: 110, 26: 110, 27: 110, 28: 110, 29: 110,
  30: 105, 31: 99, 32: 94, 33: 88, 34: 83, 35: 77, 36: 72, 37: 66, 38: 61, 39: 55,
  40: 50, 41: 39, 42: 28, 43: 17, 44: 6, 45: 0
};

const agePointsSpouse: Record<number, number> = {
  17: 0, 18: 90, 19: 95,
  20: 100, 21: 100, 22: 100, 23: 100, 24: 100, 25: 100, 26: 100, 27: 100, 28: 100, 29: 100,
  30: 95, 31: 90, 32: 85, 33: 80, 34: 75, 35: 70, 36: 65, 37: 60, 38: 55, 39: 50,
  40: 45, 41: 35, 42: 25, 43: 15, 44: 5, 45: 0
};

// Education points
const educationPointsSingle: Record<string, number> = {
  "phd": 150,
  "masters": 135,
  "professional": 135,
  "two_or_more": 128,
  "bachelors_3plus": 120,
  "bachelors_2year": 98,
  "diploma_3year": 98,
  "diploma_1year": 90,
  "high_school": 30,
  "none": 0
};

const educationPointsSpouse: Record<string, number> = {
  "phd": 140,
  "masters": 126,
  "professional": 126,
  "two_or_more": 119,
  "bachelors_3plus": 112,
  "bachelors_2year": 91,
  "diploma_3year": 91,
  "diploma_1year": 84,
  "high_school": 28,
  "none": 0
};

// First language points per ability
const firstLangPointsSingle: Record<number, number> = {
  10: 34, 9: 31, 8: 23, 7: 17, 6: 9, 5: 6, 4: 6, 3: 0, 0: 0
};

const firstLangPointsSpouse: Record<number, number> = {
  10: 32, 9: 29, 8: 22, 7: 16, 6: 8, 5: 6, 4: 6, 3: 0, 0: 0
};

// Second language points per ability
const secondLangPoints: Record<number, number> = {
  10: 6, 9: 6, 8: 3, 7: 3, 6: 1, 5: 1, 4: 0, 3: 0, 0: 0
};

// Canadian work experience points
const canadianWorkSingle: Record<number, number> = {
  0: 0, 1: 40, 2: 53, 3: 64, 4: 72, 5: 80
};

const canadianWorkSpouse: Record<number, number> = {
  0: 0, 1: 35, 2: 46, 3: 56, 4: 63, 5: 70
};

// Spouse factors
const spouseEducationPoints: Record<string, number> = {
  "phd": 10, "masters": 10, "professional": 10, "two_or_more": 9,
  "bachelors_3plus": 8, "bachelors_2year": 7, "diploma_3year": 7,
  "diploma_1year": 6, "high_school": 2, "none": 0
};

const spouseLanguagePoints: Record<number, number> = {
  10: 5, 9: 5, 8: 3, 7: 3, 6: 1, 5: 1, 4: 0, 3: 0, 0: 0
};

const spouseCanadianWorkPoints: Record<number, number> = {
  0: 0, 1: 5, 2: 7, 3: 8, 4: 9, 5: 10
};

// IELTS to CLB conversion
const ieltsToClb = {
  listening: { 8.5: 10, 8.0: 9, 7.5: 8, 6.0: 7, 5.5: 6, 5.0: 5, 4.5: 4 },
  reading: { 8.0: 10, 7.0: 9, 6.5: 8, 6.0: 7, 5.0: 6, 4.0: 5, 3.5: 4 },
  writing: { 7.5: 10, 7.0: 9, 6.5: 8, 6.0: 7, 5.5: 6, 5.0: 5, 4.0: 4 },
  speaking: { 7.5: 10, 7.0: 9, 6.5: 8, 6.0: 7, 5.5: 6, 5.0: 5, 4.0: 4 }
};

// Education labels
const educationLabels: Record<string, string> = {
  "phd": "Doctoral degree (PhD)",
  "masters": "Master's degree",
  "professional": "Professional degree (Medicine, Law, etc.)",
  "two_or_more": "Two or more credentials (one 3+ years)",
  "bachelors_3plus": "Bachelor's degree (3+ years)",
  "bachelors_2year": "Bachelor's degree (1-2 years)",
  "diploma_3year": "Post-secondary diploma (3+ years)",
  "diploma_1year": "Post-secondary diploma (1 year)",
  "high_school": "High school diploma",
  "none": "Less than high school"
};

// FAQ data
const faqs = [
  {
    question: "Is 450 points enough for Express Entry?",
    answer: "450 points may not be enough for general all-program draws, which typically have cutoffs of 470-510. However, you may be eligible for category-based draws targeting French speakers (420-450 cutoff) or specific occupations like healthcare (430-460). Provincial Nominee Programs (PNP) can also help, as a nomination adds 600 points to your score."
  },
  {
    question: "What happens if my CRS is too low?",
    answer: "If your CRS score is below the draw cutoff, you won't receive an Invitation to Apply (ITA). However, you can improve your score by: retaking language tests to achieve CLB 9+, gaining Canadian work experience, obtaining a provincial nomination (+600 points), adding French language skills (+25-50 points), or pursuing Canadian education (+15-30 points). Your profile remains in the pool for 12 months."
  },
  {
    question: "What score do you need to move to Canada?",
    answer: "There's no fixed minimum score - it depends on the draw type. Recent cutoffs: General draws: 470-510, CEC draws: 505-520, French language draws: 420-450, Healthcare draws: 430-460, PNP draws: 720-750 (includes 600 nomination points). Category-based draws have made immigration possible for candidates with lower scores in targeted fields."
  },
  {
    question: "How much money do I need for Express Entry?",
    answer: "You need to show proof of funds (settlement funds) unless you have valid Canadian work experience. For a single person: CAD $14,690; couple: CAD $18,288; family of 3: CAD $22,483; family of 4: CAD $27,297. These amounts are updated annually. You'll also need funds for language tests (~$300), Educational Credential Assessment (~$200-300), and medical exams (~$200-450)."
  },
  {
    question: "What is a good CRS score in 2025?",
    answer: "A competitive CRS score in 2025 is 500+ for general draws. Scores of 470-500 have a reasonable chance depending on draw frequency. Below 470, you should focus on category-based draws or provincial nominations. The removal of job offer points in March 2025 has leveled the playing field, making language skills and education more important than ever."
  },
  {
    question: "How can I improve my CRS score quickly?",
    answer: "The fastest ways to improve your CRS: 1) Retake IELTS/CELPIP to achieve CLB 9+ (can add 40-80 points), 2) Add French language skills with TEF/TCF (+25-50 points), 3) Apply for Provincial Nominee Programs (+600 points), 4) Gain Canadian work or study experience. Language improvement offers the best ROI as CLB 9+ unlocks skill transferability bonus points."
  }
];

// Helper functions
function getAgePoints(age: number, isSingle: boolean): number {
  const clampedAge = Math.min(Math.max(age, 17), 45);
  return isSingle ? (agePointsSingle[clampedAge] || 0) : (agePointsSpouse[clampedAge] || 0);
}

function getEducationPoints(edu: string, isSingle: boolean): number {
  return isSingle ? (educationPointsSingle[edu] || 0) : (educationPointsSpouse[edu] || 0);
}

function getFirstLanguagePoints(clbLevels: number[], isSingle: boolean): number {
  const table = isSingle ? firstLangPointsSingle : firstLangPointsSpouse;
  return clbLevels.reduce((sum, clb) => sum + (table[Math.min(clb, 10)] || 0), 0);
}

function getSecondLanguagePoints(clbLevels: number[], isSingle: boolean): number {
  const maxPoints = isSingle ? 24 : 22;
  const points = clbLevels.reduce((sum, clb) => sum + (secondLangPoints[Math.min(clb, 10)] || 0), 0);
  return Math.min(points, maxPoints);
}

function getCanadianWorkPoints(years: number, isSingle: boolean): number {
  const clampedYears = Math.min(years, 5);
  return isSingle ? (canadianWorkSingle[clampedYears] || 0) : (canadianWorkSpouse[clampedYears] || 0);
}

function getSpousePoints(spouseEdu: string, spouseClb: number, spouseCanWork: number): number {
  const eduPoints = spouseEducationPoints[spouseEdu] || 0;
  const langPoints = (spouseLanguagePoints[Math.min(spouseClb, 10)] || 0) * 4; // 4 abilities
  const workPoints = spouseCanadianWorkPoints[Math.min(spouseCanWork, 5)] || 0;
  return Math.min(eduPoints + langPoints + workPoints, 40);
}

function getSkillTransferabilityPoints(
  education: string,
  firstLangMin: number,
  canadianWorkYears: number,
  foreignWorkYears: number
): number {
  let total = 0;
  
  const hasGoodEducation = ["phd", "masters", "professional", "two_or_more", "bachelors_3plus"].includes(education);
  const hasHighCLB = firstLangMin >= 9;
  const hasMediumCLB = firstLangMin >= 7;
  const hasCanadianWork = canadianWorkYears >= 1;
  const has2YearsCanadianWork = canadianWorkYears >= 2;
  const hasForeignWork = foreignWorkYears >= 1;
  const has3YearsForeignWork = foreignWorkYears >= 3;
  
  // Education + Language (max 50)
  if (hasGoodEducation && hasHighCLB) {
    total += 50;
  } else if (hasGoodEducation && hasMediumCLB) {
    total += 25;
  }
  
  // Education + Canadian Work (max 50)
  if (hasGoodEducation && has2YearsCanadianWork) {
    total += 50;
  } else if (hasGoodEducation && hasCanadianWork) {
    total += 25;
  }
  
  // Foreign Work + Language (max 50)
  if (has3YearsForeignWork && hasHighCLB) {
    total += 50;
  } else if (hasForeignWork && hasMediumCLB) {
    total += 25;
  }
  
  // Foreign Work + Canadian Work (max 50)
  if (has3YearsForeignWork && has2YearsCanadianWork) {
    total += 50;
  } else if (hasForeignWork && hasCanadianWork) {
    total += 25;
  }
  
  return Math.min(total, 100);
}

function getAdditionalPoints(
  hasPNP: boolean,
  hasCanadianEdu: boolean,
  canadianEduYears: number,
  hasSibling: boolean,
  frenchNclc: number,
  englishClb: number
): number {
  let total = 0;
  
  if (hasPNP) total += 600;
  if (hasSibling) total += 15;
  
  if (hasCanadianEdu) {
    total += canadianEduYears >= 3 ? 30 : 15;
  }
  
  if (frenchNclc >= 7) {
    total += englishClb >= 5 ? 50 : 25;
  }
  
  return total;
}

// 67 Points Calculator functions
function get67AgePoints(age: number): number {
  if (age >= 18 && age <= 35) return 12;
  if (age === 36) return 11;
  if (age === 37) return 10;
  if (age === 38) return 9;
  if (age === 39) return 8;
  if (age === 40) return 7;
  if (age === 41) return 6;
  if (age === 42) return 5;
  if (age === 43) return 4;
  if (age === 44) return 3;
  if (age === 45) return 2;
  if (age === 46) return 1;
  return 0;
}

function get67EducationPoints(edu: string): number {
  const points: Record<string, number> = {
    "phd": 25, "masters": 23, "two_or_more": 22, "bachelors_3plus": 21,
    "bachelors_2year": 19, "diploma_3year": 21, "diploma_1year": 15, "high_school": 5, "none": 0
  };
  return points[edu] || 0;
}

function get67LanguagePoints(clbLevels: number[]): number {
  // Minimum CLB 7 required
  const minClb = Math.min(...clbLevels);
  if (minClb < 7) return 0;
  
  // CLB 9+ in all = 6 points per ability (max 24)
  // CLB 8 = 5 points per ability
  // CLB 7 = 4 points per ability
  return clbLevels.reduce((sum, clb) => {
    if (clb >= 9) return sum + 6;
    if (clb === 8) return sum + 5;
    if (clb === 7) return sum + 4;
    return sum;
  }, 0);
}

function get67WorkPoints(years: number): number {
  if (years >= 6) return 15;
  if (years >= 4) return 13;
  if (years >= 2) return 11;
  if (years >= 1) return 9;
  return 0;
}

// Format number
function formatNumber(num: number): string {
  return num.toLocaleString();
}
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

export default function ExpressEntryCalculator() {
  const [activeTab, setActiveTab] = useState<"crs" | "fswp" | "info">("crs");
  
  // CRS Calculator State
  const [maritalStatus, setMaritalStatus] = useState<string>("single");
  const [age, setAge] = useState<string>("30");
  const [education, setEducation] = useState<string>("bachelors_3plus");
  
  // First Language (English)
  const [langListening, setLangListening] = useState<string>("9");
  const [langReading, setLangReading] = useState<string>("9");
  const [langWriting, setLangWriting] = useState<string>("9");
  const [langSpeaking, setLangSpeaking] = useState<string>("9");
  
  // Second Language (French)
  const [hasSecondLang, setHasSecondLang] = useState<boolean>(false);
  const [secondListening, setSecondListening] = useState<string>("0");
  const [secondReading, setSecondReading] = useState<string>("0");
  const [secondWriting, setSecondWriting] = useState<string>("0");
  const [secondSpeaking, setSecondSpeaking] = useState<string>("0");
  
  // Work Experience
  const [canadianWork, setCanadianWork] = useState<string>("0");
  const [foreignWork, setForeignWork] = useState<string>("3");
  
  // Spouse Factors
  const [spouseEducation, setSpouseEducation] = useState<string>("bachelors_3plus");
  const [spouseClb, setSpouseClb] = useState<string>("7");
  const [spouseCanadianWork, setSpouseCanadianWork] = useState<string>("0");
  
  // Additional Factors
  const [hasPNP, setHasPNP] = useState<boolean>(false);
  const [hasCanadianEducation, setHasCanadianEducation] = useState<boolean>(false);
  const [canadianEduYears, setCanadianEduYears] = useState<string>("1");
  const [hasSibling, setHasSibling] = useState<boolean>(false);
  
  // 67 Points Calculator State
  const [fswpAge, setFswpAge] = useState<string>("30");
  const [fswpEducation, setFswpEducation] = useState<string>("bachelors_3plus");
  const [fswpWorkYears, setFswpWorkYears] = useState<string>("3");
  const [fswpListening, setFswpListening] = useState<string>("9");
  const [fswpReading, setFswpReading] = useState<string>("9");
  const [fswpWriting, setFswpWriting] = useState<string>("9");
  const [fswpSpeaking, setFswpSpeaking] = useState<string>("9");
  const [fswpJobOffer, setFswpJobOffer] = useState<boolean>(false);
  const [fswpSpouseEdu, setFswpSpouseEdu] = useState<boolean>(false);
  const [fswpPrevCanWork, setFswpPrevCanWork] = useState<boolean>(false);
  const [fswpPrevCanStudy, setFswpPrevCanStudy] = useState<boolean>(false);
  const [fswpRelative, setFswpRelative] = useState<boolean>(false);

  // Calculate CRS Score
  const isSingle = maritalStatus === "single" || maritalStatus === "spouse_not_accompanying";
  const ageNum = parseInt(age) || 30;
  const firstLangClb = [
    parseInt(langListening) || 0,
    parseInt(langReading) || 0,
    parseInt(langWriting) || 0,
    parseInt(langSpeaking) || 0
  ];
  const firstLangMin = Math.min(...firstLangClb);
  const secondLangClb = hasSecondLang ? [
    parseInt(secondListening) || 0,
    parseInt(secondReading) || 0,
    parseInt(secondWriting) || 0,
    parseInt(secondSpeaking) || 0
  ] : [0, 0, 0, 0];
  const secondLangMin = Math.min(...secondLangClb);
  const canadianWorkNum = parseInt(canadianWork) || 0;
  const foreignWorkNum = parseInt(foreignWork) || 0;
  
  // Core Human Capital
  const agePoints = getAgePoints(ageNum, isSingle);
  const eduPoints = getEducationPoints(education, isSingle);
  const firstLangPoints = getFirstLanguagePoints(firstLangClb, isSingle);
  const secondLangPoints_calc = getSecondLanguagePoints(secondLangClb, isSingle);
  const canadianWorkPoints = getCanadianWorkPoints(canadianWorkNum, isSingle);
  const coreHumanCapital = agePoints + eduPoints + firstLangPoints + secondLangPoints_calc + canadianWorkPoints;
  
  // Spouse Factors
  const spouseFactor = maritalStatus === "with_spouse" 
    ? getSpousePoints(spouseEducation, parseInt(spouseClb) || 0, parseInt(spouseCanadianWork) || 0)
    : 0;
  
  // Skill Transferability
  const skillTransferability = getSkillTransferabilityPoints(education, firstLangMin, canadianWorkNum, foreignWorkNum);
  
  // Additional Points
  const additionalPoints = getAdditionalPoints(
    hasPNP,
    hasCanadianEducation,
    parseInt(canadianEduYears) || 1,
    hasSibling,
    hasSecondLang ? secondLangMin : 0,
    firstLangMin
  );
  
  const totalCRS = Math.min(1200, coreHumanCapital + spouseFactor + skillTransferability + additionalPoints);
  
  // 67 Points Calculation
  const fswpAgeNum = parseInt(fswpAge) || 30;
  const fswpClbLevels = [
    parseInt(fswpListening) || 0,
    parseInt(fswpReading) || 0,
    parseInt(fswpWriting) || 0,
    parseInt(fswpSpeaking) || 0
  ];
  const fswpAgePoints = get67AgePoints(fswpAgeNum);
  const fswpEduPoints = get67EducationPoints(fswpEducation);
  const fswpLangPoints = get67LanguagePoints(fswpClbLevels);
  const fswpWorkPoints = get67WorkPoints(parseInt(fswpWorkYears) || 0);
  const fswpJobPoints = fswpJobOffer ? 10 : 0;
  
  let fswpAdaptPoints = 0;
  if (fswpSpouseEdu) fswpAdaptPoints += 5;
  if (fswpPrevCanWork) fswpAdaptPoints += 10;
  if (fswpPrevCanStudy) fswpAdaptPoints += 5;
  if (fswpRelative) fswpAdaptPoints += 5;
  fswpAdaptPoints = Math.min(fswpAdaptPoints, 10);
  
  const total67Points = fswpAgePoints + fswpEduPoints + fswpLangPoints + fswpWorkPoints + fswpJobPoints + fswpAdaptPoints;
  const fswpEligible = total67Points >= 67 && Math.min(...fswpClbLevels) >= 7;

  // CRS Score Status
  const getCrsStatus = (score: number) => {
    if (score >= 500) return { color: "#059669", bg: "#ECFDF5", text: "Excellent - High chance of ITA", icon: "🎉" };
    if (score >= 470) return { color: "#2563EB", bg: "#EFF6FF", text: "Good - Competitive score", icon: "👍" };
    if (score >= 450) return { color: "#F59E0B", bg: "#FEF3C7", text: "Fair - Consider category-based draws", icon: "📊" };
    return { color: "#DC2626", bg: "#FEF2F2", text: "Below typical cutoffs - Improvement needed", icon: "⚠️" };
  };
  
  const crsStatus = getCrsStatus(totalCRS);

  const tabs = [
    { id: "crs", label: "CRS Calculator", icon: "🍁" },
    { id: "fswp", label: "67 Points (FSWP)", icon: "📋" },
    { id: "info", label: "How It Works", icon: "📖" }
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Express Entry Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🍁</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Express Entry CRS Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate your Comprehensive Ranking System (CRS) score for Canada Express Entry. 
            Updated for 2025 with the latest IRCC criteria including removal of job offer points.
          </p>
        </div>

        {/* 2025 Update Banner */}
        <div style={{
          backgroundColor: "#FEF2F2",
          borderRadius: "12px",
          padding: "16px 20px",
          marginBottom: "24px",
          border: "1px solid #FECACA"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.25rem" }}>📢</span>
            <div>
              <p style={{ fontWeight: "600", color: "#991B1B", margin: "0 0 4px 0" }}>2025 Update</p>
              <p style={{ color: "#B91C1C", margin: 0, fontSize: "0.85rem" }}>
                As of <strong>March 25, 2025</strong>, job offer points have been removed from CRS. 
                This calculator reflects the current scoring system.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Reference Box */}
        <div style={{
          backgroundColor: "#EFF6FF",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #BFDBFE"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>📊</span>
            <div>
              <p style={{ fontWeight: "600", color: "#1E40AF", margin: "0 0 8px 0" }}>Recent Draw Cutoffs (2025)</p>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "0.85rem", color: "#1D4ED8" }}>
                <span><strong>General:</strong> 470-510</span>
                <span><strong>CEC:</strong> 505-520</span>
                <span><strong>French:</strong> 420-450</span>
                <span><strong>PNP:</strong> 720-750</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              style={{
                padding: "12px 20px",
                borderRadius: "8px 8px 0 0",
                border: "none",
                backgroundColor: activeTab === tab.id ? "#DC2626" : "#E5E7EB",
                color: activeTab === tab.id ? "white" : "#374151",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Calculator Grid */}
        <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
          {/* Input Panel */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "0 16px 16px 16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #E5E7EB",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#DC2626", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "crs" && "🍁 Your Profile"}
                {activeTab === "fswp" && "📋 FSWP Eligibility Check"}
                {activeTab === "info" && "📖 Express Entry Programs"}
              </h2>
            </div>
            
            <div style={{ padding: "24px", maxHeight: "600px", overflowY: "auto" }}>
              {/* CRS CALCULATOR TAB */}
              {activeTab === "crs" && (
                <>
                  {/* Marital Status */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Marital Status
                    </label>
                    <select
                      value={maritalStatus}
                      onChange={(e) => setMaritalStatus(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }}
                    >
                      <option value="single">Single / Not married</option>
                      <option value="with_spouse">Married / Common-law (spouse accompanying)</option>
                      <option value="spouse_not_accompanying">Married (spouse NOT accompanying)</option>
                    </select>
                  </div>

                  {/* Age */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Age
                    </label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      min="17"
                      max="45"
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                    />
                  </div>

                  {/* Education */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Highest Level of Education
                    </label>
                    <select
                      value={education}
                      onChange={(e) => setEducation(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }}
                    >
                      {Object.entries(educationLabels).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>

                  {/* First Language */}
                  <div style={{ marginBottom: "16px", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      First Official Language (CLB Level)
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      <div>
                        <label style={{ fontSize: "0.75rem", color: "#6B7280" }}>Listening</label>
                        <select value={langListening} onChange={(e) => setLangListening(e.target.value)}
                          style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #E5E7EB", fontSize: "0.85rem" }}>
                          {[10, 9, 8, 7, 6, 5, 4].map(n => <option key={n} value={n}>CLB {n}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: "0.75rem", color: "#6B7280" }}>Reading</label>
                        <select value={langReading} onChange={(e) => setLangReading(e.target.value)}
                          style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #E5E7EB", fontSize: "0.85rem" }}>
                          {[10, 9, 8, 7, 6, 5, 4].map(n => <option key={n} value={n}>CLB {n}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: "0.75rem", color: "#6B7280" }}>Writing</label>
                        <select value={langWriting} onChange={(e) => setLangWriting(e.target.value)}
                          style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #E5E7EB", fontSize: "0.85rem" }}>
                          {[10, 9, 8, 7, 6, 5, 4].map(n => <option key={n} value={n}>CLB {n}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: "0.75rem", color: "#6B7280" }}>Speaking</label>
                        <select value={langSpeaking} onChange={(e) => setLangSpeaking(e.target.value)}
                          style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #E5E7EB", fontSize: "0.85rem" }}>
                          {[10, 9, 8, 7, 6, 5, 4].map(n => <option key={n} value={n}>CLB {n}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Second Language */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={hasSecondLang}
                        onChange={(e) => setHasSecondLang(e.target.checked)}
                        style={{ width: "18px", height: "18px" }}
                      />
                      <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#374151" }}>
                        I have French language results (NCLC/TEF/TCF)
                      </span>
                    </label>
                    
                    {hasSecondLang && (
                      <div style={{ marginTop: "12px", padding: "12px", backgroundColor: "#FEF3C7", borderRadius: "8px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                          <div>
                            <label style={{ fontSize: "0.75rem", color: "#92400E" }}>Listening</label>
                            <select value={secondListening} onChange={(e) => setSecondListening(e.target.value)}
                              style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #FCD34D", fontSize: "0.85rem" }}>
                              {[10, 9, 8, 7, 6, 5, 4, 0].map(n => <option key={n} value={n}>{n > 0 ? `NCLC ${n}` : "None"}</option>)}
                            </select>
                          </div>
                          <div>
                            <label style={{ fontSize: "0.75rem", color: "#92400E" }}>Reading</label>
                            <select value={secondReading} onChange={(e) => setSecondReading(e.target.value)}
                              style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #FCD34D", fontSize: "0.85rem" }}>
                              {[10, 9, 8, 7, 6, 5, 4, 0].map(n => <option key={n} value={n}>{n > 0 ? `NCLC ${n}` : "None"}</option>)}
                            </select>
                          </div>
                          <div>
                            <label style={{ fontSize: "0.75rem", color: "#92400E" }}>Writing</label>
                            <select value={secondWriting} onChange={(e) => setSecondWriting(e.target.value)}
                              style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #FCD34D", fontSize: "0.85rem" }}>
                              {[10, 9, 8, 7, 6, 5, 4, 0].map(n => <option key={n} value={n}>{n > 0 ? `NCLC ${n}` : "None"}</option>)}
                            </select>
                          </div>
                          <div>
                            <label style={{ fontSize: "0.75rem", color: "#92400E" }}>Speaking</label>
                            <select value={secondSpeaking} onChange={(e) => setSecondSpeaking(e.target.value)}
                              style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #FCD34D", fontSize: "0.85rem" }}>
                              {[10, 9, 8, 7, 6, 5, 4, 0].map(n => <option key={n} value={n}>{n > 0 ? `NCLC ${n}` : "None"}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Work Experience */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                        Canadian Work (years)
                      </label>
                      <select value={canadianWork} onChange={(e) => setCanadianWork(e.target.value)}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }}>
                        {[0, 1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} {n === 5 ? "+" : ""} year{n !== 1 ? "s" : ""}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                        Foreign Work (years)
                      </label>
                      <select value={foreignWork} onChange={(e) => setForeignWork(e.target.value)}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }}>
                        {[0, 1, 2, 3].map(n => <option key={n} value={n}>{n} {n === 3 ? "+" : ""} year{n !== 1 ? "s" : ""}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Spouse Factors */}
                  {maritalStatus === "with_spouse" && (
                    <div style={{ marginBottom: "16px", padding: "12px", backgroundColor: "#FEF2F2", borderRadius: "8px", border: "1px solid #FECACA" }}>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#991B1B", marginBottom: "8px", fontWeight: "600" }}>
                        👫 Spouse/Partner Factors
                      </label>
                      <div style={{ marginBottom: "8px" }}>
                        <label style={{ fontSize: "0.75rem", color: "#B91C1C" }}>Education</label>
                        <select value={spouseEducation} onChange={(e) => setSpouseEducation(e.target.value)}
                          style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #FECACA", fontSize: "0.85rem" }}>
                          {Object.entries(educationLabels).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                          ))}
                        </select>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                        <div>
                          <label style={{ fontSize: "0.75rem", color: "#B91C1C" }}>Language (lowest CLB)</label>
                          <select value={spouseClb} onChange={(e) => setSpouseClb(e.target.value)}
                            style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #FECACA", fontSize: "0.85rem" }}>
                            {[10, 9, 8, 7, 6, 5, 4, 0].map(n => <option key={n} value={n}>{n > 0 ? `CLB ${n}` : "N/A"}</option>)}
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: "0.75rem", color: "#B91C1C" }}>Canadian Work</label>
                          <select value={spouseCanadianWork} onChange={(e) => setSpouseCanadianWork(e.target.value)}
                            style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #FECACA", fontSize: "0.85rem" }}>
                            {[0, 1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} year{n !== 1 ? "s" : ""}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Additional Points */}
                  <div style={{ padding: "12px", backgroundColor: "#ECFDF5", borderRadius: "8px", border: "1px solid #6EE7B7" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#065F46", marginBottom: "8px", fontWeight: "600" }}>
                      ✨ Additional Points
                    </label>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.85rem", color: "#047857" }}>
                        <input type="checkbox" checked={hasPNP} onChange={(e) => setHasPNP(e.target.checked)} />
                        Provincial Nomination (PNP) <span style={{ color: "#059669", fontWeight: "600" }}>+600</span>
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.85rem", color: "#047857" }}>
                        <input type="checkbox" checked={hasSibling} onChange={(e) => setHasSibling(e.target.checked)} />
                        Sibling in Canada (citizen/PR) <span style={{ color: "#059669", fontWeight: "600" }}>+15</span>
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.85rem", color: "#047857" }}>
                        <input type="checkbox" checked={hasCanadianEducation} onChange={(e) => setHasCanadianEducation(e.target.checked)} />
                        Canadian post-secondary education
                      </label>
                      {hasCanadianEducation && (
                        <select value={canadianEduYears} onChange={(e) => setCanadianEduYears(e.target.value)}
                          style={{ padding: "6px", borderRadius: "6px", border: "1px solid #6EE7B7", fontSize: "0.8rem", marginLeft: "24px" }}>
                          <option value="1">1-2 years (+15)</option>
                          <option value="3">3+ years (+30)</option>
                        </select>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* FSWP 67 POINTS TAB */}
              {activeTab === "fswp" && (
                <>
                  <p style={{ fontSize: "0.85rem", color: "#6B7280", marginBottom: "16px", padding: "10px", backgroundColor: "#F3F4F6", borderRadius: "8px" }}>
                    The Federal Skilled Worker Program (FSWP) requires a minimum of <strong>67 points out of 100</strong> to be eligible for Express Entry.
                  </p>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Age (max 12 points)
                    </label>
                    <input
                      type="number"
                      value={fswpAge}
                      onChange={(e) => setFswpAge(e.target.value)}
                      min="17"
                      max="47"
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                    />
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Education (max 25 points)
                    </label>
                    <select
                      value={fswpEducation}
                      onChange={(e) => setFswpEducation(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }}
                    >
                      {Object.entries(educationLabels).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: "16px", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Language - CLB Level (max 24 points)
                    </label>
                    <p style={{ fontSize: "0.7rem", color: "#DC2626", marginBottom: "8px" }}>⚠️ Minimum CLB 7 in ALL abilities required</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      <div>
                        <label style={{ fontSize: "0.75rem", color: "#6B7280" }}>Listening</label>
                        <select value={fswpListening} onChange={(e) => setFswpListening(e.target.value)}
                          style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #E5E7EB", fontSize: "0.85rem" }}>
                          {[10, 9, 8, 7, 6, 5, 4].map(n => <option key={n} value={n}>CLB {n}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: "0.75rem", color: "#6B7280" }}>Reading</label>
                        <select value={fswpReading} onChange={(e) => setFswpReading(e.target.value)}
                          style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #E5E7EB", fontSize: "0.85rem" }}>
                          {[10, 9, 8, 7, 6, 5, 4].map(n => <option key={n} value={n}>CLB {n}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: "0.75rem", color: "#6B7280" }}>Writing</label>
                        <select value={fswpWriting} onChange={(e) => setFswpWriting(e.target.value)}
                          style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #E5E7EB", fontSize: "0.85rem" }}>
                          {[10, 9, 8, 7, 6, 5, 4].map(n => <option key={n} value={n}>CLB {n}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: "0.75rem", color: "#6B7280" }}>Speaking</label>
                        <select value={fswpSpeaking} onChange={(e) => setFswpSpeaking(e.target.value)}
                          style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #E5E7EB", fontSize: "0.85rem" }}>
                          {[10, 9, 8, 7, 6, 5, 4].map(n => <option key={n} value={n}>CLB {n}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Work Experience - Skilled NOC TEER 0/1/2/3 (max 15 points)
                    </label>
                    <select
                      value={fswpWorkYears}
                      onChange={(e) => setFswpWorkYears(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }}
                    >
                      {[0, 1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}+ years</option>)}
                    </select>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.85rem", color: "#374151" }}>
                      <input type="checkbox" checked={fswpJobOffer} onChange={(e) => setFswpJobOffer(e.target.checked)} />
                      <span><strong>Arranged Employment</strong> (max 10 points)</span>
                    </label>
                  </div>

                  <div style={{ padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Adaptability (max 10 points)
                    </label>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.85rem" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                        <input type="checkbox" checked={fswpSpouseEdu} onChange={(e) => setFswpSpouseEdu(e.target.checked)} />
                        Spouse has post-secondary education (+5)
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                        <input type="checkbox" checked={fswpPrevCanWork} onChange={(e) => setFswpPrevCanWork(e.target.checked)} />
                        Previous Canadian work experience (+10)
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                        <input type="checkbox" checked={fswpPrevCanStudy} onChange={(e) => setFswpPrevCanStudy(e.target.checked)} />
                        Previous Canadian study (+5)
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                        <input type="checkbox" checked={fswpRelative} onChange={(e) => setFswpRelative(e.target.checked)} />
                        Relative in Canada (+5)
                      </label>
                    </div>
                  </div>
                </>
              )}

              {/* INFO TAB */}
              {activeTab === "info" && (
                <>
                  <div style={{ marginBottom: "20px" }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "#DC2626", marginBottom: "12px" }}>What is Express Entry?</h3>
                    <p style={{ fontSize: "0.85rem", color: "#4B5563", lineHeight: "1.7" }}>
                      Express Entry is Canada&apos;s main system for managing applications for permanent residence from skilled workers. 
                      It uses the Comprehensive Ranking System (CRS) to rank candidates out of 1,200 points.
                    </p>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "#DC2626", marginBottom: "12px" }}>Three Programs</h3>
                    
                    <div style={{ backgroundColor: "#EFF6FF", borderRadius: "8px", padding: "12px", marginBottom: "8px" }}>
                      <p style={{ fontWeight: "600", color: "#1E40AF", margin: "0 0 4px 0", fontSize: "0.85rem" }}>🎓 Federal Skilled Worker Program (FSWP)</p>
                      <p style={{ color: "#1D4ED8", margin: 0, fontSize: "0.8rem" }}>For skilled workers with foreign work experience. Requires 67 points.</p>
                    </div>
                    
                    <div style={{ backgroundColor: "#ECFDF5", borderRadius: "8px", padding: "12px", marginBottom: "8px" }}>
                      <p style={{ fontWeight: "600", color: "#065F46", margin: "0 0 4px 0", fontSize: "0.85rem" }}>💼 Canadian Experience Class (CEC)</p>
                      <p style={{ color: "#047857", margin: 0, fontSize: "0.8rem" }}>For those with Canadian skilled work experience (1+ year).</p>
                    </div>
                    
                    <div style={{ backgroundColor: "#FEF3C7", borderRadius: "8px", padding: "12px" }}>
                      <p style={{ fontWeight: "600", color: "#92400E", margin: "0 0 4px 0", fontSize: "0.85rem" }}>🔧 Federal Skilled Trades Program (FSTP)</p>
                      <p style={{ color: "#B45309", margin: 0, fontSize: "0.8rem" }}>For skilled tradespeople with qualifying experience.</p>
                    </div>
                  </div>

                  <div>
                    <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "#DC2626", marginBottom: "12px" }}>CRS Scoring Categories</h3>
                    <div style={{ fontSize: "0.85rem", color: "#4B5563" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #E5E7EB" }}>
                        <span>Core Human Capital</span>
                        <span style={{ fontWeight: "600" }}>Max 500 (single) / 460 (spouse)</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #E5E7EB" }}>
                        <span>Spouse Factors</span>
                        <span style={{ fontWeight: "600" }}>Max 40</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #E5E7EB" }}>
                        <span>Skill Transferability</span>
                        <span style={{ fontWeight: "600" }}>Max 100</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
                        <span>Additional Points</span>
                        <span style={{ fontWeight: "600" }}>Max 600</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
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
            <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "crs" && "📊 Your CRS Score"}
                {activeTab === "fswp" && "✅ Eligibility Result"}
                {activeTab === "info" && "📈 Recent Draw History"}
              </h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {/* CRS RESULTS */}
              {activeTab === "crs" && (
                <>
                  <div style={{
                    backgroundColor: crsStatus.bg,
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: `2px solid ${crsStatus.color}`,
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: crsStatus.color }}>
                      {crsStatus.icon} {crsStatus.text}
                    </p>
                    <p style={{ margin: 0, fontSize: "3rem", fontWeight: "bold", color: crsStatus.color }}>
                      {totalCRS}
                    </p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: crsStatus.color }}>
                      out of 1,200 points
                    </p>
                  </div>

                  {/* Score Breakdown */}
                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>Score Breakdown</h4>
                    <div style={{ fontSize: "0.85rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", padding: "6px 0", borderBottom: "1px solid #E5E7EB" }}>
                        <span style={{ color: "#4B5563" }}>Core Human Capital</span>
                        <span style={{ fontWeight: "600", color: "#111827" }}>{coreHumanCapital}</span>
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#6B7280", marginBottom: "8px", paddingLeft: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}><span>Age</span><span>{agePoints}</span></div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}><span>Education</span><span>{eduPoints}</span></div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}><span>First Language</span><span>{firstLangPoints}</span></div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}><span>Second Language</span><span>{secondLangPoints_calc}</span></div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}><span>Canadian Work</span><span>{canadianWorkPoints}</span></div>
                      </div>
                      
                      {maritalStatus === "with_spouse" && (
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", padding: "6px 0", borderBottom: "1px solid #E5E7EB" }}>
                          <span style={{ color: "#4B5563" }}>Spouse Factors</span>
                          <span style={{ fontWeight: "600", color: "#111827" }}>{spouseFactor}</span>
                        </div>
                      )}
                      
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", padding: "6px 0", borderBottom: "1px solid #E5E7EB" }}>
                        <span style={{ color: "#4B5563" }}>Skill Transferability</span>
                        <span style={{ fontWeight: "600", color: "#111827" }}>{skillTransferability}</span>
                      </div>
                      
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                        <span style={{ color: "#4B5563" }}>Additional Points</span>
                        <span style={{ fontWeight: "600", color: "#111827" }}>{additionalPoints}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tips */}
                  <div style={{ backgroundColor: "#EFF6FF", borderRadius: "10px", padding: "12px", border: "1px solid #BFDBFE" }}>
                    <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", fontWeight: "600", color: "#1E40AF" }}>💡 Tips to Improve</p>
                    <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "0.8rem", color: "#1D4ED8", lineHeight: "1.8" }}>
                      {firstLangMin < 9 && <li>Retake language test for CLB 9+ (+25-50 points)</li>}
                      {!hasSecondLang && <li>Add French language (NCLC 7+) for +25-50 points</li>}
                      {!hasPNP && <li>Apply for Provincial Nomination (+600 points)</li>}
                      {canadianWorkNum === 0 && <li>Gain Canadian work experience for significant boost</li>}
                    </ul>
                  </div>
                </>
              )}

              {/* FSWP RESULTS */}
              {activeTab === "fswp" && (
                <>
                  <div style={{
                    backgroundColor: fswpEligible ? "#ECFDF5" : "#FEF2F2",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: `2px solid ${fswpEligible ? "#059669" : "#DC2626"}`,
                    textAlign: "center"
                  }}>
                    <p style={{ margin: 0, fontSize: "3rem" }}>{fswpEligible ? "✅" : "❌"}</p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "1.25rem", fontWeight: "bold", color: fswpEligible ? "#059669" : "#DC2626" }}>
                      {fswpEligible ? "ELIGIBLE" : "NOT ELIGIBLE"}
                    </p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.9rem", color: fswpEligible ? "#047857" : "#B91C1C" }}>
                      {total67Points} / 67 points {!fswpEligible && Math.min(...fswpClbLevels) < 7 && "(CLB 7 minimum required)"}
                    </p>
                  </div>

                  {/* 67 Points Breakdown */}
                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>Points Breakdown</h4>
                    <div style={{ fontSize: "0.85rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Age (max 12)</span>
                        <span style={{ fontWeight: "600" }}>{fswpAgePoints}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Education (max 25)</span>
                        <span style={{ fontWeight: "600" }}>{fswpEduPoints}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Language (max 24)</span>
                        <span style={{ fontWeight: "600", color: fswpLangPoints === 0 ? "#DC2626" : "inherit" }}>{fswpLangPoints}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Work Experience (max 15)</span>
                        <span style={{ fontWeight: "600" }}>{fswpWorkPoints}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Arranged Employment (max 10)</span>
                        <span style={{ fontWeight: "600" }}>{fswpJobPoints}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Adaptability (max 10)</span>
                        <span style={{ fontWeight: "600" }}>{fswpAdaptPoints}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px", borderTop: "1px solid #D1D5DB" }}>
                        <span style={{ fontWeight: "600" }}>Total</span>
                        <span style={{ fontWeight: "bold", color: total67Points >= 67 ? "#059669" : "#DC2626" }}>{total67Points} / 100</span>
                      </div>
                    </div>
                  </div>

                  {!fswpEligible && (
                    <div style={{ backgroundColor: "#FEF3C7", borderRadius: "10px", padding: "12px", border: "1px solid #FCD34D" }}>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#92400E" }}>
                        💡 <strong>Not eligible?</strong> You may still qualify through CEC (Canadian Experience Class) if you have 1+ year of Canadian work experience, or through FSTP if you&apos;re a skilled tradesperson.
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* INFO RESULTS */}
              {activeTab === "info" && (
                <>
                  <div style={{ marginBottom: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>Recent Express Entry Draws (2025)</h4>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#F3F4F6" }}>
                          <th style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "left" }}>Type</th>
                          <th style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "center" }}>CRS Cutoff</th>
                          <th style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "center" }}>ITAs</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ padding: "8px", border: "1px solid #E5E7EB" }}>General</td>
                          <td style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "center" }}>470-510</td>
                          <td style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "center" }}>3,000-5,000</td>
                        </tr>
                        <tr style={{ backgroundColor: "#F9FAFB" }}>
                          <td style={{ padding: "8px", border: "1px solid #E5E7EB" }}>CEC Only</td>
                          <td style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "center" }}>505-520</td>
                          <td style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "center" }}>4,000-8,000</td>
                        </tr>
                        <tr>
                          <td style={{ padding: "8px", border: "1px solid #E5E7EB" }}>French Language</td>
                          <td style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669", fontWeight: "600" }}>420-450</td>
                          <td style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "center" }}>3,000-6,000</td>
                        </tr>
                        <tr style={{ backgroundColor: "#F9FAFB" }}>
                          <td style={{ padding: "8px", border: "1px solid #E5E7EB" }}>Healthcare</td>
                          <td style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669", fontWeight: "600" }}>430-460</td>
                          <td style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "center" }}>1,000-3,000</td>
                        </tr>
                        <tr>
                          <td style={{ padding: "8px", border: "1px solid #E5E7EB" }}>PNP</td>
                          <td style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "center" }}>720-750</td>
                          <td style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "center" }}>700-1,500</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div style={{ backgroundColor: "#ECFDF5", borderRadius: "10px", padding: "12px", marginBottom: "16px", border: "1px solid #6EE7B7" }}>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#065F46" }}>
                      💡 <strong>Category-based draws</strong> target specific occupations or French speakers with lower cutoffs. Check if you qualify!
                    </p>
                  </div>

                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "12px" }}>
                    <h4 style={{ margin: "0 0 8px 0", color: "#374151", fontSize: "0.85rem" }}>Proof of Funds (2025)</h4>
                    <div style={{ fontSize: "0.8rem", color: "#4B5563" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}><span>1 person</span><span>CAD $14,690</span></div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}><span>2 people</span><span>CAD $18,288</span></div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}><span>3 people</span><span>CAD $22,483</span></div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}><span>4 people</span><span>CAD $27,297</span></div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* CRS Points Reference Tables */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#DC2626", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 CRS Points Reference Tables</h2>
          </div>
          <div style={{ padding: "24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
              {/* Age Points */}
              <div>
                <h3 style={{ fontSize: "0.95rem", fontWeight: "600", color: "#111827", marginBottom: "12px" }}>Age Points (Single / With Spouse)</h3>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F3F4F6" }}>
                      <th style={{ padding: "6px", border: "1px solid #E5E7EB" }}>Age</th>
                      <th style={{ padding: "6px", border: "1px solid #E5E7EB" }}>Single</th>
                      <th style={{ padding: "6px", border: "1px solid #E5E7EB" }}>Spouse</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { age: "20-29", single: 110, spouse: 100 },
                      { age: "30", single: 105, spouse: 95 },
                      { age: "35", single: 77, spouse: 70 },
                      { age: "40", single: 50, spouse: 45 },
                      { age: "45+", single: 0, spouse: 0 },
                    ].map((row, idx) => (
                      <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                        <td style={{ padding: "6px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.age}</td>
                        <td style={{ padding: "6px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.single}</td>
                        <td style={{ padding: "6px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.spouse}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* CLB Points */}
              <div>
                <h3 style={{ fontSize: "0.95rem", fontWeight: "600", color: "#111827", marginBottom: "12px" }}>First Language (per ability)</h3>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F3F4F6" }}>
                      <th style={{ padding: "6px", border: "1px solid #E5E7EB" }}>CLB</th>
                      <th style={{ padding: "6px", border: "1px solid #E5E7EB" }}>Single</th>
                      <th style={{ padding: "6px", border: "1px solid #E5E7EB" }}>Spouse</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { clb: "CLB 10", single: 34, spouse: 32 },
                      { clb: "CLB 9", single: 31, spouse: 29 },
                      { clb: "CLB 8", single: 23, spouse: 22 },
                      { clb: "CLB 7", single: 17, spouse: 16 },
                      { clb: "CLB 6", single: 9, spouse: 8 },
                    ].map((row, idx) => (
                      <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                        <td style={{ padding: "6px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.clb}</td>
                        <td style={{ padding: "6px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.single}</td>
                        <td style={{ padding: "6px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.spouse}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* IELTS to CLB */}
              <div>
                <h3 style={{ fontSize: "0.95rem", fontWeight: "600", color: "#111827", marginBottom: "12px" }}>IELTS to CLB Conversion</h3>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F3F4F6" }}>
                      <th style={{ padding: "6px", border: "1px solid #E5E7EB" }}>CLB</th>
                      <th style={{ padding: "6px", border: "1px solid #E5E7EB" }}>L</th>
                      <th style={{ padding: "6px", border: "1px solid #E5E7EB" }}>R</th>
                      <th style={{ padding: "6px", border: "1px solid #E5E7EB" }}>W</th>
                      <th style={{ padding: "6px", border: "1px solid #E5E7EB" }}>S</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { clb: 10, l: "8.5", r: "8.0", w: "7.5", s: "7.5" },
                      { clb: 9, l: "8.0", r: "7.0", w: "7.0", s: "7.0" },
                      { clb: 8, l: "7.5", r: "6.5", w: "6.5", s: "6.5" },
                      { clb: 7, l: "6.0", r: "6.0", w: "6.0", s: "6.0" },
                    ].map((row, idx) => (
                      <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                        <td style={{ padding: "6px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>{row.clb}</td>
                        <td style={{ padding: "6px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.l}</td>
                        <td style={{ padding: "6px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.r}</td>
                        <td style={{ padding: "6px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.w}</td>
                        <td style={{ padding: "6px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.s}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>🍁 Understanding Express Entry CRS</h2>
              
              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <h3 style={{ color: "#111827", marginTop: "0", marginBottom: "12px" }}>How the CRS Works</h3>
                <p>
                  The Comprehensive Ranking System (CRS) is a points-based system used by Immigration, Refugees and 
                  Citizenship Canada (IRCC) to rank Express Entry candidates. Your CRS score determines your rank in the 
                  pool and whether you&apos;ll receive an Invitation to Apply (ITA) for permanent residence.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Key Scoring Factors</h3>
                <p>
                  <strong>Age:</strong> Maximum points awarded between ages 20-29, declining to zero at age 45+.<br/>
                  <strong>Education:</strong> Higher credentials earn more points; a PhD earns the maximum.<br/>
                  <strong>Language:</strong> CLB 9+ is crucial for unlocking skill transferability bonus points.<br/>
                  <strong>Work Experience:</strong> Canadian experience is weighted heavily; foreign experience adds to transferability.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>2025 Changes</h3>
                <p>
                  As of March 25, 2025, job offer points (previously worth up to 200 points) have been removed from the CRS. 
                  This change levels the playing field for candidates without Canadian employment connections. Focus on improving 
                  language scores and pursuing provincial nominations for the biggest score increases.
                </p>
              </div>
            </div>
          </div>

          <div style={{ flex: "1", minWidth: "280px" }}>
            <div style={{ backgroundColor: "#FEF2F2", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FECACA" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#991B1B", marginBottom: "16px" }}>🎯 Quick Boost Strategies</h3>
              <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.85rem", color: "#B91C1C", lineHeight: "1.8" }}>
                <li><strong>CLB 9+</strong> = +40-80 points (skill transferability)</li>
                <li><strong>French NCLC 7+</strong> = +25-50 points</li>
                <li><strong>PNP Nomination</strong> = +600 points</li>
                <li><strong>Canadian Education</strong> = +15-30 points</li>
                <li><strong>Sibling in Canada</strong> = +15 points</li>
              </ul>
            </div>

            <div style={{ backgroundColor: "#ECFDF5", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #6EE7B7" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "12px" }}>📋 Documents Needed</h3>
              <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.85rem", color: "#047857", lineHeight: "1.8" }}>
                <li>Language test results (IELTS/CELPIP/TEF)</li>
                <li>Educational Credential Assessment (ECA)</li>
                <li>Passport</li>
                <li>Proof of funds</li>
                <li>Work reference letters</li>
              </ul>
            </div>

            <RelatedTools currentUrl="/express-entry-calculator" currentCategory="Immigration" />
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
            🍁 <strong>Disclaimer:</strong> This calculator provides estimates for informational purposes only. 
            Your actual CRS score will be determined by IRCC based on your submitted profile and supporting documents. 
            For official results, use the <a href="https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/check-score.html" target="_blank" rel="noopener noreferrer" style={{ color: "#DC2626" }}>IRCC CRS Tool</a>.
          </p>
        </div>
      </div>
    </div>
  );
}