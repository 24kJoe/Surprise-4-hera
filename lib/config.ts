export interface Photo {
  src: string;
  caption: string;
}

export interface TimelineItem {
  date: string;
  story: string;
}

export interface SiteConfig {
  yourName: string;
  herName: string;
  startDate: string;
  toLine: string;
  heroTitle: string;
  letterText: string;
  signOff: string;
  photos: Photo[];
  timeline: TimelineItem[];
}

export interface TimeCounter {
  days: number;
  hours: number;
  mins: number;
  secs: number;
}

export const CONFIG: SiteConfig = {
  yourName: "Youssef",
  herName: "Ann",
  startDate: "2026-01-17T13:21:00",
  toLine: "Ann",
  heroTitle: "كل سنة و أنتي طيبه يا حبيبتي",
  letterText:
`انا بحبك ومهما اتكلمت عمري ما هعرف أوصفلك بحبك قد إيه، إنتي بجد أحلى بني آدمة شفتها في حياتي، وعايزك دايماً تبقي متأكدة من ده وعارفة إني بموت فيكي، أول مرة في حياتي أحب حد بالطريقة دي وأكيد آخر مرة، لأن مفيش ولا عمره هيبقى في حد زيك أبداً

إنتي جميلة وعسل وزي القمر، ومش مجرد حبيبتي، إنتي صاحبتي وروحي وحياتي وكل حاجة ليا، لحد دلوقتي وأنتي نايمة بقعد أفكر فيكي، أفتح صورنا وأتفرج عليها وأنا مش مصدق إنك معايا، إنتي نعمة عمري ما تخيلت إنها تكون في حياتي

نفسي نكمل مع بعض العمر كله ومسيبكيش أبداً، ومقدرش حتى أتخيل حد مكانك لأن محدش هيعرف ولا يقدر يكون زيك، لو قعدت أقولك بحبك للصبح مش هخلص، وحتى كل الكلام والتصرفات بحسها مش كفاية عليكي، إنتي فعلاً تستاهلي الدنيا كلها ومش ببالغ

يا رب يقدرني وأفضل دايماً أعمل كل اللي يبسطك ويفرحك، لأن ضحكتك دي بالذات هي الحاجة الوحيدة اللي بتخلي يومي كله يهون ويبقى على قلبي زي العسل حتى لو فيه مليون حاجة وحشة ومضايقاني، أوعي في يوم تزعلي، زعلك بيوجعني وميهونش عليا أشوفك زعلانة أبداً، القمر ده مينفعش يزعل وطز في أي حاجة تضايقك

هعمل كل اللي أقدر عليه عشان أفضل مفرحك، وهفضل أحاول عشان نبقى مع بعض على طول لأن عمري ما هستغنى عنك ولا هتخيل حياتي من غيرك، إنتي خلاص بقيتي كل دنيتي، إنتي أغلى حد عندي في الدنيا وهتفضلي دايماً أغلى إنسانة عندي ربنا يخليكي ليا وتفضلي في حياتي ومعايا على طول يا حبيبتي`,
  signOff: "— Y",
  photos: [
    { src: "", caption: "" },
    { src: "", caption: "" },
    { src: "", caption: "" },
    { src: "", caption: "" },
  ],
  timeline: [
    { date: "The First Time We Met", story: "The moment I saw you coming up the stairs, I remember every detail of those few seconds. I was so nervous to even say hi that even I couldn’t bring myself to look at you. I honestly couldn’t believe that I was actually seeing you.." },
    { date: "Zamalek Date", story: "Actually, one of my favorite dates. It's a place that I love with my favourite person too it was amazing . It just felt different from every other date we’ve had." },
    { date: "Arguments", story: "I know we've had our disagreements and we've had our ups and downs, but I want you to always keep in mind that I never did anything with the intention of bothering you. I just care about you too much. I think about you too much, and sometimes I can't even imagine anything bad happening to you because I love you so much, and the thought of anything happening to you honestly kills me." },
    { date: "Today", story: "Still choosing you every single day, and I'm so grateful you chose me back i want us to be together forever and i hope we will because my life won't be complete without you." },
  ],
}; 