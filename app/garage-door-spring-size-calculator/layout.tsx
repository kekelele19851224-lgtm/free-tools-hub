import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Garage Door Spring Size Calculator - Free Torsion Spring Chart by Weight | FreeToolsHub",
  description: "Free garage door spring size calculator. Find the right torsion spring by door weight, verify existing springs, wire size chart included. Works for 16x7, 8x7, and all sizes. No signup required.",
  keywords: "garage door spring size calculator, garage door torsion spring size calculator, garage door spring size chart, garage door spring size chart by weight, what size spring for 16x7 garage door, garage door spring calculator, torsion spring calculator, garage door spring wire size chart",
  alternates: {
    canonical: "/garage-door-spring-size-calculator",
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}