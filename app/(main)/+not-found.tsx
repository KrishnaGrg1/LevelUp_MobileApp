import { Text, View } from 'react-native';

export default function NotFound() {
  return (
    <View className="flex-1 items-center justify-center bg-red-500">
      <Text className="text-xl font-bold text-white">404 - Page Not Found</Text>
    </View>
  );
}
