'use client'

import React, { useState, useMemo } from 'react'

type Tab = 'quick' | 'detailed'
type ProjectLevel = 'basic' | 'midRange' | 'premium' | 'fullReno'
type LawnType = 'none' | 'seed' | 'sod' | 'artificial'
type MulchType = 'none' | 'wood' | 'rock' | 'gravel'
type PatioType = 'none' | 'concrete' | 'paver' | 'stone'

// Price data (2025 installed costs)
const PROJECT_LEVELS = {
  basic: { min: 4, max: 6, label: 'Basic', desc: 'Lawn, mulch, basic plants' },
  midRange: { min: 8, max: 12, label: 'Mid-Range', desc: '+ Shrubs, flower beds, edging' },
  premium: { min: 15, max: 25, label: 'Premium', desc: '+ Patio, walkways, irrigation' },
  fullReno: { min: 25, max: 50, label: 'Full Renovation', desc: '+ Outdoor kitchen, water features' }
}

const LAWN_PRICES = {
  none: { min: 0, max: 0, label: 'None', material: 'N/A' },
  seed: { min: 0.10, max: 0.20, label: 'Grass Seed', material: 'Seed + topsoil' },
  sod: { min: 1.00, max: 2.00, label: 'Sod', material: 'Fresh sod rolls' },
  artificial: { min: 8, max: 18, label: 'Artificial Turf', material: 'Synthetic grass' }
}

const MULCH_PRICES = {
  none: { min: 0, max: 0, label: 'None' },
  wood: { min: 0.50, max: 1.00, label: 'Wood Mulch (3")' },
  rock: { min: 1.50, max: 3.00, label: 'Decorative Rock' },
  gravel: { min: 1.00, max: 2.00, label: 'Gravel/Pea Stone' }
}

const PATIO_PRICES = {
  none: { min: 0, max: 0, label: 'None' },
  concrete: { min: 6, max: 12, label: 'Concrete Patio' },
  paver: { min: 12, max: 25, label: 'Paver Patio' },
  stone: { min: 20, max: 35, label: 'Natural Stone' }
}

const FEATURE_PRICES = {
  firePit: { min: 500, max: 3000, label: 'Fire Pit' },
  fountain: { min: 500, max: 2500, label: 'Water Fountain' },
  lighting: { min: 1500, max: 5000, label: 'Landscape Lighting' },
  irrigation: { min: 2500, max: 5000, label: 'Irrigation System' }
}

