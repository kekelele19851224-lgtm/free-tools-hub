export interface Calculator {
  name: string;
  description: string;
  url: string;
  category: string;
  type: string;
  id?: string;
  title?: string;
  icon?: string;
  href?: string;
}

export const calculators: Calculator[] = [
  {
    name: "Quorum Calculator",
    description: "Calculate the minimum number of votes needed for a valid decision in meetings and organizations.",
    url: "/quorum-calculator",
    category: "Business",
    type: "Calculator"
  },
  {
    name: "Productivity Calculator",
    description: "Calculate productivity per hour and per employee",
    url: "/productivity-calculator",
    category: "Lifestyle",
    type: "Calculator"
  },
  {
    name: "Wedding Liquor Calculator",
    description: "Calculate how much beer, wine, champagne and liquor you need for your wedding. Get a shopping list with cost estimates.",
    url: "/wedding-liquor-calculator",
    category: "Lifestyle",
    type: "Calculator"
  },
  {
    name: "SHSAT Score Calculator",
    description: "Calculate your SHSAT score and see which NYC Specialized High Schools you qualify for",
    url: "/shsat-score-calculator",
    category: "Education",
    type: "Calculator"
  },
  {
    name: "Black Scholes Calculator",
    description: "Calculate option prices and Greeks using Black-Scholes model",
    url: "/black-scholes-calculator",
    category: "Finance",
    type: "Calculator"
  },
  {
    name: "Bowling Handicap Calculator",
    description: "Calculate your bowling handicap and adjusted score. Supports 90% of 220, 80% of 230, and custom league formats.",
    url: "/bowling-handicap-calculator",
    category: "Sports",
    type: "Calculator"
  },
  {
    name: "Pressure Washing Estimate Calculator",
    description: "Calculate pressure washing costs for driveways, houses, decks and more. Get instant estimates per square foot.",
    url: "/pressure-washing-calculator",
    category: "Home",
    type: "Calculator"
  },
  {
    name: "Epoxy Flooring Cost Calculator",
    description: "Estimate epoxy flooring costs for garage, basement, or commercial floors. Compare DIY vs professional installation.",
    url: "/epoxy-flooring-cost-calculator",
    category: "Home",
    type: "Calculator"
  },
  {
    name: "Yards to Tons Calculator",
    description: "Convert cubic yards to tons for gravel, sand, dirt, mulch, concrete and other materials. Supports bidirectional conversion.",
    url: "/yards-to-tons-calculator",
    category: "Construction",
    type: "Calculator"
  },
  {
    name: "Gravel Driveway Calculator",
    description: "Calculate how much gravel you need for your driveway in cubic yards and tons. Estimate costs for new driveways or top-up refreshes.",
    url: "/gravel-driveway-calculator",
    category: "Construction",
    type: "Calculator"
  },
  {
    name: "Blow In Insulation Calculator",
    description: "Calculate blown-in insulation needs - bags, depth, and cost for cellulose or fiberglass with R-value guide.",
    url: "/blow-in-insulation-calculator",
    category: "Construction",
    type: "Calculator"
  },
  {
    name: "Golf Club Length Calculator",
    description: "Find the correct golf club length based on your height and wrist-to-floor measurement. Get personalized recommendations for every club.",
    url: "/golf-club-length-calculator",
    category: "Sports",
    type: "Calculator"
  },
  {
    name: "Rucking Calorie Calculator",
    description: "Calculate how many calories you burn rucking based on weight, pack weight, pace, and terrain. Compare with regular walking.",
    url: "/rucking-calorie-calculator",
    category: "Fitness",
    type: "Calculator"
  },
  {
    name: "Towing Estimate Calculator",
    description: "Estimate towing costs by distance, vehicle type, and time. Compare prices with AAA membership to find the best option.",
    url: "/towing-estimate-calculator",
    category: "Finance",
    type: "Calculator"
  },
  {
    name: "Lawn Mowing Cost Calculator",
    description: "Calculate lawn mowing costs by size, frequency, and services. Get accurate estimates for professional lawn care.",
    url: "/lawn-mowing-cost-calculator",
    category: "Lifestyle",
    type: "Calculator"
  },
  {
    name: "Vehicle Wrap Pricing Calculator",
    description: "Estimate car wrap costs by vehicle type, material, and coverage. Compare DIY vs professional installation prices.",
    url: "/vehicle-wrap-pricing-calculator",
    category: "Finance",
    type: "Calculator"
  },
  {
    name: "Balloon Mortgage Calculator",
    description: "Calculate balloon mortgage payments, balloon payment amount, and see the full amortization schedule. Compare interest-only vs amortized payments.",
    url: "/balloon-mortgage-calculator",
    category: "Finance",
    type: "Calculator"
  },
  {
    id: "ifta-calculator",
    title: "IFTA Calculator",
    name: "IFTA Calculator",
    description: "Calculate quarterly IFTA fuel tax by state. Enter miles and fuel purchases to see tax owed or credits due. Export results to CSV.",
    url: "/ifta-calculator",
    href: "/ifta-calculator",
    icon: "🚛",
    category: "Auto",
    type: "Calculator"
  },
  {
    name: "Horse Name Generator",
    description: "Generate unique horse names using parents' names (sire and dam), by style (classic, race, fantasy, funny, western), or random. Perfect for foals, race horses, show horses, and gaming.",
    url: "/horse-name-generator",
    href: "/horse-name-generator",
    icon: "🐴",
    category: "Lifestyle",
    type: "Generator"
  },
  {
    name: "Alliteration Generator",
    description: "Generate alliterative phrases for poetry, business names, tongue twisters, and creative writing. Choose any letter and style instantly.",
    url: "/alliteration-generator",
    href: "/alliteration-generator",
    icon: "✨",
    category: "Lifestyle",
    type: "Generator"
  },
  {
    name: "Phone Number Extractor",
    description: "Extract phone numbers from any text instantly. Supports US, UK, and international formats. Perfect for extracting contacts from emails, documents, and web content.",
    url: "/phone-number-extractor",
    href: "/phone-number-extractor",
    icon: "📱",
    category: "Lifestyle",
    type: "Extractor"
  },
  {
    name: "1031 Exchange Calculator",
    description: "Calculate your 1031 exchange tax savings, boot amounts, and 45/180 day deadlines for real estate investments.",
    url: "/1031-exchange-calculator",
    category: "Finance",
    type: "Calculator"
  },
  {
    name: "Venmo Fee Calculator",
    description: "Calculate Venmo fees for instant transfers, goods & services, credit card payments, and business transactions. See fees for any amount.",
    url: "/venmo-fee-calculator",
    category: "Finance",
    type: "Calculator"
  },
  {
    name: "Gutter Slope Calculator",
    description: "Calculate the proper slope for rain gutters. Get exact drop measurements for efficient drainage and prevent water damage.",
    url: "/gutter-slope-calculator",
    category: "Home",
    type: "Calculator"
  },
  {
    name: "Floor Joist Calculator",
    description: "Calculate how many floor joists you need, find the right joist size for your span, and estimate material costs with span tables.",
    url: "/floor-joist-calculator",
    category: "Construction",
    type: "Calculator"
  },
  {
    name: "Wrongful Termination Settlement Calculator",
    description: "Estimate your wrongful termination settlement and calculate take-home amount after attorney fees and taxes.",
    url: "/wrongful-termination-settlement-calculator",
    category: "Finance",
    type: "Calculator"
  },
  {
    name: "NVIDIA Stock Calculator",
    description: "Calculate NVIDIA (NVDA) investment returns. See historical growth, current holdings value, and future projections.",
    url: "/nvidia-stock-calculator",
    category: "Finance",
    type: "Calculator"
  },
  {
    name: "Spray Foam Insulation Cost Calculator",
    description: "Calculate spray foam insulation costs. Compare open-cell vs closed-cell foam and get estimates for attics, walls, and garages.",
    url: "/spray-foam-insulation-cost-calculator",
    category: "Home",
    type: "Calculator"
  },
  {
    name: "River Stone Calculator",
    description: "Calculate how much river rock you need for landscaping. Get estimates in tons, cubic yards, and bags with cost calculations.",
    url: "/river-stone-calculator",
    category: "Home",
    type: "Calculator"
  },
  {
    name: "Soffit Calculator",
    description: "Calculate how much soffit you need. Get panel counts, ventilation requirements, and cost estimates for vinyl, aluminum, or wood soffit.",
    url: "/soffit-calculator",
    category: "Construction",
    type: "Calculator"
  },
  {
    name: "Texas Title Insurance Calculator",
    description: "Calculate Texas title insurance costs using official TDI rates. Get owner's and lender's policy premiums for your property.",
    url: "/texas-title-insurance-calculator",
    category: "Finance",
    type: "Calculator"
  },
  {
    name: "Stripe Fees Calculator",
    description: "Calculate Stripe processing fees instantly. See what you'll receive after fees or reverse calculate what to charge customers. Supports domestic, international cards & ACH.",
    url: "/stripe-fees-calculator",
    category: "Finance",
    type: "Calculator"
  },
  {
    name: "Pine Straw Calculator",
    description: "Calculate how many bales of pine straw you need for landscaping. Get coverage estimates for different depths with DIY and professional installation costs.",
    url: "/pine-straw-calculator",
    category: "Home",
    type: "Calculator"
  },
  {
    name: "Land Clearing Cost Calculator",
    description: "Estimate land clearing costs by acre, vegetation type, and terrain. Get pricing for brush removal, tree clearing, stumps, and site preparation.",
    url: "/land-clearing-cost-calculator",
    category: "Construction",
    type: "Calculator"
  },
  {
    name: "Retaining Wall Cost Calculator",
    description: "Estimate retaining wall costs by dimensions, material type, and installation. Compare DIY vs professional pricing for concrete, stone, wood, and brick walls.",
    url: "/retaining-wall-cost-calculator",
    category: "Construction",
    type: "Calculator"
  },
  {
    name: "PA Title Insurance Calculator",
    description: "Calculate Pennsylvania title insurance costs using official TIRBOP rates. Get accurate estimates for home purchases and refinances with lender endorsement fees.",
    url: "/pa-title-insurance-calculator",
    category: "Finance",
    type: "Calculator"
  },
  {
    name: "PA Spousal Support Calculator",
    description: "Calculate Pennsylvania spousal support and alimony pendente lite (APL) using official PA guidelines formula. Get estimates based on income with or without dependent children.",
    url: "/pa-spousal-support-calculator",
    category: "Finance",
    type: "Calculator"
  },
  {
    name: "House Flipping Calculator",
    description: "Calculate fix and flip profits, ROI, and verify the 70% rule. Analyze house flipping deals with detailed cost breakdown including rehab, holding, and selling costs.",
    url: "/house-flipping-calculator",
    category: "Finance",
    type: "Calculator"
  },
  {
    name: "Water Softener Size Calculator",
    description: "Calculate the right water softener grain capacity for your household. Enter family size, water hardness, and usage to find the perfect softener size with regeneration estimates.",
    url: "/water-softener-size-calculator",
    category: "Home",
    type: "Calculator"
  },
  {
    name: "Home Inspection Cost Calculator",
    description: "Estimate home inspection costs by square footage, age, property type, and location. Add optional services like radon, mold, termite, and sewer scope inspections.",
    url: "/home-inspection-cost-calculator",
    category: "Home",
    type: "Calculator"
  },
  {
    name: "Salt Pool Calculator",
    description: "Calculate how much salt your pool needs. Get results in pounds, kilograms, and bags with pool volume calculator.",
    url: "/salt-pool-calculator",
    category: "Home",
    type: "Calculator"
  },
  {
    name: "Hurricane Impact Windows Cost Calculator",
    description: "Estimate hurricane impact window costs by size, frame material, and glass type. Get instant pricing for material and installation.",
    url: "/hurricane-impact-windows-cost-calculator",
    category: "Home",
    type: "Calculator"
  },
  {
    name: "Tree Removal Cost Calculator",
    description: "Estimate tree removal costs by height, diameter, tree type, and location. Calculate multiple trees with bundle discounts. Free instant estimates.",
    url: "/tree-removal-cost-calculator",
    category: "Home",
    type: "Calculator"
  },
  {
    name: "Neck Injury Settlement Calculator",
    description: "Estimate your neck injury settlement based on medical expenses, lost wages, and pain & suffering. Calculate take-home after attorney fees.",
    url: "/neck-injury-settlement-calculator",
    category: "Finance",
    type: "Calculator"
  },
  {
    name: "Lens Thickness Calculator",
    description: "Calculate lens thickness and compare lens index options for your prescription.",
    url: "/lens-thickness-calculator",
    category: "Lifestyle",
    type: "Calculator"
  },
  {
    name: "Deck Joist Span Calculator",
    description: "Calculate deck joist spans by species, grade, joist size, and spacing. IRC 2024 code compliant guidance.",
    url: "/deck-joist-span-calculator",
    category: "Home",
    type: "Calculator"
  },
  {
    name: "Fencing Cost Calculator",
    description: "Estimate fencing costs by material (wood, vinyl, chain link, aluminum), height, and length. Compare DIY vs professional installation.",
    url: "/fencing-cost-calculator",
    category: "Home",
    type: "Calculator"
  },
  {
    name: "Landscaping Cost Calculator",
    description: "Estimate lawn, sod, patio, and hardscaping costs. Quick estimates or detailed breakdowns by project.",
    url: "/landscaping-cost-calculator",
    category: "Home",
    type: "Calculator"
  },
  {
    name: "Scrap Car Value Calculator",
    description: "Estimate your junk car's scrap value by weight, condition, and location. Calculate metal value plus parts like catalytic converters, engines, and transmissions.",
    url: "/scrap-car-value-calculator",
    category: "Auto",
    type: "Calculator"
  },
  {
    name: "Crusher Run Calculator",
    description: "Calculate how much crusher run you need in tons and cubic yards. Get coverage charts and 2025 pricing for driveways and patios.",
    url: "/crusher-run-calculator",
    category: "Construction",
    type: "Calculator"
  },
  {
    name: "IL Spousal Support Calculator",
    description: "Calculate Illinois maintenance (alimony) payments using the 2025 statutory formula with duration chart based on marriage length.",
    url: "/il-spousal-support-calculator",
    category: "Finance",
    type: "Calculator"
  },
  {
    name: "Mayan Calendar Gender Calculator",
    description: "Predict your baby's gender using the ancient Mayan calendar method. Find out if it's a boy or girl with our free 2025 predictor.",
    url: "/mayan-calendar-gender-calculator",
    category: "Lifestyle",
    type: "Calculator"
  },
  {
    name: "New Mexico Mortgage Calculator",
    description: "Calculate your monthly mortgage payment in New Mexico with county property tax rates. See PITI breakdown including principal, interest, taxes, and insurance.",
    url: "/mortgage-calculator-new-mexico",
    category: "Finance",
    type: "Calculator"
  },
  {
    name: "Pool Pump Size Calculator",
    description: "Calculate the right pool pump horsepower (HP) based on your pool volume, GPM requirements, and turnover rate. Includes sizing chart.",
    url: "/pool-pump-size-calculator",
    category: "Home",
    type: "Calculator"
  },
  {
    name: "Tire Gear Ratio Calculator",
    description: "Calculate engine RPM, vehicle speed, or gear ratio. Compare tire sizes to see effects on speedometer and effective gear ratio.",
    url: "/tire-gear-ratio-calculator",
    category: "Auto",
    type: "Calculator"
  },
  {
    name: "Vinyl Wrap Calculator",
    description: "Calculate how much vinyl wrap you need for your car by vehicle size or specific parts. Includes size chart and cost estimates.",
    url: "/vinyl-wrap-calculator",
    category: "Auto",
    type: "Calculator"
  },
  {
    name: "Feng Shui Bedroom Layout Generator",
    description: "Generate optimal bed placement for your bedroom based on feng shui principles. Find the command position and avoid bad feng shui.",
    url: "/feng-shui-bedroom-layout-generator",
    category: "Lifestyle",
    type: "Generator"
  },
  {
    name: "Human Design Generator Test",
    description: "Take our free Human Design Generator test to discover if you're a Generator type. Get career matches and daily strategy tips.",
    url: "/human-design-generator-test",
    category: "Lifestyle",
    type: "Calculator"
  },
  {
    name: "Two Word Ambigram Generator",
    description: "Free two word ambigram generator for tattoos and logos. Create designs that read differently when rotated 180°. Analyze letter compatibility.",
    url: "/two-word-ambigram-generator",
    category: "Lifestyle",
    type: "Generator"
  },
  {
    name: "Sonnet Generator",
    description: "Free sonnet generator with iambic pentameter. Create Shakespearean, Petrarchan, and Spenserian sonnets. Check your poem structure and rhyme scheme.",
    url: "/sonnet-generator",
    category: "Lifestyle",
    type: "Generator"
  },
  {
    name: "Supplement Facts Label Generator",
    description: "Free supplement facts label generator for dietary supplements. Create FDA-style labels with vitamins and minerals. Plus funny nutrition facts labels for gifts.",
    url: "/supplement-facts-label-generator",
    category: "Lifestyle",
    type: "Generator"
  },
  {
    name: "Poem Title Generator",
    description: "Free poem title generator with creative ideas for any theme. Generate titles for love poems, nature poems, deep poetry, funny poems, and more.",
    url: "/poem-title-generator",
    category: "Lifestyle",
    type: "Generator"
  },
  {
    name: "Ranch Brand Generator",
    description: "Free ranch brand generator to create custom cattle brands and ranch logos. Design with traditional Western symbols, download PNG or SVG.",
    url: "/ranch-brand-generator",
    category: "Lifestyle",
    type: "Generator"
  },
  {
    name: "Music Artist Name Generator",
    description: "Free music artist name generator for solo musicians, rappers, DJs, and bands. Generate unique stage names by genre, style, or from your real name.",
    url: "/music-artist-name-generator",
    category: "Lifestyle",
    type: "Generator"
  },
  {
    name: "Amps to kW Converter",
    description: "Free amps to kilowatts converter for DC, single-phase AC, and three-phase AC circuits. Calculate power with reference tables and formulas.",
    url: "/amps-to-kw-converter",
    category: "Converter",
    type: "Converter"
  },
  {
    name: "Dumbbell to Barbell Converter",
    description: "Free dumbbell to barbell converter calculator. Estimate your barbell bench press weight from dumbbell weights with conversion charts and strength standards.",
    url: "/dumbbell-to-barbell-converter",
    category: "Fitness",
    type: "Converter"
  },
  {
    name: "3 Phase to Single Phase Calculator",
    description: "Free 3 phase to single phase calculator. Calculate power conversion, find equivalent current, and size your phase converter with formulas and guide.",
    url: "/3-phase-to-single-phase-calculator",
    category: "Converter",
    type: "Converter"
  },
  {
    name: "Money Market Account Calculator",
    description: "Calculate compound interest earnings with APY rates and monthly contributions. Compare daily vs monthly compounding. See how much your MMA will grow.",
    url: "/money-market-account-calculator",
    category: "Finance",
    type: "Calculator"
  },
  {
    name: "Pain and Suffering Calculator",
    description: "Calculate pain and suffering compensation for personal injury claims. Estimate using multiplier and per diem methods. Free instant settlement estimates.",
    url: "/pain-and-suffering-calculator",
    category: "Finance",
    type: "Calculator"
  },
  {
    name: "Sade Sati Calculator",
    description: "Check if you are in Shani Sade Sati by Moon sign. Find your current phase, timeline, and remedies for Saturn's 7.5-year transit.",
    url: "/sade-sati-calculator",
    category: "Lifestyle",
    type: "Calculator"
  },
  {
    name: "Aggregate Calculator",
    description: "Calculate how much gravel, sand, or crushed stone you need in cubic yards and tons. Get coverage estimates and cost calculations for driveways, patios, and landscaping.",
    url: "/aggregate-calculator",
    category: "Construction",
    type: "Calculator"
  },
  {
    name: "Toyota Car Payment Calculator",
    description: "Calculate monthly payments for any Toyota vehicle. Compare finance vs lease options with 2026 MSRP prices for Camry, RAV4, Corolla, Tacoma and more.",
    url: "/car-payment-calculator-toyota",
    category: "Finance",
    type: "Calculator"
  },
  {
    name: "CPC Calculator",
    description: "Calculate cost per click, CTR, CPM for Google Ads, Facebook, Amazon. Plan your ad budget and analyze campaign performance with industry benchmarks.",
    url: "/cpc-calculator",
    category: "Marketing",
    type: "Calculator"
  },
  {
    name: "EBITDA Calculator",
    description: "Calculate EBITDA from net income or operating profit. Get EBITDA margin, EBIT comparison, and business valuation using EV/EBITDA multiples.",
    url: "/ebitda-calculator",
    category: "Finance",
    type: "Calculator"
  },
  {
    name: "Therapy Productivity Calculator",
    description: "Calculate productivity percentage for PT, OT, and SLP therapists. Plan daily goals and convert minutes to CPT billing units with the 8-minute rule.",
    url: "/therapy-productivity-calculator",
    category: "Healthcare",
    type: "Calculator"
  },
  {
    name: "Wainscoting Calculator",
    description: "Calculate panel spacing, frame dimensions, and material needs for picture frame wainscoting and board and batten projects. Get measurements in fractions.",
    url: "/wainscoting-calculator",
    category: "Construction",
    type: "Calculator"
  },
  {
    name: "Septic Tank Size Calculator",
    description: "Calculate septic tank capacity by bedrooms, occupants, or dimensions. Get recommendations in gallons and liters with pumping frequency estimates.",
    url: "/septic-tank-size-calculator",
    category: "Home",
    type: "Calculator"
  },
  {
    name: "Barndominium Cost Calculator",
    description: "Estimate barndominium build costs by square footage or budget. Get cost breakdowns for kits, turnkey builds, and custom construction with state pricing.",
    url: "/barndominium-cost-calculator",
    category: "Construction",
    type: "Calculator"
  },
  {
    name: "JEPQ Dividend Calculator",
    description: "Calculate JEPQ monthly dividend income, plan retirement goals, and compare with JEPI and SCHD.",
    url: "/jepq-dividend-calculator",
    category: "Finance",
    type: "Calculator"
  },
  {
    name: "Millionaire Calculator",
    description: "Calculate how long to become a millionaire, monthly savings needed, and track wealth milestones with inflation adjustment.",
    url: "/millionaire-calculator",
    category: "Finance",
    type: "Calculator"
  },
  {
    name: "Raw Food Calculator for Dogs",
    description: "Calculate daily raw food amounts, get 80/10/10 recipe breakdowns, and estimate monthly costs for PMR and BARF diets.",
    url: "/raw-food-calculator-dog",
    category: "Pets",
    type: "Calculator"
  },
  {
    name: "Dining Room Table Size Calculator",
    description: "Find the perfect dining table size by room dimensions or seating needs. Supports rectangular, round, square, and oval tables.",
    url: "/dining-room-table-size-calculator",
    category: "Home",
    type: "Calculator"
  },
  {
    name: "Percent to Fraction Calculator",
    description: "Convert percentages to fractions with step-by-step solution. Supports decimals like 12.5%, 33.33%. Also converts fractions to percentages.",
    url: "/percent-to-fraction-calculator",
    category: "Math",
    type: "Calculator"
  },
  {
    name: "Monthly Savings Calculator",
    description: "Calculate future balance with compound interest, how much to save monthly for a goal, or time to reach your savings target.",
    url: "/monthly-savings-calculator",
    category: "Finance",
    type: "Calculator"
  },
  {
    name: "Chapter 13 Bankruptcy Calculator",
    description: "Estimate your Chapter 13 bankruptcy monthly payment based on income, debts, and state median income. See 3 vs 5-year plan options.",
    url: "/chapter-13-bankruptcy-calculator",
    category: "Finance",
    type: "Calculator"
  },
  {
    name: "Montana Mortgage Calculator",
    description: "Calculate monthly mortgage payments with Montana county-specific property tax rates. Includes affordability calculator and amortization schedule.",
    url: "/mortgage-calculator-montana",
    category: "Finance",
    type: "Calculator"
  },
  {
    name: "Express Entry CRS Calculator",
    description: "Calculate your Comprehensive Ranking System (CRS) score for Canada Express Entry. Updated for 2025 with 67-point FSWP eligibility check.",
    url: "/express-entry-calculator",
    category: "Immigration",
    type: "Calculator"
  },
  {
    name: "Enterprise Value Calculator",
    description: "Calculate enterprise value from market cap, debt, and cash. Estimate business valuation using EBITDA multiples by industry.",
    url: "/enterprise-value-calculator",
    category: "Finance",
    type: "Calculator"
  },
  {
    name: "Rug Size Calculator",
    description: "Find the perfect rug size for any room using the 18-inch rule. Match to standard sizes for living room, bedroom, dining room.",
    url: "/rug-size-calculator",
    category: "Home",
    type: "Calculator"
  },
  {
    name: "Auto Loan Calculator MN",
    description: "Calculate car payments in Minnesota with 6.875% MN sales tax, Metro transit tax, trade-in credit, and early payoff savings.",
    url: "/auto-loan-calculator-mn",
    category: "Finance",
    type: "Calculator"
  },
  {
    name: "Air Changes per Hour Calculator",
    description: "Calculate ACH from CFM and room volume, or find required CFM for target ACH. Includes ASHRAE and CDC ventilation guidelines.",
    url: "/air-changes-per-hour-calculator",
    category: "Engineering",
    type: "Calculator"
  },
  {
    name: "Decomposed Granite Calculator",
    description: "Calculate how much decomposed granite you need in cubic yards, tons, and bags with cost estimator for landscaping projects.",
    url: "/decomposed-granite-calculator",
    category: "Home",
    type: "Calculator"
  },
  {
    name: "Fence Picket Calculator",
    description: "Calculate how many fence pickets, posts, rails, and materials you need for standard, privacy, or board-on-board fences.",
    url: "/fence-picket-calculator",
    category: "Construction",
    type: "Calculator"
  },
  {
    name: "House Cleaning Cost Calculator",
    description: "Estimate house cleaning costs based on home size, rooms, cleaning type, and add-on services.",
    url: "/house-cleaning-cost-calculator",
    category: "Home",
    type: "Calculator"
  },
  {
    name: "Window Tint Calculator",
    description: "Calculate final VLT percentage, check state tint laws, and estimate car window tinting costs.",
    url: "/tint-calculator",
    category: "Auto",
    type: "Calculator"
  },
  {
    name: "Business Line of Credit Calculator",
    description: "Calculate monthly payments, total interest, and compare interest-only vs principal & interest options for business credit lines.",
    url: "/business-line-of-credit-calculator",
    category: "Finance",
    type: "Calculator"
  },
  {
    name: "Candle Calculator",
    description: "Calculate wax and fragrance amounts, estimate costs, and set profitable prices for handmade candles.",
    url: "/candle-calculator",
    category: "DIY",
    type: "Calculator"
  },
  {
    name: "Concrete Step Calculator",
    description: "Calculate concrete volume for steps and stairs, estimate bags needed, and design code-compliant staircases.",
    url: "/concrete-step-calculator",
    category: "Construction",
    type: "Calculator"
  },
  {
    name: "Drywall Installation Cost Calculator",
    description: "Estimate costs per square foot for hanging and finishing drywall, calculate materials needed, and compare finish levels.",
    url: "/drywall-installation-cost-calculator",
    category: "Construction",
    type: "Calculator"
  },
  {
    name: "Stock Split Calculator",
    description: "Calculate how stock splits affect your shares, price, and cost basis. Supports forward splits, reverse splits, and multiple splits.",
    url: "/stock-split-calculator",
    category: "Finance",
    type: "Calculator"
  }
];

export const toolTypes = ["All", "Calculator", "Converter", "Counter", "Estimator"];
export const categories = ["All", "Business", "Finance", "Education", "Lifestyle", "Home", "Construction", "Sports", "Fitness", "Auto"];
