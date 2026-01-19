"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// ============================================
// Types & Data
// ============================================

interface ResonanceStructure {
  structure: string[];
  description: string;
  contribution: string;
}

interface Molecule {
  id: string;
  name: string;
  formula: string;
  category: string;
  charge: string;
  totalStructures: number;
  structures: ResonanceStructure[];
  steps: string[];
  explanation: string;
  hybridDescription: string;
}

// Molecule database
const molecules: Molecule[] = [
  {
    id: 'acetate',
    name: 'Acetate Ion',
    formula: 'CH₃COO⁻',
    category: 'Carboxylate Ions',
    charge: '-1',
    totalStructures: 2,
    structures: [
      {
        structure: [
          '        O⁻',
          '        |',
          '   H₃C—C',
          '        ‖',
          '        O',
        ],
        description: 'Negative charge on top oxygen, double bond to bottom oxygen',
        contribution: '50%'
      },
      {
        structure: [
          '        O',
          '        ‖',
          '   H₃C—C',
          '        |',
          '        O⁻',
        ],
        description: 'Double bond to top oxygen, negative charge on bottom oxygen',
        contribution: '50%'
      }
    ],
    steps: [
      'Draw the Lewis structure with C as the central atom connected to CH₃',
      'Place two oxygen atoms bonded to the central carbon',
      'One oxygen has a double bond (2 lone pairs), one has single bond (3 lone pairs + negative charge)',
      'Move the double bond to the other oxygen while shifting the negative charge',
      'Both structures are equivalent, contributing equally to the hybrid'
    ],
    explanation: 'The acetate ion has two equivalent resonance structures where the negative charge and double bond alternate between the two oxygen atoms. This delocalization makes the ion more stable than if the charge were localized on one oxygen.',
    hybridDescription: 'In the resonance hybrid, both C-O bonds are equivalent with a bond order of 1.5, and the negative charge is evenly distributed over both oxygen atoms.'
  },
  {
    id: 'carbonate',
    name: 'Carbonate Ion',
    formula: 'CO₃²⁻',
    category: 'Inorganic Ions',
    charge: '-2',
    totalStructures: 3,
    structures: [
      {
        structure: [
          '       O⁻',
          '       |',
          '  ⁻O—C',
          '       ‖',
          '       O',
        ],
        description: 'Double bond to bottom oxygen',
        contribution: '33.3%'
      },
      {
        structure: [
          '       O⁻',
          '       |',
          '   O—C',
          '       |',
          '       O⁻',
          '(double bond to top-left O)',
        ],
        description: 'Double bond to left oxygen',
        contribution: '33.3%'
      },
      {
        structure: [
          '       O',
          '       ‖',
          '  ⁻O—C',
          '       |',
          '       O⁻',
        ],
        description: 'Double bond to top oxygen',
        contribution: '33.3%'
      }
    ],
    steps: [
      'Draw carbon as the central atom with three oxygen atoms around it',
      'Total valence electrons: 4 + 3(6) + 2 = 24 electrons',
      'One oxygen forms a double bond (2 lone pairs), two have single bonds (3 lone pairs each)',
      'The double bond can be placed on any of the three oxygen atoms',
      'All three structures are equivalent with equal contribution'
    ],
    explanation: 'The carbonate ion has three equivalent resonance structures. The double bond rotates among the three oxygen atoms, with two oxygens always carrying the negative charges.',
    hybridDescription: 'In the hybrid, all three C-O bonds are equivalent with bond order 1.33, and each oxygen carries 2/3 of a negative charge.'
  },
  {
    id: 'nitrate',
    name: 'Nitrate Ion',
    formula: 'NO₃⁻',
    category: 'Inorganic Ions',
    charge: '-1',
    totalStructures: 3,
    structures: [
      {
        structure: [
          '       O⁻',
          '       |',
          '  ⁻O—N⁺',
          '       ‖',
          '       O',
        ],
        description: 'Double bond to bottom oxygen, formal charge +1 on N',
        contribution: '33.3%'
      },
      {
        structure: [
          '       O',
          '       ‖',
          '  ⁻O—N⁺',
          '       |',
          '       O⁻',
        ],
        description: 'Double bond to top oxygen',
        contribution: '33.3%'
      },
      {
        structure: [
          '       O⁻',
          '       |',
          '   O—N⁺',
          '       |',
          '       O⁻',
          '(double bond to left O)',
        ],
        description: 'Double bond to left oxygen',
        contribution: '33.3%'
      }
    ],
    steps: [
      'Draw nitrogen as central atom bonded to three oxygen atoms',
      'Total valence electrons: 5 + 3(6) + 1 = 24 electrons',
      'Nitrogen has a formal charge of +1, one O has double bond, two O have -1 charge',
      'Rotate the double bond position among the three oxygens',
      'All three structures contribute equally'
    ],
    explanation: 'The nitrate ion is isoelectronic with carbonate. Nitrogen bears a +1 formal charge in all resonance structures because it forms 4 bonds.',
    hybridDescription: 'Each N-O bond has a bond order of 1.33, and the negative charge is distributed equally among the three oxygen atoms.'
  },
  {
    id: 'ozone',
    name: 'Ozone',
    formula: 'O₃',
    category: 'Small Molecules',
    charge: '0',
    totalStructures: 2,
    structures: [
      {
        structure: [
          '  ⁺O—O—O⁻',
          '   ‖',
          '(left O=O double bond)',
        ],
        description: 'Double bond on left side, positive charge on center O, negative on right O',
        contribution: '50%'
      },
      {
        structure: [
          '  ⁻O—O—O⁺',
          '       ‖',
          '(right O=O double bond)',
        ],
        description: 'Double bond on right side, negative charge on left O, positive on center',
        contribution: '50%'
      }
    ],
    steps: [
      'Draw three oxygen atoms in a bent arrangement (not linear)',
      'Total valence electrons: 3(6) = 18 electrons',
      'Central oxygen forms bonds to both terminal oxygens',
      'One terminal oxygen has double bond, the other has single bond with negative charge',
      'Central oxygen has +1 formal charge, the single-bonded terminal O has -1'
    ],
    explanation: 'Ozone has a bent molecular geometry with a bond angle of about 117°. The resonance structures show the double bond alternating between the two O-O bonds.',
    hybridDescription: 'Both O-O bonds are equivalent with bond order 1.5. The molecule is polar due to its bent geometry.'
  },
  {
    id: 'benzene',
    name: 'Benzene',
    formula: 'C₆H₆',
    category: 'Aromatic Compounds',
    charge: '0',
    totalStructures: 2,
    structures: [
      {
        structure: [
          '      H',
          '      |',
          '    C=C',
          '   /    \\',
          ' HC      CH',
          '   \\    /',
          '    C—C',
          '      |',
          '      H',
          '(alternating double bonds 1,3,5)',
        ],
        description: 'Double bonds at positions 1-2, 3-4, 5-6',
        contribution: '50%'
      },
      {
        structure: [
          '      H',
          '      |',
          '    C—C',
          '   /    \\',
          ' HC      CH',
          '   \\    /',
          '    C=C',
          '      |',
          '      H',
          '(alternating double bonds 2,4,6)',
        ],
        description: 'Double bonds at positions 2-3, 4-5, 6-1',
        contribution: '50%'
      }
    ],
    steps: [
      'Draw a hexagonal ring of 6 carbon atoms',
      'Each carbon is bonded to one hydrogen atom',
      'Place alternating double bonds (3 total) in the ring',
      'The second structure has double bonds shifted by one position',
      'Both Kekulé structures contribute equally'
    ],
    explanation: 'Benzene is the classic example of aromatic resonance. The two Kekulé structures show alternating double bonds, but the real molecule has all equivalent C-C bonds.',
    hybridDescription: 'All six C-C bonds are equivalent with bond order 1.5. The π electrons are fully delocalized around the ring, giving benzene exceptional stability (aromatic stabilization).'
  },
  {
    id: 'nitrite',
    name: 'Nitrite Ion',
    formula: 'NO₂⁻',
    category: 'Inorganic Ions',
    charge: '-1',
    totalStructures: 2,
    structures: [
      {
        structure: [
          '  O=N—O⁻',
          '',
          'Double bond to left O',
        ],
        description: 'Double bond to left oxygen, negative charge on right oxygen',
        contribution: '50%'
      },
      {
        structure: [
          '  ⁻O—N=O',
          '',
          'Double bond to right O',
        ],
        description: 'Negative charge on left oxygen, double bond to right oxygen',
        contribution: '50%'
      }
    ],
    steps: [
      'Draw nitrogen as the central atom with two oxygen atoms',
      'Total valence electrons: 5 + 2(6) + 1 = 18 electrons',
      'One oxygen forms double bond, one forms single bond with negative charge',
      'Swap the positions of double bond and negative charge',
      'Both structures are equivalent'
    ],
    explanation: 'The nitrite ion has a bent geometry similar to ozone. The two resonance structures are equivalent with the double bond and negative charge swapping positions.',
    hybridDescription: 'Both N-O bonds are equivalent with bond order 1.5, and the negative charge is evenly distributed over both oxygen atoms.'
  },
  {
    id: 'formate',
    name: 'Formate Ion',
    formula: 'HCOO⁻',
    category: 'Carboxylate Ions',
    charge: '-1',
    totalStructures: 2,
    structures: [
      {
        structure: [
          '        O⁻',
          '        |',
          '    H—C',
          '        ‖',
          '        O',
        ],
        description: 'Double bond to bottom oxygen, negative charge on top',
        contribution: '50%'
      },
      {
        structure: [
          '        O',
          '        ‖',
          '    H—C',
          '        |',
          '        O⁻',
        ],
        description: 'Double bond to top oxygen, negative charge on bottom',
        contribution: '50%'
      }
    ],
    steps: [
      'Draw carbon bonded to hydrogen and two oxygen atoms',
      'Total valence electrons: 4 + 1 + 2(6) + 1 = 18 electrons',
      'One oxygen has double bond, one has single bond with negative charge',
      'The double bond and charge can swap positions',
      'Both structures contribute equally'
    ],
    explanation: 'Formate is the simplest carboxylate ion. Like acetate, it has two equivalent resonance structures with the charge delocalized over both oxygen atoms.',
    hybridDescription: 'Both C-O bonds have bond order 1.5, and each oxygen carries half of the negative charge.'
  },
  {
    id: 'sulfur-dioxide',
    name: 'Sulfur Dioxide',
    formula: 'SO₂',
    category: 'Small Molecules',
    charge: '0',
    totalStructures: 2,
    structures: [
      {
        structure: [
          '  ⁺S—O⁻',
          '  ‖',
          '  O',
          '',
          'Double bond to bottom O',
        ],
        description: 'Double bond to bottom oxygen, single bond with charges to other O',
        contribution: '50%'
      },
      {
        structure: [
          '  ⁻O—S⁺',
          '      ‖',
          '      O',
          '',
          'Double bond to right O',
        ],
        description: 'Double bond to right oxygen, single bond with charges to left O',
        contribution: '50%'
      }
    ],
    steps: [
      'Draw sulfur as central atom bonded to two oxygen atoms',
      'Total valence electrons: 6 + 2(6) = 18 electrons',
      'Sulfur has one lone pair and forms one double bond, one single bond',
      'The double-bonded O has 2 lone pairs, single-bonded O has 3 lone pairs and -1 charge',
      'Sulfur has +1 formal charge in this representation'
    ],
    explanation: 'Sulfur dioxide has a bent geometry like ozone. The resonance structures show the double bond alternating between the two S-O bonds.',
    hybridDescription: 'Both S-O bonds are equivalent with bond order 1.5. The molecule is bent with a bond angle of about 119°.'
  },
  {
    id: 'allyl-cation',
    name: 'Allyl Cation',
    formula: 'C₃H₅⁺',
    category: 'Carbocations',
    charge: '+1',
    totalStructures: 2,
    structures: [
      {
        structure: [
          '  ⁺CH₂—CH=CH₂',
          '',
          'Positive charge on left carbon',
        ],
        description: 'Positive charge on C1, double bond between C2-C3',
        contribution: '50%'
      },
      {
        structure: [
          '  CH₂=CH—CH₂⁺',
          '',
          'Positive charge on right carbon',
        ],
        description: 'Double bond between C1-C2, positive charge on C3',
        contribution: '50%'
      }
    ],
    steps: [
      'Draw three carbon atoms in a chain with 5 hydrogen atoms total',
      'Total valence electrons: 3(4) + 5(1) - 1 = 16 electrons',
      'Place a double bond between two carbons and positive charge on the third',
      'The double bond and positive charge can swap positions',
      'Both terminal carbons share the positive charge'
    ],
    explanation: 'The allyl cation is stabilized by resonance, making it more stable than a simple primary carbocation. The positive charge is delocalized over the two terminal carbon atoms.',
    hybridDescription: 'Both C-C bonds have bond order 1.5, and each terminal carbon carries +0.5 charge. The central carbon has no charge.'
  },
  {
    id: 'azide',
    name: 'Azide Ion',
    formula: 'N₃⁻',
    category: 'Inorganic Ions',
    charge: '-1',
    totalStructures: 3,
    structures: [
      {
        structure: [
          '  N=N=N⁻',
          '  ⁻   ⁺',
          '',
          'Two double bonds (major)',
        ],
        description: 'Linear with two double bonds, -1 on terminal N, +1 on central N',
        contribution: '~45%'
      },
      {
        structure: [
          '  ⁻N—N≡N',
          '',
          'Triple bond right side',
        ],
        description: 'Triple bond on right, single on left, -1 on left N',
        contribution: '~27.5%'
      },
      {
        structure: [
          '  N≡N—N⁻',
          '',
          'Triple bond left side',
        ],
        description: 'Triple bond on left, single on right, -1 on right N',
        contribution: '~27.5%'
      }
    ],
    steps: [
      'Draw three nitrogen atoms in a linear arrangement',
      'Total valence electrons: 3(5) + 1 = 16 electrons',
      'The most stable structure has two double bonds (like CO₂)',
      'Alternative structures have one triple and one single bond',
      'The double-double structure contributes most'
    ],
    explanation: 'The azide ion is linear with the negative charge distributed over the terminal nitrogen atoms. The central nitrogen has a +1 formal charge in the major resonance structure.',
    hybridDescription: 'The N-N bonds have bond order between 1.5 and 2. The negative charge is primarily on the terminal nitrogen atoms.'
  },
  {
    id: 'cyanate',
    name: 'Cyanate Ion',
    formula: 'OCN⁻',
    category: 'Inorganic Ions',
    charge: '-1',
    totalStructures: 3,
    structures: [
      {
        structure: [
          '  O=C=N⁻',
          '',
          'Two double bonds (major)',
        ],
        description: 'Two double bonds, negative charge on nitrogen',
        contribution: '~50%'
      },
      {
        structure: [
          '  ⁻O—C≡N',
          '',
          'Triple bond C≡N',
        ],
        description: 'Triple bond to N, negative charge on O',
        contribution: '~30%'
      },
      {
        structure: [
          '  O≡C—N²⁻',
          '',
          'Triple bond O≡C (minor)',
        ],
        description: 'Triple bond to O, -2 on nitrogen (less stable)',
        contribution: '~20%'
      }
    ],
    steps: [
      'Draw O-C-N in a linear arrangement',
      'Total valence electrons: 6 + 4 + 5 + 1 = 16 electrons',
      'Most stable has two double bonds with -1 on N',
      'Second structure has C≡N triple bond with -1 on O',
      'Third structure is less stable due to charge on less electronegative N'
    ],
    explanation: 'The cyanate ion has three resonance structures with unequal contributions. The structure with negative charge on the more electronegative oxygen is more stable.',
    hybridDescription: 'The C-O bond order is about 1.5-2, and the C-N bond order is about 2-2.5. Negative charge is distributed between O and N.'
  },
  {
    id: 'phenoxide',
    name: 'Phenoxide Ion',
    formula: 'C₆H₅O⁻',
    category: 'Aromatic Compounds',
    charge: '-1',
    totalStructures: 4,
    structures: [
      {
        structure: [
          '    O⁻',
          '    |',
          '  (benzene ring)',
          '',
          'Charge on oxygen (major)',
        ],
        description: 'Negative charge localized on oxygen',
        contribution: '~60%'
      },
      {
        structure: [
          '    O',
          '    ‖',
          '  (benzene with - on ortho C)',
        ],
        description: 'Charge delocalized to ortho carbon',
        contribution: '~15%'
      },
      {
        structure: [
          '    O',
          '    ‖',
          '  (benzene with - on para C)',
        ],
        description: 'Charge delocalized to para carbon',
        contribution: '~15%'
      },
      {
        structure: [
          '    O',
          '    ‖',
          "  (benzene with - on other ortho C)",
        ],
        description: 'Charge on other ortho position',
        contribution: '~10%'
      }
    ],
    steps: [
      'Draw benzene ring with oxygen attached',
      'The negative charge is primarily on oxygen',
      'Through resonance, charge can move into the ring',
      'Charge appears at ortho and para positions',
      'Meta positions do not receive charge through resonance'
    ],
    explanation: 'The phenoxide ion is stabilized by resonance with the benzene ring. The negative charge is delocalized onto the oxygen and the ortho/para carbons of the ring.',
    hybridDescription: 'The C-O bond has partial double bond character. This resonance stabilization makes phenol (pKa ~10) more acidic than alcohols (pKa ~16).'
  },
];

