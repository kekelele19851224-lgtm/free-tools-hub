"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// ============================================
// Chinese Names Database
// ============================================

interface CharacterData {
  char: string;
  pinyin: string;
  meaning: string;
  style: string[];
}

interface SurnameData {
  char: string;
  pinyin: string;
  meaning: string;
  popularity: string;
}

// Common Chinese Surnames (50+)
const surnames: SurnameData[] = [
  { char: "王", pinyin: "Wáng", meaning: "King", popularity: "Most common (#1)" },
  { char: "李", pinyin: "Lǐ", meaning: "Plum tree", popularity: "Very common (#2)" },
  { char: "张", pinyin: "Zhāng", meaning: "To stretch, archer", popularity: "Very common (#3)" },
  { char: "刘", pinyin: "Liú", meaning: "To kill, battle-axe", popularity: "Common (#4)" },
  { char: "陈", pinyin: "Chén", meaning: "Ancient state name", popularity: "Common (#5)" },
  { char: "杨", pinyin: "Yáng", meaning: "Poplar tree", popularity: "Common (#6)" },
  { char: "黄", pinyin: "Huáng", meaning: "Yellow", popularity: "Common (#7)" },
  { char: "赵", pinyin: "Zhào", meaning: "Ancient state name", popularity: "Common (#8)" },
  { char: "周", pinyin: "Zhōu", meaning: "Zhou dynasty", popularity: "Common (#9)" },
  { char: "吴", pinyin: "Wú", meaning: "Ancient state name", popularity: "Common (#10)" },
  { char: "徐", pinyin: "Xú", meaning: "Slow, gentle", popularity: "Common" },
  { char: "孙", pinyin: "Sūn", meaning: "Grandchild", popularity: "Common" },
  { char: "马", pinyin: "Mǎ", meaning: "Horse", popularity: "Common" },
  { char: "朱", pinyin: "Zhū", meaning: "Vermilion red", popularity: "Common" },
  { char: "胡", pinyin: "Hú", meaning: "Barbarian, reckless", popularity: "Common" },
  { char: "郭", pinyin: "Guō", meaning: "Outer city wall", popularity: "Common" },
  { char: "何", pinyin: "Hé", meaning: "What, which", popularity: "Common" },
  { char: "林", pinyin: "Lín", meaning: "Forest", popularity: "Common" },
  { char: "高", pinyin: "Gāo", meaning: "Tall, high", popularity: "Common" },
  { char: "罗", pinyin: "Luó", meaning: "Net, gauze", popularity: "Common" },
  { char: "郑", pinyin: "Zhèng", meaning: "Ancient state name", popularity: "Common" },
  { char: "梁", pinyin: "Liáng", meaning: "Beam, bridge", popularity: "Common" },
  { char: "谢", pinyin: "Xiè", meaning: "To thank", popularity: "Common" },
  { char: "宋", pinyin: "Sòng", meaning: "Song dynasty", popularity: "Common" },
  { char: "唐", pinyin: "Táng", meaning: "Tang dynasty", popularity: "Common" },
  { char: "许", pinyin: "Xǔ", meaning: "To allow, permit", popularity: "Common" },
  { char: "韩", pinyin: "Hán", meaning: "Ancient state name", popularity: "Common" },
  { char: "冯", pinyin: "Féng", meaning: "Gallop", popularity: "Common" },
  { char: "邓", pinyin: "Dèng", meaning: "Ancient state name", popularity: "Common" },
  { char: "曹", pinyin: "Cáo", meaning: "Group, class", popularity: "Common" },
  { char: "彭", pinyin: "Péng", meaning: "Name of ancient state", popularity: "Common" },
  { char: "曾", pinyin: "Zēng", meaning: "Great-great-grandparent", popularity: "Common" },
  { char: "肖", pinyin: "Xiāo", meaning: "Similar, resemble", popularity: "Common" },
  { char: "田", pinyin: "Tián", meaning: "Field", popularity: "Common" },
  { char: "董", pinyin: "Dǒng", meaning: "To supervise", popularity: "Common" },
  { char: "潘", pinyin: "Pān", meaning: "Water in which rice was washed", popularity: "Common" },
  { char: "袁", pinyin: "Yuán", meaning: "Long robe", popularity: "Common" },
  { char: "蔡", pinyin: "Cài", meaning: "Grass, wild", popularity: "Common" },
  { char: "蒋", pinyin: "Jiǎng", meaning: "A kind of grass", popularity: "Common" },
  { char: "余", pinyin: "Yú", meaning: "Surplus, remaining", popularity: "Common" },
  { char: "于", pinyin: "Yú", meaning: "At, in", popularity: "Common" },
  { char: "杜", pinyin: "Dù", meaning: "Birch-leaf pear tree", popularity: "Common" },
  { char: "叶", pinyin: "Yè", meaning: "Leaf", popularity: "Common" },
  { char: "程", pinyin: "Chéng", meaning: "Journey, procedure", popularity: "Common" },
  { char: "魏", pinyin: "Wèi", meaning: "Ancient state name", popularity: "Common" },
  { char: "苏", pinyin: "Sū", meaning: "Revive", popularity: "Common" },
  { char: "吕", pinyin: "Lǚ", meaning: "Spine, backbone", popularity: "Common" },
  { char: "丁", pinyin: "Dīng", meaning: "Male adult", popularity: "Common" },
  { char: "任", pinyin: "Rèn", meaning: "To appoint", popularity: "Common" },
  { char: "沈", pinyin: "Shěn", meaning: "To sink", popularity: "Common" },
  { char: "姚", pinyin: "Yáo", meaning: "Handsome", popularity: "Common" },
  { char: "卢", pinyin: "Lú", meaning: "Black, stupid", popularity: "Common" },
  { char: "傅", pinyin: "Fù", meaning: "Teacher, tutor", popularity: "Common" },
  { char: "钟", pinyin: "Zhōng", meaning: "Bell, clock", popularity: "Common" },
  { char: "姜", pinyin: "Jiāng", meaning: "Ginger", popularity: "Common" }
];

