export const light = {
  colors: {
    background: '#FFFFFF',
    foreground: '#000',
    card: '#F4F4F5',
    text: '#000000',
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    muted: '#6b7280',
    border: '#e5e7eb',
  },
} as const;

export const dark = {
  colors: {
    background: '#0a0a0a',
    foreground: '#FFFFFF',
    card: '#1a1a1a',
    text: '#FFFFFF',
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    muted: '#9ca3af',
    border: '#262626',
  },
} as const;

export const themes = { light, dark };
export type AppTheme = keyof typeof themes;
