"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Sonnet types data
const sonnetTypes = [
  {
    id: "shakespearean",
    name: "Shakespearean (English)",
    structure: "3 Quatrains + 1 Couplet",
    rhymeScheme: "ABAB CDCD EFEF GG",
    voltaPosition: "Line 13 (final couplet)",
    description: "The most popular form. Three quatrains develop the theme, and the final couplet provides a conclusion or twist."
  },
  {
    id: "petrarchan",
    name: "Petrarchan (Italian)",
    structure: "1 Octave + 1 Sestet",
    rhymeScheme: "ABBA ABBA CDE CDE",
    voltaPosition: "Line 9 (start of sestet)",
    description: "The octave presents a problem or question, and the sestet offers a resolution or reflection."
  },
  {
    id: "spenserian",
    name: "Spenserian",
    structure: "3 Quatrains + 1 Couplet",
    rhymeScheme: "ABAB BCBC CDCD EE",
    voltaPosition: "Line 13 (final couplet)",
    description: "Similar to Shakespearean but with interlocking rhymes that create a more unified flow between quatrains."
  }
];

// Theme options
const themes = [
  { id: "love", label: "Love & Romance", icon: "💕" },
  { id: "nature", label: "Nature & Seasons", icon: "🌿" },
  { id: "time", label: "Time & Mortality", icon: "⏳" },
  { id: "loss", label: "Loss & Grief", icon: "🥀" },
  { id: "hope", label: "Hope & Dreams", icon: "✨" },
  { id: "beauty", label: "Beauty & Art", icon: "🎨" }
];

// Tone options
const tones = [
  { id: "romantic", label: "Romantic" },
  { id: "melancholic", label: "Melancholic" },
  { id: "hopeful", label: "Hopeful" },
  { id: "dramatic", label: "Dramatic" },
  { id: "reflective", label: "Reflective" }
];