// Male Given Name Characters (100+)
const maleCharacters: CharacterData[] = [
  // Strength & Power
  { char: "强", pinyin: "Qiáng", meaning: "Strong, powerful", style: ["traditional", "warrior"] },
  { char: "伟", pinyin: "Wěi", meaning: "Great, mighty", style: ["traditional"] },
  { char: "勇", pinyin: "Yǒng", meaning: "Brave, courageous", style: ["warrior", "traditional"] },
  { char: "刚", pinyin: "Gāng", meaning: "Hard, firm, strong", style: ["warrior"] },
  { char: "威", pinyin: "Wēi", meaning: "Power, might", style: ["warrior"] },
  { char: "雄", pinyin: "Xióng", meaning: "Male, heroic", style: ["warrior", "ancient"] },
  { char: "毅", pinyin: "Yì", meaning: "Perseverance, firm", style: ["traditional"] },
  { char: "健", pinyin: "Jiàn", meaning: "Healthy, strong", style: ["traditional", "modern"] },
  { char: "力", pinyin: "Lì", meaning: "Power, strength", style: ["warrior"] },
  { char: "豪", pinyin: "Háo", meaning: "Grand, heroic", style: ["warrior", "ancient"] },
  
  // Wisdom & Intelligence
  { char: "明", pinyin: "Míng", meaning: "Bright, brilliant", style: ["traditional", "poetic"] },
  { char: "智", pinyin: "Zhì", meaning: "Wisdom, intelligent", style: ["traditional"] },
  { char: "文", pinyin: "Wén", meaning: "Literature, culture", style: ["traditional", "poetic"] },
  { char: "博", pinyin: "Bó", meaning: "Abundant, learned", style: ["traditional"] },
  { char: "学", pinyin: "Xué", meaning: "Learn, study", style: ["traditional"] },
  { char: "思", pinyin: "Sī", meaning: "Think, consider", style: ["poetic"] },
  { char: "哲", pinyin: "Zhé", meaning: "Philosophy, wise", style: ["traditional"] },
  { char: "聪", pinyin: "Cōng", meaning: "Clever, intelligent", style: ["traditional"] },
  { char: "睿", pinyin: "Ruì", meaning: "Wise, astute", style: ["modern", "traditional"] },
  { char: "达", pinyin: "Dá", meaning: "Reach, understand", style: ["traditional"] },
  
  // Nature & Elements
  { char: "龙", pinyin: "Lóng", meaning: "Dragon", style: ["warrior", "ancient", "five_elements"] },
  { char: "虎", pinyin: "Hǔ", meaning: "Tiger", style: ["warrior", "ancient"] },
  { char: "鹏", pinyin: "Péng", meaning: "Mythical giant bird", style: ["ancient", "poetic"] },
  { char: "飞", pinyin: "Fēi", meaning: "Fly, soar", style: ["poetic", "warrior"] },
  { char: "云", pinyin: "Yún", meaning: "Cloud", style: ["poetic", "ancient"] },
  { char: "风", pinyin: "Fēng", meaning: "Wind", style: ["poetic", "ancient"] },
  { char: "雷", pinyin: "Léi", meaning: "Thunder", style: ["warrior", "ancient"] },
  { char: "海", pinyin: "Hǎi", meaning: "Sea, ocean", style: ["traditional", "poetic"] },
  { char: "山", pinyin: "Shān", meaning: "Mountain", style: ["traditional", "ancient"] },
  { char: "林", pinyin: "Lín", meaning: "Forest", style: ["poetic"] },
  { char: "川", pinyin: "Chuān", meaning: "River, stream", style: ["poetic"] },
  { char: "岩", pinyin: "Yán", meaning: "Rock, cliff", style: ["warrior"] },
  { char: "峰", pinyin: "Fēng", meaning: "Peak, summit", style: ["traditional", "warrior"] },
  
  // Virtue & Character
  { char: "德", pinyin: "Dé", meaning: "Virtue, morality", style: ["traditional"] },
  { char: "仁", pinyin: "Rén", meaning: "Benevolence, kindness", style: ["traditional", "ancient"] },
  { char: "义", pinyin: "Yì", meaning: "Righteousness", style: ["traditional", "warrior"] },
  { char: "信", pinyin: "Xìn", meaning: "Trust, believe", style: ["traditional"] },
  { char: "忠", pinyin: "Zhōng", meaning: "Loyalty", style: ["traditional", "warrior"] },
  { char: "诚", pinyin: "Chéng", meaning: "Sincere, honest", style: ["traditional"] },
  { char: "礼", pinyin: "Lǐ", meaning: "Courtesy, ritual", style: ["traditional"] },
  
  // Success & Prosperity
  { char: "成", pinyin: "Chéng", meaning: "Accomplish, succeed", style: ["traditional"] },
  { char: "志", pinyin: "Zhì", meaning: "Ambition, will", style: ["traditional"] },
  { char: "杰", pinyin: "Jié", meaning: "Outstanding, hero", style: ["traditional", "warrior"] },
  { char: "俊", pinyin: "Jùn", meaning: "Handsome, talented", style: ["traditional", "modern"] },
  { char: "远", pinyin: "Yuǎn", meaning: "Far, distant", style: ["poetic"] },
  { char: "宏", pinyin: "Hóng", meaning: "Grand, great", style: ["traditional"] },
  { char: "兴", pinyin: "Xīng", meaning: "Prosper, flourish", style: ["traditional"] },
  { char: "旺", pinyin: "Wàng", meaning: "Prosperous", style: ["traditional"] },
  { char: "贵", pinyin: "Guì", meaning: "Noble, precious", style: ["traditional"] },
  { char: "荣", pinyin: "Róng", meaning: "Glory, honor", style: ["traditional"] },
  
  // Modern Popular
  { char: "轩", pinyin: "Xuān", meaning: "High, lofty", style: ["modern", "poetic"] },
  { char: "宇", pinyin: "Yǔ", meaning: "Universe, space", style: ["modern"] },
  { char: "辰", pinyin: "Chén", meaning: "Stars, celestial", style: ["modern", "poetic"] },
  { char: "浩", pinyin: "Hào", meaning: "Vast, grand", style: ["modern", "traditional"] },
  { char: "涵", pinyin: "Hán", meaning: "Contain, include", style: ["modern"] },
  { char: "晨", pinyin: "Chén", meaning: "Morning", style: ["modern"] },
  { char: "泽", pinyin: "Zé", meaning: "Marsh, grace", style: ["modern"] },
  { char: "瑞", pinyin: "Ruì", meaning: "Auspicious", style: ["modern", "traditional"] },
  { char: "嘉", pinyin: "Jiā", meaning: "Excellent, good", style: ["modern", "traditional"] },
  { char: "昊", pinyin: "Hào", meaning: "Vast sky", style: ["modern"] },
  
  // Five Elements
  { char: "金", pinyin: "Jīn", meaning: "Gold, metal", style: ["five_elements"] },
  { char: "木", pinyin: "Mù", meaning: "Wood, tree", style: ["five_elements"] },
  { char: "水", pinyin: "Shuǐ", meaning: "Water", style: ["five_elements"] },
  { char: "火", pinyin: "Huǒ", meaning: "Fire", style: ["five_elements"] },
  { char: "土", pinyin: "Tǔ", meaning: "Earth, soil", style: ["five_elements"] },
  { char: "森", pinyin: "Sēn", meaning: "Forest (wood element)", style: ["five_elements", "poetic"] },
  { char: "淼", pinyin: "Miǎo", meaning: "Vast water", style: ["five_elements"] },
  { char: "焱", pinyin: "Yàn", meaning: "Flames", style: ["five_elements", "warrior"] },
  { char: "鑫", pinyin: "Xīn", meaning: "Prosperous (3 gold)", style: ["five_elements", "modern"] },
  { char: "磊", pinyin: "Lěi", meaning: "Pile of stones", style: ["five_elements"] },
  
  // Ancient/Warrior
  { char: "剑", pinyin: "Jiàn", meaning: "Sword", style: ["warrior", "ancient"] },
  { char: "侠", pinyin: "Xiá", meaning: "Knight-errant, hero", style: ["warrior", "ancient"] },
  { char: "武", pinyin: "Wǔ", meaning: "Martial, military", style: ["warrior"] },
  { char: "战", pinyin: "Zhàn", meaning: "War, battle", style: ["warrior"] },
  { char: "霸", pinyin: "Bà", meaning: "Tyrant, hegemon", style: ["warrior", "ancient"] },
  { char: "天", pinyin: "Tiān", meaning: "Heaven, sky", style: ["ancient", "poetic"] },
  { char: "玄", pinyin: "Xuán", meaning: "Mysterious, dark", style: ["ancient", "poetic"] },
  { char: "君", pinyin: "Jūn", meaning: "Ruler, gentleman", style: ["ancient", "traditional"] },
  { char: "霖", pinyin: "Lín", meaning: "Long rain", style: ["ancient", "poetic"] },
  { char: "墨", pinyin: "Mò", meaning: "Ink", style: ["ancient", "poetic"] }
];

