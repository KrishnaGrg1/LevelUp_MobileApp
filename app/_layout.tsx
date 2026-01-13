import "@/global.css";
import QueryProviders from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <QueryProviders>
        <Stack />
      </QueryProviders>
    </ThemeProvider>
  );
}
