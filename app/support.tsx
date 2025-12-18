import { View, Text, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import Header from '../components/Header';
import { useTheme } from '../contexts/ThemeContext';

interface FAQ { id: string; question: string; answer: string; }

const colorMap: Record<string, string> = {
  blue: '#3B82F6',
  purple: '#4F46E5',
  green: '#10B981',
  orange: '#F59E0B',
};

export default function SupportScreen() {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const { color } = useTheme();

  const faqs: FAQ[] = [
    { id: '1', question: 'How do I redeem my points?', answer: 'Navigate to Offers and select any reward. Points deducted automatically.' },
    { id: '2', question: 'How do I upgrade my membership?', answer: 'Go to Membership tab, choose tier, follow payment steps.' },
    { id: '3', question: 'Can I cancel my membership anytime?', answer: 'Yes, via Settings > Manage Membership. Access remains until billing ends.' },
    { id: '4', question: 'How do I earn more points?', answer: 'Make purchases, refer friends, complete challenges, engage with offers.' },
    { id: '5', question: 'What happens to my points if I cancel?', answer: 'Points remain for 12 months. Reactivate anytime to continue using.' },
  ];

  const contactOptions = [
    { id: 'email', title: 'Email Support', subtitle: 'support@loyaltyapp.com', icon: 'mail-outline', action: () => Linking.openURL('mailto:support@loyaltyapp.com') },
    { id: 'phone', title: 'Phone Support', subtitle: '+1 (800) 123-4567', icon: 'call-outline', action: () => Linking.openURL('tel:+18001234567') },
    { id: 'chat', title: 'Live Chat', subtitle: 'Average wait: 2 min', icon: 'chatbubbles-outline', action: () => Alert.alert('Live Chat', 'Opening chat window...') },
    { id: 'twitter', title: 'Twitter Support', subtitle: '@LoyaltyAppHelp', icon: 'logo-twitter', action: () => Linking.openURL('https://twitter.com/LoyaltyAppHelp') },
  ];

  const toggleFAQ = (id: string) => setExpandedFAQ(expandedFAQ === id ? null : id);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Help & Support" showBack={true} />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6">
          {/* Contact Options */}
          <Text className="text-lg font-bold text-gray-900 mb-4">Contact Us</Text>
          <View className="mb-6">
            {contactOptions.map(option => (
              <TouchableOpacity key={option.id} onPress={option.action} className="flex-row items-center bg-gray-50 rounded-xl p-4 mb-3">
                <View className="w-12 h-12 rounded-full items-center justify-center mr-3" style={{ backgroundColor: colorMap[color] + '10' }}>
                  <Ionicons name={option.icon as any} size={24} color={colorMap[color]} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-gray-900">{option.title}</Text>
                  <Text className="text-sm text-gray-600">{option.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>

          {/* FAQ Section */}
          <Text className="text-lg font-bold text-gray-900 mb-4">Frequently Asked Questions</Text>
          <View className="mb-6">
            {faqs.map(faq => (
              <View key={faq.id} className="mb-3">
                <TouchableOpacity onPress={() => toggleFAQ(faq.id)} className="bg-gray-50 rounded-xl p-4">
                  <View className="flex-row items-center justify-between">
                    <Text className="flex-1 text-base font-semibold text-gray-900 mr-3">{faq.question}</Text>
                    <Ionicons name={expandedFAQ === faq.id ? 'chevron-up' : 'chevron-down'} size={20} color={colorMap[color]} />
                  </View>
                  {expandedFAQ === faq.id && (
                    <Text className="text-sm text-gray-600 mt-3 leading-5">{faq.answer}</Text>
                  )}
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Hours */}
          <View className="rounded-xl p-4 mb-6 border" style={{ backgroundColor: colorMap[color] + '10', borderColor: colorMap[color] + '40', borderWidth: 1 }}>
            <View className="flex-row items-start">
              <Ionicons name="time-outline" size={24} color={colorMap[color]} />
              <View className="flex-1 ml-3">
                <Text className="text-base font-semibold text-gray-900 mb-2">Support Hours</Text>
                <Text className="text-sm text-gray-600 mb-1">Mon - Fri: 9:00 AM - 8:00 PM EST</Text>
                <Text className="text-sm text-gray-600 mb-1">Sat: 10:00 AM - 6:00 PM EST</Text>
                <Text className="text-sm text-gray-600">Sun: 10:00 AM - 4:00 PM EST</Text>
              </View>
            </View>
          </View>

          {/* App Version */}
          <View className="items-center pb-8">
            <Text className="text-sm text-gray-500 mb-1">Loyalty App</Text>
            <Text className="text-xs text-gray-400">Version 1.0.0 (Build 100)</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}