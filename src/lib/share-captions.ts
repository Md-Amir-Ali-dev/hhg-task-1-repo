/**
 * Pool of warm, human-sounding share captions.
 * Each call to getShareCaption() picks a random variant so tweets
 * from different users don't look identical.
 */

const GENERIC_CAPTIONS: string[] = [
  "Just claimed my spot at Hack House Goa 2026 🌴 Built to hack, flowing to win — see you on the beach.\n\n#FrameInGoa #HHGoa #HackerHouse2026 #Goa2026",
  "Packed my bags for Hack House Goa 2026. Four days, one rhythm, everything intentional. Let's build something real.\n\n#FrameInGoa #HHGoa #HackerHouse2026 #Goa2026",
  "This is me, officially building at Hack House Goa 2026 🏖️ Ship fast, hack hard, repeat.\n\n#FrameInGoa #HHGoa #HackerHouse2026 #Goa2026",
  "Goa is calling and I said yes 🌊 Hack House Goa 2026 — four days of building, vibes, and the Indian Ocean as my backdrop.\n\n#FrameInGoa #HHGoa #HackerHouse2026 #Goa2026",
  "Not just attending — building 🛠️ Hack House Goa 2026 is where builders meet the beach. Can't wait to ship something wild.\n\n#FrameInGoa #HHGoa #HackerHouse2026 #Goa2026",
  "Sun, sand, and shipping code 🚀 Locked in for Hack House Goa 2026. If you know, you know.\n\n#FrameInGoa #HHGoa #HackerHouse2026 #Goa2026",
];

const PERSONALIZED_CAPTIONS: string[] = [
  "{name} reporting for duty at Hack House Goa 2026 as a {title} 🌴 Ready to build, ship, and soak it all in.\n\n#FrameInGoa #HHGoa #HackerHouse2026 #Goa2026",
  "It's official — {name} is headed to Hack House Goa 2026 🏖️ Bringing the {title} energy. Let's make waves.\n\n#FrameInGoa #HHGoa #HackerHouse2026 #Goa2026",
  "Hey, it's {name} 👋 Joining Hack House Goa 2026 as a {title}. Four days of hacking by the ocean — let's go.\n\n#FrameInGoa #HHGoa #HackerHouse2026 #Goa2026",
  "{name} here, signing up as a {title} at Hack House Goa 2026 🌊 Built to hack, flowing to win.\n\n#FrameInGoa #HHGoa #HackerHouse2026 #Goa2026",
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

/**
 * Returns a share caption, optionally personalised with the user's name
 * and builder title. Falls back to a generic variant when those fields
 * are empty.
 */
export function getShareCaption(name?: string, builderTitle?: string): string {
  const trimmedName = name?.trim();
  const trimmedTitle = builderTitle?.trim();

  if (trimmedName && trimmedTitle) {
    return pickRandom(PERSONALIZED_CAPTIONS)
      .replace("{name}", trimmedName)
      .replace("{title}", trimmedTitle);
  }

  if (trimmedName) {
    const base = pickRandom(GENERIC_CAPTIONS);
    return base.replace(/^/, `${trimmedName} here — `);
  }

  return pickRandom(GENERIC_CAPTIONS);
}
