"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Tree height categories
const heightCategories = [
  { id: "small", label: "Small", range: "Under 30 ft", min: 0, max: 30, baseMin: 150, baseMax: 450 },
  { id: "medium", label: "Medium", range: "30-60 ft", min: 30, max: 60, baseMin: 450, baseMax: 1200 },
  { id: "large", label: "Large", range: "60-80 ft", min: 60, max: 80, baseMin: 800, baseMax: 1800 },
  { id: "xlarge", label: "Extra Large", range: "Over 80 ft", min: 80, max: 150, baseMin: 1500, baseMax: 3000 }
];

// Tree types with cost multipliers
const treeTypes = [
  { id: "oak", label: "Oak", icon: "🌳", multiplier: 1.2, description: "Dense hardwood" },
  { id: "pine", label: "Pine", icon: "🌲", multiplier: 0.9, description: "Soft, easier to cut" },
  { id: "palm", label: "Palm", icon: "🌴", multiplier: 1.0, description: "Tall, narrow trunk" },
  { id: "maple", label: "Maple", icon: "🍁", multiplier: 1.1, description: "Medium hardwood" },
  { id: "willow", label: "Willow", icon: "🌿", multiplier: 0.85, description: "Soft, wide spread" },
  { id: "fruit", label: "Fruit Tree", icon: "🍎", multiplier: 0.8, description: "Usually smaller" },
  { id: "other", label: "Other", icon: "🌳", multiplier: 1.0, description: "Average pricing" }
];

// Accessibility options
const accessibilityOptions = [
  { id: "easy", label: "Easy Access", icon: "✅", multiplier: 1.0, description: "Open front yard" },
  { id: "limited", label: "Limited Access", icon: "🚧", multiplier: 1.25, description: "Backyard, gate" },
  { id: "powerlines", label: "Near Power Lines", icon: "⚡", multiplier: 1.5, description: "Utility coordination" },
  { id: "difficult", label: "Difficult Terrain", icon: "⛰️", multiplier: 1.4, description: "Slope, obstacles" }
];

// Tree condition options
const conditionOptions = [
  { id: "healthy", label: "Healthy", icon: "💚", multiplier: 1.0, description: "Standard removal" },
  { id: "diseased", label: "Diseased", icon: "🦠", multiplier: 1.15, description: "Extra precautions" },
  { id: "dead", label: "Dead", icon: "💀", multiplier: 1.25, description: "Unpredictable, brittle" },
  { id: "leaning", label: "Leaning", icon: "↗️", multiplier: 1.3, description: "Risk of falling" }
];

// Add-on services
const addOnServices = [
  { id: "stump", label: "Stump Grinding", icon: "🪵", minCost: 100, maxCost: 400, perInch: 5 },
  { id: "debris", label: "Debris Cleanup", icon: "🧹", minCost: 50, maxCost: 200, flat: true },
  { id: "emergency", label: "Emergency (Same Day)", icon: "🚨", percentAdd: 0.35, flat: false }
];

// Cost by tree type reference
const treeTypeCosts = [
  { type: "Oak", small: "$200-$500", medium: "$500-$1,400", large: "$1,000-$2,100" },
  { type: "Pine", small: "$150-$400", medium: "$400-$1,100", large: "$700-$1,600" },
  { type: "Palm", small: "$150-$500", medium: "$500-$1,200", large: "$900-$1,500" },
  { type: "Maple", small: "$200-$450", medium: "$450-$1,300", large: "$900-$1,900" }
];