// Pre-built sonnet templates (simplified generation using line templates)
const sonnetTemplates: { [key: string]: { [key: string]: string[] } } = {
  love: {
    romantic: [
      "When first I saw your face, my heart took flight,",
      "A gentle warmth that spread through every vein,",
      "Your eyes like stars that pierce the darkest night,",
      "Your voice a melody, a sweet refrain.",
      "I never knew that love could feel this way,",
      "A force so strong it takes my breath away,",
      "With every moment spent within your gaze,",
      "I find myself lost in a blissful daze.",
      "Though seasons change and years may come to pass,",
      "My love for you shall never fade or tire,",
      "More constant than the mountains or the grass,",
      "A flame that burns with everlasting fire.",
      "So take my hand and never let it go,",
      "For in your love, my heart has found its home."
    ],
    melancholic: [
      "I loved you once with all my broken heart,",
      "A tender flame that burned so bright and true,",
      "But fate conspired to keep our souls apart,",
      "And left me here with memories of you.",
      "The empty rooms still echo with your name,",
      "The pillow cold where once you used to lie,",
      "I search for you but nothing stays the same,",
      "And all that's left are tears I cannot cry.",
      "Perhaps in dreams we'll meet again someday,",
      "Where time stands still and sorrow cannot reach,",
      "Where all the words I never got to say,",
      "Will finally flow like waves upon a beach.",
      "Until that day, I'll hold you in my mind,",
      "A love like ours is difficult to find."
    ],
    hopeful: [
      "Though we have yet to meet, I know you're there,",
      "A kindred spirit waiting to be found,",
      "Someone who'll love me with the sweetest care,",
      "And lift me up when I am feeling down.",
      "I dream of days we'll walk beneath the sun,",
      "Of laughter shared and secrets softly told,",
      "Two separate lives becoming joined as one,",
      "A love story that's waiting to unfold.",
      "The universe will guide us when it's time,",
      "Our paths will cross as destiny intends,",
      "Like matching verses in a perfect rhyme,",
      "Where loneliness and solitude both end.",
      "So I will wait with patience and with grace,",
      "For love will come and find its rightful place."
    ],
    dramatic: [
      "My love for you consumes me like a fire,",
      "A raging storm that threatens to destroy,",
      "Each moment without you fills me with desire,",
      "A desperate need that nothing can employ.",
      "I'd cross the seven seas to hold your hand,",
      "I'd climb the highest mountain for your kiss,",
      "I'd fight against an army's fierce command,",
      "For just one chance to taste eternal bliss.",
      "Without your love, my life is cold and bare,",
      "A wasteland where no flowers dare to bloom,",
      "I cannot breathe; I gasp for precious air,",
      "Your absence is a dark and lonely tomb.",
      "Return to me and set my spirit free,",
      "For you alone hold the key to me."
    ],
    reflective: [
      "What is this thing we call love, I wonder,",
      "This force that binds two strangers heart to heart,",
      "That tears the walls of solitude asunder,",
      "And makes us whole when we have been apart.",
      "Is it the way you smile when I am near,",
      "Or how your touch can calm my troubled mind,",
      "The comfort found in knowing you are here,",
      "A peace that only lovers seem to find.",
      "Perhaps love cannot truly be defined,",
      "A mystery that words cannot convey,",
      "A feeling that transcends both space and time,",
      "That grows much stronger with each passing day.",
      "I only know that when I look at you,",
      "My heart knows something wonderful and true."
    ]
  },
  nature: {
    romantic: [
      "The morning dew upon the rose's face,",
      "Reminds me of the tears you shed for me,",
      "Each petal holds a delicate embrace,",
      "Like your soft arms, a sanctuary free.",
      "The birds sing out their melodies of love,",
      "A chorus praising nature's sweet design,",
      "The sun shines down from heavens high above,",
      "And in this light, your beauty truly shines.",
      "Let us walk through meadows hand in hand,",
      "Where wildflowers bloom in colors bright,",
      "Together we'll explore this sacred land,",
      "From early dawn until the fall of night.",
      "For in the garden of my heart you grow,",
      "The fairest flower that I'll ever know."
    ],
    melancholic: [
      "The autumn leaves are falling from the trees,",
      "Like tears that drop from sorrow's weeping eyes,",
      "They drift and dance upon the chilly breeze,",
      "A final waltz before each fragile leaf dies.",
      "The summer's warmth has faded into grey,",
      "The birds have flown to seek a warmer shore,",
      "The flowers bow their heads as if to pray,",
      "For gentle days that will return no more.",
      "I walk alone through forests bare and cold,",
      "The silence broken by my heavy sighs,",
      "The stories that these ancient trees have told,",
      "Of loss and change beneath the weeping skies.",
      "Yet in the spring, new life will bloom again,",
      "And hope will ease the memory of pain."
    ],
    hopeful: [
      "The winter snow will melt and slip away,",
      "And from the frozen earth, new life will spring,",
      "The darkness shall give way to brighter days,",
      "When birds return on graceful, joyful wing.",
      "The seeds we plant will reach toward the sun,",
      "Their roots grow deep, their stems grow tall and strong,",
      "A testament that life has just begun,",
      "A natural chorus singing nature's song.",
      "The rivers flow toward the endless sea,",
      "They never stop, they never lose their way,",
      "A lesson in resilience for me,",
      "To keep on moving forward every day.",
      "So let the seasons teach us how to grow,",
      "Through rain and sun, through warmth and bitter snow."
    ],
    dramatic: [
      "The thunder roars across the darkened sky,",
      "As lightning strikes with fierce and blinding light,",
      "The wind howls out a fierce and primal cry,",
      "As nature shows its overwhelming might.",
      "The ocean waves crash hard against the shore,",
      "With foam and fury, relentless and wild,",
      "A power that we cannot help but adore,",
      "Both beautiful and terrifying, reconciled.",
      "The mountains stand as sentinels of stone,",
      "Unmoved by storms that rage around their peaks,",
      "A strength and permanence that stands alone,",
      "A silent wisdom that forever speaks.",
      "In nature's drama, we can clearly see,",
      "The awesome force of life's grand mystery."
    ],
    reflective: [
      "I sit beside the gently flowing stream,",
      "And watch the water ripple, dance, and play,",
      "It carries me into a peaceful dream,",
      "Where all my worldly worries drift away.",
      "The trees stand tall, their branches reaching high,",
      "As if to touch the endless azure blue,",
      "The clouds drift slowly through the open sky,",
      "A ever-changing, ever-shifting view.",
      "What lessons does the natural world impart,",
      "To those who stop and take the time to see,",
      "Perhaps to live with an open heart,",
      "And find the peace in simply being free.",
      "In nature's arms, I find my truest rest,",
      "A gentle reminder that I am blessed."
    ]
  },
  time: {
    romantic: [
      "If I could stop the hands of time for you,",
      "I'd freeze this moment, hold it in my hands,",
      "Where every kiss feels wonderfully new,",
      "And love flows freely like the ocean sands.",
      "The hours we spend together fly too fast,",
      "Like shooting stars across the midnight sky,",
      "I wish that every second here could last,",
      "That we could watch eternity go by.",
      "But time moves on, as time is wont to do,",
      "It waits for no one, not for you or me,",
      "So let us make each moment count as true,",
      "And love as if tomorrow may not be.",
      "For in the time we have, let's make it count,",
      "A love so deep, no clock could ever mount."
    ],
    melancholic: [
      "The clock ticks on with cold indifference,",
      "Each second stealing youth from weary bones,",
      "No prayer or plea can offer recompense,",
      "For time collects its inevitable loans.",
      "I look upon my hands and see the years,",
      "The lines and creases marking every day,",
      "The joys, the sorrows, laughter, and the tears,",
      "All slowly fading, drifting far away.",
      "Where did the springtime of my life depart,",
      "When did the summer turn to autumn's chill,",
      "The winter now approaches to my heart,",
      "And time moves forward, ever forward still.",
      "Yet in this truth, a certain peace is found,",
      "We all return unto the sacred ground."
    ],
    hopeful: [
      "Though time may pass and seasons come and go,",
      "Each ending holds a new beginning's seed,",
      "The future stretches out with golden glow,",
      "Of opportunities to fill each need.",
      "Tomorrow holds a promise yet untold,",
      "A blank page waiting for our story's pen,",
      "New adventures waiting to unfold,",
      "New chances to begin again, again.",
      "The past is but a teacher, nothing more,",
      "Its lessons guide us toward a brighter day,",
      "The present is the gift we should adore,",
      "The future is the hope that lights our way.",
      "So let time pass without a single fear,",
      "For every moment brings new joy to cheer."
    ],
    dramatic: [
      "O Time! You thief that steals our precious days,",
      "You march relentless through the halls of life,",
      "Indifferent to our desperate pleas and praise,",
      "You cut through hope with your unyielding knife.",
      "Empires have fallen underneath your gaze,",
      "The mightiest of kings have turned to dust,",
      "No fortress stands against your endless ways,",
      "All mortal things must bow to you and rust.",
      "And yet we fight against your cruel decree,",
      "We build, we love, we dream, we carry on,",
      "Defiant in our brief mortality,",
      "Creating light before our light is gone.",
      "Though time will win, as time has always done,",
      "Our legacy lives on when life is done."
    ],
    reflective: [
      "What is this thing we call the flow of time,",
      "This river carrying us from birth to end,",
      "A mystery beyond all reason, rhyme,",
      "A journey we must take without a friend.",
      "The past exists as memories alone,",
      "The future is a dream not yet made real,",
      "The present is the only time we own,",
      "The only moment we can truly feel.",
      "I wonder if time moves, or if we do,",
      "Perhaps we're standing still while it stays put,",
      "An illusion that we're only passing through,",
      "A path already traced from head to foot.",
      "Such questions have no answers that I know,",
      "I only know that time will always flow."
    ]
  },
  loss: {
    romantic: [
      "I lost you on a cold December night,",
      "When winter's frost had claimed the dying year,",
      "You slipped away into the fading light,",
      "And left me drowning in a sea of tears.",
      "The love we shared was beautiful and rare,",
      "A treasure that I'll keep within my heart,",
      "Though you're no longer physically there,",
      "In spirit, we shall never be apart.",
      "I see your face in every sunset's glow,",
      "I hear your voice in every gentle breeze,",
      "The love you gave continues still to flow,",
      "Through memories that put my soul at ease.",
      "Until we meet again on heaven's shore,",
      "I'll love you now and always, evermore."
    ],
    melancholic: [
      "The chair sits empty where you used to sit,",
      "Your favorite book still resting on the shelf,",
      "The candle that you loved remains unlit,",
      "I cannot bring myself to light it myself.",
      "The silence in this house is deafening,",
      "Each room a monument to what we had,",
      "The grief I feel is ever deepening,",
      "A sorrow that has turned my world to sad.",
      "I reach for you in darkness of the night,",
      "But find only the coldness of the sheet,",
      "I search for you in early morning light,",
      "But find the day ahead feels incomplete.",
      "How do I learn to live without you here,",
      "When every breath I take reminds me, dear."
    ],
    hopeful: [
      "Though you have gone, you're never truly lost,",
      "Your spirit lives in everything I see,",
      "Your love remains despite the bitter cost,",
      "A lasting gift that you have given me.",
      "The lessons that you taught me still remain,",
      "The values that you held I hold them too,",
      "And though my heart still carries so much pain,",
      "I know that you would want me to push through.",
      "One day the tears will turn to grateful smiles,",
      "When I recall the happy times we shared,",
      "The journey still has many precious miles,",
      "And I will walk them knowing that you cared.",
      "So I'll live on and make you proud of me,",
      "And keep your memory alive and free."
    ],
    dramatic: [
      "The world has ended, though it still turns round,",
      "The sun still rises, though my sky is dark,",
      "My heart lies broken, shattered on the ground,",
      "A fire extinguished, not a single spark.",
      "How cruel is fate to take you from my side,",
      "To rip apart what we had built together,",
      "This storm of grief becomes an endless tide,",
      "A tempest that I cannot seem to weather.",
      "I rage against the heavens up above,",
      "I curse the stars that once seemed so divine,",
      "How could they steal away my only love,",
      "And leave this hollow emptiness in mine.",
      "Yet even in this darkness, I must find,",
      "The strength to leave this sorrow far behind."
    ],
    reflective: [
      "They say that time heals all wounds, given time,",
      "That grief will fade like morning mist away,",
      "But loss is not a mountain one can climb,",
      "It's learning how to live from day to day.",
      "I've learned that grief is love with no place left,",
      "A testament to bonds that ran so deep,",
      "The pain I feel reflects what I've been blessed,",
      "A love so strong it makes the angels weep.",
      "And so I've learned to sit with sorrow's weight,",
      "To let the tears fall freely when they must,",
      "To accept what I cannot negotiate,",
      "And hold onto memories I can trust.",
      "For in this grief, your love still finds a way,",
      "To touch my heart and brighten up my day."
    ]
  },
  hope: {
    romantic: [
      "My hope is built on love's eternal flame,",
      "A fire that burns within my grateful heart,",
      "With you beside me, life is not the same,",
      "A masterpiece of love's creative art.",
      "Together we can face what lies ahead,",
      "Whatever storms may gather in the sky,",
      "With hand in hand and nothing left to dread,",
      "We'll spread our wings and learn again to fly.",
      "The future stretches bright before our eyes,",
      "A canvas waiting for our dreams to paint,",
      "No limit to how high our love can rise,",
      "No obstacle that makes our courage faint.",
      "So let us walk together, you and me,",
      "Toward the hopeful life that's meant to be."
    ],
    melancholic: [
      "Even in the darkest depths of night,",
      "A single star still flickers far above,",
      "A tiny beacon of enduring light,",
      "A symbol of resilience and love.",
      "I've walked through valleys shadowed by despair,",
      "Where hope seemed like a distant, fading dream,",
      "But somewhere in the cold and heavy air,",
      "I caught a glimpse of morning's golden gleam.",
      "Perhaps hope isn't loud or bold or bright,",
      "Perhaps it's just a whisper, soft and small,",
      "A gentle reminder in the night,",
      "That we can rise again each time we fall.",
      "So I will hold this fragile hope with care,",
      "And trust that dawn will meet me waiting there."
    ],
    hopeful: [
      "Tomorrow holds a promise yet unseen,",
      "A world of possibilities untold,",
      "Where all the places that I've never been,",
      "Are waiting for my story to unfold.",
      "I choose to face the future without fear,",
      "To trust that good things are still on their way,",
      "To find the joy in every passing year,",
      "And greet with hope each new and precious day.",
      "The seeds I plant today will one day bloom,",
      "The dreams I dream will someday all come true,",
      "There's always light beyond the darkest gloom,",
      "And skies will always find their way to blue.",
      "So I will hold my head up high and smile,",
      "For hope will make this journey so worthwhile."
    ],
    dramatic: [
      "Rise up! Rise up! The dawn is breaking through,",
      "The darkness cannot hold us any more,",
      "A brighter world awaits for me and you,",
      "Where hope unlocks every single door.",
      "We've weathered storms that tried to break us down,",
      "We've faced the fire and emerged more strong,",
      "No force on earth can make our spirits drown,",
      "For hope has been inside us all along.",
      "Let hope become our battle cry today,",
      "A flag we raise against the winds of doubt,",
      "We'll march with courage into every fray,",
      "And show the world what hope is all about.",
      "For those who dare to hope shall never fall,",
      "And hope itself will conquer over all."
    ],
    reflective: [
      "What is this thing we call hope, I wonder,",
      "This feeling that tomorrow may be bright,",
      "A force that keeps us whole and not asunder,",
      "A candle burning through the endless night.",
      "Is hope a choice we make each morning new,",
      "Or something that exists beyond our will,",
      "A gift that sees us through when we feel blue,",
      "A warmth that keeps the bitter cold at bay still.",
      "I think that hope is woven in our souls,",
      "A thread that runs through all of humankind,",
      "It helps us heal and makes the broken whole,",
      "And gives us peace when peace is hard to find.",
      "So I will nurture hope with tender care,",
      "And trust that it will always find me there."
    ]
  },
  beauty: {
    romantic: [
      "Your beauty is beyond all words or art,",
      "No painter's brush could capture your sweet face,",
      "No poet's verse could reach into your heart,",
      "No sculptor's hand could match your gentle grace.",
      "The stars grow dim when you walk into view,",
      "The moon itself bows down in humble awe,",
      "The flowers turn their faces up to you,",
      "For you're the fairest beauty that I saw.",
      "But it's the beauty deep within your soul,",
      "That makes my heart surrender to your charm,",
      "Your kindness makes this broken spirit whole,",
      "Your love protects me safe from any harm.",
      "So let the world admire your outer glow,",
      "Your inner beauty only I may know."
    ],
    melancholic: [
      "Beauty fades, they say, with passing time,",
      "The rose that blooms must wither and decay,",
      "The youthful face will show the years in time,",
      "And all that's fair must slowly fade away.",
      "I've seen the autumn steal the summer's green,",
      "I've watched the sunset swallow up the day,",
      "The loveliest of sights that I have seen,",
      "Have all too quickly vanished from my gaze.",
      "And yet there is a beauty that remains,",
      "When outward charms have long since disappeared,",
      "A beauty that endures through joy and pains,",
      "The beauty of a life that's truly lived.",
      "So let us seek the beauty that will last,",
      "Beyond the fleeting shadows that time casts."
    ],
    hopeful: [
      "There's beauty waiting everywhere I look,",
      "In morning dew upon the blade of grass,",
      "In every verse of nature's open book,",
      "In every moment, present, future, past.",
      "The child's laugh, the elder's knowing smile,",
      "The kindness shared between two strangers' eyes,",
      "These glimpses make our journey so worthwhile,",
      "Small miracles that take us by surprise.",
      "I choose to see the beauty in each day,",
      "To find the light in every circumstance,",
      "To let the darkness simply slip away,",
      "And give each moment just another chance.",
      "For beauty is a gift that never ends,",
      "It multiplies each time our spirit bends."
    ],
    dramatic: [
      "Behold! The beauty of the world revealed,",
      "In thunderstorms and oceans crashing wild,",
      "In mountain peaks and endless golden fields,",
      "In every force of nature, fierce and mild.",
      "Beauty is not gentle, soft, or tame,",
      "It roars with passion, burns with sacred fire,",
      "It calls us by our true and secret name,",
      "And lifts our weary spirits ever higher.",
      "The beauty of a life lived fully true,",
      "Of risks embraced and challenges held dear,",
      "Of dreams pursued with courage through and through,",
      "This is the beauty that we all should seek here.",
      "So chase the beauty that sets souls ablaze,",
      "And live a life deserving of all praise."
    ],
    reflective: [
      "What makes a thing beautiful, I ask,",
      "Is it the form, the color, or the light,",
      "Or something deeper hiding 'neath the mask,",
      "A quality invisible to sight.",
      "I've seen great beauty in a weathered hand,",
      "That's worked and loved through many passing years,",
      "I've found more meaning in a grain of sand,",
      "Than in a diamond bought with golden coins.",
      "Perhaps beauty lives in how we see,",
      "Not in the object gazed upon so fair,",
      "The eye that looks with love sets beauty free,",
      "And finds it waiting, hiding, everywhere.",
      "So let me cultivate a loving eye,",
      "And watch the world's beauty multiply."
    ]
  }
};

