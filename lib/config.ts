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
  toLine: "To Annona,",
  heroTitle: "Happy Birthday ya habibti",
  letterText:
`I just wanted to say how much you actually mean to me. Like, there are honestly no words that could ever describe how I feel towards you. Ana bmot feeki bgd. Enti msh bas habibti, enti sa7bty, my best friend, w ro7y feeki aslan.

Bad3i en Rabna ya5leke leya. Ana msh mota5ayel asasan 7ayaty mn 8eirik. My whole life is based around one person, and that person is you. Ana 3ayzek ma3aya 3alatool. W zay ma olt 2abl keda, wallahi el 3azeem, hafdal a7awel 3ashanek, w ana msh mstaghni 3ank, ayan kan eh elli ye7sal.

I know we argue more than we used to, but I just want you to know that I love you exactly the way you are. I don't want you to change. I don't want anyone to be a bad influence on you. I know I'm overprotective sometimes, but that's just the way I am. I only want to keep you safe and happy. And I want you to know that I never did anything with the intention of bothering you or hurting you, wallahi el 3azeem. And I'm sorry if I ever bothered you before. I'm genuinely trying to become a better person for you, not just now, but for our future too.

To be absolutely honest, I've never felt the kind of love I'm feeling right now for any human being except you. Enti 7ayaty. I genuinely didn't know I could love someone this much. The effect you have on me is actually crazy — not in a bad way, but in the best way possible. I've never felt this kind of affection, comfort, and love before.

You're an amazing person, and you always will be. I love everything about you, every single little detail. I love your nose, your smile, your eyes, your hair, and even your tiny little ears. But I'm not gonna lie, I love your nose the most. You're genuinely such a lovely person.

I will always love you. You have a place in my heart that no one else will ever be capable of reaching. You're the light that makes my life brighter just by being in it. And you know I'm genuinely so glad that you chose me. I'm glad that somehow, out of everyone in this world, I found someone as amazing as you.

I love you more than I could ever put into words, and no matter how many times I say it, I don't think I'll ever be able to fully explain how much you mean to me.

W Rabena ya5leke leya yarab.  `,
  signOff: "— always yours",
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