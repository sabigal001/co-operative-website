import type { CompoundNomenclatureModel } from '../types/chemistry';

export const NOMENCLATURE_COMPOUNDS: CompoundNomenclatureModel[] = [
  {
    id: 'compound-1-methylbutanol',
    name: '2-methylbutan-1-ol',
    commonName: 'Active amyl alcohol',
    formula: 'C5H12O',
    condensedFormula: 'CH₃–CH₂–CH(CH₃)–CH₂–OH',
    difficulty: 'Intermediate',
    family: 'Alcohol',
    description: 'A branched primary alcohol. Demonstrates priority of the -OH group over alkyl branches and correct numbering.',
    carbonsCount: 4,
    functionalGroup: 'Hydroxyl group (-OH)',
    carbonNodes: [
      { id: 4, label: 'CH₃', numberLtoR: 1, numberRtoL: 4, correctNumber: 4, isParentChain: true },
      { id: 3, label: 'CH₂', numberLtoR: 2, numberRtoL: 3, correctNumber: 3, isParentChain: true },
      { id: 2, label: 'CH', numberLtoR: 3, numberRtoL: 2, correctNumber: 2, isParentChain: true, substituent: 'CH₃ (methyl)' },
      { id: 1, label: 'CH₂', numberLtoR: 4, numberRtoL: 1, correctNumber: 1, isParentChain: true, isFunctionalGroup: true }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Identify the main functional group',
        highlightedFocus: 'functional_group',
        explanation: 'The compound contains an –OH (hydroxyl) group attached to a carbon.',
        whyThisStep: 'The principal functional group dictates the characteristic suffix of the chemical name and gives you the highest priority when numbering.',
        ruleCitation: 'IUPAC Rule P-44: The principal functional group determines the ending suffix of the parent structure (here: "-ol").',
        visualFeedback: {
          condensedFormula: 'CH₃–CH₂–CH(CH₃)–CH₂–[OH]',
          badge: 'Principal Functional Group: -OH (Alcohol → Suffix: -ol)'
        }
      },
      {
        stepNumber: 2,
        title: 'Step 2: Find the appropriate parent chain',
        highlightedFocus: 'parent_chain',
        explanation: 'Find the longest continuous carbon chain that CONTAINS the carbon attached to the –OH group. Tracing from the -CH₂OH end through the chain gives 4 carbons.',
        whyThisStep: 'Even if a longer carbon branch existed elsewhere, the parent chain MUST contain the principal functional group carbon.',
        ruleCitation: 'IUPAC Rule P-52: The parent structure must contain the principal functional group. 4 carbons = prefix "butan-".',
        visualFeedback: {
          condensedFormula: '[CH₃–CH₂–CH(CH₃)–CH₂]–OH',
          badge: 'Parent Chain: 4 Carbons (Butan-)'
        }
      },
      {
        stepNumber: 3,
        title: 'Step 3: Number the chain correctly',
        highlightedFocus: 'numbering',
        explanation: 'We number the 4-carbon chain from the right-hand side: C1 (CH₂OH), C2 (CH), C3 (CH₂), C4 (CH₃).',
        whyThisStep: 'IUPAC gives functional groups (like –OH) numbering priority over simple alkyl branches. Starting from the right gives –OH position 1; starting from the left would give –OH position 4.',
        ruleCitation: 'Lowest Locant Rule: C-1 for principal group is preferred over C-4. 1 < 4.',
        visualFeedback: {
          condensedFormula: 'C4(H₃) — C3(H₂) — C2(H, CH₃) — C1(H₂)–OH',
          badge: 'Right-to-Left: C1-OH, C2-Methyl (Correct!)'
        }
      },
      {
        stepNumber: 4,
        title: 'Step 4: Identify substituents',
        highlightedFocus: 'substituents',
        explanation: 'Attached to Carbon 2 is a single-carbon branch: a –CH₃ group, which is a "methyl" substituent.',
        whyThisStep: 'Substituents are branches sticking out from the parent chain that modify the parent molecule.',
        ruleCitation: 'Alkyl branches derived from methane (CH₄ minus H) are named "methyl".',
        visualFeedback: {
          condensedFormula: 'CH₃–CH₂–CH([CH₃])–CH₂–OH',
          badge: 'Substituent: Methyl (-CH₃)'
        }
      },
      {
        stepNumber: 5,
        title: 'Step 5: Give their positions',
        highlightedFocus: 'locants',
        explanation: 'The methyl group is attached to Carbon 2. The –OH group is attached to Carbon 1.',
        whyThisStep: 'Every substituent and functional group must have a specific address (locant number) so a reader knows exactly where to attach it.',
        ruleCitation: 'Locants are placed immediately before the component they describe (2-methyl and -1-ol).',
        visualFeedback: {
          condensedFormula: 'Substituent at Carbon 2 | Functional group at Carbon 1',
          badge: 'Locants: 2-methyl, butan-1-ol'
        }
      },
      {
        stepNumber: 6,
        title: 'Step 6: Arrange the name correctly',
        highlightedFocus: 'assembly',
        explanation: 'Assemble in standard IUPAC order: [Prefixes with locants] + [Parent chain] + [Infix] + [Suffix with locant].',
        whyThisStep: 'Use hyphens between numbers and letters. Do not add spaces.',
        ruleCitation: 'Formula: 2-methyl + butan + 1-ol = 2-methylbutan-1-ol.',
        visualFeedback: {
          condensedFormula: '2-methyl + butan + -1-ol',
          badge: 'Assembly: 2-methylbutan-1-ol'
        }
      },
      {
        stepNumber: 7,
        title: 'Step 7: Show the final IUPAC name',
        highlightedFocus: 'final',
        explanation: 'Final IUPAC Name: 2-methylbutan-1-ol (in older JAMB/WAEC textbooks sometimes written as 2-methyl-1-butanol).',
        whyThisStep: 'Both formats are recognized in West African exams, but 2-methylbutan-1-ol follows the 1993/2013 international standard.',
        ruleCitation: 'IUPAC Official: 2-methylbutan-1-ol',
        visualFeedback: {
          condensedFormula: '2-methylbutan-1-ol',
          badge: 'Mastered! Full IUPAC Name verified.'
        }
      }
    ]
  },
  {
    id: 'compound-2-dimethylpentane',
    name: '2,4-dimethylpentane',
    commonName: 'Diisobutylmethane',
    formula: 'C7H16',
    condensedFormula: 'CH₃–CH(CH₃)–CH₂–CH(CH₃)–CH₃',
    difficulty: 'Beginner',
    family: 'Alkane',
    description: 'A branched alkane with two identical methyl branches. Teaches the multiplier prefix "di-" and comma punctuation.',
    carbonsCount: 5,
    functionalGroup: 'Alkane (Only single C–C bonds)',
    carbonNodes: [
      { id: 1, label: 'CH₃', numberLtoR: 1, numberRtoL: 5, correctNumber: 1, isParentChain: true },
      { id: 2, label: 'CH', numberLtoR: 2, numberRtoL: 4, correctNumber: 2, isParentChain: true, substituent: 'CH₃' },
      { id: 3, label: 'CH₂', numberLtoR: 3, numberRtoL: 3, correctNumber: 3, isParentChain: true },
      { id: 4, label: 'CH', numberLtoR: 4, numberRtoL: 2, correctNumber: 4, isParentChain: true, substituent: 'CH₃' },
      { id: 5, label: 'CH₃', numberLtoR: 5, numberRtoL: 1, correctNumber: 5, isParentChain: true }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Identify the main functional group',
        highlightedFocus: 'functional_group',
        explanation: 'There are no heteroatoms (no O, N, halogens) and only single C–C bonds. This is a saturated hydrocarbon: an alkane.',
        whyThisStep: 'Recognizing an alkane sets our final suffix to "-ane".',
        ruleCitation: 'All single carbon-carbon bonds = alkane suffix "-ane".',
        visualFeedback: {
          condensedFormula: 'CH₃–CH(CH₃)–CH₂–CH(CH₃)–CH₃',
          badge: 'Family: Saturated Alkane (-ane)'
        }
      },
      {
        stepNumber: 2,
        title: 'Step 2: Find the appropriate parent chain',
        highlightedFocus: 'parent_chain',
        explanation: 'The longest unbroken chain of carbons contains 5 carbons in a row.',
        whyThisStep: '5 carbons corresponds to the numerical root "pent-".',
        ruleCitation: '5 carbons = pentane.',
        visualFeedback: {
          condensedFormula: '[CH₃–CH–CH₂–CH–CH₃]',
          badge: 'Parent: Pentane (5 carbons)'
        }
      },
      {
        stepNumber: 3,
        title: 'Step 3: Number the chain correctly',
        highlightedFocus: 'numbering',
        explanation: 'Numbering from left gives branches at C-2 and C-4. Numbering from right also gives branches at C-2 and C-4. The molecule is symmetrical!',
        whyThisStep: 'Because both directions yield (2, 4), either direction is chemically equivalent.',
        ruleCitation: 'Symmetrical locants: (2, 4) in both directions.',
        visualFeedback: {
          condensedFormula: 'C1 — C2(CH₃) — C3 — C4(CH₃) — C5',
          badge: 'Numbered 1 to 5 (Symmetrical)'
        }
      },
      {
        stepNumber: 4,
        title: 'Step 4: Identify substituents',
        highlightedFocus: 'substituents',
        explanation: 'There are two separate –CH₃ (methyl) branches attached to the backbone.',
        whyThisStep: 'When multiple identical substituents appear, we use multiplying prefixes (di-, tri-, tetra-).',
        ruleCitation: 'Two identical methyl groups = "dimethyl".',
        visualFeedback: {
          condensedFormula: 'Two methyl (-CH₃) branches',
          badge: 'Substituent: dimethyl'
        }
      },
      {
        stepNumber: 5,
        title: 'Step 5: Give their positions',
        highlightedFocus: 'locants',
        explanation: 'One methyl branch is on Carbon 2, and the other is on Carbon 4. We combine the numbers as 2,4-.',
        whyThisStep: 'IUPAC requires a number for EVERY substituent, even if on the same or different carbons.',
        ruleCitation: 'Commas separate numbers: "2,4-".',
        visualFeedback: {
          condensedFormula: 'Branches at Carbon 2 and Carbon 4',
          badge: 'Locants: 2,4-'
        }
      },
      {
        stepNumber: 6,
        title: 'Step 6: Arrange the name correctly',
        highlightedFocus: 'assembly',
        explanation: 'Combine the locants + multiplier prefix + substituent name + parent alkane.',
        whyThisStep: 'Punctuation: comma between numbers (2,4) and hyphen between number and letter (-dimethylpentane).',
        ruleCitation: '2,4- + dimethyl + pentane.',
        visualFeedback: {
          condensedFormula: '2,4- + dimethyl + pentane',
          badge: 'Structure: 2,4-dimethylpentane'
        }
      },
      {
        stepNumber: 7,
        title: 'Step 7: Show the final IUPAC name',
        highlightedFocus: 'final',
        explanation: 'Final IUPAC Name: 2,4-dimethylpentane',
        whyThisStep: 'Notice there are no spaces anywhere in the name.',
        ruleCitation: 'IUPAC Official: 2,4-dimethylpentane',
        visualFeedback: {
          condensedFormula: '2,4-dimethylpentane',
          badge: 'Mastered!'
        }
      }
    ]
  },
  {
    id: 'compound-3-methylpentene',
    name: '4-methylpent-2-ene',
    commonName: 'Isohexene isomer',
    formula: 'C6H12',
    condensedFormula: 'CH₃–CH=CH–CH(CH₃)–CH₃',
    difficulty: 'Intermediate',
    family: 'Alkene',
    description: 'An alkene with a methyl branch. Highlights why double bonds take numbering precedence over alkyl branches.',
    carbonsCount: 5,
    functionalGroup: 'Alkene (C=C double bond)',
    carbonNodes: [
      { id: 1, label: 'CH₃', numberLtoR: 1, numberRtoL: 5, correctNumber: 1, isParentChain: true },
      { id: 2, label: 'CH', numberLtoR: 2, numberRtoL: 4, correctNumber: 2, isParentChain: true, isFunctionalGroup: true },
      { id: 3, label: 'CH', numberLtoR: 3, numberRtoL: 3, correctNumber: 3, isParentChain: true, isFunctionalGroup: true },
      { id: 4, label: 'CH', numberLtoR: 4, numberRtoL: 2, correctNumber: 4, isParentChain: true, substituent: 'CH₃' },
      { id: 5, label: 'CH₃', numberLtoR: 5, numberRtoL: 1, correctNumber: 5, isParentChain: true }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Identify the main functional group',
        highlightedFocus: 'functional_group',
        explanation: 'The compound contains a carbon-carbon double bond (C=C). This makes it an alkene.',
        whyThisStep: 'The double bond changes the suffix of the molecule from "-ane" to "-ene".',
        ruleCitation: 'Unsaturated C=C bond = alkene suffix "-ene".',
        visualFeedback: {
          condensedFormula: 'CH₃–[CH=CH]–CH(CH₃)–CH₃',
          badge: 'Functional Group: C=C Alkene (-ene)'
        }
      },
      {
        stepNumber: 2,
        title: 'Step 2: Find the appropriate parent chain',
        highlightedFocus: 'parent_chain',
        explanation: 'The longest carbon chain containing both carbons of the C=C double bond has 5 carbons.',
        whyThisStep: 'The parent chain must include the multiple bond even if an all-single-bond side chain were longer.',
        ruleCitation: '5 carbons containing C=C = pentene.',
        visualFeedback: {
          condensedFormula: '[CH₃–CH=CH–CH–CH₃]',
          badge: 'Parent: 5 Carbons (Pent-)'
        }
      },
      {
        stepNumber: 3,
        title: 'Step 3: Number the chain correctly',
        highlightedFocus: 'numbering',
        explanation: 'Left-to-right gives the double bond position C-2 (between C-2 and C-3). Right-to-left gives the methyl group C-2, but the double bond would be at C-3.',
        whyThisStep: 'DOUBLE BONDS TAKE NUMBERING PRIORITY OVER ALKYL BRANCHES! The double bond must get the lower number (2 vs 3).',
        ruleCitation: 'IUPAC Rule: C=C locant (2) beats branch locant.',
        visualFeedback: {
          condensedFormula: 'C1(H₃) — C2(H)=C3(H) — C4(H, CH₃) — C5(H₃)',
          badge: 'Left-to-Right: C-2 double bond beats C-2 branch'
        }
      },
      {
        stepNumber: 4,
        title: 'Step 4: Identify substituents',
        highlightedFocus: 'substituents',
        explanation: 'A single methyl (–CH₃) group is attached to the chain.',
        whyThisStep: 'Identify the branch name before assigning its locant.',
        ruleCitation: '–CH₃ = methyl branch.',
        visualFeedback: {
          condensedFormula: 'Branch: -CH₃ on Carbon 4',
          badge: 'Substituent: methyl'
        }
      },
      {
        stepNumber: 5,
        title: 'Step 5: Give their positions',
        highlightedFocus: 'locants',
        explanation: 'The methyl group is at Carbon 4. The double bond starts at Carbon 2.',
        whyThisStep: 'State the lower number of the two carbons sharing the double bond (C-2 and C-3 → use 2).',
        ruleCitation: 'Locants: 4-methyl and pent-2-ene.',
        visualFeedback: {
          condensedFormula: 'Methyl at C-4, Double bond at C-2',
          badge: 'Locants: 4-methyl, 2-ene'
        }
      },
      {
        stepNumber: 6,
        title: 'Step 6: Arrange the name correctly',
        highlightedFocus: 'assembly',
        explanation: 'Combine prefix + parent + infix/locant + suffix: 4-methyl + pent- + -2-ene.',
        whyThisStep: 'Place the locant 2 directly before "-ene" in current IUPAC (or 4-methyl-2-pentene in older format).',
        ruleCitation: '4-methylpent-2-ene.',
        visualFeedback: {
          condensedFormula: '4-methyl + pent-2-ene',
          badge: '4-methylpent-2-ene'
        }
      },
      {
        stepNumber: 7,
        title: 'Step 7: Show the final IUPAC name',
        highlightedFocus: 'final',
        explanation: 'Final IUPAC Name: 4-methylpent-2-ene',
        whyThisStep: 'Common trap: students who number from the right name it "2-methylpent-3-ene", which is WRONG because the alkene gets the lower number!',
        ruleCitation: 'IUPAC Official: 4-methylpent-2-ene',
        visualFeedback: {
          condensedFormula: '4-methylpent-2-ene',
          badge: 'Mastered! Exam Trap Avoided.'
        }
      }
    ]
  },
  {
    id: 'compound-4-methylbutanoic-acid',
    name: '3-methylbutanoic acid',
    commonName: 'Isovaleric acid',
    formula: 'C5H10O2',
    condensedFormula: 'CH₃–CH(CH₃)–CH₂–COOH',
    difficulty: 'Intermediate',
    family: 'Carboxylic Acid',
    description: 'A carboxylic acid with a methyl branch. Teaches that the carboxyl carbon is always Carbon 1.',
    carbonsCount: 4,
    functionalGroup: 'Carboxyl group (-COOH)',
    carbonNodes: [
      { id: 4, label: 'CH₃', numberLtoR: 1, numberRtoL: 4, correctNumber: 4, isParentChain: true },
      { id: 3, label: 'CH', numberLtoR: 2, numberRtoL: 3, correctNumber: 3, isParentChain: true, substituent: 'CH₃' },
      { id: 2, label: 'CH₂', numberLtoR: 3, numberRtoL: 2, correctNumber: 2, isParentChain: true },
      { id: 1, label: 'COOH', numberLtoR: 4, numberRtoL: 1, correctNumber: 1, isParentChain: true, isFunctionalGroup: true }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Identify the main functional group',
        highlightedFocus: 'functional_group',
        explanation: 'Contains the carboxyl group (-COOH). This is a carboxylic acid, the highest priority group in high-school chemistry!',
        whyThisStep: 'The carboxyl group dictates the suffix: "-oic acid".',
        ruleCitation: 'Carboxyl group = "-oic acid" suffix.',
        visualFeedback: {
          condensedFormula: 'CH₃–CH(CH₃)–CH₂–[COOH]',
          badge: 'Principal Group: -COOH (Carboxylic Acid)'
        }
      },
      {
        stepNumber: 2,
        title: 'Step 2: Find the appropriate parent chain',
        highlightedFocus: 'parent_chain',
        explanation: 'The longest chain of carbons starting from the carboxyl carbon has 4 carbons.',
        whyThisStep: 'The -COOH carbon counts as Carbon-1 of the chain!',
        ruleCitation: '4 carbons = butanoic acid.',
        visualFeedback: {
          condensedFormula: '[CH₃–CH–CH₂–COOH]',
          badge: 'Parent: Butanoic acid (4 carbons)'
        }
      },
      {
        stepNumber: 3,
        title: 'Step 3: Number the chain correctly',
        highlightedFocus: 'numbering',
        explanation: 'Start numbering at the carboxyl carbon (-COOH) as Carbon 1. C-1 = COOH, C-2 = CH₂, C-3 = CH, C-4 = CH₃.',
        whyThisStep: 'The carbon of a carboxylic acid is ALWAYS Carbon 1. There are no exceptions in acyclic chains!',
        ruleCitation: 'IUPAC Rule: Carboxyl carbon is implicitly Carbon 1.',
        visualFeedback: {
          condensedFormula: 'C4(H₃) — C3(H, CH₃) — C2(H₂) — C1(OOH)',
          badge: 'C-1 is ALWAYS the -COOH carbon'
        }
      },
      {
        stepNumber: 4,
        title: 'Step 4: Identify substituents',
        highlightedFocus: 'substituents',
        explanation: 'A –CH₃ (methyl) group is branched off the chain.',
        whyThisStep: 'Identify the branch name.',
        ruleCitation: '–CH₃ = methyl.',
        visualFeedback: {
          condensedFormula: 'Methyl branch on C-3',
          badge: 'Substituent: methyl'
        }
      },
      {
        stepNumber: 5,
        title: 'Step 5: Give their positions',
        highlightedFocus: 'locants',
        explanation: 'The methyl group is attached to Carbon 3.',
        whyThisStep: 'Since -COOH is C-1, C-2 is the CH₂, making the branched carbon C-3.',
        ruleCitation: 'Locant: 3-methyl.',
        visualFeedback: {
          condensedFormula: 'Position: 3-methyl',
          badge: 'Locant: 3'
        }
      },
      {
        stepNumber: 6,
        title: 'Step 6: Arrange the name correctly',
        highlightedFocus: 'assembly',
        explanation: 'Prefix (3-methyl) + parent alkane minus "e" (butan) + suffix (oic acid) as two words.',
        whyThisStep: 'Carboxylic acids are written as two separate words: "[name] acid".',
        ruleCitation: '3-methyl + butanoic + acid.',
        visualFeedback: {
          condensedFormula: '3-methylbutanoic acid',
          badge: 'Two words: [alkanoic] [acid]'
        }
      },
      {
        stepNumber: 7,
        title: 'Step 7: Show the final IUPAC name',
        highlightedFocus: 'final',
        explanation: 'Final IUPAC Name: 3-methylbutanoic acid',
        whyThisStep: 'Do NOT write "3-methylbutan-1-oic acid" — the "1-" is redundant and omitted because the acid carbon is always 1.',
        ruleCitation: 'IUPAC Official: 3-methylbutanoic acid',
        visualFeedback: {
          condensedFormula: '3-methylbutanoic acid',
          badge: 'Mastered!'
        }
      }
    ]
  },
  {
    id: 'compound-5-ethyl-propanoate',
    name: 'ethyl propanoate',
    commonName: 'Ethyl propionate',
    formula: 'C5H10O2',
    condensedFormula: 'CH₃–CH₂–COO–CH₂–CH₃',
    difficulty: 'Advanced',
    family: 'Ester',
    description: 'An ester with a sweet pineapple fragrance. Teaches the two-part naming strategy: [alkyl group on oxygen] + [acyl chain + oate].',
    carbonsCount: 5,
    functionalGroup: 'Ester group (-COO-)',
    carbonNodes: [
      { id: 1, label: 'CH₃', numberLtoR: 1, numberRtoL: 5, correctNumber: 3, isParentChain: true },
      { id: 2, label: 'CH₂', numberLtoR: 2, numberRtoL: 4, correctNumber: 2, isParentChain: true },
      { id: 3, label: 'C=O', numberLtoR: 3, numberRtoL: 3, correctNumber: 1, isParentChain: true, isFunctionalGroup: true },
      { id: 4, label: 'CH₂', numberLtoR: 4, numberRtoL: 2, correctNumber: 1, isParentChain: false, substituent: 'Ethyl on O' },
      { id: 5, label: 'CH₃', numberLtoR: 5, numberRtoL: 1, correctNumber: 2, isParentChain: false }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Identify the main functional group',
        highlightedFocus: 'functional_group',
        explanation: 'Contains the ester linkage: –C(=O)–O– (or –COO–). Suffix is "-oate".',
        whyThisStep: 'Esters are made from an acid and an alcohol, so IUPAC names them in two separate parts.',
        ruleCitation: 'Ester suffix is "-oate".',
        visualFeedback: {
          condensedFormula: 'CH₃–CH₂–[COO]–CH₂–CH₃',
          badge: 'Functional Group: Ester (-oate)'
        }
      },
      {
        stepNumber: 2,
        title: 'Step 2: Find the appropriate parent chain',
        highlightedFocus: 'parent_chain',
        explanation: 'Split the molecule across the single-bonded oxygen. The side containing the carbonyl (C=O) carbon is the parent acid chain: CH₃–CH₂–C(=O)– (3 carbons).',
        whyThisStep: 'The parent chain belongs to the acyl group (the carboxylic acid portion). 3 carbons = propanoate.',
        ruleCitation: 'Acyl part with carbonyl = propanoate.',
        visualFeedback: {
          condensedFormula: '[CH₃–CH₂–C=O]–O–CH₂–CH₃',
          badge: 'Parent (Acid Part): 3 Carbons (Propanoate)'
        }
      },
      {
        stepNumber: 3,
        title: 'Step 3: Number the chain correctly',
        highlightedFocus: 'numbering',
        explanation: 'The carbonyl carbon is Carbon 1 of the acyl chain: C1 (C=O), C2 (CH₂), C3 (CH₃).',
        whyThisStep: 'Just like in carboxylic acids, the carbonyl carbon of the ester is always Carbon 1.',
        ruleCitation: 'Carbonyl carbon = C-1.',
        visualFeedback: {
          condensedFormula: 'C3(H₃)–C2(H₂)–C1(=O)–O–...',
          badge: 'Carbonyl C is C-1'
        }
      },
      {
        stepNumber: 4,
        title: 'Step 4: Identify substituents',
        highlightedFocus: 'substituents',
        explanation: 'Look at the group attached to the single-bonded oxygen: –CH₂–CH₃. That is an "ethyl" group.',
        whyThisStep: 'The group on the single-bonded oxygen comes from the alcohol component and is named as an alkyl word.',
        ruleCitation: 'Alkyl on single-bonded oxygen = "ethyl".',
        visualFeedback: {
          condensedFormula: '...–O–[CH₂–CH₃]',
          badge: 'Alkyl group on oxygen: ethyl'
        }
      },
      {
        stepNumber: 5,
        title: 'Step 5: Give their positions',
        highlightedFocus: 'locants',
        explanation: 'No locant numbers are needed for simple unsubstituted alkyl and alkanoate chains.',
        whyThisStep: 'The position is defined by the oxygen atom itself.',
        ruleCitation: 'Format: [Alkyl] [alkanoate].',
        visualFeedback: {
          condensedFormula: 'First word: ethyl | Second word: propanoate',
          badge: 'Two distinct words'
        }
      },
      {
        stepNumber: 6,
        title: 'Step 6: Arrange the name correctly',
        highlightedFocus: 'assembly',
        explanation: 'Write as two words: [Alkyl group from alcohol] + space + [Parent chain with -oate].',
        whyThisStep: 'Notice this is one of the few organic names with a SPACE between words!',
        ruleCitation: 'Word 1: ethyl, Word 2: propanoate.',
        visualFeedback: {
          condensedFormula: 'ethyl + propanoate',
          badge: 'Name: ethyl propanoate'
        }
      },
      {
        stepNumber: 7,
        title: 'Step 7: Show the final IUPAC name',
        highlightedFocus: 'final',
        explanation: 'Final IUPAC Name: ethyl propanoate',
        whyThisStep: 'JAMB Trap: Never write "propyl ethanoate" for this molecule! The side with the C=O is 3 carbons (propanoate), not 2 carbons.',
        ruleCitation: 'IUPAC Official: ethyl propanoate',
        visualFeedback: {
          condensedFormula: 'ethyl propanoate',
          badge: 'Mastered! Exam Trap Avoided.'
        }
      }
    ]
  },
  {
    id: 'compound-6-hydroxybutanoic-acid',
    name: '3-hydroxybutanoic acid',
    commonName: 'beta-hydroxybutyric acid',
    formula: 'C4H8O3',
    condensedFormula: 'CH₃–CH(OH)–CH₂–COOH',
    difficulty: 'IJMB/JAMB Challenge',
    family: 'Polyfunctional Compound',
    description: 'Contains both a carboxylic acid (-COOH) and an alcohol (-OH). Teaches the IUPAC seniority priority order.',
    carbonsCount: 4,
    functionalGroup: 'Carboxylic acid (-COOH) + Alcohol (-OH)',
    carbonNodes: [
      { id: 4, label: 'CH₃', numberLtoR: 1, numberRtoL: 4, correctNumber: 4, isParentChain: true },
      { id: 3, label: 'CH', numberLtoR: 2, numberRtoL: 3, correctNumber: 3, isParentChain: true, substituent: 'OH (hydroxy)' },
      { id: 2, label: 'CH₂', numberLtoR: 3, numberRtoL: 2, correctNumber: 2, isParentChain: true },
      { id: 1, label: 'COOH', numberLtoR: 4, numberRtoL: 1, correctNumber: 1, isParentChain: true, isFunctionalGroup: true }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Identify the main functional group',
        highlightedFocus: 'functional_group',
        explanation: 'The compound has two functional groups: –COOH and –OH. By IUPAC seniority, –COOH has higher priority than –OH.',
        whyThisStep: 'A molecule can only have ONE principal suffix. The higher priority group wins the suffix (-oic acid). The junior group is demoted to a prefix ("hydroxy-").',
        ruleCitation: 'Priority Order: -COOH > -OH. Suffix is "-oic acid". Prefix is "hydroxy-".',
        visualFeedback: {
          condensedFormula: 'CH₃–CH([OH])–CH₂–[COOH]',
          badge: 'Priority: -COOH (Suffix) > -OH (Prefix)'
        }
      },
      {
        stepNumber: 2,
        title: 'Step 2: Find the appropriate parent chain',
        highlightedFocus: 'parent_chain',
        explanation: 'Longest continuous chain containing the principal functional group has 4 carbons.',
        whyThisStep: '4 carbons = butanoic acid.',
        ruleCitation: '4 carbons = butanoic acid.',
        visualFeedback: {
          condensedFormula: '[CH₃–CH–CH₂–COOH]',
          badge: 'Parent: Butanoic acid (4 carbons)'
        }
      },
      {
        stepNumber: 3,
        title: 'Step 3: Number the chain correctly',
        highlightedFocus: 'numbering',
        explanation: 'Start numbering at the –COOH carbon as C-1: C1 (COOH), C2 (CH₂), C3 (CH–OH), C4 (CH₃).',
        whyThisStep: 'The principal functional group (-COOH) must receive the lowest possible locant: C-1.',
        ruleCitation: 'Carboxyl carbon is always C-1.',
        visualFeedback: {
          condensedFormula: 'C4 — C3(OH) — C2 — C1(OOH)',
          badge: 'Numbered right-to-left: C-1 at COOH'
        }
      },
      {
        stepNumber: 4,
        title: 'Step 4: Identify substituents',
        highlightedFocus: 'substituents',
        explanation: 'The –OH group at C-3 is now treated as a substituent prefix named "hydroxy".',
        whyThisStep: 'When an alcohol is not the principal group, its name switches from the suffix "-ol" to the prefix "hydroxy-".',
        ruleCitation: 'Demoted -OH group = "hydroxy-".',
        visualFeedback: {
          condensedFormula: 'Substituent: -OH (hydroxy)',
          badge: 'Prefix: hydroxy'
        }
      },
      {
        stepNumber: 5,
        title: 'Step 5: Give their positions',
        highlightedFocus: 'locants',
        explanation: 'The hydroxy group is attached to Carbon 3.',
        whyThisStep: 'Locant: 3-hydroxy.',
        ruleCitation: 'Locant 3 specifies the carbon bearing the -OH group.',
        visualFeedback: {
          condensedFormula: 'Position: 3-hydroxy',
          badge: 'Locant: 3'
        }
      },
      {
        stepNumber: 6,
        title: 'Step 6: Arrange the name correctly',
        highlightedFocus: 'assembly',
        explanation: 'Combine: 3-hydroxy + butanoic acid.',
        whyThisStep: 'Hyphen between number 3 and word hydroxy; space before acid.',
        ruleCitation: '3-hydroxybutanoic acid.',
        visualFeedback: {
          condensedFormula: '3-hydroxy + butanoic acid',
          badge: 'Name: 3-hydroxybutanoic acid'
        }
      },
      {
        stepNumber: 7,
        title: 'Step 7: Show the final IUPAC name',
        highlightedFocus: 'final',
        explanation: 'Final IUPAC Name: 3-hydroxybutanoic acid',
        whyThisStep: 'Exam Trap: Never call this "2-hydroxybutanoic acid" by numbering from the wrong side!',
        ruleCitation: 'IUPAC Official: 3-hydroxybutanoic acid',
        visualFeedback: {
          condensedFormula: '3-hydroxybutanoic acid',
          badge: 'Mastered! Advanced Priority Rules.'
        }
      }
    ]
  }
];
