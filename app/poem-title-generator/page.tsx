"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Theme options
const themes = [
  { id: "love", label: "Love & Romance", icon: "💕" },
  { id: "life", label: "Life & Living", icon: "🌱" },
  { id: "nature", label: "Nature & Seasons", icon: "🍃" },
  { id: "loss", label: "Loss & Grief", icon: "🥀" },
  { id: "time", label: "Time & Memory", icon: "⏳" },
  { id: "hope", label: "Hope & Dreams", icon: "✨" },
  { id: "sadness", label: "Sadness & Melancholy", icon: "🌧️" },
  { id: "night", label: "Night & Dreams", icon: "🌙" },
  { id: "self", label: "Self & Identity", icon: "🪞" },
  { id: "journey", label: "Journey & Change", icon: "🛤️" }
];

// Style options
const styles = [
  { id: "poetic", label: "Poetic & Lyrical" },
  { id: "simple", label: "Simple & Clear" },
  { id: "deep", label: "Deep & Philosophical" },
  { id: "mysterious", label: "Mysterious & Ethereal" },
  { id: "romantic", label: "Romantic & Tender" },
  { id: "dark", label: "Dark & Somber" },
  { id: "funny", label: "Funny & Playful" },
  { id: "abstract", label: "Abstract & Artistic" }
];

// Title templates by theme
const titleTemplates: { [key: string]: string[] } = {
  love: [
    "Whispers of {keyword}",
    "The Heart's {keyword}",
    "When Love {keyword}",
    "Letters to {keyword}",
    "In the Arms of {keyword}",
    "A Love Like {keyword}",
    "The Distance Between {keyword}",
    "Hearts Made of {keyword}",
    "What Love Taught {keyword}",
    "The Color of {keyword}",
    "Dancing with {keyword}",
    "Promises in {keyword}",
    "The Last Kiss of {keyword}",
    "Falling Into {keyword}",
    "Love's {keyword}"
  ],
  life: [
    "The Weight of {keyword}",
    "Lessons from {keyword}",
    "Living with {keyword}",
    "The Art of {keyword}",
    "Between {keyword} and Tomorrow",
    "What {keyword} Knows",
    "The Ordinary {keyword}",
    "Life in {keyword}",
    "A Story of {keyword}",
    "The Meaning of {keyword}",
    "Growing Through {keyword}",
    "Moments of {keyword}",
    "The Gift of {keyword}",
    "{keyword} and Other Truths",
    "Finding {keyword}"
  ],
  nature: [
    "Where {keyword} Grows",
    "The Song of {keyword}",
    "Beneath the {keyword}",
    "{keyword} in the Wind",
    "When {keyword} Falls",
    "The River's {keyword}",
    "Mountains of {keyword}",
    "A Garden of {keyword}",
    "The Last {keyword} of Autumn",
    "Spring's {keyword}",
    "Ocean of {keyword}",
    "The Forest's {keyword}",
    "Wildflowers and {keyword}",
    "Storm of {keyword}",
    "The Earth's {keyword}"
  ],
  loss: [
    "After {keyword}",
    "The Absence of {keyword}",
    "Ghosts of {keyword}",
    "What {keyword} Left Behind",
    "Empty {keyword}",
    "The Weight of {keyword}",
    "Mourning {keyword}",
    "Ashes of {keyword}",
    "The Last {keyword}",
    "Goodbye to {keyword}",
    "Fading {keyword}",
    "The Silence After {keyword}",
    "Lost in {keyword}",
    "Remembering {keyword}",
    "Shadows of {keyword}"
  ],
  time: [
    "The Hours of {keyword}",
    "When {keyword} Passes",
    "Echoes of {keyword}",
    "Yesterday's {keyword}",
    "The Clock of {keyword}",
    "Moments in {keyword}",
    "Before {keyword} Ends",
    "The Age of {keyword}",
    "Memories of {keyword}",
    "Time and {keyword}",
    "The Past's {keyword}",
    "Waiting for {keyword}",
    "Forever in {keyword}",
    "The Season of {keyword}",
    "{keyword} Through the Years"
  ],
  hope: [
    "Light of {keyword}",
    "Tomorrow's {keyword}",
    "Dreams of {keyword}",
    "The Promise of {keyword}",
    "Rising from {keyword}",
    "Hope in {keyword}",
    "A New {keyword}",
    "The Dawn of {keyword}",
    "Believing in {keyword}",
    "Wings of {keyword}",
    "Beyond {keyword}",
    "The Spark of {keyword}",
    "Chasing {keyword}",
    "{keyword} Will Come",
    "Seeds of {keyword}"
  ],
  sadness: [
    "Tears of {keyword}",
    "The Weight of {keyword}",
    "Blue {keyword}",
    "Drowning in {keyword}",
    "The Rain's {keyword}",
    "Alone with {keyword}",
    "Grey {keyword}",
    "The Depths of {keyword}",
    "Broken {keyword}",
    "Falling {keyword}",
    "The Cold of {keyword}",
    "Fading {keyword}",
    "Hollow {keyword}",
    "Whispers of {keyword}",
    "Silent {keyword}"
  ],
  night: [
    "Midnight's {keyword}",
    "Dreams of {keyword}",
    "Under the {keyword} Moon",
    "The Stars' {keyword}",
    "Night's {keyword}",
    "Sleeping {keyword}",
    "In the Dark {keyword}",
    "When {keyword} Dreams",
    "The Moon's {keyword}",
    "3 AM {keyword}",
    "Shadows of {keyword}",
    "The Dreamer's {keyword}",
    "Nocturne for {keyword}",
    "While the World {keyword}",
    "Starlight and {keyword}"
  ],
  self: [
    "Portrait of {keyword}",
    "The Mirror's {keyword}",
    "Finding {keyword}",
    "Who I {keyword}",
    "Inside {keyword}",
    "My Own {keyword}",
    "The Self's {keyword}",
    "Becoming {keyword}",
    "Layers of {keyword}",
    "The Truth of {keyword}",
    "Unmasked {keyword}",
    "My {keyword} Story",
    "Learning to {keyword}",
    "Soul of {keyword}",
    "The Person I {keyword}"
  ],
  journey: [
    "The Road to {keyword}",
    "Walking Through {keyword}",
    "Miles of {keyword}",
    "The Path of {keyword}",
    "Journey to {keyword}",
    "Footsteps in {keyword}",
    "Crossing {keyword}",
    "The Map of {keyword}",
    "Wandering {keyword}",
    "Leaving {keyword}",
    "The Traveler's {keyword}",
    "Between {keyword} and Home",
    "Following {keyword}",
    "The Long {keyword}",
    "Destinations of {keyword}"
  ]
};

