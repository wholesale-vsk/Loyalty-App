import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { useTheme } from '../contexts/ThemeContext';

const colorMap: Record<string, string> = {
  blue: '#3B82F6',
  purple: '#4F46E5',
  green: '#10B981',
  orange: '#F59E0B',
};

export default function TermsScreen() {
  const { color } = useTheme();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Terms of Service" showBack={true} />

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <Text className="text-sm text-gray-600 mb-6">
          Last Updated: December 10, 2024
        </Text>

        {/* 1. Agreement */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">1. Agreement to Terms</Text>
          <Text className="text-base text-gray-700 leading-6">
            By accessing and using Loyalty App, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree, you should not use the app.
          </Text>
        </View>

        {/* 2. Use of the App */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">2. Use of the App</Text>
          <Text className="text-base text-gray-700 leading-6">
            You agree to use the app only for lawful purposes and in accordance with these Terms. You must not use the app in any way that could damage, disable, or impair the app or interfere with any other party's use of it.
          </Text>
        </View>

        {/* 3. Account Responsibilities */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">3. Account Responsibilities</Text>
          <Text className="text-base text-gray-700 leading-6">
            You are responsible for maintaining the confidentiality of your account credentials. Any activity under your account is your responsibility. Notify us immediately if you suspect unauthorized use of your account.
          </Text>
        </View>

        {/* 4. Payments and Memberships */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">4. Payments and Memberships</Text>
          <Text className="text-base text-gray-700 leading-6">
            All payments for memberships, subscriptions, or in-app purchases must be made using valid payment methods. Refunds and cancellations are subject to our refund policy.
          </Text>
        </View>

        {/* 5. Content Ownership */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">5. Content Ownership</Text>
          <Text className="text-base text-gray-700 leading-6">
            All content provided through the app, including text, graphics, logos, and software, is the property of Loyalty App or its content providers and is protected by intellectual property laws.
          </Text>
        </View>

        {/* 6. Termination */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">6. Termination</Text>
          <Text className="text-base text-gray-700 leading-6">
            We may suspend or terminate your account at any time for violation of these Terms or any applicable laws. You may also terminate your account at any time via the app.
          </Text>
        </View>

        {/* 7. Limitation of Liability */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">7. Limitation of Liability</Text>
          <Text className="text-base text-gray-700 leading-6">
            To the fullest extent permitted by law, Loyalty App shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the app.
          </Text>
        </View>

        {/* 8. Governing Law */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">8. Governing Law</Text>
          <Text className="text-base text-gray-700 leading-6">
            These Terms are governed by the laws of the jurisdiction in which the app operates, without regard to its conflict of law principles.
          </Text>
        </View>

        {/* 9. Changes to Terms */}
        <View className="mb-8">
          <Text className="text-lg font-bold text-gray-900 mb-3">9. Changes to Terms</Text>
          <Text className="text-base text-gray-700 leading-6">
            We may update these Terms of Service periodically. Continued use of the app constitutes acceptance of any changes. We will notify users of significant updates.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}