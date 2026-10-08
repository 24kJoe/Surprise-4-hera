"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Lock, BookOpen, Clock, ArrowLeft, Calendar, X, Sparkles } from "lucide-react";

interface DailyReason {
  id: string;
  dayNumber: number;
  unlockDate: string; // Format: "YYYY-MM-DDThh:mm:ss"
  content: string;
}

// All 365 reasons strictly written out starting from October 15, 2026.
const dailyReasons: DailyReason[] = [
  { id: "1", dayNumber: 1, unlockDate: "2026-10-15T00:00:00", content: "انا حقيقي يعني مش عارف اقول انا بحبك قد ايه عشان حقيقي الكلام مش كفايه الي بعمله مش كفايه عشان بالنسبالي انتي تستاهلي كل حاجه حلوه تتعملك انتي هتفضلي احلي حاجه فحياتي" },
  { id: "2", dayNumber: 2, unlockDate: "2026-10-16T00:00:00", content: "انتي حلوه و علطول حلوه و مش عايزك تفكري ابدا ان انتي ف يوم شكلك مش حلو عشان انتي في عيني احلي بنت في الدنيا" },
  { id: "3", dayNumber: 3, unlockDate: "2026-10-17T00:00:00", content: "متعرفيش بحب مناخيرك الصغيره دي قد ايه او ودانك الحلوه و عنيكي الي مفيش احلي منهم " },
  { id: "4", dayNumber: 4, unlockDate: "2026-10-18T00:00:00", content: "بحب انك فارق معاكي فعلا مع انك مش بتقولي مبتعبريش بالكلام بس انا بالنسبالي انت اكتر من كفايه " },
  { id: "5", dayNumber: 5, unlockDate: "2026-10-19T00:00:00", content: "انتي طيبه و كيوت و حقيقي مشوفتش اطيب و اجمل منك" },
  { id: "6", dayNumber: 6, unlockDate: "2026-10-20T00:00:00", content: "لو قعدت اكتب من هنا للسنه الجايه عمري ما هعرف اوصلك انا بحبك قد ايه " },
  { id: "7", dayNumber: 7, unlockDate: "2026-10-21T00:00:00", content: "انا عارف انك علطول بتقولي اما تكوني عايزه تجيبي لبس  بتقعدي تقولي كل الناس بتلبس ده ومش عارف ايه بس يعني حتي لو انتي متعرفيش انك علطول احلي منهم و ان انتي الي بتحلي الحاجه" },
  { id: "8", dayNumber: 8, unlockDate: "2026-10-22T00:00:00", content: "بحبك لدرجه ان انا ممكن اكتبلك زي ما بكتبلك دلوقتي علطول و عمري ما هفوت يوم غير اما اقولك" },
  { id: "9", dayNumber: 9, unlockDate: "2026-10-23T00:00:00", content: "انتي مش حد عادي حتي لو انتي بالنسبه لحد ممكن تبقي عاديه بس انا بشوفك كأنك احلي واحده في الدنيا " },
  { id: "10", dayNumber: 10, unlockDate: "2026-10-24T00:00:00", content: "عايزك علطول عارفه و متأكده ان انا علطول معاكي " },
  { id: "11", dayNumber: 11, unlockDate: "2026-10-25T00:00:00", content: "I admire how strong you are when things get tough, and how gracefully you handle challenges." },
  { id: "12", dayNumber: 12, unlockDate: "2026-10-26T00:00:00", content: "I love you because when I am with you, I feel completely safe to be my truest self." },
  { id: "13", dayNumber: 13, unlockDate: "2026-10-27T00:00:00", content: "Your hugs have this magical power to melt away all my stress and make everything okay." },
  { id: "14", dayNumber: 14, unlockDate: "2026-10-28T00:00:00", content: "I love your sense of humor and how effortlessly you make me laugh until my cheeks hurt." },
  { id: "15", dayNumber: 15, unlockDate: "2026-10-29T00:00:00", content: "I love seeing you right when you wake up, sleepy-eyed and so naturally gorgeous." },
  { id: "16", dayNumber: 16, unlockDate: "2026-10-30T00:00:00", content: "I love your drive and how hard you work for your dreams. You are going to achieve amazing things." },
  { id: "17", dayNumber: 17, unlockDate: "2026-10-31T00:00:00", content: "I love that we don't always need to speak; even comfortable silence with you is pure peace." },
  { id: "18", dayNumber: 18, unlockDate: "2026-11-01T00:00:00", content: "I love listening to your thoughts and how your brilliant mind works." },
  { id: "19", dayNumber: 19, unlockDate: "2026-11-02T00:00:00", content: "I love how much thought and care you put into the little details of everyday life." },
  { id: "20", dayNumber: 20, unlockDate: "2026-11-03T00:00:00", content: "Seeing a message pop up from you instantly lights up my day, no matter what I'm doing." },
  { id: "21", dayNumber: 21, unlockDate: "2026-11-04T00:00:00", content: "Holding your hand feels completely right, like it was always meant to be there." },
  { id: "22", dayNumber: 22, unlockDate: "2026-11-05T00:00:00", content: "I love how patient and understanding you are with me when I'm stressed or figuring things out." },
  { id: "23", dayNumber: 23, unlockDate: "2026-11-06T00:00:00", content: "Thank you for always believing in me, even when I doubt myself." },
  { id: "24", dayNumber: 24, unlockDate: "2026-11-07T00:00:00", content: "I love when your playful, goofy side comes out and we act like absolute kids together." },
  { id: "25", dayNumber: 25, unlockDate: "2026-11-08T00:00:00", content: "I love the deep empathy you show toward others. You feel emotions so purely." },
  { id: "26", dayNumber: 26, unlockDate: "2026-11-09T00:00:00", content: "I love how you view the world with such imagination and creativity." },
  { id: "27", dayNumber: 27, unlockDate: "2026-11-10T00:00:00", content: "You actually listen when I talk, making me feel heard and valued every single time." },
  { id: "28", dayNumber: 28, unlockDate: "2026-11-11T00:00:00", content: "Even a light brush against your arm sends sparks through me." },
  { id: "29", dayNumber: 29, unlockDate: "2026-11-12T00:00:00", content: "The way you look at me makes me feel like I'm the only person in a crowded room." },
  { id: "30", dayNumber: 30, unlockDate: "2026-11-13T00:00:00", content: "I love all our random inside jokes and memories that only we share." },
  { id: "31", dayNumber: 31, unlockDate: "2026-11-14T00:00:00", content: "You do the sweetest, most thoughtful things out of nowhere." },
  { id: "32", dayNumber: 32, unlockDate: "2026-11-15T00:00:00", content: "I love how brave you are when facing life's uncertainties." },
  { id: "33", dayNumber: 33, unlockDate: "2026-11-16T00:00:00", content: "Every outing, errand, or trip is an adventure just because I'm with you." },
  { id: "34", dayNumber: 34, unlockDate: "2026-11-17T00:00:00", content: "You radiate so much warmth and positivity wherever you go." },
  { id: "35", dayNumber: 35, unlockDate: "2026-11-18T00:00:00", content: "I deeply value your honesty and how open we can be with one another." },
  { id: "36", dayNumber: 36, unlockDate: "2026-11-19T00:00:00", content: "Thank you for trusting me with your deepest thoughts and feelings." },
  { id: "37", dayNumber: 37, unlockDate: "2026-11-20T00:00:00", content: "There is nobody else in this entire world anything like you." },
  { id: "38", dayNumber: 38, unlockDate: "2026-11-21T00:00:00", content: "I am constantly in awe of who you are and everything you accomplish." },
  { id: "39", dayNumber: 39, unlockDate: "2026-11-22T00:00:00", content: "Even when you're slightly grumpy or pouty, you are still impossibly cute." },
  { id: "40", dayNumber: 40, unlockDate: "2026-11-23T00:00:00", content: "I love hearing about all the big dreams you want to chase in life." },
  { id: "41", dayNumber: 41, unlockDate: "2026-11-24T00:00:00", content: "Your voice is one of my favorite sounds in the world; it brings me instant peace." },
  { id: "42", dayNumber: 42, unlockDate: "2026-11-25T00:00:00", content: "We just click so effortlessly, like puzzle pieces that finally found their match." },
  { id: "43", dayNumber: 43, unlockDate: "2026-11-26T00:00:00", content: "You give so much of your heart to the people you love without ever asking for anything back." },
  { id: "44", dayNumber: 44, unlockDate: "2026-11-27T00:00:00", content: "Eating together and sharing food with you is one of my absolute favorite things." },
  { id: "45", dayNumber: 45, unlockDate: "2026-11-28T00:00:00", content: "You always offer such great perspective and advice when I need it most." },
  { id: "46", dayNumber: 46, unlockDate: "2026-11-29T00:00:00", content: "I love your sense of style and how effortlessly cool you always look." },
  { id: "47", dayNumber: 47, unlockDate: "2026-11-30T00:00:00", content: "I love the way your face lights up when you talk about something you're excited about." },
  { id: "48", dayNumber: 48, unlockDate: "2026-12-01T00:00:00", content: "Your ability to find the silver lining in tough situations always amazes me." },
  { id: "49", dayNumber: 49, unlockDate: "2026-12-02T00:00:00", content: "I love exchanging songs with you and finding pieces of you in every melody." },
  { id: "50", dayNumber: 50, unlockDate: "2026-12-03T00:00:00", content: "We are fifty days into our countdown, and my love for you has only grown stronger with every single day." },
  { id: "51", dayNumber: 51, unlockDate: "2026-12-04T00:00:00", content: "No matter what life throws at you, you bounce back with such grace and courage." },
  { id: "52", dayNumber: 52, unlockDate: "2026-12-05T00:00:00", content: "You push me to think deeper, grow faster, and be the best version of myself." },
  { id: "53", dayNumber: 53, unlockDate: "2026-12-06T00:00:00", content: "Getting unexpected sweet texts from you brightens up my entire day." },
  { id: "54", dayNumber: 54, unlockDate: "2026-12-07T00:00:00", content: "I love when we start laughing so hard we can't even breathe or talk." },
  { id: "55", dayNumber: 55, unlockDate: "2026-12-08T00:00:00", content: "The world can be harsh, but you remain so soft, pure, and caring." },
  { id: "56", dayNumber: 56, unlockDate: "2026-12-09T00:00:00", content: "You always know exactly what to say to make me feel better when I'm down." },
  { id: "57", dayNumber: 57, unlockDate: "2026-12-10T00:00:00", content: "You always act from a place of genuine love and goodness." },
  { id: "58", dayNumber: 58, unlockDate: "2026-12-11T00:00:00", content: "Walking side by side with you anywhere in the world is my favorite place to be." },
  { id: "59", dayNumber: 59, unlockDate: "2026-12-12T00:00:00", content: "I love how curious you are and how eager you are to discover new things." },
  { id: "60", dayNumber: 60, unlockDate: "2026-12-13T00:00:00", content: "Thank you for loving all my flaws and being patient with me as I grow." },
  { id: "61", dayNumber: 61, unlockDate: "2026-12-14T00:00:00", content: "You make the funniest, most adorable facial expressions when you're concentrating." },
  { id: "62", dayNumber: 62, unlockDate: "2026-12-15T00:00:00", content: "Sometimes I just pause and smile simply because you exist in my life." },
  { id: "63", dayNumber: 63, unlockDate: "2026-12-16T00:00:00", content: "I love how fiercely loyal and protective you are of the people you love." },
  { id: "64", dayNumber: 64, unlockDate: "2026-12-17T00:00:00", content: "Your vibrant energy can completely transform the mood of any room." },
  { id: "65", dayNumber: 65, unlockDate: "2026-12-18T00:00:00", content: "Your unwavering faith in our relationship gives me so much confidence for our future." },
  { id: "66", dayNumber: 66, unlockDate: "2026-12-19T00:00:00", content: "I admire your independence, your drive, and how capable you are." },
  { id: "67", dayNumber: 67, unlockDate: "2026-12-20T00:00:00", content: "Planning our future together is something I look forward to every single day." },
  { id: "68", dayNumber: 68, unlockDate: "2026-12-21T00:00:00", content: "Watching you sleep peacefully is one of the most comforting, heartwarming sights." },
  { id: "69", dayNumber: 69, unlockDate: "2026-12-22T00:00:00", content: "The compliments you give me always feel so sincere and from the heart." },
  { id: "70", dayNumber: 70, unlockDate: "2026-12-23T00:00:00", content: "You notice and appreciate the tiny little details that others usually overlook." },
  { id: "71", dayNumber: 71, unlockDate: "2026-12-24T00:00:00", content: "The holidays are so much brighter, warmer, and more meaningful with you in them." },
  { id: "72", dayNumber: 72, unlockDate: "2026-12-25T00:00:00", content: "You are truly the greatest gift I could ever ask for, today and every day." },
  { id: "73", dayNumber: 73, unlockDate: "2026-12-26T00:00:00", content: "Loving you has never felt like work; it is the easiest and most natural thing in the world." },
  { id: "74", dayNumber: 74, unlockDate: "2026-12-27T00:00:00", content: "Being wrapped in your arms is my favorite safe haven from the world." },
  { id: "75", dayNumber: 75, unlockDate: "2026-12-28T00:00:00", content: "Hearing your voice when I replay your audio messages melts my heart every time." },
  { id: "76", dayNumber: 76, unlockDate: "2026-12-29T00:00:00", content: "I love when you step into your power and own how amazing you truly are." },
  { id: "77", dayNumber: 77, unlockDate: "2026-12-30T00:00:00", content: "Looking back at everything we've shared makes me so excited for all our tomorrows." },
  { id: "78", dayNumber: 78, unlockDate: "2026-12-31T00:00:00", content: "There is nobody else I'd rather close out this year and welcome the new year with." },
  { id: "79", dayNumber: 79, unlockDate: "2027-01-01T00:00:00", content: "A new year means more days of loving you, and I can't wait for every single one." },
  { id: "80", dayNumber: 80, unlockDate: "2027-01-02T00:00:00", content: "You keep my heart warm even on the coldest winter days." },
  { id: "81", dayNumber: 81, unlockDate: "2027-01-03T00:00:00", content: "Everything you do inspires me to work harder and dream bigger." },
  { id: "82", dayNumber: 82, unlockDate: "2027-01-04T00:00:00", content: "Starting my day knowing you're thinking of me makes all the difference." },
  { id: "83", dayNumber: 83, unlockDate: "2027-01-05T00:00:00", content: "I love your taste in food, music, and—most importantly—your choice in partners!" },
  { id: "84", dayNumber: 84, unlockDate: "2027-01-06T00:00:00", content: "With you, I never have to pretend. I can be completely goofy and free." },
  { id: "85", dayNumber: 85, unlockDate: "2027-01-07T00:00:00", content: "Your heart is genuinely one of the purest and most beautiful things I've ever known." },
  { id: "86", dayNumber: 86, unlockDate: "2027-01-08T00:00:00", content: "Even when things get overwhelming, you keep your grace and composure." },
  { id: "87", dayNumber: 87, unlockDate: "2027-01-09T00:00:00", content: "Your words of encouragement always arrive right when I need them most." },
  { id: "88", dayNumber: 88, unlockDate: "2027-01-10T00:00:00", content: "I love diving into deep, meaningful talks about life, dreams, and everything in between." },
  { id: "89", dayNumber: 89, unlockDate: "2027-01-11T00:00:00", content: "You literally glow from the inside out when you're happy." },
  { id: "90", dayNumber: 90, unlockDate: "2027-01-12T00:00:00", content: "We are almost at the end of our reasons, but my love for you is only just beginning." },
  { id: "91", dayNumber: 91, unlockDate: "2027-01-13T00:00:00", content: "Falling asleep knowing you love me is the best peace of mind." },
  { id: "92", dayNumber: 92, unlockDate: "2027-01-14T00:00:00", content: "The effort you put into showing you care never goes unnoticed by me." },
  { id: "93", dayNumber: 93, unlockDate: "2027-01-15T00:00:00", content: "I love watching how your brilliant and creative thoughts turn into reality." },
  { id: "94", dayNumber: 94, unlockDate: "2027-01-16T00:00:00", content: "Even the way you walk across a room captures my attention instantly." },
  { id: "95", dayNumber: 95, unlockDate: "2027-01-17T00:00:00", content: "Thank you for always standing in my corner through thick and thin." },
  { id: "96", dayNumber: 96, unlockDate: "2027-01-18T00:00:00", content: "Every single memory we've built together is a treasure I hold close to my heart." },
  { id: "97", dayNumber: 97, unlockDate: "2027-01-19T00:00:00", content: "Your happiness is contagious; when you're happy, I can't help but beam too." },
  { id: "98", dayNumber: 98, unlockDate: "2027-01-20T00:00:00", content: "Out of everyone in this world, you are my absolute favorite person." },
  { id: "99", dayNumber: 99, unlockDate: "2027-01-21T00:00:00", content: "Ninety-nine reasons down, and yet words still feel too short to express how much I love you." },
  { id: "100", dayNumber: 100, unlockDate: "2027-01-22T00:00:00", content: "Reason number 100: I love you simply because you are you. Perfectly, wonderfully, entirely you, today and forever." },
  { id: "101", dayNumber: 101, unlockDate: "2027-01-23T00:00:00", content: "Type your reason here..." },
  { id: "102", dayNumber: 102, unlockDate: "2027-01-24T00:00:00", content: "Type your reason here..." },
  { id: "103", dayNumber: 103, unlockDate: "2027-01-25T00:00:00", content: "Type your reason here..." },
  { id: "104", dayNumber: 104, unlockDate: "2027-01-26T00:00:00", content: "Type your reason here..." },
  { id: "105", dayNumber: 105, unlockDate: "2027-01-27T00:00:00", content: "Type your reason here..." },
  { id: "106", dayNumber: 106, unlockDate: "2027-01-28T00:00:00", content: "Type your reason here..." },
  { id: "107", dayNumber: 107, unlockDate: "2027-01-29T00:00:00", content: "Type your reason here..." },
  { id: "108", dayNumber: 108, unlockDate: "2027-01-30T00:00:00", content: "Type your reason here..." },
  { id: "109", dayNumber: 109, unlockDate: "2027-01-31T00:00:00", content: "Type your reason here..." },
  { id: "110", dayNumber: 110, unlockDate: "2027-02-01T00:00:00", content: "Type your reason here..." },
  { id: "111", dayNumber: 111, unlockDate: "2027-02-02T00:00:00", content: "Type your reason here..." },
  { id: "112", dayNumber: 112, unlockDate: "2027-02-03T00:00:00", content: "Type your reason here..." },
  { id: "113", dayNumber: 113, unlockDate: "2027-02-04T00:00:00", content: "Type your reason here..." },
  { id: "114", dayNumber: 114, unlockDate: "2027-02-05T00:00:00", content: "Type your reason here..." },
  { id: "115", dayNumber: 115, unlockDate: "2027-02-06T00:00:00", content: "Type your reason here..." },
  { id: "116", dayNumber: 116, unlockDate: "2027-02-07T00:00:00", content: "Type your reason here..." },
  { id: "117", dayNumber: 117, unlockDate: "2027-02-08T00:00:00", content: "Type your reason here..." },
  { id: "118", dayNumber: 118, unlockDate: "2027-02-09T00:00:00", content: "Type your reason here..." },
  { id: "119", dayNumber: 119, unlockDate: "2027-02-10T00:00:00", content: "Type your reason here..." },
  { id: "120", dayNumber: 120, unlockDate: "2027-02-11T00:00:00", content: "Type your reason here..." },
  { id: "121", dayNumber: 121, unlockDate: "2027-02-12T00:00:00", content: "Type your reason here..." },
  { id: "122", dayNumber: 122, unlockDate: "2027-02-13T00:00:00", content: "Type your reason here..." },
  { id: "123", dayNumber: 123, unlockDate: "2027-02-14T00:00:00", content: "Type your reason here..." },
  { id: "124", dayNumber: 124, unlockDate: "2027-02-15T00:00:00", content: "Type your reason here..." },
  { id: "125", dayNumber: 125, unlockDate: "2027-02-16T00:00:00", content: "Type your reason here..." },
  { id: "126", dayNumber: 126, unlockDate: "2027-02-17T00:00:00", content: "Type your reason here..." },
  { id: "127", dayNumber: 127, unlockDate: "2027-02-18T00:00:00", content: "Type your reason here..." },
  { id: "128", dayNumber: 128, unlockDate: "2027-02-19T00:00:00", content: "Type your reason here..." },
  { id: "129", dayNumber: 129, unlockDate: "2027-02-20T00:00:00", content: "Type your reason here..." },
  { id: "130", dayNumber: 130, unlockDate: "2027-02-21T00:00:00", content: "Type your reason here..." },
  { id: "131", dayNumber: 131, unlockDate: "2027-02-22T00:00:00", content: "Type your reason here..." },
  { id: "132", dayNumber: 132, unlockDate: "2027-02-23T00:00:00", content: "Type your reason here..." },
  { id: "133", dayNumber: 133, unlockDate: "2027-02-24T00:00:00", content: "Type your reason here..." },
  { id: "134", dayNumber: 134, unlockDate: "2027-02-25T00:00:00", content: "Type your reason here..." },
  { id: "135", dayNumber: 135, unlockDate: "2027-02-26T00:00:00", content: "Type your reason here..." },
  { id: "136", dayNumber: 136, unlockDate: "2027-02-27T00:00:00", content: "Type your reason here..." },
  { id: "137", dayNumber: 137, unlockDate: "2027-02-28T00:00:00", content: "Type your reason here..." },
  { id: "138", dayNumber: 138, unlockDate: "2027-03-01T00:00:00", content: "Type your reason here..." },
  { id: "139", dayNumber: 139, unlockDate: "2027-03-02T00:00:00", content: "Type your reason here..." },
  { id: "140", dayNumber: 140, unlockDate: "2027-03-03T00:00:00", content: "Type your reason here..." },
  { id: "141", dayNumber: 141, unlockDate: "2027-03-04T00:00:00", content: "Type your reason here..." },
  { id: "142", dayNumber: 142, unlockDate: "2027-03-05T00:00:00", content: "Type your reason here..." },
  { id: "143", dayNumber: 143, unlockDate: "2027-03-06T00:00:00", content: "Type your reason here..." },
  { id: "144", dayNumber: 144, unlockDate: "2027-03-07T00:00:00", content: "Type your reason here..." },
  { id: "145", dayNumber: 145, unlockDate: "2027-03-08T00:00:00", content: "Type your reason here..." },
  { id: "146", dayNumber: 146, unlockDate: "2027-03-09T00:00:00", content: "Type your reason here..." },
  { id: "147", dayNumber: 147, unlockDate: "2027-03-10T00:00:00", content: "Type your reason here..." },
  { id: "148", dayNumber: 148, unlockDate: "2027-03-11T00:00:00", content: "Type your reason here..." },
  { id: "149", dayNumber: 149, unlockDate: "2027-03-12T00:00:00", content: "Type your reason here..." },
  { id: "150", dayNumber: 150, unlockDate: "2027-03-13T00:00:00", content: "Type your reason here..." },
  { id: "151", dayNumber: 151, unlockDate: "2027-03-14T00:00:00", content: "Type your reason here..." },
  { id: "152", dayNumber: 152, unlockDate: "2027-03-15T00:00:00", content: "Type your reason here..." },
  { id: "153", dayNumber: 153, unlockDate: "2027-03-16T00:00:00", content: "Type your reason here..." },
  { id: "154", dayNumber: 154, unlockDate: "2027-03-17T00:00:00", content: "Type your reason here..." },
  { id: "155", dayNumber: 155, unlockDate: "2027-03-18T00:00:00", content: "Type your reason here..." },
  { id: "156", dayNumber: 156, unlockDate: "2027-03-19T00:00:00", content: "Type your reason here..." },
  { id: "157", dayNumber: 157, unlockDate: "2027-03-20T00:00:00", content: "Type your reason here..." },
  { id: "158", dayNumber: 158, unlockDate: "2027-03-21T00:00:00", content: "Type your reason here..." },
  { id: "159", dayNumber: 159, unlockDate: "2027-03-22T00:00:00", content: "Type your reason here..." },
  { id: "160", dayNumber: 160, unlockDate: "2027-03-23T00:00:00", content: "Type your reason here..." },
  { id: "161", dayNumber: 161, unlockDate: "2027-03-24T00:00:00", content: "Type your reason here..." },
  { id: "162", dayNumber: 162, unlockDate: "2027-03-25T00:00:00", content: "Type your reason here..." },
  { id: "163", dayNumber: 163, unlockDate: "2027-03-26T00:00:00", content: "Type your reason here..." },
  { id: "164", dayNumber: 164, unlockDate: "2027-03-27T00:00:00", content: "Type your reason here..." },
  { id: "165", dayNumber: 165, unlockDate: "2027-03-28T00:00:00", content: "Type your reason here..." },
  { id: "166", dayNumber: 166, unlockDate: "2027-03-29T00:00:00", content: "Type your reason here..." },
  { id: "167", dayNumber: 167, unlockDate: "2027-03-30T00:00:00", content: "Type your reason here..." },
  { id: "168", dayNumber: 168, unlockDate: "2027-03-31T00:00:00", content: "Type your reason here..." },
  { id: "169", dayNumber: 169, unlockDate: "2027-04-01T00:00:00", content: "Type your reason here..." },
  { id: "170", dayNumber: 170, unlockDate: "2027-04-02T00:00:00", content: "Type your reason here..." },
  { id: "171", dayNumber: 171, unlockDate: "2027-04-03T00:00:00", content: "Type your reason here..." },
  { id: "172", dayNumber: 172, unlockDate: "2027-04-04T00:00:00", content: "Type your reason here..." },
  { id: "173", dayNumber: 173, unlockDate: "2027-04-05T00:00:00", content: "Type your reason here..." },
  { id: "174", dayNumber: 174, unlockDate: "2027-04-06T00:00:00", content: "Type your reason here..." },
  { id: "175", dayNumber: 175, unlockDate: "2027-04-07T00:00:00", content: "Type your reason here..." },
  { id: "176", dayNumber: 176, unlockDate: "2027-04-08T00:00:00", content: "Type your reason here..." },
  { id: "177", dayNumber: 177, unlockDate: "2027-04-09T00:00:00", content: "Type your reason here..." },
  { id: "178", dayNumber: 178, unlockDate: "2027-04-10T00:00:00", content: "Type your reason here..." },
  { id: "179", dayNumber: 179, unlockDate: "2027-04-11T00:00:00", content: "Type your reason here..." },
  { id: "180", dayNumber: 180, unlockDate: "2027-04-12T00:00:00", content: "Type your reason here..." },
  { id: "181", dayNumber: 181, unlockDate: "2027-04-13T00:00:00", content: "Type your reason here..." },
  { id: "182", dayNumber: 182, unlockDate: "2027-04-14T00:00:00", content: "Type your reason here..." },
  { id: "183", dayNumber: 183, unlockDate: "2027-04-15T00:00:00", content: "Type your reason here..." },
  { id: "184", dayNumber: 184, unlockDate: "2027-04-16T00:00:00", content: "Type your reason here..." },
  { id: "185", dayNumber: 185, unlockDate: "2027-04-17T00:00:00", content: "Type your reason here..." },
  { id: "186", dayNumber: 186, unlockDate: "2027-04-18T00:00:00", content: "Type your reason here..." },
  { id: "187", dayNumber: 187, unlockDate: "2027-04-19T00:00:00", content: "Type your reason here..." },
  { id: "188", dayNumber: 188, unlockDate: "2027-04-20T00:00:00", content: "Type your reason here..." },
  { id: "189", dayNumber: 189, unlockDate: "2027-04-21T00:00:00", content: "Type your reason here..." },
  { id: "190", dayNumber: 190, unlockDate: "2027-04-22T00:00:00", content: "Type your reason here..." },
  { id: "191", dayNumber: 191, unlockDate: "2027-04-23T00:00:00", content: "Type your reason here..." },
  { id: "192", dayNumber: 192, unlockDate: "2027-04-24T00:00:00", content: "Type your reason here..." },
  { id: "193", dayNumber: 193, unlockDate: "2027-04-25T00:00:00", content: "Type your reason here..." },
  { id: "194", dayNumber: 194, unlockDate: "2027-04-26T00:00:00", content: "Type your reason here..." },
  { id: "195", dayNumber: 195, unlockDate: "2027-04-27T00:00:00", content: "Type your reason here..." },
  { id: "196", dayNumber: 196, unlockDate: "2027-04-28T00:00:00", content: "Type your reason here..." },
  { id: "197", dayNumber: 197, unlockDate: "2027-04-29T00:00:00", content: "Type your reason here..." },
  { id: "198", dayNumber: 198, unlockDate: "2027-04-30T00:00:00", content: "Type your reason here..." },
  { id: "199", dayNumber: 199, unlockDate: "2027-05-01T00:00:00", content: "Type your reason here..." },
  { id: "200", dayNumber: 200, unlockDate: "2027-05-02T00:00:00", content: "Type your reason here..." },
  { id: "201", dayNumber: 201, unlockDate: "2027-05-03T00:00:00", content: "Type your reason here..." },
  { id: "202", dayNumber: 202, unlockDate: "2027-05-04T00:00:00", content: "Type your reason here..." },
  { id: "203", dayNumber: 203, unlockDate: "2027-05-05T00:00:00", content: "Type your reason here..." },
  { id: "204", dayNumber: 204, unlockDate: "2027-05-06T00:00:00", content: "Type your reason here..." },
  { id: "205", dayNumber: 205, unlockDate: "2027-05-07T00:00:00", content: "Type your reason here..." },
  { id: "206", dayNumber: 206, unlockDate: "2027-05-08T00:00:00", content: "Type your reason here..." },
  { id: "207", dayNumber: 207, unlockDate: "2027-05-09T00:00:00", content: "Type your reason here..." },
  { id: "208", dayNumber: 208, unlockDate: "2027-05-10T00:00:00", content: "Type your reason here..." },
  { id: "209", dayNumber: 209, unlockDate: "2027-05-11T00:00:00", content: "Type your reason here..." },
  { id: "210", dayNumber: 210, unlockDate: "2027-05-12T00:00:00", content: "Type your reason here..." },
  { id: "211", dayNumber: 211, unlockDate: "2027-05-13T00:00:00", content: "Type your reason here..." },
  { id: "212", dayNumber: 212, unlockDate: "2027-05-14T00:00:00", content: "Type your reason here..." },
  { id: "213", dayNumber: 213, unlockDate: "2027-05-15T00:00:00", content: "Type your reason here..." },
  { id: "214", dayNumber: 214, unlockDate: "2027-05-16T00:00:00", content: "Type your reason here..." },
  { id: "215", dayNumber: 215, unlockDate: "2027-05-17T00:00:00", content: "Type your reason here..." },
  { id: "216", dayNumber: 216, unlockDate: "2027-05-18T00:00:00", content: "Type your reason here..." },
  { id: "217", dayNumber: 217, unlockDate: "2027-05-19T00:00:00", content: "Type your reason here..." },
  { id: "218", dayNumber: 218, unlockDate: "2027-05-20T00:00:00", content: "Type your reason here..." },
  { id: "219", dayNumber: 219, unlockDate: "2027-05-21T00:00:00", content: "Type your reason here..." },
  { id: "220", dayNumber: 220, unlockDate: "2027-05-22T00:00:00", content: "Type your reason here..." },
  { id: "221", dayNumber: 221, unlockDate: "2027-05-23T00:00:00", content: "Type your reason here..." },
  { id: "222", dayNumber: 222, unlockDate: "2027-05-24T00:00:00", content: "Type your reason here..." },
  { id: "223", dayNumber: 223, unlockDate: "2027-05-25T00:00:00", content: "Type your reason here..." },
  { id: "224", dayNumber: 224, unlockDate: "2027-05-26T00:00:00", content: "Type your reason here..." },
  { id: "225", dayNumber: 225, unlockDate: "2027-05-27T00:00:00", content: "Type your reason here..." },
  { id: "226", dayNumber: 226, unlockDate: "2027-05-28T00:00:00", content: "Type your reason here..." },
  { id: "227", dayNumber: 227, unlockDate: "2027-05-29T00:00:00", content: "Type your reason here..." },
  { id: "228", dayNumber: 228, unlockDate: "2027-05-30T00:00:00", content: "Type your reason here..." },
  { id: "229", dayNumber: 229, unlockDate: "2027-05-31T00:00:00", content: "Type your reason here..." },
  { id: "230", dayNumber: 230, unlockDate: "2027-06-01T00:00:00", content: "Type your reason here..." },
  { id: "231", dayNumber: 231, unlockDate: "2027-06-02T00:00:00", content: "Type your reason here..." },
  { id: "232", dayNumber: 232, unlockDate: "2027-06-03T00:00:00", content: "Type your reason here..." },
  { id: "233", dayNumber: 233, unlockDate: "2027-06-04T00:00:00", content: "Type your reason here..." },
  { id: "234", dayNumber: 234, unlockDate: "2027-06-05T00:00:00", content: "Type your reason here..." },
  { id: "235", dayNumber: 235, unlockDate: "2027-06-06T00:00:00", content: "Type your reason here..." },
  { id: "236", dayNumber: 236, unlockDate: "2027-06-07T00:00:00", content: "Type your reason here..." },
  { id: "237", dayNumber: 237, unlockDate: "2027-06-08T00:00:00", content: "Type your reason here..." },
  { id: "238", dayNumber: 238, unlockDate: "2027-06-09T00:00:00", content: "Type your reason here..." },
  { id: "239", dayNumber: 239, unlockDate: "2027-06-10T00:00:00", content: "Type your reason here..." },
  { id: "240", dayNumber: 240, unlockDate: "2027-06-11T00:00:00", content: "Type your reason here..." },
  { id: "241", dayNumber: 241, unlockDate: "2027-06-12T00:00:00", content: "Type your reason here..." },
  { id: "242", dayNumber: 242, unlockDate: "2027-06-13T00:00:00", content: "Type your reason here..." },
  { id: "243", dayNumber: 243, unlockDate: "2027-06-14T00:00:00", content: "Type your reason here..." },
  { id: "244", dayNumber: 244, unlockDate: "2027-06-15T00:00:00", content: "Type your reason here..." },
  { id: "245", dayNumber: 245, unlockDate: "2027-06-16T00:00:00", content: "Type your reason here..." },
  { id: "246", dayNumber: 246, unlockDate: "2027-06-17T00:00:00", content: "Type your reason here..." },
  { id: "247", dayNumber: 247, unlockDate: "2027-06-18T00:00:00", content: "Type your reason here..." },
  { id: "248", dayNumber: 248, unlockDate: "2027-06-19T00:00:00", content: "Type your reason here..." },
  { id: "249", dayNumber: 249, unlockDate: "2027-06-20T00:00:00", content: "Type your reason here..." },
  { id: "250", dayNumber: 250, unlockDate: "2027-06-21T00:00:00", content: "Type your reason here..." },
  { id: "251", dayNumber: 251, unlockDate: "2027-06-22T00:00:00", content: "Type your reason here..." },
  { id: "252", dayNumber: 252, unlockDate: "2027-06-23T00:00:00", content: "Type your reason here..." },
  { id: "253", dayNumber: 253, unlockDate: "2027-06-24T00:00:00", content: "Type your reason here..." },
  { id: "254", dayNumber: 254, unlockDate: "2027-06-25T00:00:00", content: "Type your reason here..." },
  { id: "255", dayNumber: 255, unlockDate: "2027-06-26T00:00:00", content: "Type your reason here..." },
  { id: "256", dayNumber: 256, unlockDate: "2027-06-27T00:00:00", content: "Type your reason here..." },
  { id: "257", dayNumber: 257, unlockDate: "2027-06-28T00:00:00", content: "Type your reason here..." },
  { id: "258", dayNumber: 258, unlockDate: "2027-06-29T00:00:00", content: "Type your reason here..." },
  { id: "259", dayNumber: 259, unlockDate: "2027-06-30T00:00:00", content: "Type your reason here..." },
  { id: "260", dayNumber: 260, unlockDate: "2027-07-01T00:00:00", content: "Type your reason here..." },
  { id: "261", dayNumber: 261, unlockDate: "2027-07-02T00:00:00", content: "Type your reason here..." },
  { id: "262", dayNumber: 262, unlockDate: "2027-07-03T00:00:00", content: "Type your reason here..." },
  { id: "263", dayNumber: 263, unlockDate: "2027-07-04T00:00:00", content: "Type your reason here..." },
  { id: "264", dayNumber: 264, unlockDate: "2027-07-05T00:00:00", content: "Type your reason here..." },
  { id: "265", dayNumber: 265, unlockDate: "2027-07-06T00:00:00", content: "Type your reason here..." },
  { id: "266", dayNumber: 266, unlockDate: "2027-07-07T00:00:00", content: "Type your reason here..." },
  { id: "267", dayNumber: 267, unlockDate: "2027-07-08T00:00:00", content: "Type your reason here..." },
  { id: "268", dayNumber: 268, unlockDate: "2027-07-09T00:00:00", content: "Type your reason here..." },
  { id: "269", dayNumber: 269, unlockDate: "2027-07-10T00:00:00", content: "Type your reason here..." },
  { id: "270", dayNumber: 270, unlockDate: "2027-07-11T00:00:00", content: "Type your reason here..." },
  { id: "271", dayNumber: 271, unlockDate: "2027-07-12T00:00:00", content: "Type your reason here..." },
  { id: "272", dayNumber: 272, unlockDate: "2027-07-13T00:00:00", content: "Type your reason here..." },
  { id: "273", dayNumber: 273, unlockDate: "2027-07-14T00:00:00", content: "Type your reason here..." },
  { id: "274", dayNumber: 274, unlockDate: "2027-07-15T00:00:00", content: "Type your reason here..." },
  { id: "275", dayNumber: 275, unlockDate: "2027-07-16T00:00:00", content: "Type your reason here..." },
  { id: "276", dayNumber: 276, unlockDate: "2027-07-17T00:00:00", content: "Type your reason here..." },
  { id: "277", dayNumber: 277, unlockDate: "2027-07-18T00:00:00", content: "Type your reason here..." },
  { id: "278", dayNumber: 278, unlockDate: "2027-07-19T00:00:00", content: "Type your reason here..." },
  { id: "279", dayNumber: 279, unlockDate: "2027-07-20T00:00:00", content: "Type your reason here..." },
  { id: "280", dayNumber: 280, unlockDate: "2027-07-21T00:00:00", content: "Type your reason here..." },
  { id: "281", dayNumber: 281, unlockDate: "2027-07-22T00:00:00", content: "Type your reason here..." },
  { id: "282", dayNumber: 282, unlockDate: "2027-07-23T00:00:00", content: "Type your reason here..." },
  { id: "283", dayNumber: 283, unlockDate: "2027-07-24T00:00:00", content: "Type your reason here..." },
  { id: "284", dayNumber: 284, unlockDate: "2027-07-25T00:00:00", content: "Type your reason here..." },
  { id: "285", dayNumber: 285, unlockDate: "2027-07-26T00:00:00", content: "Type your reason here..." },
  { id: "286", dayNumber: 286, unlockDate: "2027-07-27T00:00:00", content: "Type your reason here..." },
  { id: "287", dayNumber: 287, unlockDate: "2027-07-28T00:00:00", content: "Type your reason here..." },
  { id: "288", dayNumber: 288, unlockDate: "2027-07-29T00:00:00", content: "Type your reason here..." },
  { id: "289", dayNumber: 289, unlockDate: "2027-07-30T00:00:00", content: "Type your reason here..." },
  { id: "290", dayNumber: 290, unlockDate: "2027-07-31T00:00:00", content: "Type your reason here..." },
  { id: "291", dayNumber: 291, unlockDate: "2027-08-01T00:00:00", content: "Type your reason here..." },
  { id: "292", dayNumber: 292, unlockDate: "2027-08-02T00:00:00", content: "Type your reason here..." },
  { id: "293", dayNumber: 293, unlockDate: "2027-08-03T00:00:00", content: "Type your reason here..." },
  { id: "294", dayNumber: 294, unlockDate: "2027-08-04T00:00:00", content: "Type your reason here..." },
  { id: "295", dayNumber: 295, unlockDate: "2027-08-05T00:00:00", content: "Type your reason here..." },
  { id: "296", dayNumber: 296, unlockDate: "2027-08-06T00:00:00", content: "Type your reason here..." },
  { id: "297", dayNumber: 297, unlockDate: "2027-08-07T00:00:00", content: "Type your reason here..." },
  { id: "298", dayNumber: 298, unlockDate: "2027-08-08T00:00:00", content: "Type your reason here..." },
  { id: "299", dayNumber: 299, unlockDate: "2027-08-09T00:00:00", content: "Type your reason here..." },
  { id: "300", dayNumber: 300, unlockDate: "2027-08-10T00:00:00", content: "Type your reason here..." },
  { id: "301", dayNumber: 301, unlockDate: "2027-08-11T00:00:00", content: "Type your reason here..." },
  { id: "302", dayNumber: 302, unlockDate: "2027-08-12T00:00:00", content: "Type your reason here..." },
  { id: "303", dayNumber: 303, unlockDate: "2027-08-13T00:00:00", content: "Type your reason here..." },
  { id: "304", dayNumber: 304, unlockDate: "2027-08-14T00:00:00", content: "Type your reason here..." },
  { id: "305", dayNumber: 305, unlockDate: "2027-08-15T00:00:00", content: "Type your reason here..." },
  { id: "306", dayNumber: 306, unlockDate: "2027-08-16T00:00:00", content: "Type your reason here..." },
  { id: "307", dayNumber: 307, unlockDate: "2027-08-17T00:00:00", content: "Type your reason here..." },
  { id: "308", dayNumber: 308, unlockDate: "2027-08-18T00:00:00", content: "Type your reason here..." },
  { id: "309", dayNumber: 309, unlockDate: "2027-08-19T00:00:00", content: "Type your reason here..." },
  { id: "310", dayNumber: 310, unlockDate: "2027-08-20T00:00:00", content: "Type your reason here..." },
  { id: "311", dayNumber: 311, unlockDate: "2027-08-21T00:00:00", content: "Type your reason here..." },
  { id: "312", dayNumber: 312, unlockDate: "2027-08-22T00:00:00", content: "Type your reason here..." },
  { id: "313", dayNumber: 313, unlockDate: "2027-08-23T00:00:00", content: "Type your reason here..." },
  { id: "314", dayNumber: 314, unlockDate: "2027-08-24T00:00:00", content: "Type your reason here..." },
  { id: "315", dayNumber: 315, unlockDate: "2027-08-25T00:00:00", content: "Type your reason here..." },
  { id: "316", dayNumber: 316, unlockDate: "2027-08-26T00:00:00", content: "Type your reason here..." },
  { id: "317", dayNumber: 317, unlockDate: "2027-08-27T00:00:00", content: "Type your reason here..." },
  { id: "318", dayNumber: 318, unlockDate: "2027-08-28T00:00:00", content: "Type your reason here..." },
  { id: "319", dayNumber: 319, unlockDate: "2027-08-29T00:00:00", content: "Type your reason here..." },
  { id: "320", dayNumber: 320, unlockDate: "2027-08-30T00:00:00", content: "Type your reason here..." },
  { id: "321", dayNumber: 321, unlockDate: "2027-08-31T00:00:00", content: "Type your reason here..." },
  { id: "322", dayNumber: 322, unlockDate: "2027-09-01T00:00:00", content: "Type your reason here..." },
  { id: "323", dayNumber: 323, unlockDate: "2027-09-02T00:00:00", content: "Type your reason here..." },
  { id: "324", dayNumber: 324, unlockDate: "2027-09-03T00:00:00", content: "Type your reason here..." },
  { id: "325", dayNumber: 325, unlockDate: "2027-09-04T00:00:00", content: "Type your reason here..." },
  { id: "326", dayNumber: 326, unlockDate: "2027-09-05T00:00:00", content: "Type your reason here..." },
  { id: "327", dayNumber: 327, unlockDate: "2027-09-06T00:00:00", content: "Type your reason here..." },
  { id: "328", dayNumber: 328, unlockDate: "2027-09-07T00:00:00", content: "Type your reason here..." },
  { id: "329", dayNumber: 329, unlockDate: "2027-09-08T00:00:00", content: "Type your reason here..." },
  { id: "330", dayNumber: 330, unlockDate: "2027-09-09T00:00:00", content: "Type your reason here..." },
  { id: "331", dayNumber: 331, unlockDate: "2027-09-10T00:00:00", content: "Type your reason here..." },
  { id: "332", dayNumber: 332, unlockDate: "2027-09-11T00:00:00", content: "Type your reason here..." },
  { id: "333", dayNumber: 333, unlockDate: "2027-09-12T00:00:00", content: "Type your reason here..." },
  { id: "334", dayNumber: 334, unlockDate: "2027-09-13T00:00:00", content: "Type your reason here..." },
  { id: "335", dayNumber: 335, unlockDate: "2027-09-14T00:00:00", content: "Type your reason here..." },
  { id: "336", dayNumber: 336, unlockDate: "2027-09-15T00:00:00", content: "Type your reason here..." },
  { id: "337", dayNumber: 337, unlockDate: "2027-09-16T00:00:00", content: "Type your reason here..." },
  { id: "338", dayNumber: 338, unlockDate: "2027-09-17T00:00:00", content: "Type your reason here..." },
  { id: "339", dayNumber: 339, unlockDate: "2027-09-18T00:00:00", content: "Type your reason here..." },
  { id: "340", dayNumber: 340, unlockDate: "2027-09-19T00:00:00", content: "Type your reason here..." },
  { id: "341", dayNumber: 341, unlockDate: "2027-09-20T00:00:00", content: "Type your reason here..." },
  { id: "342", dayNumber: 342, unlockDate: "2027-09-21T00:00:00", content: "Type your reason here..." },
  { id: "343", dayNumber: 343, unlockDate: "2027-09-22T00:00:00", content: "Type your reason here..." },
  { id: "344", dayNumber: 344, unlockDate: "2027-09-23T00:00:00", content: "Type your reason here..." },
  { id: "345", dayNumber: 345, unlockDate: "2027-09-24T00:00:00", content: "Type your reason here..." },
  { id: "346", dayNumber: 346, unlockDate: "2027-09-25T00:00:00", content: "Type your reason here..." },
  { id: "347", dayNumber: 347, unlockDate: "2027-09-26T00:00:00", content: "Type your reason here..." },
  { id: "348", dayNumber: 348, unlockDate: "2027-09-27T00:00:00", content: "Type your reason here..." },
  { id: "349", dayNumber: 349, unlockDate: "2027-09-28T00:00:00", content: "Type your reason here..." },
  { id: "350", dayNumber: 350, unlockDate: "2027-09-29T00:00:00", content: "Type your reason here..." },
  { id: "351", dayNumber: 351, unlockDate: "2027-09-30T00:00:00", content: "Type your reason here..." },
  { id: "352", dayNumber: 352, unlockDate: "2027-10-01T00:00:00", content: "Type your reason here..." },
  { id: "353", dayNumber: 353, unlockDate: "2027-10-02T00:00:00", content: "Type your reason here..." },
  { id: "354", dayNumber: 354, unlockDate: "2027-10-03T00:00:00", content: "Type your reason here..." },
  { id: "355", dayNumber: 355, unlockDate: "2027-10-04T00:00:00", content: "Type your reason here..." },
  { id: "356", dayNumber: 356, unlockDate: "2027-10-05T00:00:00", content: "Type your reason here..." },
  { id: "357", dayNumber: 357, unlockDate: "2027-10-06T00:00:00", content: "Type your reason here..." },
  { id: "358", dayNumber: 358, unlockDate: "2027-10-07T00:00:00", content: "Type your reason here..." },
  { id: "359", dayNumber: 359, unlockDate: "2027-10-08T00:00:00", content: "Type your reason here..." },
  { id: "360", dayNumber: 360, unlockDate: "2027-10-09T00:00:00", content: "Type your reason here..." },
  { id: "361", dayNumber: 361, unlockDate: "2027-10-10T00:00:00", content: "Type your reason here..." },
  { id: "362", dayNumber: 362, unlockDate: "2027-10-11T00:00:00", content: "Type your reason here..." },
  { id: "363", dayNumber: 363, unlockDate: "2027-10-12T00:00:00", content: "Type your reason here..." },
  { id: "364", dayNumber: 364, unlockDate: "2027-10-13T00:00:00", content: "Type your reason here..." },
  { id: "365", dayNumber: 365, unlockDate: "2027-10-14T00:00:00", content: "Type your reason here..." }
];

