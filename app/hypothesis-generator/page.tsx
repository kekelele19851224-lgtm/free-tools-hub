"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// ============================================
// Types & Data
// ============================================

// Generation modes
const modes = [
  { id: 'simple', label: 'Simple Hypothesis', emoji: '📝', description: 'If-Then format' },
  { id: 'null-alt', label: 'Null & Alternative', emoji: '⚖️', description: 'H₀ and H₁ pair' },
  { id: 'question', label: 'From Question', emoji: '❓', description: 'Research question to hypothesis' },
  { id: 'complete', label: 'Complete Research', emoji: '📋', description: 'Full hypothesis with variables' },
];

// Research fields
const fields = [
  { id: 'psychology', label: 'Psychology', emoji: '🧠' },
  { id: 'education', label: 'Education', emoji: '📚' },
  { id: 'business', label: 'Business / Marketing', emoji: '💼' },
  { id: 'health', label: 'Health / Medical', emoji: '🏥' },
  { id: 'social', label: 'Social Science', emoji: '👥' },
  { id: 'science', label: 'Natural Science', emoji: '🔬' },
  { id: 'general', label: 'General', emoji: '📊' },
];

// Direction options
const directions = [
  { id: 'positive', label: 'Positive Effect', description: 'Variable increases/improves outcome' },
  { id: 'negative', label: 'Negative Effect', description: 'Variable decreases/worsens outcome' },
  { id: 'nondirectional', label: 'Non-directional', description: 'Just predicts a difference exists' },
];

// Example variables by field
const exampleVariables: Record<string, { independent: string[]; dependent: string[]; population: string[] }> = {
  psychology: {
    independent: ['meditation practice', 'sleep duration', 'social media usage', 'cognitive behavioral therapy', 'mindfulness training', 'screen time', 'exercise frequency'],
    dependent: ['anxiety levels', 'depression symptoms', 'self-esteem', 'cognitive performance', 'stress levels', 'emotional regulation', 'life satisfaction'],
    population: ['college students', 'adolescents', 'adults with anxiety disorders', 'working professionals', 'elderly adults', 'children aged 8-12', 'individuals with PTSD'],
  },
  education: {
    independent: ['class size', 'homework amount', 'teacher feedback frequency', 'online learning tools', 'peer tutoring', 'parental involvement', 'study group participation'],
    dependent: ['academic performance', 'student engagement', 'test scores', 'graduation rates', 'learning retention', 'critical thinking skills', 'student motivation'],
    population: ['elementary school students', 'high school students', 'university students', 'first-generation college students', 'students with learning disabilities', 'ESL learners', 'graduate students'],
  },
  business: {
    independent: ['advertising spend', 'employee training programs', 'remote work policies', 'customer service response time', 'product pricing', 'social media marketing', 'brand partnerships'],
    dependent: ['sales revenue', 'employee productivity', 'customer satisfaction', 'brand awareness', 'customer retention rate', 'conversion rate', 'employee turnover'],
    population: ['small business owners', 'e-commerce customers', 'B2B clients', 'retail employees', 'startup founders', 'marketing professionals', 'online shoppers'],
  },
  health: {
    independent: ['daily water intake', 'exercise duration', 'vegetable consumption', 'smoking cessation programs', 'vaccination rates', 'medication adherence', 'telemedicine usage'],
    dependent: ['blood pressure', 'BMI', 'cholesterol levels', 'disease recovery time', 'patient outcomes', 'hospital readmission rates', 'quality of life scores'],
    population: ['diabetic patients', 'elderly adults over 65', 'pregnant women', 'cancer survivors', 'patients with hypertension', 'healthcare workers', 'obese individuals'],
  },
  social: {
    independent: ['income level', 'education attainment', 'community involvement', 'access to public transportation', 'neighborhood safety', 'social network size', 'cultural background'],
    dependent: ['civic participation', 'crime rates', 'social mobility', 'community cohesion', 'political engagement', 'quality of life', 'trust in institutions'],
    population: ['urban residents', 'rural communities', 'immigrants', 'low-income families', 'millennials', 'single-parent households', 'minority groups'],
  },
  science: {
    independent: ['temperature', 'pH level', 'light exposure', 'fertilizer concentration', 'pressure', 'catalyst presence', 'radiation intensity'],
    dependent: ['growth rate', 'reaction speed', 'yield amount', 'cell division rate', 'enzyme activity', 'compound stability', 'energy output'],
    population: ['plant seedlings', 'bacterial cultures', 'chemical compounds', 'laboratory mice', 'soil samples', 'water specimens', 'cell cultures'],
  },
  general: {
    independent: ['time spent on activity', 'frequency of practice', 'resource availability', 'environmental conditions', 'method of intervention', 'duration of exposure', 'intensity level'],
    dependent: ['performance outcome', 'success rate', 'efficiency', 'quality measure', 'satisfaction level', 'behavioral change', 'measurable improvement'],
    population: ['study participants', 'survey respondents', 'experimental subjects', 'target population', 'sample group', 'test subjects', 'research participants'],
  },
};

