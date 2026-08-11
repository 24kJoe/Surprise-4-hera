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
  heroTitle: "Everything I Never Said Out Loud",
  letterText:
`Happy Birthday ya habibti,
I just wanted to say how much you actually mean to me. Like, there are honestly no words that can describe how I feel towards you. Ana bmot feeki bgd. Enti msh bas habibti, enti sa7bty, w my best friend, w ro7y feeki aslan.

Bad3i en Rabna ya5leke leya. Ana msh mota5ayel asasan 7ayaty mn 8eirik. Ana 3ayzek ma3aya 3ala tool, w zy ma olt 2abl keda, wallahi el 3azeem hafdal a7awel 3ashanek, w ana msh mstaghni 3ank, aya kan eh elli ye7sal.

To be absolutely honest, I have never felt the love I'm feeling right now towards any human being except you. Enti 7ayaty. I didn't know i can talk that good you should take tips anyways the effect you have on me is actually crazy. Not in a bad way, but in a good way. I've never felt this kind of affection and love before.

You're an amazing person, and you always will be. I love everything every small detail about you. I love your nose, I love your smile, your eyes, your hair, and even your small little ears. But not gonna lie i love you nose the most . You're a lovely person.

I will always love you. You just have that place in my heart that no one will actually be capable of reaching. You're the light that makes my life brighter just by being in it. You know that I'm glad that you chose me, and I'm glad that I found such an amazing person like you.

W Rabena ya5leke leya yarab.`,
  signOff: "— always yours",
  photos: [
    { src: "", caption: "Add your first photo here" },
    { src: "", caption: "" },
    { src: "", caption: "" },
    { src: "", caption: "" },
  ],
  timeline: [
    { date: "The Day We Met", story: "I remember exactly what you were wearing, and exactly how nervous I was to say hi." },
    { date: "Our First Date", story: "We talked for so long the restaurant staff started stacking chairs around us." },
    { date: "The Trip That Almost Got Cancelled", story: "Everything went wrong, and somehow it turned into one of my favorite memories." },
    { date: "Today", story: "Still choosing you. Still grateful you chose me back." },
  ],
};