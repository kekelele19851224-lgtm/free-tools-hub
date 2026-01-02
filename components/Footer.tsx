 "use client";
 
 import Link from "next/link";
 
 export default function Footer() { 
   return ( 
     <footer style={{ 
       backgroundColor: "#111827", 
       color: "white", 
       padding: "48px 24px 24px", 
       marginTop: "64px" 
     }}> 
       <div style={{ 
         maxWidth: "1200px", 
         margin: "0 auto" 
       }}> 
         {/* Top Section */} 
         <div style={{ 
           display: "grid", 
           gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
           gap: "32px", 
           marginBottom: "32px" 
         }}> 
           {/* Brand */} 
           <div> 
             <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "12px" }}> 
               🛠️ FreeToolsHub 
             </h3> 
             <p style={{ color: "#9CA3AF", fontSize: "0.875rem", lineHeight: "1.6" }}> 
               Free online calculators and tools for financial, home, real estate, and legal calculations. 
             </p> 
           </div> 
 
           {/* Quick Links */} 
           <div> 
             <h4 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "12px" }}>Quick Links</h4> 
             <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}> 
               <Link href="/" style={{ color: "#9CA3AF", textDecoration: "none", fontSize: "0.875rem" }}>Home</Link> 
               <Link href="/about" style={{ color: "#9CA3AF", textDecoration: "none", fontSize: "0.875rem" }}>About Us</Link> 
               <Link href="/contact" style={{ color: "#9CA3AF", textDecoration: "none", fontSize: "0.875rem" }}>Contact</Link> 
             </div> 
           </div> 
 
           {/* Legal */} 
           <div> 
             <h4 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "12px" }}>Legal</h4> 
             <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}> 
               <Link href="/privacy-policy" style={{ color: "#9CA3AF", textDecoration: "none", fontSize: "0.875rem" }}>Privacy Policy</Link> 
               <Link href="/terms" style={{ color: "#9CA3AF", textDecoration: "none", fontSize: "0.875rem" }}>Terms of Service</Link> 
             </div> 
           </div> 
 
           {/* Contact */} 
           <div> 
             <h4 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "12px" }}>Contact</h4> 
             <p style={{ color: "#9CA3AF", fontSize: "0.875rem" }}> 
               <a href="mailto:contact@free-tools-hub.com" style={{ color: "#9CA3AF", textDecoration: "none" }}> 
                 contact@free-tools-hub.com 
               </a> 
             </p> 
           </div> 
         </div> 
 
         {/* Bottom Section */} 
         <div style={{ 
           borderTop: "1px solid #374151", 
           paddingTop: "24px", 
           textAlign: "center" 
         }}> 
           <p style={{ color: "#6B7280", fontSize: "0.875rem" }}> 
             © {new Date().getFullYear()} FreeToolsHub. All rights reserved. 
           </p> 
         </div> 
       </div> 
     </footer> 
   ); 
 } 
