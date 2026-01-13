// hooks/useUser.ts
import { getMe } from "@/api/endPoints/user";
import authStore from "@/stores/auth.store";
import LanguageStore from "@/stores/language.store";
import { useQuery } from "@tanstack/react-query";

export const useGetMe = () => {
  // Always call useQuery, but only run the query when authSession + language exist
  const language = LanguageStore.getState().language;
  const authSession = authStore.getState().authSession as string;
  return useQuery({
    queryKey: ["get-me", language ?? "unknown"], // never undefined
    queryFn: () => getMe(language!, authSession!), // safe because enabled prevents premature call
    enabled: !!authSession && !!language, // ✅ disables query until both exist
  });
};
