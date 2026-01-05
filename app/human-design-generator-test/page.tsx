"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Quiz questions for Tab 1
const quizQuestions = [
  {
    id: 1,
    question: "When you're doing work you truly love, how do you feel about your energy levels?",
    options: [
      { text: "I have endless energy and can work for hours without getting tired", score: 3 },
      { text: "I have good energy but need regular breaks", score: 2 },
      { text: "I often feel drained even when doing things I like", score: 1 },
      { text: "My energy is unpredictable and varies greatly", score: 0 }
    ]
  },
  {
    id: 2,
    question: "How do you typically approach new opportunities or projects?",
    options: [
      { text: "I wait for things to come to me, then decide if they excite me", score: 3 },
      { text: "I actively seek out opportunities but check my gut before committing", score: 2 },
      { text: "I initiate and start things on my own without waiting", score: 1 },
      { text: "I wait for others to invite or recognize me first", score: 0 }
    ]
  },
  {
    id: 3,
    question: "When stuck in work that feels meaningless, how do you typically feel?",
    options: [
      { text: "Deeply frustrated - like my energy is being wasted", score: 3 },
      { text: "Bored but I push through it", score: 2 },
      { text: "Angry that I have to do it", score: 1 },
      { text: "Bitter or disappointed", score: 0 }
    ]
  },
  {
    id: 4,
    question: "How do you make your best decisions?",
    options: [
      { text: "I listen to my gut response - an inner 'uh-huh' or 'uh-uh'", score: 3 },
      { text: "I think it through logically and analyze options", score: 1 },
      { text: "I wait and see how I feel over time", score: 0 },
      { text: "I follow my immediate impulse to act", score: 2 }
    ]
  },
  {
    id: 5,
    question: "At the end of a productive day, how do you feel?",
    options: [
      { text: "Satisfied and fulfilled - ready to rest and recharge", score: 3 },
      { text: "Accomplished but still have energy to spare", score: 2 },
      { text: "Exhausted and need lots of recovery time", score: 0 },
      { text: "Ready to keep going and start something new", score: 1 }
    ]
  },
  {
    id: 6,
    question: "How would others describe your work style?",
    options: [
      { text: "A workhorse - reliable, dedicated, and consistent", score: 3 },
      { text: "Fast-moving and juggling multiple things at once", score: 2 },
      { text: "A natural leader who initiates change", score: 1 },
      { text: "An advisor who guides others", score: 0 }
    ]
  },
  {
    id: 7,
    question: "When someone asks you a yes/no question, how do you respond?",
    options: [
      { text: "I feel an immediate gut response before my mind catches up", score: 3 },
      { text: "I need to think about it and weigh the options", score: 1 },
      { text: "I respond quickly with what I want", score: 2 },
      { text: "I need time to reflect before answering", score: 0 }
    ]
  },
  {
    id: 8,
    question: "What brings you the most satisfaction in life?",
    options: [
      { text: "Being fully engaged in work that lights me up", score: 3 },
      { text: "Having the freedom to do things my own way", score: 1 },
      { text: "Being recognized for my insights and guidance", score: 0 },
      { text: "Completing many different tasks and projects quickly", score: 2 }
    ]
  }
];

