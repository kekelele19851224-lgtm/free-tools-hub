"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// ============================================
// 500+ Comment Templates Database
// ============================================

const templates = {
  thanks: {
    casual: {
      short: [
        "Thanks so much!",
        "Appreciate this!",
        "Thank you!",
        "This helped a lot!",
        "Needed this today!",
        "You're the best!",
        "So helpful!",
        "Thanks for sharing!",
        "Love this, thanks!",
        "Exactly what I needed!",
        "Bless you for this!",
        "Thank you for this!",
        "Really appreciate it!",
        "You're amazing!",
        "Thanks a million!"
      ],
      medium: [
        "Thank you so much for posting this, it really made my day!",
        "I really needed to see this today, thank you for sharing!",
        "This is exactly what I was looking for, thanks so much!",
        "You have no idea how much this helped me, thank you!",
        "I've been searching for this everywhere, thanks for posting!",
        "This is so helpful, I really appreciate you sharing it!",
        "Thank you for taking the time to make this content!",
        "I can't thank you enough for this, it's perfect!",
        "You always post the best content, thank you!",
        "This made my whole week better, thanks for sharing!"
      ]
    },
    enthusiastic: {
      short: [
        "THANK YOU SO MUCH!!",
        "OMG THANK YOU!!!",
        "YOU'RE AMAZING!!",
        "BLESS YOU!!",
        "LIFESAVER!!",
        "YOU'RE THE BEST!!",
        "THANK YOUUUU!!",
        "SO GRATEFUL!!",
        "APPRECIATE YOU!!",
        "YOU'RE A LEGEND!!"
      ],
      medium: [
        "OH MY GOD THANK YOU SO MUCH FOR THIS!! You're literally the best!!",
        "I can't believe you posted this!! THANK YOU SO MUCH!!",
        "YOU ARE ABSOLUTELY AMAZING FOR SHARING THIS!! Thank you!!",
        "THIS IS EVERYTHING I NEEDED!! Thank you thank you thank you!!",
        "I'm literally screaming thank you!! This is PERFECT!!",
        "You have NO IDEA how much this means to me!! THANK YOU!!",
        "BLESS YOUR SOUL for posting this!! I'm so grateful!!",
        "THIS JUST MADE MY ENTIRE YEAR!! Thank you so much!!",
        "I could cry right now thank you!! This is incredible!!",
        "YOU'RE MY FAVORITE PERSON TODAY!! Thank you!!"
      ]
    },
    genz: {
      short: [
        "ur a real one fr",
        "tysm bestie",
        "no cap this slaps",
        "you ate that up",
        "main character energy",
        "slay thank u",
        "this hits different",
        "ur literally iconic",
        "periodt thank u",
        "obsessed tysm"
      ],
      medium: [
        "bestie you really said lemme bless the timeline and you DID that",
        "not me saving this immediately tysm you're literally the best",
        "the way you just understood the assignment completely, thank u sm",
        "you're out here doing god's work and we appreciate you fr fr",
        "this is giving everything i needed in life rn tysm bestie",
        "you really woke up and chose to be iconic huh, thank u",
        "no bc why did this just change my whole life tysm",
        "the serve is unmatched thank you for blessing my fyp",
        "you're literally that girl/guy for this thank u sm",
        "not all heroes wear capes some just post on tiktok tysm"
      ]
    }
  },
  agree: {
    casual: {
      short: [
        "So true!",
        "Exactly!",
        "Facts!",
        "100% agree!",
        "This is it!",
        "Right?!",
        "Same here!",
        "Totally!",
        "Couldn't agree more!",
        "Yes yes yes!",
        "Preach!",
        "This right here!",
        "My thoughts exactly!",
        "You get it!",
        "Finally someone said it!"
      ],
      medium: [
        "I've been saying this for years, finally someone gets it!",
        "This is exactly what I've been thinking, thank you for saying it!",
        "You literally took the words right out of my mouth!",
        "I couldn't have said it better myself, this is so true!",
        "Finally someone put it into words, I agree completely!",
        "This is the most accurate thing I've seen all day!",
        "You're speaking facts and everyone needs to hear this!",
        "I wish I could like this a thousand times, so true!",
        "This deserves way more attention, you're absolutely right!",
        "I've never agreed with something more in my life!"
      ]
    },
    enthusiastic: {
      short: [
        "YESSS EXACTLY!!",
        "THIS IS SO TRUE!!",
        "FINALLY SOMEONE SAID IT!!",
        "LOUDER FOR THE BACK!!",
        "FACTS FACTS FACTS!!",
        "COULDN'T AGREE MORE!!",
        "THIS THIS THIS!!",
        "SAY IT LOUDER!!",
        "ABSOLUTELY RIGHT!!",
        "100000% THIS!!"
      ],
      medium: [
        "FINALLY SOMEONE SAID WHAT WE'RE ALL THINKING!! This is so true!!",
        "I want to scream this from the rooftops!! You're so right!!",
        "THIS NEEDS TO GO VIRAL!! Everyone needs to see this!!",
        "I've never hit the like button faster!! SO TRUE!!",
        "You're speaking the truth and nothing but the truth!!",
        "WHY ISN'T EVERYONE TALKING ABOUT THIS?! You're absolutely right!!",
        "I felt this in my SOUL!! Couldn't agree more!!",
        "This should be required viewing for everyone!! So accurate!!",
        "You just said what millions of people are thinking!!",
        "I'm standing up and applauding!! This is EXACTLY it!!"
      ]
    },
    genz: {
      short: [
        "no literally",
        "real talk fr",
        "this is the one",
        "said what needed to be said",
        "no cap detected",
        "based take",
        "W opinion",
        "spitting facts",
        "real ones know",
        "valid af"
      ],
      medium: [
        "no bc why is this so accurate it's actually scary",
        "you really just said what we've all been too scared to say",
        "the way this is literally the most real thing on this app",
        "finally someone with a brain on this app no offense",
        "this is the take we needed but didn't deserve tbh",
        "no literally this is giving truth and nothing but truth",
        "you understood the assignment and then some fr fr",
        "this should be pinned at the top of everyone's fyp",
        "the fact that this isn't viral yet is criminal behavior",
        "you're so real for this like genuinely thank you"
      ]
    }
  },
  funny: {
    casual: {
      short: [
        "I can't breathe lol",
        "Why is this so funny",
        "I'm dying lmao",
        "This sent me",
        "Too accurate lol",
        "I felt that",
        "Not me doing this",
        "The accuracy hurts",
        "I'm in this video",
        "Called out lol",
        "Dead serious me",
        "Why is this me",
        "Caught in 4k",
        "No need to attack me",
        "This is personal"
      ],
      medium: [
        "I'm literally crying laughing right now, this is too good",
        "Why did you have to call me out like this? I feel attacked",
        "This is so accurate it actually hurts, I can't stop laughing",
        "I showed this to everyone I know, we're all dying laughing",
        "The way I just spit out my drink watching this lmao",
        "I've watched this like 50 times and it gets funnier each time",
        "How is this so relatable? I feel personally victimized",
        "I'm saving this to watch whenever I need a laugh",
        "My neighbors probably think I'm crazy from laughing so hard",
        "This has no business being this funny, I'm actually crying"
      ]
    },
    enthusiastic: {
      short: [
        "I'M SCREAMING!!",
        "I CAN'T BREATHE!!",
        "THIS KILLED ME!!",
        "I'M SO DEAD!!",
        "STOP IT LOL!!",
        "CRYING RN!!",
        "HELP ME LMAOOO!!",
        "I'M WHEEZING!!",
        "TOO FUNNY!!",
        "I'M DECEASED!!"
      ],
      medium: [
        "I literally just woke up my entire family laughing at this!!",
        "I'M ON THE FLOOR RIGHT NOW THIS IS TOO MUCH!!",
        "WHY WOULD YOU DO THIS TO ME I CAN'T STOP LAUGHING!!",
        "I've watched this 100 times and I'm STILL laughing!!",
        "My stomach actually hurts from laughing so hard!!",
        "I'm literally in tears right now this is HILARIOUS!!",
        "SOMEONE COME GET ME OFF THE FLOOR I CAN'T!!",
        "This is the funniest thing I've seen all year NO JOKE!!",
        "I'm crying laughing at 3am someone help me!!",
        "My lungs have left the chat from laughing too hard!!"
      ]
    },
    genz: {
      short: [
        "pls i'm deceased",
        "not this lmaooo",
        "the way i screamed",
        "help why is this me",
        "no bc same tho",
        "crying in the club rn",
        "this is unhinged lol",
        "bestie stop",
        "the accuracy tho",
        "why you gotta do me like that"
      ],
      medium: [
        "no bc why did you just describe my entire life in one video",
        "the way this is so niche yet so universally relatable",
        "i'm showing this to my therapist next session no cap",
        "not me watching this at 3am trying not to wake everyone up",
        "bestie really said let me expose everyone real quick",
        "the fact that this lives rent free in my head now",
        "i have never felt so called out in my entire existence",
        "this is the content i signed up for when i downloaded this app",
        "the way my ancestors are looking down at me watching this",
        "no thoughts just this video on loop for the next 3 hours"
      ]
    }
  },
  question: {
    casual: {
      short: [
        "How did you do this?",
        "What app is this?",
        "Where is this?",
        "Can you share more?",
        "What's the song?",
        "Tutorial please?",
        "What product is this?",
        "How long did this take?",
        "Where did you get that?",
        "Can you explain more?",
        "What's the name of this?",
        "Any tips?",
        "How do I start?",
        "What's your secret?",
        "Part 2 please?"
      ],
      medium: [
        "This is amazing! Can you please share how you did this?",
        "I've been trying to do this forever, what's your secret?",
        "This is exactly what I need! Where can I find more info?",
        "Can you please make a tutorial? I need to learn this!",
        "I'm so curious, how long did it take you to learn this?",
        "This looks incredible! What equipment do you use?",
        "I've been looking for this everywhere! Where did you find it?",
        "Can you share the process? I'd love to try this myself!",
        "What inspired you to create this? I need the backstory!",
        "This is so cool! Do you have any tips for beginners?"
      ]
    },
    enthusiastic: {
      short: [
        "OMG HOW?!",
        "I NEED TO KNOW!!",
        "TELL US EVERYTHING!!",
        "WHERE IS THIS?!",
        "TUTORIAL PLEASE!!",
        "WHAT IS THIS?!",
        "HOW DO I DO THIS?!",
        "I NEED ANSWERS!!",
        "SHARE YOUR SECRETS!!",
        "PART 2 WHEN?!"
      ],
      medium: [
        "I NEED A FULL TUTORIAL RIGHT NOW!! How did you do this?!",
        "PLEASE TELL ME EVERYTHING!! I'm literally begging!!",
        "WHERE HAS THIS BEEN ALL MY LIFE?! I need more info!!",
        "I MUST KNOW YOUR SECRETS!! Please share!!",
        "HOW IS THIS EVEN POSSIBLE?! You have to explain!!",
        "I'VE BEEN SEARCHING FOR THIS FOREVER!! Where is it?!",
        "STOP EVERYTHING AND MAKE A TUTORIAL!! Please!!",
        "MY MIND IS BLOWN!! How do you do this?!",
        "I NEED THIS IN MY LIFE!! Where can I get it?!",
        "YOU CAN'T JUST POST THIS AND NOT EXPLAIN!! Tell us!!"
      ]
    },
    genz: {
      short: [
        "bestie spill the tea",
        "drop the link pls",
        "need the lore",
        "where's part 2",
        "explain rn",
        "drop the tutorial",
        "need the deets",
        "what's the song pls",
        "how sway",
        "give us the sauce"
      ],
      medium: [
        "bestie you can't just post this and not give us the full story",
        "no bc i need a 10 part series explaining everything immediately",
        "the way i need this info injected directly into my brain rn",
        "you really gonna gatekeep this from us huh drop the tutorial",
        "i'm gonna need you to explain like i'm five please and thank you",
        "not me screenshotting this so i can find it later drop the link",
        "the algorithm blessed me with this now bless me with answers",
        "bestie we need the unabridged director's cut version of this story",
        "you have my undivided attention now spill everything",
        "no thoughts just desperately needing to know how you did this"
      ]
    }
  },
  supportive: {
    casual: {
      short: [
        "You've got this!",
        "Keep going!",
        "So proud of you!",
        "You're doing great!",
        "Don't give up!",
        "Believe in yourself!",
        "You're amazing!",
        "Stay strong!",
        "Rooting for you!",
        "You inspire me!",
        "Keep shining!",
        "You matter!",
        "Stay positive!",
        "You're enough!",
        "Keep pushing!"
      ],
      medium: [
        "I believe in you so much, keep going and don't give up!",
        "You're doing amazing and I'm so proud of how far you've come!",
        "Remember that your journey is unique and you're doing great!",
        "Sending you all the positive energy and support right now!",
        "You're stronger than you know, keep pushing forward!",
        "Don't let anyone dim your light, you're incredible!",
        "Every step forward is progress, keep believing in yourself!",
        "You're an inspiration to so many people, never forget that!",
        "The world needs your light, keep shining bright!",
        "You're capable of achieving anything you set your mind to!"
      ]
    },
    enthusiastic: {
      short: [
        "YOU'VE GOT THIS!!",
        "SO PROUD OF YOU!!",
        "KEEP GOING!!",
        "YOU'RE AMAZING!!",
        "NEVER GIVE UP!!",
        "YOU'RE INCREDIBLE!!",
        "STAY STRONG!!",
        "YOU INSPIRE ME!!",
        "KEEP SHINING!!",
        "BELIEVE IN YOURSELF!!"
      ],
      medium: [
        "I am SO INCREDIBLY PROUD of you!! Keep going!!",
        "YOU ARE ABSOLUTELY CRUSHING IT!! Don't ever stop!!",
        "The world is SO LUCKY to have you!! Keep shining!!",
        "I BELIEVE IN YOU WITH MY WHOLE HEART!! You've got this!!",
        "YOU ARE STRONGER THAN YOU KNOW!! Keep pushing!!",
        "I'm literally your biggest fan!! YOU'RE AMAZING!!",
        "Nothing can stop you!! YOU'RE UNSTOPPABLE!!",
        "YOU INSPIRE ME EVERY SINGLE DAY!! Keep being you!!",
        "The universe is rooting for you!! KEEP GOING!!",
        "YOU ARE DESTINED FOR GREATNESS!! Never forget that!!"
      ]
    },
    genz: {
      short: [
        "you're literally that girl/guy",
        "main character energy fr",
        "we stan a legend",
        "iconic behavior only",
        "you ate and left no crumbs",
        "living your best life",
        "slay every single day",
        "you're so real for this",
        "keep being iconic bestie",
        "the serve is immaculate"
      ],
      medium: [
        "bestie you are literally living proof that dreams come true",
        "the way you just inspire me to be a better person every day",
        "you're out here showing everyone how it's done and we love to see it",
        "no bc the main character energy is just radiating off of you",
        "you really said 'watch me do the impossible' and then did it",
        "the fact that you exist makes the world a better place fr fr",
        "everyone should aspire to have your energy honestly",
        "you're the blueprint and everyone else is just a copy",
        "the way you just understand the assignment every single time",
        "bestie keep doing you because you're absolutely killing it"
      ]
    }
  },
  excited: {
    casual: {
      short: [
        "I love this!",
        "This is amazing!",
        "So good!",
        "Obsessed!",
        "This made my day!",
        "Incredible!",
        "Love it!",
        "This is everything!",
        "Wow just wow!",
        "Mind blown!",
        "Absolutely love this!",
        "This is perfect!",
        "Can't get enough!",
        "So satisfying!",
        "This is fire!"
      ],
      medium: [
        "I literally cannot stop watching this, it's so good!",
        "This is the best thing I've seen on this app in a long time!",
        "I'm completely obsessed with everything about this!",
        "This just made my entire week, I love it so much!",
        "I've shared this with everyone I know, it's that good!",
        "This is the content I signed up for, absolutely amazing!",
        "I can't believe how good this is, you're so talented!",
        "This deserves millions of views, it's incredible!",
        "I've been waiting for content like this, thank you!",
        "This hit different and I'm here for it!"
      ]
    },
    enthusiastic: {
      short: [
        "I'M OBSESSED!!",
        "THIS IS EVERYTHING!!",
        "ABSOLUTELY AMAZING!!",
        "I LOVE THIS SO MUCH!!",
        "THIS IS INCREDIBLE!!",
        "MIND = BLOWN!!",
        "I CAN'T EVEN!!",
        "THIS IS PERFECT!!",
        "BEST THING EVER!!",
        "I'M IN LOVE!!"
      ],
      medium: [
        "I AM COMPLETELY AND UTTERLY OBSESSED WITH THIS!!",
        "THIS IS THE GREATEST THING I HAVE EVER SEEN IN MY LIFE!!",
        "I'VE WATCHED THIS 500 TIMES AND I'M STILL NOT OVER IT!!",
        "MY JAW IS ON THE FLOOR THIS IS SO AMAZING!!",
        "I NEED EVERYONE I KNOW TO SEE THIS RIGHT NOW!!",
        "THIS JUST BECAME MY NEW FAVORITE THING EVER!!",
        "I CAN'T STOP SCREAMING THIS IS SO GOOD!!",
        "YOU JUST BROKE THE INTERNET WITH THIS ONE!!",
        "I'M LITERALLY SHAKING THIS IS SO INCREDIBLE!!",
        "NOTHING WILL EVER TOP THIS!! ABSOLUTELY PERFECT!!"
      ]
    },
    genz: {
      short: [
        "it's giving everything",
        "this slaps so hard",
        "absolutely unhinged (positive)",
        "rent free in my brain",
        "no thoughts just this",
        "this is the moment",
        "understood the assignment",
        "ate and left no crumbs",
        "this is that girl energy",
        "immaculate vibes only"
      ],
      medium: [
        "no bc this is literally living in my head rent free now",
        "the way this just became my entire personality overnight",
        "bestie really said 'let me create a masterpiece real quick'",
        "this is giving everything it was supposed to give and more",
        "not me watching this on loop for the next three hours straight",
        "the algorithm really said 'here's your new obsession' huh",
        "this is the energy i'm trying to channel for the rest of my life",
        "no thoughts head empty just this video playing on repeat",
        "the way this just understood exactly what i needed to see today",
        "this is the content that makes the internet worth existing fr"
      ]
    }
  },
  flirty: {
    casual: {
      short: [
        "Well hello there",
        "You're stunning!",
        "Excuse me wow",
        "Hi beautiful!",
        "Looking good!",
        "Love the vibe!",
        "You're so cute!",
        "Absolutely gorgeous!",
        "Can't stop staring",
        "Heart eyes only",
        "Wow just wow",
        "So attractive!",
        "You're a vibe",
        "Um hi gorgeous",
        "Love your energy!"
      ],
      medium: [
        "Okay but why are you literally the most attractive person ever?",
        "I'm trying to think of something clever but you're too pretty!",
        "Did it hurt when you fell from heaven? Sorry had to ask!",
        "I was having a bad day until I saw this, you're beautiful!",
        "Can someone please explain how you're this good looking?",
        "I think my heart just skipped a beat watching this!",
        "Trying to play it cool but you're making it really hard!",
        "I've watched this way too many times and I'm not sorry!",
        "You have no idea how beautiful you are and it shows!",
        "Someone call the police because you just stole my heart!"
      ]
    },
    enthusiastic: {
      short: [
        "EXCUSE ME?!",
        "HOW ARE YOU REAL?!",
        "I'M IN LOVE!!",
        "ABSOLUTELY STUNNING!!",
        "MY HEART!!",
        "YOU'RE PERFECT!!",
        "I CAN'T BREATHE!!",
        "MARRY ME!!",
        "GORGEOUS!!",
        "I'M OBSESSED!!"
      ],
      medium: [
        "OKAY BUT HOW ARE YOU ALLOWED TO BE THIS ATTRACTIVE?!",
        "I LITERALLY STOPPED SCROLLING SO FAST YOU'RE BEAUTIFUL!!",
        "MY HEART CANNOT HANDLE THIS LEVEL OF PERFECTION!!",
        "I'VE NEVER HIT THE FOLLOW BUTTON SO FAST IN MY LIFE!!",
        "SOMEONE PLEASE EXPLAIN HOW YOU'RE THIS GORGEOUS!!",
        "I'M HAVING A FULL BREAKDOWN OVER HOW PRETTY YOU ARE!!",
        "YOU JUST RUINED MY STANDARDS FOR EVERYONE ELSE!!",
        "I'M SIMPLY NOT OKAY AFTER WATCHING THIS!!",
        "THE WAY I ACTUALLY GASPED WHEN I SAW YOU!!",
        "YOU ARE LITERALLY THE MOST BEAUTIFUL PERSON I'VE EVER SEEN!!"
      ]
    },
    genz: {
      short: [
        "respectfully down bad",
        "you're so fine it's rude",
        "currently unwell",
        "this is illegal actually",
        "heart been broken",
        "adding you to the vision board",
        "manifesting you rn",
        "the audacity to be this hot",
        "i'm looking respectfully",
        "you have rizz fr"
      ],
      medium: [
        "no bc the audacity to just be this attractive on my fyp",
        "respectfully i am very much not okay after seeing this",
        "bestie really said 'let me just ruin everyone's standards real quick'",
        "the way my jaw actually dropped i need a moment please",
        "adding 'meet someone this fine' to my manifestation journal",
        "no thoughts just respectfully staring at this on loop",
        "the way you just awakened something in me i can't explain",
        "currently writing a strongly worded letter about how attractive you are",
        "the algorithm knew exactly what it was doing sending you to my fyp",
        "i'm gonna need you to dial it back like 2% for my mental health"
      ]
    }
  },
  clapback: {
    casual: {
      short: [
        "And yet here you are watching",
        "Cool story, anyway...",
        "Noted. Moving on.",
        "Thanks for the engagement!",
        "You seem fun at parties",
        "Imagine being this pressed",
        "Rent free huh?",
        "Who asked though?",
        "The block button exists",
        "Weird flex but okay",
        "Tell me you're jealous...",
        "That's your opinion I guess",
        "Stay mad I guess",
        "Your comment, my algorithm boost",
        "Reading this... and moving on"
      ],
      medium: [
        "It's interesting how you took time out of your day to comment this!",
        "Thanks for the engagement, the algorithm really appreciates you!",
        "I'll make sure to factor your opinion into absolutely nothing!",
        "Imagine being this bothered by content you can easily scroll past!",
        "The energy you spent on this comment could've been used elsewhere!",
        "Your negativity is really just free promotion for my content!",
        "I hope whatever's bothering you in life gets better soon!",
        "Thanks for watching long enough to leave a comment!",
        "I'm living in your head rent free and I love it here!",
        "Your comment says more about you than it does about me!"
      ]
    },
    enthusiastic: {
      short: [
        "ANYWAY STREAM MY CONTENT!!",
        "THANKS FOR THE VIEWS!!",
        "OBSESSED WITH ME I SEE!!",
        "RENT FREE BABY!!",
        "STAY MAD!!",
        "KEEP WATCHING!!",
        "I LIVE IN YOUR HEAD!!",
        "THANKS FOR COMMENTING!!",
        "MORE ENGAGEMENT FOR ME!!",
        "CAN'T RELATE!!"
      ],
      medium: [
        "THANK YOU SO MUCH FOR THE FREE ENGAGEMENT!! The algorithm loves you!!",
        "THE FACT THAT YOU TOOK TIME TO COMMENT THIS?? I'm flattered honestly!!",
        "IMAGINE BEING THIS PRESSED OVER SOMEONE LIVING THEIR BEST LIFE!!",
        "I LOVE THAT I AFFECTED YOU ENOUGH TO MAKE YOU COMMENT!!",
        "YOUR NEGATIVITY IS LITERALLY HELPING MY REACH SO THANK YOU!!",
        "THE WAY YOU'RE OBSESSED WITH ME IS ACTUALLY FLATTERING!!",
        "THANKS FOR CONTRIBUTING TO MY SUCCESS WITH THIS COMMENT!!",
        "I'LL BE OVER HERE THRIVING WHILE YOU STAY PRESSED!!",
        "THE BLOCK BUTTON IS FREE BUT THE ENGAGEMENT IS APPRECIATED!!",
        "STAY MAD, I'LL STAY WINNING!! Thanks for watching!!"
      ]
    },
    genz: {
      short: [
        "okay and?",
        "tell me you're pressed without telling me",
        "the projection is real",
        "living rent free i see",
        "chronically online behavior",
        "weird hill to die on but go off",
        "this is giving insecurity",
        "not you thinking i care",
        "the delusion is strong",
        "ratio + you fell off"
      ],
      medium: [
        "no bc imagine being this chronically online and still missing the point",
        "the way this comment screams 'i'm miserable and want company'",
        "bestie really typed this out thought 'yes perfect' and hit send huh",
        "tell me you have nothing better to do without telling me",
        "the projection in this comment could open a movie theater fr",
        "imagine being this pressed about someone you could simply not watch",
        "the fact that you're more invested in my content than i am lmaooo",
        "no thoughts just wondering why you're so obsessed with me",
        "this comment is giving 'peaked in high school' energy ngl",
        "bestie the algorithm doesn't care if your comment is negative it still counts"
      ]
    }
  }
};

