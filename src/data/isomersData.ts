import type { IsomerPairModel } from '../types/chemistry';

export const ISOMERS_DATA: IsomerPairModel[] = [
  {
    id: 'isomer-chain-c4h10',
    type: 'Chain',
    molecularFormula: 'C₄H₁₀',
    title: 'Chain Isomerism in Butane',
    conceptSummary: 'Chain isomers have the EXACT same molecular formula (C₄H₁₀) but different carbon skeleton branching arrangements.',
    whyAreTheyIsomers: 'Both molecules have exactly 4 Carbon atoms and 10 Hydrogen atoms (C₄H₁₀). However, in butane they are hooked up in one unbranched continuous line, while in 2-methylpropane three carbons form a chain with the fourth carbon branching off the middle carbon.',
    keyDifferentiatingRule: 'Chain isomers differ in the length of their longest parent chain (4 carbons vs 3 carbons), leading to different physical properties like boiling point.',
    compoundA: {
      name: 'butane (n-butane)',
      condensed: 'CH₃–CH₂–CH₂–CH₃',
      structuralType: 'Straight continuous chain (4 carbons)',
      boilingPoint: '-0.5 °C',
      notes: 'Linear rod-like shape allows molecules to pack closely together, creating stronger London dispersion forces and a higher boiling point.',
      diagramType: 'chain'
    },
    compoundB: {
      name: '2-methylpropane (isobutane)',
      condensed: 'CH₃–CH(CH₃)–CH₃',
      structuralType: 'Branched chain (3-carbon parent + methyl branch)',
      boilingPoint: '-11.7 °C',
      notes: 'Branched, ball-like spherical shape reduces surface contact area between molecules, resulting in weaker intermolecular forces and a lower boiling point.',
      diagramType: 'branched'
    },
    educationalInsight: 'Branching always decreases the boiling point of alkane chain isomers because it reduces the surface area available for London dispersion forces!'
  },
  {
    id: 'isomer-position-c3h8o',
    type: 'Position',
    molecularFormula: 'C₃H₈O',
    title: 'Position Isomerism in Propanol',
    conceptSummary: 'Position isomers have the same carbon skeleton and same functional group, but the functional group is attached to a DIFFERENT carbon position.',
    whyAreTheyIsomers: 'Both compounds have formula C₃H₈O and are aliphatic alcohols with a 3-carbon parent chain. However, propan-1-ol has the –OH group on the end carbon (Carbon 1), while propan-2-ol has the –OH group on the central carbon (Carbon 2).',
    keyDifferentiatingRule: 'The locant number of the functional group changes (1 vs 2), altering whether the alcohol is primary (1°) or secondary (2°).',
    compoundA: {
      name: 'propan-1-ol (1-propanol)',
      condensed: 'CH₃–CH₂–CH₂–OH',
      structuralType: 'Primary (1°) Alcohol: –OH on terminal carbon 1',
      boilingPoint: '97.2 °C',
      notes: 'Primary alcohol: readily oxidized to propanal (aldehyde) and then to propanoic acid (carboxylic acid).',
      diagramType: 'chain'
    },
    compoundB: {
      name: 'propan-2-ol (isopropanol / rubbing alcohol)',
      condensed: 'CH₃–CH(OH)–CH₃',
      structuralType: 'Secondary (2°) Alcohol: –OH on middle carbon 2',
      boilingPoint: '82.6 °C',
      notes: 'Secondary alcohol: oxidizes to propanone (acetone, a ketone) and cannot be oxidized further without breaking C–C bonds.',
      diagramType: 'branched'
    },
    educationalInsight: 'Position isomers have very similar chemical properties because they have the same functional group, but their reaction products (e.g. oxidation products) differ!'
  },
  {
    id: 'isomer-functional-c2h6o',
    type: 'Functional Group',
    molecularFormula: 'C₂H₆O',
    title: 'Functional-Group Isomerism: Alcohol vs Ether',
    conceptSummary: 'Functional group isomers have the same molecular formula but belong to completely DIFFERENT homologous series with different functional groups.',
    whyAreTheyIsomers: 'Both ethanol and methoxymethane contain 2 Carbons, 6 Hydrogens, and 1 Oxygen (C₂H₆O). Yet ethanol is an alcohol with an –OH group, while methoxymethane is an ether with a –C–O–C– linkage!',
    keyDifferentiatingRule: 'Look for different functional groups: an alcohol (R–OH) versus an ether (R–O–R\'). They have dramatically different chemical and physical properties.',
    compoundA: {
      name: 'ethanol',
      condensed: 'CH₃–CH₂–OH',
      structuralType: 'Alcohol: contains –OH hydroxyl group',
      boilingPoint: '78.3 °C (Liquid at room temp)',
      notes: 'Contains polar O–H bond capable of strong intermolecular HYDROGEN BONDING. Reacts vigorously with sodium metal to release hydrogen gas (H₂).',
      diagramType: 'chain'
    },
    compoundB: {
      name: 'methoxymethane (dimethyl ether)',
      condensed: 'CH₃–O–CH₃',
      structuralType: 'Ether: oxygen sandwiched between two alkyl groups (C–O–C)',
      boilingPoint: '-24.0 °C (Gas at room temp)',
      notes: 'No hydrogen attached directly to oxygen, so it CANNOT form intermolecular hydrogen bonds with itself. Does NOT react with sodium metal!',
      diagramType: 'chain'
    },
    educationalInsight: 'JAMB / WAEC Classic Question: "Which pair of compounds are functional isomers?" Pair 1: Alcohol and Ether (CnH2n+2O). Pair 2: Aldehyde and Ketone (CnH2nO). Pair 3: Carboxylic Acid and Ester (CnH2nO2)!'
  },
  {
    id: 'isomer-geometric-cis-trans',
    type: 'Geometric (Cis/Trans & E/Z)',
    molecularFormula: 'C₄H₈',
    title: 'Geometrical Stereoisomerism in But-2-ene',
    conceptSummary: 'Molecules with the same bond connectivity but different spatial arrangements around a rigid double bond that CANNOT freely rotate.',
    whyAreTheyIsomers: 'Because the carbon-carbon double bond (C=C) has a pi bond above and below the plane, rotation around it is restricted at room temperature. In cis-but-2-ene both methyl groups point to the SAME side, while in trans-but-2-ene they point to OPPOSITE sides.',
    keyDifferentiatingRule: 'Requirement 1: Restricted rotation (C=C double bond or ring). Requirement 2: Each double-bonded carbon must have TWO DIFFERENT groups attached to it (e.g. –H and –CH₃).',
    compoundA: {
      name: 'cis-but-2-ene ( (Z)-but-2-ene )',
      condensed: 'CH₃–CH = CH–CH₃ (Same side / Cis)',
      structuralType: 'Cis (Latin "on this side"): both –CH₃ groups on the same side of the double bond',
      boilingPoint: '3.7 °C',
      notes: 'Has a net dipole moment (polar molecule) because both polar C–C dipoles reinforce each other upwards, giving it a higher boiling point.',
      diagramType: 'cis'
    },
    compoundB: {
      name: 'trans-but-2-ene ( (E)-but-2-ene )',
      condensed: 'CH₃–CH = CH–CH₃ (Opposite sides / Trans)',
      structuralType: 'Trans (Latin "across"): –CH₃ groups on opposite diagonal sides of the double bond',
      boilingPoint: '0.9 °C',
      notes: 'Symmetrical: bond dipoles cancel out (non-polar molecule, dipole moment = 0). However, it packs better into crystal lattices, giving a HIGHER melting point!',
      diagramType: 'trans'
    },
    educationalInsight: 'E/Z System (Advanced): Used when 3 or 4 different groups are on the double bond using Cahn-Ingold-Prelog (CIP) priority. Z = "Zusammen" (together/same side, like cis). E = "Entgegen" (opposite side, like trans). Remember: "Z" on ze Zame Zide!'
  },
  {
    id: 'isomer-optical-enantiomers',
    type: 'Optical (Enantiomers)',
    molecularFormula: 'C₄H₉Cl',
    title: 'Optical Isomerism & Chiral Centres',
    conceptSummary: 'Molecules that are non-superimposable mirror images of each other, rotating plane-polarized light in opposite directions (+/- or d/l).',
    whyAreTheyIsomers: 'A carbon atom bonded to FOUR ENTIRELY DIFFERENT atoms or groups is called an ASYMMETRIC or CHIRAL carbon. In 2-chlorobutane, Carbon 2 is bonded to: (1) –H, (2) –Cl, (3) –CH₃, and (4) –CH₂CH₃. Because all 4 groups are different, the molecule lacks a plane of symmetry.',
    keyDifferentiatingRule: 'Enantiomers have identical physical properties (same boiling point, melting point, density) except they rotate plane-polarized light in opposite directions (+ and -) and react differently with other chiral biological molecules (e.g. enzymes).',
    compoundA: {
      name: '(S)-2-chlorobutane',
      condensed: 'CH₃–C*H(Cl)–CH₂–CH₃',
      structuralType: 'Chiral center at C-2: Left-handed spatial configuration',
      boilingPoint: '68 °C',
      notes: 'Non-superimposable on its mirror image, just like your left hand cannot be superimposed on your right hand with palms facing the same direction!',
      diagramType: 'chiral'
    },
    compoundB: {
      name: '(R)-2-chlorobutane',
      condensed: 'CH₃–C*H(Cl)–CH₂–CH₃',
      structuralType: 'Chiral center at C-2: Right-handed spatial configuration',
      boilingPoint: '68 °C',
      notes: 'Mirror image enantiomer. An equimolar 50:50 mixture of both enantiomers is called a RACEMIC MIXTURE (racemate), which is optically inactive because the opposing rotations cancel out.',
      diagramType: 'chiral'
    },
    educationalInsight: 'Quick Exam Check for Optical Activity: Look for a carbon attached to 4 different groups (–H, –OH, –COOH, –CH₃, etc.). If found, the compound is chiral and shows optical isomerism!'
  }
];