// Keywords by theme (used when user doesn't provide one)
const themeKeywords: { [key: string]: string[] } = {
  love: ["Heart", "You", "Us", "Forever", "Touch", "Soul", "Fire", "Desire", "Tender", "Passion", "Devotion", "Affection", "Longing", "Embrace", "Flame"],
  life: ["Days", "Moments", "Breath", "Being", "Purpose", "Existence", "Reality", "Truth", "Growth", "Experience", "Wonder", "Chaos", "Balance", "Choices", "Ordinary"],
  nature: ["Rain", "Wind", "Leaves", "Flowers", "Sky", "Earth", "Trees", "Rivers", "Mountains", "Seasons", "Snow", "Sun", "Grass", "Birds", "Clouds"],
  loss: ["You", "Yesterday", "Love", "Hope", "Home", "Childhood", "Innocence", "Dreams", "Faith", "Time", "Words", "Touch", "Voice", "Presence", "Light"],
  time: ["Youth", "Seasons", "Memories", "Days", "Moments", "Years", "Ages", "Forever", "Never", "Always", "Change", "Past", "Future", "Present", "Hours"],
  hope: ["Tomorrow", "Light", "Dawn", "Dreams", "Stars", "Spring", "Wings", "Rise", "Healing", "Renewal", "Beginning", "Courage", "Faith", "Possibility", "Strength"],
  sadness: ["Rain", "Tears", "Grey", "Silence", "Empty", "Loss", "Pain", "Lonely", "Broken", "Forgotten", "Weary", "Heavy", "Cold", "Darkness", "Sorrow"],
  night: ["Stars", "Moon", "Silence", "Dreams", "Shadows", "Sleep", "Dark", "Secrets", "Whispers", "Stillness", "Peace", "Mystery", "Wonder", "Rest", "Quiet"],
  self: ["Me", "Soul", "Truth", "Masks", "Heart", "Mind", "Voice", "Skin", "Eyes", "Hands", "Bones", "Blood", "Name", "Face", "Story"],
  journey: ["Roads", "Steps", "Distance", "Horizons", "Destinations", "Paths", "Miles", "Crossroads", "Adventures", "Wandering", "Discovery", "Return", "Leaving", "Arriving", "Moving"]
};

