"use client";

import Link from "next/link";
import { calculators } from "@/lib/calculators";

interface RelatedToolsProps {
  currentUrl: string;
  currentCategory: string;
  maxTools?: number;
}

// 工具图标映射（按关键词匹配）
const getToolIcon = (name: string, category: string): string => {
  const nameLower = name.toLowerCase();
  
  // 按工具名称关键词匹配
  if (nameLower.includes("mortgage") || nameLower.includes("loan")) return "🏦";
  if (nameLower.includes("tax") || nameLower.includes("1031") || nameLower.includes("exchange")) return "📋";
  if (nameLower.includes("venmo") || nameLower.includes("fee") || nameLower.includes("payment")) return "💳";
  if (nameLower.includes("stock") || nameLower.includes("investment") || nameLower.includes("option")) return "📈";
  if (nameLower.includes("black scholes") || nameLower.includes("options")) return "📊";
  if (nameLower.includes("gutter") || nameLower.includes("roof")) return "🏠";
  if (nameLower.includes("gravel") || nameLower.includes("driveway") || nameLower.includes("concrete")) return "🛣️";
  if (nameLower.includes("lawn") || nameLower.includes("grass") || nameLower.includes("mowing")) return "🌿";
  if (nameLower.includes("pressure") || nameLower.includes("washing") || nameLower.includes("cleaning")) return "🧹";
  if (nameLower.includes("towing") || nameLower.includes("vehicle") || nameLower.includes("car")) return "🚗";
  if (nameLower.includes("wrap") || nameLower.includes("vinyl")) return "🎨";
  if (nameLower.includes("floor") || nameLower.includes("joist") || nameLower.includes("wood")) return "🪵";
  if (nameLower.includes("insulation") || nameLower.includes("foam") || nameLower.includes("spray")) return "🧱";
  if (nameLower.includes("stone") || nameLower.includes("river") || nameLower.includes("rock")) return "🪨";
  if (nameLower.includes("settlement") || nameLower.includes("legal") || nameLower.includes("termination")) return "⚖️";
  if (nameLower.includes("nvidia") || nameLower.includes("gpu") || nameLower.includes("tech")) return "💻";
  if (nameLower.includes("ifta") || nameLower.includes("fuel") || nameLower.includes("truck")) return "🚛";
  if (nameLower.includes("balloon")) return "🎈";
  if (nameLower.includes("productivity") || nameLower.includes("efficiency")) return "⏱️";
  if (nameLower.includes("wedding") || nameLower.includes("liquor") || nameLower.includes("alcohol") || nameLower.includes("party")) return "🥂";
  if (nameLower.includes("yards") || nameLower.includes("tons") || nameLower.includes("convert")) return "⚖️";
  if (nameLower.includes("quorum") || nameLower.includes("vote") || nameLower.includes("meeting")) return "🗳️";
  if (nameLower.includes("shsat") || nameLower.includes("score") || nameLower.includes("test") || nameLower.includes("exam")) return "📝";
  if (nameLower.includes("bowling") || nameLower.includes("handicap")) return "🎳";
  if (nameLower.includes("golf") || nameLower.includes("club")) return "⛳";
  if (nameLower.includes("rucking") || nameLower.includes("calorie") || nameLower.includes("fitness")) return "🏃";
  if (nameLower.includes("horse") || nameLower.includes("name generator")) return "🐴";
  if (nameLower.includes("alliteration") || nameLower.includes("generator") || nameLower.includes("writing")) return "✍️";
  if (nameLower.includes("phone") || nameLower.includes("extractor") || nameLower.includes("number")) return "📱";
  if (nameLower.includes("calculator")) return "🔢";
  
  // 按类别兜底
  const categoryIcons: Record<string, string> = {
    Finance: "💰",
    Business: "📊",
    Home: "🏠",
    Construction: "🔨",
    Lifestyle: "✨",
    Auto: "🚗",
  };
  
  return categoryIcons[category] || "🔧";
};

export default function RelatedTools({
  currentUrl,
  currentCategory,
  maxTools = 3
}: RelatedToolsProps) {
  // 获取同类别工具（排除当前工具）
  const sameCategoryTools = calculators.filter(
    (tool) => tool.category === currentCategory && tool.url !== currentUrl
  );

  // 获取其他类别工具
  const otherTools = calculators.filter(
    (tool) => tool.category !== currentCategory && tool.url !== currentUrl
  );

  // 基于 URL 生成确定性的偏移量，让不同页面显示不同的相关工具
  const getOffset = (url: string, arrayLength: number): number => {
    let hash = 0;
    for (let i = 0; i < url.length; i++) {
      hash = ((hash << 5) - hash) + url.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash) % Math.max(1, arrayLength);
  };

  const rotateArray = <T,>(arr: T[], offset: number): T[] => {
    if (arr.length === 0) return arr;
    const normalizedOffset = offset % arr.length;
    return [...arr.slice(normalizedOffset), ...arr.slice(0, normalizedOffset)];
  };

  const offset = getOffset(currentUrl, sameCategoryTools.length);
  const rotatedSameCategory = rotateArray(sameCategoryTools, offset);
  const rotatedOther = rotateArray(otherTools, offset);

  // 优先同类别，不够则从其他类别补充
  const relatedTools = [
    ...rotatedSameCategory.slice(0, maxTools),
    ...rotatedOther.slice(0, Math.max(0, maxTools - rotatedSameCategory.length))
  ].slice(0, maxTools);

  if (relatedTools.length === 0) return null;

  return (
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
        {relatedTools.map((tool) => (
          <Link
            key={tool.url}
            href={tool.url}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px",
              borderRadius: "12px",
              border: "1px solid #E5E7EB",
              textDecoration: "none"
            }}
          >
            <span style={{ fontSize: "1.5rem" }}>
              {getToolIcon(tool.name, tool.category)}
            </span>
            <div>
              <p style={{ fontWeight: "500", color: "#111827", marginBottom: "2px" }}>
                {tool.name}
              </p>
              <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                {tool.description.length > 50
                  ? tool.description.substring(0, 50) + "..."
                  : tool.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