export default function LandscapingCostCalculator() {
  const [activeTab, setActiveTab] = useState<Tab>('quick')
  
  // Quick estimate inputs
  const [yardSize, setYardSize] = useState(2000)
  const [projectLevel, setProjectLevel] = useState<ProjectLevel>('midRange')
  const [includeInstall, setIncludeInstall] = useState(true)
  
  // Detailed inputs
  const [lawnType, setLawnType] = useState<LawnType>('sod')
  const [lawnArea, setLawnArea] = useState(1500)
  const [mulchType, setMulchType] = useState<MulchType>('wood')
  const [mulchArea, setMulchArea] = useState(300)
  const [shrubCount, setShrubCount] = useState(10)
  const [treeCount, setTreeCount] = useState(2)
  const [flowerBedArea, setFlowerBedArea] = useState(100)
  const [patioType, setPatioType] = useState<PatioType>('paver')
  const [patioArea, setPatioArea] = useState(200)
  const [walkwayLength, setWalkwayLength] = useState(30)
  const [retainingWallSqFt, setRetainingWallSqFt] = useState(0)
  const [features, setFeatures] = useState({
    firePit: false,
    fountain: false,
    lighting: false,
    irrigation: false
  })
  const [detailedIncludeInstall, setDetailedIncludeInstall] = useState(true)

  // Quick estimate calculation
  const quickResults = useMemo(() => {
    const level = PROJECT_LEVELS[projectLevel]
    const laborMultiplier = includeInstall ? 1 : 0.35 // Material only is ~35% of installed
    
    const minCost = Math.round(yardSize * level.min * laborMultiplier)
    const maxCost = Math.round(yardSize * level.max * laborMultiplier)
    
    return {
      minCost,
      maxCost,
      minPerSqFt: (level.min * laborMultiplier).toFixed(2),
      maxPerSqFt: (level.max * laborMultiplier).toFixed(2),
      level
    }
  }, [yardSize, projectLevel, includeInstall])

  // Detailed calculation
  const detailedResults = useMemo(() => {
    const laborMultiplier = detailedIncludeInstall ? 1 : 0.35
    
    // Lawn
    const lawnPrices = LAWN_PRICES[lawnType]
    const lawnMin = lawnArea * lawnPrices.min * laborMultiplier
    const lawnMax = lawnArea * lawnPrices.max * laborMultiplier
    
    // Mulch
    const mulchPrices = MULCH_PRICES[mulchType]
    const mulchMin = mulchArea * mulchPrices.min * laborMultiplier
    const mulchMax = mulchArea * mulchPrices.max * laborMultiplier
    
    // Plants
    const shrubMin = shrubCount * 25 * laborMultiplier
    const shrubMax = shrubCount * 100 * laborMultiplier
    const treeMin = treeCount * 150 * laborMultiplier
    const treeMax = treeCount * 500 * laborMultiplier
    const flowerMin = flowerBedArea * 3 * laborMultiplier
    const flowerMax = flowerBedArea * 8 * laborMultiplier
    const plantsMin = shrubMin + treeMin + flowerMin
    const plantsMax = shrubMax + treeMax + flowerMax
    
    // Hardscaping
    const patioPrices = PATIO_PRICES[patioType]
    const patioMin = patioArea * patioPrices.min * laborMultiplier
    const patioMax = patioArea * patioPrices.max * laborMultiplier
    const walkwayMin = walkwayLength * 3 * 8 * laborMultiplier // 3ft wide walkway
    const walkwayMax = walkwayLength * 3 * 18 * laborMultiplier
    const wallMin = retainingWallSqFt * 20 * laborMultiplier
    const wallMax = retainingWallSqFt * 50 * laborMultiplier
    const hardscapeMin = patioMin + walkwayMin + wallMin
    const hardscapeMax = patioMax + walkwayMax + wallMax
    
    // Features (fixed costs, not affected by labor multiplier same way)
    let featuresMin = 0
    let featuresMax = 0
    if (features.firePit) { featuresMin += 500; featuresMax += 3000 }
    if (features.fountain) { featuresMin += 500; featuresMax += 2500 }
    if (features.lighting) { featuresMin += 1500; featuresMax += 5000 }
    if (features.irrigation) { featuresMin += 2500; featuresMax += 5000 }
    if (!detailedIncludeInstall) {
      featuresMin *= 0.5
      featuresMax *= 0.5
    }
    
    const totalMin = Math.round(lawnMin + mulchMin + plantsMin + hardscapeMin + featuresMin)
    const totalMax = Math.round(lawnMax + mulchMax + plantsMax + hardscapeMax + featuresMax)
    
    // Calculate total area for per sq ft
    const totalArea = lawnArea + mulchArea + flowerBedArea + patioArea + (walkwayLength * 3)
    
    return {
      lawn: { min: Math.round(lawnMin), max: Math.round(lawnMax) },
      mulch: { min: Math.round(mulchMin), max: Math.round(mulchMax) },
      plants: { min: Math.round(plantsMin), max: Math.round(plantsMax) },
      hardscape: { min: Math.round(hardscapeMin), max: Math.round(hardscapeMax) },
      features: { min: Math.round(featuresMin), max: Math.round(featuresMax) },
      totalMin,
      totalMax,
      perSqFtMin: totalArea > 0 ? (totalMin / totalArea).toFixed(2) : '0',
      perSqFtMax: totalArea > 0 ? (totalMax / totalArea).toFixed(2) : '0',
      totalArea
    }
  }, [lawnType, lawnArea, mulchType, mulchArea, shrubCount, treeCount, flowerBedArea, patioType, patioArea, walkwayLength, retainingWallSqFt, features, detailedIncludeInstall])

  const toggleFeature = (feature: keyof typeof features) => {
    setFeatures(prev => ({ ...prev, [feature]: !prev[feature] }))
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num)
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Landscaping Cost Calculator</h1>
        <p className="text-gray-600">Estimate your lawn, garden, and outdoor project costs with 2025 pricing data.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calculator */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('quick')}
                className={`flex-1 py-4 text-center font-medium transition-colors ${
                  activeTab === 'quick' 
                    ? 'bg-green-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                🎯 Quick Estimate
              </button>
              <button
                onClick={() => setActiveTab('detailed')}
                className={`flex-1 py-4 text-center font-medium transition-colors ${
                  activeTab === 'detailed' 
                    ? 'bg-green-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                📋 Detailed Calculator
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'quick' ? (
                <div className="space-y-6">
                  {/* Yard Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🏡 Yard Size (sq ft)
                    </label>
                    <input
                      type="number"
                      value={yardSize}
                      onChange={(e) => setYardSize(Number(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg mb-3"
                    />
                    <div className="flex flex-wrap gap-2">
                      {[500, 1000, 2000, 3000, 5000].map(size => (
                        <button
                          key={size}
                          onClick={() => setYardSize(size)}
                          className={`px-4 py-2 rounded-lg border transition-colors ${
                            yardSize === size
                              ? 'bg-green-600 text-white border-green-600'
                              : 'border-gray-300 hover:border-green-500'
                          }`}
                        >
                          {size.toLocaleString()} sq ft
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Project Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📊 Project Level
                    </label>
                    <div className="space-y-2">
                      {(Object.entries(PROJECT_LEVELS) as [ProjectLevel, typeof PROJECT_LEVELS.basic][]).map(([key, level]) => (
                        <button
                          key={key}
                          onClick={() => setProjectLevel(key)}
                          className={`w-full p-4 rounded-lg border text-left transition-colors ${
                            projectLevel === key
                              ? 'bg-green-50 border-green-500 ring-2 ring-green-200'
                              : 'border-gray-200 hover:border-green-300'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-medium">{level.label}</span>
                              <p className="text-sm text-gray-500">{level.desc}</p>
                            </div>
                            <span className="text-green-600 font-medium">
                              ${level.min}-${level.max}/sq ft
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Include Installation */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">🔧 Include Professional Installation</span>
                      <p className="text-sm text-gray-500">Labor typically adds 50-65% to material cost</p>
                    </div>
                    <button
                      onClick={() => setIncludeInstall(!includeInstall)}
                      className={`relative w-14 h-8 rounded-full transition-colors ${
                        includeInstall ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                        includeInstall ? 'translate-x-7' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Lawn */}
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-3">🌱 Lawn</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Type</label>
                        <select
                          value={lawnType}
                          onChange={(e) => setLawnType(e.target.value as LawnType)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="none">None</option>
                          <option value="seed">Grass Seed ($0.10-$0.20/sf)</option>
                          <option value="sod">Sod ($1.00-$2.00/sf)</option>
                          <option value="artificial">Artificial Turf ($8-$18/sf)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Area (sq ft)</label>
                        <input
                          type="number"
                          value={lawnArea}
                          onChange={(e) => setLawnArea(Number(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mulch/Ground Cover */}
                  <div className="p-4 bg-amber-50 rounded-lg">
                    <h3 className="font-semibold text-amber-800 mb-3">🪨 Mulch & Ground Cover</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Type</label>
                        <select
                          value={mulchType}
                          onChange={(e) => setMulchType(e.target.value as MulchType)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="none">None</option>
                          <option value="wood">Wood Mulch ($0.50-$1.00/sf)</option>
                          <option value="rock">Decorative Rock ($1.50-$3.00/sf)</option>
                          <option value="gravel">Gravel ($1.00-$2.00/sf)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Area (sq ft)</label>
                        <input
                          type="number"
                          value={mulchArea}
                          onChange={(e) => setMulchArea(Number(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Plants */}
                  <div className="p-4 bg-pink-50 rounded-lg">
                    <h3 className="font-semibold text-pink-800 mb-3">🌸 Plants</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Shrubs (#)</label>
                        <input
                          type="number"
                          value={shrubCount}
                          onChange={(e) => setShrubCount(Number(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="$25-$100 each"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Trees (#)</label>
                        <input
                          type="number"
                          value={treeCount}
                          onChange={(e) => setTreeCount(Number(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="$150-$500 each"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Flower Beds (sf)</label>
                        <input
                          type="number"
                          value={flowerBedArea}
                          onChange={(e) => setFlowerBedArea(Number(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="$3-$8/sf"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Hardscaping */}
                  <div className="p-4 bg-slate-100 rounded-lg">
                    <h3 className="font-semibold text-slate-800 mb-3">🧱 Hardscaping</h3>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Patio Type</label>
                        <select
                          value={patioType}
                          onChange={(e) => setPatioType(e.target.value as PatioType)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="none">None</option>
                          <option value="concrete">Concrete ($6-$12/sf)</option>
                          <option value="paver">Pavers ($12-$25/sf)</option>
                          <option value="stone">Natural Stone ($20-$35/sf)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Patio Area (sq ft)</label>
                        <input
                          type="number"
                          value={patioArea}
                          onChange={(e) => setPatioArea(Number(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Walkway Length (ft)</label>
                        <input
                          type="number"
                          value={walkwayLength}
                          onChange={(e) => setWalkwayLength(Number(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="3ft wide, $8-$18/sf"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Retaining Wall (sq ft)</label>
                        <input
                          type="number"
                          value={retainingWallSqFt}
                          onChange={(e) => setRetainingWallSqFt(Number(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="$20-$50/sf"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h3 className="font-semibold text-purple-800 mb-3">✨ Special Features</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {(Object.entries(FEATURE_PRICES) as [keyof typeof FEATURE_PRICES, typeof FEATURE_PRICES.firePit][]).map(([key, feature]) => (
                        <button
                          key={key}
                          onClick={() => toggleFeature(key)}
                          className={`p-3 rounded-lg border text-left transition-colors ${
                            features[key]
                              ? 'bg-purple-100 border-purple-500'
                              : 'bg-white border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <div className="font-medium">{feature.label}</div>
                          <div className="text-sm text-gray-500">
                            ${feature.min.toLocaleString()} - ${feature.max.toLocaleString()}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Include Installation */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">🔧 Include Professional Installation</span>
                      <p className="text-sm text-gray-500">Labor typically adds 50-65% to material cost</p>
                    </div>
                    <button
                      onClick={() => setDetailedIncludeInstall(!detailedIncludeInstall)}
                      className={`relative w-14 h-8 rounded-full transition-colors ${
                        detailedIncludeInstall ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                        detailedIncludeInstall ? 'translate-x-7' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {activeTab === 'quick' ? (
            <>
              <div className="bg-green-600 text-white rounded-xl p-6 text-center">
                <p className="text-green-100 mb-1">Total Estimated Cost</p>
                <p className="text-3xl font-bold mb-2">
                  {formatCurrency(quickResults.minCost)} - {formatCurrency(quickResults.maxCost)}
                </p>
                <p className="text-green-100 text-sm">
                  {quickResults.level.label} • {yardSize.toLocaleString()} sq ft
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  📊 Cost Breakdown
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cost Per Sq Ft</span>
                    <span className="font-medium text-green-600">
                      ${quickResults.minPerSqFt} - ${quickResults.maxPerSqFt}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Yard Size</span>
                    <span className="font-medium">{yardSize.toLocaleString()} sq ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Project Level</span>
                    <span className="font-medium">{quickResults.level.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Installation</span>
                    <span className="font-medium">{includeInstall ? 'Included' : 'DIY'}</span>
                  </div>
                </div>
              </div>

              {/* Level Comparison */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">📈 Compare All Levels</h3>
                <div className="space-y-2">
                  {(Object.entries(PROJECT_LEVELS) as [ProjectLevel, typeof PROJECT_LEVELS.basic][]).map(([key, level]) => {
                    const min = Math.round(yardSize * level.min * (includeInstall ? 1 : 0.35))
                    const max = Math.round(yardSize * level.max * (includeInstall ? 1 : 0.35))
                    return (
                      <div
                        key={key}
                        className={`p-3 rounded-lg border ${
                          projectLevel === key ? 'bg-green-50 border-green-500' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{level.label}</span>
                          <span className={projectLevel === key ? 'text-green-600 font-medium' : 'text-gray-600'}>
                            {formatCurrency(min)} - {formatCurrency(max)}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-green-600 text-white rounded-xl p-6 text-center">
                <p className="text-green-100 mb-1">Total Estimated Cost</p>
                <p className="text-3xl font-bold mb-2">
                  {formatCurrency(detailedResults.totalMin)} - {formatCurrency(detailedResults.totalMax)}
                </p>
                <p className="text-green-100 text-sm">
                  {detailedResults.totalArea.toLocaleString()} sq ft total area
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  📊 Cost Breakdown
                </h3>
                <div className="space-y-3">
                  {detailedResults.lawn.max > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">🌱 Lawn</span>
                      <span className="font-medium">
                        {formatCurrency(detailedResults.lawn.min)} - {formatCurrency(detailedResults.lawn.max)}
                      </span>
                    </div>
                  )}
                  {detailedResults.mulch.max > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">🪨 Mulch/Ground</span>
                      <span className="font-medium">
                        {formatCurrency(detailedResults.mulch.min)} - {formatCurrency(detailedResults.mulch.max)}
                      </span>
                    </div>
                  )}
                  {detailedResults.plants.max > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">🌸 Plants</span>
                      <span className="font-medium">
                        {formatCurrency(detailedResults.plants.min)} - {formatCurrency(detailedResults.plants.max)}
                      </span>
                    </div>
                  )}
                  {detailedResults.hardscape.max > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">🧱 Hardscaping</span>
                      <span className="font-medium">
                        {formatCurrency(detailedResults.hardscape.min)} - {formatCurrency(detailedResults.hardscape.max)}
                      </span>
                    </div>
                  )}
                  {detailedResults.features.max > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">✨ Features</span>
                      <span className="font-medium">
                        {formatCurrency(detailedResults.features.min)} - {formatCurrency(detailedResults.features.max)}
                      </span>
                    </div>
                  )}
                  <hr className="my-2" />
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cost Per Sq Ft</span>
                    <span className="font-medium text-green-600">
                      ${detailedResults.perSqFtMin} - ${detailedResults.perSqFtMax}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                  💡 <strong>Pro Tip:</strong> Professional landscaping can increase home value by up to 7%. Focus on curb appeal for front yards.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* How to Use */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">How to Calculate Landscaping Costs</h2>
            <p className="text-gray-600 mb-4">
              Landscaping costs depend on your yard size, project complexity, materials, and whether you hire professionals or DIY. Here's how to estimate your budget:
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800">1. Measure Your Space</h3>
                <p className="text-gray-600 text-sm">Calculate the square footage of each area (lawn, beds, patio). Length × width = square feet.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">2. Determine Project Scope</h3>
                <p className="text-gray-600 text-sm">Basic projects (lawn, mulch) cost $4-6/sq ft. Premium with hardscaping costs $15-25/sq ft.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">3. Factor in Labor</h3>
                <p className="text-gray-600 text-sm">Professional installation typically adds 50-65% to material costs. Labor rates run $50-100/hour.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">4. Add Special Features</h3>
                <p className="text-gray-600 text-sm">Fire pits, water features, and lighting are priced separately ($500-$5,000+ each).</p>
              </div>
            </div>
          </section>

          {/* Cost Factors */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">What Affects Landscaping Costs?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">🏠 Yard Size</h3>
                <p className="text-sm text-gray-600">Larger yards cost more but may have lower per-square-foot rates due to economies of scale.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">🎨 Design Complexity</h3>
                <p className="text-sm text-gray-600">Custom designs, multiple levels, and curved lines increase labor costs significantly.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">📦 Material Quality</h3>
                <p className="text-sm text-gray-600">Premium pavers, natural stone, and mature plants cost 2-3x more than basic options.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">📍 Location</h3>
                <p className="text-sm text-gray-600">Urban areas cost 20-40% more than rural. Local material availability affects pricing.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">🏔️ Site Conditions</h3>
                <p className="text-sm text-gray-600">Slopes, poor drainage, rocky soil, or limited access can add 15-25% to costs.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">📅 Seasonality</h3>
                <p className="text-sm text-gray-600">Spring and fall are peak seasons with higher prices. Off-season may offer discounts.</p>
              </div>
            </div>
          </section>

          {/* Project Examples */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Sample Project Costs (2025)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 font-semibold">Project Type</th>
                    <th className="text-left py-3 font-semibold">Size</th>
                    <th className="text-right py-3 font-semibold">Estimated Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3">Front Yard Refresh</td>
                    <td className="py-3">500 sq ft</td>
                    <td className="py-3 text-right font-medium">$2,000 - $4,500</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">New Lawn (Sod)</td>
                    <td className="py-3">2,000 sq ft</td>
                    <td className="py-3 text-right font-medium">$2,000 - $4,000</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">Basic Backyard</td>
                    <td className="py-3">2,000 sq ft</td>
                    <td className="py-3 text-right font-medium">$8,000 - $12,000</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">Mid-Range Full Yard</td>
                    <td className="py-3">3,000 sq ft</td>
                    <td className="py-3 text-right font-medium">$24,000 - $36,000</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">Paver Patio + Landscaping</td>
                    <td className="py-3">400 sq ft patio</td>
                    <td className="py-3 text-right font-medium">$8,000 - $15,000</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">Premium Outdoor Living</td>
                    <td className="py-3">4,000 sq ft</td>
                    <td className="py-3 text-right font-medium">$60,000 - $100,000+</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Material Costs Reference */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Landscaping Material Costs (Installed)</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">🌱 Lawn Installation</h3>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="p-2 bg-green-50 rounded">
                    <div className="font-medium">Grass Seed</div>
                    <div className="text-gray-600">$0.10 - $0.20/sf</div>
                  </div>
                  <div className="p-2 bg-green-50 rounded">
                    <div className="font-medium">Sod</div>
                    <div className="text-gray-600">$1.00 - $2.00/sf</div>
                  </div>
                  <div className="p-2 bg-green-50 rounded">
                    <div className="font-medium">Artificial Turf</div>
                    <div className="text-gray-600">$8 - $18/sf</div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">🧱 Hardscaping</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2 bg-slate-50 rounded">
                    <div className="font-medium">Concrete Patio</div>
                    <div className="text-gray-600">$6 - $12/sf</div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded">
                    <div className="font-medium">Paver Patio</div>
                    <div className="text-gray-600">$12 - $25/sf</div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded">
                    <div className="font-medium">Walkway</div>
                    <div className="text-gray-600">$8 - $18/sf</div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded">
                    <div className="font-medium">Retaining Wall</div>
                    <div className="text-gray-600">$20 - $50/sf</div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">✨ Special Features</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2 bg-purple-50 rounded">
                    <div className="font-medium">Fire Pit</div>
                    <div className="text-gray-600">$500 - $3,000</div>
                  </div>
                  <div className="p-2 bg-purple-50 rounded">
                    <div className="font-medium">Water Fountain</div>
                    <div className="text-gray-600">$500 - $2,500</div>
                  </div>
                  <div className="p-2 bg-purple-50 rounded">
                    <div className="font-medium">Landscape Lighting</div>
                    <div className="text-gray-600">$1,500 - $5,000</div>
                  </div>
                  <div className="p-2 bg-purple-50 rounded">
                    <div className="font-medium">Irrigation System</div>
                    <div className="text-gray-600">$2,500 - $5,000</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Money Saving Tips */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">💰 Ways to Save on Landscaping</h2>
            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">1.</span>
                <div>
                  <span className="font-medium">Phase your project</span>
                  <span className="text-gray-600"> - Complete high-impact areas first, add features over time.</span>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">2.</span>
                <div>
                  <span className="font-medium">Choose native plants</span>
                  <span className="text-gray-600"> - They're cheaper, require less water, and survive better.</span>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">3.</span>
                <div>
                  <span className="font-medium">DIY soft landscaping</span>
                  <span className="text-gray-600"> - Planting and mulching are beginner-friendly; save hardscaping for pros.</span>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">4.</span>
                <div>
                  <span className="font-medium">Get 3+ quotes</span>
                  <span className="text-gray-600"> - Prices vary 30-50% between contractors for the same work.</span>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">5.</span>
                <div>
                  <span className="font-medium">Schedule off-season</span>
                  <span className="text-gray-600"> - Winter months often bring 10-20% discounts on labor.</span>
                </div>
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800">How much does landscaping cost for a small yard?</h3>
                <p className="text-gray-600 text-sm mt-1">A small yard (500-1,000 sq ft) typically costs $2,000-$6,000 for basic landscaping including lawn, mulch, and plants. Mid-range with a small patio runs $5,000-$12,000.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">What is the most expensive part of landscaping?</h3>
                <p className="text-gray-600 text-sm mt-1">Hardscaping (patios, retaining walls, outdoor kitchens) is typically the most expensive at $20-50+ per square foot. Labor accounts for 40-60% of total project costs.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">How do you price out a landscaping job?</h3>
                <p className="text-gray-600 text-sm mt-1">Calculate square footage for each area, multiply by material costs per sq ft, add labor (typically 50-65% of materials), then add flat-rate features like fire pits or irrigation.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Is sod or seed cheaper?</h3>
                <p className="text-gray-600 text-sm mt-1">Seed is 80-90% cheaper ($0.10-0.20/sf vs $1-2/sf for sod), but takes 2-3 months to establish. Sod provides instant results and is less prone to weeds.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Should I landscape front or back yard first?</h3>
                <p className="text-gray-600 text-sm mt-1">Front yard first if selling soon (curb appeal adds resale value). Backyard first if you want to enjoy the space - you'll use it more daily.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Does landscaping increase home value?</h3>
                <p className="text-gray-600 text-sm mt-1">Yes, professional landscaping can increase home value by 5-12%. Well-maintained landscapes also help homes sell faster. Focus on mature trees and clean hardscaping.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">How much should I budget for landscaping a new home?</h3>
                <p className="text-gray-600 text-sm mt-1">A common rule is 10% of your home's value for full landscaping. For a $400,000 home, budget $40,000. Basic landscaping can be done for $5,000-15,000.</p>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="font-semibold text-green-800 mb-3">📊 Quick Cost Guide</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Basic (lawn, mulch)</span>
                <span className="font-medium">$4-6/sf</span>
              </div>
              <div className="flex justify-between">
                <span>Mid-Range (+ plants)</span>
                <span className="font-medium">$8-12/sf</span>
              </div>
              <div className="flex justify-between">
                <span>Premium (+ patio)</span>
                <span className="font-medium">$15-25/sf</span>
              </div>
              <div className="flex justify-between">
                <span>Full Renovation</span>
                <span className="font-medium">$25-50+/sf</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <h3 className="font-semibold text-amber-800 mb-3">⏱️ Labor Costs</h3>
            <div className="space-y-2 text-sm text-amber-900">
              <p>• Landscaper: $50-100/hour</p>
              <p>• Landscape designer: $100-200/hour</p>
              <p>• Labor = 40-60% of total cost</p>
              <p>• Get 3+ quotes to compare</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-semibold text-blue-800 mb-3">🏡 ROI of Landscaping</h3>
            <div className="space-y-2 text-sm text-blue-900">
              <p>• Adds 5-12% to home value</p>
              <p>• Curb appeal = faster sale</p>
              <p>• Trees can save on AC costs</p>
              <p>• Best ROI: front yard + mature trees</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-3">📋 Before You Start</h3>
            <div className="space-y-2 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>Check property lines</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>Call 811 for utilities</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>Check HOA rules</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>Get permits if needed</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>Test soil quality</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>Plan for drainage</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}