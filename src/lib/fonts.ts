import { Mukta, Tiro_Devanagari_Marathi } from "next/font/google";

export const tiro = Tiro_Devanagari_Marathi({
  weight: "400",
  subsets: ["devanagari", "latin"],
  variable: "--font-tiro",
  display: "swap",
});

export const mukta = Mukta({
  weight: ["400", "500", "600", "700"],
  subsets: ["devanagari", "latin"],
  variable: "--font-mukta",
  display: "swap",
});

export const fontVariables = `${tiro.variable} ${mukta.variable}`;
