// lib/config.ts

export type Photo = {
  src: string;
  caption: string;
};

export type TimelineItem = {
  date: string;
  story: string;
};

export type Song = {
  title: string;
  artist?: string;
  src: string;
};

export const CONFIG = {
  yourName: "Youssef",
  herName: "Ann",

  // ---- Relationship start date (used by the live counter) ----
  // format: "YYYY-MM-DDTHH:MM:SS"
  startDate: "2026-01-17T13:21:00",

  toLine: "To My Love,",
  heroTitle: "A little letter for you",
  letterText: `If you're reading this, it means I finally figured out how to build you something
that could hold even a little bit of how I feel.

Every day with you has taught me something new about what it means to be happy.
You make ordinary moments feel like the best part of my day, and somehow
you make me a better version of myself just by being around.

This little page is my attempt at putting that into something you can click through,
scroll around, and hopefully smile at. There's more of me in here than I could ever
say out loud without getting embarrassingly cheesy — but here, I don't have to worry
about that. So consider this fair warning: it's about to get very cheesy.

I love you. Today, and every day after this one.`,
  signOff: "— always yours",

  // ---- Password to unlock the site ----
  password: "151009",

  // ---- Music Playlist (ضع ملفات الـ mp3 داخل مجلد /public) ----
  songs: [
    { title: "Song 1", artist: "Artist 1", src: "/song1.mp3" },
    { title: "Song 2", artist: "Artist 2", src: "/song2.mp3" },
    { title: "Song 3", artist: "Artist 3", src: "/song3.mp3" },
  ] as Song[],

  // ---- Photo gallery (add/remove photos here) ----
  photos: [
    { src: "", caption: "Add your first photo here" },
    { src: "", caption: "" },
    { src: "", caption: "" },
    { src: "", caption: "" },
  ] as Photo[],

  // ---- Timeline: click a date to reveal the story ----
  timeline: [
    {
      date: "The Day We Met",
      story:
        "I remember exactly what you were wearing, and exactly how nervous I was to say hi.",
    },
    {
      date: "Our First Date",
      story:
        "We talked for so long the restaurant staff started stacking chairs around us.",
    },
    {
      date: "The Trip That Almost Got Cancelled",
      story:
        "Everything went wrong, and somehow it turned into one of my favorite memories.",
    },
    { date: "Today", story: "Still choosing you. Still grateful you chose me back." },
  ] as TimelineItem[],
};