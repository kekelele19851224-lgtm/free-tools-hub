"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Common supplement ingredients with Daily Values
const commonIngredients = [
  { name: "Vitamin A", unit: "mcg", dv: 900, common: 900 },
  { name: "Vitamin C", unit: "mg", dv: 90, common: 60 },
  { name: "Vitamin D", unit: "mcg", dv: 20, common: 25 },
  { name: "Vitamin E", unit: "mg", dv: 15, common: 30 },
  { name: "Vitamin K", unit: "mcg", dv: 120, common: 80 },
  { name: "Thiamin (B1)", unit: "mg", dv: 1.2, common: 1.5 },
  { name: "Riboflavin (B2)", unit: "mg", dv: 1.3, common: 1.7 },
  { name: "Niacin (B3)", unit: "mg", dv: 16, common: 20 },
  { name: "Vitamin B6", unit: "mg", dv: 1.7, common: 2 },
  { name: "Folate", unit: "mcg DFE", dv: 400, common: 400 },
  { name: "Vitamin B12", unit: "mcg", dv: 2.4, common: 6 },
  { name: "Biotin", unit: "mcg", dv: 30, common: 300 },
  { name: "Pantothenic Acid", unit: "mg", dv: 5, common: 10 },
  { name: "Calcium", unit: "mg", dv: 1300, common: 200 },
  { name: "Iron", unit: "mg", dv: 18, common: 18 },
  { name: "Phosphorus", unit: "mg", dv: 1250, common: 100 },
  { name: "Iodine", unit: "mcg", dv: 150, common: 150 },
  { name: "Magnesium", unit: "mg", dv: 420, common: 100 },
  { name: "Zinc", unit: "mg", dv: 11, common: 15 },
  { name: "Selenium", unit: "mcg", dv: 55, common: 70 },
  { name: "Copper", unit: "mg", dv: 0.9, common: 2 },
  { name: "Manganese", unit: "mg", dv: 2.3, common: 2 },
  { name: "Chromium", unit: "mcg", dv: 35, common: 120 },
  { name: "Molybdenum", unit: "mcg", dv: 45, common: 75 }
];

// Serving size options
const servingSizeOptions = [
  "1 Tablet",
  "2 Tablets",
  "1 Capsule",
  "2 Capsules",
  "1 Softgel",
  "2 Softgels",
  "1 Gummy",
  "2 Gummies",
  "1 Scoop",
  "1 Teaspoon",
  "1 Tablespoon",
  "1 Packet"
];

// Label size options for download
const labelSizeOptions = [
  { id: "small", name: "Small (2\" × 3\")", width: 600, height: 900 },
  { id: "standard", name: "Standard (2.5\" × 3.75\")", width: 750, height: 1125 },
  { id: "large", name: "Large (3\" × 4.5\")", width: 900, height: 1350 }
];

// Funny label templates
const funnyTemplates = [
  {
    id: "best-mom",
    title: "Best Mom Ever",
    ingredients: [
      { name: "Unconditional Love", amount: "100", unit: "%", dv: "∞" },
      { name: "Patience", amount: "500", unit: "mg", dv: "250" },
      { name: "Wisdom", amount: "1000", unit: "IU", dv: "300" },
      { name: "Hugs", amount: "Unlimited", unit: "", dv: "∞" },
      { name: "Worry About Kids", amount: "24/7", unit: "", dv: "1000" },
      { name: "Coffee Dependency", amount: "High", unit: "", dv: "200" }
    ]
  },
  {
    id: "best-dad",
    title: "World's Best Dad",
    ingredients: [
      { name: "Dad Jokes", amount: "9999", unit: "mg", dv: "500" },
      { name: "BBQ Skills", amount: "100", unit: "%", dv: "300" },
      { name: "Fixing Stuff", amount: "Expert", unit: "", dv: "∞" },
      { name: "Protective Instinct", amount: "Maximum", unit: "", dv: "1000" },
      { name: "Sports Knowledge", amount: "Endless", unit: "", dv: "400" },
      { name: "Nap Taking Ability", amount: "Pro Level", unit: "", dv: "250" }
    ]
  },
  {
    id: "birthday",
    title: "Birthday Superstar",
    ingredients: [
      { name: "Awesomeness", amount: "100", unit: "%", dv: "∞" },
      { name: "Cake Consumption", amount: "Unlimited", unit: "", dv: "500" },
      { name: "Party Energy", amount: "Maximum", unit: "", dv: "1000" },
      { name: "Gift Receiving", amount: "Expert", unit: "", dv: "300" },
      { name: "Wish Making Power", amount: "1", unit: "", dv: "100" },
      { name: "Years of Awesome", amount: "+1", unit: "", dv: "∞" }
    ]
  },
  {
    id: "employee",
    title: "Amazing Employee",
    ingredients: [
      { name: "Dedication", amount: "110", unit: "%", dv: "500" },
      { name: "Problem Solving", amount: "Expert", unit: "", dv: "300" },
      { name: "Coffee Intake", amount: "High", unit: "", dv: "400" },
      { name: "Team Spirit", amount: "Maximum", unit: "", dv: "250" },
      { name: "Meeting Survival", amount: "Pro", unit: "", dv: "∞" },
      { name: "Deadline Crushing", amount: "100", unit: "%", dv: "1000" }
    ]
  },
  {
    id: "best-friend",
    title: "Best Friend Forever",
    ingredients: [
      { name: "Loyalty", amount: "100", unit: "%", dv: "∞" },
      { name: "Secret Keeping", amount: "Maximum", unit: "", dv: "500" },
      { name: "Fun Times", amount: "Unlimited", unit: "", dv: "1000" },
      { name: "Emotional Support", amount: "24/7", unit: "", dv: "∞" },
      { name: "Inside Jokes", amount: "Countless", unit: "", dv: "300" },
      { name: "Adventure Readiness", amount: "Always", unit: "", dv: "400" }
    ]
  },
  {
    id: "custom",
    title: "Custom Person",
    ingredients: []
  }
];