// Emoji additions for each type
const emojiSets: { [key: string]: string[] } = {
  thanks: ["🙏", "❤️", "💕", "😊", "🥰", "✨", "💖", "🤗", "💗", "😍"],
  agree: ["💯", "👏", "🙌", "✅", "👆", "📢", "🎯", "💪", "🔥", "⭐"],
  funny: ["😂", "🤣", "💀", "😭", "🤭", "😆", "🙈", "😹", "🤪", "😅"],
  question: ["🤔", "❓", "👀", "🧐", "💭", "📝", "🙋", "✋", "🤷", "💡"],
  supportive: ["💪", "❤️", "🌟", "✨", "🤗", "💖", "🙌", "⭐", "🌈", "💫"],
  excited: ["🔥", "✨", "💖", "😍", "🤩", "💕", "⭐", "🙌", "💗", "🎉"],
  flirty: ["😍", "😘", "🥰", "💕", "❤️", "😏", "✨", "💖", "🦋", "💗"],
  clapback: ["💅", "✌️", "😌", "🙄", "💀", "🤷", "😏", "👋", "✨", "🫡"]
};

// Type labels for display
const typeLabels: { [key: string]: { label: string; emoji: string; description: string } } = {
  thanks: { label: "Thanks", emoji: "🙏", description: "Show appreciation" },
  agree: { label: "Agree", emoji: "💯", description: "Support their point" },
  funny: { label: "Funny", emoji: "😂", description: "Add humor" },
  question: { label: "Question", emoji: "❓", description: "Ask something" },
  supportive: { label: "Supportive", emoji: "💪", description: "Encourage them" },
  excited: { label: "Excited", emoji: "🔥", description: "Show enthusiasm" },
  flirty: { label: "Flirty", emoji: "😍", description: "Compliment them" },
  clapback: { label: "Clapback", emoji: "💅", description: "Reply to haters" }
};