function getNextUnlockCountdown(reasons: DailyReason[], now: number) {
  const futureReasons = reasons
    .map((r) => new Date(r.unlockDate).getTime())
    .filter((time) => time > now)
    .sort((a, b) => a - b);

  if (futureReasons.length === 0) return null;

  const diff = futureReasons[0] - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds };
}

function getNoteCountdown(targetDate: string, now: number) {
  const diff = new Date(targetDate).getTime() - now;
  if (diff <= 0) return "Unlocked & Ready";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  if (days > 0) return `Unlocks in ${days}d ${hours}h`;
  return `Unlocks in ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
}

export default function DailyReasons() {
  const [now, setNow] = useState<number>(0);
  const [mounted, setMounted] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [openNote, setOpenNote] = useState<DailyReason | null>(null);

  useEffect(() => {
    setMounted(true);
    setNow(Date.now());
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isArchiveOpen || openNote) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isArchiveOpen, openNote]);

  const isUnlocked = (dateStr: string) => mounted && new Date(dateStr).getTime() <= now;
  const nextUnlock = mounted ? getNextUnlockCountdown(dailyReasons, now) : null;
  const unlockedCount = dailyReasons.filter((r) => isUnlocked(r.unlockDate)).length;
  const totalCount = dailyReasons.length;

  return (
    <>
      <section id="daily-reasons" className="relative w-full py-16 px-4 overflow-hidden">
        {/* Background Ambient Sparkles for the Main Page */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-rose-300/30"
              style={{
                top: `${15 * i + 5}%`,
                left: `${(i * 25) % 90}%`,
              }}
              animate={{ y: [0, -15, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart className="w-5 h-5 fill-rose-200/40" />
            </motion.div>
          ))}
        </div>

        <div className="max-w-xl mx-auto">
          {/* The New Compact Entry Card */}
          <div className="relative p-8 sm:p-10 rounded-[2.5rem] bg-white/70 backdrop-blur-md border border-rose-200/60 shadow-[0_20px_50px_-12px_rgba(224,85,134,0.15)] flex flex-col items-center text-center overflow-hidden">
            
            <div className="absolute top-6 inset-x-0 flex justify-center gap-2 text-[0.5rem] text-[#e66496] opacity-80 pointer-events-none">
              <span>♥</span><span>♥</span><span>♥</span>
            </div>

            <div className="w-14 h-14 mt-2 mb-5 rounded-full bg-rose-50 flex items-center justify-center text-[var(--rose)] shadow-inner border border-rose-100/50">
              <BookOpen className="w-6 h-6" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif text-[rgb(74,32,58)] tracking-tight font-medium mb-3">
              New Day, New Reason
            </h2>
            
            <p className="text-sm sm:text-base text-rose-900/65 italic font-serif mb-8 max-w-sm">
              365 reasons why I fell in love with you, sealed away and unlocking one by one.
            </p>

            {/* Next Unlock Countdown */}
            {nextUnlock && (
              <div className="mb-8 flex flex-col items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest font-bold text-rose-400">Next reason unlocks in:</span>
                <div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-2xl border border-rose-100 shadow-sm">
                  <Clock className="w-4 h-4 text-rose-300" />
                  <span className="font-mono text-sm font-bold text-[var(--rose)]">
                    {nextUnlock.days > 0 && `${nextUnlock.days}d `}
                    {String(nextUnlock.hours).padStart(2, "0")}h{" "}
                    {String(nextUnlock.minutes).padStart(2, "0")}m{" "}
                    {String(nextUnlock.seconds).padStart(2, "0")}s
                  </span>
                </div>
              </div>
            )}

            {/* Button to Open the Archive */}
            <button
              onClick={() => setIsArchiveOpen(true)}
              className="w-full sm:w-auto relative rounded-2xl bg-[#d65385] px-8 py-3.5 font-bold tracking-wider uppercase text-xs text-white shadow-[0_8px_20px_rgba(224,85,134,0.2)] transition-all duration-300 hover:bg-[#c24675] hover:shadow-[0_8px_25px_rgba(224,85,134,0.3)] active:scale-[0.98]"
            >
              Open The Archive ({unlockedCount}/365)
            </button>
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* 1. THE FULLSCREEN ARCHIVE VAULT MODAL       */}
      {/* ========================================= */}
      <AnimatePresence>
        {isArchiveOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-[100] bg-[#fff5fa] overflow-y-auto"
          >
            {/* Clean, Flat Header Matching Image */}
            <div className="sticky top-0 z-20 bg-[#fff5fa] border-b border-rose-200/50 py-4 sm:py-5 px-4 sm:px-10 flex items-center justify-center min-h-[70px] sm:min-h-[80px]">
              <button
                onClick={() => setIsArchiveOpen(false)}
                aria-label="Go back"
                className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white border border-rose-200 flex items-center justify-center text-rose-400 hover:text-rose-600 hover:bg-rose-50 shadow-sm transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.5]" />
              </button>
              
              <div className="flex flex-col items-center text-center px-10">
                <h2 className="font-serif text-xl sm:text-[1.75rem] font-medium text-[rgb(74,32,58)] leading-tight whitespace-nowrap">
                  New Day, New Reason
                </h2>
                <div className="flex items-center gap-1.5 mt-1 sm:mt-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff758f]" />
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#ff758f] font-bold">
                    {unlockedCount} / {totalCount} UNLOCKED
                  </span>
                </div>
              </div>
            </div>

            {/* The 365 Notes Grid */}
            <div className="p-4 sm:p-8 max-w-7xl mx-auto pb-24 mt-2">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                {dailyReasons.map((reason) => {
                  const unlocked = isUnlocked(reason.unlockDate);

                  return (
                    <motion.div
                      key={reason.id}
                      whileHover={unlocked ? { y: -4, scale: 1.02 } : {}}
                      onClick={() => unlocked && setOpenNote(reason)}
                      className={`relative p-5 rounded-[2rem] flex flex-col items-center justify-center text-center h-48 sm:h-52 transition-all duration-300 ${
                        unlocked
                          ? "bg-white border border-rose-200 shadow-md cursor-pointer hover:border-rose-300 hover:shadow-xl"
                          : "bg-[#fffdfa] border border-rose-100/60 shadow-sm cursor-not-allowed"
                      }`}
                    >
                      {unlocked ? (
                        <>
                          <div className="w-11 h-11 rounded-full bg-rose-50 flex items-center justify-center text-rose-400 mb-3 border border-rose-100/50 shadow-inner">
                            <Heart className="w-4 h-4 fill-rose-300/50 stroke-[1.5]" />
                          </div>
                          <span className="text-[10px] font-bold tracking-[0.2em] text-rose-400 uppercase mb-2">
                            DAY {reason.dayNumber}
                          </span>
                          <p className="font-serif text-sm sm:text-base text-[rgb(74,32,58)]/80 leading-snug px-2 line-clamp-3 italic">
                            "{reason.content}"
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="w-11 h-11 rounded-full flex items-center justify-center text-rose-300 mb-3 border border-rose-100 bg-white shadow-2xs">
                            <Lock className="w-4 h-4 stroke-[1.5]" />
                          </div>
                          <span className="text-[10px] font-bold tracking-[0.2em] text-rose-400 uppercase mb-3">
                            DAY {reason.dayNumber}
                          </span>
                          <div className="w-full py-2 rounded-xl bg-rose-50/50 border border-rose-100/50 flex flex-col items-center justify-center">
                            <span className="text-[8px] uppercase tracking-widest text-rose-400 font-bold mb-0.5">
                              Unlocks In
                            </span>
                            <span className="font-mono text-[11px] font-medium text-rose-600 tracking-tight">
                              {mounted ? getNoteCountdown(reason.unlockDate, now) : "..."}
                            </span>
                          </div>
                        </>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================= */}
      {/* 2. THE SINGLE OPENED NOTE MODAL             */}
      {/* ========================================= */}
      <AnimatePresence>
        {openNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-[rgb(50,20,38)]/60 backdrop-blur-md"
            onClick={() => setOpenNote(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-[#fffdfa] rounded-[2.5rem] border border-rose-200/80 shadow-2xl p-8 sm:p-12 overflow-hidden flex flex-col items-center text-center"
            >
              {/* Top Accent Ribbon */}
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-rose-200 via-rose-300 to-rose-200" />

              {/* Close Button */}
              <button
                onClick={() => setOpenNote(null)}
                aria-label="Close note"
                className="absolute top-5 left-5 w-10 h-10 rounded-full bg-white hover:bg-rose-50 border border-rose-200/80 text-[#4a2036]/60 hover:text-[#e66496] transition-colors shadow-xs flex items-center justify-center cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              {/* Header Stamp & Live Counter Badge */}
              <div className="flex flex-col items-center mb-6 mt-3">
                <div className="w-14 h-14 rounded-full bg-[var(--rose)] flex items-center justify-center text-white shadow-lg shadow-rose-900/15 mb-3">
                  <Sparkles className="w-6 h-6 fill-white/20" />
                </div>
                <span className="text-[11px] font-bold tracking-[0.25em] text-[var(--rose)] uppercase">
                  Reason #{openNote.dayNumber}
                </span>

                <div className="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-xs font-serif italic text-rose-900 shadow-2xs">
                  <Calendar className="w-3.5 h-3.5 text-rose-400" />
                  <span>{getNoteCountdown(openNote.unlockDate, now)}</span>
                </div>
              </div>

              {/* Letter Content (Title Removed) */}
              <div className="z-10 flex flex-col gap-5 w-full mt-4">
                <p className="text-lg sm:text-xl leading-[1.8] text-[rgb(74,32,58)]/90 font-serif italic w-full text-center px-2">
                  "{openNote.content}"
                </p>
              </div>

              {/* Footer Heart Seal */}
              <div className="mt-10 pt-4 border-t border-rose-100/80 flex justify-center w-full">
                <Heart className="w-4 h-4 text-rose-300 fill-rose-200" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}