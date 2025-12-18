import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { useTheme } from '../contexts/ThemeContext';

type ThemeMode = 'light' | 'dark' | 'system';
type ColorScheme = 'blue' | 'purple' | 'green' | 'orange';

const colorMap: Record<ColorScheme, string> = {
  blue: '#3B82F6',
  purple: '#4F46E5',
  green: '#10B981',
  orange: '#F59E0B',
};

export default function AppearanceScreen() {
  const { theme, setTheme, color, setColor } = useTheme();

  const themes: { id: ThemeMode; title: string; description: string; icon: string }[] = [
    { id: 'light', title: 'Light', description: 'Classic bright theme', icon: 'sunny-outline' },
    { id: 'dark', title: 'Dark', description: 'Easy on the eyes', icon: 'moon-outline' },
    { id: 'system', title: 'System', description: 'Matches your device', icon: 'phone-portrait-outline' },
  ];

  const colorSchemes: { id: ColorScheme; color: string; name: string }[] = [
    { id: 'blue', color: '#3B82F6', name: 'Blue' },
    { id: 'purple', color: '#4F46E5', name: 'Purple' },
    { id: 'green', color: '#10B981', name: 'Green' },
    { id: 'orange', color: '#F59E0B', name: 'Orange' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Appearance" showBack={true} />

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Theme Mode */}
        <View className="mb-8">
          <Text className="text-lg font-bold text-gray-900 mb-4">Theme Mode</Text>
          {themes.map((themeItem) => (
            <TouchableOpacity
              key={themeItem.id}
              onPress={() => setTheme(themeItem.id)}
              className="flex-row items-center justify-between p-4 rounded-xl mb-3"
              style={
                theme === themeItem.id
                  ? {
                      backgroundColor: colorMap[color] + '20',
                      borderWidth: 2,
                      borderColor: colorMap[color],
                    }
                  : {
                      backgroundColor: '#F3F4F6',
                      borderWidth: 2,
                      borderColor: 'transparent',
                    }
              }
            >
              <View className="flex-row items-center flex-1">
                <View
                  className="w-12 h-12 rounded-full items-center justify-center mr-3"
                  style={{
                    backgroundColor: theme === themeItem.id ? colorMap[color] : '#E5E7EB',
                  }}
                >
                  <Ionicons
                    name={themeItem.icon as any}
                    size={24}
                    color={theme === themeItem.id ? '#fff' : '#6B7280'}
                  />
                </View>
                <View className="flex-1">
                  <Text
                    className="text-base font-semibold"
                    style={{
                      color: theme === themeItem.id ? colorMap[color] : '#111827',
                    }}
                  >
                    {themeItem.title}
                  </Text>
                  <Text className="text-sm text-gray-600">{themeItem.description}</Text>
                </View>
              </View>

              <View
                className="w-6 h-6 rounded-full border-2 items-center justify-center"
                style={{
                  borderColor: theme === themeItem.id ? colorMap[color] : '#D1D5DB',
                }}
              >
                {theme === themeItem.id && (
                  <View
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: colorMap[color] }}
                  />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Color Scheme */}
        <View className="mb-8">
          <Text className="text-lg font-bold text-gray-900 mb-4">Accent Color</Text>
          <View className="flex-row flex-wrap">
            {colorSchemes.map((scheme) => (
              <TouchableOpacity
                key={scheme.id}
                onPress={() => setColor(scheme.id)}
                className="mr-4 mb-4 items-center"
              >
                <View
                  className="w-16 h-16 rounded-2xl items-center justify-center"
                  style={{
                    backgroundColor: scheme.color,
                    borderWidth: color === scheme.id ? 4 : 0,
                    borderColor: color === scheme.id ? '#D1D5DB' : 'transparent',
                  }}
                >
                  {color === scheme.id && <Ionicons name="checkmark" size={32} color="#fff" />}
                </View>
                <Text className="text-sm text-gray-700 mt-2 font-medium">{scheme.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Preview */}
        <View className="mb-8">
          <Text className="text-lg font-bold text-gray-900 mb-4">Preview</Text>
          <View className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-sm text-gray-600">Sample Card</Text>
                <Text className="text-xl font-bold text-gray-900">Preview Theme</Text>
              </View>
              <View
                className="w-12 h-12 rounded-full items-center justify-center"
                style={{ backgroundColor: colorMap[color] }}
              >
                <Ionicons name="star" size={24} color="#fff" />
              </View>
            </View>

            <View className="flex-row">
              <View
                className="flex-1 mr-2 py-3 rounded-lg items-center"
                style={{ backgroundColor: colorMap[color] }}
              >
                <Text className="text-white font-semibold">Primary</Text>
              </View>
              <View className="flex-1 ml-2 bg-gray-200 py-3 rounded-lg items-center">
                <Text className="text-gray-700 font-semibold">Secondary</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Additional Options */}
        <View className="mb-8 bg-gray-50 rounded-xl p-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-base text-gray-900">Large Text</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-base text-gray-900">Reduce Motion</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}