import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showClose?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  subtitle?: string;
}

export default function Header({
  title,
  showBack = false,
  showClose = false,
  onBackPress,
  rightComponent,
  subtitle,
}: HeaderProps) {
  const handleBack = () => {
    if (onBackPress) return onBackPress();
    router.back();
  };

  return (
    <View className="flex-row items-center justify-between p-4 bg-white">
      {/* Left Section */}
      <View className="flex-row items-center">
        {showBack && (
          <TouchableOpacity onPress={handleBack} className="mr-3">
            <Ionicons name="arrow-back" size={26} color="#333" />
          </TouchableOpacity>
        )}

        {showClose && (
          <TouchableOpacity onPress={handleBack} className="mr-3">
            <Ionicons name="close" size={26} color="#333" />
          </TouchableOpacity>
        )}

        <View>
          <Text className="text-xl font-semibold">{title}</Text>
          {subtitle && (
            <Text className="text-gray-500 text-sm mt-0.5">{subtitle}</Text>
          )}
        </View>
      </View>

      {/* Right Component */}
      {rightComponent && <View>{rightComponent}</View>}
    </View>
  );
}

/* ====================================================
    USER HEADER (Greeting + Username)
==================================================== */
interface UserHeaderProps {
  userName: string;
  greeting?: string;
  onSettingsPress?: () => void;
}

export function UserHeader({
  userName,
  greeting = "Hello",
  onSettingsPress,
}: UserHeaderProps) {
  return (
    <View className="flex-row items-center justify-between p-4">
      <View>
        <Text className="text-lg text-gray-600">
          {greeting},
        </Text>
        <Text className="text-2xl font-bold">{userName}</Text>
      </View>

      {onSettingsPress && (
        <TouchableOpacity onPress={onSettingsPress}>
          <Ionicons name="settings-outline" size={28} color="#444" />
        </TouchableOpacity>
      )}
    </View>
  );
}

/* ====================================================
    SEARCH HEADER (Search + Notifications)
==================================================== */
interface SearchHeaderProps {
  title: string;
  onSearchPress?: () => void;
  onNotificationPress?: () => void;
  notificationCount?: number;
}

export function SearchHeader({
  title,
  onSearchPress,
  onNotificationPress,
  notificationCount = 0,
}: SearchHeaderProps) {
  return (
    <View className="flex-row items-center justify-between p-4">
      <Text className="text-2xl font-bold">{title}</Text>

      <View className="flex-row items-center">
        {/* Search Icon */}
        {onSearchPress && (
          <TouchableOpacity onPress={onSearchPress} className="mr-4">
            <Ionicons name="search" size={26} color="#333" />
          </TouchableOpacity>
        )}

        {/* Notification Icon */}
        {onNotificationPress && (
          <TouchableOpacity onPress={onNotificationPress} className="relative">
            <Ionicons name="notifications-outline" size={26} color="#333" />

            {notificationCount > 0 && (
              <View className="absolute -top-1 -right-1 bg-red-500 px-1.5 py-0.5 rounded-full">
                <Text className="text-white text-xs font-semibold">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
