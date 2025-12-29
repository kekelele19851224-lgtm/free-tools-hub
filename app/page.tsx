"use client";

import { useState } from "react";
import CalculatorCard from "@/components/CalculatorCard";
import { calculators, toolTypes, categories } from "@/lib/calculators";

export default function Home() {
  const [activeType, setActiveType] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCalculators = calculators.filter((calc) => {
    const matchesType = activeType === "All" || calc.type === activeType;
    const matchesCategory = activeCategory === "All" || calc.category === activeCategory;
    const matchesSearch = calc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          calc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Free Online Calculators & Tools
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Calculators, converters, counters, and estimators for finance, education, business, and everyday life.
          </p>
          
          {/* Search Box */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 text-lg border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                className="absolute right-6 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tool Type Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {toolTypes.map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeType === type
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                {type === "All" ? "All Tools" : type + "s"}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  activeCategory === category
                    ? "bg-gray-800 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Tool Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCalculators.map((calc) => (
              <CalculatorCard
                key={calc.url}
                name={calc.name}
                description={calc.description}
                url={calc.url}
                category={calc.category}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredCalculators.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No tools found. Try a different search term or filter.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}