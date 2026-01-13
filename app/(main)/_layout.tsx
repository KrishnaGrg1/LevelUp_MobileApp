import authStore from "@/stores/auth.store";
import { Redirect, Slot } from "expo-router";

export default function MainLayout() {
  const isAuthenticated = authStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Slot />;
}
