 "use client";
 
 import Link from "next/link";
 import { useState } from "react";
 
 export default function Header() {
   const [isMenuOpen, setIsMenuOpen] = useState(false);
 
   return (
     <header style={{ 
       backgroundColor: "white", 
       borderBottom: "1px solid #E5E7EB", 
       position: "sticky", 
       top: 0, 
       zIndex: 50 
     }}> 
       <div style={{ 
         maxWidth: "1200px", 
         margin: "0 auto", 
         padding: "16px 24px", 
         display: "flex", 
         justifyContent: "space-between", 
         alignItems: "center" 
       }}> 
         <Link href="/" style={{ textDecoration: "none" }}> 
           <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827" }}> 
             🛠️ FreeToolsHub 
           </span> 
         </Link> 
 
         {/* Desktop Navigation */} 
         <nav style={{ display: "flex", gap: "24px" }} className="desktop-nav"> 
           <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link> 
           <Link href="/about" style={{ color: "#6B7280", textDecoration: "none" }}>About</Link> 
           <Link href="/contact" style={{ color: "#6B7280", textDecoration: "none" }}>Contact</Link> 
         </nav> 
 
         {/* Mobile Menu Button */} 
         <button 
           onClick={() => setIsMenuOpen(!isMenuOpen)} 
           className="mobile-menu-btn" 
           style={{ 
             display: "none", 
             background: "none", 
             border: "none", 
             cursor: "pointer", 
             padding: "8px" 
           }} 
           aria-label="Toggle menu" 
         > 
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"> 
             {isMenuOpen ? ( 
               <path d="M6 18L18 6M6 6l12 12" /> 
             ) : ( 
               <path d="M3 12h18M3 6h18M3 18h18" /> 
             )} 
           </svg> 
         </button> 
       </div> 
 
       {/* Mobile Menu Dropdown */} 
       {isMenuOpen && ( 
         <div className="mobile-menu" style={{ 
           display: "none", 
           flexDirection: "column", 
           backgroundColor: "white", 
           borderTop: "1px solid #E5E7EB", 
           padding: "16px 24px" 
         }}> 
           <Link 
             href="/" 
             style={{ color: "#374151", textDecoration: "none", padding: "12px 0", borderBottom: "1px solid #F3F4F6" }} 
             onClick={() => setIsMenuOpen(false)} 
           > 
             Home 
           </Link> 
           <Link 
             href="/about" 
             style={{ color: "#374151", textDecoration: "none", padding: "12px 0", borderBottom: "1px solid #F3F4F6" }} 
             onClick={() => setIsMenuOpen(false)} 
           > 
             About 
           </Link> 
           <Link 
             href="/contact" 
             style={{ color: "#374151", textDecoration: "none", padding: "12px 0" }} 
             onClick={() => setIsMenuOpen(false)} 
           > 
             Contact 
           </Link> 
         </div> 
       )} 
 
       <style jsx global>{` 
         @media (max-width: 768px) { 
           .desktop-nav { 
             display: none !important; 
           } 
           .mobile-menu-btn { 
             display: block !important; 
           } 
           .mobile-menu { 
             display: flex !important; 
           } 
         } 
       `}</style> 
     </header> 
   ); 
 } 