// Style modifiers
const styleModifiers: { [key: string]: (title: string) => string[] } = {
  poetic: (title) => [title, `A ${title}`, `The ${title}`, `${title}: A Poem`],
  simple: (title) => [title, title.split(" ").slice(0, 3).join(" "), title.replace("The ", "")],
  deep: (title) => [`${title} (A Meditation)`, `On ${title}`, `The Philosophy of ${title.replace("The ", "")}`, `${title}: A Reflection`],
  mysterious: (title) => [`${title}...`, `The Secret ${title.replace("The ", "")}`, `What ${title} Hides`, `${title} (Untold)`],
  romantic: (title) => [`My Dearest ${title.replace("The ", "")}`, `${title}, My Love`, `For You: ${title}`, `${title} (A Love Letter)`],
  dark: (title) => [`${title} in Shadows`, `The Dark ${title.replace("The ", "")}`, `${title} (Nevermore)`, `Beneath ${title}`],
  funny: (title) => [`${title} (and Other Disasters)`, `Why ${title} Makes Me Laugh`, `${title}: A Comedy`, `Ode to ${title.replace("The ", "")}`],
  abstract: (title) => [`[${title}]`, `${title} / ${title.split(" ").reverse().join(" ")}`, `~ ${title} ~`, `${title.toUpperCase()}`]
};

// Title ideas gallery data
const titleIdeasGallery: { [key: string]: { category: string; titles: string[] } } = {
  life: {
    category: "About Life",
    titles: [
      "The Weight of Ordinary Days",
      "Lessons from the Mirror",
      "What Nobody Told Me",
      "The Art of Being Human",
      "Between Sunrise and Sunset",
      "Small Victories",
      "The Things We Carry",
      "Living in the Meanwhile",
      "Notes from the Middle",
      "The Gentle Chaos of Being"
    ]
  },
  love: {
    category: "About Love",
    titles: [
      "Hearts Like Paper",
      "The Distance Between Us",
      "What Your Hands Remember",
      "A Love in Lowercase",
      "The Geography of Us",
      "Letters I Never Sent",
      "When You Left the Light On",
      "The Quiet of Your Name",
      "Dancing in the Kitchen",
      "The Language We Invented"
    ]
  },
  nature: {
    category: "About Nature",
    titles: [
      "Where Rivers Remember",
      "Autumn's Last Breath",
      "The Patience of Mountains",
      "What the Wind Carries",
      "A Conversation with Rain",
      "The Ocean's Lullaby",
      "Roots and Rising",
      "The Forest's Secret",
      "Snow Before Dawn",
      "The Sun Also Waits"
    ]
  },
  deep: {
    category: "Deep & Philosophical",
    titles: [
      "The Shape of Silence",
      "What the Stars Forgot",
      "Between Being and Becoming",
      "The Weight of Nothing",
      "Questions Without Rooms",
      "The Color of Time",
      "Where Meaning Lives",
      "The Edge of Understanding",
      "Thoughts That Have No Words",
      "The Space Between Thoughts"
    ]
  },
  funny: {
    category: "Funny & Playful",
    titles: [
      "My Cat Wrote This Poem",
      "Ode to Monday Morning Coffee",
      "Why I Talk to Plants",
      "The Existential Crisis of a Sock",
      "Love Letter to My Bed",
      "The WiFi Is Down Again",
      "Conversations with My Refrigerator",
      "An Apology to My Alarm Clock",
      "The Drama of Choosing Dinner",
      "Why My Dog Is My Therapist"
    ]
  },
  students: {
    category: "For Students",
    titles: [
      "First Day Feelings",
      "What I Learned Today",
      "The View from My Desk",
      "Growing Pains",
      "The Future Is a Question Mark",
      "Homework and Daydreams",
      "What My Parents Don't Know",
      "The Longest Year",
      "Finding My Voice",
      "Between Classes"
    ]
  },
  sadness: {
    category: "Sadness & Melancholy",
    titles: [
      "The Heaviness of Grey Days",
      "Tears I Save for Later",
      "The Empty Chair",
      "What Silence Sounds Like",
      "After the Last Goodbye",
      "The Museum of Broken Things",
      "Songs I Can't Listen To",
      "The Weight of Missing You",
      "Rain on the Inside",
      "The Art of Letting Go"
    ]
  },
  hope: {
    category: "Hope & Inspiration",
    titles: [
      "The Light Will Find You",
      "Tomorrow Is Unwritten",
      "Seeds in Winter",
      "The Courage to Begin Again",
      "What the Dawn Promises",
      "Rising from the Ashes",
      "A Thousand Small Suns",
      "The Other Side of This",
      "Believing in Spring",
      "The First Step Forward"
    ]
  }
};