// Label types info
const labelTypesInfo = [
  {
    type: "Supplement Facts",
    usedFor: "Dietary supplements (vitamins, minerals, herbs, amino acids)",
    required: ["Serving size", "Servings per container", "Amount per serving", "% Daily Value", "Other ingredients"],
    example: "Multivitamins, Fish Oil, Protein Powder, Herbal Supplements"
  },
  {
    type: "Nutrition Facts",
    usedFor: "Conventional foods and beverages",
    required: ["Serving size", "Calories", "Total Fat", "Sodium", "Total Carbs", "Protein", "Vitamins & Minerals"],
    example: "Cereal, Snacks, Beverages, Packaged Foods"
  }
];

// FAQ data
const faqs = [
  {
    question: "What is a Supplement Facts label?",
    answer: "A Supplement Facts label is a required panel on dietary supplement products that lists the serving size, servings per container, and the amount of each dietary ingredient (vitamins, minerals, herbs, etc.) per serving. It also shows the % Daily Value (%DV) to help consumers understand how much of their daily nutrient needs the supplement provides."
  },
  {
    question: "What's the difference between Supplement Facts and Nutrition Facts?",
    answer: "Supplement Facts labels are used for dietary supplements (vitamins, minerals, herbs, protein powders), while Nutrition Facts labels are used for conventional foods. Key differences: Supplement Facts can list ingredients without established Daily Values, can include proprietary blends, and must list the plant part source for botanicals. Nutrition Facts must list calories, fats, carbs, and protein."
  },
  {
    question: "What are the FDA requirements for supplement labels?",
    answer: "FDA requires Supplement Facts labels to include: 1) The title 'Supplement Facts' in bold, 2) Serving size and servings per container, 3) Names and quantities of all dietary ingredients, 4) % Daily Value when established, 5) A footnote explaining Daily Value, 6) Other ingredients listed below the panel. Labels must use specific formatting and font sizes as outlined in 21 CFR 101.36."
  },
  {
    question: "How do I calculate % Daily Value?",
    answer: "To calculate % Daily Value: divide the amount of the nutrient in one serving by the Daily Value (DV) for that nutrient, then multiply by 100. For example, if your supplement has 30mg of Vitamin C and the DV is 90mg: (30 ÷ 90) × 100 = 33% DV. If a nutrient doesn't have an established DV, you can use a † symbol and note 'Daily Value not established.'"
  },
  {
    question: "Can I use this generator for commercial products?",
    answer: "This generator creates labels for educational and reference purposes. For commercial products, you should verify all information meets current FDA regulations, have your product tested by an accredited laboratory to confirm nutrient amounts, and consult with a regulatory expert to ensure full compliance with labeling laws."
  },
  {
    question: "What products require a Supplement Facts label?",
    answer: "Products that require Supplement Facts labels include: vitamins and minerals, herbal and botanical products, amino acids, enzymes, organ tissues, glandulars, metabolites, extracts, and concentrates. Energy shots, protein powders marketed as supplements, and products making structure/function claims typically need Supplement Facts labels."
  }
];

// Ingredient type for supplement generator
interface SupplementIngredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
  dv: number | null;
  dvPercent: string;
}

// Ingredient type for funny generator
interface FunnyIngredient {
  name: string;
  amount: string;
  unit: string;
  dv: string;
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
        <svg
          style={{
            width: "20px",
            height: "20px",
            color: "#6B7280",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
            flexShrink: 0
          }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div style={{
        maxHeight: isOpen ? "500px" : "0",
        overflow: "hidden",
        transition: "max-height 0.2s ease-out"
      }}>
        <p style={{ color: "#4B5563", paddingBottom: "16px", margin: 0, lineHeight: "1.6" }}>{answer}</p>
      </div>
    </div>
  );
}

