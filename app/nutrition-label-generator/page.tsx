"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// ============================================
// FDA Daily Values (2021 Standard)
// ============================================
const dailyValues = {
  totalFat: 78, // g
  saturatedFat: 20, // g
  cholesterol: 300, // mg
  sodium: 2300, // mg
  totalCarbs: 275, // g
  dietaryFiber: 28, // g
  addedSugars: 50, // g
  protein: 50, // g
  vitaminD: 20, // mcg
  calcium: 1300, // mg
  iron: 18, // mg
  potassium: 4700, // mg
};

// Label formats
const labelFormats = [
  { value: "standard", label: "Standard Vertical", emoji: "📋", description: "Most common format" },
  { value: "simplified", label: "Simplified", emoji: "📝", description: "For products with few nutrients" },
  { value: "linear", label: "Linear", emoji: "📏", description: "For small packages" },
  { value: "tabular", label: "Tabular", emoji: "📊", description: "For medium packages" },
];

// FAQ data
const faqs = [
  {
    question: "What is a Nutrition Facts label?",
    answer: "A Nutrition Facts label is a panel required by the FDA on most packaged foods in the United States. It provides information about the nutrient content of the food, including calories, fats, carbohydrates, protein, vitamins, and minerals per serving."
  },
  {
    question: "Are the labels generated FDA compliant?",
    answer: "Our generator creates labels that follow the FDA 2021 Nutrition Facts label format and guidelines. However, for commercial use, we recommend having your labels reviewed by a regulatory expert to ensure full compliance with all applicable regulations."
  },
  {
    question: "What label format should I use?",
    answer: "Standard Vertical is the most common format suitable for most products. Use Simplified for products with 8 or fewer nutrients. Linear format works well for small packages with limited space. Tabular format is ideal for medium-sized packages where vertical space is limited."
  },
  {
    question: "How are the % Daily Values calculated?",
    answer: "Percent Daily Values (%DV) are calculated based on FDA's Daily Reference Values (DRVs) for a 2,000 calorie diet. For example, if a food has 10g of total fat, the %DV would be 13% (10g ÷ 78g daily value × 100)."
  },
  {
    question: "What nutrients are required on the label?",
    answer: "The FDA requires: Calories, Total Fat, Saturated Fat, Trans Fat, Cholesterol, Sodium, Total Carbohydrates, Dietary Fiber, Total Sugars, Added Sugars, Protein, Vitamin D, Calcium, Iron, and Potassium. Some nutrients like Trans Fat don't have a %DV."
  },
  {
    question: "Can I download the nutrition label?",
    answer: "Yes! After generating your label, click the 'Download PNG' button to save a high-resolution image. You can also download as SVG for vector graphics. The downloaded image can be used in your packaging design software."
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

export default function NutritionLabelGenerator() {
  // Basic Info
  const [servingSize, setServingSize] = useState("1 cup (240g)");
  const [servingsPerContainer, setServingsPerContainer] = useState("8");
  const [labelFormat, setLabelFormat] = useState("standard");

  // Nutrients
  const [calories, setCalories] = useState("230");
  const [totalFat, setTotalFat] = useState("8");
  const [saturatedFat, setSaturatedFat] = useState("1");
  const [transFat, setTransFat] = useState("0");
  const [cholesterol, setCholesterol] = useState("0");
  const [sodium, setSodium] = useState("160");
  const [totalCarbs, setTotalCarbs] = useState("37");
  const [dietaryFiber, setDietaryFiber] = useState("4");
  const [totalSugars, setTotalSugars] = useState("12");
  const [addedSugars, setAddedSugars] = useState("10");
  const [protein, setProtein] = useState("3");
  const [vitaminD, setVitaminD] = useState("2");
  const [calcium, setCalcium] = useState("260");
  const [iron, setIron] = useState("8");
  const [potassium, setPotassium] = useState("235");

  const [generated, setGenerated] = useState(false);
  const labelRef = useRef<HTMLDivElement>(null);

  // Calculate %DV
  const calcDV = (value: string, dvValue: number): number => {
    const num = parseFloat(value) || 0;
    return Math.round((num / dvValue) * 100);
  };

  // Generate label
  const generateLabel = () => {
    setGenerated(true);
  };

  // Download as PNG
  const downloadPNG = async () => {
    if (!labelRef.current) return;
    
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(labelRef.current, {
        backgroundColor: "#FFFFFF",
        scale: 3
      });
      
      const link = document.createElement('a');
      link.download = 'nutrition-facts-label.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating PNG:', error);
      alert('Error downloading PNG. Please try again.');
    }
  };

  // Reset form
  const resetForm = () => {
    setServingSize("1 cup (240g)");
    setServingsPerContainer("8");
    setCalories("230");
    setTotalFat("8");
    setSaturatedFat("1");
    setTransFat("0");
    setCholesterol("0");
    setSodium("160");
    setTotalCarbs("37");
    setDietaryFiber("4");
    setTotalSugars("12");
    setAddedSugars("10");
    setProtein("3");
    setVitaminD("2");
    setCalcium("260");
    setIron("8");
    setPotassium("235");
    setGenerated(false);
  };

  // Render Standard Vertical Label
  const renderStandardLabel = () => (
    <div style={{
      width: "280px",
      border: "1px solid #000",
      padding: "4px",
      fontFamily: "Helvetica, Arial, sans-serif",
      backgroundColor: "#fff",
      fontSize: "12px"
    }}>
      {/* Header */}
      <div style={{ fontSize: "28px", fontWeight: "900", fontFamily: "Helvetica Black, Arial Black, sans-serif" }}>
        Nutrition Facts
      </div>
      <div style={{ borderBottom: "1px solid #000", paddingBottom: "4px" }}>
        <div style={{ fontSize: "11px" }}>{servingsPerContainer} servings per container</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontWeight: "700", fontSize: "13px" }}>Serving size</span>
          <span style={{ fontWeight: "700", fontSize: "13px" }}>{servingSize}</span>
        </div>
      </div>

      {/* Calories */}
      <div style={{ borderBottom: "10px solid #000", paddingTop: "4px", paddingBottom: "4px" }}>
        <div style={{ fontSize: "10px", fontWeight: "700" }}>Amount per serving</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontSize: "28px", fontWeight: "900" }}>Calories</span>
          <span style={{ fontSize: "28px", fontWeight: "900" }}>{calories}</span>
        </div>
      </div>

      {/* % Daily Value Header */}
      <div style={{ textAlign: "right", fontSize: "10px", fontWeight: "700", borderBottom: "1px solid #000", paddingTop: "2px", paddingBottom: "2px" }}>
        % Daily Value*
      </div>

      {/* Nutrients */}
      <div style={{ borderBottom: "1px solid #000", padding: "2px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span><strong>Total Fat</strong> {totalFat}g</span>
          <strong>{calcDV(totalFat, dailyValues.totalFat)}%</strong>
        </div>
      </div>

      <div style={{ borderBottom: "1px solid #000", padding: "2px 0", paddingLeft: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Saturated Fat {saturatedFat}g</span>
          <strong>{calcDV(saturatedFat, dailyValues.saturatedFat)}%</strong>
        </div>
      </div>

      <div style={{ borderBottom: "1px solid #000", padding: "2px 0", paddingLeft: "16px" }}>
        <span><em>Trans</em> Fat {transFat}g</span>
      </div>

      <div style={{ borderBottom: "1px solid #000", padding: "2px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span><strong>Cholesterol</strong> {cholesterol}mg</span>
          <strong>{calcDV(cholesterol, dailyValues.cholesterol)}%</strong>
        </div>
      </div>

      <div style={{ borderBottom: "1px solid #000", padding: "2px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span><strong>Sodium</strong> {sodium}mg</span>
          <strong>{calcDV(sodium, dailyValues.sodium)}%</strong>
        </div>
      </div>

      <div style={{ borderBottom: "1px solid #000", padding: "2px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span><strong>Total Carbohydrate</strong> {totalCarbs}g</span>
          <strong>{calcDV(totalCarbs, dailyValues.totalCarbs)}%</strong>
        </div>
      </div>

      <div style={{ borderBottom: "1px solid #000", padding: "2px 0", paddingLeft: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Dietary Fiber {dietaryFiber}g</span>
          <strong>{calcDV(dietaryFiber, dailyValues.dietaryFiber)}%</strong>
        </div>
      </div>

      <div style={{ borderBottom: "1px solid #000", padding: "2px 0", paddingLeft: "16px" }}>
        <span>Total Sugars {totalSugars}g</span>
      </div>

      <div style={{ borderBottom: "1px solid #000", padding: "2px 0", paddingLeft: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Includes {addedSugars}g Added Sugars</span>
          <strong>{calcDV(addedSugars, dailyValues.addedSugars)}%</strong>
        </div>
      </div>

      <div style={{ borderBottom: "10px solid #000", padding: "2px 0" }}>
        <span><strong>Protein</strong> {protein}g</span>
      </div>

      {/* Vitamins & Minerals */}
      <div style={{ borderBottom: "1px solid #000", padding: "2px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Vitamin D {vitaminD}mcg</span>
          <span>{calcDV(vitaminD, dailyValues.vitaminD)}%</span>
        </div>
      </div>

      <div style={{ borderBottom: "1px solid #000", padding: "2px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Calcium {calcium}mg</span>
          <span>{calcDV(calcium, dailyValues.calcium)}%</span>
        </div>
      </div>

      <div style={{ borderBottom: "1px solid #000", padding: "2px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Iron {iron}mg</span>
          <span>{calcDV(iron, dailyValues.iron)}%</span>
        </div>
      </div>

      <div style={{ borderBottom: "4px solid #000", padding: "2px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Potassium {potassium}mg</span>
          <span>{calcDV(potassium, dailyValues.potassium)}%</span>
        </div>
      </div>

      {/* Footer */}
      <div style={{ fontSize: "9px", paddingTop: "4px", lineHeight: "1.3" }}>
        <div>* The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.</div>
      </div>
    </div>
  );

  // Render Simplified Label
  const renderSimplifiedLabel = () => (
    <div style={{
      width: "220px",
      border: "1px solid #000",
      padding: "4px",
      fontFamily: "Helvetica, Arial, sans-serif",
      backgroundColor: "#fff",
      fontSize: "11px"
    }}>
      <div style={{ fontSize: "22px", fontWeight: "900" }}>Nutrition Facts</div>
      <div style={{ borderBottom: "1px solid #000", paddingBottom: "2px", fontSize: "10px" }}>
        <div>{servingsPerContainer} servings per container</div>
        <div><strong>Serving size</strong> {servingSize}</div>
      </div>
      <div style={{ borderBottom: "8px solid #000", padding: "4px 0" }}>
        <div style={{ fontSize: "9px", fontWeight: "700" }}>Amount per serving</div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "20px", fontWeight: "900" }}>Calories</span>
          <span style={{ fontSize: "20px", fontWeight: "900" }}>{calories}</span>
        </div>
      </div>
      <div style={{ textAlign: "right", fontSize: "9px", fontWeight: "700", borderBottom: "1px solid #000", padding: "2px 0" }}>
        % Daily Value*
      </div>
      <div style={{ borderBottom: "1px solid #000", padding: "2px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span><strong>Total Fat</strong> {totalFat}g</span>
          <strong>{calcDV(totalFat, dailyValues.totalFat)}%</strong>
        </div>
      </div>
      <div style={{ borderBottom: "1px solid #000", padding: "2px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span><strong>Sodium</strong> {sodium}mg</span>
          <strong>{calcDV(sodium, dailyValues.sodium)}%</strong>
        </div>
      </div>
      <div style={{ borderBottom: "1px solid #000", padding: "2px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span><strong>Total Carb.</strong> {totalCarbs}g</span>
          <strong>{calcDV(totalCarbs, dailyValues.totalCarbs)}%</strong>
        </div>
      </div>
      <div style={{ borderBottom: "4px solid #000", padding: "2px 0" }}>
        <span><strong>Protein</strong> {protein}g</span>
      </div>
      <div style={{ fontSize: "8px", paddingTop: "2px" }}>
        Not a significant source of other nutrients.
      </div>
      <div style={{ fontSize: "8px", paddingTop: "2px" }}>
        * The % Daily Value tells you how much a nutrient contributes to a daily diet. 2,000 calories a day is used.
      </div>
    </div>
  );

  // Render Linear Label
  const renderLinearLabel = () => (
    <div style={{
      width: "100%",
      maxWidth: "500px",
      border: "1px solid #000",
      padding: "6px 8px",
      fontFamily: "Helvetica, Arial, sans-serif",
      backgroundColor: "#fff",
      fontSize: "10px"
    }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "4px" }}>
        <span style={{ fontWeight: "900", fontSize: "14px" }}>Nutrition Facts</span>
        <span>Serv. Size {servingSize},</span>
        <span><strong>Calories</strong> {calories},</span>
        <span><strong>Total Fat</strong> {totalFat}g ({calcDV(totalFat, dailyValues.totalFat)}% DV),</span>
        <span><strong>Sat. Fat</strong> {saturatedFat}g ({calcDV(saturatedFat, dailyValues.saturatedFat)}% DV),</span>
        <span><strong>Trans Fat</strong> {transFat}g,</span>
        <span><strong>Cholest.</strong> {cholesterol}mg ({calcDV(cholesterol, dailyValues.cholesterol)}% DV),</span>
        <span><strong>Sodium</strong> {sodium}mg ({calcDV(sodium, dailyValues.sodium)}% DV),</span>
        <span><strong>Total Carb.</strong> {totalCarbs}g ({calcDV(totalCarbs, dailyValues.totalCarbs)}% DV),</span>
        <span><strong>Fiber</strong> {dietaryFiber}g ({calcDV(dietaryFiber, dailyValues.dietaryFiber)}% DV),</span>
        <span><strong>Total Sugars</strong> {totalSugars}g (Incl. {addedSugars}g Added Sugars, {calcDV(addedSugars, dailyValues.addedSugars)}% DV),</span>
        <span><strong>Protein</strong> {protein}g,</span>
        <span><strong>Vit. D</strong> {vitaminD}mcg ({calcDV(vitaminD, dailyValues.vitaminD)}% DV),</span>
        <span><strong>Calcium</strong> {calcium}mg ({calcDV(calcium, dailyValues.calcium)}% DV),</span>
        <span><strong>Iron</strong> {iron}mg ({calcDV(iron, dailyValues.iron)}% DV),</span>
        <span><strong>Potas.</strong> {potassium}mg ({calcDV(potassium, dailyValues.potassium)}% DV).</span>
      </div>
    </div>
  );

  // Render Tabular Label
  const renderTabularLabel = () => (
    <div style={{
      width: "100%",
      maxWidth: "480px",
      border: "1px solid #000",
      padding: "4px",
      fontFamily: "Helvetica, Arial, sans-serif",
      backgroundColor: "#fff",
      fontSize: "10px"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid #000", paddingBottom: "2px" }}>
        <span style={{ fontSize: "18px", fontWeight: "900" }}>Nutrition Facts</span>
        <span>{servingsPerContainer} servings per container, Serving size {servingSize}</span>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "4px" }}>
        <thead>
          <tr style={{ borderBottom: "4px solid #000" }}>
            <th style={{ textAlign: "left", padding: "2px" }}>Amount/serving</th>
            <th style={{ textAlign: "right", padding: "2px" }}>%DV*</th>
            <th style={{ textAlign: "left", padding: "2px", borderLeft: "1px solid #000", paddingLeft: "8px" }}>Amount/serving</th>
            <th style={{ textAlign: "right", padding: "2px" }}>%DV*</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: "2px" }}><strong>Calories</strong> {calories}</td>
            <td></td>
            <td style={{ padding: "2px", borderLeft: "1px solid #000", paddingLeft: "8px" }}><strong>Total Carb.</strong> {totalCarbs}g</td>
            <td style={{ textAlign: "right", padding: "2px" }}><strong>{calcDV(totalCarbs, dailyValues.totalCarbs)}%</strong></td>
          </tr>
          <tr>
            <td style={{ padding: "2px" }}><strong>Total Fat</strong> {totalFat}g</td>
            <td style={{ textAlign: "right", padding: "2px" }}><strong>{calcDV(totalFat, dailyValues.totalFat)}%</strong></td>
            <td style={{ padding: "2px", borderLeft: "1px solid #000", paddingLeft: "16px" }}>Dietary Fiber {dietaryFiber}g</td>
            <td style={{ textAlign: "right", padding: "2px" }}>{calcDV(dietaryFiber, dailyValues.dietaryFiber)}%</td>
          </tr>
          <tr>
            <td style={{ padding: "2px", paddingLeft: "8px" }}>Sat. Fat {saturatedFat}g</td>
            <td style={{ textAlign: "right", padding: "2px" }}>{calcDV(saturatedFat, dailyValues.saturatedFat)}%</td>
            <td style={{ padding: "2px", borderLeft: "1px solid #000", paddingLeft: "16px" }}>Total Sugars {totalSugars}g</td>
            <td></td>
          </tr>
          <tr>
            <td style={{ padding: "2px", paddingLeft: "8px" }}><em>Trans</em> Fat {transFat}g</td>
            <td></td>
            <td style={{ padding: "2px", borderLeft: "1px solid #000", paddingLeft: "24px" }}>Incl. Added Sugars {addedSugars}g</td>
            <td style={{ textAlign: "right", padding: "2px" }}>{calcDV(addedSugars, dailyValues.addedSugars)}%</td>
          </tr>
          <tr>
            <td style={{ padding: "2px" }}><strong>Cholest.</strong> {cholesterol}mg</td>
            <td style={{ textAlign: "right", padding: "2px" }}><strong>{calcDV(cholesterol, dailyValues.cholesterol)}%</strong></td>
            <td style={{ padding: "2px", borderLeft: "1px solid #000", paddingLeft: "8px" }}><strong>Protein</strong> {protein}g</td>
            <td></td>
          </tr>
          <tr style={{ borderTop: "4px solid #000" }}>
            <td style={{ padding: "2px" }}><strong>Sodium</strong> {sodium}mg</td>
            <td style={{ textAlign: "right", padding: "2px" }}><strong>{calcDV(sodium, dailyValues.sodium)}%</strong></td>
            <td style={{ padding: "2px", borderLeft: "1px solid #000", paddingLeft: "8px" }}>Vitamin D {vitaminD}mcg</td>
            <td style={{ textAlign: "right", padding: "2px" }}>{calcDV(vitaminD, dailyValues.vitaminD)}%</td>
          </tr>
          <tr>
            <td style={{ padding: "2px" }}>Calcium {calcium}mg</td>
            <td style={{ textAlign: "right", padding: "2px" }}>{calcDV(calcium, dailyValues.calcium)}%</td>
            <td style={{ padding: "2px", borderLeft: "1px solid #000", paddingLeft: "8px" }}>Iron {iron}mg</td>
            <td style={{ textAlign: "right", padding: "2px" }}>{calcDV(iron, dailyValues.iron)}%</td>
          </tr>
          <tr>
            <td colSpan={2} style={{ padding: "2px" }}>Potassium {potassium}mg</td>
            <td colSpan={2} style={{ textAlign: "right", padding: "2px" }}>{calcDV(potassium, dailyValues.potassium)}%</td>
          </tr>
        </tbody>
      </table>
      <div style={{ fontSize: "8px", paddingTop: "4px", borderTop: "1px solid #000", marginTop: "2px" }}>
        *The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
      </div>
    </div>
  );

  // Render label based on format
  const renderLabel = () => {
    switch (labelFormat) {
      case "simplified":
        return renderSimplifiedLabel();
      case "linear":
        return renderLinearLabel();
      case "tabular":
        return renderTabularLabel();
      default:
        return renderStandardLabel();
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ECFDF5" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #A7F3D0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Nutrition Label Generator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "2.5rem" }}>🏷️</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Free Nutrition Label Generator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Create FDA-compliant Nutrition Facts labels for your food products. 
            Free online tool with multiple formats. Download as PNG instantly.
          </p>
        </div>

        {/* Tip Box */}
        <div style={{
          backgroundColor: "#059669",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>✅</span>
            <div>
              <p style={{ fontWeight: "600", color: "white", margin: "0 0 4px 0" }}>
                <strong>FDA 2021 Compliant Format</strong>
              </p>
              <p style={{ color: "#A7F3D0", margin: 0, fontSize: "0.95rem" }}>
                Our labels follow the latest FDA Nutrition Facts requirements including Added Sugars, Vitamin D, and Potassium.
              </p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
          {/* Input Panel */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #A7F3D0",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                📝 Enter Nutrition Information
              </h2>
            </div>

            <div style={{ padding: "24px", maxHeight: "700px", overflowY: "auto" }}>
              {/* Label Format */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                  📋 Label Format
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                  {labelFormats.map((format) => (
                    <button
                      key={format.value}
                      onClick={() => setLabelFormat(format.value)}
                      style={{
                        padding: "10px 8px",
                        borderRadius: "8px",
                        border: labelFormat === format.value ? "2px solid #059669" : "1px solid #E5E7EB",
                        backgroundColor: labelFormat === format.value ? "#ECFDF5" : "white",
                        cursor: "pointer",
                        textAlign: "center"
                      }}
                    >
                      <div style={{ fontSize: "1.2rem", marginBottom: "2px" }}>{format.emoji}</div>
                      <div style={{ fontSize: "0.75rem", fontWeight: labelFormat === format.value ? "600" : "400", color: labelFormat === format.value ? "#059669" : "#4B5563" }}>
                        {format.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Serving Info */}
              <div style={{ marginBottom: "20px", padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                <h3 style={{ fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600", margin: "0 0 12px 0" }}>
                  🍽️ Serving Information
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", color: "#6B7280", marginBottom: "4px" }}>Serving Size</label>
                    <input
                      type="text"
                      value={servingSize}
                      onChange={(e) => setServingSize(e.target.value)}
                      placeholder="1 cup (240g)"
                      style={{ width: "100%", padding: "8px 12px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "0.9rem", boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", color: "#6B7280", marginBottom: "4px" }}>Servings/Container</label>
                    <input
                      type="text"
                      value={servingsPerContainer}
                      onChange={(e) => setServingsPerContainer(e.target.value)}
                      placeholder="8"
                      style={{ width: "100%", padding: "8px 12px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "0.9rem", boxSizing: "border-box" }}
                    />
                  </div>
                </div>
              </div>

              {/* Calories */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                  🔥 Calories
                </label>
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  placeholder="230"
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "1rem", boxSizing: "border-box" }}
                />
              </div>

              {/* Fats */}
              <div style={{ marginBottom: "20px", padding: "16px", backgroundColor: "#FEF3C7", borderRadius: "8px" }}>
                <h3 style={{ fontSize: "0.9rem", color: "#92400E", marginBottom: "12px", fontWeight: "600", margin: "0 0 12px 0" }}>
                  🧈 Fats
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>Total Fat (g)</label>
                    <input type="number" value={totalFat} onChange={(e) => setTotalFat(e.target.value)} style={{ width: "100%", padding: "8px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "0.9rem", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>Saturated (g)</label>
                    <input type="number" value={saturatedFat} onChange={(e) => setSaturatedFat(e.target.value)} style={{ width: "100%", padding: "8px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "0.9rem", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>Trans (g)</label>
                    <input type="number" value={transFat} onChange={(e) => setTransFat(e.target.value)} style={{ width: "100%", padding: "8px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "0.9rem", boxSizing: "border-box" }} />
                  </div>
                </div>
              </div>

              {/* Cholesterol & Sodium */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", color: "#6B7280", marginBottom: "4px" }}>Cholesterol (mg)</label>
                    <input type="number" value={cholesterol} onChange={(e) => setCholesterol(e.target.value)} style={{ width: "100%", padding: "8px 12px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "0.9rem", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", color: "#6B7280", marginBottom: "4px" }}>Sodium (mg)</label>
                    <input type="number" value={sodium} onChange={(e) => setSodium(e.target.value)} style={{ width: "100%", padding: "8px 12px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "0.9rem", boxSizing: "border-box" }} />
                  </div>
                </div>
              </div>

              {/* Carbohydrates */}
              <div style={{ marginBottom: "20px", padding: "16px", backgroundColor: "#DBEAFE", borderRadius: "8px" }}>
                <h3 style={{ fontSize: "0.9rem", color: "#1E40AF", marginBottom: "12px", fontWeight: "600", margin: "0 0 12px 0" }}>
                  🍞 Carbohydrates
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>Total Carbs (g)</label>
                    <input type="number" value={totalCarbs} onChange={(e) => setTotalCarbs(e.target.value)} style={{ width: "100%", padding: "8px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "0.9rem", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>Dietary Fiber (g)</label>
                    <input type="number" value={dietaryFiber} onChange={(e) => setDietaryFiber(e.target.value)} style={{ width: "100%", padding: "8px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "0.9rem", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>Total Sugars (g)</label>
                    <input type="number" value={totalSugars} onChange={(e) => setTotalSugars(e.target.value)} style={{ width: "100%", padding: "8px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "0.9rem", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>Added Sugars (g)</label>
                    <input type="number" value={addedSugars} onChange={(e) => setAddedSugars(e.target.value)} style={{ width: "100%", padding: "8px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "0.9rem", boxSizing: "border-box" }} />
                  </div>
                </div>
              </div>

              {/* Protein */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#6B7280", marginBottom: "4px" }}>🥩 Protein (g)</label>
                <input type="number" value={protein} onChange={(e) => setProtein(e.target.value)} style={{ width: "100%", padding: "8px 12px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "0.9rem", boxSizing: "border-box" }} />
              </div>

              {/* Vitamins & Minerals */}
              <div style={{ marginBottom: "20px", padding: "16px", backgroundColor: "#F3E8FF", borderRadius: "8px" }}>
                <h3 style={{ fontSize: "0.9rem", color: "#6B21A8", marginBottom: "12px", fontWeight: "600", margin: "0 0 12px 0" }}>
                  💊 Vitamins & Minerals
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>Vitamin D (mcg)</label>
                    <input type="number" value={vitaminD} onChange={(e) => setVitaminD(e.target.value)} style={{ width: "100%", padding: "8px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "0.9rem", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>Calcium (mg)</label>
                    <input type="number" value={calcium} onChange={(e) => setCalcium(e.target.value)} style={{ width: "100%", padding: "8px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "0.9rem", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>Iron (mg)</label>
                    <input type="number" value={iron} onChange={(e) => setIron(e.target.value)} style={{ width: "100%", padding: "8px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "0.9rem", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>Potassium (mg)</label>
                    <input type="number" value={potassium} onChange={(e) => setPotassium(e.target.value)} style={{ width: "100%", padding: "8px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "0.9rem", boxSizing: "border-box" }} />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={generateLabel}
                  style={{
                    flex: 2,
                    padding: "14px",
                    backgroundColor: "#059669",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px"
                  }}
                >
                  ✨ Generate Label
                </button>
                <button
                  onClick={resetForm}
                  style={{
                    flex: 1,
                    padding: "14px",
                    backgroundColor: "#F3F4F6",
                    color: "#374151",
                    border: "1px solid #D1D5DB",
                    borderRadius: "10px",
                    fontSize: "1rem",
                    fontWeight: "500",
                    cursor: "pointer"
                  }}
                >
                  🔄 Reset
                </button>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="calc-results" style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #A7F3D0",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#047857", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                👁️ Label Preview
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              {/* Preview Area */}
              <div style={{
                backgroundColor: "#F3F4F6",
                borderRadius: "12px",
                padding: "24px",
                minHeight: "400px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px"
              }}>
                {!generated ? (
                  <div style={{ textAlign: "center", color: "#6B7280" }}>
                    <p style={{ fontSize: "3rem", margin: "0 0 12px 0" }}>🏷️</p>
                    <p style={{ margin: 0 }}>Fill in the nutrition information</p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem" }}>Your FDA label will appear here</p>
                  </div>
                ) : (
                  <div ref={labelRef} style={{ display: "inline-block" }}>
                    {renderLabel()}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {generated && (
                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={downloadPNG}
                    style={{
                      flex: 1,
                      padding: "12px",
                      backgroundColor: "#059669",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px"
                    }}
                  >
                    📥 Download PNG
                  </button>
                </div>
              )}

              {/* Format Info */}
              <div style={{ marginTop: "20px", padding: "16px", backgroundColor: "#ECFDF5", borderRadius: "8px", border: "1px solid #A7F3D0" }}>
                <h4 style={{ margin: "0 0 8px 0", color: "#065F46", fontSize: "0.9rem" }}>
                  {labelFormats.find(f => f.value === labelFormat)?.emoji} {labelFormats.find(f => f.value === labelFormat)?.label} Format
                </h4>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#047857" }}>
                  {labelFormat === "standard" && "The standard vertical format is required for most food packages. It provides complete nutrition information in a familiar layout."}
                  {labelFormat === "simplified" && "Use this format when your product contains insignificant amounts of 8 or more required nutrients."}
                  {labelFormat === "linear" && "The linear (string) format is allowed for packages with less than 12 square inches of available labeling space."}
                  {labelFormat === "tabular" && "The tabular format is allowed for packages with insufficient vertical space but enough horizontal space."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Values Reference */}
        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "16px", 
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)", 
          border: "1px solid #A7F3D0", 
          padding: "32px",
          marginBottom: "32px"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
            📊 FDA Daily Values Reference (2,000 calorie diet)
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            {[
              { name: "Total Fat", value: "78g" },
              { name: "Saturated Fat", value: "20g" },
              { name: "Cholesterol", value: "300mg" },
              { name: "Sodium", value: "2,300mg" },
              { name: "Total Carbs", value: "275g" },
              { name: "Dietary Fiber", value: "28g" },
              { name: "Added Sugars", value: "50g" },
              { name: "Protein", value: "50g" },
              { name: "Vitamin D", value: "20mcg" },
              { name: "Calcium", value: "1,300mg" },
              { name: "Iron", value: "18mg" },
              { name: "Potassium", value: "4,700mg" },
            ].map((item, idx) => (
              <div 
                key={idx}
                style={{
                  padding: "12px",
                  backgroundColor: "#F0FDF4",
                  borderRadius: "8px",
                  textAlign: "center",
                  border: "1px solid #BBF7D0"
                }}
              >
                <div style={{ fontSize: "0.8rem", color: "#6B7280", marginBottom: "4px" }}>{item.name}</div>
                <div style={{ fontSize: "1.1rem", fontWeight: "600", color: "#047857" }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #A7F3D0", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
                📋 Understanding Nutrition Facts Labels
              </h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  The Nutrition Facts label is one of the most useful tools for making informed food choices. 
                  Required by the FDA on most packaged foods, it provides essential information about the 
                  nutritional content of the food you&apos;re about to consume.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Key Components of a Nutrition Label</h3>
                <div style={{
                  backgroundColor: "#ECFDF5",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #A7F3D0"
                }}>
                  <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "2" }}>
                    <li><strong>Serving Size:</strong> The basis for all nutrient amounts listed</li>
                    <li><strong>Calories:</strong> Energy provided per serving</li>
                    <li><strong>% Daily Value:</strong> How much a nutrient contributes to a 2,000 calorie diet</li>
                    <li><strong>Nutrients to Limit:</strong> Saturated fat, sodium, and added sugars</li>
                    <li><strong>Nutrients to Get Enough Of:</strong> Fiber, vitamin D, calcium, iron, potassium</li>
                  </ul>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>FDA 2021 Label Updates</h3>
                <p>
                  The updated Nutrition Facts label reflects new scientific information and helps consumers 
                  make better-informed food choices. Key changes include:
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", margin: "16px 0" }}>
                  <div style={{ padding: "16px", backgroundColor: "#F0FDF4", borderRadius: "8px", border: "1px solid #BBF7D0" }}>
                    <strong>✅ Added Sugars</strong>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#065F46" }}>
                      Now required with % Daily Value
                    </p>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#F0FDF4", borderRadius: "8px", border: "1px solid #BBF7D0" }}>
                    <strong>✅ Vitamin D & Potassium</strong>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#065F46" }}>
                      Now mandatory on the label
                    </p>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#F0FDF4", borderRadius: "8px", border: "1px solid #BBF7D0" }}>
                    <strong>✅ Updated Serving Sizes</strong>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#065F46" }}>
                      Reflect actual consumption patterns
                    </p>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#F0FDF4", borderRadius: "8px", border: "1px solid #BBF7D0" }}>
                    <strong>✅ Larger Calorie Display</strong>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#065F46" }}>
                      Calories now larger and bolder
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Tips */}
            <div style={{ backgroundColor: "#059669", borderRadius: "16px", padding: "24px", marginBottom: "24px", color: "white" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "16px" }}>💡 Label Tips</h3>
              <div style={{ fontSize: "0.85rem", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>• 5% DV or less is LOW</p>
                <p style={{ margin: "0 0 8px 0" }}>• 20% DV or more is HIGH</p>
                <p style={{ margin: "0 0 8px 0" }}>• Compare similar products</p>
                <p style={{ margin: "0 0 8px 0" }}>• Check serving size first</p>
                <p style={{ margin: 0 }}>• Limit added sugars & sodium</p>
              </div>
            </div>

            {/* Who Needs Labels */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "16px" }}>🎯 Who Needs This?</h3>
              <div style={{ fontSize: "0.85rem", color: "#B45309", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>• Food manufacturers</p>
                <p style={{ margin: "0 0 8px 0" }}>• Home bakers & sellers</p>
                <p style={{ margin: "0 0 8px 0" }}>• Restaurant owners</p>
                <p style={{ margin: "0 0 8px 0" }}>• Meal prep businesses</p>
                <p style={{ margin: 0 }}>• Nutrition educators</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/nutrition-label-generator" currentCategory="Health" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #A7F3D0", padding: "32px", marginBottom: "24px" }}>
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
        <div style={{ padding: "16px", backgroundColor: "#ECFDF5", borderRadius: "8px", border: "1px solid #A7F3D0" }}>
          <p style={{ fontSize: "0.75rem", color: "#047857", textAlign: "center", margin: 0 }}>
            🏷️ <strong>Disclaimer:</strong> This tool generates nutrition labels following FDA format guidelines. 
            For commercial use, please consult with a regulatory expert to ensure full compliance with all applicable regulations.
            Nutritional data should be obtained from laboratory analysis or reliable databases.
          </p>
        </div>
      </div>
    </div>
  );
}