// How to title guide data
const titleGuide = [
  {
    method: "Use a Key Image",
    description: "Choose the most striking or central image from your poem and use it as the title.",
    example: "If your poem features a recurring image of a broken clock, title it 'The Broken Clock' or 'Clockwork Hearts'",
    icon: "🖼️"
  },
  {
    method: "First or Last Line",
    description: "Use the opening or closing line of your poem (or a phrase from it) as the title.",
    example: "'Do Not Go Gentle into That Good Night' by Dylan Thomas uses its first line as the title",
    icon: "📝"
  },
  {
    method: "Create Contrast",
    description: "Use a title that contrasts with or adds irony to the poem's content.",
    example: "A sad poem titled 'Joy' creates tension and invites curiosity",
    icon: "⚖️"
  },
  {
    method: "Be Abstract",
    description: "Use an abstract concept or emotion that captures the poem's essence without being literal.",
    example: "'The Shape of Longing' for a poem about missing someone",
    icon: "🌫️"
  },
  {
    method: "Keep It Simple",
    description: "Sometimes a single word or simple phrase is most powerful.",
    example: "'Home', 'Mother', 'The Road' - simplicity can be striking",
    icon: "✨"
  }
];

// FAQ data
const faqs = [
  {
    question: "How do I choose a good title for my poem?",
    answer: "A good poem title should capture the essence of your work without giving everything away. Consider using a striking image from your poem, an emotion it evokes, or even the first/last line. The title should intrigue readers and set the tone. Avoid being too literal—let the title add another layer of meaning."
  },
  {
    question: "Should my poem title be long or short?",
    answer: "Both can work well. Short titles (1-3 words) are punchy and memorable, like 'Still I Rise' or 'The Road Not Taken.' Longer titles can be more descriptive or poetic, like 'Do Not Go Gentle into That Good Night.' Choose based on what fits your poem's tone and what creates the right impression."
  },
  {
    question: "Can I write my poem without a title first?",
    answer: "Absolutely! Many poets write the poem first and find the title afterward. Sometimes the perfect title emerges from the writing process. You might discover a phrase or image that works perfectly. Don't force a title before you're ready."
  },
  {
    question: "What makes a poem title memorable?",
    answer: "Memorable titles often have rhythm, use vivid imagery, create emotion, or pose an intriguing question. They balance being specific enough to be interesting while being open enough to invite interpretation. Alliteration, unusual word combinations, and emotional resonance all help."
  },
  {
    question: "Should the title appear in the poem?",
    answer: "It's not required, but it can be effective. Some poets use a key line as the title, creating a nice connection. Others deliberately keep the title separate to add another dimension. There's no right or wrong—choose what serves your poem best."
  },
  {
    question: "Can I use 'Untitled' as my poem title?",
    answer: "While 'Untitled' is sometimes used, it can feel like a missed opportunity. The title is your first chance to connect with readers. Even a simple, abstract title gives readers something to hold onto. If you're stuck, try using an image or emotion from your poem."
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

export default function PoemTitleGenerator() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"generator" | "gallery" | "guide">("generator");
  
  // Generator state (Tab 1)
  const [selectedTheme, setSelectedTheme] = useState("love");
  const [selectedStyle, setSelectedStyle] = useState("poetic");
  const [userKeyword, setUserKeyword] = useState("");
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  // Gallery state (Tab 2)
  const [selectedCategory, setSelectedCategory] = useState("life");

  // Generate titles
  const generateTitles = () => {
    const templates = titleTemplates[selectedTheme] || titleTemplates.love;
    const keywords = userKeyword.trim() 
      ? [userKeyword.trim()] 
      : themeKeywords[selectedTheme] || themeKeywords.love;
    
    const modifier = styleModifiers[selectedStyle] || styleModifiers.poetic;
    const results: string[] = [];
    
    // Shuffle templates
    const shuffledTemplates = [...templates].sort(() => Math.random() - 0.5);
    
    // Generate 10 unique titles
    for (let i = 0; i < Math.min(10, shuffledTemplates.length); i++) {
      const template = shuffledTemplates[i];
      const keyword = keywords[Math.floor(Math.random() * keywords.length)];
      let title = template.replace("{keyword}", keyword);
      
      // Apply style modifier (50% chance)
      if (Math.random() > 0.5) {
        const modifiedTitles = modifier(title);
        title = modifiedTitles[Math.floor(Math.random() * modifiedTitles.length)];
      }
      
      results.push(title);
    }
    
    setGeneratedTitles(results);
    setCopiedIndex(null);
  };

  // Copy title to clipboard
  const copyTitle = (title: string, index: number) => {
    navigator.clipboard.writeText(title);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Poem Title Generator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>📜</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Poem Title Generator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Generate creative and evocative titles for your poems. Choose a theme and style, or browse our curated collection of poem title ideas for inspiration.
          </p>
        </div>

        {/* Quick Info Box */}
        <div style={{
          backgroundColor: "#F5F3FF",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #DDD6FE"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "#5B21B6", margin: "0 0 4px 0" }}>The Power of a Good Title</p>
              <p style={{ color: "#5B21B6", margin: 0, fontSize: "0.95rem" }}>
                A poem&apos;s title is the reader&apos;s first impression—it sets expectations, creates intrigue, and adds depth. 
                The best titles capture essence without giving everything away.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          {[
            { id: "generator", label: "Title Generator", icon: "✨" },
            { id: "gallery", label: "Title Ideas Gallery", icon: "📚" },
            { id: "guide", label: "How to Title a Poem", icon: "📝" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              style={{
                padding: "12px 20px",
                borderRadius: "8px",
                border: activeTab === tab.id ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                backgroundColor: activeTab === tab.id ? "#F5F3FF" : "white",
                color: activeTab === tab.id ? "#6D28D9" : "#4B5563",
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

        {/* Tab 1: Title Generator */}
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
              <div style={{ backgroundColor: "#7C3AED", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>✨ Create Your Title</h2>
              </div>
              
              <div style={{ padding: "24px" }}>
                {/* Theme Selection */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    Choose Theme
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {themes.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setSelectedTheme(theme.id)}
                        style={{
                          padding: "10px",
                          borderRadius: "8px",
                          border: selectedTheme === theme.id ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                          backgroundColor: selectedTheme === theme.id ? "#F5F3FF" : "white",
                          cursor: "pointer",
                          textAlign: "left",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px"
                        }}
                      >
                        <span>{theme.icon}</span>
                        <span style={{ fontSize: "0.85rem", color: selectedTheme === theme.id ? "#6D28D9" : "#374151" }}>{theme.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Style Selection */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    Choose Style
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {styles.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setSelectedStyle(style.id)}
                        style={{
                          padding: "8px 14px",
                          borderRadius: "20px",
                          border: selectedStyle === style.id ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                          backgroundColor: selectedStyle === style.id ? "#F5F3FF" : "white",
                          color: selectedStyle === style.id ? "#6D28D9" : "#374151",
                          cursor: "pointer",
                          fontSize: "0.85rem"
                        }}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional Keyword */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Add a Keyword (Optional)
                  </label>
                  <input
                    type="text"
                    value={userKeyword}
                    onChange={(e) => setUserKeyword(e.target.value)}
                    placeholder="e.g., Rain, Mother, Stars..."
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #E5E7EB",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                  />
                  <p style={{ fontSize: "0.8rem", color: "#9CA3AF", margin: "6px 0 0 0" }}>
                    Leave blank for random keywords based on your theme
                  </p>
                </div>

                {/* Generate Button */}
                <button
                  onClick={generateTitles}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#7C3AED",
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
                  ✨ Generate Titles
                </button>
              </div>
            </div>

            {/* Output Panel */}
            <div className="calc-results" style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📜 Generated Titles</h2>
              </div>
              
              <div style={{ padding: "24px" }}>
                {generatedTitles.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {generatedTitles.map((title, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "12px 16px",
                          backgroundColor: "#F9FAFB",
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB"
                        }}
                      >
                        <span style={{ 
                          fontFamily: "Georgia, serif", 
                          fontSize: "1rem",
                          color: "#1F2937",
                          fontStyle: "italic"
                        }}>
                          &ldquo;{title}&rdquo;
                        </span>
                        <button
                          onClick={() => copyTitle(title, index)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: "none",
                            backgroundColor: copiedIndex === index ? "#059669" : "#E5E7EB",
                            color: copiedIndex === index ? "white" : "#374151",
                            fontSize: "0.8rem",
                            cursor: "pointer",
                            transition: "all 0.2s"
                          }}
                        >
                          {copiedIndex === index ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    ))}
                    
                    {/* Regenerate Button */}
                    <button
                      onClick={generateTitles}
                      style={{
                        marginTop: "8px",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB",
                        backgroundColor: "white",
                        color: "#6B7280",
                        fontSize: "0.9rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px"
                      }}
                    >
                      🔄 Generate More
                    </button>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", color: "#9CA3AF", padding: "60px 20px" }}>
                    <span style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}>✨</span>
                    <p style={{ margin: 0 }}>Select options and click Generate to create poem titles</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Title Ideas Gallery */}
        {activeTab === "gallery" && (
          <div style={{ marginBottom: "40px" }}>
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#2563EB", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📚 Browse Poem Title Ideas</h2>
              </div>
              
              <div style={{ padding: "24px" }}>
                {/* Category Tabs */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
                  {Object.entries(titleIdeasGallery).map(([key, data]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key)}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "20px",
                        border: selectedCategory === key ? "2px solid #2563EB" : "1px solid #E5E7EB",
                        backgroundColor: selectedCategory === key ? "#EFF6FF" : "white",
                        color: selectedCategory === key ? "#1D4ED8" : "#4B5563",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        fontWeight: selectedCategory === key ? "600" : "400"
                      }}
                    >
                      {data.category}
                    </button>
                  ))}
                </div>

                {/* Title List */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
                  {titleIdeasGallery[selectedCategory]?.titles.map((title, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "14px 16px",
                        backgroundColor: "#F9FAFB",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB"
                      }}
                    >
                      <span style={{ 
                        fontFamily: "Georgia, serif", 
                        fontSize: "0.95rem",
                        color: "#1F2937",
                        fontStyle: "italic"
                      }}>
                        &ldquo;{title}&rdquo;
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(title);
                          alert(`Copied: "${title}"`);
                        }}
                        style={{
                          padding: "4px 10px",
                          borderRadius: "4px",
                          border: "none",
                          backgroundColor: "#E5E7EB",
                          color: "#374151",
                          fontSize: "0.75rem",
                          cursor: "pointer"
                        }}
                      >
                        Copy
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: How to Title Guide */}
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
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📝 How to Title Your Poem</h2>
              </div>
              
              <div style={{ padding: "24px" }}>
                <p style={{ color: "#4B5563", marginBottom: "24px", lineHeight: "1.7" }}>
                  Finding the perfect title can be challenging. Here are five proven methods that poets use to create compelling, 
                  memorable titles that draw readers in and add depth to their work.
                </p>
                
                <div style={{ display: "grid", gap: "16px" }}>
                  {titleGuide.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "20px",
                        backgroundColor: "#F9FAFB",
                        borderRadius: "12px",
                        border: "1px solid #E5E7EB"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                        <span style={{ fontSize: "1.5rem" }}>{item.icon}</span>
                        <h3 style={{ margin: 0, color: "#111827", fontSize: "1.1rem" }}>
                          {index + 1}. {item.method}
                        </h3>
                      </div>
                      <p style={{ color: "#4B5563", margin: "0 0 10px 0", fontSize: "0.95rem", lineHeight: "1.6" }}>
                        {item.description}
                      </p>
                      <div style={{ padding: "10px 14px", backgroundColor: "#E0E7FF", borderRadius: "6px" }}>
                        <p style={{ margin: 0, fontSize: "0.85rem", color: "#3730A3", fontStyle: "italic" }}>
                          💡 {item.example}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Good Title Characteristics */}
                <div style={{ marginTop: "32px", padding: "24px", backgroundColor: "#FEF3C7", borderRadius: "12px", border: "1px solid #FCD34D" }}>
                  <h3 style={{ margin: "0 0 16px 0", color: "#92400E" }}>✓ Characteristics of a Good Poem Title</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
                    {[
                      "Creates curiosity",
                      "Sets the tone",
                      "Adds meaning",
                      "Is memorable",
                      "Matches the style",
                      "Isn't too literal",
                      "Invites interpretation",
                      "Feels intentional"
                    ].map((item, idx) => (
                      <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ color: "#059669" }}>✓</span>
                        <span style={{ fontSize: "0.9rem", color: "#92400E" }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            {/* Famous Examples */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>🏆 Famous Poem Titles That Work</h2>
              
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F5F3FF" }}>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Title</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Poet</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Why It Works</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { title: "The Road Not Taken", poet: "Robert Frost", why: "Creates intrigue with 'not taken'" },
                      { title: "Still I Rise", poet: "Maya Angelou", why: "Powerful, defiant, memorable" },
                      { title: "Do Not Go Gentle...", poet: "Dylan Thomas", why: "Uses the opening line" },
                      { title: "Hope is the thing with feathers", poet: "Emily Dickinson", why: "Unique metaphor" },
                      { title: "The Waste Land", poet: "T.S. Eliot", why: "Evocative imagery" },
                      { title: "I Wandered Lonely as a Cloud", poet: "William Wordsworth", why: "Immediate emotional image" }
                    ].map((row, idx) => (
                      <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", fontStyle: "italic" }}>&ldquo;{row.title}&rdquo;</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB" }}>{row.poet}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", color: "#6B7280" }}>{row.why}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Tips */}
            <div style={{ backgroundColor: "#F5F3FF", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #DDD6FE" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#6D28D9", marginBottom: "16px" }}>⚡ Quick Title Tips</h3>
              <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.875rem", color: "#5B21B6", lineHeight: "1.8" }}>
                <li>Keep it under 7 words</li>
                <li>Avoid clichés</li>
                <li>Don&apos;t explain the poem</li>
                <li>Try different options</li>
                <li>Read it aloud</li>
                <li>Ask: does it intrigue?</li>
              </ul>
            </div>

            {/* Title Patterns */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "24px", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>🔤 Common Title Patterns</h3>
              <div style={{ fontSize: "0.85rem", color: "#4B5563", lineHeight: "2" }}>
                <p style={{ margin: "0 0 4px 0" }}><strong>The + Noun:</strong> The Raven</p>
                <p style={{ margin: "0 0 4px 0" }}><strong>Verb + Noun:</strong> Crossing Brooklyn Ferry</p>
                <p style={{ margin: "0 0 4px 0" }}><strong>Prepositional:</strong> In a Station of the Metro</p>
                <p style={{ margin: "0 0 4px 0" }}><strong>Question:</strong> What Are Years?</p>
                <p style={{ margin: "0 0 4px 0" }}><strong>Statement:</strong> I Hear America Singing</p>
                <p style={{ margin: 0 }}><strong>Single Word:</strong> Howl, Daddy, Mushrooms</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/poem-title-generator" currentCategory="Lifestyle" />
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
            📜 <strong>Note:</strong> Generated titles are meant to inspire your creativity. Feel free to modify, combine, or use them as starting points for your own unique titles.
          </p>
        </div>
      </div>
    </div>
  );
}