// Relationship words
const relationshipWords = {
  positive: ['improve', 'increase', 'enhance', 'strengthen', 'boost', 'elevate', 'raise'],
  negative: ['decrease', 'reduce', 'lower', 'diminish', 'weaken', 'decline', 'worsen'],
  nondirectional: ['affect', 'influence', 'impact', 'relate to', 'be associated with', 'correlate with', 'have an effect on'],
};

// FAQ data
const faqs = [
  {
    question: "What is a research hypothesis?",
    answer: "A research hypothesis is a tentative statement that proposes a relationship between two or more variables. It's an educated prediction that can be tested through research and data collection. A good hypothesis is specific, testable, and based on existing knowledge or observations."
  },
  {
    question: "What is the difference between null and alternative hypotheses?",
    answer: "The null hypothesis (H₀) states that there is no significant relationship or effect between variables—it's the default assumption. The alternative hypothesis (H₁ or Ha) states that there IS a significant relationship or effect. In statistical testing, you either reject or fail to reject the null hypothesis based on your data."
  },
  {
    question: "What makes a good hypothesis?",
    answer: "A good hypothesis should be: (1) Testable - you can collect data to support or refute it, (2) Specific - clearly defines variables and expected relationships, (3) Falsifiable - it's possible to prove it wrong, (4) Based on existing knowledge - grounded in prior research or observations, and (5) Simple - focuses on one relationship at a time."
  },
  {
    question: "What is the difference between independent and dependent variables?",
    answer: "The independent variable (IV) is what you manipulate or change in your study—it's the presumed cause. The dependent variable (DV) is what you measure—it's the presumed effect that changes in response to the independent variable. For example, if studying how sleep affects test scores, sleep duration is the IV and test scores are the DV."
  },
  {
    question: "When should I use a directional vs. non-directional hypothesis?",
    answer: "Use a directional hypothesis when prior research or theory suggests a specific direction of effect (e.g., 'will increase' or 'will decrease'). Use a non-directional hypothesis when you expect a relationship but aren't sure of the direction, or when exploring a new area with limited prior research (e.g., 'will affect' or 'will differ')."
  },
  {
    question: "Can I use this hypothesis generator for my thesis or dissertation?",
    answer: "Yes! This tool helps you structure and format your hypotheses correctly. However, the content should be based on your own research question, literature review, and theoretical framework. Use the generated hypotheses as a starting point, then refine them to fit your specific study context and methodology."
  }
];

// FAQ component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #0891B2" }}>
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

// Helper functions
function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

interface HypothesisResult {
  type: string;
  simple?: string;
  null?: string;
  alternative?: string;
  researchQuestion?: string;
  variables?: {
    independent: string;
    dependent: string;
    population: string;
    direction: string;
  };
}