// Simple syllable counter (approximation)
const countSyllables = (word: string): number => {
  word = word.toLowerCase().trim();
  if (word.length <= 2) return 1;
  
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
};

// Count syllables in a line
const countLineSyllables = (line: string): number => {
  const words = line.replace(/[^a-zA-Z\s]/g, '').split(/\s+/).filter(w => w.length > 0);
  return words.reduce((sum, word) => sum + countSyllables(word), 0);
};

// Get last sound for rhyme detection (simplified)
const getLastSound = (line: string): string => {
  const words = line.trim().split(/\s+/);
  const lastWord = words[words.length - 1]?.toLowerCase().replace(/[^a-z]/g, '') || '';
  // Return last 2-3 characters as a simple rhyme approximation
  return lastWord.slice(-3);
};

// Check rhyme scheme
const checkRhymeScheme = (lines: string[], scheme: string): { matches: boolean[]; pattern: string } => {
  const schemeLetters = scheme.replace(/\s/g, '').split('');
  const lastSounds: { [key: string]: string } = {};
  const matches: boolean[] = [];
  const detectedPattern: string[] = [];
  
  lines.forEach((line, index) => {
    if (index >= schemeLetters.length) return;
    
    const expectedLetter = schemeLetters[index];
    const lastSound = getLastSound(line);
    
    if (!lastSounds[expectedLetter]) {
      lastSounds[expectedLetter] = lastSound;
      matches.push(true);
      detectedPattern.push(expectedLetter);
    } else {
      const doesRhyme = lastSounds[expectedLetter].slice(-2) === lastSound.slice(-2);
      matches.push(doesRhyme);
      detectedPattern.push(doesRhyme ? expectedLetter : '?');
    }
  });
  
  return { matches, pattern: detectedPattern.join('') };
};

