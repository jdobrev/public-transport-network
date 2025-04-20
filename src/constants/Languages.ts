export const LANGUAGES = {
  EN: "en",
  BG: "bg",
} as const;

export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES];
