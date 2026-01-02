"use client";

import { useState } from "react";
import Link from "next/link";

// 标准正态分布累积函数 (CDF)
function normalCDF(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return 0.5 * (1.0 + sign * y);
}

// 标准正态分布概率密度函数 (PDF)
function normalPDF(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

// FAQ数据
const faqs = [
  {
    question: "What is the Black-Scholes model used for?",
    answer: "The Black-Scholes model is used to calculate the theoretical fair price of European-style options. It helps traders and investors determine whether an option is overpriced or underpriced in the market, enabling more informed trading decisions."
  },
  {
    question: "What is the difference between Black-Scholes and Binomial model?",
    answer: "The Black-Scholes model uses a continuous-time framework and provides a closed-form solution, making it faster to compute. The Binomial model uses discrete time steps and can handle American options (early exercise). Black-Scholes is generally preferred for European options due to its simplicity and speed."
  },
  {
    question: "Can Black-Scholes be used for American options?",
    answer: "The standard Black-Scholes model is designed for European options, which can only be exercised at expiration. For American options, which allow early exercise, modifications or alternative models like the Binomial model are typically used."
  },
  {
    question: "What does Delta mean in options trading?",
    answer: "Delta measures how much the option price changes for a $1 change in the underlying stock price. A Delta of 0.5 means the option price will increase by $0.50 if the stock price rises by $1. Call options have positive Delta (0 to 1), while put options have negative Delta (-1 to 0)."
  },
  {
    question: "Why is volatility important in Black-Scholes?",
    answer: "Volatility is one of the most critical inputs because it measures the expected price fluctuation of the underlying asset. Higher volatility increases option prices because there's a greater chance the option will end up profitable (in-the-money) at expiration."
  }
];

// FAQ组件
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex justify-between items-center text-left"
      >
        <h3 className="font-semibold text-gray-900 pr-4">{question}</h3>
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${isOpen ? "max-h-96 pb-4" : "max-h-0"}`}>
        <p className="text-gray-600">{answer}</p>
      </div>
    </div>
  );
}

// Greeks 解释数据
const greeksInfo: { [key: string]: { symbol: string; description: string } } = {
  delta: { symbol: "Δ", description: "Price sensitivity to stock movement" },
  gamma: { symbol: "Γ", description: "Rate of change of Delta" },
  theta: { symbol: "Θ", description: "Time decay per day" },
  vega: { symbol: "ν", description: "Sensitivity to volatility" },
  rho: { symbol: "ρ", description: "Sensitivity to interest rate" }
};

export default function BlackScholesCalculator() {
  const [stockPrice, setStockPrice] = useState<string>("");
  const [strikePrice, setStrikePrice] = useState<string>("");
  const [timeValue, setTimeValue] = useState<string>("");
  const [timeUnit, setTimeUnit] = useState<string>("years");
  const [volatility, setVolatility] = useState<string>("");
  const [riskFreeRate, setRiskFreeRate] = useState<string>("");
  const [dividendYield, setDividendYield] = useState<string>("0");

  const [results, setResults] = useState<{
    callPrice: number;
    putPrice: number;
    d1: number;
    d2: number;
    callDelta: number;
    putDelta: number;
    gamma: number;
    callTheta: number;
    putTheta: number;
    vega: number;
    callRho: number;
    putRho: number;
  } | null>(null);

  const calculateBlackScholes = () => {
    const S = parseFloat(stockPrice);
    const K = parseFloat(strikePrice);
    let T = parseFloat(timeValue);
    const v = parseFloat(volatility) / 100;
    const r = parseFloat(riskFreeRate) / 100;
    const q = parseFloat(dividendYield) / 100;

    // 验证输入
    if (isNaN(S) || S <= 0) {
      alert("Please enter a valid stock price");
      return;
    }
    if (isNaN(K) || K <= 0) {
      alert("Please enter a valid strike price");
      return;
    }
    if (isNaN(T) || T <= 0) {
      alert("Please enter a valid time to expiration");
      return;
    }
    if (isNaN(v) || v <= 0) {
      alert("Please enter a valid volatility");
      return;
    }
    if (isNaN(r)) {
      alert("Please enter a valid risk-free rate");
      return;
    }

    // 转换时间为年
    if (timeUnit === "days") {
      T = T / 365;
    } else if (timeUnit === "months") {
      T = T / 12;
    }

    // 计算 d1 和 d2
    const d1 = (Math.log(S / K) + (r - q + (v * v) / 2) * T) / (v * Math.sqrt(T));
    const d2 = d1 - v * Math.sqrt(T);

    // 计算期权价格
    const callPrice = S * Math.exp(-q * T) * normalCDF(d1) - K * Math.exp(-r * T) * normalCDF(d2);
    const putPrice = K * Math.exp(-r * T) * normalCDF(-d2) - S * Math.exp(-q * T) * normalCDF(-d1);

    // 计算 Greeks
    const callDelta = Math.exp(-q * T) * normalCDF(d1);
    const putDelta = Math.exp(-q * T) * (normalCDF(d1) - 1);
    const gamma = (Math.exp(-q * T) * normalPDF(d1)) / (S * v * Math.sqrt(T));
    const callTheta = (-(S * v * Math.exp(-q * T) * normalPDF(d1)) / (2 * Math.sqrt(T)) 
                       - r * K * Math.exp(-r * T) * normalCDF(d2) 
                       + q * S * Math.exp(-q * T) * normalCDF(d1)) / 365;
    const putTheta = (-(S * v * Math.exp(-q * T) * normalPDF(d1)) / (2 * Math.sqrt(T)) 
                      + r * K * Math.exp(-r * T) * normalCDF(-d2) 
                      - q * S * Math.exp(-q * T) * normalCDF(-d1)) / 365;
    const vega = (S * Math.exp(-q * T) * normalPDF(d1) * Math.sqrt(T)) / 100;
    const callRho = (K * T * Math.exp(-r * T) * normalCDF(d2)) / 100;
    const putRho = (-K * T * Math.exp(-r * T) * normalCDF(-d2)) / 100;

    setResults({
      callPrice,
      putPrice,
      d1,
      d2,
      callDelta,
      putDelta,
      gamma,
      callTheta,
      putTheta,
      vega,
      callRho,
      putRho
    });
  };

  const reset = () => {
    setStockPrice("");
    setStrikePrice("");
    setTimeValue("");
    setTimeUnit("years");
    setVolatility("");
    setRiskFreeRate("");
    setDividendYield("0");
    setResults(null);
  };

  const formatNumber = (num: number, decimals: number = 4) => {
    return num.toFixed(decimals);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav className="text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Black-Scholes Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title Section */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#111827", marginBottom: "12px" }}>
            Black-Scholes Calculator
          </h1>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate the fair value of European call and put options using the Black-Scholes pricing model. Get option prices and Greeks (Delta, Gamma, Theta, Vega, Rho) instantly.
          </p>
        </div>

        {/* Calculator Section */}
        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "16px", 
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)", 
          border: "1px solid #E5E7EB",
          padding: "32px",
          marginBottom: "40px"
        }}>
          <div style={{ display: "flex", gap: "48px", flexWrap: "wrap" }}>
            {/* Left: Input Section */}
            <div style={{ flex: "1", minWidth: "300px" }}>
              <h2 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827", marginBottom: "20px" }}>
                Option Parameters
              </h2>
              
              {/* Stock Price */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                  Stock Price (S)
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                  <input
                    type="number"
                    value={stockPrice}
                    onChange={(e) => setStockPrice(e.target.value)}
                    placeholder="100"
                    style={{
                      width: "100%",
                      padding: "10px 12px 10px 28px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      outline: "none"
                    }}
                    min="0"
                    step="any"
                  />
                </div>
              </div>

              {/* Strike Price */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                  Strike Price (K)
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                  <input
                    type="number"
                    value={strikePrice}
                    onChange={(e) => setStrikePrice(e.target.value)}
                    placeholder="100"
                    style={{
                      width: "100%",
                      padding: "10px 12px 10px 28px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      outline: "none"
                    }}
                    min="0"
                    step="any"
                  />
                </div>
              </div>

              {/* Time to Expiration */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                  Time to Expiration (T)
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="number"
                    value={timeValue}
                    onChange={(e) => setTimeValue(e.target.value)}
                    placeholder="1"
                    style={{
                      flex: "1",
                      padding: "10px 12px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      outline: "none"
                    }}
                    min="0"
                    step="any"
                  />
                  <select
                    value={timeUnit}
                    onChange={(e) => setTimeUnit(e.target.value)}
                    style={{
                      padding: "10px 12px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      backgroundColor: "white",
                      cursor: "pointer",
                      minWidth: "100px"
                    }}
                  >
                    <option value="days">Days</option>
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                  </select>
                </div>
              </div>

              {/* Volatility */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                  Volatility (σ)
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="number"
                    value={volatility}
                    onChange={(e) => setVolatility(e.target.value)}
                    placeholder="20"
                    style={{
                      width: "100%",
                      padding: "10px 32px 10px 12px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      outline: "none"
                    }}
                    min="0"
                    step="any"
                  />
                  <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>%</span>
                </div>
              </div>

              {/* Risk-free Rate */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                  Risk-free Interest Rate (r)
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="number"
                    value={riskFreeRate}
                    onChange={(e) => setRiskFreeRate(e.target.value)}
                    placeholder="5"
                    style={{
                      width: "100%",
                      padding: "10px 32px 10px 12px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      outline: "none"
                    }}
                    step="any"
                  />
                  <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>%</span>
                </div>
              </div>

              {/* Dividend Yield */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                  Dividend Yield (q) <span style={{ color: "#9CA3AF", fontWeight: "400" }}>- optional</span>
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="number"
                    value={dividendYield}
                    onChange={(e) => setDividendYield(e.target.value)}
                    placeholder="0"
                    style={{
                      width: "100%",
                      padding: "10px 32px 10px 12px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      outline: "none"
                    }}
                    min="0"
                    step="any"
                  />
                  <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>%</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={calculateBlackScholes}
                  style={{
                    flex: "1",
                    backgroundColor: "#7C3AED",
                    color: "white",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontWeight: "600",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem"
                  }}
                >
                  Calculate
                </button>
                <button
                  onClick={reset}
                  style={{
                    padding: "12px 24px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    fontWeight: "500",
                    color: "#4B5563",
                    backgroundColor: "white",
                    cursor: "pointer"
                  }}
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Right: Result Section */}
            <div className="calc-results" style={{ flex: "1", minWidth: "300px" }}>
              {/* Option Prices */}
              <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                {/* Call Option */}
                <div style={{ 
                  background: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)", 
                  borderRadius: "12px", 
                  padding: "24px",
                  textAlign: "center"
                }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#059669", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                    Call Option
                  </p>
                  <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#059669", lineHeight: "1" }}>
                    {results ? `$${formatNumber(results.callPrice, 2)}` : "—"}
                  </p>
                </div>
                {/* Put Option */}
                <div style={{ 
                  background: "linear-gradient(135deg, #FEF2F2 0%, #FECACA 100%)", 
                  borderRadius: "12px", 
                  padding: "24px",
                  textAlign: "center"
                }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#DC2626", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                    Put Option
                  </p>
                  <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#DC2626", lineHeight: "1" }}>
                    {results ? `$${formatNumber(results.putPrice, 2)}` : "—"}
                  </p>
                </div>
              </div>

              {/* d1 and d2 */}
              {results && (
                <div style={{ 
                  backgroundColor: "#F9FAFB", 
                  borderRadius: "12px", 
                  padding: "16px",
                  marginBottom: "24px"
                }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", marginBottom: "12px" }}>
                    Intermediate Values
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-around" }}>
                    <div style={{ textAlign: "center" }}>
                      <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>d₁</p>
                      <p style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827" }}>{formatNumber(results.d1)}</p>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>d₂</p>
                      <p style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827" }}>{formatNumber(results.d2)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Greeks */}
              <div style={{ 
                backgroundColor: "#F9FAFB", 
                borderRadius: "12px", 
                padding: "16px"
              }}>
                <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", marginBottom: "12px" }}>
                  The Greeks
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {/* Delta */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", backgroundColor: "white", borderRadius: "8px" }}>
                    <div>
                      <span style={{ fontWeight: "600", color: "#7C3AED", marginRight: "8px" }}>Δ Delta</span>
                      <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>{greeksInfo.delta.description}</span>
                    </div>
                    <div style={{ textAlign: "right", fontSize: "0.875rem" }}>
                      {results ? (
                        <>
                          <span style={{ color: "#059669", marginRight: "12px" }}>C: {formatNumber(results.callDelta)}</span>
                          <span style={{ color: "#DC2626" }}>P: {formatNumber(results.putDelta)}</span>
                        </>
                      ) : "—"}
                    </div>
                  </div>
                  {/* Gamma */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", backgroundColor: "white", borderRadius: "8px" }}>
                    <div>
                      <span style={{ fontWeight: "600", color: "#7C3AED", marginRight: "8px" }}>Γ Gamma</span>
                      <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>{greeksInfo.gamma.description}</span>
                    </div>
                    <span style={{ fontWeight: "500", color: "#111827" }}>{results ? formatNumber(results.gamma) : "—"}</span>
                  </div>
                  {/* Theta */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", backgroundColor: "white", borderRadius: "8px" }}>
                    <div>
                      <span style={{ fontWeight: "600", color: "#7C3AED", marginRight: "8px" }}>Θ Theta</span>
                      <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>{greeksInfo.theta.description}</span>
                    </div>
                    <div style={{ textAlign: "right", fontSize: "0.875rem" }}>
                      {results ? (
                        <>
                          <span style={{ color: "#059669", marginRight: "12px" }}>C: {formatNumber(results.callTheta)}</span>
                          <span style={{ color: "#DC2626" }}>P: {formatNumber(results.putTheta)}</span>
                        </>
                      ) : "—"}
                    </div>
                  </div>
                  {/* Vega */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", backgroundColor: "white", borderRadius: "8px" }}>
                    <div>
                      <span style={{ fontWeight: "600", color: "#7C3AED", marginRight: "8px" }}>ν Vega</span>
                      <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>{greeksInfo.vega.description}</span>
                    </div>
                    <span style={{ fontWeight: "500", color: "#111827" }}>{results ? formatNumber(results.vega) : "—"}</span>
                  </div>
                  {/* Rho */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", backgroundColor: "white", borderRadius: "8px" }}>
                    <div>
                      <span style={{ fontWeight: "600", color: "#7C3AED", marginRight: "8px" }}>ρ Rho</span>
                      <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>{greeksInfo.rho.description}</span>
                    </div>
                    <div style={{ textAlign: "right", fontSize: "0.875rem" }}>
                      {results ? (
                        <>
                          <span style={{ color: "#059669", marginRight: "12px" }}>C: {formatNumber(results.callRho)}</span>
                          <span style={{ color: "#DC2626" }}>P: {formatNumber(results.putRho)}</span>
                        </>
                      ) : "—"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section - 两栏布局 */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content - 左侧宽 */}
          <div style={{ flex: "2", minWidth: "400px" }}>
            {/* What is Black-Scholes */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                What is the Black-Scholes Model?
              </h2>
              <p style={{ color: "#4B5563", marginBottom: "16px", lineHeight: "1.7" }}>
                The Black-Scholes model, also known as Black-Scholes-Merton (BSM), is a mathematical model used to calculate the theoretical price of European-style options. Developed by economists Fischer Black and Myron Scholes in 1973, with contributions from Robert Merton, this model revolutionized options trading and earned Scholes and Merton the Nobel Prize in Economics in 1997.
              </p>
              <p style={{ color: "#4B5563", lineHeight: "1.7" }}>
                The model assumes that stock prices follow a lognormal distribution and uses five key inputs: current stock price, strike price, time to expiration, risk-free interest rate, and volatility. It provides a closed-form solution, meaning the option price can be calculated directly without iterative methods.
              </p>
            </div>

            {/* Black-Scholes Formula */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                The Black-Scholes Formula
              </h2>
              <p style={{ color: "#4B5563", marginBottom: "16px", lineHeight: "1.7" }}>
                The Black-Scholes equations for call and put options are:
              </p>
              
              <div style={{ 
                backgroundColor: "#F5F3FF", 
                padding: "20px", 
                borderRadius: "12px", 
                marginBottom: "16px",
                fontFamily: "Georgia, serif",
                fontSize: "1rem",
                lineHeight: "2"
              }}>
                <p style={{ marginBottom: "8px" }}><strong>Call:</strong> C = S₀e<sup>-qT</sup>N(d₁) - Ke<sup>-rT</sup>N(d₂)</p>
                <p style={{ marginBottom: "16px" }}><strong>Put:</strong> P = Ke<sup>-rT</sup>N(-d₂) - S₀e<sup>-qT</sup>N(-d₁)</p>
                <p style={{ marginBottom: "8px", fontSize: "0.9rem" }}>d₁ = [ln(S₀/K) + (r - q + σ²/2)T] / (σ√T)</p>
                <p style={{ fontSize: "0.9rem" }}>d₂ = d₁ - σ√T</p>
              </div>

              <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "#111827", marginBottom: "12px" }}>
                Where:
              </h3>
              <ul style={{ color: "#4B5563", lineHeight: "1.8", paddingLeft: "20px" }}>
                <li><strong>S₀</strong> = Current stock price</li>
                <li><strong>K</strong> = Strike price</li>
                <li><strong>T</strong> = Time to expiration (in years)</li>
                <li><strong>r</strong> = Risk-free interest rate</li>
                <li><strong>σ</strong> = Volatility of the stock</li>
                <li><strong>q</strong> = Dividend yield</li>
                <li><strong>N(x)</strong> = Cumulative standard normal distribution</li>
              </ul>
            </div>

            {/* Understanding the Greeks */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                Understanding the Greeks
              </h2>
              <p style={{ color: "#4B5563", marginBottom: "20px", lineHeight: "1.7" }}>
                The Greeks measure the sensitivity of the option price to various factors. They are essential for risk management and hedging strategies.
              </p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "12px", borderLeft: "4px solid #7C3AED" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "4px" }}>Delta (Δ)</h3>
                  <p style={{ fontSize: "0.875rem", color: "#4B5563" }}>
                    Measures the rate of change of the option price with respect to the underlying asset price. A Delta of 0.5 means the option price moves $0.50 for every $1 move in the stock.
                  </p>
                </div>
                <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "12px", borderLeft: "4px solid #7C3AED" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "4px" }}>Gamma (Γ)</h3>
                  <p style={{ fontSize: "0.875rem", color: "#4B5563" }}>
                    Measures the rate of change of Delta. High Gamma means Delta can change rapidly, which is important for managing delta-neutral positions.
                  </p>
                </div>
                <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "12px", borderLeft: "4px solid #7C3AED" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "4px" }}>Theta (Θ)</h3>
                  <p style={{ fontSize: "0.875rem", color: "#4B5563" }}>
                    Measures time decay — how much value the option loses each day as it approaches expiration. Usually negative for option buyers.
                  </p>
                </div>
                <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "12px", borderLeft: "4px solid #7C3AED" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "4px" }}>Vega (ν)</h3>
                  <p style={{ fontSize: "0.875rem", color: "#4B5563" }}>
                    Measures sensitivity to volatility. A Vega of 0.10 means the option price changes by $0.10 for every 1% change in implied volatility.
                  </p>
                </div>
                <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "12px", borderLeft: "4px solid #7C3AED" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "4px" }}>Rho (ρ)</h3>
                  <p style={{ fontSize: "0.875rem", color: "#4B5563" }}>
                    Measures sensitivity to interest rates. Generally less significant than other Greeks but becomes important for longer-dated options.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - 右侧窄 */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Tips */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "24px",
              marginBottom: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                💡 Quick Tips
              </h3>
              <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
                {[
                  "Higher volatility = higher option prices",
                  "Time decay accelerates near expiration",
                  "At-the-money options have highest Gamma",
                  "Use risk-free rate of same duration as option"
                ].map((tip, index) => (
                  <li key={index} style={{ display: "flex", alignItems: "flex-start", marginBottom: "12px", fontSize: "0.875rem", color: "#4B5563" }}>
                    <span style={{ color: "#7C3AED", marginRight: "8px", fontWeight: "bold" }}>✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Model Assumptions */}
            <div style={{ 
              backgroundColor: "#FEF3C7", 
              borderRadius: "16px", 
              padding: "24px",
              marginBottom: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "12px" }}>
                ⚠️ Model Assumptions
              </h3>
              <ul style={{ listStyle: "none", padding: "0", margin: "0", fontSize: "0.875rem", color: "#92400E" }}>
                <li style={{ marginBottom: "8px" }}>• European options only</li>
                <li style={{ marginBottom: "8px" }}>• Constant volatility</li>
                <li style={{ marginBottom: "8px" }}>• Constant interest rate</li>
                <li style={{ marginBottom: "8px" }}>• No transaction costs</li>
                <li>• Efficient markets</li>
              </ul>
            </div>

            {/* Related Tools */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                Related Tools
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { href: "/quorum-calculator", name: "Quorum Calculator", desc: "Calculate meeting quorum requirements" },
                  { href: "/productivity-calculator", name: "Productivity Calculator", desc: "Measure work efficiency" },
                  { href: "/bowling-handicap-calculator", name: "Bowling Handicap Calculator", desc: "Calculate bowling handicap" }
                ].map((tool, index) => (
                  <Link 
                    key={index}
                    href={tool.href} 
                    style={{ 
                      display: "block",
                      padding: "12px", 
                      borderRadius: "12px", 
                      border: "1px solid #E5E7EB",
                      textDecoration: "none"
                    }}
                  >
                    <p style={{ fontWeight: "500", color: "#111827", marginBottom: "4px" }}>{tool.name}</p>
                    <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>{tool.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "16px", 
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          padding: "32px"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "24px" }}>
            Frequently Asked Questions
          </h2>
          <div>
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
