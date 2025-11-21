export const light = {
  colors: {
    background: "#FFFFFF",
    foreground: "#000",
    card: "#F4F4F5",
    text:'#000000'
  },
} as const;

export const dark = {
  colors: {
    background: "#000000",
    foreground: "#FFFFFF",
    card: "#1C1C1E",
    text:'#FFFFFF'
  },
} as const;

export const themes = { light, dark };
export type AppTheme = keyof typeof themes;
