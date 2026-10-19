import type { Lesson } from '../types/chemistry';

export const LESSONS_DATA: Lesson[] = [
  {
    id: 'lesson-1-chain',
    topicId: 'chain_identification',
    title: 'Finding the Longest Carbon Chain',
    category: 'Fundamentals',
    difficulty: 'Beginner',
    duration: '4 min',
    summary: 'The foundation of all IUPAC naming: spotting the unbroken path with the most carbon atoms.',
    explanation: `Before you name any organic molecule, you must find its backbone—called the **parent chain**. 
    
A common mistake students make is reading left-to-right only in a straight horizontal line. But carbon chains can bend, twist, or turn corners! 

**The Rule:** Count every continuous path of connected carbon atoms without lifting your pencil or doubling back over a bond. The path with the highest number of carbons wins as the parent chain.`,
    keyRule: 'The parent chain is the LONGEST CONTINUOUS unbroken carbon chain containing the highest priority functional group or multiple bonds.',
    whyExplanation: 'Why do we need the longest chain? In chemistry, naming is systematic so every chemist in the world draws the exact same structure from a single name. Having one standardized longest chain prevents naming ambiguity.',
    visualMolecule: {
      condensed: 'CH₃–CH₂–CH(CH₂–CH₃)–CH₂–CH₂–CH₃',
      iupacName: '3-ethylhexane (6 carbons, NOT 5!)',
      parentChainCarbons: 6,
      notes: 'Notice how bending down into the -CH2-CH3 gives 6 carbons, whereas straight horizontal line gives only 5 carbons (pentane). Hexane is the true parent chain!'
    },
    keyTakeaways: [
      'Carbon chains can turn corners or bend at 90° / 120° angles.',
      'Do not assume the longest chain is always horizontal.',
      'If two chains have identical length, choose the one with the greater number of substituents.'
    ],
    commonMistakes: [
      'Only counting carbons drawn in a straight line.',
      'Counting carbons attached to oxygen or nitrogen as part of the carbon chain.'
    ]
  },
  {
    id: 'lesson-2-numbering',
    topicId: 'numbering_rules',
    title: 'Numbering the Parent Chain (Lowest Locant Rule)',
    category: 'Fundamentals',
    difficulty: 'Beginner',
    duration: '5 min',
    summary: 'How to number your carbon chain from the end that gives branches and groups the lowest numbers.',
    explanation: `Once you have identified the parent chain, you have exactly two choices: number from **left-to-right** or **right-to-left**.

IUPAC uses the **Lowest Locant Rule**: number from the direction that gives any branch (substituent) or functional group the lowest possible numbers at the first point of difference.

For example, comparing (2, 4) versus (3, 5): 2 is lower than 3, so the numbering that gives 2 wins immediately!`,
    keyRule: 'Always number from the terminus (end) that gives the lowest position numbers (locants) to substituents and functional groups.',
    whyExplanation: 'Why the lowest numbers? Chemists want the smallest integers possible to make names compact and eliminate confusion between mirror-image numbering directions.',
    visualMolecule: {
      condensed: 'CH₃–CH(CH₃)–CH₂–CH₂–CH₃',
      iupacName: '2-methylpentane (numbered Left-to-Right)',
      parentChainCarbons: 5,
      notes: 'Left-to-right gives branch at C-2. Right-to-left gives branch at C-4. Since 2 < 4, we must number from left to right!'
    },
    keyTakeaways: [
      'Compare position numbers at the first point of difference.',
      'Principal functional groups (like -OH, -COOH) take numbering priority over simple alkyl groups.',
      'If a tie occurs from both ends, assign lower numbers according to alphabetical order of substituents.'
    ],
    commonMistakes: [
      'Always starting numbering from Carbon 1 on the left side of the page.',
      'Adding numbers together instead of comparing the first point of difference.'
    ]
  },
  {
    id: 'lesson-3-prefixes',
    topicId: 'prefixes_alkanes',
    title: 'Carbon Chain Prefixes (1 to 10 Carbons)',
    category: 'Fundamentals',
    difficulty: 'Beginner',
    duration: '3 min',
    summary: 'Memorize the universal Greek/Latin roots: meth, eth, prop, but, pent, hex, hept, oct, non, dec.',
    explanation: `The root name of an organic molecule tells you how many carbons form the parent chain:

1 Carbon = **Meth-** (e.g. Methane)
2 Carbons = **Eth-** (e.g. Ethane)
3 Carbons = **Prop-** (e.g. Propane)
4 Carbons = **But-** (e.g. Butane - rhymes with "cute" root)
5 Carbons = **Pent-** (e.g. Pentane, like pentagon)
6 Carbons = **Hex-** (e.g. Hexane, like hexagon)
7 Carbons = **Hept-** (e.g. Heptane)
8 Carbons = **Oct-** (e.g. Octane, like octopus)
9 Carbons = **Non-** (e.g. Nonane)
10 Carbons = **Dec-** (e.g. Decane, like decade)

**Memory Trick for 1-4:** **M**onkeys **E**at **P**eanut **B**utter (Meth-, Eth-, Prop-, But-). Carbons 5-10 use regular geometric prefixes.`,
    keyRule: 'Root prefix = number of carbon atoms in parent chain.',
    whyExplanation: 'Why these specific roots? Meth- comes from Greek "methy" (wine), Eth- from "aither" (sky/ether), Prop- from propionic acid, and But- from butyric acid (butter). After 4, IUPAC adopted Greek number prefixes.',
    visualMolecule: {
      condensed: 'CH₃–CH₂–CH₂–CH₂–CH₃',
      iupacName: 'pentane (5 Carbons: Pent- + -ane)',
      parentChainCarbons: 5,
      notes: '5 straight carbons without double bonds = pent- + -ane = pentane.'
    },
    keyTakeaways: [
      'Carbons 1-4: Meth-, Eth-, Prop-, But-.',
      'Carbons 5-10: Pent-, Hex-, Hept-, Oct-, Non-, Dec-.',
      'Saturated hydrocarbons (single C-C bonds only) take the suffix "-ane".'
    ],
    commonMistakes: [
      'Mixing up Prop- (3) and But- (4). Remember M-E-P-B!',
      'Forgetting that the prefix includes EVERY carbon in the continuous chain, not just the middle ones.'
    ]
  },
  {
    id: 'lesson-4-alkenes-alkynes',
    topicId: 'alkenes_alkynes',
    title: 'Alkenes and Alkynes (Double & Triple Bonds)',
    category: 'Hydrocarbons',
    difficulty: 'Intermediate',
    duration: '5 min',
    summary: 'Master the unsaturated suffixes "-ene" and "-yne" and how to locate multiple bonds.',
    explanation: `When carbons share multiple pairs of electrons:
- **Alkene:** Contains one or more carbon-carbon **double bonds (C=C)**. Suffix changes from -ane to **-ene**.
- **Alkyne:** Contains one or more carbon-carbon **triple bonds (C≡C)**. Suffix changes from -ane to **-yne**.

**Position Locant Rule:** Multiple bonds take higher numbering priority than simple alkyl branches or halogens! The position number is the lower-numbered carbon of the double/triple bond.

For example, a 4-carbon chain with a double bond between C-2 and C-3 is named **but-2-ene** (or 2-butene in older notation; IUPAC 1993/2013 puts the number right before the suffix: *but-2-ene*).`,
    keyRule: 'Give the multiple bond (C=C or C≡C) the lowest possible number, placed directly before -ene or -yne.',
    whyExplanation: 'Why do double bonds take numbering priority over alkyl groups? Double bonds are reactive functional sites (pi bonds) that undergo addition reactions, making them chemically more important than inert C-C single bonds.',
    visualMolecule: {
      condensed: 'CH₃–CH=CH–CH₂–CH₃',
      iupacName: 'pent-2-ene',
      parentChainCarbons: 5,
      notes: 'Numbered from left: C-1, C-2(=), C-3, C-4, C-5. Double bond starts at C-2. If numbered from right, it would be at C-3. 2 < 3, so pent-2-ene.'
    },
    keyTakeaways: [
      'C=C double bond suffix is "-ene".',
      'C≡C triple bond suffix is "-yne".',
      'The double bond must be included in the parent chain even if a longer saturated chain exists!'
    ],
    commonMistakes: [
      'Putting the higher number of the double bond (e.g. calling it pent-3-ene instead of pent-2-ene).',
      'Prioritizing a methyl branch over a double bond when numbering.'
    ]
  },
  {
    id: 'lesson-5-alkyl-substituents',
    topicId: 'alkyl_substituents',
    title: 'Alkyl Branches and Punctuation Rules',
    category: 'Fundamentals',
    difficulty: 'Intermediate',
    duration: '6 min',
    summary: 'How to name methyl, ethyl, propyl branches and write IUPAC names with correct hyphens and commas.',
    explanation: `A carbon branch attached to the parent chain is called an **alkyl group**. It is formed by removing one hydrogen from an alkane:
- -CH₃: **methyl** (from methane)
- -CH₂CH₃: **ethyl** (from ethane)
- -CH₂CH₂CH₃: **propyl** (from propane)
- -CH(CH₃)₂: **isopropyl** (1-methylethyl)

**Multiplier Prefixes:** If the same branch appears more than once, use:
- 2 branches: **di-** (e.g., dimethyl)
- 3 branches: **tri-** (e.g., trimethyl)
- 4 branches: **tetra-** (e.g., tetramethyl)

**Punctuation Rules (Crucial for JAMB & WAEC!):**
1. Use **commas** between numbers: \`2,2-\` or \`2,3-\`
2. Use **hyphens** between numbers and letters: \`2-methyl\`, \`3-ethyl-\`
3. Write the final name as a **single word**: \`2,3-dimethylhexane\` (no spaces!)`,
    keyRule: 'List substituents alphabetically (ethyl before methyl). Prefixes di-, tri-, tetra- are NOT alphabetized.',
    whyExplanation: 'Why ignore di- and tri- in alphabetical order? Because "di" is just a quantity multiplier, not the fundamental name of the branch. Ethyl starts with E, methyl starts with M, regardless of whether there are two methyls ("dimethyl").',
    visualMolecule: {
      condensed: 'CH₃–CH(CH₃)–CH(CH₃)–CH₂–CH₃',
      iupacName: '2,3-dimethylpentane',
      parentChainCarbons: 5,
      notes: 'Parent chain is 5 carbons (pentane). Methyl branches at C-2 and C-3. Multiplier "di" used because there are two identical branches.'
    },
    keyTakeaways: [
      'Comma between numbers (2,2-). Hyphen between number and word (2-methyl).',
      'Alphabetize by base name: ethyl before methyl, even if it is "dimethyl".',
      'Do not leave spaces between the last substituent and the parent chain.'
    ],
    commonMistakes: [
      'Alphabetizing dimethyl under "D" instead of "M". Ethyl still comes first!',
      'Forgetting the multiplier (writing 2,3-methylpentane instead of 2,3-dimethylpentane).'
    ]
  },
  {
    id: 'lesson-6-alcohols',
    topicId: 'alcohols',
    title: 'Alcohols (-OH Group)',
    category: 'Functional Groups',
    difficulty: 'Intermediate',
    duration: '5 min',
    summary: 'Naming hydroxy compounds with the "-ol" suffix and primary, secondary, and tertiary classification.',
    explanation: `Alcohols contain the hydroxyl functional group: **-OH**.

**IUPAC Naming:**
1. Drop the final "-e" from the parent alkane name and add the suffix **"-ol"** (e.g., ethane → ethan**ol**).
2. For chains of 3 carbons or more, include the **locant** (number) of the carbon bearing the -OH group.
3. The parent chain MUST contain the carbon attached to the -OH group.
4. Number from the end that gives the -OH carbon the lowest number—**the -OH group has higher priority than alkyl branches, halogens, or double bonds!**

**Classification:**
- **Primary (1°):** -OH carbon is attached to 1 other carbon (e.g., ethanol).
- **Secondary (2°):** -OH carbon is attached to 2 other carbons (e.g., propan-2-ol).
- **Tertiary (3°):** -OH carbon is attached to 3 other carbons (e.g., 2-methylpropan-2-ol).`,
    keyRule: 'Replace alkane "-e" with "-ol", giving the -OH carbon the lowest possible locant.',
    whyExplanation: 'Why does -OH outrank alkyl groups? The hydroxyl oxygen has high electronegativity and hydrogen bonding ability, fundamentally dictating the chemical reactivity and boiling point of the molecule.',
    visualMolecule: {
      condensed: 'CH₃–CH₂–CH(CH₃)–CH₂–OH',
      iupacName: '2-methylbutan-1-ol',
      parentChainCarbons: 4,
      notes: 'Parent chain has 4 carbons (butan-1-ol). Carbon 1 is the -OH carbon. Methyl branch is on carbon 2. Answer: 2-methylbutan-1-ol.'
    },
    keyTakeaways: [
      'Suffix: -ol (e.g., propan-1-ol, butan-2-ol).',
      'If multiple -OH groups exist: -diol (2), -triol (3), keeping the full alkane name (e.g., propane-1,2,3-triol / glycerol).',
      'The -OH group outranks alkyl branches and halogens when numbering.'
    ],
    commonMistakes: [
      'Numbering from the end closer to a methyl group instead of the -OH group.',
      'Dropping the "an" infix (e.g., saying "butol" instead of "butan-1-ol").'
    ]
  },
  {
    id: 'lesson-7-carbonyls',
    topicId: 'aldehydes',
    title: 'Aldehydes & Ketones (Carbonyl C=O Groups)',
    category: 'Functional Groups',
    difficulty: 'Intermediate',
    duration: '6 min',
    summary: 'Distinguish terminal carbonyls (aldehydes, -al) from internal carbonyls (ketones, -one).',
    explanation: `Both aldehydes and ketones contain the **carbonyl group (C=O)**:

### 1. Aldehydes (-al)
- The carbonyl carbon is **terminal** (at the very end of the chain, bonded to at least one hydrogen: **-CHO**).
- Suffix: **"-al"** (e.g., methanal, ethanal, propanal).
- **Crucial Rule:** The carbonyl carbon is **ALWAYS Carbon-1**. You never need to write a number for the aldehyde group in a simple chain! (e.g., propanal, NOT propan-1-al).

### 2. Ketones (-one)
- The carbonyl carbon is **internal** (sandwiched between two other carbon atoms: **R–CO–R'**).
- Suffix: **"-one"** (pronounced "own", e.g., propanone, butanone, pentan-2-one).
- For chains of 5 carbons or more, you must specify the position number (e.g., pentan-2-one vs pentan-3-one).`,
    keyRule: 'Aldehydes end in "-al" (C-1 always). Ketones end in "-one" (internal, numbered for lowest locant).',
    whyExplanation: 'Why is an aldehyde carbon always Carbon-1? Because it is attached to hydrogen at the end of a chain; it cannot be internal. Number 1 is mathematically required, so writing "1-al" is redundant.',
    visualMolecule: {
      condensed: 'CH₃–CH₂–C(=O)–CH₃',
      iupacName: 'butanone (or butan-2-one)',
      parentChainCarbons: 4,
      notes: 'Carbonyl C=O is at C-2 (numbered from right). Suffix is -one because it is an internal ketone.'
    },
    keyTakeaways: [
      'Aldehyde suffix: -al (methanal = formaldehyde, ethanal = acetaldehyde).',
      'Ketone suffix: -one (propanone = acetone).',
      'Aldehyde C is always C-1; ketone C requires a locant for 5+ carbons.'
    ],
    commonMistakes: [
      'Confusing the spelling of -al (aldehyde) with -ol (alcohol) on handwritten exams!',
      'Numbering a ketone from the far end away from the carbonyl.'
    ]
  },
  {
    id: 'lesson-8-carboxylic-acids',
    topicId: 'carboxylic_acids',
    title: 'Carboxylic Acids (-COOH) & Esters (-COOR)',
    category: 'Functional Groups',
    difficulty: 'Advanced',
    duration: '6 min',
    summary: 'Master the top-priority carboxyl group (-oic acid) and the fragrant ester family (-oate).',
    explanation: `### Carboxylic Acids (-COOH)
- Functional group: **-C(=O)OH**, written compactly as **-COOH**.
- Suffix: **"-oic acid"** (e.g., methanoic acid, ethanoic acid).
- **Top Priority:** Carboxylic acids have the highest priority of all standard high school functional groups.
- The carboxyl carbon is **ALWAYS Carbon-1**.

### Esters (-COOR)
- Formed by the condensation reaction of a carboxylic acid and an alcohol (esterification).
- Suffix: **"-oate"**.
- **Two-Part Naming Strategy:**
  1. First word: Name the alkyl group attached directly to the single-bonded oxygen (from the alcohol, e.g., "ethyl").
  2. Second word: Name the carbon chain containing the C=O group with suffix "-oate" (e.g., "ethanoate").
  - Example: **ethyl ethanoate** (\`CH₃COOCH₂CH₃\`).`,
    keyRule: 'Carboxylic acids = "-oic acid" (C-1 always). Esters = "[alkyl] [alkanoate]" two-word name.',
    whyExplanation: 'Why do carboxylic acids have top priority? The carboxyl group combines both a carbonyl and a hydroxyl group, giving it strong resonance stabilization, highest acidity, and strong polarity.',
    visualMolecule: {
      condensed: 'CH₃–CH(CH₃)–CH₂–COOH',
      iupacName: '3-methylbutanoic acid',
      parentChainCarbons: 4,
      notes: 'Carbonyl carbon of -COOH is C-1. C-2 is CH2, C-3 holds the methyl branch, C-4 is CH3. 3-methylbutanoic acid.'
    },
    keyTakeaways: [
      'Carboxylic acid C is ALWAYS carbon 1.',
      'Ethanoic acid is common acetic acid (vinegar). Methanoic acid is formic acid (ant stings).',
      'Esters have two separate words: [alkyl on oxygen] + [acyl chain + oate].'
    ],
    commonMistakes: [
      'Naming an ester backwards (e.g., calling ethyl methanoate "methyl ethanoate"). Look at which oxygen is double bonded!',
      'Numbering a carboxylic acid from the other end of the chain.'
    ]
  },
  {
    id: 'lesson-9-haloalkanes-amines',
    topicId: 'haloalkanes',
    title: 'Haloalkanes, Amines (-NH₂) & Amides (-CONH₂)',
    category: 'Functional Groups',
    difficulty: 'Advanced',
    duration: '6 min',
    summary: 'Halogen prefixes (fluoro, chloro, bromo, iodo) and nitrogen-containing organic compounds.',
    explanation: `### Haloalkanes (Alkyl Halides)
- Halogens (F, Cl, Br, I) are treated strictly as **substituents** (prefixes):
  - -F: **fluoro-**
  - -Cl: **chloro-**
  - -Br: **bromo-**
  - -I: **iodo-**
- They do NOT change the suffix ending (it stays -ane, -ene, etc.). Example: \`2-bromopropane\`.
- Alphabetize by halogen name: bromo comes before chloro, chloro before fluoro.

### Amines (-NH₂)
- Contain the amino group bonded to carbon: \`R-NH₂\`.
- Suffix: **"-amine"** (e.g., methanamine, ethanamine, or propan-2-amine).

### Amides (-CONH₂)
- Contain a carbonyl attached directly to nitrogen: \`R-C(=O)NH₂\`.
- Suffix: **"-amide"** (e.g., ethanamide, propanamide).`,
    keyRule: 'Halogens are named as prefixes (chloro-, bromo-). Amines end in -amine, amides end in -amide.',
    whyExplanation: 'Why are halogens treated as prefixes rather than suffixes? Historically and structurally, halogen atoms are monovalent terminal substituents that substitute for a hydrogen atom without altering the core functional reactivity class like an -OH or -COOH does.',
    visualMolecule: {
      condensed: 'CH₃–CH(Br)–CH₂–Cl',
      iupacName: '2-bromo-1-chloropropane',
      parentChainCarbons: 3,
      notes: 'Numbered from right so Cl is at C-1 and Br is at C-2 (1,2-locants). Bromo is listed first alphabetically.'
    },
    keyTakeaways: [
      'Halogens are prefixes: bromo-, chloro-, fluoro-, iodo-.',
      'Alphabetize halogens: Bromo > Chloro > Fluoro > Iodo.',
      'Amide is -CONH2 (suffix -amide); Amine is -NH2 (suffix -amine).'
    ],
    commonMistakes: [
      'Changing the suffix of the molecule to "chlorane" or "bromane" (incorrect!).',
      'Confusing amine (-NH2) with amide (-CONH2).'
    ]
  },
  {
    id: 'lesson-10-aromatics',
    topicId: 'aromatics',
    title: 'Benzene and Basic Aromatic Compounds',
    category: 'Special Topics',
    difficulty: 'Advanced',
    duration: '5 min',
    summary: 'Master the planar benzene ring (C₆H₆), IUPAC numbering, and ortho/meta/para naming.',
    explanation: `**Benzene (C₆H₆)** is a 6-carbon cyclic ring with delocalized pi electrons.

### Common Monosubstituted Benzenes:
- Benzene with -CH₃: **Methylbenzene** (common name: **Toluene**)
- Benzene with -OH: **Phenol** (hydroxybenzene)
- Benzene with -NH₂: **Aminobenzene** (common name: **Aniline**)
- Benzene with -COOH: **Benzoic acid**
- Benzene with -NO₂: **Nitrobenzene**

### Disubstituted Benzenes (Position Rules):
When two groups are on the ring:
- **1,2- positions:** Called **ortho- (o-)** (adjacent carbons)
- **1,3- positions:** Called **meta- (m-)** (one carbon in between)
- **1,4- positions:** Called **para- (p-)** (opposite sides of ring)

*JAMB & IJMB test both numbers (e.g. 1,2-dichlorobenzene) and classical terms (o-dichlorobenzene).*`,
    keyRule: 'Number the benzene ring to give substituents the lowest locants. 1,2 = ortho, 1,3 = meta, 1,4 = para.',
    whyExplanation: 'Why do benzene rings show exceptional stability? The six pi electrons are completely delocalized across the ring (resonance aromatic stabilization), making benzene resist addition reactions in favor of substitution.',
    visualMolecule: {
      condensed: 'C₆H₄(CH₃)₂(1,4-)',
      iupacName: '1,4-dimethylbenzene (p-xylene)',
      parentChainCarbons: 6,
      notes: 'Methyl groups are on opposite carbons 1 and 4 of the benzene ring (para position).'
    },
    keyTakeaways: [
      '1,2- = ortho (o-)',
      '1,3- = meta (m-)',
      '1,4- = para (p-)',
      'When benzene is a substituent attached to a longer chain, it is called a "phenyl" group.'
    ],
    commonMistakes: [
      'Treating benzene as a simple cyclohexatriene with separate single and double bonds.',
      'Confusing "phenyl" (-C6H5 substituent) with "phenol" (C6H5OH).'
    ]
  },
  {
    id: 'lesson-11-multifunctional',
    topicId: 'multifunctional',
    title: 'Compounds with Multiple Functional Groups (Priority Rules)',
    category: 'Special Topics',
    difficulty: 'IJMB/JAMB Challenge',
    duration: '7 min',
    summary: 'When a compound has both an -OH and a -COOH, which one decides the suffix? Master IUPAC seniority.',
    explanation: `When a molecule has more than one functional group, you cannot give both a suffix! 

IUPAC has a strict **Seniority / Priority Order**:
1. **Carboxylic acid (-COOH)** → Top King! (suffix: -oic acid)
2. **Ester (-COOR)** → (suffix: -oate)
3. **Amide (-CONH₂)** → (suffix: -amide)
4. **Aldehyde (-CHO)** → (suffix: -al)
5. **Ketone (-CO-)** → (suffix: -one)
6. **Alcohol (-OH)** → (suffix: -ol; if junior: **"hydroxy-"** prefix)
7. **Amine (-NH₂)** → (suffix: -amine; if junior: **"amino-"** prefix)
8. **Alkene / Alkyne (C=C / C≡C)** → (infix: -en- / -yn-)
9. **Halogens & Alkyls (-Cl, -Br, -CH₃)** → Always prefixes!

**The Golden Rule:** The highest priority group wins the **SUFFIX**. All other subordinate functional groups are demoted to **PREFIXES**!`,
    keyRule: 'Highest priority group gets the suffix and lowest locant. Subordinate groups become prefixes (e.g. -OH becomes "hydroxy-").',
    whyExplanation: 'Why does IUPAC demote lower groups to prefixes? A chemical name can only have ONE principal suffix (the functional identity). Secondary groups are simply modifiers describing what is attached to that parent.',
    visualMolecule: {
      condensed: 'CH₃–CH(OH)–CH₂–COOH',
      iupacName: '3-hydroxybutanoic acid',
      parentChainCarbons: 4,
      notes: '-COOH has higher priority than -OH. -COOH is C-1 and gives the suffix "-oic acid". -OH is demoted to the prefix "3-hydroxy-".'
    },
    keyTakeaways: [
      '-COOH > -CHO > -CO- > -OH > -NH2 > Alkene > Halogen/Alkyl.',
      'When demoted to a prefix: -OH becomes "hydroxy-", -NH2 becomes "amino-", C=O becomes "oxo-".',
      'The principal functional group determines carbon 1 / lowest locant direction.'
    ],
    commonMistakes: [
      'Trying to give two suffixes (e.g., calling it "butanol-oic acid" instead of "3-hydroxybutanoic acid").',
      'Numbering from the -OH end instead of the higher priority -COOH end.'
    ]
  }
];