// Career categories for Tab 2
const careerCategories = [
  {
    id: "creative",
    name: "Creative & Artistic",
    icon: "🎨",
    careers: [
      { title: "Graphic Designer", reason: "Allows deep immersion in creative projects that energize you" },
      { title: "Writer/Author", reason: "Sustained creative energy perfect for long-form content" },
      { title: "Musician/Composer", reason: "Your consistent energy supports mastering an instrument" },
      { title: "Video Editor", reason: "Detail-oriented work that rewards your dedication" },
      { title: "Photographer", reason: "Combines creativity with hands-on, satisfying work" }
    ]
  },
  {
    id: "technical",
    name: "Technical & Analytical",
    icon: "💻",
    careers: [
      { title: "Software Developer", reason: "Complex problem-solving uses your sustained focus" },
      { title: "Data Analyst", reason: "Systematic work that rewards your persistence" },
      { title: "Engineer", reason: "Building things from start to finish brings satisfaction" },
      { title: "Quality Assurance", reason: "Your attention to detail ensures thorough testing" },
      { title: "Technical Writer", reason: "Combines expertise with consistent output" }
    ]
  },
  {
    id: "service",
    name: "Service & Healthcare",
    icon: "🏥",
    careers: [
      { title: "Nurse", reason: "Your reliable energy supports demanding care schedules" },
      { title: "Physical Therapist", reason: "Hands-on healing work that's deeply satisfying" },
      { title: "Chef/Cook", reason: "Creating with your hands brings tangible satisfaction" },
      { title: "Massage Therapist", reason: "Physical work that uses your life force energy" },
      { title: "Fitness Trainer", reason: "Your natural energy inspires and motivates others" }
    ]
  },
  {
    id: "business",
    name: "Business & Entrepreneurship",
    icon: "💼",
    careers: [
      { title: "Small Business Owner", reason: "Build something you're passionate about responding to" },
      { title: "Project Manager", reason: "Your dedication sees projects through to completion" },
      { title: "Operations Manager", reason: "Systematic work that utilizes your consistent energy" },
      { title: "Sales Professional", reason: "Responding to customer needs energizes you" },
      { title: "Real Estate Agent", reason: "Varied work that keeps you engaged and satisfied" }
    ]
  },
  {
    id: "hands-on",
    name: "Hands-On & Trades",
    icon: "🔧",
    careers: [
      { title: "Carpenter", reason: "Creating with your hands brings deep satisfaction" },
      { title: "Electrician", reason: "Problem-solving physical work rewards your persistence" },
      { title: "Gardener/Landscaper", reason: "Connecting with nature while doing meaningful work" },
      { title: "Mechanic", reason: "Fixing things provides tangible accomplishment" },
      { title: "Craftsperson", reason: "Mastery through dedicated, consistent practice" }
    ]
  }
];