// FAQ data
const faqs = [
  {
    question: "How do you estimate tree removal cost?",
    answer: "Tree removal cost is estimated based on several factors: tree height (the biggest factor), trunk diameter (DBH - measured at 4.5 feet from ground), tree species (hardwoods like oak cost more than softwoods like pine), accessibility (near power lines or structures costs more), and tree condition (dead or leaning trees are riskier). Most companies use a formula combining height × difficulty multiplier, with base rates ranging from $10-25 per foot of height."
  },
  {
    question: "What time of year is the cheapest for tree removal?",
    answer: "Winter (December through February) is typically the cheapest time for tree removal, with potential savings of 10-20%. Tree service companies are less busy during this season, and deciduous trees without leaves are easier and safer to remove. Late fall can also offer good rates. Avoid spring and summer when demand peaks, and never wait for emergency removal after storms—that's the most expensive option."
  },
  {
    question: "How much to charge for tree branch removal?",
    answer: "Tree branch removal (trimming/pruning) typically costs $75-$500 per tree, depending on the size and number of branches. Small branches accessible from the ground cost $75-$150. Large branches requiring climbing or a bucket truck cost $200-$500. If branches are near power lines, expect to pay $300-$1,000 due to specialized equipment and utility coordination required."
  },
  {
    question: "What is the most expensive tree to remove?",
    answer: "The most expensive trees to remove are typically: 1) Very tall trees over 80 feet (oak, redwood) - $2,000-$5,000+, 2) Trees near structures or power lines requiring crane work - $1,500-$3,000+, 3) Dense hardwoods like oak with large trunk diameters - 20% more than average, 4) Dead or storm-damaged trees with unpredictable stability - 25-30% premium. A 100-foot oak near a house could cost $3,000-$5,000."
  },
  {
    question: "Is it cheaper to remove a tree yourself?",
    answer: "While DIY removal might seem cheaper, it's only advisable for small trees under 20 feet in open areas. You'll need equipment ($200-$500 for chainsaw rental, safety gear) and disposal costs ($50-$150). For medium to large trees, professional removal is strongly recommended—the liability, injury risk, and property damage potential far outweigh savings. Many homeowners insurance policies don't cover DIY tree removal accidents."
  },
  {
    question: "Do I need a permit to remove a tree?",
    answer: "Permit requirements vary by location. Many cities require permits for trees over a certain size (often 6+ inch diameter) or protected species. Permit costs typically range from $40-$200. Some areas have heritage tree ordinances that prohibit removal entirely. Always check with your local city planning or forestry department before removal. Professional tree services usually handle permit applications for you."
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

// Tree item interface
interface TreeItem {
  id: number;
  height: string;
  heightCategory: string;
  diameter: string;
  treeType: string;
  accessibility: string;
  condition: string;
}

export default function TreeRemovalCostCalculator() {
  // Multi-tree state
  const [trees, setTrees] = useState<TreeItem[]>([
    { id: 1, height: "40", heightCategory: "medium", diameter: "12", treeType: "oak", accessibility: "easy", condition: "healthy" }
  ]);
  
  // Add-ons state
  const [addOns, setAddOns] = useState({
    stump: false,
    debris: false,
    emergency: false
  });

  // Add a new tree
  const addTree = () => {
    if (trees.length < 5) {
      setTrees([...trees, {
        id: Date.now(),
        height: "30",
        heightCategory: "medium",
        diameter: "10",
        treeType: "pine",
        accessibility: "easy",
        condition: "healthy"
      }]);
    }
  };

  // Remove a tree
  const removeTree = (id: number) => {
    if (trees.length > 1) {
      setTrees(trees.filter(t => t.id !== id));
    }
  };

  // Update tree property
  const updateTree = (id: number, field: keyof TreeItem, value: string) => {
    setTrees(trees.map(t => {
      if (t.id === id) {
        const updated = { ...t, [field]: value };
        // Auto-update height category when height changes
        if (field === "height") {
          const h = parseFloat(value) || 0;
          if (h < 30) updated.heightCategory = "small";
          else if (h < 60) updated.heightCategory = "medium";
          else if (h < 80) updated.heightCategory = "large";
          else updated.heightCategory = "xlarge";
        }
        return updated;
      }
      return t;
    }));
  };

  // Calculate cost for single tree
  const calculateTreeCost = (tree: TreeItem) => {
    const height = parseFloat(tree.height) || 0;
    const diameter = parseFloat(tree.diameter) || 12;
    
    // Get base cost from height category
    const category = heightCategories.find(c => c.id === tree.heightCategory) || heightCategories[1];
    const heightRatio = Math.min(1, Math.max(0, (height - category.min) / (category.max - category.min || 1)));
    const baseCostMin = category.baseMin + (category.baseMax - category.baseMin) * heightRatio * 0.5;
    const baseCostMax = category.baseMin + (category.baseMax - category.baseMin) * (0.5 + heightRatio * 0.5);
    
    // Apply multipliers
    const typeMultiplier = treeTypes.find(t => t.id === tree.treeType)?.multiplier || 1;
    const accessMultiplier = accessibilityOptions.find(a => a.id === tree.accessibility)?.multiplier || 1;
    const conditionMultiplier = conditionOptions.find(c => c.id === tree.condition)?.multiplier || 1;
    
    // Diameter adjustment (larger diameter = higher cost)
    const diameterMultiplier = 1 + (diameter - 12) * 0.015;
    
    const totalMultiplier = typeMultiplier * accessMultiplier * conditionMultiplier * diameterMultiplier;
    
    return {
      min: Math.round(baseCostMin * totalMultiplier),
      max: Math.round(baseCostMax * totalMultiplier),
      perFoot: Math.round((baseCostMin * totalMultiplier) / height) || 0
    };
  };

  // Calculate total costs
  const calculateTotalCosts = () => {
    let totalMin = 0;
    let totalMax = 0;
    const treeCosts: { id: number; min: number; max: number }[] = [];
    
    trees.forEach(tree => {
      const cost = calculateTreeCost(tree);
      treeCosts.push({ id: tree.id, min: cost.min, max: cost.max });
      totalMin += cost.min;
      totalMax += cost.max;
    });
    
    // Multi-tree discount
    const bundleDiscount = trees.length > 1 ? 0.1 : 0;
    const discountAmount = Math.round((totalMin + totalMax) / 2 * bundleDiscount);
    
    // Add-ons
    let addOnCostMin = 0;
    let addOnCostMax = 0;
    
    if (addOns.stump) {
      trees.forEach(tree => {
        const diameter = parseFloat(tree.diameter) || 12;
        addOnCostMin += Math.max(100, diameter * 4);
        addOnCostMax += Math.max(200, diameter * 8);
      });
    }
    
    if (addOns.debris) {
      addOnCostMin += 50 * trees.length;
      addOnCostMax += 150 * trees.length;
    }
    
    // Emergency multiplier
    if (addOns.emergency) {
      totalMin = Math.round(totalMin * 1.35);
      totalMax = Math.round(totalMax * 1.5);
    }
    
    return {
      treeCosts,
      subtotalMin: totalMin,
      subtotalMax: totalMax,
      bundleDiscount: discountAmount,
      addOnMin: addOnCostMin,
      addOnMax: addOnCostMax,
      finalMin: totalMin - discountAmount + addOnCostMin,
      finalMax: totalMax - discountAmount + addOnCostMax
    };
  };

  const costs = calculateTotalCosts();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Tree Removal Cost Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🌳</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Tree Removal Cost Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Estimate tree removal costs based on height, diameter, species, and location. 
            Calculate multiple trees with bundle discounts. Free instant estimates for 2025.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#ECFDF5",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #6EE7B7"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💵</span>
            <div>
              <p style={{ fontWeight: "600", color: "#065F46", margin: "0 0 4px 0" }}>Average Tree Removal Cost: $400 - $1,200</p>
              <p style={{ color: "#047857", margin: 0, fontSize: "0.95rem" }}>
                National average is <strong>$750</strong>. Small trees (&lt;30ft): $150-$450 | Medium (30-60ft): $450-$1,200 | Large (60-80ft): $800-$1,800 | Extra large (&gt;80ft): $1,500-$3,000+
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
            <div style={{ backgroundColor: "#059669", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🌳 Tree Details</h2>
              <button
                onClick={addTree}
                disabled={trees.length >= 5}
                style={{
                  backgroundColor: trees.length >= 5 ? "#9CA3AF" : "white",
                  color: trees.length >= 5 ? "#6B7280" : "#059669",
                  border: "none",
                  borderRadius: "6px",
                  padding: "8px 12px",
                  fontWeight: "600",
                  cursor: trees.length >= 5 ? "not-allowed" : "pointer",
                  fontSize: "0.85rem"
                }}
              >
                + Add Tree ({trees.length}/5)
              </button>
            </div>
            
            <div style={{ padding: "24px", maxHeight: "600px", overflowY: "auto" }}>
              {trees.map((tree, index) => (
                <div key={tree.id} style={{
                  marginBottom: index < trees.length - 1 ? "24px" : "0",
                  paddingBottom: index < trees.length - 1 ? "24px" : "0",
                  borderBottom: index < trees.length - 1 ? "2px dashed #E5E7EB" : "none"
                }}>
                  {/* Tree Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h3 style={{ margin: 0, fontSize: "1rem", color: "#374151", fontWeight: "600" }}>
                      Tree #{index + 1}
                    </h3>
                    {trees.length > 1 && (
                      <button
                        onClick={() => removeTree(tree.id)}
                        style={{
                          backgroundColor: "#FEE2E2",
                          color: "#DC2626",
                          border: "none",
                          borderRadius: "4px",
                          padding: "4px 8px",
                          fontSize: "0.75rem",
                          cursor: "pointer"
                        }}
                      >
                        ✕ Remove
                      </button>
                    )}
                  </div>

                  {/* Height Input */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Tree Height (ft)
                    </label>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "8px" }}>
                      {heightCategories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            updateTree(tree.id, "heightCategory", cat.id);
                            updateTree(tree.id, "height", String(Math.round((cat.min + cat.max) / 2)));
                          }}
                          style={{
                            padding: "6px 10px",
                            borderRadius: "6px",
                            border: tree.heightCategory === cat.id ? "2px solid #059669" : "1px solid #E5E7EB",
                            backgroundColor: tree.heightCategory === cat.id ? "#ECFDF5" : "white",
                            cursor: "pointer",
                            fontSize: "0.75rem"
                          }}
                        >
                          <span style={{ color: tree.heightCategory === cat.id ? "#059669" : "#374151", fontWeight: "500" }}>{cat.label}</span>
                          <span style={{ color: "#9CA3AF", fontSize: "0.65rem", display: "block" }}>{cat.range}</span>
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      value={tree.height}
                      onChange={(e) => updateTree(tree.id, "height", e.target.value)}
                      placeholder="Enter exact height"
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  {/* Diameter Input */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Trunk Diameter: {tree.diameter}" (DBH at 4.5ft)
                    </label>
                    <input
                      type="range"
                      min="4"
                      max="48"
                      value={tree.diameter}
                      onChange={(e) => updateTree(tree.id, "diameter", e.target.value)}
                      style={{ width: "100%" }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "#9CA3AF" }}>
                      <span>4"</span>
                      <span>48"</span>
                    </div>
                  </div>

                  {/* Tree Type */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Tree Type
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px" }}>
                      {treeTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => updateTree(tree.id, "treeType", type.id)}
                          style={{
                            padding: "8px 4px",
                            borderRadius: "6px",
                            border: tree.treeType === type.id ? "2px solid #059669" : "1px solid #E5E7EB",
                            backgroundColor: tree.treeType === type.id ? "#ECFDF5" : "white",
                            cursor: "pointer",
                            textAlign: "center"
                          }}
                        >
                          <span style={{ fontSize: "1.25rem" }}>{type.icon}</span>
                          <span style={{ display: "block", fontSize: "0.7rem", color: tree.treeType === type.id ? "#059669" : "#374151" }}>{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Accessibility */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Accessibility
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "6px" }}>
                      {accessibilityOptions.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => updateTree(tree.id, "accessibility", opt.id)}
                          style={{
                            padding: "8px",
                            borderRadius: "6px",
                            border: tree.accessibility === opt.id ? "2px solid #059669" : "1px solid #E5E7EB",
                            backgroundColor: tree.accessibility === opt.id ? "#ECFDF5" : "white",
                            cursor: "pointer",
                            textAlign: "left"
                          }}
                        >
                          <span style={{ fontSize: "1rem" }}>{opt.icon}</span>
                          <span style={{ fontSize: "0.75rem", color: tree.accessibility === opt.id ? "#059669" : "#374151", marginLeft: "6px" }}>{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Condition */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Tree Condition
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "6px" }}>
                      {conditionOptions.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => updateTree(tree.id, "condition", opt.id)}
                          style={{
                            padding: "8px",
                            borderRadius: "6px",
                            border: tree.condition === opt.id ? "2px solid #059669" : "1px solid #E5E7EB",
                            backgroundColor: tree.condition === opt.id ? "#ECFDF5" : "white",
                            cursor: "pointer",
                            textAlign: "left"
                          }}
                        >
                          <span style={{ fontSize: "1rem" }}>{opt.icon}</span>
                          <span style={{ fontSize: "0.75rem", color: tree.condition === opt.id ? "#059669" : "#374151", marginLeft: "6px" }}>{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* Add-on Services */}
              <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "2px solid #E5E7EB" }}>
                <h3 style={{ margin: "0 0 12px 0", fontSize: "0.9rem", color: "#374151", fontWeight: "600" }}>
                  🛠️ Additional Services
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {addOnServices.map((service) => (
                    <label
                      key={service.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px",
                        borderRadius: "8px",
                        backgroundColor: addOns[service.id as keyof typeof addOns] ? "#FEF3C7" : "#F9FAFB",
                        border: addOns[service.id as keyof typeof addOns] ? "1px solid #FCD34D" : "1px solid #E5E7EB",
                        cursor: "pointer"
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={addOns[service.id as keyof typeof addOns]}
                        onChange={(e) => setAddOns({ ...addOns, [service.id]: e.target.checked })}
                        style={{ width: "18px", height: "18px" }}
                      />
                      <span style={{ fontSize: "1.25rem" }}>{service.icon}</span>
                      <span style={{ fontSize: "0.9rem", color: "#374151" }}>{service.label}</span>
                    </label>
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
            border: "1px solid #E5E7EB",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#7C3AED", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>💰 Estimated Cost</h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {/* Total Estimate */}
              <div style={{
                backgroundColor: "#EDE9FE",
                borderRadius: "12px",
                padding: "20px",
                textAlign: "center",
                marginBottom: "20px"
              }}>
                <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#6D28D9" }}>Total Estimated Cost</p>
                <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#5B21B6" }}>
                  ${costs.finalMin.toLocaleString()} - ${costs.finalMax.toLocaleString()}
                </div>
                <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#7C3AED" }}>
                  Average: ${Math.round((costs.finalMin + costs.finalMax) / 2).toLocaleString()}
                </p>
              </div>

              {/* Cost Breakdown */}
              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ margin: "0 0 12px 0", fontSize: "0.9rem", color: "#374151", fontWeight: "600" }}>📋 Cost Breakdown</h3>
                
                {/* Per Tree Costs */}
                {trees.map((tree, index) => {
                  const treeCost = costs.treeCosts.find(c => c.id === tree.id);
                  const treeTypeInfo = treeTypes.find(t => t.id === tree.treeType);
                  return (
                    <div key={tree.id} style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px 12px",
                      backgroundColor: "#F9FAFB",
                      borderRadius: "6px",
                      marginBottom: "8px"
                    }}>
                      <span style={{ color: "#4B5563", fontSize: "0.9rem" }}>
                        {treeTypeInfo?.icon} Tree #{index + 1}: {tree.height}ft {treeTypeInfo?.label}
                      </span>
                      <span style={{ fontWeight: "600", color: "#059669" }}>
                        ${treeCost?.min.toLocaleString()} - ${treeCost?.max.toLocaleString()}
                      </span>
                    </div>
                  );
                })}

                {/* Bundle Discount */}
                {costs.bundleDiscount > 0 && (
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    backgroundColor: "#ECFDF5",
                    borderRadius: "6px",
                    marginBottom: "8px"
                  }}>
                    <span style={{ color: "#059669", fontSize: "0.9rem" }}>
                      🎉 Multi-Tree Discount (10%)
                    </span>
                    <span style={{ fontWeight: "600", color: "#059669" }}>
                      -${costs.bundleDiscount.toLocaleString()}
                    </span>
                  </div>
                )}

                {/* Add-ons */}
                {addOns.stump && (
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    backgroundColor: "#FEF3C7",
                    borderRadius: "6px",
                    marginBottom: "8px"
                  }}>
                    <span style={{ color: "#92400E", fontSize: "0.9rem" }}>🪵 Stump Grinding</span>
                    <span style={{ fontWeight: "600", color: "#92400E" }}>
                      +${costs.addOnMin > 0 ? `${Math.round(costs.addOnMin * 0.7)}-${Math.round(costs.addOnMax * 0.7)}` : "0"}
                    </span>
                  </div>
                )}

                {addOns.debris && (
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    backgroundColor: "#FEF3C7",
                    borderRadius: "6px",
                    marginBottom: "8px"
                  }}>
                    <span style={{ color: "#92400E", fontSize: "0.9rem" }}>🧹 Debris Cleanup</span>
                    <span style={{ fontWeight: "600", color: "#92400E" }}>
                      +${50 * trees.length}-${150 * trees.length}
                    </span>
                  </div>
                )}

                {addOns.emergency && (
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    backgroundColor: "#FEE2E2",
                    borderRadius: "6px",
                    marginBottom: "8px"
                  }}>
                    <span style={{ color: "#DC2626", fontSize: "0.9rem" }}>🚨 Emergency Service (+35-50%)</span>
                    <span style={{ fontWeight: "600", color: "#DC2626" }}>Applied</span>
                  </div>
                )}
              </div>

              {/* Per Foot Cost */}
              <div style={{
                backgroundColor: "#EFF6FF",
                borderRadius: "8px",
                padding: "12px 16px",
                marginBottom: "20px"
              }}>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#1D4ED8" }}>
                  <strong>Average Cost Per Foot:</strong> ${Math.round(costs.finalMin / trees.reduce((sum, t) => sum + (parseFloat(t.height) || 0), 0)) || 0} - ${Math.round(costs.finalMax / trees.reduce((sum, t) => sum + (parseFloat(t.height) || 0), 0)) || 0}/ft
                </p>
              </div>

              {/* CTA */}
              <div style={{
                backgroundColor: "#F3F4F6",
                borderRadius: "8px",
                padding: "16px",
                textAlign: "center"
              }}>
                <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", fontWeight: "600", color: "#374151" }}>
                  ⚠️ Get 3+ Local Quotes for Accurate Pricing
                </p>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#6B7280" }}>
                  This estimate is based on national averages. Actual costs vary by region, contractor, and specific site conditions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Money Saving Tips */}
        <div style={{
          backgroundColor: "#FFFBEB",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "40px",
          border: "1px solid #FCD34D"
        }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#92400E", marginBottom: "16px" }}>💡 Money-Saving Tips</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <span style={{ fontSize: "1.5rem" }}>❄️</span>
              <div>
                <p style={{ margin: 0, fontWeight: "600", color: "#92400E" }}>Schedule in Winter</p>
                <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#B45309" }}>Save 10-20% during Dec-Feb when demand is lowest</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <span style={{ fontSize: "1.5rem" }}>🌳</span>
              <div>
                <p style={{ margin: 0, fontWeight: "600", color: "#92400E" }}>Bundle Multiple Trees</p>
                <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#B45309" }}>Most companies offer 10-15% discount for multiple trees</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <span style={{ fontSize: "1.5rem" }}>🪵</span>
              <div>
                <p style={{ margin: 0, fontWeight: "600", color: "#92400E" }}>Keep the Wood</p>
                <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#B45309" }}>Ask for a discount if you keep the firewood</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <span style={{ fontSize: "1.5rem" }}>📋</span>
              <div>
                <p style={{ margin: 0, fontWeight: "600", color: "#92400E" }}>Get Multiple Quotes</p>
                <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#B45309" }}>Always compare 3+ estimates before deciding</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cost Reference Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Tree Removal Cost by Type & Size</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#ECFDF5" }}>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Tree Type</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Small (&lt;30ft)</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Medium (30-60ft)</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Large (60-80ft)</th>
                </tr>
              </thead>
              <tbody>
                {treeTypeCosts.map((row, idx) => (
                  <tr key={row.type} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", fontWeight: "600" }}>{row.type}</td>
                    <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.small}</td>
                    <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.medium}</td>
                    <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600", color: "#059669" }}>{row.large}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>🌳 Understanding Tree Removal Costs</h2>
              
              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  Tree removal costs vary significantly based on several factors. The national average cost is around 
                  <strong> $750</strong>, but prices can range from <strong>$150 for small trees</strong> to 
                  <strong> $3,000+ for large, complex removals</strong>. Understanding these factors helps you budget 
                  accurately and avoid surprise costs.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Key Factors Affecting Cost</h3>
                <ul style={{ paddingLeft: "20px" }}>
                  <li><strong>Tree Height:</strong> The primary cost driver. Taller trees require more equipment, safety measures, and time.</li>
                  <li><strong>Trunk Diameter:</strong> Measured at DBH (4.5ft from ground). Larger diameter means more wood to cut and haul.</li>
                  <li><strong>Tree Species:</strong> Hardwoods (oak, maple) cost 10-20% more than softwoods (pine, willow) due to denser wood.</li>
                  <li><strong>Location & Access:</strong> Trees near power lines or structures can cost 25-50% more.</li>
                  <li><strong>Tree Condition:</strong> Dead or diseased trees are unpredictable and require extra safety precautions.</li>
                </ul>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>What&apos;s Included in Tree Removal?</h3>
                <p>
                  Standard tree removal typically includes: cutting down the tree, sectioning it into manageable pieces, 
                  and removing all wood and debris from your property. However, <strong>stump removal is almost always 
                  an additional cost</strong> ($100-$400) and should be discussed separately. Some companies leave the 
                  wood for you to keep as firewood, while others haul everything away.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>When to Remove a Tree</h3>
                <p>
                  Consider tree removal when you notice: dead or dying branches, trunk decay or hollow areas, 
                  significant lean toward structures, root damage to foundations or sidewalks, or when the tree 
                  poses a safety hazard during storms. Getting a professional arborist&apos;s assessment can help 
                  determine if removal is necessary or if the tree can be saved through trimming or treatment.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Cost Reference */}
            <div style={{ backgroundColor: "#ECFDF5", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #6EE7B7" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "16px" }}>📏 Cost by Height</h3>
              <div style={{ fontSize: "0.875rem", color: "#047857", lineHeight: "2" }}>
                <p style={{ margin: 0 }}>Under 30ft: <strong>$150-$450</strong></p>
                <p style={{ margin: 0 }}>30-60ft: <strong>$450-$1,200</strong></p>
                <p style={{ margin: 0 }}>60-80ft: <strong>$800-$1,800</strong></p>
                <p style={{ margin: 0 }}>Over 80ft: <strong>$1,500-$3,000+</strong></p>
              </div>
            </div>

            {/* Best Time */}
            <div style={{ backgroundColor: "#EFF6FF", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #BFDBFE" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#1D4ED8", marginBottom: "16px" }}>🗓️ Best Time to Remove</h3>
              <div style={{ fontSize: "0.85rem", color: "#1E40AF", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}><strong>Cheapest:</strong> Winter (Dec-Feb)</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>Good:</strong> Late Fall (Nov)</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>Most Expensive:</strong> After storms</p>
                <p style={{ margin: 0 }}>💡 Book 2-3 weeks ahead for best rates</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/tree-removal-cost-calculator" currentCategory="Home" />
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
            🌳 <strong>Disclaimer:</strong> This calculator provides estimates based on national averages for informational purposes only. 
            Actual costs vary by location, contractor, tree condition, and site accessibility. Always obtain multiple quotes from licensed, 
            insured tree service professionals before making a decision.
          </p>
        </div>
      </div>
    </div>
  );
}