// Female Given Name Characters (100+)
const femaleCharacters: CharacterData[] = [
  // Beauty & Elegance
  { char: "美", pinyin: "Měi", meaning: "Beautiful", style: ["traditional"] },
  { char: "丽", pinyin: "Lì", meaning: "Beautiful, elegant", style: ["traditional"] },
  { char: "婷", pinyin: "Tíng", meaning: "Graceful, slim", style: ["modern", "traditional"] },
  { char: "娜", pinyin: "Nà", meaning: "Graceful", style: ["modern"] },
  { char: "媛", pinyin: "Yuàn", meaning: "Beautiful, graceful lady", style: ["traditional"] },
  { char: "姿", pinyin: "Zī", meaning: "Appearance, posture", style: ["traditional"] },
  { char: "妍", pinyin: "Yán", meaning: "Beautiful, gorgeous", style: ["modern", "poetic"] },
  { char: "颖", pinyin: "Yǐng", meaning: "Clever, outstanding", style: ["modern"] },
  { char: "靓", pinyin: "Liàng", meaning: "Pretty, attractive", style: ["modern"] },
  { char: "婉", pinyin: "Wǎn", meaning: "Graceful, tactful", style: ["traditional", "poetic"] },
  
  // Flowers & Nature
  { char: "花", pinyin: "Huā", meaning: "Flower", style: ["traditional", "poetic"] },
  { char: "兰", pinyin: "Lán", meaning: "Orchid", style: ["traditional", "poetic"] },
  { char: "梅", pinyin: "Méi", meaning: "Plum blossom", style: ["traditional", "poetic"] },
  { char: "莲", pinyin: "Lián", meaning: "Lotus", style: ["poetic", "ancient"] },
  { char: "菊", pinyin: "Jú", meaning: "Chrysanthemum", style: ["traditional", "poetic"] },
  { char: "荷", pinyin: "Hé", meaning: "Lotus", style: ["poetic"] },
  { char: "桃", pinyin: "Táo", meaning: "Peach", style: ["poetic"] },
  { char: "芳", pinyin: "Fāng", meaning: "Fragrant", style: ["traditional"] },
  { char: "芬", pinyin: "Fēn", meaning: "Sweet smell, fragrance", style: ["traditional"] },
  { char: "蓉", pinyin: "Róng", meaning: "Hibiscus, lotus", style: ["traditional", "poetic"] },
  { char: "薇", pinyin: "Wēi", meaning: "Fern", style: ["modern", "poetic"] },
  { char: "萱", pinyin: "Xuān", meaning: "Day lily", style: ["modern"] },
  { char: "茉", pinyin: "Mò", meaning: "Jasmine", style: ["modern"] },
  { char: "莉", pinyin: "Lì", meaning: "Jasmine", style: ["modern"] },
  { char: "蕾", pinyin: "Lěi", meaning: "Flower bud", style: ["modern"] },
  
  // Jade & Precious
  { char: "玉", pinyin: "Yù", meaning: "Jade", style: ["traditional", "ancient"] },
  { char: "珍", pinyin: "Zhēn", meaning: "Precious, treasure", style: ["traditional"] },
  { char: "琳", pinyin: "Lín", meaning: "Beautiful jade", style: ["modern", "traditional"] },
  { char: "瑶", pinyin: "Yáo", meaning: "Precious jade", style: ["traditional", "poetic"] },
  { char: "珠", pinyin: "Zhū", meaning: "Pearl", style: ["traditional"] },
  { char: "琪", pinyin: "Qí", meaning: "Fine jade", style: ["modern"] },
  { char: "瑾", pinyin: "Jǐn", meaning: "Jade-like stone", style: ["traditional", "ancient"] },
  { char: "璇", pinyin: "Xuán", meaning: "Beautiful jade", style: ["ancient", "poetic"] },
  { char: "珊", pinyin: "Shān", meaning: "Coral", style: ["traditional"] },
  { char: "瑛", pinyin: "Yīng", meaning: "Luster of gems", style: ["traditional"] },
  
  // Virtue & Character
  { char: "淑", pinyin: "Shū", meaning: "Gentle, virtuous", style: ["traditional"] },
  { char: "慧", pinyin: "Huì", meaning: "Wise, intelligent", style: ["traditional"] },
  { char: "贤", pinyin: "Xián", meaning: "Virtuous, worthy", style: ["traditional"] },
  { char: "静", pinyin: "Jìng", meaning: "Quiet, calm", style: ["traditional"] },
  { char: "雅", pinyin: "Yǎ", meaning: "Elegant, refined", style: ["traditional", "poetic"] },
  { char: "敏", pinyin: "Mǐn", meaning: "Quick, clever", style: ["traditional"] },
  { char: "洁", pinyin: "Jié", meaning: "Clean, pure", style: ["traditional"] },
  { char: "端", pinyin: "Duān", meaning: "Proper, upright", style: ["traditional"] },
  { char: "柔", pinyin: "Róu", meaning: "Soft, gentle", style: ["traditional", "poetic"] },
  { char: "惠", pinyin: "Huì", meaning: "Kind, gracious", style: ["traditional"] },
  
  // Celestial & Poetic
  { char: "月", pinyin: "Yuè", meaning: "Moon", style: ["poetic", "ancient"] },
  { char: "雪", pinyin: "Xuě", meaning: "Snow", style: ["poetic"] },
  { char: "霜", pinyin: "Shuāng", meaning: "Frost", style: ["poetic", "ancient"] },
  { char: "云", pinyin: "Yún", meaning: "Cloud", style: ["poetic"] },
  { char: "露", pinyin: "Lù", meaning: "Dew", style: ["poetic"] },
  { char: "雨", pinyin: "Yǔ", meaning: "Rain", style: ["poetic", "modern"] },
  { char: "霞", pinyin: "Xiá", meaning: "Rosy clouds", style: ["poetic"] },
  { char: "晴", pinyin: "Qíng", meaning: "Clear, sunny", style: ["modern"] },
  { char: "星", pinyin: "Xīng", meaning: "Star", style: ["modern", "poetic"] },
  { char: "梦", pinyin: "Mèng", meaning: "Dream", style: ["modern", "poetic"] },
  { char: "诗", pinyin: "Shī", meaning: "Poetry", style: ["poetic"] },
  { char: "韵", pinyin: "Yùn", meaning: "Rhyme, charm", style: ["poetic"] },
  
  // Modern Popular
  { char: "欣", pinyin: "Xīn", meaning: "Happy, joyful", style: ["modern"] },
  { char: "怡", pinyin: "Yí", meaning: "Happy, pleased", style: ["modern"] },
  { char: "悦", pinyin: "Yuè", meaning: "Happy, pleased", style: ["modern"] },
  { char: "涵", pinyin: "Hán", meaning: "Contain, include", style: ["modern"] },
  { char: "雯", pinyin: "Wén", meaning: "Clouds, patterns", style: ["modern"] },
  { char: "琦", pinyin: "Qí", meaning: "Extraordinary jade", style: ["modern"] },
  { char: "佳", pinyin: "Jiā", meaning: "Good, beautiful", style: ["modern", "traditional"] },
  { char: "倩", pinyin: "Qiàn", meaning: "Pretty, attractive", style: ["modern"] },
  { char: "诺", pinyin: "Nuò", meaning: "Promise", style: ["modern"] },
  { char: "彤", pinyin: "Tóng", meaning: "Red, vermilion", style: ["modern"] },
  { char: "熙", pinyin: "Xī", meaning: "Bright, prosperous", style: ["modern"] },
  
  // Ancient/Classical
  { char: "妃", pinyin: "Fēi", meaning: "Imperial concubine", style: ["ancient"] },
  { char: "凤", pinyin: "Fèng", meaning: "Phoenix", style: ["ancient", "traditional"] },
  { char: "燕", pinyin: "Yàn", meaning: "Swallow (bird)", style: ["traditional"] },
  { char: "黛", pinyin: "Dài", meaning: "Black eyebrow color", style: ["ancient", "poetic"] },
  { char: "嫣", pinyin: "Yān", meaning: "Captivating, beautiful", style: ["ancient", "poetic"] },
  { char: "绮", pinyin: "Qǐ", meaning: "Beautiful, fine silk", style: ["ancient", "poetic"] },
  { char: "姝", pinyin: "Shū", meaning: "Beautiful woman", style: ["ancient"] },
  { char: "瑜", pinyin: "Yú", meaning: "Fine jade, virtue", style: ["ancient", "traditional"] },
  
  // Five Elements
  { char: "金", pinyin: "Jīn", meaning: "Gold, metal", style: ["five_elements"] },
  { char: "淼", pinyin: "Miǎo", meaning: "Vast water", style: ["five_elements", "poetic"] },
  { char: "森", pinyin: "Sēn", meaning: "Forest (wood)", style: ["five_elements"] },
  { char: "焱", pinyin: "Yàn", meaning: "Flames (fire)", style: ["five_elements"] },
  { char: "垚", pinyin: "Yáo", meaning: "Mountain (earth)", style: ["five_elements"] }
];