// FAQ data
const faqs = [
  {
    question: "How do I make my own sonnet?",
    answer: "To write a sonnet: 1) Choose a theme (love, nature, time, etc.), 2) Pick a sonnet type (Shakespearean is easiest for beginners), 3) Write 14 lines with roughly 10 syllables each, 4) Follow your chosen rhyme scheme (ABAB CDCD EFEF GG for Shakespearean), 5) Include a 'volta' or turn in thought around line 9 or 13, 6) End with a strong conclusion or twist in the final couplet."
  },
  {
    question: "What are the three rules of a sonnet?",
    answer: "The three fundamental rules of a sonnet are: 1) It must have exactly 14 lines, 2) It should follow a specific rhyme scheme (varies by type - Shakespearean uses ABAB CDCD EFEF GG, Petrarchan uses ABBA ABBA CDE CDE), 3) It should be written in iambic pentameter (10 syllables per line with alternating unstressed/stressed pattern). Most sonnets also include a 'volta' or thematic turn."
  },
  {
    question: "Is sonnet 12 or 14 lines?",
    answer: "A sonnet is always 14 lines, not 12. The word 'sonnet' comes from the Italian 'sonetto,' meaning 'little song.' All traditional sonnet forms—Shakespearean, Petrarchan, and Spenserian—contain exactly 14 lines. A 12-line poem would be considered a different poetic form."
  },
  {
    question: "What is a 14-line poem called?",
    answer: "A 14-line poem is called a sonnet. The sonnet is one of the oldest and most respected poetic forms, originating in 13th-century Italy. Famous sonnet writers include William Shakespeare (154 sonnets), Petrarch, Edmund Spenser, Elizabeth Barrett Browning, and John Milton. Sonnets traditionally explore themes of love, beauty, mortality, and nature."
  },
  {
    question: "What is iambic pentameter?",
    answer: "Iambic pentameter is the rhythmic pattern used in sonnets. 'Iambic' refers to an unstressed syllable followed by a stressed syllable (da-DUM), and 'pentameter' means five of these pairs per line, totaling 10 syllables. Example: 'Shall I compare thee to a summer's day?' reads as 'shall I / com-PARE / thee TO / a SUM / mer's DAY.' This rhythm creates a natural, speech-like flow."
  },
  {
    question: "What is a volta in a sonnet?",
    answer: "A volta (Italian for 'turn') is the moment in a sonnet where the theme, argument, or mood shifts. In Shakespearean sonnets, the volta typically occurs at line 13 (the final couplet), providing a conclusion or twist. In Petrarchan sonnets, it occurs at line 9, marking the transition from the problem (octave) to the resolution (sestet). The volta gives sonnets their characteristic depth and surprise."
  }
];