// FAQ data
const faqs = [
  {
    question: "How do I use the TikTok comment generator?",
    answer: "Simply select the type of comment you want to make (thanks, funny, supportive, etc.), choose your preferred tone and length, decide if you want emojis, and click Generate. You'll get multiple comment options that you can copy and paste directly to TikTok."
  },
  {
    question: "Are these comments safe to use on TikTok?",
    answer: "Yes! These are general comment templates designed to help you engage authentically on TikTok. They don't violate TikTok's community guidelines. However, always make sure the comment is appropriate for the specific video you're commenting on."
  },
  {
    question: "Can I edit the generated comments?",
    answer: "Absolutely! The generated comments are meant to be starting points. Feel free to personalize them, add specific details about the video, or modify them to match your voice and style."
  },
  {
    question: "What's the best type of comment to get noticed?",
    answer: "Comments that are early, relevant, and engaging tend to get the most visibility. Funny comments, thoughtful questions, and genuine supportive messages often perform well. The key is to be authentic and add value to the conversation."
  },
  {
    question: "What does 'Gen-Z Slang' tone mean?",
    answer: "Gen-Z Slang uses popular internet and TikTok language like 'bestie', 'fr fr', 'no cap', 'slay', 'ate that up', etc. It's casual, trendy, and resonates well with younger TikTok audiences. If you're not familiar with these terms, the Casual or Enthusiastic tones might be better choices."
  },
  {
    question: "How many comments can I generate?",
    answer: "You can generate unlimited comments for free! Each time you click Generate, you'll get 3 fresh comment options based on your selected settings. Feel free to generate as many times as you need."
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
        <svg style={{ width: "20px", height: "20px", color: "#6B7280", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div style={{ maxHeight: isOpen ? "500px" : "0", overflow: "hidden", transition: "max-height 0.3s ease-out" }}>
        <p style={{ color: "#4B5563", paddingBottom: "16px", margin: 0, lineHeight: "1.7" }}>{answer}</p>
      </div>
    </div>
  );
}

export default function TikTokCommentGenerator() {
  const [commentType, setCommentType] = useState<string>("excited");
  const [tone, setTone] = useState<"casual" | "enthusiastic" | "genz">("casual");
  const [length, setLength] = useState<"short" | "medium">("short");
  const [includeEmoji, setIncludeEmoji] = useState(true);
  const [generatedComments, setGeneratedComments] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Generate comments function
  const generateComments = () => {
    const typeTemplates = templates[commentType as keyof typeof templates];
    if (!typeTemplates) return;

    const toneTemplates = typeTemplates[tone];
    if (!toneTemplates) return;

    const lengthTemplates = toneTemplates[length];
    if (!lengthTemplates || lengthTemplates.length === 0) return;

    // Shuffle and pick 3 random comments
    const shuffled = [...lengthTemplates].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3);

    // Add emojis if enabled
    const emojis = emojiSets[commentType] || ["✨"];
    const finalComments = selected.map(comment => {
      if (includeEmoji) {
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        const randomEmoji2 = emojis[Math.floor(Math.random() * emojis.length)];
        // Randomly add emoji at start, end, or both
        const placement = Math.random();
        if (placement < 0.33) {
          return `${randomEmoji} ${comment}`;
        } else if (placement < 0.66) {
          return `${comment} ${randomEmoji}`;
        } else {
          return `${randomEmoji} ${comment} ${randomEmoji2}`;
        }
      }
      return comment;
    });

    setGeneratedComments(finalComments);
    setCopiedIndex(null);
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FFF0F5" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #FBCFE8" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>TikTok Comment Generator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "2.5rem" }}>💬</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              TikTok Comment Generator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Generate engaging TikTok comments instantly. Choose from 8 comment types, 3 tones, 
            and get copy-paste ready comments to boost your engagement.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#FCE7F3",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #FBCFE8"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "#BE185D", margin: "0 0 4px 0" }}>
                <strong>Pro Tip:</strong> Comment early on trending videos!
              </p>
              <p style={{ color: "#9D174D", margin: 0, fontSize: "0.95rem" }}>
                The first comments often get the most likes. Use our generator to craft the perfect response quickly.
              </p>
            </div>
          </div>
        </div>

        {/* Main Calculator Grid */}
        <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
          {/* Input Panel */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #FBCFE8",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#EC4899", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                ⚙️ Comment Settings
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              {/* Comment Type Selection */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                  Comment Type
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                  {Object.entries(typeLabels).map(([key, { label, emoji }]) => (
                    <button
                      key={key}
                      onClick={() => setCommentType(key)}
                      style={{
                        padding: "12px 8px",
                        borderRadius: "8px",
                        border: commentType === key ? "2px solid #EC4899" : "1px solid #E5E7EB",
                        backgroundColor: commentType === key ? "#FCE7F3" : "white",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        fontWeight: commentType === key ? "600" : "400",
                        color: commentType === key ? "#BE185D" : "#4B5563",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "4px",
                        transition: "all 0.2s"
                      }}
                    >
                      <span style={{ fontSize: "1.25rem" }}>{emoji}</span>
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: "8px 0 0 0" }}>
                  {typeLabels[commentType]?.description}
                </p>
              </div>

              {/* Tone Selection */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                  Tone
                </label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {[
                    { value: "casual", label: "😊 Casual", desc: "Friendly & relaxed" },
                    { value: "enthusiastic", label: "🎉 Enthusiastic", desc: "HIGH ENERGY!!" },
                    { value: "genz", label: "✨ Gen-Z Slang", desc: "bestie fr fr" }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTone(option.value as "casual" | "enthusiastic" | "genz")}
                      style={{
                        padding: "10px 16px",
                        borderRadius: "8px",
                        border: tone === option.value ? "2px solid #EC4899" : "1px solid #E5E7EB",
                        backgroundColor: tone === option.value ? "#FCE7F3" : "white",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        fontWeight: tone === option.value ? "600" : "400",
                        color: tone === option.value ? "#BE185D" : "#4B5563",
                        flex: "1",
                        minWidth: "120px"
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Length Selection */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                  Length
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => setLength("short")}
                    style={{
                      padding: "10px 20px",
                      borderRadius: "8px",
                      border: length === "short" ? "2px solid #EC4899" : "1px solid #E5E7EB",
                      backgroundColor: length === "short" ? "#FCE7F3" : "white",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      fontWeight: length === "short" ? "600" : "400",
                      color: length === "short" ? "#BE185D" : "#4B5563",
                      flex: "1"
                    }}
                  >
                    📝 Short
                  </button>
                  <button
                    onClick={() => setLength("medium")}
                    style={{
                      padding: "10px 20px",
                      borderRadius: "8px",
                      border: length === "medium" ? "2px solid #EC4899" : "1px solid #E5E7EB",
                      backgroundColor: length === "medium" ? "#FCE7F3" : "white",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      fontWeight: length === "medium" ? "600" : "400",
                      color: length === "medium" ? "#BE185D" : "#4B5563",
                      flex: "1"
                    }}
                  >
                    📄 Medium
                  </button>
                </div>
              </div>

              {/* Emoji Toggle */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={includeEmoji}
                    onChange={(e) => setIncludeEmoji(e.target.checked)}
                    style={{ width: "20px", height: "20px", accentColor: "#EC4899" }}
                  />
                  <span style={{ fontSize: "0.9rem", color: "#374151", fontWeight: "500" }}>
                    Include Emojis 😀
                  </span>
                </label>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateComments}
                style={{
                  width: "100%",
                  padding: "16px",
                  backgroundColor: "#EC4899",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "background-color 0.2s"
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#DB2777"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#EC4899"}
              >
                ✨ Generate Comments
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="calc-results" style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #FBCFE8",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#BE185D", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                📋 Generated Comments
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              {generatedComments.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#6B7280" }}>
                  <p style={{ fontSize: "3rem", margin: "0 0 12px 0" }}>💬</p>
                  <p style={{ margin: 0 }}>Select your options and click Generate</p>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem" }}>You&apos;ll get 3 comment options to choose from</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {generatedComments.map((comment, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "16px",
                        backgroundColor: "#FDF2F8",
                        borderRadius: "12px",
                        border: "1px solid #FBCFE8",
                        position: "relative"
                      }}
                    >
                      <p style={{ margin: "0 0 12px 0", color: "#111827", fontSize: "1rem", lineHeight: "1.6" }}>
                        {comment}
                      </p>
                      <button
                        onClick={() => copyToClipboard(comment, index)}
                        style={{
                          padding: "8px 16px",
                          backgroundColor: copiedIndex === index ? "#10B981" : "#EC4899",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "0.85rem",
                          fontWeight: "500",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          transition: "all 0.2s"
                        }}
                      >
                        {copiedIndex === index ? (
                          <>✓ Copied!</>
                        ) : (
                          <>📋 Copy</>
                        )}
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={generateComments}
                    style={{
                      padding: "12px",
                      backgroundColor: "transparent",
                      color: "#EC4899",
                      border: "2px dashed #FBCFE8",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                      cursor: "pointer",
                      marginTop: "8px"
                    }}
                  >
                    🔄 Generate More Options
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #FBCFE8", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
                💬 How to Write Engaging TikTok Comments
              </h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  TikTok comments are a powerful way to build connections, grow your following, and engage with creators. 
                  A well-crafted comment can get thousands of likes and drive traffic to your profile.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Why Comments Matter on TikTok</h3>
                <div style={{
                  backgroundColor: "#FDF2F8",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #FBCFE8"
                }}>
                  <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "2.2" }}>
                    <li><strong>Visibility:</strong> Popular comments appear at the top for all viewers to see</li>
                    <li><strong>Profile clicks:</strong> Interesting comments make people curious about you</li>
                    <li><strong>Creator connections:</strong> Meaningful comments can lead to duets, stitches, and collaborations</li>
                    <li><strong>Algorithm boost:</strong> Engagement helps your own content get recommended</li>
                  </ul>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Tips for Better TikTok Comments</h3>
                <div style={{
                  backgroundColor: "#ECFDF5",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #86EFAC"
                }}>
                  <ol style={{ margin: 0, paddingLeft: "20px", lineHeight: "2.2" }}>
                    <li><strong>Be early:</strong> First comments get the most visibility</li>
                    <li><strong>Be relevant:</strong> Reference specific parts of the video</li>
                    <li><strong>Be authentic:</strong> Genuine reactions perform better than generic ones</li>
                    <li><strong>Use emojis wisely:</strong> They catch the eye but don&apos;t overdo it</li>
                    <li><strong>Ask questions:</strong> Comments with questions often get replies</li>
                  </ol>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Comment Types Explained</h3>
                <div style={{ display: "grid", gap: "12px", margin: "16px 0" }}>
                  <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
                    <strong>🙏 Thanks:</strong> Show appreciation for helpful content, tutorials, or tips
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
                    <strong>💯 Agree:</strong> Support the creator&apos;s point or validate their opinion
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
                    <strong>😂 Funny:</strong> Add humor, relate to the content, or make others laugh
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
                    <strong>❓ Question:</strong> Ask about products, locations, tutorials, or backstories
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
                    <strong>💪 Supportive:</strong> Encourage creators who share vulnerable or inspiring content
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
                    <strong>🔥 Excited:</strong> Express enthusiasm for content you genuinely love
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
                    <strong>😍 Flirty:</strong> Tasteful compliments (always be respectful!)
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
                    <strong>💅 Clapback:</strong> Witty responses to negative comments on your own videos
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Stats */}
            <div style={{ backgroundColor: "#FDF2F8", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FBCFE8" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#BE185D", marginBottom: "16px" }}>📊 TikTok Comment Facts</h3>
              <div style={{ fontSize: "0.9rem", color: "#9D174D", lineHeight: "2" }}>
                <p style={{ margin: 0 }}>• Comments boost video reach by up to 30%</p>
                <p style={{ margin: 0 }}>• Top comments get 10x more profile clicks</p>
                <p style={{ margin: 0 }}>• Questions get 2x more replies</p>
                <p style={{ margin: 0 }}>• Early comments get 5x more likes</p>
                <p style={{ margin: 0 }}>• Emojis increase engagement 25%</p>
              </div>
            </div>

            {/* TikTok Slang Guide */}
            <div style={{ backgroundColor: "#EEF2FF", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #C7D2FE" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#4F46E5", marginBottom: "16px" }}>📖 Gen-Z Slang Guide</h3>
              <div style={{ fontSize: "0.85rem", color: "#4338CA", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 4px 0" }}><strong>fr fr</strong> = for real for real</p>
                <p style={{ margin: "0 0 4px 0" }}><strong>no cap</strong> = no lie, seriously</p>
                <p style={{ margin: "0 0 4px 0" }}><strong>slay</strong> = amazing, killed it</p>
                <p style={{ margin: "0 0 4px 0" }}><strong>bestie</strong> = friend (even strangers)</p>
                <p style={{ margin: "0 0 4px 0" }}><strong>ate that</strong> = did amazing</p>
                <p style={{ margin: "0 0 4px 0" }}><strong>main character</strong> = confident energy</p>
                <p style={{ margin: "0 0 4px 0" }}><strong>rent free</strong> = can&apos;t stop thinking about</p>
                <p style={{ margin: 0 }}><strong>understood the assignment</strong> = nailed it</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/tiktok-comment-generator" currentCategory="Social" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #FBCFE8", padding: "32px", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "24px" }}>
            Frequently Asked Questions
          </h2>
          <div>
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ padding: "16px", backgroundColor: "#FDF2F8", borderRadius: "8px", border: "1px solid #FBCFE8" }}>
          <p style={{ fontSize: "0.75rem", color: "#9D174D", textAlign: "center", margin: 0 }}>
            ⚠️ <strong>Disclaimer:</strong> This tool generates comment templates to help you engage on TikTok. 
            Always ensure your comments are appropriate for the specific video and follow TikTok&apos;s Community Guidelines. 
            Be authentic and respectful in your interactions.
          </p>
        </div>
      </div>
    </div>
  );
}