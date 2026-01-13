import { Icon } from "@/components/ui/icon";
import { useLogOut } from "@/hooks/useAuth";
import { useTranslation } from "@/translation";
import { router } from "expo-router";
import { LogOut } from "lucide-react-native";
import { Button, ButtonText } from "./ui/button";
export default function LogOutButton() {
  const { t } = useTranslation();
  const { mutate: logginOut } = useLogOut();
  const handleLogout = () => {
    logginOut();
    router.replace("/(auth)/login");
  };
  return (
    <Button variant="outline" className="border-red-500" onPress={handleLogout}>
      <Icon as={LogOut} size="sm" className="text-red-500" />
      <ButtonText className="ml-2 text-red-500">
        {t("profile.logout", "Logout")}
      </ButtonText>
    </Button>
  );
}