export default function HypothesisGenerator() {
  const [mode, setMode] = useState('simple');
  const [field, setField] = useState('general');
  const [direction, setDirection] = useState('positive');
  const [independentVar, setIndependentVar] = useState('');
  const [dependentVar, setDependentVar] = useState('');
  const [population, setPopulation] = useState('');
  const [researchQuestion, setResearchQuestion] = useState('');
  const [results, setResults] = useState<HypothesisResult[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  // Auto-fill with examples
  const fillExamples = () => {
    const examples = exampleVariables[field] || exampleVariables.general;
    setIndependentVar(getRandomItem(examples.independent));
    setDependentVar(getRandomItem(examples.dependent));
    setPopulation(getRandomItem(examples.population));
  };

  // Generate hypothesis
  const generate = () => {
    const iv = independentVar.trim() || getRandomItem(exampleVariables[field]?.independent || exampleVariables.general.independent);
    const dv = dependentVar.trim() || getRandomItem(exampleVariables[field]?.dependent || exampleVariables.general.dependent);
    const pop = population.trim() || getRandomItem(exampleVariables[field]?.population || exampleVariables.general.population);
    
    const relationWord = getRandomItem(relationshipWords[direction as keyof typeof relationshipWords]);
    const newResults: HypothesisResult[] = [];

    if (mode === 'simple') {
      // Generate simple If-Then hypotheses
      for (let i = 0; i < 3; i++) {
        const rw = getRandomItem(relationshipWords[direction as keyof typeof relationshipWords]);
        let hypothesis = '';
        
        if (direction === 'positive') {
          hypothesis = `If ${pop} experience increased ${iv}, then their ${dv} will ${rw}.`;
        } else if (direction === 'negative') {
          hypothesis = `If ${pop} experience increased ${iv}, then their ${dv} will ${rw}.`;
        } else {
          hypothesis = `If ${iv} changes among ${pop}, then their ${dv} will be affected.`;
        }
        
        newResults.push({
          type: 'simple',
          simple: hypothesis,
        });
      }
    } else if (mode === 'null-alt') {
      // Generate Null and Alternative hypotheses
      for (let i = 0; i < 2; i++) {
        let nullH = '';
        let altH = '';
        
        if (direction === 'nondirectional') {
          nullH = `There is no significant relationship between ${iv} and ${dv} among ${pop}.`;
          altH = `There is a significant relationship between ${iv} and ${dv} among ${pop}.`;
        } else {
          nullH = `There is no significant ${direction === 'positive' ? 'positive' : 'negative'} relationship between ${iv} and ${dv} among ${pop}.`;
          altH = `There is a significant ${direction === 'positive' ? 'positive' : 'negative'} relationship between ${iv} and ${dv} among ${pop}.`;
        }
        
        newResults.push({
          type: 'null-alt',
          null: nullH,
          alternative: altH,
        });
      }
    } else if (mode === 'question') {
      // Generate from research question format
      const rq = researchQuestion.trim() || `Does ${iv} affect ${dv} among ${pop}?`;
      
      for (let i = 0; i < 2; i++) {
        const rw = getRandomItem(relationshipWords[direction as keyof typeof relationshipWords]);
        let hypothesis = '';
        
        if (direction === 'nondirectional') {
          hypothesis = `${capitalizeFirst(iv)} has a significant effect on ${dv} among ${pop}.`;
        } else {
          hypothesis = `Increased ${iv} will ${rw} ${dv} among ${pop}.`;
        }
        
        newResults.push({
          type: 'question',
          researchQuestion: rq,
          simple: hypothesis,
          null: `${capitalizeFirst(iv)} has no significant effect on ${dv} among ${pop}.`,
          alternative: hypothesis,
        });
      }
    } else if (mode === 'complete') {
      // Generate complete research hypothesis
      for (let i = 0; i < 2; i++) {
        const rw = getRandomItem(relationshipWords[direction as keyof typeof relationshipWords]);
        
        let hypothesis = '';
        if (direction === 'positive') {
          hypothesis = `${capitalizeFirst(pop)} who experience higher levels of ${iv} will demonstrate significantly improved ${dv} compared to those with lower levels of ${iv}.`;
        } else if (direction === 'negative') {
          hypothesis = `${capitalizeFirst(pop)} who experience higher levels of ${iv} will demonstrate significantly reduced ${dv} compared to those with lower levels of ${iv}.`;
        } else {
          hypothesis = `There will be a significant difference in ${dv} between ${pop} with varying levels of ${iv}.`;
        }
        
        newResults.push({
          type: 'complete',
          researchQuestion: `What is the relationship between ${iv} and ${dv} among ${pop}?`,
          simple: hypothesis,
          null: `There is no significant relationship between ${iv} and ${dv} among ${pop}.`,
          alternative: `There is a significant ${direction === 'nondirectional' ? '' : direction + ' '}relationship between ${iv} and ${dv} among ${pop}.`,
          variables: {
            independent: iv,
            dependent: dv,
            population: pop,
            direction: direction === 'positive' ? 'Positive correlation expected' : direction === 'negative' ? 'Negative correlation expected' : 'Direction not specified',
          },
        });
      }
    }

    setResults(newResults);
  };

  // Copy to clipboard
  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ECFEFF" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #A5F3FC" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Hypothesis Generator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "2.5rem" }}>🔬</span>
            <h1 style={{ fontSize: "clamp(1.75rem, 5vw, 2.25rem)", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Hypothesis Generator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Generate well-structured research hypotheses for your papers, thesis, or experiments. 
            Create null and alternative hypotheses, simple if-then statements, and complete research hypotheses.
          </p>
        </div>

        {/* Tip Box */}
        <div style={{
          backgroundColor: "#0891B2",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "white", margin: "0 0 4px 0" }}>
                <strong>Pro Tip</strong>
              </p>
              <p style={{ color: "#CFFAFE", margin: 0, fontSize: "0.95rem" }}>
                Click &quot;Fill Examples&quot; to see sample variables for your research field, 
                or enter your own specific variables for a customized hypothesis.
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
            border: "1px solid #A5F3FC",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#0891B2", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                ⚙️ Configure Your Hypothesis
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              {/* Generation Mode */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                  📝 Hypothesis Type
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                  {modes.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMode(m.id)}
                      style={{
                        padding: "12px 10px",
                        borderRadius: "8px",
                        border: mode === m.id ? "2px solid #0891B2" : "1px solid #E5E7EB",
                        backgroundColor: mode === m.id ? "#ECFEFF" : "white",
                        cursor: "pointer",
                        textAlign: "left"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span>{m.emoji}</span>
                        <span style={{ 
                          fontWeight: mode === m.id ? "600" : "500",
                          color: mode === m.id ? "#0891B2" : "#374151",
                          fontSize: "0.85rem"
                        }}>
                          {m.label}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "#6B7280", marginTop: "2px", marginLeft: "22px" }}>
                        {m.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Research Field */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                  📚 Research Field
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {fields.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setField(f.id)}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: field === f.id ? "2px solid #0891B2" : "1px solid #E5E7EB",
                        backgroundColor: field === f.id ? "#ECFEFF" : "white",
                        cursor: "pointer",
                        fontWeight: field === f.id ? "600" : "400",
                        color: field === f.id ? "#0891B2" : "#4B5563",
                        fontSize: "0.8rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      <span>{f.emoji}</span> {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Direction */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                  🎯 Expected Direction
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                  {directions.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setDirection(d.id)}
                      style={{
                        padding: "10px 8px",
                        borderRadius: "8px",
                        border: direction === d.id ? "2px solid #0891B2" : "1px solid #E5E7EB",
                        backgroundColor: direction === d.id ? "#ECFEFF" : "white",
                        cursor: "pointer",
                        textAlign: "center"
                      }}
                    >
                      <div style={{ 
                        fontWeight: direction === d.id ? "600" : "500",
                        color: direction === d.id ? "#0891B2" : "#374151",
                        fontSize: "0.8rem"
                      }}>
                        {d.label}
                      </div>
                      <div style={{ fontSize: "0.65rem", color: "#6B7280", marginTop: "2px" }}>
                        {d.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Variables Input */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <label style={{ fontSize: "0.9rem", color: "#374151", fontWeight: "600" }}>
                    🔬 Variables
                  </label>
                  <button
                    onClick={fillExamples}
                    style={{
                      padding: "4px 10px",
                      backgroundColor: "#E0F2FE",
                      color: "#0369A1",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "0.75rem",
                      cursor: "pointer"
                    }}
                  >
                    ✨ Fill Examples
                  </button>
                </div>
                
                <div style={{ display: "grid", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>
                      Independent Variable (IV) — what you change/manipulate
                    </label>
                    <input
                      type="text"
                      value={independentVar}
                      onChange={(e) => setIndependentVar(e.target.value)}
                      placeholder="e.g., sleep duration, study time, exercise frequency"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1px solid #D1D5DB",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>
                      Dependent Variable (DV) — what you measure
                    </label>
                    <input
                      type="text"
                      value={dependentVar}
                      onChange={(e) => setDependentVar(e.target.value)}
                      placeholder="e.g., test scores, stress levels, productivity"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1px solid #D1D5DB",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>
                      Population/Subjects — who you study
                    </label>
                    <input
                      type="text"
                      value={population}
                      onChange={(e) => setPopulation(e.target.value)}
                      placeholder="e.g., college students, patients, employees"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1px solid #D1D5DB",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  {mode === 'question' && (
                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>
                        Research Question (optional)
                      </label>
                      <input
                        type="text"
                        value={researchQuestion}
                        onChange={(e) => setResearchQuestion(e.target.value)}
                        placeholder="e.g., Does social media usage affect teen mental health?"
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          border: "1px solid #D1D5DB",
                          borderRadius: "8px",
                          fontSize: "0.9rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generate}
                style={{
                  width: "100%",
                  padding: "16px",
                  backgroundColor: "#0891B2",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                🔬 Generate Hypothesis
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="calc-results" style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #A5F3FC",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#0E7490", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                📋 Generated Hypotheses
              </h2>
              {results.length > 0 && (
                <button
                  onClick={generate}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "rgba(255,255,255,0.2)",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "0.8rem",
                    cursor: "pointer"
                  }}
                >
                  🔄 Regenerate
                </button>
              )}
            </div>

            <div style={{ padding: "16px", maxHeight: "600px", overflowY: "auto" }}>
              {results.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#9CA3AF" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "16px" }}>📝</div>
                  <p style={{ margin: 0 }}>Enter your variables and generate your hypothesis!</p>
                </div>
              ) : (
                <div style={{ display: "grid", gap: "16px" }}>
                  {results.map((result, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "20px",
                        backgroundColor: "#ECFEFF",
                        borderRadius: "12px",
                        border: "1px solid #A5F3FC"
                      }}
                    >
                      {result.researchQuestion && (
                        <div style={{ marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid #A5F3FC" }}>
                          <p style={{ margin: 0, color: "#0E7490", fontWeight: "600", fontSize: "0.85rem" }}>
                            📋 Research Question:
                          </p>
                          <p style={{ margin: "4px 0 0 0", color: "#1F2937", fontStyle: "italic" }}>
                            {result.researchQuestion}
                          </p>
                        </div>
                      )}

                      {result.simple && result.type === 'simple' && (
                        <div style={{ marginBottom: "12px" }}>
                          <p style={{ margin: 0, color: "#1F2937", lineHeight: "1.6", fontSize: "1.05rem" }}>
                            {result.simple}
                          </p>
                          <button
                            onClick={() => copyText(result.simple!, `simple-${idx}`)}
                            style={{
                              marginTop: "8px",
                              padding: "6px 12px",
                              backgroundColor: copiedIndex === `simple-${idx}` ? "#059669" : "#0891B2",
                              color: "white",
                              border: "none",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "0.8rem"
                            }}
                          >
                            {copiedIndex === `simple-${idx}` ? "✓ Copied!" : "📋 Copy"}
                          </button>
                        </div>
                      )}

                      {result.null && (
                        <div style={{ marginBottom: "12px" }}>
                          <p style={{ margin: "0 0 4px 0", color: "#DC2626", fontWeight: "600", fontSize: "0.9rem" }}>
                            H₀ (Null Hypothesis):
                          </p>
                          <p style={{ margin: "0 0 8px 0", color: "#1F2937", lineHeight: "1.6", paddingLeft: "12px", borderLeft: "3px solid #DC2626" }}>
                            {result.null}
                          </p>
                          <button
                            onClick={() => copyText(`H₀: ${result.null}`, `null-${idx}`)}
                            style={{
                              padding: "4px 10px",
                              backgroundColor: copiedIndex === `null-${idx}` ? "#059669" : "#E5E7EB",
                              color: copiedIndex === `null-${idx}` ? "white" : "#374151",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "0.75rem"
                            }}
                          >
                            {copiedIndex === `null-${idx}` ? "✓" : "Copy H₀"}
                          </button>
                        </div>
                      )}

                      {result.alternative && (
                        <div style={{ marginBottom: "12px" }}>
                          <p style={{ margin: "0 0 4px 0", color: "#059669", fontWeight: "600", fontSize: "0.9rem" }}>
                            H₁ (Alternative Hypothesis):
                          </p>
                          <p style={{ margin: "0 0 8px 0", color: "#1F2937", lineHeight: "1.6", paddingLeft: "12px", borderLeft: "3px solid #059669" }}>
                            {result.alternative}
                          </p>
                          <button
                            onClick={() => copyText(`H₁: ${result.alternative}`, `alt-${idx}`)}
                            style={{
                              padding: "4px 10px",
                              backgroundColor: copiedIndex === `alt-${idx}` ? "#059669" : "#E5E7EB",
                              color: copiedIndex === `alt-${idx}` ? "white" : "#374151",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "0.75rem"
                            }}
                          >
                            {copiedIndex === `alt-${idx}` ? "✓" : "Copy H₁"}
                          </button>
                        </div>
                      )}

                      {result.variables && (
                        <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "white", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
                          <p style={{ margin: "0 0 8px 0", color: "#0E7490", fontWeight: "600", fontSize: "0.85rem" }}>
                            📊 Variable Summary:
                          </p>
                          <div style={{ display: "grid", gap: "4px", fontSize: "0.85rem", color: "#4B5563" }}>
                            <p style={{ margin: 0 }}><strong>IV:</strong> {result.variables.independent}</p>
                            <p style={{ margin: 0 }}><strong>DV:</strong> {result.variables.dependent}</p>
                            <p style={{ margin: 0 }}><strong>Population:</strong> {result.variables.population}</p>
                            <p style={{ margin: 0 }}><strong>Direction:</strong> {result.variables.direction}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Reference */}
        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "16px", 
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)", 
          border: "1px solid #A5F3FC", 
          padding: "32px",
          marginBottom: "32px"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
            📖 Hypothesis Types Quick Reference
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
            {[
              { emoji: '📝', name: 'Simple Hypothesis', desc: 'Predicts relationship between two variables', example: 'If X increases, then Y will increase.' },
              { emoji: '⚖️', name: 'Null Hypothesis (H₀)', desc: 'States no significant relationship exists', example: 'There is no effect of X on Y.' },
              { emoji: '✅', name: 'Alternative Hypothesis (H₁)', desc: 'States a significant relationship exists', example: 'There is a significant effect of X on Y.' },
              { emoji: '➡️', name: 'Directional', desc: 'Predicts specific direction of effect', example: 'X will increase Y.' },
              { emoji: '↔️', name: 'Non-directional', desc: 'Predicts effect without direction', example: 'X will affect Y.' },
              { emoji: '🔗', name: 'Correlational', desc: 'Predicts relationship without causation', example: 'X is associated with Y.' },
            ].map((item, idx) => (
              <div 
                key={idx}
                style={{
                  padding: "16px",
                  backgroundColor: "#ECFEFF",
                  borderRadius: "8px",
                  border: "1px solid #A5F3FC"
                }}
              >
                <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>{item.emoji}</div>
                <h3 style={{ margin: "0 0 4px 0", color: "#0E7490", fontSize: "1rem" }}>{item.name}</h3>
                <p style={{ margin: "0 0 8px 0", color: "#6B7280", fontSize: "0.85rem" }}>{item.desc}</p>
                <p style={{ margin: 0, color: "#374151", fontSize: "0.8rem", fontStyle: "italic" }}>&quot;{item.example}&quot;</p>
              </div>
            ))}
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #A5F3FC", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
                ✍️ How to Write a Strong Research Hypothesis
              </h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  A well-crafted hypothesis is the foundation of any successful research study. It guides your 
                  methodology, data collection, and analysis. Here&apos;s how to create hypotheses that work.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Key Characteristics</h3>
                <div style={{
                  backgroundColor: "#ECFEFF",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #A5F3FC"
                }}>
                  <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "2" }}>
                    <li><strong>Testable:</strong> Can be supported or refuted with data</li>
                    <li><strong>Specific:</strong> Clearly defines variables and relationships</li>
                    <li><strong>Falsifiable:</strong> Possible to prove wrong</li>
                    <li><strong>Based on research:</strong> Grounded in existing literature</li>
                    <li><strong>Simple:</strong> Focuses on one relationship</li>
                  </ul>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Common Mistakes to Avoid</h3>
                <div style={{
                  backgroundColor: "#FEF2F2",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #FECACA"
                }}>
                  <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "2", color: "#991B1B" }}>
                    <li>Making it too vague or broad</li>
                    <li>Including value judgments or opinions</li>
                    <li>Using untestable claims</li>
                    <li>Confusing hypothesis with research question</li>
                    <li>Including too many variables</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Formulas */}
            <div style={{ backgroundColor: "#0891B2", borderRadius: "16px", padding: "24px", marginBottom: "24px", color: "white" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "16px" }}>📝 Hypothesis Formulas</h3>
              <div style={{ fontSize: "0.85rem", lineHeight: "2" }}>
                <p style={{ margin: "0 0 8px 0" }}><strong>If-Then:</strong></p>
                <p style={{ margin: "0 0 12px 0", fontStyle: "italic", opacity: 0.9 }}>&quot;If [IV], then [DV]&quot;</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>Correlational:</strong></p>
                <p style={{ margin: "0 0 12px 0", fontStyle: "italic", opacity: 0.9 }}>&quot;[IV] is related to [DV]&quot;</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>Comparative:</strong></p>
                <p style={{ margin: 0, fontStyle: "italic", opacity: 0.9 }}>&quot;[Group A] will differ from [Group B] in [DV]&quot;</p>
              </div>
            </div>

            {/* Variable Tips */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "16px" }}>💡 Variable Tips</h3>
              <p style={{ fontSize: "0.85rem", color: "#B45309", lineHeight: "1.7", margin: 0 }}>
                <strong>Remember:</strong> The independent variable (IV) is what you manipulate. 
                The dependent variable (DV) is what you measure. A clear understanding of your 
                variables leads to a stronger hypothesis!
              </p>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/hypothesis-generator" currentCategory="Research" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #A5F3FC", padding: "32px", marginBottom: "24px" }}>
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
        <div style={{ padding: "16px", backgroundColor: "#ECFEFF", borderRadius: "8px", border: "1px solid #A5F3FC" }}>
          <p style={{ fontSize: "0.75rem", color: "#0891B2", textAlign: "center", margin: 0 }}>
            🔬 <strong>Disclaimer:</strong> This tool provides hypothesis templates for educational purposes. 
            Always refine generated hypotheses based on your specific research context, literature review, and methodology.
          </p>
        </div>
      </div>
    </div>
  );
}