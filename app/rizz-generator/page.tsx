"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// ============================================
// Rizz Templates Database
// ============================================

const rizzTemplates: {
  [style: string]: {
    [situation: string]: {
      [level: string]: string[]
    }
  }
} = {
  smooth: {
    dating_app: {
      subtle: [
        "Your profile caught my eye, but your smile made me stop scrolling.",
        "I don't usually message first, but your vibe is too good to pass up.",
        "Something tells me we'd have the best conversations.",
        "Your photos tell a story I'd love to hear more about.",
        "I have a feeling you're even more interesting than your bio suggests.",
        "Not gonna lie, I've been trying to think of something clever to say for 5 minutes.",
        "Your energy is magnetic, even through a screen.",
        "I'm usually pretty picky, but you made swiping easy.",
        "You seem like the kind of person who makes everywhere they go more fun.",
        "I'd love to know what's behind that smile."
      ],
      medium: [
        "I'm not saying you're the reason I believe in love at first swipe, but...",
        "Your profile is like a good book – I couldn't stop once I started.",
        "I'd unmatch everyone else just to talk to you.",
        "You're the kind of beautiful that makes people forget their pickup lines.",
        "I was having a normal day until I saw your profile. Now I'm intrigued.",
        "Something about you feels like a plot twist I didn't see coming.",
        "If charm were a currency, you'd be a billionaire.",
        "You must be a magician because everyone else disappeared when I saw you.",
        "I'm usually smooth, but you've got me a little nervous.",
        "Your vibe is immaculate and I had to say something."
      ],
      maximum: [
        "I'm already planning our first date in my head. Hope that's not weird.",
        "You're dangerously attractive and I'm here for it.",
        "I've never believed in love at first sight until about 10 seconds ago.",
        "You're the reason people write love songs.",
        "I'd delete this app today if it meant I got to meet you.",
        "Fair warning: I'm about to be your favorite notification.",
        "You just ruined my standards for everyone else.",
        "I don't believe in fate, but matching with you is making me reconsider.",
        "You're exactly my type and I didn't even know I had one.",
        "I'd travel any distance just to see that smile in person."
      ]
    },
    dm_text: {
      subtle: [
        "Hey, I saw your story and had to say hi.",
        "I've been meaning to reach out for a while. How's it going?",
        "Your posts always brighten my feed. Just wanted you to know.",
        "I don't usually slide into DMs, but you seem really cool.",
        "Hey! I noticed we have some mutual interests.",
        "Your vibe is so chill, I had to introduce myself.",
        "Random thought: you seem like someone I'd get along with.",
        "I've been wanting to say hi for a while. So... hi!",
        "Your content is fire. Had to let you know.",
        "Something about your energy made me want to reach out."
      ],
      medium: [
        "I've been trying to find an excuse to message you. This is it.",
        "Your presence on my feed is becoming a highlight of my day.",
        "I'm usually pretty reserved, but you broke through my wall.",
        "Okay I'll be honest – I've been wanting to talk to you for weeks.",
        "You're lowkey the most interesting person I follow.",
        "I had a dream we were friends. Taking it as a sign.",
        "Your energy is different and I mean that in the best way.",
        "Not to be dramatic but your posts give me life.",
        "I'm convinced we'd vibe. Prove me right?",
        "You seem like the type of person who'd make my day better."
      ],
      maximum: [
        "I'm not usually this forward, but you're worth the risk.",
        "Okay, I'm just gonna say it – you're absolutely stunning.",
        "You've been living in my head rent-free. Time to introduce myself.",
        "I couldn't scroll past you one more time without saying something.",
        "This might be bold, but I think we'd be amazing together.",
        "You're the reason I check this app way too often.",
        "I don't believe in playing it cool. You're incredible.",
        "Every time I see your posts, I like you more. Had to shoot my shot.",
        "Fair warning: I'm about to make your DMs a lot more interesting.",
        "You just became my favorite person to think about."
      ]
    },
    in_person: {
      subtle: [
        "I couldn't help but notice you from across the room.",
        "You have a really great energy. I just wanted to say hi.",
        "Excuse me, I just had to tell you – you have an amazing smile.",
        "I don't usually do this, but I'd regret it if I didn't come say hello.",
        "Something about you caught my attention and I had to introduce myself.",
        "Hi, I'm [name]. I noticed you and couldn't walk away without saying something.",
        "I hope this isn't too forward, but you seem really interesting.",
        "You look like someone I should know.",
        "I couldn't focus on anything else knowing you were in the room.",
        "Your vibe is magnetic. I had to come over."
      ],
      medium: [
        "I've been trying to work up the courage to talk to you all night.",
        "You're easily the most captivating person here.",
        "I don't believe in missed connections, so here I am.",
        "You have this energy that's impossible to ignore.",
        "I came here with friends but I'd rather spend time talking to you.",
        "Everyone else in this room just became background noise.",
        "I was having an okay night until I saw you. Now it's a great night.",
        "I'm usually pretty chill, but you've got me a little flustered.",
        "Something tells me you're about to make my night unforgettable.",
        "I promise I'm cooler than this nervous introduction suggests."
      ],
      maximum: [
        "I've never felt this drawn to someone I just saw. What's your secret?",
        "You're genuinely the most beautiful person I've ever approached.",
        "I don't care if this is bold – I had to tell you you're stunning.",
        "Forget playing it cool. You took my breath away.",
        "I'll be honest – I've been staring and I'm not even sorry.",
        "I don't need a drink; seeing you is enough to make my night.",
        "You're the kind of beautiful that makes people forget how to talk.",
        "I came here hoping to meet someone special. Pretty sure I just did.",
        "If I don't get your number, I'm going to regret it forever.",
        "I don't know what it is about you, but I'm completely captivated."
      ]
    },
    reply: {
      subtle: [
        "You're funny. I like that about you.",
        "That's actually a great point. I'm impressed.",
        "You have a way with words, don't you?",
        "I'm starting to think you might be as cool as you seem.",
        "Keep talking like that and I might actually fall for you.",
        "You're making this conversation way too easy.",
        "I could get used to talking to you.",
        "You're full of surprises, aren't you?",
        "I'm liking where this is going.",
        "You've got my attention. Now what are you gonna do with it?"
      ],
      medium: [
        "Okay, that was smooth. I'll give you credit for that one.",
        "You're really out here making me smile at my phone like an idiot.",
        "Stop being so charming. It's distracting.",
        "I can't tell if you're flirting or just naturally this likeable.",
        "You're dangerous. In the best way possible.",
        "I'm trying not to like you too fast but you're making it hard.",
        "You just jumped up on my favorites list.",
        "If this is your B-game, I'm scared to see your A-game.",
        "You've got this effect on me I can't quite explain.",
        "I'm officially intrigued. Tell me more."
      ],
      maximum: [
        "You're actually perfect. Where have you been hiding?",
        "Stop it. I'm blushing and I never blush.",
        "I think I might be falling for you and I just met you.",
        "You're making me want to break all my dating rules.",
        "I can't remember the last time someone made me feel this way.",
        "You're everything I didn't know I was looking for.",
        "Okay, you win. I'm completely charmed.",
        "I'm trying to play it cool but honestly? You've got me.",
        "I don't know what magic you're using but it's working.",
        "Consider me officially swept off my feet."
      ]
    }
  },
  funny: {
    dating_app: {
      subtle: [
        "I'm not a photographer, but I can picture us together.",
        "Are you a wifi signal? Because I'm feeling a connection.",
        "My dog wanted me to swipe right. I always trust his judgment.",
        "I was going to say something smooth but then I saw your face and forgot.",
        "I swiped right so fast I got a thumb cramp.",
        "Is your name Google? Because you have everything I've been searching for.",
        "I'm not great at math, but I'm pretty sure we're a match.",
        "You must be a magician because every time I look at you everyone else disappears.",
        "I'd offer you my jacket but we're both on our phones, so... emoji jacket? 🧥",
        "If you were a vegetable, you'd be a cute-cumber."
      ],
      medium: [
        "Are you a parking ticket? Because you've got fine written all over you.",
        "I must be a snowflake because I've fallen for you.",
        "Do you believe in love at first swipe, or should I unmatch and swipe again?",
        "I'm not saying you're a snack, but I'd definitely get hungry around you.",
        "Are you a bank loan? Because you've got my interest.",
        "I was wondering if you had an extra heart. Mine was just stolen.",
        "If beauty were a crime, you'd be serving a life sentence.",
        "You must be exhausted from running through my mind all day.",
        "Is your dad a boxer? Because you're a knockout.",
        "I'm no organ donor, but I'd give you my heart."
      ],
      maximum: [
        "Did your license get suspended for driving all these people crazy?",
        "If you were a Transformer, you'd be Optimus Fine.",
        "Are you a campfire? Because you're hot and I want s'more.",
        "I'm not a genie but I can make your dreams come true.",
        "Do you have a Band-Aid? I just scraped my knee falling for you.",
        "Are you a time traveler? Because I can see you in my future.",
        "If kisses were snowflakes, I'd send you a blizzard.",
        "You're so sweet, you could put Hershey's out of business.",
        "I must be a light switch because you turn me on.",
        "Are you a volcano? Because I lava you."
      ]
    },
    dm_text: {
      subtle: [
        "I'm here to apply for the position of your favorite notification.",
        "This is your sign to text me back. The universe says so.",
        "I slid into your DMs. Please don't call the slide police.",
        "My thumbs worked very hard to type this. Please appreciate them.",
        "I'm funnier in person, I promise. This is just the trailer.",
        "Plot twist: I'm actually interesting. Give me a chance to prove it.",
        "I'm not saying I'm Batman, but have you ever seen me and Batman in the same room?",
        "This message was sponsored by my desire to talk to you.",
        "I rehearsed this message 47 times. Nailed it.",
        "Warning: replying to this DM may result in excessive laughter."
      ],
      medium: [
        "I'm not saying you should reply, but my dog is sad and only your texts can fix it.",
        "Fun fact: responding to me increases your daily happiness by 300%.",
        "I promise I'm not as weird as this message makes me seem. Okay maybe a little.",
        "My last brain cell worked overtime to come up with this. Please respond.",
        "I'm legally required to tell you that I'm hilarious. It's a medical condition.",
        "I'm not a photographer but I can definitely picture us being friends.",
        "Did it hurt when you fell from the vending machine? Because you're a snack.",
        "I was going to send a cheesy message but I'm lactose intolerant.",
        "This is me shooting my shot. I have terrible aim so please catch it.",
        "My mom said I should talk to you. Just kidding. But also she's right."
      ],
      maximum: [
        "I put all my eggs in this basket. Please don't make me clean up yolk.",
        "I'm not a weatherman, but you can expect a few inches tonight. Of SNOW. Get your mind out of the gutter.",
        "Are you my appendix? Because I don't understand how you work but this feeling in my stomach makes me want to take you out.",
        "I'd say God bless you, but it looks like he already did.",
        "I'm not trying to impress you or anything, but I can eat a whole pizza by myself.",
        "On a scale of 1 to America, how free are you tonight?",
        "I must be a keyboard because you're just my type.",
        "Are you French? Because Eiffel for you.",
        "I'm not drunk, I'm just intoxicated by you.",
        "Did you invent the airplane? Because you seem Wright for me."
      ]
    },
    in_person: {
      subtle: [
        "I'm not a genie, but I think you just made one of my wishes come true.",
        "Do you have a map? I just got lost in your eyes.",
        "I seem to have lost my phone number. Can I have yours?",
        "Is your name Chapstick? Because you're da balm.",
        "I was feeling a little off today, but you definitely turned me on.",
        "Do you have a sunburn, or are you always this hot?",
        "I must be a calendar because I want to date you.",
        "Are you a camera? Because every time I look at you, I smile.",
        "My friends bet I couldn't talk to the prettiest person here. Want to help me win?",
        "I'm not an astronaut but I'd love to explore your universe."
      ],
      medium: [
        "If beauty was measured in seconds, you'd be an hour.",
        "I'm not a hoarder but I really want to keep you forever.",
        "Are you a magician? Because whenever I look at you, everyone else disappears.",
        "I hope you know CPR because you just took my breath away.",
        "Are you a loan from a bank? Because you've got my interest.",
        "I'm not a dentist, but I could give you a filling.",
        "Do you like science? Because I've got great chemistry with you.",
        "I'd say you're beautiful but beauty is on the inside and I haven't been inside you yet... WAIT THAT CAME OUT WRONG.",
        "You must be a ninja because you snuck into my heart.",
        "Is there a rainbow today? Because I just found my treasure."
      ],
      maximum: [
        "I'm not a photographer, but I can picture us together forever.",
        "If you were words on a page, you'd be fine print.",
        "My doctor says I'm lacking Vitamin U.",
        "Are you from Tennessee? Because you're the only ten I see.",
        "I thought happiness started with an H, but mine starts with U.",
        "You're so hot, you make the equator look like the North Pole.",
        "I'm learning about important dates in history. Want to be one of them?",
        "Are you a beaver? Because daaaaaam.",
        "I lost my teddy bear. Can I sleep with you tonight?",
        "My love for you is like diarrhea – I just can't hold it in. Wait, that's not romantic at all."
      ]
    },
    reply: {
      subtle: [
        "Did you just make a joke? Because I think I'm falling for you.",
        "Okay that was actually funny. You get points for that.",
        "My cheeks hurt from smiling at that. Thanks a lot.",
        "You're funnier than you have any right to be.",
        "I'm trying not to laugh but you're making it impossible.",
        "That joke was so bad it was actually good.",
        "You're giving main character energy and I'm here for it.",
        "I snorted. You should be proud and also ashamed.",
        "Okay comedian, save some funny for the rest of us.",
        "I'm adding 'can make me laugh' to your list of talents."
      ],
      medium: [
        "Stop it. I'm in public and people are looking at me laughing.",
        "You're hilarious and I hate that I like it.",
        "My sense of humor feels threatened by yours.",
        "I just laughed so hard I dropped my phone. You owe me a new screen.",
        "You're either really funny or I have really low standards. Either way, I'm into it.",
        "That was so good I'm screenshotting it.",
        "I'm sending that to my friend group chat. You're famous now.",
        "If being funny was a crime, you'd be on death row.",
        "You're dangerous with those jokes. Someone should stop you.",
        "I can't tell if you're flirting or just naturally this hilarious."
      ],
      maximum: [
        "Marry me. Just kidding. Unless...?",
        "I'm literally crying. This is a crisis.",
        "You just became my favorite person and I don't even know you.",
        "If humor is the way to someone's heart, you've already moved in.",
        "I've never wanted to meet someone more in my life.",
        "That joke was so good I think I love you now.",
        "You're the reason I have trust issues. Too much charm.",
        "I'm forwarding you to my mom. She needs to meet you.",
        "Consider this my official application to be your biggest fan.",
        "That's it. We're getting married. I don't make the rules."
      ]
    }
  },
  cheesy: {
    dating_app: {
      subtle: [
        "If you were a fruit, you'd be a fine-apple.",
        "Are you a camera? Because every time I see you, I smile.",
        "Do you have a name, or can I call you mine?",
        "You must be made of cheese because you're looking Gouda.",
        "Are you a light switch? Because you really turn me on.",
        "You're sweeter than 3.14. Cutie pie.",
        "Are you a keyboard? Because you're just my type.",
        "You must be a star because you light up my night.",
        "Is your dad a baker? Because you're a cutie pie.",
        "If I were a cat, I'd spend all 9 lives with you."
      ],
      medium: [
        "Do you have a Band-Aid? I just scraped my knee falling for you.",
        "I must be a snowflake because I've fallen for you.",
        "Are you made of copper and tellurium? Because you're Cu-Te.",
        "You must be tired from running through my mind all day.",
        "If beauty were time, you'd be an eternity.",
        "Did you sit in sugar? Because you have a pretty sweet... personality.",
        "You're the cheese to my macaroni.",
        "Are you a dictionary? Because you add meaning to my life.",
        "I was feeling a bit off today, but you turned me on.",
        "Is your dad an artist? Because you're a masterpiece."
      ],
      maximum: [
        "Did it hurt? When you fell from heaven?",
        "If you were a burger at McDonald's, you'd be the McGorgeous.",
        "Are you a 90 degree angle? Because you're looking right.",
        "I must be dead because you look like an angel.",
        "Is there an airport nearby or is that just my heart taking off?",
        "You're so sweet you're giving me a toothache.",
        "I'm not drunk, I'm just intoxicated by you.",
        "If kisses were snowflakes, I'd send you a blizzard.",
        "Your hand looks heavy, let me hold it for you.",
        "I didn't know angels could fly so low."
      ]
    },
    dm_text: {
      subtle: [
        "Is your name Google? Because you've got everything I've been searching for.",
        "You must be a magician because whenever I look at you, everyone else disappears.",
        "I'm not a genie, but I can make your dreams come true.",
        "Are you a parking ticket? Because you've got 'fine' written all over you.",
        "If I had a penny for every time I thought of you, I'd have one penny. Because you never leave my mind.",
        "You're like a dictionary – you add meaning to my life.",
        "Are you made of grapes? Because you're fine as wine.",
        "I was blinded by your beauty. I'm going to need your name and number for insurance purposes.",
        "You're so cute, I forgot my pickup line.",
        "Do you believe in love at first sight, or should I walk by again?"
      ],
      medium: [
        "Are you a bank loan? Because you've got my interest.",
        "I must be a snowstorm because I'm about to give you 6 inches. Of snow! Snow.",
        "You're so beautiful that you made me forget my cheesy pickup line.",
        "I'm not a photographer, but I can picture us together.",
        "If you were a vegetable, you'd be a cutecumber.",
        "Is your name WiFi? Because I'm really feeling a connection.",
        "You must be a broom, because you just swept me off my feet.",
        "Are you an alien? Because you just abducted my heart.",
        "I think there's something wrong with my eyes. I can't take them off you.",
        "Was that an earthquake, or did you just rock my world?"
      ],
      maximum: [
        "Are you a campfire? Because you're hot and I want s'more.",
        "I'm not a mathematician, but I'm pretty good with numbers. Give me yours and watch what I can do with it.",
        "If looks could kill, you'd be a weapon of mass destruction.",
        "Do you have a mirror in your pocket? Because I can see myself in your pants... WAIT I MEAN IN YOUR LIFE.",
        "You're so hot, you denature my proteins.",
        "Are you a cat? Because I'm feline a connection.",
        "I'm no organ donor, but I'd be happy to give you my heart.",
        "If you were a booger, I'd pick you first.",
        "Are you a time traveler? Because I can see you in my future.",
        "I must be a light switch, because you turn me on."
      ]
    },
    in_person: {
      subtle: [
        "I'm not a photographer, but I can picture us together.",
        "Is your name Wi-Fi? Because I'm feeling a connection.",
        "Are you a magician? Because whenever I look at you, everyone else disappears.",
        "Do you have a map? Because I just got lost in your eyes.",
        "Are you a parking ticket? Because you've got 'fine' written all over you.",
        "If you were a triangle, you'd be acute one.",
        "I must be a snowflake, because I've fallen for you.",
        "You're so beautiful that you made me forget my pickup line.",
        "I'm not drunk, I'm just intoxicated by you.",
        "If beauty were measured in seconds, you'd be an hour."
      ],
      medium: [
        "Did the sun come out, or did you just smile at me?",
        "I was feeling a little off today, but you definitely turned me on.",
        "You're like a dictionary. You add meaning to my life.",
        "I must be in a museum because you're a work of art.",
        "Is your dad a boxer? Because you're a knockout.",
        "Are you a camera? Because every time I look at you, I smile.",
        "If you were a vegetable, you'd be a cute-cumber.",
        "I'm learning about important dates in history. Want to be one of them?",
        "Are you a time traveler? Because I see you in my future.",
        "I must be a library book because you're checking me out."
      ],
      maximum: [
        "Did it hurt when you fell from the vending machine? Because you're a snack.",
        "If I could rearrange the alphabet, I'd put U and I together.",
        "I must be a snowstorm because I'm about to give you 8 to 10 inches... OF CONVERSATION.",
        "Are you a haunted house? Because I'm going to scream when I'm in you... WAIT NO.",
        "You're so sweet, my dentist warned me about you.",
        "If you were a steak, you'd be well done.",
        "Are you a volcano? Because I lava you.",
        "I hope you know CPR, because you take my breath away.",
        "Are you a beaver? Because DAM.",
        "I need a map, because I just got lost in your eyes and need directions to your heart."
      ]
    },
    reply: {
      subtle: [
        "That was so cheesy I think I need crackers.",
        "You're gouda at this, aren't you?",
        "That was corny but I'm not mad about it.",
        "I'm brie-ing honest, that was adorable.",
        "That line was so cheesy it belongs on a pizza.",
        "You're feta than I expected.",
        "I camembert how cute that was.",
        "That was cheesy but I'm lactose-loving it.",
        "You're provolone in my heart now.",
        "That line was so smooth it could be butter."
      ],
      medium: [
        "That was so cheesy I'm having dairy flashbacks.",
        "You've got dad joke energy and I'm weirdly into it.",
        "That was terrible. I loved it.",
        "My eyes rolled so hard they almost got stuck.",
        "That was the corniest thing I've ever heard. More please.",
        "You're lucky you're cute because that line was criminal.",
        "I'm cringing but also smiling. You win.",
        "That was so bad it circled back to being good.",
        "You're a menace and I appreciate it.",
        "I can't believe I laughed at that. Don't tell anyone."
      ],
      maximum: [
        "That was so cheesy I think I gained 5 pounds.",
        "Congratulations, that's the worst best line I've ever heard.",
        "I'm legally required to like you now after that one.",
        "That line was so old it should be in a museum. I love it.",
        "You've either got no shame or maximum confidence. Either way, I'm impressed.",
        "That was horrible. When can I hear more?",
        "I'm blocking you. Just kidding. Never stop.",
        "You've set the bar so low and I'm still impressed.",
        "That was peak dad energy and I'm strangely attracted to it.",
        "I've never wanted to both slap and hug someone at the same time."
      ]
    }
  },
  bold: {
    dating_app: {
      subtle: [
        "I'm not here for small talk. Let's skip to the good stuff.",
        "I'm usually picky, but something about you stood out.",
        "I don't need a bio to know I'm interested.",
        "I'll cut to the chase – you seem like my kind of person.",
        "I'm looking for something real. You seem like you might be too.",
        "Let's skip the awkward phase and get to the good conversations.",
        "I saw your profile and decided to take a chance.",
        "I'm direct – I think you're attractive and wanted you to know.",
        "No games here. Just genuine interest.",
        "I'd rather tell you I'm interested than play it cool."
      ],
      medium: [
        "I'm going to be straight with you – you're stunning.",
        "I don't usually do this, but I had to message you.",
        "You're exactly my type and I'm not afraid to say it.",
        "I'm putting myself out there. You're worth the risk.",
        "I saw you and knew I'd regret not shooting my shot.",
        "I'm here because you're the most interesting person I've seen on this app.",
        "No pressure, but I think we could have something great.",
        "I'm not looking to waste time. You seem different.",
        "I believe in going after what I want. And right now, that's talking to you.",
        "I'd rather be direct than play games. You caught my attention."
      ],
      maximum: [
        "I'm just going to say it – you're absolutely breathtaking.",
        "I'm all in. No games, no hesitation. I want to know you.",
        "You're the reason I'm still on this app.",
        "I've never been this direct but you deserve to know you're incredible.",
        "I'll be honest – I haven't stopped thinking about you since I saw your profile.",
        "I want to take you out. That's not a question, it's a statement.",
        "You're exactly what I've been looking for and I won't apologize for being forward.",
        "I don't need a conversation to know I'm interested. I just know.",
        "I'm ready to delete this app if you say yes to a date.",
        "I'm going to shoot my shot and hope it lands. You're worth it."
      ]
    },
    dm_text: {
      subtle: [
        "I've been wanting to message you for a while. Here I am.",
        "I'm not going to pretend I wasn't curious about you.",
        "I'd rather reach out than wonder 'what if.'",
        "I'm taking a chance. Hope you don't mind.",
        "Something about your energy made me want to introduce myself.",
        "I'm usually pretty reserved, but you changed that.",
        "No elaborate intro – just wanted to connect.",
        "I saw your posts and decided I needed to know more.",
        "I figured life's too short to not say hi to someone interesting.",
        "I'm not one for games. I wanted to talk to you, so I am."
      ],
      medium: [
        "I'll be real – I've been thinking about messaging you for days.",
        "I'm not usually this forward, but you seem worth it.",
        "I'm taking a risk here because I think you might be amazing.",
        "I'm done playing it cool. I'm interested and I wanted you to know.",
        "I'd rather tell you I think you're great than keep scrolling.",
        "I believe in being direct. You've had my attention for a while.",
        "I'm not here to waste your time. I genuinely want to get to know you.",
        "I saw something in you that made me want to reach out. So I did.",
        "I'm putting myself out there. The ball's in your court.",
        "I think we could vibe. Want to find out?"
      ],
      maximum: [
        "I'm going to be completely honest – you're unbelievably attractive.",
        "I can't stop thinking about you. Figured I should do something about it.",
        "You're different from everyone else and I had to tell you.",
        "I've never been this drawn to someone's energy. It's kind of wild.",
        "I'm not one to hold back. You've got me genuinely interested.",
        "I want to know everything about you. That's not hyperbole.",
        "I don't know what it is about you, but I needed to reach out.",
        "You're exactly my type and I refuse to let this opportunity pass.",
        "I'm not here to play games. I'm here because you're captivating.",
        "I've fallen for people slower than I'm falling for your vibe."
      ]
    },
    in_person: {
      subtle: [
        "I had to come over. Ignoring you wasn't an option.",
        "I don't usually approach people, but you're different.",
        "I'd rather introduce myself than regret not trying.",
        "I noticed you and decided to take a chance.",
        "You caught my eye and I had to say something.",
        "I'm not great at this, but I couldn't walk past without saying hi.",
        "I'd rather be direct – I think you're interesting.",
        "Something about you made me want to come over.",
        "I believe in making moves, so here I am.",
        "I'm going to be honest – I couldn't focus on anything else."
      ],
      medium: [
        "I'm not here to play games. I wanted to meet you.",
        "I've been watching you from across the room. Figured I should act.",
        "I'm putting myself out there because you seem worth it.",
        "I don't do this often, but something about you is magnetic.",
        "I'd rather know I tried than wonder what could've happened.",
        "I'm going to shoot my shot. You're the most interesting person here.",
        "I believe in going after what I want. Right now, that's a conversation with you.",
        "I couldn't leave without at least trying to talk to you.",
        "I'm done overthinking. I just want to talk to you.",
        "You have this energy I can't ignore."
      ],
      maximum: [
        "I'll be straightforward – you're the most beautiful person here.",
        "I've never approached anyone like this, but I've never seen anyone like you.",
        "I'm not afraid to say it – you took my breath away.",
        "I'm going all in. I think you're incredible.",
        "I saw you and forgot how to be cool. So I'm just being honest.",
        "I don't care about playing it safe. You're worth the risk.",
        "I've been trying to find courage to talk to you all night. This is it.",
        "You have something special and I needed you to know.",
        "I'm not going to pretend I'm not nervous. You're stunning.",
        "I'd regret it forever if I didn't tell you how amazing you look."
      ]
    },
    reply: {
      subtle: [
        "I appreciate that. You've got my attention now.",
        "Well, that was confident. I like it.",
        "Directness is underrated. Thank you.",
        "I respect someone who goes for what they want.",
        "That took guts. Consider me impressed.",
        "You're refreshingly honest. That's rare.",
        "I wasn't expecting that, but I'm not mad about it.",
        "That was bold. I'm intrigued.",
        "I appreciate you being real with me.",
        "You've definitely got my interest now."
      ],
      medium: [
        "Okay, I see you. You've got confidence and I like that.",
        "That was smooth and direct. A winning combination.",
        "I'm not used to someone being this upfront. It's refreshing.",
        "You're either very brave or very charming. Maybe both.",
        "That just made me like you more.",
        "Confidence looks good on you.",
        "You really went for it. I respect that.",
        "I appreciate someone who doesn't play games.",
        "That was bold and I'm into it.",
        "You definitely know how to make an impression."
      ],
      maximum: [
        "That was the most confident thing anyone's ever said to me.",
        "I'm actually speechless. In a good way.",
        "You really know how to make someone feel special.",
        "I was not prepared for that level of directness. I'm here for it.",
        "Consider me completely won over.",
        "That kind of confidence is incredibly attractive.",
        "I think I might like you already.",
        "You've set the bar ridiculously high.",
        "I'm not going to lie – that made my heart skip.",
        "That was so bold it actually worked. I'm impressed."
      ]
    }
  },
  sweet: {
    dating_app: {
      subtle: [
        "Hi! I just wanted to say you seem really lovely.",
        "Your smile in your photos is so warm. Had to say something.",
        "You seem like the kind of person who lights up a room.",
        "Something about your profile feels genuine. I appreciate that.",
        "I hope you're having a beautiful day. You deserve it.",
        "Your energy seems so positive. I wanted to connect.",
        "I bet people feel better just being around you.",
        "You have such kind eyes. I noticed right away.",
        "You seem like the type who'd be an amazing friend or more.",
        "I just had a feeling you'd be wonderful to talk to."
      ],
      medium: [
        "I hope this doesn't sound too forward, but you seem truly special.",
        "There's something about you that feels like home.",
        "I bet your laugh is the kind that makes everyone around you smile.",
        "You have this warmth about you that's impossible to ignore.",
        "I think you might be the kind of person who makes ordinary days extraordinary.",
        "Something tells me you're even more beautiful on the inside.",
        "I hope someone tells you how amazing you are every day.",
        "You seem like the kind of person I'd want to know for a long time.",
        "Your kindness shows even through a screen.",
        "I have a feeling talking to you would be the highlight of my week."
      ],
      maximum: [
        "I know this is bold, but you seem like someone truly worth knowing.",
        "I can't explain it, but I already feel like you're special.",
        "You're the kind of person who makes the world a little brighter.",
        "I'd be honored just to have a conversation with someone like you.",
        "I don't know you yet, but I already admire you.",
        "You seem like the kind of person I've been hoping to find.",
        "I hope whoever gets to know you appreciates how rare you are.",
        "Something about you just feels right.",
        "I think meeting you might be the start of something beautiful.",
        "You seem like sunshine in human form."
      ]
    },
    dm_text: {
      subtle: [
        "Hey! Just wanted to say your posts always make me smile.",
        "I hope you know how much positivity you bring to people.",
        "You seem like such a genuine soul. Wanted you to know.",
        "I hope your day is as lovely as you seem.",
        "Just stopping by to say you have such good energy.",
        "You brighten my feed every time you post.",
        "I noticed your kindness in your content. It's refreshing.",
        "I hope someone's told you how appreciated you are today.",
        "You seem like the kind of person everyone needs in their life.",
        "Just wanted to send some positivity your way."
      ],
      medium: [
        "I've been meaning to reach out and say you seem really wonderful.",
        "There's something about your energy that just feels warm.",
        "I hope you know you make a difference in people's day.",
        "You deserve to know you're appreciated more than you probably realize.",
        "I wanted to tell you that you seem genuinely special.",
        "You have this light about you that's impossible to miss.",
        "I bet people feel lucky to know you.",
        "You seem like the kind of person who makes everything better.",
        "I just wanted you to know that you brighten my day.",
        "There's something really beautiful about how authentic you are."
      ],
      maximum: [
        "I know this might be a lot, but I had to tell you you're incredible.",
        "You're the kind of person who restores people's faith in humanity.",
        "I don't know you well yet, but I can tell you have a beautiful soul.",
        "Meeting someone like you feels like finding something rare.",
        "I hope you know how much light you bring to the world.",
        "You seem like the kind of person poems are written about.",
        "I'm so glad you exist. The world needs more people like you.",
        "Something about you feels like it was meant to cross my path.",
        "I think you're extraordinary, and you probably don't hear that enough.",
        "You're the kind of person who makes life feel magical."
      ]
    },
    in_person: {
      subtle: [
        "I just had to tell you – you have a really lovely presence.",
        "I noticed you from across the room. You seem really sweet.",
        "I hope this is okay, but I wanted to say you seem wonderful.",
        "You have such a warm smile. I couldn't help but notice.",
        "I bet you light up every room you walk into.",
        "There's something really kind about your energy.",
        "I just wanted to say hi to someone who seems genuinely nice.",
        "You have this gentleness about you that's really refreshing.",
        "I don't usually do this, but you seem like someone worth knowing.",
        "Something about you made me want to say something nice to you."
      ],
      medium: [
        "I hope this isn't too forward, but you seem really special.",
        "You have this warmth that's impossible to ignore.",
        "I noticed you and felt like I needed to introduce myself.",
        "There's something about you that just feels like good energy.",
        "I bet everyone who knows you feels lucky.",
        "You seem like the kind of person who makes difficult days easier.",
        "I just wanted you to know that you seem really lovely.",
        "Something about you feels like sunshine.",
        "I noticed your kindness from across the room.",
        "You seem like the kind of person I'd love to have in my life."
      ],
      maximum: [
        "I know we just met, but I can already tell you're extraordinary.",
        "You have this glow that makes it impossible to look away.",
        "I hope you know how rare and wonderful you seem.",
        "Meeting you feels like the start of something meaningful.",
        "You're the kind of person who makes the world feel warmer.",
        "I don't usually say this, but you seem like a genuinely beautiful soul.",
        "There's something magical about being near you.",
        "I think you might be one of the most special people I've ever met.",
        "You deserve to know that you're absolutely radiant.",
        "I can already tell knowing you would be a privilege."
      ]
    },
    reply: {
      subtle: [
        "That was really sweet. Thank you for saying that.",
        "You're so kind. I really appreciate it.",
        "That just made my whole day better.",
        "I don't hear things like that often. It means a lot.",
        "You're really thoughtful. I can tell.",
        "That was such a lovely thing to say. Thank you.",
        "You have such a gentle way of expressing yourself.",
        "I'm smiling because of you. Just wanted you to know.",
        "That was so sweet it caught me off guard.",
        "Thank you for being so kind. It's rare."
      ],
      medium: [
        "You're honestly too sweet. I'm a little overwhelmed.",
        "I don't even know what to say. That was beautiful.",
        "You have this way of making people feel special. I love that.",
        "That was so unexpected and so appreciated.",
        "My heart is full right now. Thank you.",
        "You're the sweetest person I've talked to in a long time.",
        "I'm actually blushing. You're too kind.",
        "That really touched me. Thank you for being so genuine.",
        "I wasn't expecting to feel this appreciated today.",
        "You have such a beautiful way with words."
      ],
      maximum: [
        "I'm actually tearing up a little. That was so beautiful.",
        "I think you might be one of the kindest people I've ever encountered.",
        "You've completely melted my heart. I don't know what to say.",
        "That was the most beautiful thing anyone's ever said to me.",
        "I'm so grateful you reached out. You've made me feel so valued.",
        "You have this rare gift of making people feel truly seen.",
        "I don't think I've ever felt this appreciated.",
        "That touched my soul. You're genuinely wonderful.",
        "I can already tell you're someone incredibly special.",
        "I think I might be a little bit in love with your kindness."
      ]
    }
  },
  witty: {
    dating_app: {
      subtle: [
        "I could pretend I have a smooth opener, but honestly, your profile just made me curious.",
        "I'm not saying I'm great at this, but I am saying I was intrigued enough to try.",
        "On a scale of 1 to 'clearly bored at work,' how much effort did your bio take?",
        "I was going to open with a pun but figured I'd spare you. For now.",
        "Fair warning: I'm probably going to say something weird within 5 messages.",
        "I swiped right so fast I didn't even proofread your bio. Worth it.",
        "You look like someone who'd appreciate a well-timed reference. Am I right?",
        "I was going to compliment your looks, but your wit deserves recognition first.",
        "Here's my opening pitch: I'm interesting. Discuss.",
        "I'm here because your profile had actual personality. What a concept."
      ],
      medium: [
        "I would've messaged sooner but my thumbs were intimidated by your profile.",
        "I came here to swipe and make questionable life decisions. You look like the right kind of risk.",
        "I'm not saying I'm the best choice, but I'm definitely the most entertaining one.",
        "If flirting were an Olympic sport, I'd at least qualify. Thoughts?",
        "I had a witty opener planned but then I saw your face and forgot words existed.",
        "I'm mostly here for the banter. Please tell me you're fluent in sarcasm.",
        "I was going to be cool but then I decided authenticity was more fun.",
        "I'd send you a pick-up line but I figured you'd appreciate original content more.",
        "My strategy is charm and mild confusion. You've been warned.",
        "I'm the human equivalent of 'chaotic good.' Intrigued yet?"
      ],
      maximum: [
        "I have references available upon request. My ex said I was 'too much.' That's a compliment, right?",
        "I don't believe in playing hard to get. I believe in being so interesting you'll want to play along.",
        "You look like someone I'd regret not messaging. I hate regret more than rejection.",
        "I'm about to be the most fun mistake you've made this week.",
        "I'm not great at playing it cool, so let's just skip to the part where we're both delighted.",
        "I'd say I'm a catch, but I think that's your job to confirm. No pressure.",
        "You look like someone who appreciates a good plot twist. Hi, I'm yours.",
        "I'm going to be honest – I came here to impress you and I'm already running out of material.",
        "I'm the 'swipe right without thinking' kind of decision. You're welcome.",
        "If this conversation goes well, I'll take all the credit. If it doesn't, blame the algorithm."
      ]
    },
    dm_text: {
      subtle: [
        "This is either a great idea or a terrible one. Only one way to find out.",
        "I'm sliding in with zero plan and maximum hope.",
        "This message was brought to you by spontaneous decision-making.",
        "I'm not saying I rehearsed this, but I definitely didn't rehearse this.",
        "I figured 'hey' was boring so I went with 'hey but make it interesting.'",
        "Is it weird that I've seen your posts and decided I needed to know more? Probably. Anyway, hi.",
        "I have no strategy here. Just curiosity and questionable confidence.",
        "I could pretend I had a reason to message you, but honestly, I just wanted to.",
        "Here's my pitch: I'm mildly funny and mostly harmless.",
        "I'm here to either make a great impression or become a funny story. Let's see."
      ],
      medium: [
        "I'm reaching out because your vibe seemed worth the risk.",
        "This DM is powered by caffeine and the belief that you might be interesting.",
        "I was going to be smooth but then I thought 'nah, be yourself.' So here's this.",
        "I don't have a clever intro. Just genuine interest and slight nervousness.",
        "My opener is basically: 'Hi, please like me.' Very advanced stuff.",
        "I probably should've thought this through more, but here we are.",
        "I'm shooting my shot with the accuracy of a caffeinated person. Fingers crossed.",
        "If this goes well, I'll pretend I planned it. Deal?",
        "I'm here because curiosity won and anxiety lost.",
        "I decided to reach out before I could overthink it into oblivion."
      ],
      maximum: [
        "I've been meaning to message you for an embarrassing amount of time. Here I finally am.",
        "I'm going to be honest – this message went through about 14 drafts.",
        "I figured I'd rather be awkward now than regretful later. Hi.",
        "I don't know what the right thing to say is, so I'm just saying all the things.",
        "My brain said 'wait' but my fingers said 'send.' Here we are.",
        "I've been told I'm charming in a 'you'll see' kind of way.",
        "This is me being bold. It feels weird but also kinda great.",
        "I'd rather embarrass myself reaching out than wonder 'what if.'",
        "I'm not sure if this will work, but I'm sure I'll regret not trying.",
        "I decided to message you because you seem worth the potential embarrassment."
      ]
    },
    in_person: {
      subtle: [
        "I could pretend I had a smooth line, but really I just wanted to say hi.",
        "I noticed you and figured I'd come over before I could talk myself out of it.",
        "I don't have a strategy here. Just thought you seemed interesting.",
        "I was going to be cool but then decided authenticity was funnier.",
        "This is either going to be great or a funny story for later. Either way, hi.",
        "I noticed you from across the room and decided to trust my instincts.",
        "Fair warning: I'm much better at conversation than at introductions.",
        "I'm going to be honest – I have no idea what I'm doing but I couldn't not say hi.",
        "I figured I'd come over before I overthought myself into staying quiet.",
        "I promise I'm more charming once the initial awkwardness wears off."
      ],
      medium: [
        "I could pretend this was planned, but honestly you just seemed worth the spontaneous approach.",
        "Here's the thing – I noticed you and my feet moved before my brain caught up.",
        "I'm not sure what the right opening line is, so I'm going with 'hi, you seem interesting.'",
        "I'm taking a risk here, but you seem like someone who'd appreciate that.",
        "I had a witty line prepared but then I saw you up close and forgot everything.",
        "I came over with zero plan and maximum optimism. It's a strategy.",
        "I'm the 'shoot first, think later' type. In a non-violent, totally charming way.",
        "My friends dared me to talk to you. Just kidding, I wanted to. Don't tell them.",
        "I promise I'm funnier once you get past this slightly nervous introduction.",
        "I'm not usually this forward, but you seemed like an exception worth making."
      ],
      maximum: [
        "I'll be honest – you're the most interesting person here and I had to come say something.",
        "I've been working up the courage to talk to you for a while now. Here's my chance.",
        "I don't believe in smooth openers. I believe in genuine interest. And I'm interested.",
        "I could play it cool but that feels dishonest. So: hi, I think you're amazing.",
        "This is me being brave. You looked like someone worth being brave for.",
        "I've been told I'm either really charming or really awkward. Let's find out together.",
        "I don't know what possessed me to come over here, but I'm glad it did.",
        "I've been watching you all night, which sounds creepy but I promise is flattering.",
        "I'm here because I'd rather know I tried than wonder what could've been.",
        "If this goes badly, let's agree to laugh about it. If it goes well, let's take credit."
      ]
    },
    reply: {
      subtle: [
        "Okay, that was clever. You have my attention.",
        "I appreciate someone who can keep up. Points for you.",
        "That was witty and I'm mildly impressed.",
        "You're quick. I like that about you already.",
        "Okay, that landed. Well played.",
        "You've got a sharp sense of humor. Respect.",
        "That was funny in a way I wasn't expecting. Nice.",
        "I'm going to need more of whatever that was.",
        "Okay, you're clever. I'll give you that one.",
        "That was smart. Consider me engaged."
      ],
      medium: [
        "You're funnier than I expected. That's dangerous.",
        "That was so good I almost forgot to respond.",
        "I'm trying to think of something clever but you've set the bar high.",
        "You're quick and I'm threatened in the best way.",
        "That was smooth and I'm annoyed at how much I liked it.",
        "Okay, you're winning this conversation. I'll catch up.",
        "You have a gift and you should use it responsibly.",
        "That was impressive and I don't impress easily.",
        "I'm going to need you to be less charming. It's distracting.",
        "That hit different and I'm still processing."
      ],
      maximum: [
        "You might be the funniest person I've ever talked to. That's not hyperbole.",
        "I'm speechless and that never happens. What is this magic?",
        "That was so good I screenshot it. For research purposes.",
        "You're operating on a different level and I'm just trying to keep up.",
        "I think you might be my new favorite person.",
        "That was actual genius and I'm slightly in awe.",
        "I don't know what to say except: more of that please.",
        "You've won this conversation. I concede.",
        "That was so clever I need a moment to recover.",
        "I'm genuinely impressed and also slightly scared of your wit."
      ]
    }
  },
  poetic: {
    dating_app: {
      subtle: [
        "In a sea of profiles, yours was the lighthouse.",
        "Your eyes hold stories I'd love to read.",
        "Something in your smile feels like a verse I've been searching for.",
        "You're the kind of beautiful that deserves to be written about.",
        "If souls could speak, I think ours would have much to say.",
        "Your presence here feels like fate whispering.",
        "There's poetry in the way you carry yourself.",
        "I think you might be the metaphor I've been looking for.",
        "Something about you feels like coming home to a place I've never been.",
        "You're the pause between heartbeats – gentle but unforgettable."
      ],
      medium: [
        "If beauty were time, you'd be an eternity I'd gladly spend.",
        "You're the kind of person who makes ordinary days feel like sonnets.",
        "There's a universe in your eyes and I want to explore every star.",
        "You're the melody that plays when everything else goes quiet.",
        "I didn't know I was searching until your profile felt like finding.",
        "You're proof that some things are worth waiting for.",
        "There's something timeless about you in this temporary world.",
        "You're the first line of a poem I never want to finish.",
        "Meeting you feels like the beginning of something worth remembering.",
        "You're the kind of rare that makes everything else feel common."
      ],
      maximum: [
        "If I could write about you forever, it still wouldn't be enough.",
        "You're the kind of beautiful that makes artists understand their purpose.",
        "I've read a thousand love stories but you feel like my favorite one.",
        "You're the dawn after a long night – hopeful and golden.",
        "If my heart could speak, your name would be its first word.",
        "You're not just lovely – you're the reason the word exists.",
        "Every love poem I've ever read was practice for meeting you.",
        "You're the missing piece I didn't know my story needed.",
        "If life were a book, you'd be the chapter I'd re-read forever.",
        "You're the kind of extraordinary that changes everything that comes after."
      ]
    },
    dm_text: {
      subtle: [
        "I saw your light and had to reach out.",
        "Your posts feel like glimpses of something beautiful.",
        "There's poetry in your presence and I wanted you to know.",
        "You have this way of making the ordinary feel special.",
        "I couldn't scroll past someone who feels like art.",
        "Something about your energy speaks to my soul.",
        "You carry a kind of beauty that demands to be noticed.",
        "I wanted to tell you that you seem genuinely luminous.",
        "Your content feels like gentle rain on a quiet afternoon.",
        "There's depth in your eyes that makes me curious."
      ],
      medium: [
        "I've been trying to find the right words for you. I'm not sure they exist.",
        "You feel like a sunrise I wasn't expecting but desperately needed.",
        "Something about you makes silence feel loud.",
        "You're the kind of person who stays in people's minds long after.",
        "I don't know how to explain it, but you feel important.",
        "You're like a song that gets better every time you hear it.",
        "I think you might be the most beautifully complex person I've come across.",
        "There's something about you that feels like warm rain and safe harbors.",
        "You're the quiet kind of extraordinary that sneaks up on you.",
        "I had to tell you that you seem like something rare and worth knowing."
      ],
      maximum: [
        "You're the kind of person I'd write letters to at 2am.",
        "I think you might be someone's once-in-a-lifetime. Maybe mine.",
        "You're the ending I'd want for every story I've ever told.",
        "There's something about you that feels like forever in a temporary world.",
        "If souls could recognize each other, I think mine just did.",
        "You're the kind of beauty that makes time slow down.",
        "I don't know what magic you carry, but I feel it from here.",
        "You're the answer to a question I didn't know I was asking.",
        "I've seen many beautiful things, but you might be the first I truly felt.",
        "You're the kind of person who makes loving seem like the only option."
      ]
    },
    in_person: {
      subtle: [
        "I noticed you and couldn't look away. There's something about you.",
        "You carry yourself like a poem waiting to be read.",
        "I hope this isn't too much, but you feel like someone I was meant to meet.",
        "There's a softness in your eyes that caught my attention.",
        "Something about you feels like the calm after a storm.",
        "You seem like the kind of person who makes rooms feel warmer.",
        "I couldn't walk past without telling you – you have a rare energy.",
        "There's poetry in the way you exist. I had to say something.",
        "You're the kind of presence that demands to be appreciated.",
        "Something about you feels like a deep breath on a hard day."
      ],
      medium: [
        "I couldn't help but notice you. You have this light about you.",
        "You feel like the kind of moment you remember forever.",
        "There's something timeless about you in a world that moves so fast.",
        "You're the kind of beautiful that makes me believe in things again.",
        "I don't usually do this, but you felt like an exception I had to make.",
        "You carry a grace that feels increasingly rare.",
        "Something about you feels like music I've always known but just now heard.",
        "You seem like the kind of person who changes things just by being present.",
        "I feel like meeting you is significant. I can't explain why.",
        "You're the kind of person stories are told about."
      ],
      maximum: [
        "You're the most beautiful thing I've seen in a long time. And I mean that.",
        "I feel like I've been waiting to meet someone like you my whole life.",
        "There's something about you that feels like destiny.",
        "You're the kind of person who makes the whole world pause.",
        "I didn't believe in love at first sight until about 30 seconds ago.",
        "If I could capture this moment and keep it forever, I would.",
        "You're not just beautiful – you're the definition of it.",
        "Something in me knows that meeting you is the beginning of something.",
        "I've never felt this way just looking at someone. What are you?",
        "You're the kind of extraordinary that makes everything else feel small."
      ]
    },
    reply: {
      subtle: [
        "That was beautiful. You have a way with words.",
        "You speak like someone who truly feels things. I appreciate that.",
        "That touched me more than I expected. Thank you.",
        "There's depth in how you express yourself. It's rare.",
        "I don't think anyone's ever said something so lovely to me.",
        "You have a poet's heart. I can tell.",
        "That was unexpected and exactly what I needed to hear.",
        "You see people differently, don't you? It shows.",
        "I'm not sure what to say except... thank you.",
        "You made me feel seen in a way I haven't in a while."
      ],
      medium: [
        "I don't know how you did that with words, but I felt it.",
        "You're dangerously good at this. My heart isn't prepared.",
        "That was the most beautiful thing anyone's said to me.",
        "You speak in colors and I'm trying to keep up.",
        "I'm genuinely moved. That's not easy to do.",
        "You have this gift of making people feel special.",
        "I'm going to remember what you just said for a long time.",
        "That hit my soul. I'm not being dramatic.",
        "You're either very romantic or very wise. Maybe both.",
        "I didn't know I needed to hear that until you said it."
      ],
      maximum: [
        "I think you just said the most beautiful words I've ever heard.",
        "I'm not crying, you're crying. Okay, maybe I'm crying a little.",
        "That touched something in me I forgot existed.",
        "You've made me believe in beautiful things again.",
        "I'm completely undone by what you just said.",
        "I don't think I'll ever forget this conversation.",
        "You have a rare and precious soul. Please protect it.",
        "That was poetry and I'm honored to be on the receiving end.",
        "I think I might have found something truly special in you.",
        "You've touched my heart in a way I didn't know was possible."
      ]
    }
  },
  confident: {
    dating_app: {
      subtle: [
        "I know what I want and your profile got my attention.",
        "I'm selective and you made the cut. That means something.",
        "I don't message often, but I make exceptions for interesting people.",
        "I have high standards. You seem to meet them.",
        "Something about you says 'worth getting to know.'",
        "I trust my instincts and they're pointing me your way.",
        "I don't waste time on maybes. You feel like a yes.",
        "I know quality when I see it. That's why I'm here.",
        "I swipe carefully. You were an easy decision.",
        "I'm confident we'd have a good time. Want to find out?"
      ],
      medium: [
        "I'm not here to play games. I'm here because you're interesting.",
        "I know what I bring to the table. I think you might complement that.",
        "I'm the kind of person who goes after what they want. You caught my attention.",
        "I'm confident, not cocky. There's a difference and I know it.",
        "I'm looking for someone worth my time. You seem like you might be.",
        "I trust myself to know a good thing when I see it. And I see it.",
        "I'm not nervous about reaching out. I know what I have to offer.",
        "I believe in making things happen. This is me making a move.",
        "I'm selective about who I talk to. Consider this a compliment.",
        "I have a feeling about you. My feelings are usually right."
      ],
      maximum: [
        "I'm not going to pretend I'm not confident. I am. And you should get to know me.",
        "I know my worth and I recognize yours. That's a good foundation.",
        "I'm the best message you're going to get today. Prove me wrong.",
        "I don't do this often because I don't have to. But you're worth it.",
        "I know I'm a catch. I think you might be one too. Let's find out.",
        "I have no doubt we'd be great together. The only question is when.",
        "I'm not here to blend in. I'm here because I saw something special.",
        "I'm confident enough to tell you that I'm interested. The ball's in your court.",
        "I know exactly what I want. Right now, that's a conversation with you.",
        "I'm the kind of person who knows their value. I think you know yours too."
      ]
    },
    dm_text: {
      subtle: [
        "I reached out because I trust my judgment. And you seem worth it.",
        "I don't slide into DMs often. Consider this significant.",
        "I know quality content when I see it. Your posts caught my attention.",
        "I'm confident enough to say what I want. And I wanted to talk to you.",
        "I don't second-guess myself. I knew I should reach out, so I did.",
        "I trust my instincts about people. Mine are good with you.",
        "I'm not the type to wait around wondering. I make moves.",
        "I saw something in your posts that resonated. Here I am.",
        "I know what I'm looking for. Something about you fits.",
        "I reached out because I believe in going after interesting things."
      ],
      medium: [
        "I don't hesitate when I see something worth pursuing. You qualified.",
        "I'm confident in who I am. I think you might be too. That's attractive.",
        "I reached out because I don't do 'what ifs.' I do 'let's find out.'",
        "I'm not shy about what I want. And I want to know you.",
        "I trust myself to recognize someone special. You seem like one.",
        "I'm the kind of person who makes things happen. This is me trying.",
        "I don't need validation, but I do appreciate connection. You seem genuine.",
        "I'm confident enough to put myself out there. The rest is up to you.",
        "I saw your energy and knew I needed to reach out. Simple as that.",
        "I know I'm interesting. I have a feeling you are too."
      ],
      maximum: [
        "I'm going to be direct: I think we'd be great together.",
        "I don't doubt myself often, and I don't doubt this decision to reach out.",
        "I know exactly what I bring to the table. I'm curious what you do.",
        "I'm confident we'd have chemistry. Want to test that theory?",
        "I'm not here to waste your time or mine. I'm here because I'm interested.",
        "I trust myself completely. And something told me to talk to you.",
        "I'm the best decision you didn't know you were going to make today.",
        "I don't need to be chosen. But I am choosing you. Think about it.",
        "I know my value. I suspect you know yours too. That's a good match.",
        "I'm confident enough to say this: I think you should get to know me."
      ]
    },
    in_person: {
      subtle: [
        "I don't usually do this, but I trust my instincts. And they're saying hi.",
        "I came over because I know what I want when I see it.",
        "I'm confident enough to approach you. That has to count for something.",
        "I noticed you and decided to act. No hesitation.",
        "I trust my judgment about people. You seemed worth introducing myself to.",
        "I'm the kind of person who makes moves. Here's mine.",
        "I don't second-guess myself. I saw you and knew I should come over.",
        "I believe in going after what interests me. You qualified.",
        "I'm confident in who I am. I figured you might appreciate that.",
        "I came over because I'd rather try than wonder."
      ],
      medium: [
        "I know what I want and you caught my attention. Simple as that.",
        "I'm not the type to sit back and hope. I make things happen.",
        "I saw you and knew I'd regret not coming over. So here I am.",
        "I'm confident enough to tell you that you stood out to me.",
        "I trust myself to recognize something special. That's why I'm here.",
        "I don't hesitate when I see someone worth meeting. You qualified.",
        "I know my worth. And I suspect you know yours. Let's see if we match.",
        "I came over because I believe in creating opportunities.",
        "I'm not nervous. I'm excited. There's a difference.",
        "I saw you and my instincts said 'go.' So I went."
      ],
      maximum: [
        "I'm going to be straightforward: you're the most interesting person here.",
        "I know exactly what I want. And right now, I want this conversation.",
        "I'm confident in who I am and what I have to offer. Let me show you.",
        "I don't do small talk. I do meaningful connections. You feel like one.",
        "I came over because I know opportunity when I see it.",
        "I'm not here to play games. I'm here because you're worth my attention.",
        "I trust myself completely. And something about you feels right.",
        "I know my value. I suspect you're underestimating yours. Let me prove it.",
        "I'm the kind of person who sees what they want and goes for it. You're it.",
        "I didn't come over to test the waters. I came over because I'm sure."
      ]
    },
    reply: {
      subtle: [
        "I appreciate the confidence. It's refreshing.",
        "You know what you want. I respect that.",
        "That was self-assured without being arrogant. Nice balance.",
        "Confidence looks good on you.",
        "I appreciate someone who doesn't play games.",
        "You clearly know your worth. That's attractive.",
        "That was direct and I liked it.",
        "You have this certainty about you that's hard to ignore.",
        "I respect someone who goes after what they want.",
        "That confidence is doing a lot for you right now."
      ],
      medium: [
        "Your confidence is attractive and I'm not easily impressed.",
        "I appreciate someone who knows themselves. You clearly do.",
        "That energy is contagious. In a good way.",
        "You're confident without being cocky. That's rare.",
        "I'm impressed by how secure you seem. It's working.",
        "That self-assurance just jumped you up on my list.",
        "You know exactly who you are and it shows.",
        "I like someone who doesn't apologize for being themselves.",
        "That confidence is actually making me interested.",
        "You're secure in yourself and it's incredibly attractive."
      ],
      maximum: [
        "Your confidence is on another level and I'm here for it.",
        "I've never met someone so sure of themselves. It's captivating.",
        "That energy is something special. You clearly know it.",
        "You're the most self-assured person I've talked to. Impressive.",
        "That confidence just made you unforgettable.",
        "I think I might have met my match in confidence. This is exciting.",
        "You carry yourself like someone who knows they're worth it. You are.",
        "That was the most attractive display of self-assurance I've seen.",
        "I'm drawn to your energy in a way I can't explain.",
        "Your confidence is magnetic. I'm completely pulled in."
      ]
    }
  }
};