// FAQ component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #E5E7EB" }}>
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
        <h3 style={{ fontWeight: "600", color: "#111827", paddingRight: "16px", margin: 0, fontSize: "1rem" }}>{question}</h3>
        <svg
          style={{
            width: "20px",
            height: "20px",
            color: "#6B7280",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
            flexShrink: 0
          }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div style={{
        maxHeight: isOpen ? "500px" : "0",
        overflow: "hidden",
        transition: "max-height 0.2s ease-out"
      }}>
        <p style={{ color: "#4B5563", paddingBottom: "16px", margin: 0, lineHeight: "1.6" }}>{answer}</p>
      </div>
    </div>
  );
}

export default function SonnetGenerator() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"generator" | "checker" | "types">("generator");
  
  // Generator state (Tab 1)
  const [selectedTheme, setSelectedTheme] = useState("love");
  const [selectedTone, setSelectedTone] = useState("romantic");
  const [selectedType, setSelectedType] = useState("shakespearean");
  const [generatedSonnet, setGeneratedSonnet] = useState<string[]>([]);
  
  // Checker state (Tab 2)
  const [poemInput, setPoemInput] = useState("");
  const [checkerType, setCheckerType] = useState("shakespearean");

  // Generate sonnet
  const handleGenerate = () => {
    const template = sonnetTemplates[selectedTheme]?.[selectedTone];
    if (template) {
      setGeneratedSonnet([...template]);
    }
  };

  // Copy sonnet to clipboard
  const handleCopy = () => {
    const text = generatedSonnet.join('\n');
    navigator.clipboard.writeText(text);
    alert('Sonnet copied to clipboard!');
  };

  // Get rhyme scheme for selected type
  const getRhymeScheme = (type: string): string => {
    const found = sonnetTypes.find(t => t.id === type);
    return found?.rhymeScheme || "ABAB CDCD EFEF GG";
  };

  // Analyze the poem input
  const analyzePoem = () => {
    const lines = poemInput.trim().split('\n').filter(line => line.trim().length > 0);
    const targetLines = 14;
    const targetSyllables = 10;
    const rhymeScheme = getRhymeScheme(checkerType);
    
    // Line count check
    const lineCountOk = lines.length === targetLines;
    
    // Syllable check per line
    const syllableCounts = lines.map(line => countLineSyllables(line));
    const syllableChecks = syllableCounts.map(count => Math.abs(count - targetSyllables) <= 2);
    
    // Rhyme scheme check
    const rhymeResult = checkRhymeScheme(lines, rhymeScheme);
    
    return {
      lines,
      lineCount: lines.length,
      lineCountOk,
      syllableCounts,
      syllableChecks,
      rhymeMatches: rhymeResult.matches,
      rhymePattern: rhymeResult.pattern,
      expectedRhyme: rhymeScheme.replace(/\s/g, '')
    };
  };

  const analysis = poemInput.trim() ? analyzePoem() : null;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Sonnet Generator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>📝</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Sonnet Generator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Create beautiful 14-line sonnets with proper rhyme schemes and structure. Generate sonnets by theme, check your own poems, and learn about different sonnet types.
          </p>
        </div>

        {/* Quick Info Box */}
        <div style={{
          backgroundColor: "#FEF3C7",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #FCD34D"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>📜</span>
            <div>
              <p style={{ fontWeight: "600", color: "#92400E", margin: "0 0 4px 0" }}>What is a Sonnet?</p>
              <p style={{ color: "#92400E", margin: 0, fontSize: "0.95rem" }}>
                A sonnet is a 14-line poem written in iambic pentameter (10 syllables per line) with a specific rhyme scheme. 
                The most common types are Shakespearean (ABAB CDCD EFEF GG) and Petrarchan (ABBA ABBA CDE CDE).
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          {[
            { id: "generator", label: "Generate Sonnet", icon: "✨" },
            { id: "checker", label: "Check My Sonnet", icon: "✓" },
            { id: "types", label: "Sonnet Types Guide", icon: "📚" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              style={{
                padding: "12px 20px",
                borderRadius: "8px",
                border: activeTab === tab.id ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                backgroundColor: activeTab === tab.id ? "#F5F3FF" : "white",
                color: activeTab === tab.id ? "#6D28D9" : "#4B5563",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Generator */}
        {activeTab === "generator" && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#7C3AED", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>✨ Create Your Sonnet</h2>
              </div>
              
              <div style={{ padding: "24px" }}>
                {/* Theme Selection */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    Choose Theme
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {themes.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setSelectedTheme(theme.id)}
                        style={{
                          padding: "12px",
                          borderRadius: "8px",
                          border: selectedTheme === theme.id ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                          backgroundColor: selectedTheme === theme.id ? "#F5F3FF" : "white",
                          cursor: "pointer",
                          textAlign: "left",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px"
                        }}
                      >
                        <span>{theme.icon}</span>
                        <span style={{ fontSize: "0.9rem", color: selectedTheme === theme.id ? "#6D28D9" : "#374151" }}>{theme.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tone Selection */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    Choose Tone
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {tones.map((tone) => (
                      <button
                        key={tone.id}
                        onClick={() => setSelectedTone(tone.id)}
                        style={{
                          padding: "8px 16px",
                          borderRadius: "20px",
                          border: selectedTone === tone.id ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                          backgroundColor: selectedTone === tone.id ? "#F5F3FF" : "white",
                          color: selectedTone === tone.id ? "#6D28D9" : "#374151",
                          cursor: "pointer",
                          fontSize: "0.85rem"
                        }}
                      >
                        {tone.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Type Selection */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    Sonnet Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #E5E7EB",
                      fontSize: "1rem",
                      backgroundColor: "white"
                    }}
                  >
                    {sonnetTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name} ({type.rhymeScheme})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#7C3AED",
                    color: "white",
                    fontWeight: "600",
                    fontSize: "1rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px"
                  }}
                >
                  ✨ Generate Sonnet
                </button>
              </div>
            </div>

            {/* Output Panel */}
            <div className="calc-results" style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📜 Your Sonnet</h2>
              </div>
              
              <div style={{ padding: "24px" }}>
                {generatedSonnet.length > 0 ? (
                  <>
                    {/* Rhyme Scheme Display */}
                    <div style={{ marginBottom: "16px", padding: "12px", backgroundColor: "#F5F3FF", borderRadius: "8px" }}>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#6D28D9" }}>
                        <strong>Rhyme Scheme:</strong> {getRhymeScheme(selectedType)}
                      </p>
                    </div>
                    
                    {/* Sonnet Lines */}
                    <div style={{ 
                      fontFamily: "Georgia, serif", 
                      fontSize: "1rem", 
                      lineHeight: "1.8",
                      color: "#1F2937",
                      marginBottom: "20px"
                    }}>
                      {generatedSonnet.map((line, index) => (
                        <div key={index} style={{ display: "flex", gap: "12px", marginBottom: "4px" }}>
                          <span style={{ 
                            color: "#9CA3AF", 
                            fontSize: "0.75rem", 
                            width: "20px", 
                            textAlign: "right",
                            paddingTop: "3px"
                          }}>
                            {index + 1}
                          </span>
                          <span>{line}</span>
                        </div>
                      ))}
                    </div>

                    {/* Copy Button */}
                    <button
                      onClick={handleCopy}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB",
                        backgroundColor: "#F9FAFB",
                        color: "#374151",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px"
                      }}
                    >
                      📋 Copy to Clipboard
                    </button>
                  </>
                ) : (
                  <div style={{ textAlign: "center", color: "#9CA3AF", padding: "60px 20px" }}>
                    <span style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}>📝</span>
                    <p style={{ margin: 0 }}>Select options and click Generate to create your sonnet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Checker */}
        {activeTab === "checker" && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#2563EB", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>✓ Check Your Sonnet</h2>
              </div>
              
              <div style={{ padding: "24px" }}>
                {/* Sonnet Type for Checking */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Expected Sonnet Type
                  </label>
                  <select
                    value={checkerType}
                    onChange={(e) => setCheckerType(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #E5E7EB",
                      fontSize: "1rem"
                    }}
                  >
                    {sonnetTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name} ({type.rhymeScheme})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Poem Input */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Paste Your Poem (one line per row)
                  </label>
                  <textarea
                    value={poemInput}
                    onChange={(e) => setPoemInput(e.target.value)}
                    placeholder="Shall I compare thee to a summer's day?&#10;Thou art more lovely and more temperate:&#10;Rough winds do shake the darling buds of May,&#10;And summer's lease hath all too short a date..."
                    style={{
                      width: "100%",
                      height: "300px",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #E5E7EB",
                      fontSize: "0.95rem",
                      fontFamily: "Georgia, serif",
                      lineHeight: "1.6",
                      resize: "vertical",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <div style={{ padding: "12px", backgroundColor: "#EFF6FF", borderRadius: "8px" }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#1E40AF" }}>
                    💡 <strong>Tip:</strong> Enter each line of your poem on a new line. The checker will analyze line count, syllables, and rhyme scheme.
                  </p>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="calc-results" style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#DC2626", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Analysis Results</h2>
              </div>
              
              <div style={{ padding: "24px" }}>
                {analysis ? (
                  <>
                    {/* Line Count */}
                    <div style={{
                      padding: "16px",
                      borderRadius: "8px",
                      backgroundColor: analysis.lineCountOk ? "#ECFDF5" : "#FEE2E2",
                      marginBottom: "16px"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: "600", color: analysis.lineCountOk ? "#065F46" : "#991B1B" }}>
                          Line Count
                        </span>
                        <span style={{
                          padding: "4px 12px",
                          borderRadius: "12px",
                          backgroundColor: analysis.lineCountOk ? "#059669" : "#DC2626",
                          color: "white",
                          fontSize: "0.85rem"
                        }}>
                          {analysis.lineCount} / 14 {analysis.lineCountOk ? "✓" : "✗"}
                        </span>
                      </div>
                      {!analysis.lineCountOk && (
                        <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#991B1B" }}>
                          A sonnet must have exactly 14 lines. You have {analysis.lineCount} lines.
                        </p>
                      )}
                    </div>

                    {/* Syllable Analysis */}
                    <div style={{ marginBottom: "16px" }}>
                      <h4 style={{ margin: "0 0 12px 0", color: "#374151" }}>Syllables per Line (target: ~10)</h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "200px", overflowY: "auto" }}>
                        {analysis.lines.slice(0, 14).map((line, index) => (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              padding: "8px 12px",
                              backgroundColor: analysis.syllableChecks[index] ? "#ECFDF5" : "#FEF3C7",
                              borderRadius: "6px",
                              fontSize: "0.85rem"
                            }}
                          >
                            <span style={{ 
                              fontWeight: "600", 
                              color: "#6B7280",
                              minWidth: "24px"
                            }}>
                              {index + 1}.
                            </span>
                            <span style={{ 
                              flex: 1,
                              color: "#374151",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis"
                            }}>
                              {line.substring(0, 30)}{line.length > 30 ? "..." : ""}
                            </span>
                            <span style={{
                              padding: "2px 8px",
                              borderRadius: "4px",
                              backgroundColor: analysis.syllableChecks[index] ? "#059669" : "#D97706",
                              color: "white",
                              fontSize: "0.75rem"
                            }}>
                              {analysis.syllableCounts[index]} syl
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Rhyme Scheme */}
                    <div style={{
                      padding: "16px",
                      borderRadius: "8px",
                      backgroundColor: "#F5F3FF",
                      marginBottom: "16px"
                    }}>
                      <h4 style={{ margin: "0 0 8px 0", color: "#6D28D9" }}>Rhyme Scheme Analysis</h4>
                      <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#374151" }}>
                        <strong>Expected:</strong> {analysis.expectedRhyme}
                      </p>
                      <p style={{ margin: 0, fontSize: "0.9rem", color: "#374151" }}>
                        <strong>Detected:</strong> {analysis.rhymePattern || "N/A"}
                      </p>
                    </div>

                    {/* Overall Score */}
                    <div style={{
                      padding: "16px",
                      borderRadius: "8px",
                      backgroundColor: "#F9FAFB",
                      textAlign: "center"
                    }}>
                      <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: "#6B7280" }}>Overall Assessment</p>
                      <p style={{ 
                        margin: 0, 
                        fontSize: "1.5rem", 
                        fontWeight: "bold",
                        color: analysis.lineCountOk && analysis.syllableChecks.filter(Boolean).length >= 10 ? "#059669" : "#D97706"
                      }}>
                        {analysis.lineCountOk && analysis.syllableChecks.filter(Boolean).length >= 10 
                          ? "Good Sonnet Structure! ✓" 
                          : "Needs Some Work"}
                      </p>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center", color: "#9CA3AF", padding: "60px 20px" }}>
                    <span style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}>✓</span>
                    <p style={{ margin: 0 }}>Paste your poem to analyze its structure</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Types Guide */}
        {activeTab === "types" && (
          <div style={{ marginBottom: "40px" }}>
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#0891B2", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📚 Types of Sonnets</h2>
              </div>
              
              <div style={{ padding: "24px" }}>
                <div style={{ display: "grid", gap: "20px" }}>
                  {sonnetTypes.map((type) => (
                    <div
                      key={type.id}
                      style={{
                        padding: "24px",
                        backgroundColor: "#F9FAFB",
                        borderRadius: "12px",
                        border: "1px solid #E5E7EB"
                      }}
                    >
                      <h3 style={{ margin: "0 0 12px 0", color: "#111827", fontSize: "1.25rem" }}>{type.name}</h3>
                      
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "16px" }}>
                        <div style={{ padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                          <p style={{ margin: "0 0 4px 0", fontSize: "0.8rem", color: "#6B7280" }}>Structure</p>
                          <p style={{ margin: 0, fontWeight: "600", color: "#374151" }}>{type.structure}</p>
                        </div>
                        <div style={{ padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                          <p style={{ margin: "0 0 4px 0", fontSize: "0.8rem", color: "#6B7280" }}>Rhyme Scheme</p>
                          <p style={{ margin: 0, fontWeight: "600", color: "#7C3AED", fontFamily: "monospace" }}>{type.rhymeScheme}</p>
                        </div>
                        <div style={{ padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                          <p style={{ margin: "0 0 4px 0", fontSize: "0.8rem", color: "#6B7280" }}>Volta Position</p>
                          <p style={{ margin: 0, fontWeight: "600", color: "#374151" }}>{type.voltaPosition}</p>
                        </div>
                      </div>
                      
                      <p style={{ margin: 0, color: "#4B5563", lineHeight: "1.6" }}>{type.description}</p>
                    </div>
                  ))}
                </div>

                {/* Iambic Pentameter Explanation */}
                <div style={{
                  marginTop: "24px",
                  padding: "24px",
                  backgroundColor: "#FEF3C7",
                  borderRadius: "12px",
                  border: "1px solid #FCD34D"
                }}>
                  <h3 style={{ margin: "0 0 12px 0", color: "#92400E" }}>🎵 Understanding Iambic Pentameter</h3>
                  <p style={{ color: "#92400E", margin: "0 0 12px 0", lineHeight: "1.6" }}>
                    Iambic pentameter is the rhythmic heartbeat of sonnets. Each line has 10 syllables in a pattern of 
                    unstressed-stressed (da-DUM) repeated 5 times.
                  </p>
                  <div style={{ padding: "16px", backgroundColor: "white", borderRadius: "8px" }}>
                    <p style={{ margin: "0 0 8px 0", fontWeight: "600", color: "#374151" }}>Example from Shakespeare:</p>
                    <p style={{ margin: 0, fontFamily: "Georgia, serif", color: "#374151" }}>
                      &quot;Shall <strong>I</strong> com<strong>PARE</strong> thee <strong>TO</strong> a <strong>SUM</strong>mer&apos;s <strong>DAY</strong>?&quot;
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#6B7280" }}>
                      da-DUM da-DUM da-DUM da-DUM da-DUM (5 iambs = pentameter)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            {/* How to Write */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>📝 How to Write a Sonnet</h2>
              
              <div style={{ display: "grid", gap: "16px" }}>
                <div style={{ padding: "16px", backgroundColor: "#F5F3FF", borderRadius: "12px" }}>
                  <h4 style={{ color: "#6D28D9", margin: "0 0 8px 0" }}>Step 1: Choose Your Theme</h4>
                  <p style={{ color: "#374151", margin: 0, fontSize: "0.9rem" }}>
                    Traditional themes include love, beauty, mortality, nature, and time. Pick something you feel passionate 
                    about—genuine emotion will make your sonnet more powerful.
                  </p>
                </div>
                
                <div style={{ padding: "16px", backgroundColor: "#EFF6FF", borderRadius: "12px" }}>
                  <h4 style={{ color: "#1E40AF", margin: "0 0 8px 0" }}>Step 2: Select Your Form</h4>
                  <p style={{ color: "#374151", margin: 0, fontSize: "0.9rem" }}>
                    Shakespearean sonnets (ABAB CDCD EFEF GG) are great for beginners because each quatrain can explore 
                    a different aspect of your theme. Petrarchan sonnets work well for problem-solution structures.
                  </p>
                </div>
                
                <div style={{ padding: "16px", backgroundColor: "#ECFDF5", borderRadius: "12px" }}>
                  <h4 style={{ color: "#065F46", margin: "0 0 8px 0" }}>Step 3: Plan Your Structure</h4>
                  <p style={{ color: "#374151", margin: 0, fontSize: "0.9rem" }}>
                    Outline what each quatrain will address. Build tension through the first 12 lines, then resolve or 
                    twist it in the final couplet. Don&apos;t forget the volta (turn) around line 9 or 13.
                  </p>
                </div>
                
                <div style={{ padding: "16px", backgroundColor: "#FEF3C7", borderRadius: "12px" }}>
                  <h4 style={{ color: "#92400E", margin: "0 0 8px 0" }}>Step 4: Write and Refine</h4>
                  <p style={{ color: "#374151", margin: 0, fontSize: "0.9rem" }}>
                    Write a rough draft first, focusing on meaning. Then adjust syllable counts (aim for 10 per line) 
                    and perfect your rhymes. Read aloud to check the rhythm flows naturally.
                  </p>
                </div>
              </div>
            </div>

            {/* Famous Examples */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>🌟 Famous Sonnet Writers</h2>
              
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F5F3FF" }}>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Poet</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Era</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Famous Work</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { poet: "William Shakespeare", era: "1564-1616", work: "154 Sonnets (Sonnet 18, 116, 130)" },
                      { poet: "Petrarch", era: "1304-1374", work: "Il Canzoniere (366 poems)" },
                      { poet: "Edmund Spenser", era: "1552-1599", work: "Amoretti (89 sonnets)" },
                      { poet: "John Milton", era: "1608-1674", work: "On His Blindness" },
                      { poet: "Elizabeth Barrett Browning", era: "1806-1861", work: "Sonnets from the Portuguese" },
                      { poet: "John Keats", era: "1795-1821", work: "On First Looking into Chapman's Homer" }
                    ].map((row, idx) => (
                      <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                        <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "600" }}>{row.poet}</td>
                        <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.era}</td>
                        <td style={{ padding: "12px", border: "1px solid #E5E7EB" }}>{row.work}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Reference */}
            <div style={{ backgroundColor: "#F5F3FF", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #DDD6FE" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#6D28D9", marginBottom: "16px" }}>📋 Quick Reference</h3>
              <div style={{ fontSize: "0.875rem", color: "#374151", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}><strong>Lines:</strong> 14 (always)</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>Syllables:</strong> ~10 per line</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>Meter:</strong> Iambic pentameter</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>Volta:</strong> Line 9 or 13</p>
                <p style={{ margin: 0 }}><strong>Origin:</strong> 13th century Italy</p>
              </div>
            </div>

            {/* Rhyme Schemes */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "24px", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>🔤 Rhyme Schemes</h3>
              <div style={{ fontSize: "0.875rem" }}>
                {sonnetTypes.map((type, idx) => (
                  <div key={type.id} style={{ padding: "8px 0", borderBottom: idx < sonnetTypes.length - 1 ? "1px solid #E5E7EB" : "none" }}>
                    <strong style={{ color: "#374151" }}>{type.name.split(" ")[0]}</strong>
                    <p style={{ margin: "4px 0 0 0", fontFamily: "monospace", color: "#7C3AED" }}>{type.rhymeScheme}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/sonnet-generator" currentCategory="Lifestyle" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "24px" }}>Frequently Asked Questions</h2>
          <div>
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ padding: "16px", backgroundColor: "#F3F4F6", borderRadius: "8px" }}>
          <p style={{ fontSize: "0.75rem", color: "#6B7280", textAlign: "center", margin: 0 }}>
            📝 <strong>Disclaimer:</strong> The sonnets generated by this tool are created from pre-written templates for educational and creative inspiration purposes. 
            For original poetry, we encourage you to use these as starting points and add your own voice, imagery, and personal experiences.
          </p>
        </div>
      </div>
    </div>
  );
}