// Categories for filtering
const categories = [
  'All',
  'Carboxylate Ions',
  'Inorganic Ions',
  'Small Molecules',
  'Aromatic Compounds',
  'Carbocations',
];

// Resonance rules
const resonanceRules = [
  {
    number: 1,
    title: "Only electrons move, not atoms",
    description: "Atoms must stay in the same positions. Only π electrons and lone pairs can be moved between adjacent atoms."
  },
  {
    number: 2,
    title: "Follow the octet rule",
    description: "Second-row elements (C, N, O, F) cannot exceed 8 electrons. Third-row elements (S, P) can exceed the octet."
  },
  {
    number: 3,
    title: "Do not break single bonds",
    description: "Single bonds (σ bonds) cannot be broken in resonance structures. Only π bonds and lone pairs participate."
  },
  {
    number: 4,
    title: "Total charge must be conserved",
    description: "The sum of formal charges must be the same in all resonance structures and equal to the overall molecular charge."
  },
];

// FAQ data
const faqs = [
  {
    question: "What are resonance structures?",
    answer: "Resonance structures are different Lewis structures that can be drawn for a molecule when electrons can be delocalized. The actual molecule is a hybrid of all resonance structures, not switching between them. Resonance occurs when π electrons or lone pairs can be distributed in multiple valid ways."
  },
  {
    question: "How do I know if a molecule has resonance?",
    answer: "Look for: (1) Adjacent atoms with π bonds and lone pairs, (2) Conjugated systems (alternating single and double bonds), (3) Charged species adjacent to π bonds, (4) Aromatic rings. If electrons can move to an adjacent atom without breaking a single bond, resonance is possible."
  },
  {
    question: "Which resonance structure contributes more?",
    answer: "More stable (major) contributors have: (1) More covalent bonds, (2) Complete octets on all atoms, (3) Negative charges on more electronegative atoms, (4) Minimal formal charges, (5) Negative and positive charges close together if both exist."
  },
  {
    question: "What is a resonance hybrid?",
    answer: "The resonance hybrid is the actual structure of the molecule - a weighted average of all resonance structures. It represents the true electron distribution. Bond lengths and charges in the hybrid are intermediate between those shown in individual resonance structures."
  },
  {
    question: "Do resonance structures actually interconvert?",
    answer: "No! This is a common misconception. The molecule does not flip between resonance structures. The resonance structures are just different ways we draw the same molecule. The actual molecule exists as one hybrid structure with delocalized electrons."
  },
  {
    question: "Why is resonance important?",
    answer: "Resonance affects molecular stability (resonance-stabilized molecules are more stable), reactivity (determines where reactions occur), acidity/basicity (conjugate bases with resonance are more stable), and physical properties like bond lengths and dipole moments."
  }
];

