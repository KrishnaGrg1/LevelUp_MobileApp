import "@/global.css";
import QueryProviders from "@/providers/QueryProvider";
import { SocketProvider } from "@/providers/SocketProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <QueryProviders>
        <SocketProvider>
          <Stack />
        </SocketProvider>
      </QueryProviders>
    </ThemeProvider>
  );
}
