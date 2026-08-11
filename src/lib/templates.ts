const pfp1 = { url: "/images/pfp-frame-01.png" };
const pfp2 = { url: "/images/pfp-frame-02.png" };
const pfp3 = { url: "/images/pfp-frame-03.png" };
const pfp4 = { url: "/images/pfp-frame-04.png" };
const card1 = { url: "/images/new-id-card-01.png" };
const card2 = { url: "/images/id-card-02.png" };
const card3 = { url: "/images/id-card-03.png" };
const card4 = { url: "/images/new-id-card-04.png" };

export type FieldKey = "name" | "role" | "title" | "team";

export const FIELD_LABELS: Record<FieldKey, string> = {
  name: "Your name",
  role: "Role / stack",
  title: "Builder title",
  team: "Team name",
};

export const FIELD_PLACEHOLDERS: Record<FieldKey, string> = {
  name: "Aisha Menon",
  role: "Full-stack dev",
  title: "Wave Rider",
  team: "Team Susegad",
};

export type TextSlot = {
  key: FieldKey;
  /** left x of the text run, in native template pixels */
  x: number;
  /** text baseline y, in native template pixels */
  y: number;
  maxWidth: number;
  size: number;
};

export type Hole =
  | { shape: "circle"; cx: number; cy: number; r: number }
  | { shape: "rect"; x: number; y: number; w: number; h: number; radius: number };

export type Template = {
  id: string;
  name: string;
  kind: "pfp" | "card";
  src: string;
  width: number;
  height: number;
  hole: Hole;
  font: "pixel" | "sans";
  ink: string;
  slots: TextSlot[];
};

const PIXEL_SIZE = 12.5;
const SANS_SIZE = 16;

export const TEMPLATES: Template[] = [
  {
    id: "pfp-01",
    name: "Sunset Kombi",
    kind: "pfp",
    src: pfp1.url,
    width: 500,
    height: 500,
    hole: { shape: "circle", cx: 249, cy: 260, r: 160 },
    font: "pixel",
    ink: "#0C2B22",
    slots: [],
  },
  {
    id: "pfp-02",
    name: "Lighthouse",
    kind: "pfp",
    src: pfp2.url,
    width: 500,
    height: 500,
    hole: { shape: "circle", cx: 249, cy: 233, r: 161 },
    font: "pixel",
    ink: "#0C2B22",
    slots: [],
  },
  {
    id: "pfp-03",
    name: "Palm Deck",
    kind: "pfp",
    src: pfp3.url,
    width: 500,
    height: 500,
    hole: { shape: "circle", cx: 251, cy: 229, r: 170 },
    font: "pixel",
    ink: "#0C2B22",
    slots: [],
  },
  {
    id: "pfp-04",
    name: "Surf Club",
    kind: "pfp",
    src: pfp4.url,
    width: 500,
    height: 500,
    hole: { shape: "circle", cx: 248, cy: 223, r: 162 },
    font: "pixel",
    ink: "#0C2B22",
    slots: [],
  },
  {
    id: "card-01",
    name: "BuildFlow Green",
    kind: "card",
    src: card1.url,
    width: 408,
    height: 612,
    hole: { shape: "rect", x: 8, y: 190, w: 174, h: 240, radius: 14 },
    font: "sans",
    ink: "#123A2A",
    slots: [
      { key: "name", x: 235, y: 255, maxWidth: 140, size: SANS_SIZE },
      { key: "role", x: 235, y: 303, maxWidth: 140, size: SANS_SIZE },
      { key: "title", x: 235, y: 350, maxWidth: 140, size: SANS_SIZE },
      { key: "team", x: 235, y: 398, maxWidth: 140, size: SANS_SIZE },
    ],
  },
  {
    id: "card-02",
    name: "Lighthouse Pass",
    kind: "card",
    src: card2.url,
    width: 408,
    height: 612,
    hole: { shape: "rect", x: 31, y: 132, w: 174, h: 223, radius: 16 },
    font: "sans",
    ink: "#14523A",
    slots: [
      { key: "name", x: 265, y: 299, maxWidth: 128, size: SANS_SIZE },
      { key: "role", x: 265, y: 342, maxWidth: 128, size: SANS_SIZE },
      { key: "title", x: 265, y: 385, maxWidth: 128, size: SANS_SIZE },
      { key: "team", x: 265, y: 428, maxWidth: 128, size: SANS_SIZE },
    ],
  },
  {
    id: "card-03",
    name: "Beach Van Badge",
    kind: "card",
    src: card3.url,
    width: 408,
    height: 612,
    hole: { shape: "rect", x: 32, y: 128, w: 174, h: 205, radius: 16 },
    font: "sans",
    ink: "#14523A",
    slots: [
      { key: "name", x: 63, y: 382, maxWidth: 130, size: SANS_SIZE },
      { key: "role", x: 63, y: 425, maxWidth: 130, size: SANS_SIZE },
      { key: "title", x: 63, y: 464, maxWidth: 130, size: SANS_SIZE },
      { key: "team", x: 63, y: 505, maxWidth: 130, size: SANS_SIZE },
    ],
  },
  {
    id: "card-04",
    name: "Chapel Sunset",
    kind: "card",
    src: card4.url,
    width: 433,
    height: 577,
    hole: { shape: "rect", x: 30, y: 190, w: 170, h: 204, radius: 16 },
    font: "sans",
    ink: "#FFFFFF",
    slots: [
      { key: "name", x: 255, y: 256, maxWidth: 180, size: 14 },
      { key: "role", x: 255, y: 298, maxWidth: 180, size: 14 },
      { key: "title", x: 255, y: 339, maxWidth: 180, size: 14 },
      { key: "team", x: 255, y: 382, maxWidth: 180, size: 14 },
    ],
  },
];

export const PFP_TEMPLATES = TEMPLATES.filter((t) => t.kind === "pfp");
export const CARD_TEMPLATES = TEMPLATES.filter((t) => t.kind === "card");