// Topics for personalization
const topicStarters: { [topic: string]: string[] } = {
  music: [
    "I noticed you're into music",
    "Something tells me you have great taste in music",
    "I bet your playlist is fire"
  ],
  travel: [
    "I saw you love traveling",
    "You seem like someone who has great travel stories",
    "I bet you've been to some amazing places"
  ],
  coffee: [
    "Coffee lover, huh?",
    "I bet you know all the best coffee spots",
    "Something tells me you appreciate a good brew"
  ],
  fitness: [
    "I can tell you take fitness seriously",
    "You seem like someone dedicated to their health",
    "I respect the gym dedication"
  ],
  food: [
    "I bet you know all the best restaurants",
    "You seem like a foodie",
    "Something tells me you appreciate good food"
  ],
  art: [
    "You seem creative",
    "I can tell you have an artistic side",
    "You have great aesthetic taste"
  ],
  reading: [
    "You seem like someone who reads",
    "I bet you have great book recommendations",
    "There's something thoughtful about you"
  ],
  gaming: [
    "Fellow gamer, I see",
    "I bet you have great taste in games",
    "You seem like someone who knows their way around a controller"
  ]
};

// Emoji sets
const emojiSets = {
  romantic: ["💕", "💘", "💗", "💓", "❤️", "😘", "🥰", "💋"],
  playful: ["😏", "😉", "😜", "🙈", "🔥", "✨", "💫", "⭐"],
  sweet: ["🌸", "🌹", "💐", "🦋", "🌙", "☀️", "💝", "🍀"],
  confident: ["👑", "💪", "🎯", "🚀", "⚡", "🔥", "💯", "🎤"]
};