export default function HumanDesignGeneratorTest() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"quiz" | "career" | "strategy">("quiz");
  
  // Quiz state (Tab 1)
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);
  
  // Career state (Tab 2)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Strategy state (Tab 3)
  const [todayFeeling, setTodayFeeling] = useState<string>("");
  const [todayActivity, setTodayActivity] = useState<string>("");
  const [strategyResult, setStrategyResult] = useState<{
    analysis: string;
    tips: string[];
    affirmation: string;
  } | null>(null);

  // Quiz functions
  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);
    
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizComplete(true);
    }
  };

  const getQuizResult = () => {
    const totalScore = answers.reduce((a, b) => a + b, 0);
    const maxScore = quizQuestions.length * 3;
    const percentage = (totalScore / maxScore) * 100;
    
    if (percentage >= 75) {
      return {
        type: "Pure Generator",
        confidence: "High",
        description: "You show strong Generator characteristics! You likely have a defined Sacral Center and thrive when responding to life with your gut instincts. Your sustainable energy is your superpower.",
        icon: "⚡",
        color: "#22c55e"
      };
    } else if (percentage >= 55) {
      return {
        type: "Manifesting Generator",
        confidence: "Moderate",
        description: "You show traits of a Manifesting Generator - a Generator subtype that moves faster and juggles multiple interests. You have the Generator's life force but with added speed and multi-tasking ability.",
        icon: "🚀",
        color: "#3b82f6"
      };
    } else if (percentage >= 35) {
      return {
        type: "Possibly Another Type",
        confidence: "Low",
        description: "Your responses suggest you might be a Manifestor, Projector, or have a unique Generator profile. Consider getting a full Human Design chart reading with your birth data for accurate results.",
        icon: "🔮",
        color: "#a855f7"
      };
    } else {
      return {
        type: "Likely Not a Generator",
        confidence: "Low",
        description: "Your responses indicate you might be a Projector, Manifestor, or Reflector. Each type has its own beautiful gifts! Get your full Human Design chart to discover your true type.",
        icon: "✨",
        color: "#f59e0b"
      };
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setQuizComplete(false);
  };

  // Strategy functions
  const analyzeStrategy = () => {
    if (!todayFeeling || !todayActivity.trim()) return;
    
    let analysis = "";
    let tips: string[] = [];
    let affirmation = "";
    
    if (todayFeeling === "satisfied") {
      analysis = "Wonderful! Feeling satisfied is the Generator's signature - it means you're aligned with your true self. You responded to the right things today.";
      tips = [
        "Notice what activities brought you this satisfaction",
        "Your gut response led you correctly - trust it more",
        "This is your natural state when living in alignment",
        "Rest well tonight to recharge your Sacral energy"
      ];
      affirmation = "I am living in alignment with my design. My satisfaction is proof I'm on the right path.";
    } else if (todayFeeling === "frustrated") {
      analysis = "Frustration is the Generator's 'not-self' signal. It often means you initiated something without waiting to respond, or you're stuck doing work that doesn't light you up.";
      tips = [
        "Ask yourself: Did I wait to respond, or did I initiate?",
        "Are you doing work that genuinely excites your gut?",
        "It's okay to say no to things that don't energize you",
        "Tomorrow, practice waiting for things to come to you",
        "Check if you're overcommitting to please others"
      ];
      affirmation = "My frustration is a guide, not a failure. It's showing me where to redirect my powerful energy.";
    } else {
      analysis = "Feeling neutral can mean you're in a waiting period - which is actually correct for Generators! Your strategy is to wait to respond, not to constantly initiate.";
      tips = [
        "Neutral days are not wasted days",
        "Stay open to opportunities that spark your gut response",
        "Use this time for rest and recharging",
        "Don't force action - let life bring you things to respond to",
        "Practice noticing your subtle gut responses"
      ];
      affirmation = "I trust in divine timing. The right opportunities are making their way to me.";
    }
    
    setStrategyResult({ analysis, tips, affirmation });
  };

  const resetStrategy = () => {
    setTodayFeeling("");
    setTodayActivity("");
    setStrategyResult(null);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #e2e8f0", padding: "12px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px" }}>
          <nav style={{ display: "flex", alignItems: "center", gap: "8px", color: "#64748b", fontSize: "14px", flexWrap: "wrap" }}>
            <Link href="/" style={{ color: "#3b82f6", textDecoration: "none" }}>Home</Link>
            <span>/</span>
            <span style={{ color: "#1e293b" }}>Human Design Generator Test</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 16px" }}>
        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: "800", color: "#1e293b", marginBottom: "12px" }}>
            Human Design Generator Test
          </h1>
          <p style={{ color: "#64748b", fontSize: "18px", maxWidth: "700px", margin: "0 auto" }}>
            Discover if you&apos;re a Generator type, find your ideal career path, and learn daily strategies for living in alignment.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "12px", padding: "20px", marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "24px" }}>⚡</span>
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1e40af", marginBottom: "8px" }}>
                What is a Generator in Human Design?
              </h2>
              <p style={{ color: "#1e3a8a", fontSize: "15px", lineHeight: "1.6", margin: 0 }}>
                Generators make up about 70% of the population (37% pure Generators + 33% Manifesting Generators). 
                They have a defined Sacral Center, giving them sustainable life force energy. Their strategy is 
                to <strong>&quot;wait to respond&quot;</strong> rather than initiate, and their signature feeling when aligned is <strong>satisfaction</strong>. 
                When misaligned, they experience frustration.
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          {[
            { id: "quiz", label: "Am I a Generator?", icon: "🔍" },
            { id: "career", label: "Career Match", icon: "💼" },
            { id: "strategy", label: "Daily Strategy", icon: "📅" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              style={{
                padding: "12px 20px",
                borderRadius: "8px",
                border: activeTab === tab.id ? "2px solid #3b82f6" : "1px solid #e2e8f0",
                backgroundColor: activeTab === tab.id ? "#eff6ff" : "#fff",
                color: activeTab === tab.id ? "#1d4ed8" : "#64748b",
                fontWeight: "600",
                fontSize: "15px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s"
              }}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Quiz */}
        {activeTab === "quiz" && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            {/* Quiz Area */}
            <div style={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "24px" }}>
              {!quizComplete ? (
                <>
                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <span style={{ fontSize: "14px", color: "#64748b" }}>
                        Question {currentQuestion + 1} of {quizQuestions.length}
                      </span>
                      <span style={{ fontSize: "14px", color: "#3b82f6", fontWeight: "600" }}>
                        {Math.round(((currentQuestion) / quizQuestions.length) * 100)}% complete
                      </span>
                    </div>
                    <div style={{ height: "8px", backgroundColor: "#e2e8f0", borderRadius: "4px", overflow: "hidden" }}>
                      <div 
                        style={{ 
                          height: "100%", 
                          backgroundColor: "#3b82f6", 
                          borderRadius: "4px",
                          width: `${((currentQuestion) / quizQuestions.length) * 100}%`,
                          transition: "width 0.3s"
                        }} 
                      />
                    </div>
                  </div>
                  
                  <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1e293b", marginBottom: "20px", lineHeight: "1.5" }}>
                    {quizQuestions[currentQuestion].question}
                  </h3>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {quizQuestions[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswer(option.score)}
                        style={{
                          padding: "16px",
                          borderRadius: "8px",
                          border: "1px solid #e2e8f0",
                          backgroundColor: "#fff",
                          textAlign: "left",
                          cursor: "pointer",
                          fontSize: "15px",
                          color: "#374151",
                          transition: "all 0.2s",
                          lineHeight: "1.5"
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.borderColor = "#3b82f6";
                          e.currentTarget.style.backgroundColor = "#eff6ff";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.borderColor = "#e2e8f0";
                          e.currentTarget.style.backgroundColor = "#fff";
                        }}
                      >
                        {option.text}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div style={{ textAlign: "center", marginBottom: "24px" }}>
                    <span style={{ fontSize: "48px" }}>{getQuizResult().icon}</span>
                    <h3 style={{ fontSize: "24px", fontWeight: "700", color: "#1e293b", marginTop: "12px" }}>
                      Quiz Complete!
                    </h3>
                  </div>
                  <button
                    onClick={resetQuiz}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      backgroundColor: "#f8fafc",
                      color: "#64748b",
                      fontWeight: "600",
                      cursor: "pointer"
                    }}
                  >
                    Retake Quiz
                  </button>
                </>
              )}
            </div>

            {/* Results Area */}
            <div className="calc-results" style={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "16px" }}>
                Your Result
              </h3>
              
              {quizComplete ? (
                <div>
                  <div 
                    style={{ 
                      padding: "20px", 
                      borderRadius: "12px", 
                      backgroundColor: `${getQuizResult().color}15`,
                      border: `2px solid ${getQuizResult().color}`,
                      marginBottom: "20px"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                      <span style={{ fontSize: "32px" }}>{getQuizResult().icon}</span>
                      <div>
                        <div style={{ fontSize: "22px", fontWeight: "700", color: getQuizResult().color }}>
                          {getQuizResult().type}
                        </div>
                        <div style={{ fontSize: "14px", color: "#64748b" }}>
                          Confidence: {getQuizResult().confidence}
                        </div>
                      </div>
                    </div>
                    <p style={{ color: "#374151", lineHeight: "1.6", margin: 0 }}>
                      {getQuizResult().description}
                    </p>
                  </div>
                  
                  <div style={{ backgroundColor: "#fefce8", border: "1px solid #fef08a", borderRadius: "8px", padding: "16px" }}>
                    <div style={{ fontWeight: "600", color: "#854d0e", marginBottom: "8px" }}>
                      📌 Note
                    </div>
                    <p style={{ color: "#713f12", fontSize: "14px", margin: 0, lineHeight: "1.5" }}>
                      This quiz provides an indication based on behavioral traits. For your accurate Human Design type, 
                      you need a chart calculated from your exact birth date, time, and location.
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: "center", color: "#94a3b8", padding: "40px 20px" }}>
                  <span style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}>🔍</span>
                  <p style={{ margin: 0 }}>Answer the questions to see your result</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Career Match */}
        {activeTab === "career" && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            {/* Category Selection */}
            <div style={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>
                Select Your Interest Area
              </h3>
              <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "20px" }}>
                Choose a field that excites your gut response
              </p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {careerCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    style={{
                      padding: "16px",
                      borderRadius: "8px",
                      border: selectedCategory === category.id ? "2px solid #3b82f6" : "1px solid #e2e8f0",
                      backgroundColor: selectedCategory === category.id ? "#eff6ff" : "#fff",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      transition: "all 0.2s"
                    }}
                  >
                    <span style={{ fontSize: "24px" }}>{category.icon}</span>
                    <span style={{ 
                      fontWeight: "600", 
                      color: selectedCategory === category.id ? "#1d4ed8" : "#374151" 
                    }}>
                      {category.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Career Results */}
            <div className="calc-results" style={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "16px" }}>
                Careers for Generators
              </h3>
              
              {selectedCategory ? (
                <div>
                  {careerCategories
                    .filter(c => c.id === selectedCategory)
                    .map(category => (
                      <div key={category.id}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                          <span style={{ fontSize: "24px" }}>{category.icon}</span>
                          <span style={{ fontWeight: "600", color: "#3b82f6" }}>{category.name}</span>
                        </div>
                        
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                          {category.careers.map((career, index) => (
                            <div 
                              key={index}
                              style={{ 
                                padding: "16px", 
                                backgroundColor: "#f8fafc", 
                                borderRadius: "8px",
                                border: "1px solid #e2e8f0"
                              }}
                            >
                              <div style={{ fontWeight: "600", color: "#1e293b", marginBottom: "6px" }}>
                                {career.title}
                              </div>
                              <div style={{ fontSize: "14px", color: "#64748b", lineHeight: "1.5" }}>
                                <span style={{ color: "#22c55e" }}>✓</span> {career.reason}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div style={{ 
                          marginTop: "20px", 
                          padding: "16px", 
                          backgroundColor: "#f0fdf4", 
                          borderRadius: "8px",
                          border: "1px solid #bbf7d0"
                        }}>
                          <div style={{ fontWeight: "600", color: "#166534", marginBottom: "8px" }}>
                            💡 Generator Career Tip
                          </div>
                          <p style={{ color: "#15803d", fontSize: "14px", margin: 0, lineHeight: "1.5" }}>
                            The best career for a Generator is one that makes you say &quot;uh-huh!&quot; from your gut. 
                            Don&apos;t chase prestige or money - follow satisfaction. Your energy is sustainable only 
                            when you&apos;re doing work you love.
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div style={{ textAlign: "center", color: "#94a3b8", padding: "40px 20px" }}>
                  <span style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}>💼</span>
                  <p style={{ margin: 0 }}>Select an interest area to see matching careers</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Daily Strategy */}
        {activeTab === "strategy" && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            {/* Input Area */}
            <div style={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "16px" }}>
                Daily Strategy Check-In
              </h3>
              
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                  How are you feeling today?
                </label>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  {[
                    { value: "satisfied", label: "Satisfied 😊", color: "#22c55e" },
                    { value: "frustrated", label: "Frustrated 😤", color: "#ef4444" },
                    { value: "neutral", label: "Neutral 😐", color: "#64748b" }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTodayFeeling(option.value)}
                      style={{
                        padding: "12px 20px",
                        borderRadius: "8px",
                        border: todayFeeling === option.value ? `2px solid ${option.color}` : "1px solid #e2e8f0",
                        backgroundColor: todayFeeling === option.value ? `${option.color}15` : "#fff",
                        cursor: "pointer",
                        fontWeight: "600",
                        color: todayFeeling === option.value ? option.color : "#64748b",
                        transition: "all 0.2s"
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                  What did you spend most of your energy on today?
                </label>
                <textarea
                  value={todayActivity}
                  onChange={(e) => setTodayActivity(e.target.value)}
                  placeholder="e.g., Working on a project I don't enjoy, helping a friend move, learning something new..."
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "15px",
                    minHeight: "100px",
                    resize: "vertical",
                    boxSizing: "border-box"
                  }}
                />
              </div>
              
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={analyzeStrategy}
                  disabled={!todayFeeling || !todayActivity.trim()}
                  style={{
                    flex: 1,
                    padding: "14px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: (!todayFeeling || !todayActivity.trim()) ? "#e2e8f0" : "#3b82f6",
                    color: (!todayFeeling || !todayActivity.trim()) ? "#94a3b8" : "#fff",
                    fontWeight: "600",
                    fontSize: "16px",
                    cursor: (!todayFeeling || !todayActivity.trim()) ? "not-allowed" : "pointer"
                  }}
                >
                  Get Strategy Guidance
                </button>
                <button
                  onClick={resetStrategy}
                  style={{
                    padding: "14px 20px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    backgroundColor: "#fff",
                    color: "#64748b",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Results Area */}
            <div className="calc-results" style={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1e293b", marginBottom: "16px" }}>
                Your Generator Guidance
              </h3>
              
              {strategyResult ? (
                <div>
                  <div style={{ 
                    padding: "16px", 
                    backgroundColor: "#f8fafc", 
                    borderRadius: "8px", 
                    marginBottom: "20px",
                    borderLeft: "4px solid #3b82f6"
                  }}>
                    <p style={{ color: "#374151", lineHeight: "1.6", margin: 0 }}>
                      {strategyResult.analysis}
                    </p>
                  </div>
                  
                  <div style={{ marginBottom: "20px" }}>
                    <h4 style={{ fontWeight: "600", color: "#1e293b", marginBottom: "12px" }}>
                      💡 Tips for You
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: "20px" }}>
                      {strategyResult.tips.map((tip, index) => (
                        <li key={index} style={{ color: "#374151", marginBottom: "8px", lineHeight: "1.5" }}>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div style={{ 
                    padding: "16px", 
                    backgroundColor: "#fdf4ff", 
                    borderRadius: "8px",
                    border: "1px solid #f5d0fe"
                  }}>
                    <div style={{ fontWeight: "600", color: "#86198f", marginBottom: "8px" }}>
                      ✨ Today&apos;s Affirmation
                    </div>
                    <p style={{ color: "#a21caf", fontSize: "15px", fontStyle: "italic", margin: 0, lineHeight: "1.5" }}>
                      &quot;{strategyResult.affirmation}&quot;
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: "center", color: "#94a3b8", padding: "40px 20px" }}>
                  <span style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}>📅</span>
                  <p style={{ margin: 0 }}>Complete the check-in to receive personalized guidance</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginTop: "48px" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: 0 }}>
            <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#1e293b", marginBottom: "16px" }}>
              Complete Guide to Human Design Generators
            </h2>
            
            <div style={{ color: "#374151", lineHeight: "1.8", fontSize: "16px" }}>
              <p>
                In the Human Design system, Generators are the most common energy type, making up approximately 
                70% of the world&apos;s population. This includes both pure Generators (about 37%) and Manifesting 
                Generators (about 33%). If you&apos;re a Generator, you possess one of the most powerful gifts in 
                the Human Design system: sustainable life force energy from your defined Sacral Center.
              </p>
              
              <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#1e293b", marginTop: "28px", marginBottom: "12px" }}>
                The Generator Strategy: Wait to Respond
              </h3>
              <p>
                Unlike Manifestors who are designed to initiate, Generators thrive when they wait for life to 
                present opportunities to them. This doesn&apos;t mean being passive—it means staying present and 
                aware so you can respond with your gut instinct when something comes your way. Your Sacral 
                Center communicates through sounds like &quot;uh-huh&quot; (yes) or &quot;uh-uh&quot; (no), giving you a clear 
                gut response to guide your decisions.
              </p>
              
              <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#1e293b", marginTop: "28px", marginBottom: "12px" }}>
                Satisfaction vs. Frustration
              </h3>
              <p>
                When Generators live in alignment with their design—responding to what truly lights them up—they 
                experience deep satisfaction. This is the Generator&apos;s signature feeling. However, when Generators 
                initiate without waiting to respond, or when they commit to work that doesn&apos;t energize them, 
                they experience their &quot;not-self&quot; theme: frustration. Frustration is not a sign of failure; it&apos;s 
                valuable feedback telling you to redirect your energy.
              </p>
              
              <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#1e293b", marginTop: "28px", marginBottom: "12px" }}>
                Generator vs. Manifesting Generator
              </h3>
              <p>
                While both types share the defined Sacral Center, Manifesting Generators have an additional 
                connection to a motor center, giving them the ability to move faster and multi-task more 
                effectively. Pure Generators tend to have more linear energy—they master one thing at a time. 
                Manifesting Generators often skip steps and juggle multiple projects simultaneously. Both 
                share the same strategy (wait to respond) and signature (satisfaction).
              </p>
              
              <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#1e293b", marginTop: "28px", marginBottom: "12px" }}>
                Best Practices for Generators
              </h3>
              <p>
                To live your best life as a Generator, practice these key principles: First, honor your gut 
                response by making decisions based on what excites your Sacral energy, not just what your mind 
                thinks you &quot;should&quot; do. Second, give yourself permission to say &quot;no&quot; to things that don&apos;t 
                light you up—this protects your energy for what truly matters. Third, understand that waiting 
                to respond doesn&apos;t mean doing nothing; stay engaged with life so opportunities can find you. 
                Finally, use your frustration as a compass—it&apos;s showing you where you need to make changes.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            <RelatedTools currentCategory="Lifestyle" currentUrl="/human-design-generator-test" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ marginTop: "48px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#1e293b", marginBottom: "24px" }}>
            Frequently Asked Questions
          </h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              {
                question: "What does a Generator Human Design mean?",
                answer: "A Generator in Human Design is an energy type characterized by a defined Sacral Center, which provides sustainable life force energy. Generators make up about 70% of the population and are designed to respond to life rather than initiate. When living correctly, they experience satisfaction; when not, they feel frustration. Their power lies in their ability to work consistently on things they love."
              },
              {
                question: "Are Generators rare in Human Design?",
                answer: "No, Generators are actually the most common type in Human Design. Pure Generators make up about 37% of the population, and when combined with Manifesting Generators (33%), they represent approximately 70% of all people. The rare types are Manifestors (9%), Projectors (20%), and Reflectors (1%)."
              },
              {
                question: "What is the Generator strategy in Human Design?",
                answer: "The Generator strategy is 'Wait to Respond.' This means instead of initiating actions like Manifestors, Generators should wait for something in their environment to respond to—a question, an opportunity, an idea. They then check in with their Sacral Center (gut response) to determine if it's a 'yes' or 'no' for them. This isn't about being passive, but about being present and responding authentically."
              },
              {
                question: "What is the difference between Generator and Manifesting Generator?",
                answer: "Both types have a defined Sacral Center and share the same strategy (wait to respond) and signature (satisfaction). The key difference is speed and style: Pure Generators have more linear, step-by-step energy and tend to master one thing at a time. Manifesting Generators have a motor connected to the throat, making them faster and more multi-focused—they often skip steps and juggle multiple interests simultaneously."
              },
              {
                question: "How do I know if I'm a Generator?",
                answer: "The only way to know your true Human Design type is to generate your chart using your exact birth date, time, and location. A Generator will have a defined (colored in) Sacral Center in their chart. Our quiz above can give you an indication based on behavioral traits, but for accuracy, you'll need your birth chart calculated."
              },
              {
                question: "Why do Generators feel frustrated?",
                answer: "Frustration is the Generator's 'not-self' theme—it signals that something is out of alignment. Common causes include: initiating instead of waiting to respond, doing work that doesn't excite them, saying 'yes' to things their gut said 'no' to, or not having enough engaging activities to respond to. Frustration is valuable feedback, not a failure."
              }
            ].map((faq, index) => (
              <div 
                key={index}
                style={{ 
                  backgroundColor: "#fff", 
                  borderRadius: "12px", 
                  border: "1px solid #e2e8f0",
                  padding: "20px"
                }}
              >
                <h3 style={{ fontSize: "17px", fontWeight: "600", color: "#1e293b", marginBottom: "10px" }}>
                  {faq.question}
                </h3>
                <p style={{ color: "#64748b", lineHeight: "1.7", margin: 0 }}>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ 
          marginTop: "48px", 
          padding: "20px", 
          backgroundColor: "#f8fafc", 
          borderRadius: "8px",
          border: "1px solid #e2e8f0"
        }}>
          <p style={{ color: "#64748b", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
            <strong>Disclaimer:</strong> This tool provides educational information about Human Design Generators 
            based on the Human Design system created by Ra Uru Hu. The quiz results are indicative only and based 
            on behavioral patterns, not your actual birth chart. For your accurate Human Design type, you need to 
            generate a chart using your exact birth date, time, and location. Human Design is a self-discovery 
            tool and should not replace professional advice for career, health, or life decisions.
          </p>
        </div>
      </div>
    </div>
  );
}