// FAQ data
const faqs = [
  {
    question: "How do Chinese names work?",
    answer: "Chinese names consist of a surname (family name) followed by a given name. The surname is typically one character (sometimes two), while the given name is one or two characters. Unlike Western names, the surname comes FIRST. For example, in '王明远' (Wáng Míngyuǎn), '王' is the surname and '明远' is the given name."
  },
  {
    question: "What are the most common Chinese surnames?",
    answer: "The most common Chinese surnames are Wang (王), Li (李), Zhang (张), Liu (刘), and Chen (陈). These five surnames alone account for over 30% of the Chinese population. The saying '百家姓' (Hundred Family Surnames) refers to a classic Chinese text listing common surnames."
  },
  {
    question: "What do Chinese names mean?",
    answer: "Chinese names carry deep meanings. Each character is carefully chosen to express hopes, virtues, or qualities parents wish for their child. For example, '明' (míng) means bright/brilliant, '慧' (huì) means wise, '强' (qiáng) means strong, and '美' (měi) means beautiful. Names often combine characters for layered meanings."
  },
  {
    question: "What are Five Elements (五行) names?",
    answer: "The Five Elements (五行, Wǔ Xíng) - Wood (木), Fire (火), Earth (土), Metal (金), and Water (水) - are fundamental concepts in Chinese philosophy. Some parents choose name characters based on which element their child needs according to their birth date/time. Characters containing these elements' radicals are believed to bring balance."
  },
  {
    question: "How to choose a good Chinese name?",
    answer: "A good Chinese name should: 1) Have positive, auspicious meanings, 2) Sound pleasant when spoken, 3) Look balanced when written, 4) Avoid unfortunate homophones, and 5) Complement the surname. Many also consider the stroke count of characters and Five Elements compatibility."
  },
  {
    question: "Can I use these names for characters in stories or games?",
    answer: "Absolutely! These names are perfect for fiction writing, game characters, RPG characters, or any creative project. The names are authentic Chinese names with real meanings. Just be respectful of the cultural significance when using them."
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

// Helper functions
function getRandomItems<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface GeneratedName {
  fullChinese: string;
  fullPinyin: string;
  surname: SurnameData;
  givenChars: CharacterData[];
  fullMeaning: string;
}

export default function ChineseNameGenerator() {
  const [gender, setGender] = useState("male");
  const [nameStyle, setNameStyle] = useState("all");
  const [includeSurname, setIncludeSurname] = useState(true);
  const [nameLength, setNameLength] = useState(2); // 1 or 2 characters for given name
  const [count, setCount] = useState(10);
  const [generatedNames, setGeneratedNames] = useState<GeneratedName[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Style labels
  const styleLabels: { [key: string]: { label: string; labelCn: string; emoji: string; desc: string } } = {
    all: { label: "All Styles", labelCn: "全部", emoji: "🎲", desc: "Mix of all name styles" },
    traditional: { label: "Traditional", labelCn: "传统", emoji: "📜", desc: "Classic and timeless names" },
    modern: { label: "Modern", labelCn: "现代", emoji: "✨", desc: "Popular contemporary names" },
    ancient: { label: "Ancient/Warrior", labelCn: "古风", emoji: "⚔️", desc: "Historical and martial names" },
    poetic: { label: "Poetic", labelCn: "诗意", emoji: "🌸", desc: "Literary and artistic names" },
    five_elements: { label: "Five Elements", labelCn: "五行", emoji: "☯️", desc: "Based on 金木水火土" }
  };

  // Generate function
  const generateNames = () => {
    const results: GeneratedName[] = [];
    
    // Get character pool based on gender
    let charPool: CharacterData[] = [];
    if (gender === "male") {
      charPool = [...maleCharacters];
    } else if (gender === "female") {
      charPool = [...femaleCharacters];
    } else {
      charPool = [...maleCharacters, ...femaleCharacters];
    }

    // Filter by style if not "all"
    if (nameStyle !== "all") {
      charPool = charPool.filter(c => c.style.includes(nameStyle));
    }

    // Generate names
    for (let i = 0; i < count; i++) {
      const surname = getRandomItem(surnames);
      const givenChars: CharacterData[] = [];
      
      // Get given name characters (1 or 2)
      const selectedChars = getRandomItems(charPool, nameLength);
      givenChars.push(...selectedChars);

      // Build full name
      let fullChinese = "";
      let fullPinyin = "";
      let fullMeaning = "";

      if (includeSurname) {
        fullChinese = surname.char + givenChars.map(c => c.char).join("");
        fullPinyin = surname.pinyin + " " + givenChars.map(c => c.pinyin).join("");
        fullMeaning = givenChars.map(c => c.meaning).join(" + ");
      } else {
        fullChinese = givenChars.map(c => c.char).join("");
        fullPinyin = givenChars.map(c => c.pinyin).join("");
        fullMeaning = givenChars.map(c => c.meaning).join(" + ");
      }

      results.push({
        fullChinese,
        fullPinyin,
        surname,
        givenChars,
        fullMeaning
      });
    }

    setGeneratedNames(results);
    setCopiedIndex(null);
  };

  // Copy function
  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Copy all function
  const copyAllNames = async () => {
    const allNames = generatedNames.map(n => `${n.fullChinese} (${n.fullPinyin})`).join("\n");
    try {
      await navigator.clipboard.writeText(allNames);
      setCopiedIndex(-1);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FEF2F2" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #FECACA" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Chinese Name Generator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "2.5rem" }}>🏮</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Chinese Name Generator
            </h1>
            <span style={{ fontSize: "1.5rem", color: "#DC2626" }}>中文名字生成器</span>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Generate authentic Chinese names with characters (汉字), pinyin, and meanings. 
            Perfect for stories, games, or finding your Chinese name.
          </p>
        </div>

        {/* Info Box */}
        <div style={{
          backgroundColor: "#DC2626",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>📖</span>
            <div>
              <p style={{ fontWeight: "600", color: "white", margin: "0 0 4px 0" }}>
                <strong>Chinese Name Order</strong>
              </p>
              <p style={{ color: "#FEE2E2", margin: 0, fontSize: "0.95rem" }}>
                Chinese names are written as: <strong>Surname + Given Name</strong>. For example: 王明远 (Wáng Míngyuǎn) = Surname &quot;Wang&quot; + Given Name &quot;Mingyuan&quot;
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
            border: "1px solid #FECACA",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#DC2626", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                ⚙️ Name Settings 设置
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              {/* Gender */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                  👤 Gender 性别
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[
                    { value: "male", label: "Male", labelCn: "男" },
                    { value: "female", label: "Female", labelCn: "女" },
                    { value: "any", label: "Any", labelCn: "不限" }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setGender(option.value)}
                      style={{
                        padding: "12px 16px",
                        borderRadius: "8px",
                        border: gender === option.value ? "2px solid #DC2626" : "1px solid #E5E7EB",
                        backgroundColor: gender === option.value ? "#FEE2E2" : "white",
                        color: gender === option.value ? "#DC2626" : "#374151",
                        cursor: "pointer",
                        flex: 1,
                        fontSize: "0.9rem",
                        fontWeight: gender === option.value ? "600" : "400"
                      }}
                    >
                      {option.label} {option.labelCn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Style */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                  🎨 Name Style 风格
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                  {Object.entries(styleLabels).map(([key, { label, labelCn, emoji }]) => (
                    <button
                      key={key}
                      onClick={() => setNameStyle(key)}
                      style={{
                        padding: "10px 12px",
                        borderRadius: "8px",
                        border: nameStyle === key ? "2px solid #DC2626" : "1px solid #E5E7EB",
                        backgroundColor: nameStyle === key ? "#FEE2E2" : "white",
                        color: nameStyle === key ? "#DC2626" : "#374151",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        fontWeight: nameStyle === key ? "600" : "400",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px"
                      }}
                    >
                      <span>{emoji}</span>
                      <span>{label}</span>
                      <span style={{ color: "#9CA3AF" }}>{labelCn}</span>
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: "8px 0 0 0" }}>
                  {styleLabels[nameStyle]?.desc}
                </p>
              </div>

              {/* Name Length */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                  📏 Given Name Length 名字长度
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[
                    { value: 1, label: "1 Character", labelCn: "单字" },
                    { value: 2, label: "2 Characters", labelCn: "双字" }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setNameLength(option.value)}
                      style={{
                        padding: "12px 16px",
                        borderRadius: "8px",
                        border: nameLength === option.value ? "2px solid #DC2626" : "1px solid #E5E7EB",
                        backgroundColor: nameLength === option.value ? "#FEE2E2" : "white",
                        color: nameLength === option.value ? "#DC2626" : "#374151",
                        cursor: "pointer",
                        flex: 1,
                        fontSize: "0.9rem",
                        fontWeight: nameLength === option.value ? "600" : "400"
                      }}
                    >
                      {option.label} {option.labelCn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Include Surname */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={includeSurname}
                    onChange={(e) => setIncludeSurname(e.target.checked)}
                    style={{ width: "18px", height: "18px", accentColor: "#DC2626" }}
                  />
                  <span style={{ fontSize: "0.9rem", color: "#374151", fontWeight: "600" }}>Include Surname 包含姓氏</span>
                </label>
              </div>

              {/* Count */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                  📊 Number of Names 生成数量
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[5, 10, 15, 20].map((num) => (
                    <button
                      key={num}
                      onClick={() => setCount(num)}
                      style={{
                        padding: "10px 16px",
                        borderRadius: "8px",
                        border: count === num ? "2px solid #DC2626" : "1px solid #E5E7EB",
                        backgroundColor: count === num ? "#FEE2E2" : "white",
                        color: count === num ? "#DC2626" : "#374151",
                        cursor: "pointer",
                        flex: 1,
                        fontSize: "0.9rem",
                        fontWeight: count === num ? "600" : "400"
                      }}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateNames}
                style={{
                  width: "100%",
                  padding: "16px",
                  backgroundColor: "#DC2626",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                🏮 Generate Names 生成名字
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="calc-results" style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #FECACA",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#B91C1C", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                📜 Generated Names 生成结果
              </h2>
              {generatedNames.length > 0 && (
                <button
                  onClick={copyAllNames}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: copiedIndex === -1 ? "#10B981" : "#991B1B",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "0.8rem",
                    cursor: "pointer"
                  }}
                >
                  {copiedIndex === -1 ? "✓ Copied!" : "📋 Copy All"}
                </button>
              )}
            </div>

            <div style={{ padding: "24px", maxHeight: "600px", overflowY: "auto" }}>
              {generatedNames.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#6B7280" }}>
                  <p style={{ fontSize: "3rem", margin: "0 0 12px 0" }}>🏮</p>
                  <p style={{ margin: 0 }}>Choose your settings and click Generate</p>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem" }}>选择设置后点击生成按钮</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {generatedNames.map((name, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "14px 16px",
                        backgroundColor: "#FEF2F2",
                        borderRadius: "10px",
                        border: "1px solid #FECACA",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "12px"
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "6px", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "1.5rem", fontWeight: "700", color: "#DC2626" }}>
                            {name.fullChinese}
                          </span>
                          <span style={{ fontSize: "1rem", color: "#374151" }}>
                            ({name.fullPinyin})
                          </span>
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "#57534E", lineHeight: "1.6" }}>
                          {includeSurname && (
                            <div>
                              <span style={{ fontWeight: "600" }}>{name.surname.char}</span> ({name.surname.pinyin}): {name.surname.meaning}
                              <span style={{ color: "#9CA3AF" }}> - {name.surname.popularity}</span>
                            </div>
                          )}
                          {name.givenChars.map((char, i) => (
                            <div key={i}>
                              <span style={{ fontWeight: "600" }}>{char.char}</span> ({char.pinyin}): {char.meaning}
                            </div>
                          ))}
                          <div style={{ marginTop: "4px", fontStyle: "italic", color: "#6B7280" }}>
                            Combined meaning: {name.fullMeaning}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(`${name.fullChinese} (${name.fullPinyin})`, index)}
                        style={{
                          padding: "6px 10px",
                          backgroundColor: copiedIndex === index ? "#10B981" : "#DC2626",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "0.75rem",
                          cursor: "pointer",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {copiedIndex === index ? "✓" : "📋"}
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={generateNames}
                    style={{
                      padding: "12px",
                      backgroundColor: "transparent",
                      color: "#DC2626",
                      border: "2px dashed #FECACA",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                      cursor: "pointer",
                      marginTop: "8px"
                    }}
                  >
                    🔄 Generate More 重新生成
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #FECACA", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
                📖 Chinese Naming Traditions 中国命名传统
              </h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  Chinese names carry profound cultural significance. Unlike Western names, Chinese names are carefully 
                  chosen with specific meanings in mind, often reflecting the family&apos;s hopes, values, and aspirations 
                  for the child.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Name Structure 名字结构</h3>
                <div style={{
                  backgroundColor: "#FEF2F2",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #FECACA"
                }}>
                  <p style={{ margin: "0 0 12px 0" }}>
                    A typical Chinese name consists of:
                  </p>
                  <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "2" }}>
                    <li><strong>姓 (Xìng) - Surname:</strong> Usually 1 character, comes FIRST</li>
                    <li><strong>名 (Míng) - Given Name:</strong> 1-2 characters, comes after surname</li>
                  </ul>
                  <p style={{ margin: "12px 0 0 0", fontSize: "0.9rem", color: "#DC2626" }}>
                    Example: 李明 (Lǐ Míng) = Surname &quot;Li&quot; + Given name &quot;Ming&quot;
                  </p>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Five Elements 五行</h3>
                <p>
                  The Five Elements (五行, Wǔ Xíng) are fundamental concepts in Chinese philosophy: 
                  Wood (木), Fire (火), Earth (土), Metal (金), and Water (水). Parents may choose 
                  name characters based on which element their child needs for balance according to 
                  their birth date and time.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px", margin: "16px 0" }}>
                  {[
                    { element: "金", name: "Metal", color: "#F59E0B" },
                    { element: "木", name: "Wood", color: "#10B981" },
                    { element: "水", name: "Water", color: "#3B82F6" },
                    { element: "火", name: "Fire", color: "#EF4444" },
                    { element: "土", name: "Earth", color: "#78716C" }
                  ].map((e) => (
                    <div key={e.element} style={{ 
                      padding: "12px", 
                      backgroundColor: "#F9FAFB", 
                      borderRadius: "8px", 
                      textAlign: "center",
                      border: "1px solid #E5E7EB"
                    }}>
                      <div style={{ fontSize: "1.5rem", color: e.color }}>{e.element}</div>
                      <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>{e.name}</div>
                    </div>
                  ))}
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Common Character Meanings</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", margin: "16px 0" }}>
                  <div style={{ padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
                    <strong>Male Names 男名</strong>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#57534E" }}>
                      强 (strong), 伟 (great), 龙 (dragon), 杰 (outstanding), 明 (bright), 志 (ambition)
                    </p>
                  </div>
                  <div style={{ padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
                    <strong>Female Names 女名</strong>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#57534E" }}>
                      美 (beautiful), 丽 (elegant), 兰 (orchid), 玉 (jade), 慧 (wise), 婷 (graceful)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Top Surnames */}
            <div style={{ backgroundColor: "#DC2626", borderRadius: "16px", padding: "24px", marginBottom: "24px", color: "white" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "16px" }}>🏆 Top 10 Surnames 常见姓氏</h3>
              <div style={{ fontSize: "0.9rem", lineHeight: "2" }}>
                <p style={{ margin: 0 }}>1. 王 Wáng (King)</p>
                <p style={{ margin: 0 }}>2. 李 Lǐ (Plum)</p>
                <p style={{ margin: 0 }}>3. 张 Zhāng (Stretch)</p>
                <p style={{ margin: 0 }}>4. 刘 Liú (Kill)</p>
                <p style={{ margin: 0 }}>5. 陈 Chén (Ancient state)</p>
                <p style={{ margin: 0 }}>6. 杨 Yáng (Poplar)</p>
                <p style={{ margin: 0 }}>7. 黄 Huáng (Yellow)</p>
                <p style={{ margin: 0 }}>8. 赵 Zhào (Ancient state)</p>
                <p style={{ margin: 0 }}>9. 周 Zhōu (Dynasty)</p>
                <p style={{ margin: 0 }}>10. 吴 Wú (Ancient state)</p>
              </div>
            </div>

            {/* Style Guide */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "16px" }}>🎨 Style Guide 风格指南</h3>
              <div style={{ fontSize: "0.85rem", color: "#B45309", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}><strong>Traditional:</strong> Classic names</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>Modern:</strong> Trendy names</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>Ancient:</strong> Historical/warrior</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>Poetic:</strong> Literary names</p>
                <p style={{ margin: 0 }}><strong>Five Elements:</strong> 金木水火土</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/chinese-name-generator" currentCategory="Social" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #FECACA", padding: "32px", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "24px" }}>
            Frequently Asked Questions 常见问题
          </h2>
          <div>
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ padding: "16px", backgroundColor: "#FEF2F2", borderRadius: "8px", border: "1px solid #FECACA" }}>
          <p style={{ fontSize: "0.75rem", color: "#DC2626", textAlign: "center", margin: 0 }}>
            🏮 <strong>Note:</strong> Names are generated based on authentic Chinese naming conventions. 
            All names are free to use for stories, games, characters, or any creative project. 
            For real-life naming, consult native speakers for cultural appropriateness.
          </p>
        </div>
      </div>
    </div>
  );
}