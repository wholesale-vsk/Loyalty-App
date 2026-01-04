import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

export default function SettingsScreen() {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailOffers, setEmailOffers] = useState(false);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const { color } = useTheme();

  const colorMap: Record<string, string> = {
    blue: '#3B82F6',
    purple: '#4F46E5',
    green: '#10B981',
    orange: '#F59E0B',
  };

  const settingsItems = [
    { id: 1, title: 'Edit Profile', icon: 'person-outline', route: 'profile' },
    // { id: 2, title: 'Manage Membership', icon: 'card-outline', route: 'membership' },
    { id: 2, title: 'Change Password', icon: 'lock-closed-outline', route: 'change-password' },
    { id: 3, title: 'Payment Methods', icon: 'wallet-outline', route: 'payment-methods' },
  ];

  const preferences = [
    { id: 1, title: 'Appearance', subtitle: 'System', icon: 'color-palette-outline', route: 'appearance' },
    { id: 2, title: 'Language', subtitle: 'English', icon: 'language-outline', route: 'language' },
    { id: 3, title: 'Location Services', subtitle: 'On', icon: 'location-outline', route: 'location' },
  ];

  const support = [
    { id: 1, title: 'Help & Support', icon: 'help-circle-outline', route: 'support' },
    { id: 2, title: 'Privacy Policy', icon: 'shield-checkmark-outline', route: 'privacy-policy' },
    { id: 3, title: 'Terms of Service', icon: 'document-text-outline', route: 'terms' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View className="px-6 pt-4 pb-6 flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-gray-900">Settings</Text>
          <TouchableOpacity onPress={() => router.replace('../(tabs)')}>
            <Text style={{ color: colorMap[color], fontWeight: '600' }}>Close</Text>
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">Account</Text>
          {settingsItems.map(item => (
            <TouchableOpacity
              key={item.id}
              className="flex-row items-center justify-between py-3 border-b border-gray-200"
              onPress={() => router.push(item.route as any)}
            >
              <View className="flex-row items-center">
                <Ionicons name={item.icon as any} size={22} color="#4B5563" />
                <Text className="ml-3 text-gray-900">{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Notifications Section */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">Notifications</Text>
          <View className="flex-row items-center justify-between py-3 border-b border-gray-200">
            <Text className="text-gray-900">Push Notifications</Text>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: "#D1D5DB", true: colorMap[color] }}
              thumbColor={pushNotifications ? colorMap[color] : "#F9FAFB"}
            />
          </View>
          <View className="flex-row items-center justify-between py-3 border-b border-gray-200">
            <Text className="text-gray-900">Email Offers</Text>
            <Switch
              value={emailOffers}
              onValueChange={setEmailOffers}
              trackColor={{ false: "#D1D5DB", true: colorMap[color] }}
              thumbColor={emailOffers ? colorMap[color] : "#F9FAFB"}
            />
          </View>
          <View className="flex-row items-center justify-between py-3 border-b border-gray-200">
            <Text className="text-gray-900">SMS Alerts</Text>
            <Switch
              value={smsAlerts}
              onValueChange={setSmsAlerts}
              trackColor={{ false: "#D1D5DB", true: colorMap[color] }}
              thumbColor={smsAlerts ? colorMap[color] : "#F9FAFB"}
            />
          </View>
        </View>

        {/* Preferences Section */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">Preferences</Text>
          {preferences.map(item => (
            <TouchableOpacity
              key={item.id}
              className="flex-row items-center justify-between py-3 border-b border-gray-200"
              onPress={() => router.push(item.route as any)}
            >
              <View className="flex-row items-center">
                <Ionicons name={item.icon as any} size={22} color="#4B5563" />
                <Text className="ml-3 text-gray-900">{item.title}</Text>
              </View>
              <Text className="text-gray-400">{item.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Support & Legal Section */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">Support & Legal</Text>
          {support.map(item => (
            <TouchableOpacity
              key={item.id}
              className="flex-row items-center justify-between py-3 border-b border-gray-200"
              onPress={() => router.push(item.route as any)}
            >
              <View className="flex-row items-center">
                <Ionicons name={item.icon as any} size={22} color="#4B5563" />
                <Text className="ml-3 text-gray-900">{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <View className="px-6 pb-8">
          <TouchableOpacity
            onPress={async () => {
              try {
                await signOut(auth);
                router.replace('/(auth)/welcome');
              } catch (e) {
                console.log('Logout failed', e);
              }
            }}
            className="bg-red-50 border border-red-200 rounded-xl p-4"
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
              <Text className="text-red-500 font-semibold ml-2">Log Out</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Version */}
        <View className="items-center pb-6">
          <Text className="text-gray-400 text-sm">Version 1.0.0</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}