// FAQ component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #10B981" }}>
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
        <h3 style={{ fontWeight: "600", color: "#A7F3D0", paddingRight: "16px", margin: 0, fontSize: "1rem" }}>{question}</h3>
        <svg style={{ width: "20px", height: "20px", color: "#34D399", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div style={{ maxHeight: isOpen ? "500px" : "0", overflow: "hidden", transition: "max-height 0.3s ease-out" }}>
        <p style={{ color: "#6EE7B7", paddingBottom: "16px", margin: 0, lineHeight: "1.7" }}>{answer}</p>
      </div>
    </div>
  );
}

export default function ResonanceStructureGenerator() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMolecule, setSelectedMolecule] = useState<Molecule | null>(null);
  const [showSteps, setShowSteps] = useState(true);
  const [activeStructure, setActiveStructure] = useState(0);

  // Filter molecules by category
  const filteredMolecules = selectedCategory === 'All' 
    ? molecules 
    : molecules.filter(m => m.category === selectedCategory);

  // Select a molecule
  const handleSelectMolecule = (mol: Molecule) => {
    setSelectedMolecule(mol);
    setActiveStructure(0);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0D1117" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "#161B22", borderBottom: "1px solid #10B981" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#9CA3AF" }}>
            <Link href="/" style={{ color: "#9CA3AF", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#34D399" }}>Resonance Structure Generator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "2.5rem" }}>⚗️</span>
            <h1 style={{ fontSize: "clamp(1.75rem, 5vw, 2.25rem)", fontWeight: "bold", color: "#34D399", margin: 0 }}>
              Resonance Structure Generator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#9CA3AF", maxWidth: "800px" }}>
            Explore resonance structures of common molecules and ions. 
            View step-by-step explanations and understand electron delocalization.
          </p>
        </div>

        {/* Info Box */}
        <div style={{
          backgroundColor: "#10B981",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "#FFFFFF", margin: "0 0 4px 0" }}>
                <strong>Remember</strong>
              </p>
              <p style={{ color: "#D1FAE5", margin: 0, fontSize: "0.95rem" }}>
                Resonance structures are different ways to draw the same molecule. 
                The actual molecule is a hybrid — electrons don&apos;t actually &quot;jump&quot; between structures!
              </p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
          {/* Selection Panel */}
          <div style={{
            backgroundColor: "#161B22",
            borderRadius: "16px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
            border: "1px solid #10B981",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#10B981", padding: "16px 24px" }}>
              <h2 style={{ color: "#FFFFFF", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                🔬 Select Molecule
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              {/* Category Filter */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#34D399", marginBottom: "10px", fontWeight: "600" }}>
                  📁 Category
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setSelectedMolecule(null);
                      }}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: selectedCategory === cat ? "2px solid #10B981" : "1px solid #4B5563",
                        backgroundColor: selectedCategory === cat ? "rgba(16, 185, 129, 0.15)" : "transparent",
                        cursor: "pointer",
                        color: selectedCategory === cat ? "#34D399" : "#9CA3AF",
                        fontSize: "0.8rem"
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Molecule List */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#34D399", marginBottom: "10px", fontWeight: "600" }}>
                  🧪 Molecules ({filteredMolecules.length})
                </label>
                <div style={{ 
                  maxHeight: "300px", 
                  overflowY: "auto",
                  border: "1px solid #4B5563",
                  borderRadius: "8px"
                }}>
                  {filteredMolecules.map((mol) => (
                    <button
                      key={mol.id}
                      onClick={() => handleSelectMolecule(mol)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: selectedMolecule?.id === mol.id ? "rgba(16, 185, 129, 0.15)" : "transparent",
                        border: "none",
                        borderBottom: "1px solid #2D3748",
                        cursor: "pointer",
                        textAlign: "left"
                      }}
                    >
                      <div>
                        <div style={{ 
                          color: selectedMolecule?.id === mol.id ? "#34D399" : "#E5E7EB",
                          fontWeight: selectedMolecule?.id === mol.id ? "600" : "400"
                        }}>
                          {mol.name}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#6B7280" }}>
                          {mol.formula} • {mol.totalStructures} structures
                        </div>
                      </div>
                      {mol.charge !== '0' && (
                        <span style={{
                          padding: "2px 8px",
                          backgroundColor: "rgba(16, 185, 129, 0.2)",
                          borderRadius: "4px",
                          fontSize: "0.75rem",
                          color: "#34D399"
                        }}>
                          {mol.charge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={showSteps}
                    onChange={(e) => setShowSteps(e.target.checked)}
                    style={{ width: "18px", height: "18px", accentColor: "#10B981" }}
                  />
                  <span style={{ color: "#9CA3AF", fontSize: "0.9rem" }}>Show step-by-step explanation</span>
                </label>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="calc-results" style={{
            backgroundColor: "#161B22",
            borderRadius: "16px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
            border: "1px solid #10B981",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
              <h2 style={{ color: "#FFFFFF", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                📊 Resonance Structures
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              {!selectedMolecule ? (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#6B7280" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "16px" }}>⚗️</div>
                  <p style={{ margin: 0 }}>Select a molecule from the list to view its resonance structures</p>
                </div>
              ) : (
                <>
                  {/* Molecule Header */}
                  <div style={{ 
                    backgroundColor: "#0D1117", 
                    borderRadius: "12px", 
                    padding: "16px",
                    marginBottom: "20px",
                    border: "1px solid #10B981"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                      <div>
                        <h3 style={{ color: "#34D399", margin: "0 0 4px 0", fontSize: "1.25rem" }}>
                          {selectedMolecule.name}
                        </h3>
                        <p style={{ color: "#9CA3AF", margin: 0, fontSize: "1.1rem" }}>
                          {selectedMolecule.formula}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ color: "#6B7280", fontSize: "0.85rem" }}>Total Structures</div>
                        <div style={{ color: "#34D399", fontSize: "1.5rem", fontWeight: "700" }}>
                          {selectedMolecule.totalStructures}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Structure Tabs */}
                  <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
                    {selectedMolecule.structures.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveStructure(idx)}
                        style={{
                          padding: "8px 16px",
                          borderRadius: "8px",
                          border: activeStructure === idx ? "2px solid #10B981" : "1px solid #4B5563",
                          backgroundColor: activeStructure === idx ? "rgba(16, 185, 129, 0.15)" : "transparent",
                          color: activeStructure === idx ? "#34D399" : "#9CA3AF",
                          cursor: "pointer",
                          fontSize: "0.9rem"
                        }}
                      >
                        Structure {idx + 1}
                      </button>
                    ))}
                  </div>

                  {/* Active Structure Display */}
                  <div style={{
                    backgroundColor: "#0D1117",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "1px solid #4B5563"
                  }}>
                    <pre style={{
                      color: "#E5E7EB",
                      fontFamily: "monospace",
                      fontSize: "1rem",
                      lineHeight: "1.4",
                      margin: "0 0 12px 0",
                      whiteSpace: "pre-wrap"
                    }}>
                      {selectedMolecule.structures[activeStructure].structure.join('\n')}
                    </pre>
                    <div style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "center",
                      borderTop: "1px solid #4B5563",
                      paddingTop: "12px",
                      flexWrap: "wrap",
                      gap: "8px"
                    }}>
                      <p style={{ color: "#9CA3AF", margin: 0, fontSize: "0.85rem" }}>
                        {selectedMolecule.structures[activeStructure].description}
                      </p>
                      <span style={{
                        padding: "4px 12px",
                        backgroundColor: "rgba(16, 185, 129, 0.2)",
                        borderRadius: "20px",
                        color: "#34D399",
                        fontSize: "0.85rem",
                        fontWeight: "600"
                      }}>
                        Contribution: {selectedMolecule.structures[activeStructure].contribution}
                      </span>
                    </div>
                  </div>

                  {/* Steps */}
                  {showSteps && (
                    <div style={{
                      backgroundColor: "#0D1117",
                      borderRadius: "12px",
                      padding: "20px",
                      marginBottom: "16px",
                      border: "1px solid #4B5563"
                    }}>
                      <h4 style={{ color: "#34D399", margin: "0 0 12px 0", fontSize: "1rem" }}>
                        📝 How to Draw
                      </h4>
                      <ol style={{ margin: 0, paddingLeft: "20px", color: "#9CA3AF", lineHeight: "1.8" }}>
                        {selectedMolecule.steps.map((step, idx) => (
                          <li key={idx} style={{ marginBottom: "4px" }}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Hybrid Description */}
                  <div style={{
                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                    borderRadius: "12px",
                    padding: "16px",
                    border: "1px solid #10B981"
                  }}>
                    <h4 style={{ color: "#34D399", margin: "0 0 8px 0", fontSize: "0.95rem" }}>
                      🔄 Resonance Hybrid
                    </h4>
                    <p style={{ color: "#A7F3D0", margin: 0, fontSize: "0.9rem", lineHeight: "1.6" }}>
                      {selectedMolecule.hybridDescription}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Resonance Rules */}
        <div style={{ 
          backgroundColor: "#161B22", 
          borderRadius: "16px", 
          boxShadow: "0 4px 6px rgba(0,0,0,0.3)", 
          border: "1px solid #10B981", 
          padding: "32px",
          marginBottom: "32px"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#34D399", marginBottom: "20px" }}>
            📜 Rules for Drawing Resonance Structures
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
            {resonanceRules.map((rule) => (
              <div 
                key={rule.number}
                style={{
                  padding: "20px",
                  backgroundColor: "#0D1117",
                  borderRadius: "12px",
                  border: "1px solid #4B5563"
                }}
              >
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "12px",
                  marginBottom: "12px"
                }}>
                  <span style={{
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#10B981",
                    borderRadius: "50%",
                    color: "#FFFFFF",
                    fontWeight: "700",
                    fontSize: "0.9rem"
                  }}>
                    {rule.number}
                  </span>
                  <h3 style={{ color: "#E5E7EB", margin: 0, fontSize: "1rem" }}>{rule.title}</h3>
                </div>
                <p style={{ color: "#9CA3AF", margin: 0, fontSize: "0.85rem", lineHeight: "1.6" }}>
                  {rule.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "#161B22", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.3)", border: "1px solid #10B981", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#34D399", marginBottom: "20px" }}>
                📖 Understanding Resonance
              </h2>

              <div style={{ color: "#9CA3AF", lineHeight: "1.8" }}>
                <p>
                  Resonance is a key concept in chemistry that explains why some molecules are more stable than expected. 
                  When electrons can be delocalized across multiple atoms, the molecule gains extra stability called 
                  <strong style={{ color: "#34D399" }}> resonance stabilization</strong>.
                </p>

                <h3 style={{ color: "#34D399", marginTop: "24px", marginBottom: "12px" }}>Key Concepts</h3>
                <div style={{
                  backgroundColor: "#0D1117",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #4B5563"
                }}>
                  <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "2", color: "#9CA3AF" }}>
                    <li><strong style={{ color: "#34D399" }}>Electron Delocalization:</strong> π electrons spread over multiple atoms</li>
                    <li><strong style={{ color: "#34D399" }}>Resonance Hybrid:</strong> The true structure is a blend of all forms</li>
                    <li><strong style={{ color: "#34D399" }}>Curved Arrows:</strong> Show electron movement between structures</li>
                    <li><strong style={{ color: "#34D399" }}>Equivalent Structures:</strong> Contribute equally to the hybrid</li>
                    <li><strong style={{ color: "#34D399" }}>Major/Minor Contributors:</strong> More stable structures contribute more</li>
                  </ul>
                </div>

                <h3 style={{ color: "#34D399", marginTop: "24px", marginBottom: "12px" }}>Common Functional Groups with Resonance</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", marginTop: "16px" }}>
                  {[
                    { name: 'Carboxylates', example: 'RCOO⁻' },
                    { name: 'Amides', example: 'RCONH₂' },
                    { name: 'Esters', example: 'RCOOR' },
                    { name: 'Nitro Groups', example: 'RNO₂' },
                    { name: 'Aromatics', example: 'C₆H₆' },
                    { name: 'Enolates', example: 'RCH=CO⁻' },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "12px",
                        backgroundColor: "#0D1117",
                        borderRadius: "8px",
                        border: "1px solid #4B5563"
                      }}
                    >
                      <p style={{ margin: 0, color: "#34D399", fontWeight: "600", fontSize: "0.9rem" }}>{item.name}</p>
                      <p style={{ margin: "4px 0 0 0", color: "#6B7280", fontSize: "0.8rem", fontFamily: "monospace" }}>{item.example}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Facts */}
            <div style={{ backgroundColor: "#10B981", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#FFFFFF", marginBottom: "16px" }}>⚡ Quick Facts</h3>
              <div style={{ fontSize: "0.85rem", lineHeight: "1.9", color: "#D1FAE5" }}>
                <p style={{ margin: "0 0 8px 0" }}>🔬 Benzene has 36 kcal/mol resonance energy</p>
                <p style={{ margin: "0 0 8px 0" }}>⚖️ Equal structures = equal contribution</p>
                <p style={{ margin: "0 0 8px 0" }}>📉 More structures = more stable molecule</p>
                <p style={{ margin: 0 }}>🎯 Negative charge prefers electronegative atoms</p>
              </div>
            </div>

            {/* Tips */}
            <div style={{ backgroundColor: "#0D1117", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #10B981" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#34D399", marginBottom: "16px" }}>💡 Study Tips</h3>
              <p style={{ fontSize: "0.85rem", color: "#9CA3AF", lineHeight: "1.7", margin: 0 }}>
                • Practice drawing arrows showing electron movement<br/>
                • Count electrons before and after — they must match!<br/>
                • Check formal charges on each atom<br/>
                • Remember: atoms stay fixed, only electrons move
              </p>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/resonance-structure-generator" currentCategory="Generator" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "#161B22", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.3)", border: "1px solid #10B981", padding: "32px", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#34D399", marginBottom: "24px" }}>
            Frequently Asked Questions
          </h2>
          <div>
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ padding: "16px", backgroundColor: "#161B22", borderRadius: "8px", border: "1px solid #10B981" }}>
          <p style={{ fontSize: "0.75rem", color: "#34D399", textAlign: "center", margin: 0 }}>
            ⚗️ <strong>Disclaimer:</strong> This tool is for educational purposes. 
            For advanced molecular modeling, please use specialized chemistry software.
            Always verify structures with your textbook or instructor.
          </p>
        </div>
      </div>
    </div>
  );
}