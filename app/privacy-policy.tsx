import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { useTheme } from '../contexts/ThemeContext';

export default function PrivacyPolicyScreen() {
  const { color } = useTheme();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Privacy Policy" showBack={true} />

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <Text className="text-sm text-gray-600 mb-6">
          Last Updated: December 10, 2024
        </Text>

        {/* Introduction */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">Introduction</Text>
          <Text className="text-base text-gray-700 leading-6">
            Welcome to Loyalty App. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data and tell you about your privacy rights.
          </Text>
        </View>

        {/* Information We Collect */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">Information We Collect</Text>
          
          <Text className="text-base font-semibold text-gray-900 mb-2">Personal Information:</Text>
          <Text className="text-base text-gray-700 leading-6 mb-3">
            • Name, email address, and phone number{'\n'}
            • Payment and billing information{'\n'}
            • Date of birth and demographic information{'\n'}
            • Address and location data
          </Text>

          <Text className="text-base font-semibold text-gray-900 mb-2">Usage Data:</Text>
          <Text className="text-base text-gray-700 leading-6">
            • App usage patterns and preferences{'\n'}
            • Transaction history and purchases{'\n'}
            • Device information and IP address{'\n'}
            • Cookies and similar tracking technologies
          </Text>
        </View>

        {/* How We Use Your Information */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">How We Use Your Information</Text>
          <Text className="text-base text-gray-700 leading-6">
            We use your personal data to:{'\n\n'}
            • Provide and maintain our services{'\n'}
            • Process your transactions and manage your membership{'\n'}
            • Send you updates, offers, and promotional materials{'\n'}
            • Improve our app and develop new features{'\n'}
            • Detect and prevent fraud and abuse{'\n'}
            • Comply with legal obligations
          </Text>
        </View>

        {/* Data Sharing */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">Data Sharing</Text>
          <Text className="text-base text-gray-700 leading-6">
            We do not sell your personal information. We may share your data with:{'\n\n'}
            • Service providers who assist our operations{'\n'}
            • Payment processors for transaction processing{'\n'}
            • Analytics partners to improve our services{'\n'}
            • Legal authorities when required by law
          </Text>
        </View>

        {/* Data Security */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">Data Security</Text>
          <Text className="text-base text-gray-700 leading-6">
            We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security audits.
          </Text>
        </View>

        {/* Your Rights */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">Your Rights</Text>
          <Text className="text-base text-gray-700 leading-6">
            You have the right to:{'\n\n'}
            • Access your personal data{'\n'}
            • Correct inaccurate data{'\n'}
            • Request deletion of your data{'\n'}
            • Object to processing of your data{'\n'}
            • Export your data{'\n'}
            • Withdraw consent at any time
          </Text>
        </View>

        {/* Cookies */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">Cookies and Tracking</Text>
          <Text className="text-base text-gray-700 leading-6">
            We use cookies and similar tracking technologies to track activity on our app and hold certain information. You can instruct your device to refuse all cookies or to indicate when a cookie is being sent.
          </Text>
        </View>

        {/* Children's Privacy */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">Children's Privacy</Text>
          <Text className="text-base text-gray-700 leading-6">
            Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal data, please contact us.
          </Text>
        </View>

        {/* Changes to Policy */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">Changes to This Policy</Text>
          <Text className="text-base text-gray-700 leading-6">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </Text>
        </View>

        {/* Contact */}
        <View className="mb-8">
          <Text className="text-lg font-bold text-gray-900 mb-3">Contact Us</Text>
          <Text className="text-base text-gray-700 leading-6">
            If you have any questions about this Privacy Policy, please contact us:{'\n\n'}
            <Text style={{ color: color ? colorMap[color] : '#3B82F6', fontWeight: 'bold' }}>
              Email: privacy@loyaltyapp.com{'\n'}
              Phone: +1 (800) 123-4567{'\n'}
              Address: 123 Privacy Street, San Francisco, CA 94105
            </Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const colorMap: Record<string, string> = {
  blue: '#3B82F6',
  purple: '#4F46E5',
  green: '#10B981',
  orange: '#F59E0B',
};