// FAQ data
const faqs = [
  {
    question: "What is rizz and where did it come from?",
    answer: "Rizz is Gen-Z slang for charisma, specifically the ability to charm or attract someone romantically. The term was popularized in 2022-2023, originating from internet culture and streamers. Having 'rizz' means you're smooth, charming, and good at flirting. 'Unspoken rizz' refers to attracting someone without even saying anything."
  },
  {
    question: "Do rizz generators actually work?",
    answer: "Rizz generators can be helpful as conversation starters and inspiration, but they work best when you personalize them to your style. The key is authenticity – use the generated lines as a starting point, but deliver them in your own voice. Confidence and timing matter more than the exact words you use."
  },
  {
    question: "How do I improve my rizz?",
    answer: "Improving your rizz comes down to: 1) Building genuine confidence in yourself, 2) Practicing conversation skills, 3) Being genuinely interested in the other person, 4) Having a good sense of humor, 5) Reading social cues, and 6) Being respectful and authentic. Rizz isn't about manipulation – it's about charming connection."
  },
  {
    question: "What are the best rizz lines to use?",
    answer: "The best rizz lines are ones that feel natural to you and appropriate for the situation. Smooth lines work well for dating apps, funny lines break tension, sweet lines show genuine interest, and confident lines demonstrate self-assurance. Match your line to the vibe you want to create and the person you're talking to."
  },
  {
    question: "Is there a real Rizz AI app?",
    answer: "There are various apps and websites that use AI to generate pickup lines and conversation starters. Our generator uses a curated database of lines organized by style, situation, and intensity level, giving you more control over the type of rizz you want to use."
  },
  {
    question: "When should I not use pickup lines?",
    answer: "Avoid pickup lines when: 1) Someone has indicated they're not interested, 2) The setting is inappropriate (work, serious occasions), 3) The person seems uncomfortable, 4) You're relying only on lines without genuine conversation, or 5) The line could be seen as disrespectful. Always prioritize the other person's comfort and read the room."
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

// Helper function
function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomEmoji(style: string): string {
  if (style === "sweet" || style === "poetic") return getRandomItem(emojiSets.sweet);
  if (style === "bold" || style === "confident") return getRandomItem(emojiSets.confident);
  if (style === "funny" || style === "cheesy") return getRandomItem(emojiSets.playful);
  return getRandomItem(emojiSets.romantic);
}

export default function RizzGenerator() {
  const [situation, setSituation] = useState("dating_app");
  const [style, setStyle] = useState("smooth");
  const [level, setLevel] = useState("medium");
  const [topic, setTopic] = useState("");
  const [includeEmoji, setIncludeEmoji] = useState(true);
  const [generatedLines, setGeneratedLines] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Style labels
  const styleLabels: { [key: string]: { label: string; emoji: string; desc: string } } = {
    smooth: { label: "Smooth", emoji: "🎭", desc: "Natural and effortless charm" },
    funny: { label: "Funny", emoji: "😂", desc: "Humor and playful banter" },
    cheesy: { label: "Cheesy", emoji: "🧀", desc: "Classic corny pickup lines" },
    bold: { label: "Bold", emoji: "🔥", desc: "Direct and confident" },
    sweet: { label: "Sweet", emoji: "🍬", desc: "Warm and genuine" },
    witty: { label: "Witty", emoji: "🧠", desc: "Clever and intelligent" },
    poetic: { label: "Poetic", emoji: "📜", desc: "Romantic and artistic" },
    confident: { label: "Confident", emoji: "👑", desc: "Self-assured energy" }
  };

  // Situation labels
  const situationLabels: { [key: string]: { label: string; emoji: string } } = {
    dating_app: { label: "Dating App", emoji: "📱" },
    dm_text: { label: "DM / Text", emoji: "💬" },
    in_person: { label: "In Person", emoji: "👋" },
    reply: { label: "Reply", emoji: "↩️" }
  };

  // Generate function
  const generateRizz = () => {
    const lines: string[] = [];
    const templatePool = rizzTemplates[style]?.[situation]?.[level] || [];

    if (templatePool.length === 0) {
      lines.push("No lines available for this combination. Try different settings!");
      setGeneratedLines(lines);
      return;
    }

    // Get 3 random unique lines
    const shuffled = [...templatePool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3);

    selected.forEach((line) => {
      let finalLine = line;

      // Add topic if provided
      if (topic && topicStarters[topic.toLowerCase()]) {
        const starter = getRandomItem(topicStarters[topic.toLowerCase()]);
        if (Math.random() > 0.5) {
          finalLine = `${starter}. ${finalLine}`;
        }
      }

      // Add emoji if enabled
      if (includeEmoji) {
        const emoji = getRandomEmoji(style);
        finalLine = `${finalLine} ${emoji}`;
      }

      lines.push(finalLine);
    });

    setGeneratedLines(lines);
    setCopiedIndex(null);
  };

  // Copy function
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
    <div style={{ minHeight: "100vh", backgroundColor: "#FFF1F2" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #FECDD3" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Rizz Generator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "2.5rem" }}>💘</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Rizz Generator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Generate smooth pickup lines, flirty messages, and confident conversation starters. 
            Choose your style, situation, and vibe to create the perfect rizz.
          </p>
        </div>

        {/* Quick Tip */}
        <div style={{
          backgroundColor: "#FFE4E6",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #FECDD3"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "#BE123C", margin: "0 0 4px 0" }}>
                <strong>Pro Tip:</strong> Confidence is key!
              </p>
              <p style={{ color: "#E11D48", margin: 0, fontSize: "0.95rem" }}>
                The best rizz comes from being genuine. Use these lines as inspiration, but deliver them in your own voice.
              </p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
          {/* Input Panel */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #FECDD3",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#E11D48", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                ⚙️ Rizz Settings
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              {/* Situation */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                  💬 Situation
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                  {Object.entries(situationLabels).map(([key, { label, emoji }]) => (
                    <button
                      key={key}
                      onClick={() => setSituation(key)}
                      style={{
                        padding: "10px 6px",
                        borderRadius: "8px",
                        border: situation === key ? "2px solid #E11D48" : "1px solid #E5E7EB",
                        backgroundColor: situation === key ? "#FFE4E6" : "white",
                        cursor: "pointer",
                        fontSize: "0.8rem",
                        fontWeight: situation === key ? "600" : "400",
                        color: situation === key ? "#BE123C" : "#4B5563",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      <span style={{ fontSize: "1.2rem" }}>{emoji}</span>
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Style */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                  🎭 Rizz Style
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                  {Object.entries(styleLabels).map(([key, { label, emoji }]) => (
                    <button
                      key={key}
                      onClick={() => setStyle(key)}
                      style={{
                        padding: "10px 6px",
                        borderRadius: "8px",
                        border: style === key ? "2px solid #E11D48" : "1px solid #E5E7EB",
                        backgroundColor: style === key ? "#FFE4E6" : "white",
                        cursor: "pointer",
                        fontSize: "0.8rem",
                        fontWeight: style === key ? "600" : "400",
                        color: style === key ? "#BE123C" : "#4B5563",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      <span style={{ fontSize: "1.1rem" }}>{emoji}</span>
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: "8px 0 0 0" }}>
                  {styleLabels[style]?.desc}
                </p>
              </div>

              {/* Rizz Level */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                  🔥 Rizz Level
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[
                    { value: "subtle", label: "Subtle", desc: "Low-key" },
                    { value: "medium", label: "Medium", desc: "Balanced" },
                    { value: "maximum", label: "Maximum", desc: "Full charm" }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setLevel(option.value)}
                      style={{
                        padding: "12px 8px",
                        borderRadius: "8px",
                        border: level === option.value ? "2px solid #E11D48" : "1px solid #E5E7EB",
                        backgroundColor: level === option.value ? "#FFE4E6" : "white",
                        cursor: "pointer",
                        flex: 1,
                        textAlign: "center"
                      }}
                    >
                      <div style={{ fontWeight: level === option.value ? "600" : "400", color: level === option.value ? "#BE123C" : "#374151", fontSize: "0.9rem" }}>
                        {option.label}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "2px" }}>
                        {option.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                  📝 Their Interest (Optional)
                </label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {["music", "travel", "coffee", "fitness", "food", "art", "reading", "gaming"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTopic(topic === t ? "" : t)}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "6px",
                        border: topic === t ? "2px solid #E11D48" : "1px solid #E5E7EB",
                        backgroundColor: topic === t ? "#FFE4E6" : "white",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        fontWeight: topic === t ? "600" : "400",
                        color: topic === t ? "#BE123C" : "#4B5563",
                        textTransform: "capitalize"
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Include Emoji */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={includeEmoji}
                    onChange={(e) => setIncludeEmoji(e.target.checked)}
                    style={{ width: "18px", height: "18px", accentColor: "#E11D48" }}
                  />
                  <span style={{ fontSize: "0.9rem", color: "#374151", fontWeight: "600" }}>Include Emojis 😏</span>
                </label>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateRizz}
                style={{
                  width: "100%",
                  padding: "16px",
                  backgroundColor: "#E11D48",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                💘 Generate Rizz
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="calc-results" style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #FECDD3",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#BE123C", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                ✨ Your Rizz Lines
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              {generatedLines.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#6B7280" }}>
                  <p style={{ fontSize: "3rem", margin: "0 0 12px 0" }}>💘</p>
                  <p style={{ margin: 0 }}>Choose your settings and click Generate</p>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem" }}>You&apos;ll get 3 unique rizz lines to try</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {generatedLines.map((line, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "16px",
                        backgroundColor: "#FFF1F2",
                        borderRadius: "12px",
                        border: "1px solid #FECDD3"
                      }}
                    >
                      <p style={{ margin: "0 0 12px 0", color: "#111827", fontSize: "1rem", lineHeight: "1.6" }}>
                        &ldquo;{line}&rdquo;
                      </p>
                      <button
                        onClick={() => copyToClipboard(line, index)}
                        style={{
                          padding: "8px 16px",
                          backgroundColor: copiedIndex === index ? "#10B981" : "#E11D48",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "0.85rem",
                          fontWeight: "500",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}
                      >
                        {copiedIndex === index ? "✓ Copied!" : "📋 Copy"}
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={generateRizz}
                    style={{
                      padding: "12px",
                      backgroundColor: "transparent",
                      color: "#E11D48",
                      border: "2px dashed #FECDD3",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                      cursor: "pointer",
                      marginTop: "8px"
                    }}
                  >
                    🔄 Generate More
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
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #FECDD3", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
                💘 What is Rizz?
              </h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  <strong>Rizz</strong> is Gen-Z slang for charisma – specifically the ability to charm or attract 
                  someone you&apos;re interested in. If someone has rizz, they&apos;re smooth, confident, and good at flirting. 
                  The term became popular in 2022-2023 through internet culture and streaming.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Types of Rizz</h3>
                <div style={{
                  backgroundColor: "#FFF1F2",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #FECDD3"
                }}>
                  <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "2.2" }}>
                    <li><strong>Verbal Rizz:</strong> Smooth talking, clever lines, witty responses</li>
                    <li><strong>Unspoken Rizz:</strong> Attracting someone through looks, body language, or presence alone</li>
                    <li><strong>W Rizz:</strong> Successful rizz that actually works</li>
                    <li><strong>L Rizz:</strong> Failed attempts that backfire or are cringe</li>
                  </ul>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Tips for Using Rizz Lines</h3>
                <div style={{ display: "grid", gap: "12px", margin: "16px 0" }}>
                  <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
                    <strong>✅ Do:</strong> Be confident, make eye contact, smile, be genuine, read the room
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
                    <strong>❌ Don&apos;t:</strong> Be pushy, ignore rejection, use offensive lines, try too hard
                  </div>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>When to Use Each Style</h3>
                <p>
                  <strong>Smooth:</strong> Best for making a genuine first impression.<br/>
                  <strong>Funny:</strong> Great for breaking the ice and relieving tension.<br/>
                  <strong>Cheesy:</strong> Works when you&apos;re being ironically corny on purpose.<br/>
                  <strong>Bold:</strong> Use when you&apos;re feeling confident and direct.<br/>
                  <strong>Sweet:</strong> Perfect for showing genuine interest and care.<br/>
                  <strong>Witty:</strong> Best for someone who appreciates clever banter.<br/>
                  <strong>Poetic:</strong> Great for romantics who appreciate beautiful words.<br/>
                  <strong>Confident:</strong> Use when you want to project self-assurance.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Stats */}
            <div style={{ backgroundColor: "#FFF1F2", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FECDD3" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#BE123C", marginBottom: "16px" }}>📊 Generator Stats</h3>
              <div style={{ fontSize: "0.9rem", color: "#E11D48", lineHeight: "2" }}>
                <p style={{ margin: 0 }}>• 8 unique rizz styles</p>
                <p style={{ margin: 0 }}>• 4 different situations</p>
                <p style={{ margin: 0 }}>• 3 intensity levels</p>
                <p style={{ margin: 0 }}>• 1000+ unique lines</p>
                <p style={{ margin: 0 }}>• 100% free to use</p>
              </div>
            </div>

            {/* Rizz Level Guide */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "16px" }}>🔥 Rizz Level Guide</h3>
              <div style={{ fontSize: "0.85rem", color: "#B45309", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}><strong>Subtle:</strong> Friendly, non-threatening, good for testing the waters</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>Medium:</strong> Clearly flirty but not over the top, balanced charm</p>
                <p style={{ margin: 0 }}><strong>Maximum:</strong> Bold and direct, full confidence mode</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/rizz-generator" currentCategory="Social" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #FECDD3", padding: "32px", marginBottom: "24px" }}>
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
        <div style={{ padding: "16px", backgroundColor: "#FFF1F2", borderRadius: "8px", border: "1px solid #FECDD3" }}>
          <p style={{ fontSize: "0.75rem", color: "#BE123C", textAlign: "center", margin: 0 }}>
            💡 <strong>Remember:</strong> The best rizz is authentic. Use these lines as inspiration, but always be 
            respectful and genuine. If someone isn&apos;t interested, respect their boundaries. Confidence is attractive, 
            but kindness is essential.
          </p>
        </div>
      </div>
    </div>
  );
}