export default function SupplementFactsLabelGenerator() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"generator" | "funny" | "guide">("generator");
  
  // Supplement generator state (Tab 1)
  const [servingSize, setServingSize] = useState("1 Capsule");
  const [servingsPerContainer, setServingsPerContainer] = useState("60");
  const [ingredients, setIngredients] = useState<SupplementIngredient[]>([]);
  const [selectedPreset, setSelectedPreset] = useState("");
  const [customName, setCustomName] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [customUnit, setCustomUnit] = useState("mg");
  const [labelSize, setLabelSize] = useState("standard");
  const labelRef = useRef<HTMLDivElement>(null);
  const funnyLabelRef = useRef<HTMLDivElement>(null);
  
  // Funny generator state (Tab 2)
  const [funnyTemplate, setFunnyTemplate] = useState("best-mom");
  const [funnyPersonName, setFunnyPersonName] = useState("");
  const [funnyIngredients, setFunnyIngredients] = useState<FunnyIngredient[]>(funnyTemplates[0].ingredients);
  const [funnyColor, setFunnyColor] = useState("#10B981");
  const [funnyLabelSize, setFunnyLabelSize] = useState("standard");

  // Add preset ingredient
  const addPresetIngredient = () => {
    if (!selectedPreset) return;
    
    const preset = commonIngredients.find(i => i.name === selectedPreset);
    if (!preset) return;
    
    // Check if already added
    if (ingredients.some(i => i.name === preset.name)) {
      alert("This ingredient is already added!");
      return;
    }
    
    const dvPercent = Math.round((preset.common / preset.dv) * 100);
    
    setIngredients([...ingredients, {
      id: Date.now().toString(),
      name: preset.name,
      amount: preset.common.toString(),
      unit: preset.unit,
      dv: preset.dv,
      dvPercent: dvPercent.toString() + "%"
    }]);
    
    setSelectedPreset("");
  };

  // Add custom ingredient
  const addCustomIngredient = () => {
    if (!customName || !customAmount) return;
    
    setIngredients([...ingredients, {
      id: Date.now().toString(),
      name: customName,
      amount: customAmount,
      unit: customUnit,
      dv: null,
      dvPercent: "†"
    }]);
    
    setCustomName("");
    setCustomAmount("");
  };

  // Remove ingredient
  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter(i => i.id !== id));
  };

  // Update ingredient amount
  const updateIngredientAmount = (id: string, newAmount: string) => {
    setIngredients(ingredients.map(ing => {
      if (ing.id === id) {
        let newDvPercent = "†";
        if (ing.dv) {
          const percent = Math.round((parseFloat(newAmount) / ing.dv) * 100);
          newDvPercent = percent.toString() + "%";
        }
        return { ...ing, amount: newAmount, dvPercent: newDvPercent };
      }
      return ing;
    }));
  };

  // Handle funny template change
  const handleFunnyTemplateChange = (templateId: string) => {
    setFunnyTemplate(templateId);
    const template = funnyTemplates.find(t => t.id === templateId);
    if (template && template.id !== "custom") {
      setFunnyIngredients(template.ingredients);
    } else {
      setFunnyIngredients([
        { name: "Awesomeness", amount: "100", unit: "%", dv: "∞" },
        { name: "Kindness", amount: "Maximum", unit: "", dv: "500" },
        { name: "Humor", amount: "Unlimited", unit: "", dv: "300" }
      ]);
    }
  };

  // Update funny ingredient
  const updateFunnyIngredient = (index: number, field: keyof FunnyIngredient, value: string) => {
    const updated = [...funnyIngredients];
    updated[index] = { ...updated[index], [field]: value };
    setFunnyIngredients(updated);
  };

  // Add funny ingredient
  const addFunnyIngredient = () => {
    setFunnyIngredients([...funnyIngredients, { name: "New Trait", amount: "100", unit: "%", dv: "∞" }]);
  };

  // Remove funny ingredient
  const removeFunnyIngredient = (index: number) => {
    setFunnyIngredients(funnyIngredients.filter((_, i) => i !== index));
  };

  // Get funny label title
  const getFunnyTitle = () => {
    if (funnyTemplate === "custom" && funnyPersonName) {
      return funnyPersonName;
    }
    const template = funnyTemplates.find(t => t.id === funnyTemplate);
    return template?.title || "Amazing Person";
  };

  // Download label as PNG
  const downloadLabel = async (ref: React.RefObject<HTMLDivElement | null>, filename: string, size: string) => {
    if (!ref.current) return;
    
    try {
      const html2canvas = (await import('html2canvas')).default;
      const selectedSize = labelSizeOptions.find(s => s.id === size) || labelSizeOptions[1];
      
      // Clone the element to avoid modifying the original
      const clone = ref.current.cloneNode(true) as HTMLElement;
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      clone.style.width = 'auto';
      clone.style.height = 'auto';
      document.body.appendChild(clone);
      
      const canvas = await html2canvas(clone, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        windowWidth: clone.scrollWidth,
        windowHeight: clone.scrollHeight
      });
      
      document.body.removeChild(clone);
      
      // Create output canvas with selected size
      const outputCanvas = document.createElement('canvas');
      outputCanvas.width = selectedSize.width;
      outputCanvas.height = selectedSize.height;
      const ctx = outputCanvas.getContext('2d');
      
      if (ctx) {
        // Fill white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, outputCanvas.width, outputCanvas.height);
        
        // Calculate scaling to fit while maintaining aspect ratio
        const padding = 40;
        const availableWidth = outputCanvas.width - padding * 2;
        const availableHeight = outputCanvas.height - padding * 2;
        
        const scale = Math.min(
          availableWidth / canvas.width,
          availableHeight / canvas.height
        );
        
        const scaledWidth = canvas.width * scale;
        const scaledHeight = canvas.height * scale;
        const x = (outputCanvas.width - scaledWidth) / 2;
        const y = (outputCanvas.height - scaledHeight) / 2;
        
        ctx.drawImage(canvas, x, y, scaledWidth, scaledHeight);
      }
      
      const link = document.createElement('a');
      link.download = `${filename}-${selectedSize.width}x${selectedSize.height}.png`;
      link.href = outputCanvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please try using browser screenshot instead.');
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Supplement Facts Label Generator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>💊</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Supplement Facts Label Generator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Create FDA-style Supplement Facts labels for dietary supplements, or make fun personalized nutrition labels for gifts and parties.
          </p>
        </div>

        {/* Quick Info Box */}
        <div style={{
          backgroundColor: "#DBEAFE",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #93C5FD"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>ℹ️</span>
            <div>
              <p style={{ fontWeight: "600", color: "#1E40AF", margin: "0 0 4px 0" }}>Supplement Facts vs Nutrition Facts</p>
              <p style={{ color: "#1E40AF", margin: 0, fontSize: "0.95rem" }}>
                <strong>Supplement Facts</strong> labels are used for dietary supplements (vitamins, minerals, herbs). 
                <strong> Nutrition Facts</strong> labels are used for conventional foods. This tool generates Supplement Facts format.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          {[
            { id: "generator", label: "Supplement Facts", icon: "💊" },
            { id: "funny", label: "Funny Label Maker", icon: "😄" },
            { id: "guide", label: "Label Types Guide", icon: "📚" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              style={{
                padding: "12px 20px",
                borderRadius: "8px",
                border: activeTab === tab.id ? "2px solid #2563EB" : "1px solid #E5E7EB",
                backgroundColor: activeTab === tab.id ? "#EFF6FF" : "white",
                color: activeTab === tab.id ? "#1D4ED8" : "#4B5563",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Supplement Facts Generator */}
        {activeTab === "generator" && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#2563EB", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>💊 Create Supplement Label</h2>
              </div>
              
              <div style={{ padding: "24px" }}>
                {/* Serving Info */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Serving Size
                    </label>
                    <select
                      value={servingSize}
                      onChange={(e) => setServingSize(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB",
                        fontSize: "0.95rem"
                      }}
                    >
                      {servingSizeOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Servings Per Container
                    </label>
                    <input
                      type="number"
                      value={servingsPerContainer}
                      onChange={(e) => setServingsPerContainer(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB",
                        fontSize: "0.95rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                </div>

                {/* Add Preset Ingredient */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                    Add Common Ingredient
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <select
                      value={selectedPreset}
                      onChange={(e) => setSelectedPreset(e.target.value)}
                      style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB",
                        fontSize: "0.9rem"
                      }}
                    >
                      <option value="">Select vitamin/mineral...</option>
                      {commonIngredients.map(ing => (
                        <option key={ing.name} value={ing.name}>{ing.name}</option>
                      ))}
                    </select>
                    <button
                      onClick={addPresetIngredient}
                      style={{
                        padding: "10px 16px",
                        borderRadius: "8px",
                        border: "none",
                        backgroundColor: "#2563EB",
                        color: "white",
                        fontWeight: "600",
                        cursor: "pointer"
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Add Custom Ingredient */}
                <div style={{ marginBottom: "20px", padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    Add Custom Ingredient
                  </label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <input
                      type="text"
                      placeholder="Name"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      style={{
                        flex: "2",
                        minWidth: "120px",
                        padding: "8px",
                        borderRadius: "6px",
                        border: "1px solid #E5E7EB",
                        fontSize: "0.9rem"
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Amount"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      style={{
                        flex: "1",
                        minWidth: "60px",
                        padding: "8px",
                        borderRadius: "6px",
                        border: "1px solid #E5E7EB",
                        fontSize: "0.9rem"
                      }}
                    />
                    <select
                      value={customUnit}
                      onChange={(e) => setCustomUnit(e.target.value)}
                      style={{
                        padding: "8px",
                        borderRadius: "6px",
                        border: "1px solid #E5E7EB",
                        fontSize: "0.9rem"
                      }}
                    >
                      <option value="mg">mg</option>
                      <option value="mcg">mcg</option>
                      <option value="g">g</option>
                      <option value="IU">IU</option>
                      <option value="ml">ml</option>
                    </select>
                    <button
                      onClick={addCustomIngredient}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: "none",
                        backgroundColor: "#059669",
                        color: "white",
                        fontWeight: "600",
                        cursor: "pointer"
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Ingredients List */}
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Added Ingredients ({ingredients.length})
                  </label>
                  {ingredients.length === 0 ? (
                    <p style={{ color: "#9CA3AF", fontSize: "0.9rem", margin: 0 }}>No ingredients added yet</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "200px", overflowY: "auto" }}>
                      {ingredients.map((ing) => (
                        <div
                          key={ing.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px 12px",
                            backgroundColor: "#F3F4F6",
                            borderRadius: "6px"
                          }}
                        >
                          <span style={{ flex: 1, fontSize: "0.9rem", fontWeight: "500" }}>{ing.name}</span>
                          <input
                            type="text"
                            value={ing.amount}
                            onChange={(e) => updateIngredientAmount(ing.id, e.target.value)}
                            style={{
                              width: "60px",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              border: "1px solid #D1D5DB",
                              fontSize: "0.85rem",
                              textAlign: "right"
                            }}
                          />
                          <span style={{ fontSize: "0.85rem", color: "#6B7280", width: "40px" }}>{ing.unit}</span>
                          <button
                            onClick={() => removeIngredient(ing.id)}
                            style={{
                              padding: "4px 8px",
                              borderRadius: "4px",
                              border: "none",
                              backgroundColor: "#EF4444",
                              color: "white",
                              cursor: "pointer",
                              fontSize: "0.75rem"
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Output Panel - Label Preview */}
            <div className="calc-results" style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📋 Label Preview</h2>
              </div>
              
              <div style={{ padding: "24px" }}>
                {/* FDA Style Label */}
                <div
                  ref={labelRef}
                  style={{
                  border: "2px solid #000",
                  padding: "8px",
                  fontFamily: "Arial, Helvetica, sans-serif",
                  backgroundColor: "white",
                  maxWidth: "300px",
                  margin: "0 auto"
                }}>
                  {/* Title */}
                  <div style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    borderBottom: "1px solid #000",
                    paddingBottom: "4px",
                    marginBottom: "4px"
                  }}>
                    Supplement Facts
                  </div>
                  
                  {/* Serving Info */}
                  <div style={{ fontSize: "0.85rem", marginBottom: "2px" }}>
                    <strong>Serving Size</strong> {servingSize}
                  </div>
                  <div style={{
                    fontSize: "0.85rem",
                    borderBottom: "8px solid #000",
                    paddingBottom: "4px",
                    marginBottom: "4px"
                  }}>
                    <strong>Servings Per Container</strong> {servingsPerContainer}
                  </div>
                  
                  {/* Column Headers */}
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.75rem",
                    borderBottom: "1px solid #000",
                    paddingBottom: "2px"
                  }}>
                    <span></span>
                    <span style={{ textAlign: "right" }}>
                      <strong>Amount Per Serving</strong> &nbsp; <strong>% Daily Value*</strong>
                    </span>
                  </div>
                  
                  {/* Ingredients */}
                  {ingredients.length === 0 ? (
                    <div style={{ padding: "20px", textAlign: "center", color: "#9CA3AF", fontSize: "0.85rem" }}>
                      Add ingredients to see them here
                    </div>
                  ) : (
                    ingredients.map((ing, idx) => (
                      <div
                        key={ing.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontSize: "0.8rem",
                          borderBottom: idx === ingredients.length - 1 ? "4px solid #000" : "1px solid #000",
                          padding: "3px 0"
                        }}
                      >
                        <span><strong>{ing.name}</strong></span>
                        <span style={{ textAlign: "right" }}>
                          {ing.amount} {ing.unit} &nbsp;&nbsp;&nbsp; {ing.dvPercent}
                        </span>
                      </div>
                    ))
                  )}
                  
                  {/* Footnote */}
                  <div style={{ fontSize: "0.7rem", marginTop: "4px" }}>
                    * Percent Daily Values are based on a 2,000 calorie diet.
                  </div>
                  {ingredients.some(i => i.dvPercent === "†") && (
                    <div style={{ fontSize: "0.7rem" }}>
                      † Daily Value not established.
                    </div>
                  )}
                </div>

                {/* Size Selection & Download */}
                <div style={{ marginTop: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Download Size (300 DPI for print)
                  </label>
                  <select
                    value={labelSize}
                    onChange={(e) => setLabelSize(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid #E5E7EB",
                      fontSize: "0.9rem",
                      marginBottom: "12px"
                    }}
                  >
                    {labelSizeOptions.map(size => (
                      <option key={size.id} value={size.id}>{size.name}</option>
                    ))}
                  </select>
                  
                  <button
                    onClick={() => downloadLabel(labelRef, 'supplement-facts-label', labelSize)}
                    disabled={ingredients.length === 0}
                    style={{
                      width: "100%",
                      padding: "14px",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: ingredients.length === 0 ? "#D1D5DB" : "#059669",
                      color: "white",
                      fontWeight: "600",
                      fontSize: "1rem",
                      cursor: ingredients.length === 0 ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    }}
                  >
                    📥 Download Label (PNG)
                  </button>
                  
                  {ingredients.length === 0 && (
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.8rem", color: "#9CA3AF", textAlign: "center" }}>
                      Add ingredients to enable download
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Funny Label Generator */}
        {activeTab === "funny" && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#F59E0B", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>😄 Funny Label Maker</h2>
              </div>
              
              <div style={{ padding: "24px" }}>
                {/* Template Selection */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    Choose Template
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {funnyTemplates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleFunnyTemplateChange(template.id)}
                        style={{
                          padding: "12px",
                          borderRadius: "8px",
                          border: funnyTemplate === template.id ? "2px solid #F59E0B" : "1px solid #E5E7EB",
                          backgroundColor: funnyTemplate === template.id ? "#FEF3C7" : "white",
                          cursor: "pointer",
                          textAlign: "center",
                          fontSize: "0.9rem",
                          color: funnyTemplate === template.id ? "#92400E" : "#374151"
                        }}
                      >
                        {template.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Name (for custom template) */}
                {funnyTemplate === "custom" && (
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Person&apos;s Name
                    </label>
                    <input
                      type="text"
                      value={funnyPersonName}
                      onChange={(e) => setFunnyPersonName(e.target.value)}
                      placeholder="Enter name..."
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB",
                        fontSize: "0.95rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                )}

                {/* Color Selection */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    Label Color
                  </label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {["#10B981", "#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B", "#EF4444"].map((color) => (
                      <button
                        key={color}
                        onClick={() => setFunnyColor(color)}
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          border: funnyColor === color ? "3px solid #000" : "2px solid #E5E7EB",
                          backgroundColor: color,
                          cursor: "pointer"
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Edit Ingredients */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <label style={{ fontSize: "0.9rem", color: "#374151", fontWeight: "600" }}>
                      Funny Ingredients
                    </label>
                    <button
                      onClick={addFunnyIngredient}
                      style={{
                        padding: "4px 12px",
                        borderRadius: "4px",
                        border: "none",
                        backgroundColor: "#10B981",
                        color: "white",
                        fontSize: "0.8rem",
                        cursor: "pointer"
                      }}
                    >
                      + Add
                    </button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "200px", overflowY: "auto" }}>
                    {funnyIngredients.map((ing, idx) => (
                      <div key={idx} style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                        <input
                          type="text"
                          value={ing.name}
                          onChange={(e) => updateFunnyIngredient(idx, "name", e.target.value)}
                          style={{
                            flex: "2",
                            padding: "6px",
                            borderRadius: "4px",
                            border: "1px solid #E5E7EB",
                            fontSize: "0.85rem"
                          }}
                        />
                        <input
                          type="text"
                          value={ing.amount}
                          onChange={(e) => updateFunnyIngredient(idx, "amount", e.target.value)}
                          style={{
                            width: "70px",
                            padding: "6px",
                            borderRadius: "4px",
                            border: "1px solid #E5E7EB",
                            fontSize: "0.85rem"
                          }}
                        />
                        <input
                          type="text"
                          value={ing.dv}
                          onChange={(e) => updateFunnyIngredient(idx, "dv", e.target.value)}
                          placeholder="%DV"
                          style={{
                            width: "50px",
                            padding: "6px",
                            borderRadius: "4px",
                            border: "1px solid #E5E7EB",
                            fontSize: "0.85rem"
                          }}
                        />
                        <button
                          onClick={() => removeFunnyIngredient(idx)}
                          style={{
                            padding: "4px 8px",
                            borderRadius: "4px",
                            border: "none",
                            backgroundColor: "#EF4444",
                            color: "white",
                            cursor: "pointer",
                            fontSize: "0.75rem"
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Output Panel - Funny Label Preview */}
            <div className="calc-results" style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#8B5CF6", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🎉 Your Funny Label</h2>
              </div>
              
              <div style={{ padding: "24px" }}>
                {/* Funny Style Label */}
                <div
                  ref={funnyLabelRef}
                  style={{
                  border: `4px solid ${funnyColor}`,
                  borderRadius: "12px",
                  padding: "16px",
                  fontFamily: "Arial, Helvetica, sans-serif",
                  backgroundColor: "white",
                  maxWidth: "320px",
                  margin: "0 auto"
                }}>
                  {/* Title */}
                  <div style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: funnyColor,
                    textAlign: "center",
                    borderBottom: `3px solid ${funnyColor}`,
                    paddingBottom: "8px",
                    marginBottom: "12px"
                  }}>
                    {getFunnyTitle()}
                  </div>
                  
                  <div style={{
                    textAlign: "center",
                    fontSize: "0.9rem",
                    color: "#6B7280",
                    marginBottom: "8px"
                  }}>
                    Nutrition Facts
                  </div>
                  
                  {/* Column Headers */}
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    borderBottom: `2px solid ${funnyColor}`,
                    paddingBottom: "4px",
                    marginBottom: "8px"
                  }}>
                    <span>Ingredient</span>
                    <span>Amount</span>
                    <span>% DV</span>
                  </div>
                  
                  {/* Ingredients */}
                  {funnyIngredients.map((ing, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "0.85rem",
                        borderBottom: "1px dashed #E5E7EB",
                        padding: "6px 0"
                      }}
                    >
                      <span style={{ fontWeight: "600", color: "#374151" }}>{ing.name}</span>
                      <span style={{ color: "#6B7280" }}>{ing.amount}{ing.unit}</span>
                      <span style={{ color: funnyColor, fontWeight: "bold" }}>{ing.dv}%</span>
                    </div>
                  ))}
                  
                  {/* Fun Footer */}
                  <div style={{
                    marginTop: "12px",
                    textAlign: "center",
                    fontSize: "0.75rem",
                    color: funnyColor
                  }}>
                    ✨ Made with 100% Love ✨
                  </div>
                </div>

                {/* Size Selection & Download */}
                <div style={{ marginTop: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Download Size (300 DPI for print)
                  </label>
                  <select
                    value={funnyLabelSize}
                    onChange={(e) => setFunnyLabelSize(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid #E5E7EB",
                      fontSize: "0.9rem",
                      marginBottom: "12px"
                    }}
                  >
                    {labelSizeOptions.map(size => (
                      <option key={size.id} value={size.id}>{size.name}</option>
                    ))}
                  </select>
                  
                  <button
                    onClick={() => downloadLabel(funnyLabelRef, `funny-label-${getFunnyTitle().toLowerCase().replace(/\s+/g, '-')}`, funnyLabelSize)}
                    style={{
                      width: "100%",
                      padding: "14px",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: funnyColor,
                      color: "white",
                      fontWeight: "600",
                      fontSize: "1rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    }}
                  >
                    📥 Download Label (PNG)
                  </button>
                </div>

                {/* Usage Ideas */}
                <div style={{ marginTop: "20px", padding: "12px", backgroundColor: "#F5F3FF", borderRadius: "8px" }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", fontWeight: "600", color: "#6D28D9" }}>
                    💡 Perfect for:
                  </p>
                  <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.85rem", color: "#4B5563" }}>
                    <li>Birthday cards & gifts</li>
                    <li>Mother&apos;s Day / Father&apos;s Day</li>
                    <li>Employee appreciation</li>
                    <li>Party decorations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Label Types Guide */}
        {activeTab === "guide" && (
          <div style={{ marginBottom: "40px" }}>
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#0891B2", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📚 Supplement Facts vs Nutrition Facts</h2>
              </div>
              
              <div style={{ padding: "24px" }}>
                {/* Comparison Cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginBottom: "24px" }}>
                  {labelTypesInfo.map((info) => (
                    <div
                      key={info.type}
                      style={{
                        padding: "20px",
                        backgroundColor: info.type === "Supplement Facts" ? "#EFF6FF" : "#ECFDF5",
                        borderRadius: "12px",
                        border: `2px solid ${info.type === "Supplement Facts" ? "#93C5FD" : "#6EE7B7"}`
                      }}
                    >
                      <h3 style={{
                        margin: "0 0 12px 0",
                        color: info.type === "Supplement Facts" ? "#1D4ED8" : "#047857",
                        fontSize: "1.25rem"
                      }}>
                        {info.type}
                      </h3>
                      <p style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>
                        <strong>Used For:</strong> {info.usedFor}
                      </p>
                      <p style={{ margin: "0 0 8px 0", color: "#374151", fontSize: "0.9rem", fontWeight: "600" }}>
                        Required Elements:
                      </p>
                      <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.85rem", color: "#4B5563" }}>
                        {info.required.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                      <p style={{ margin: "12px 0 0 0", color: "#6B7280", fontSize: "0.85rem" }}>
                        <strong>Examples:</strong> {info.example}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Key Differences */}
                <div style={{
                  padding: "24px",
                  backgroundColor: "#F9FAFB",
                  borderRadius: "12px",
                  marginBottom: "24px"
                }}>
                  <h3 style={{ margin: "0 0 16px 0", color: "#111827" }}>🔑 Key Differences</h3>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#E5E7EB" }}>
                          <th style={{ padding: "12px", border: "1px solid #D1D5DB", textAlign: "left" }}>Feature</th>
                          <th style={{ padding: "12px", border: "1px solid #D1D5DB", textAlign: "center" }}>Supplement Facts</th>
                          <th style={{ padding: "12px", border: "1px solid #D1D5DB", textAlign: "center" }}>Nutrition Facts</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { feature: "Product Type", supp: "Dietary supplements", nutr: "Foods & beverages" },
                          { feature: "Calories Required", supp: "Only if >5 cal", nutr: "Always required" },
                          { feature: "Proprietary Blends", supp: "Allowed", nutr: "Not allowed" },
                          { feature: "Plant Part Source", supp: "Required for botanicals", nutr: "Not applicable" },
                          { feature: "Zero Amounts", supp: "Cannot list", nutr: "Must list" },
                          { feature: "Non-DV Ingredients", supp: "Can list with †", nutr: "Cannot list" }
                        ].map((row, idx) => (
                          <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                            <td style={{ padding: "10px 12px", border: "1px solid #D1D5DB", fontWeight: "500" }}>{row.feature}</td>
                            <td style={{ padding: "10px 12px", border: "1px solid #D1D5DB", textAlign: "center" }}>{row.supp}</td>
                            <td style={{ padding: "10px 12px", border: "1px solid #D1D5DB", textAlign: "center" }}>{row.nutr}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Daily Values Reference */}
                <div style={{
                  padding: "24px",
                  backgroundColor: "#FEF3C7",
                  borderRadius: "12px",
                  border: "1px solid #FCD34D"
                }}>
                  <h3 style={{ margin: "0 0 16px 0", color: "#92400E" }}>📊 Common Daily Values (Adults)</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px" }}>
                    {commonIngredients.slice(0, 12).map((ing) => (
                      <div key={ing.name} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                        <span style={{ color: "#374151" }}>{ing.name}</span>
                        <span style={{ color: "#92400E", fontWeight: "600" }}>{ing.dv} {ing.unit}</span>
                      </div>
                    ))}
                  </div>
                  <p style={{ margin: "16px 0 0 0", fontSize: "0.8rem", color: "#92400E" }}>
                    * Based on FDA Daily Values for adults and children 4 years and older
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            {/* How to Use */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>📝 How to Create a Supplement Facts Label</h2>
              
              <div style={{ display: "grid", gap: "16px" }}>
                <div style={{ padding: "16px", backgroundColor: "#EFF6FF", borderRadius: "12px" }}>
                  <h4 style={{ color: "#1D4ED8", margin: "0 0 8px 0" }}>Step 1: Set Serving Information</h4>
                  <p style={{ color: "#374151", margin: 0, fontSize: "0.9rem" }}>
                    Choose your serving size (e.g., &quot;1 Capsule&quot; or &quot;2 Tablets&quot;) and enter the number of servings per container.
                  </p>
                </div>
                
                <div style={{ padding: "16px", backgroundColor: "#ECFDF5", borderRadius: "12px" }}>
                  <h4 style={{ color: "#047857", margin: "0 0 8px 0" }}>Step 2: Add Ingredients</h4>
                  <p style={{ color: "#374151", margin: 0, fontSize: "0.9rem" }}>
                    Select from common vitamins and minerals, or add custom ingredients. The % Daily Value will be calculated automatically for ingredients with established DVs.
                  </p>
                </div>
                
                <div style={{ padding: "16px", backgroundColor: "#FEF3C7", borderRadius: "12px" }}>
                  <h4 style={{ color: "#92400E", margin: "0 0 8px 0" }}>Step 3: Adjust Amounts</h4>
                  <p style={{ color: "#374151", margin: 0, fontSize: "0.9rem" }}>
                    Edit the amount for each ingredient directly in the list. The label preview will update in real-time.
                  </p>
                </div>
                
                <div style={{ padding: "16px", backgroundColor: "#F5F3FF", borderRadius: "12px" }}>
                  <h4 style={{ color: "#6D28D9", margin: "0 0 8px 0" }}>Step 4: Save Your Label</h4>
                  <p style={{ color: "#374151", margin: 0, fontSize: "0.9rem" }}>
                    Use your browser&apos;s screenshot tool or right-click the label to save it as an image for use in your designs.
                  </p>
                </div>
              </div>
            </div>

            {/* Products Requiring Labels */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>🏷️ Products That Need Supplement Facts Labels</h2>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
                {[
                  { icon: "💊", name: "Vitamins & Multivitamins" },
                  { icon: "🦴", name: "Mineral Supplements" },
                  { icon: "🌿", name: "Herbal Products" },
                  { icon: "🥛", name: "Protein Powders" },
                  { icon: "🐟", name: "Fish Oil / Omega-3" },
                  { icon: "🧬", name: "Amino Acids" },
                  { icon: "🍵", name: "Botanical Extracts" },
                  { icon: "⚡", name: "Energy Supplements" },
                  { icon: "💪", name: "Sports Nutrition" },
                  { icon: "🧘", name: "Wellness Supplements" },
                  { icon: "🌙", name: "Sleep Aids (natural)" },
                  { icon: "🦠", name: "Probiotics" }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "12px",
                      backgroundColor: "#F9FAFB",
                      borderRadius: "8px"
                    }}
                  >
                    <span style={{ fontSize: "1.25rem" }}>{item.icon}</span>
                    <span style={{ fontSize: "0.9rem", color: "#374151" }}>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* FDA Compliance Note */}
            <div style={{ backgroundColor: "#FEE2E2", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FECACA" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#991B1B", marginBottom: "12px" }}>⚠️ Important Notice</h3>
              <p style={{ fontSize: "0.875rem", color: "#991B1B", lineHeight: "1.6", margin: 0 }}>
                This tool is for educational and reference purposes. For commercial products, always verify compliance with current FDA regulations (21 CFR 101.36) and consult with a regulatory expert.
              </p>
            </div>

            {/* Quick Tips */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "24px", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>💡 Quick Tips</h3>
              <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.875rem", color: "#4B5563", lineHeight: "1.8" }}>
                <li>Use † for ingredients without established Daily Values</li>
                <li>List vitamins first, then minerals</li>
                <li>Include &quot;Other ingredients&quot; below the panel</li>
                <li>Use bold for nutrient names</li>
                <li>Keep font size readable (min 6pt)</li>
              </ul>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/supplement-facts-label-generator" currentCategory="Lifestyle" />
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
            💊 <strong>Disclaimer:</strong> This tool generates labels for educational and reference purposes only. 
            For commercial dietary supplement products, ensure your labels comply with FDA regulations (21 CFR 101.36), 
            verify nutrient amounts through laboratory testing, and consult with a regulatory professional.
          </p>
        </div>
      </div>
    </div>
  );
}
