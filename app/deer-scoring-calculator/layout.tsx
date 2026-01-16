import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deer Scoring Calculator - Free Whitetail & Mule Deer Antler Score | Boone and Crockett System | FreeToolsHub",
  description: "Free deer scoring calculator using official Boone and Crockett scoring system. Calculate gross & net scores for whitetail and mule deer. Includes visual measurement guide, deduction calculator, and record book eligibility check. No download required.",
  keywords: "deer scoring calculator, whitetail scoring calculator, buck scoring calculator, antler scoring calculator, deer score calculator free, gross deer score calculator, boone and crockett score calculator, mule deer score calculator, deer antler score, pope and young score"
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}