import type { ExamQuestion } from '../types/chemistry';

export const EXAM_QUESTIONS_DATA: ExamQuestion[] = [
  {
    id: 'jamb-2023-q1',
    exam: 'JAMB',
    year: 2023,
    topic: 'Nomenclature',
    subtopic: 'Alcohols & Branched Chains',
    difficulty: 'Intermediate',
    question: 'What is the correct IUPAC name of the compound with the structural formula: CH₃–CH₂–CH(CH₃)–CH₂–OH ?',
    condensedMolecule: 'CH₃–CH₂–CH(CH₃)–CH₂–OH',
    options: [
      '2-methylbutan-1-ol',
      '3-methylbutan-4-ol',
      '2-ethylpropan-1-ol',
      '3-methylbutan-1-ol'
    ],
    correctOptionIndex: 0,
    explanation: 'Step 1: The principal functional group is –OH (alcohol, suffix "-ol"). Step 2: The longest carbon chain containing the –OH group has 4 carbons (butan-). Step 3: Numbering starts from the right to give the –OH carbon the lowest number (Carbon 1). Step 4: The –CH₃ (methyl) branch is on Carbon 2. Step 5: Combining gives 2-methylbutan-1-ol.',
    whyExplanation: 'Why is Option B (3-methylbutan-4-ol) wrong? Because IUPAC requires numbering from the end closest to the principal functional group (–OH), which gives Carbon 1, NOT Carbon 4. Why is Option C wrong? Because picking a 3-carbon parent chain misses the longest continuous 4-carbon chain!',
    ruleToRemember: 'The principal functional group (-OH) must receive the lowest possible locant (number), outranking simple alkyl branches.',
    namingStepsBreakdown: [
      'Identify principal group: -OH (alcohol, suffix "-ol")',
      'Longest chain with -OH: 4 carbons (butane backbone)',
      'Number from right: C1-OH, C2-CH(CH3), C3-CH2, C4-CH3',
      'Locant for methyl branch: C-2',
      'Assemble: 2-methylbutan-1-ol'
    ]
  },
  {
    id: 'waec-2022-q2',
    exam: 'WAEC',
    year: 2022,
    topic: 'Nomenclature',
    subtopic: 'Branched Alkanes',
    difficulty: 'Beginner',
    question: 'The IUPAC name of the compound (CH₃)₃C–CH₂–CH(CH₃)₂ is:',
    condensedMolecule: '(CH₃)₃C–CH₂–CH(CH₃)₂',
    options: [
      '2,2,4-trimethylpentane',
      '2,4,4-trimethylpentane',
      '2,4-dimethylhexane',
      '1,1,1,3-tetramethylbutane'
    ],
    correctOptionIndex: 0,
    explanation: 'Step 1: Expand the structure: CH₃–C(CH₃)₂–CH₂–CH(CH₃)–CH₃. Step 2: Longest continuous carbon chain has 5 carbons (pentane). Step 3: Compare numbering directions: Left-to-right gives locants (2, 2, 4). Right-to-left gives locants (2, 4, 4). Comparing at the first point of difference (2, 2 vs 2, 4): 2 is lower than 4! Therefore, (2, 2, 4) wins. Step 4: Final IUPAC name is 2,2,4-trimethylpentane.',
    whyExplanation: 'Why is 2,4,4-trimethylpentane wrong? Even though the sum of locants in older textbooks was sometimes mentioned, IUPAC standard compares each number at the first point of difference: the second locant in (2, 2, 4) is 2, which beats 4 in (2, 4, 4).',
    ruleToRemember: 'At the first point of difference between two numbering directions, the set with the lowest number is chosen.',
    namingStepsBreakdown: [
      'Expand parentheses: CH3-C(CH3)2-CH2-CH(CH3)-CH3',
      'Parent chain: 5 carbons (pentane)',
      'Numbering comparison: (2,2,4) vs (2,4,4) -> (2,2,4) wins',
      'Three methyl branches -> trimethyl',
      'Assemble: 2,2,4-trimethylpentane'
    ]
  },
  {
    id: 'jamb-2022-q3',
    exam: 'JAMB',
    year: 2022,
    topic: 'Isomerism',
    subtopic: 'Functional Group Isomers',
    difficulty: 'Intermediate',
    question: 'Which of the following pairs of compounds are functional group isomers?',
    options: [
      'Ethanol and methoxymethane',
      'Propan-1-ol and propan-2-ol',
      'Butane and 2-methylpropane',
      'cis-but-2-ene and trans-but-2-ene'
    ],
    correctOptionIndex: 0,
    explanation: 'Functional group isomers have the same molecular formula but contain completely different functional groups. Both ethanol (CH₃CH₂OH) and methoxymethane (CH₃OCH₃) have the molecular formula C₂H₆O. Ethanol is an alcohol (–OH) while methoxymethane is an ether (–C–O–C–).',
    whyExplanation: 'Propan-1-ol and propan-2-ol are POSITION isomers (same functional group at different positions). Butane and 2-methylpropane are CHAIN isomers (different branching). cis- and trans-but-2-ene are GEOMETRICAL stereoisomers.',
    ruleToRemember: 'Functional group isomer pairs always belong to different homologous families (e.g., alcohol & ether, aldehyde & ketone, carboxylic acid & ester).'
  },
  {
    id: 'neco-2023-q4',
    exam: 'NECO',
    year: 2023,
    topic: 'Nomenclature',
    subtopic: 'Alkenes & Priority',
    difficulty: 'Intermediate',
    question: 'Give the systematic IUPAC name for: CH₃–CH=CH–CH(CH₃)–CH₃',
    condensedMolecule: 'CH₃–CH=CH–CH(CH₃)–CH₃',
    options: [
      '4-methylpent-2-ene',
      '2-methylpent-3-ene',
      '4-methylpent-3-ene',
      '2-methylpent-2-ene'
    ],
    correctOptionIndex: 0,
    explanation: 'Step 1: Functional group is a double bond (C=C), making it an alkene (-ene). Step 2: Parent chain has 5 carbons containing the double bond (pent-). Step 3: Carbon-carbon double bonds take numbering precedence over alkyl branches! Numbering from the left gives the double bond at C-2. Numbering from the right would give the double bond at C-3. 2 < 3, so we number from the left. Step 4: The methyl group is at C-4. Final name: 4-methylpent-2-ene.',
    whyExplanation: 'Why is 2-methylpent-3-ene wrong? A very common student mistake is trying to give the methyl group the lowest number (C-2). But multiple bonds have higher priority than alkyl branches when numbering!',
    ruleToRemember: 'Multiple bonds (alkenes & alkynes) take numbering priority over alkyl branches and halogens.',
    namingStepsBreakdown: [
      'Functional group: C=C alkene (suffix -ene)',
      'Parent chain: 5 carbons (pent-)',
      'Numbering: Left gives double bond at C-2; Right gives double bond at C-3 -> Left wins!',
      'Branch at C-4: methyl',
      'Assemble: 4-methylpent-2-ene'
    ]
  },
  {
    id: 'ijmb-2021-q5',
    exam: 'IJMB',
    year: 2021,
    topic: 'Isomerism',
    subtopic: 'Optical Isomerism & Chirality',
    difficulty: 'Advanced',
    question: 'Which of the following organic compounds exhibits optical isomerism (enantiomerism)?',
    options: [
      '2-chlorobutane',
      '1-chlorobutane',
      '2-chloropropane',
      'Dichloromethane'
    ],
    correctOptionIndex: 0,
    explanation: 'A compound exhibits optical isomerism if it possesses a chiral (asymmetric) carbon atom—a carbon bonded to four entirely different groups. In 2-chlorobutane (CH₃–CH(Cl)–CH₂–CH₃), Carbon 2 is bonded to: (1) –H, (2) –Cl, (3) –CH₃, and (4) –CH₂CH₃. Because all 4 attached groups are distinct, C-2 is chiral and the molecule has non-superimposable mirror images.',
    whyExplanation: 'In 1-chlorobutane, C-1 is bonded to two hydrogens (not 4 different groups). In 2-chloropropane, C-2 is bonded to two identical methyl groups (–CH₃ and –CH₃), so it has an internal plane of symmetry and is achiral.',
    ruleToRemember: 'Optical activity requires an asymmetric carbon bonded to 4 DIFFERENT groups: –H, –X, –R₁, –R₂.'
  },
  {
    id: 'jamb-2021-q6',
    exam: 'JAMB',
    year: 2021,
    topic: 'Nomenclature',
    subtopic: 'Carboxylic Acids',
    difficulty: 'Intermediate',
    question: 'The IUPAC name of CH₃–CH(CH₃)–CH₂–COOH is:',
    condensedMolecule: 'CH₃–CH(CH₃)–CH₂–COOH',
    options: [
      '3-methylbutanoic acid',
      '2-methylbutanoic acid',
      '3-methylbutanal',
      '2-methylbutan-4-oic acid'
    ],
    correctOptionIndex: 0,
    explanation: 'Step 1: Functional group is –COOH (carboxylic acid, suffix "-oic acid"). Step 2: Parent chain has 4 carbons starting from the –COOH carbon. Step 3: The –COOH carbon is ALWAYS Carbon 1! C1(COOH)–C2(CH₂)–C3(CH)–C4(CH₃). Step 4: The methyl branch is at Carbon 3. Step 5: Name is 3-methylbutanoic acid.',
    whyExplanation: 'Why is 2-methylbutanoic acid wrong? Because students who number from the wrong end give the branch number 2. The carboxyl carbon must be Carbon 1!',
    ruleToRemember: 'The carbon of a terminal carboxylic acid (-COOH) is ALWAYS Carbon 1 by definition.',
    namingStepsBreakdown: [
      'Group: -COOH (suffix -oic acid)',
      'Parent: 4 carbons (butanoic acid)',
      'Numbering: C1 at -COOH, so branch is at C-3',
      'Assemble: 3-methylbutanoic acid'
    ]
  },
  {
    id: 'waec-2023-q7',
    exam: 'WAEC',
    year: 2023,
    topic: 'Nomenclature',
    subtopic: 'Esters',
    difficulty: 'Advanced',
    question: 'The sweet-smelling ester with the formula CH₃–COO–CH₂–CH₂–CH₃ is systematically named:',
    condensedMolecule: 'CH₃–COO–CH₂–CH₂–CH₃',
    options: [
      'Propyl ethanoate',
      'Ethyl propanoate',
      'Methyl butanoate',
      'Propyl methanoate'
    ],
    correctOptionIndex: 0,
    explanation: 'Esters have a two-word IUPAC name: [Alkyl group from alcohol] [Alkanoate from carboxylic acid]. Look at the single-bonded oxygen: attached to it is –CH₂–CH₂–CH₃ (propyl group, 3 carbons). Look at the carbonyl (C=O) side: CH₃–C=O has 2 carbons (ethanoate). Putting them together gives propyl ethanoate.',
    whyExplanation: 'Ethyl propanoate would have –CH₂CH₃ attached to the oxygen and CH₃CH₂COO– on the acid side. Do not confuse the alkyl group on oxygen with the acyl chain!',
    ruleToRemember: 'First word = alkyl group on oxygen. Second word = carbon chain containing C=O ending in "-oate".',
    namingStepsBreakdown: [
      'Group: Ester (-COO-)',
      'Alkyl attached to O: -CH2CH2CH3 -> propyl',
      'Acyl chain with C=O: CH3-C=O (2 carbons) -> ethanoate',
      'Assemble: propyl ethanoate'
    ]
  },
  {
    id: 'ijmb-2023-q8',
    exam: 'IJMB',
    year: 2023,
    topic: 'Nomenclature',
    subtopic: 'Multifunctional Seniority Rules',
    difficulty: 'IJMB/JAMB Challenge',
    question: 'According to IUPAC priority rules, what is the systematic name of CH₃–CH(OH)–CH₂–COOH ?',
    condensedMolecule: 'CH₃–CH(OH)–CH₂–COOH',
    options: [
      '3-hydroxybutanoic acid',
      '2-hydroxybutanoic acid',
      '3-hydroxybutan-1-ol',
      '4-hydroxybutan-2-oic acid'
    ],
    correctOptionIndex: 0,
    explanation: 'Step 1: Seniority check: –COOH outranks –OH. Therefore, –COOH gives the suffix "-oic acid", and –OH is demoted to the prefix "hydroxy-". Step 2: The carboxyl carbon is C-1: C1(COOH)–C2(CH₂)–C3(CH–OH)–C4(CH₃). Step 3: The –OH group is on Carbon 3. Name: 3-hydroxybutanoic acid.',
    whyExplanation: 'Why is it not named as an alcohol? Because IUPAC rules dictate that only the highest priority group determines the suffix. Since carboxylic acids are higher priority than alcohols, -OH cannot be a suffix.',
    ruleToRemember: 'Seniority: -COOH > -COOR > -CONH2 > -CHO > -CO- > -OH > -NH2. Demoted -OH becomes "hydroxy-".'
  },
  {
    id: 'jamb-2020-q9',
    exam: 'JAMB',
    year: 2020,
    topic: 'Isomerism',
    subtopic: 'Geometrical (Cis/Trans) Isomerism',
    difficulty: 'Intermediate',
    question: 'Which of the following alkenes can exhibit geometrical (cis-trans) isomerism?',
    options: [
      'But-2-ene',
      'Propene',
      '2-methylpropene',
      'But-1-ene'
    ],
    correctOptionIndex: 0,
    explanation: 'For an alkene to exhibit cis-trans isomerism, each double-bonded carbon must have TWO DIFFERENT atoms or groups attached to it. In but-2-ene (CH₃–CH=CH–CH₃), each double-bonded carbon has an –H and a –CH₃ attached. In propene (CH₂=CH–CH₃) and but-1-ene (CH₂=CH–CH₂CH₃), Carbon 1 has two identical hydrogens (–H and –H), which makes geometrical isomerism impossible.',
    whyExplanation: 'Why does 2-methylpropene fail? Because Carbon 2 is attached to two identical methyl groups (–CH₃ and –CH₃), and Carbon 1 has two identical hydrogens.',
    ruleToRemember: 'Geometric isomerism requires restricted rotation AND two DIFFERENT groups on each double-bonded carbon.'
  },
  {
    id: 'neco-2022-q10',
    exam: 'NECO',
    year: 2022,
    topic: 'Nomenclature',
    subtopic: 'Haloalkanes',
    difficulty: 'Beginner',
    question: 'What is the IUPAC name for CH₃–CH(Br)–CH₂–CH₂–Cl ?',
    condensedMolecule: 'CH₃–CH(Br)–CH₂–CH₂–Cl',
    options: [
      '3-bromo-1-chlorobutane',
      '2-bromo-4-chlorobutane',
      '1-chloro-3-bromobutane',
      '2-chlorobromobutane'
    ],
    correctOptionIndex: 0,
    explanation: 'Step 1: Longest chain has 4 carbons (butane). Step 2: Compare numbering: Left-to-right gives locants (2, 4). Right-to-left gives locants (1, 3). Since 1 < 2, right-to-left wins! Step 3: Carbon 1 has Chlorine, Carbon 3 has Bromine. Step 4: Alphabetical order of prefixes: "bromo" comes before "chloro" alphabetically regardless of their numbers! Final name: 3-bromo-1-chlorobutane.',
    whyExplanation: 'Why not 1-chloro-3-bromobutane? Because substituents must be written in alphabetical order: Bromo precedes Chloro in the written name, even though chlorine has the lower number 1.',
    ruleToRemember: 'Numbering is chosen by lowest locants (1, 3 beats 2, 4). But substituent names are arranged ALPHABETICALLY (bromo before chloro).',
    namingStepsBreakdown: [
      'Parent chain: 4 carbons (butane)',
      'Compare numbering: Right-to-left (1, 3) vs Left-to-right (2, 4) -> (1, 3) wins!',
      'Locants: 1-chloro, 3-bromo',
      'Alphabetical arrangement: Bromo before Chloro',
      'Assemble: 3-bromo-1-chlorobutane'
    ]
  },
  {
    id: 'waec-2021-q11',
    exam: 'WAEC',
    year: 2021,
    topic: 'Isomerism',
    subtopic: 'Chain vs Position Isomerism',
    difficulty: 'Beginner',
    question: 'How many structural chain isomers exist for the molecular formula C₅H₁₂ (pentane)?',
    options: [
      '3',
      '2',
      '4',
      '5'
    ],
    correctOptionIndex: 0,
    explanation: 'C₅H₁₂ has exactly 3 structural isomers: (1) Pentane (straight chain: CH₃–CH₂–CH₂–CH₂–CH₃), (2) 2-methylbutane (isopentane: CH₃–CH(CH₃)–CH₂–CH₃), and (3) 2,2-dimethylpropane (neopentane: C(CH₃)₄).',
    whyExplanation: 'Why isn\'t 3-methylbutane a fourth isomer? Because numbering 3-methylbutane from the other end gives 2-methylbutane! They are the exact same molecule flipped horizontally.',
    ruleToRemember: 'Always test if a suspected new isomer can be renamed into an existing one by numbering from the other end.'
  },
  {
    id: 'jamb-2024-q12',
    exam: 'JAMB',
    year: 2024,
    topic: 'Nomenclature',
    subtopic: 'Alkynes',
    difficulty: 'Intermediate',
    question: 'The IUPAC name of the compound CH≡C–CH(CH₃)–CH₂–CH₃ is:',
    condensedMolecule: 'CH≡C–CH(CH₃)–CH₂–CH₃',
    options: [
      '3-methylpent-1-yne',
      '3-methylpent-4-yne',
      '2-ethylbut-3-yne',
      '1-pentyne-3-methyl'
    ],
    correctOptionIndex: 0,
    explanation: 'Step 1: The triple bond (C≡C) identifies this as an alkyne (suffix "-yne"). Step 2: The longest chain containing the triple bond has 5 carbons (pentyne). Step 3: Numbering from the left gives the triple bond C-1. Step 4: The methyl branch is at C-3. Final name: 3-methylpent-1-yne.',
    whyExplanation: 'Why is 2-ethylbut-3-yne wrong? The parent chain must be the longest continuous chain of carbons containing the multiple bond (5 carbons, pent-), not 4 carbons.',
    ruleToRemember: 'The triple bond must be part of the parent chain and receives the lowest possible locant.',
    namingStepsBreakdown: [
      'Identify alkyne: C≡C (suffix -yne)',
      'Longest chain with triple bond: 5 carbons (pent-)',
      'Number from triple bond end: C-1 is triple bond carbon',
      'Methyl branch at C-3',
      'Assemble: 3-methylpent-1-yne'
    ]
  },
  {
    id: 'waec-2020-q13',
    exam: 'WAEC',
    year: 2020,
    topic: 'Nomenclature',
    subtopic: 'Carbonyls (Aldehydes vs Ketones)',
    difficulty: 'Intermediate',
    question: 'What is the systematic IUPAC name for CH₃–CH₂–CO–CH(CH₃)₂ ?',
    condensedMolecule: 'CH₃–CH₂–CO–CH(CH₃)₂',
    options: [
      '2-methylpentan-3-one',
      '4-methylpentan-3-one',
      'Ethyl isopropyl ketone',
      '2-methylpentan-2-one'
    ],
    correctOptionIndex: 0,
    explanation: 'Step 1: Functional group is a non-terminal carbonyl (C=O), so it is a ketone (suffix "-one"). Step 2: Longest carbon chain containing the C=O group has 5 carbons (pentan-). Step 3: Numbering from the right gives: C-1 (CH₃), C-2 (CH with methyl), C-3 (C=O), C-4 (CH₂), C-5 (CH₃). The carbonyl is at C-3 either way, but numbering from the right gives the methyl branch the lower number 2 (rather than 4). Step 4: Name is 2-methylpentan-3-one.',
    whyExplanation: 'Why is "Ethyl isopropyl ketone" not the IUPAC name? That is the traditional common name, but WAEC and JAMB demand systematic IUPAC nomenclature!',
    ruleToRemember: 'When the principal functional group has the same locant from both ends, number from the end that gives substituents lower numbers.',
    namingStepsBreakdown: [
      'Group: Ketone (suffix -one)',
      'Parent: 5 carbons (pentan-)',
      'Carbonyl position: C-3 from both ends (tie)',
      'Break tie: Number from right so methyl gets C-2 (2 < 4)',
      'Assemble: 2-methylpentan-3-one'
    ]
  },
  {
    id: 'ijmb-2022-q14',
    exam: 'IJMB',
    year: 2022,
    topic: 'Nomenclature',
    subtopic: 'Aromatic Compounds',
    difficulty: 'Advanced',
    question: 'What is the IUPAC name of a benzene ring with a methyl group at carbon 1 and a chlorine atom at carbon 4?',
    options: [
      '1-chloro-4-methylbenzene (or 4-chlorotoluene)',
      '1,4-chloromethylbenzene',
      'para-chlorobenzene',
      '4-chloro-1-methylcyclohexane'
    ],
    correctOptionIndex: 0,
    explanation: 'In disubstituted benzenes, substituents are numbered to give the lowest possible locants (1,4-). Alphabetically, "chloro" precedes "methyl", giving 1-chloro-4-methylbenzene. Alternatively, IUPAC accepts toluene as a recognized parent name, making it 4-chlorotoluene (or p-chlorotoluene).',
    whyExplanation: 'Why not 4-chloro-1-methylcyclohexane? Cyclohexane has no aromatic pi-delocalization (it is an aliphatic 6-carbon saturated ring). Benzene has the alternating delocalized ring system!',
    ruleToRemember: 'Substituents on benzene are alphabetized (chloro before methyl). 1,4- is also called the para (p-) position.'
  },
  {
    id: 'jamb-2023-q15',
    exam: 'JAMB',
    year: 2023,
    topic: 'Nomenclature',
    subtopic: 'Amines & Nitrogen Groups',
    difficulty: 'Intermediate',
    question: 'The IUPAC name of CH₃–CH(NH₂)–CH₂–CH₃ is:',
    condensedMolecule: 'CH₃–CH(NH₂)–CH₂–CH₃',
    options: [
      'Butan-2-amine (or 2-aminobutane)',
      'Butan-3-amine',
      '1-methylpropan-1-amine',
      'Sec-butylamine'
    ],
    correctOptionIndex: 0,
    explanation: 'Step 1: The functional group is –NH₂ (amine, suffix "-amine"). Step 2: The longest carbon chain containing the –NH₂ group has 4 carbons (butane). Step 3: Number from the left to give –NH₂ the lowest locant: Carbon 2. Step 4: Suffix is butan-2-amine.',
    whyExplanation: 'Sec-butylamine is the traditional common name, but JAMB specifically requests IUPAC nomenclature. Butan-3-amine is incorrect because numbering from the left gives 2, which is lower than 3.',
    ruleToRemember: 'Amines end in "-amine", with a locant indicating which carbon holds the nitrogen group.'
  }
];
