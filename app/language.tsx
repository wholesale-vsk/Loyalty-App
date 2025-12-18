import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import Header from '../components/Header';
import { useTheme } from '../contexts/ThemeContext';

const colorMap: Record<string, string> = {
  blue: '#3B82F6',
  purple: '#4F46E5',
  green: '#10B981',
  orange: '#F59E0B',
};

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export default function LanguageScreen() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [searchQuery, setSearchQuery] = useState('');
  const { color } = useTheme();

  const languages: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
    { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
    { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  ];

  const filteredLanguages = languages.filter(
    lang =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Language" showBack={true} />

      <View className="flex-1">
        {/* Search Bar */}
        <View className="px-6 mb-4">
          <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
            <Ionicons name="search-outline" size={20} color="#9CA3AF" />
            <TextInput
              placeholder="Search languages..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 ml-3 text-base"
              placeholderTextColor="#9CA3AF"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Language List */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-6">
            <Text className="text-sm text-gray-600 mb-3">
              {filteredLanguages.length} languages available
            </Text>

            {filteredLanguages.map(language => (
              <TouchableOpacity
                key={language.code}
                onPress={() => setSelectedLanguage(language.code)}
                className="flex-row items-center justify-between p-4 rounded-xl mb-2"
                style={
                  selectedLanguage === language.code
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
                  <Text className="text-3xl mr-3">{language.flag}</Text>
                  <View className="flex-1">
                    <Text
                      className="text-base font-semibold"
                      style={{
                        color: selectedLanguage === language.code ? colorMap[color] : '#111827',
                      }}
                    >
                      {language.name}
                    </Text>
                    <Text className="text-sm text-gray-600">{language.nativeName}</Text>
                  </View>
                </View>

                {selectedLanguage === language.code && (
                  <View
                    className="w-6 h-6 rounded-full border-2 items-center justify-center"
                    style={{ borderColor: colorMap[color] }}
                  >
                    <View className="w-3 h-3 rounded-full" style={{ backgroundColor: colorMap[color] }} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Info */}
        <View className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <View className="flex-row items-start">
            <Ionicons name="information-circle-outline" size={20} color="#6B7280" />
            <Text className="flex-1 text-xs text-gray-600 ml-2">
              Changing the language will update the app interface. Some content may still appear in the original language.
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}