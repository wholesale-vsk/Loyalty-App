import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import Header from '../components/Header';
import Button from '../components/Button';
import { useTheme } from '../contexts/ThemeContext';

const colorMap: Record<string, string> = {
  blue: '#3B82F6',
  purple: '#4F46E5',
  green: '#10B981',
  orange: '#F59E0B',
};

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple' | 'google';
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  email?: string;
  isDefault: boolean;
}

export default function PaymentMethodsScreen() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      cardNumber: '**** **** **** 4242',
      cardHolder: 'Jane Doe',
      expiryDate: '12/25',
      isDefault: true,
    },
    {
      id: '2',
      type: 'card',
      cardNumber: '**** **** **** 5555',
      cardHolder: 'Jane Doe',
      expiryDate: '08/26',
      isDefault: false,
    },
    {
      id: '3',
      type: 'paypal',
      email: 'jane.doe@example.com',
      isDefault: false,
    },
  ]);
  const { color } = useTheme();

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'card':
        return 'card-outline';
      case 'paypal':
        return 'logo-paypal';
      case 'apple':
        return 'logo-apple';
      case 'google':
        return 'logo-google';
      default:
        return 'card-outline';
    }
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods((methods) =>
      methods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  const handleDeleteMethod = (id: string) => {
    Alert.alert(
      'Delete Payment Method',
      'Are you sure you want to remove this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setPaymentMethods((methods) => methods.filter((m) => m.id !== id));
          },
        },
      ]
    );
  };

  const handleAddPaymentMethod = () => {
    router.push('../payment');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Payment Methods" showBack={true} />

      <ScrollView className="px-4 mt-4">
        {/* Info Card */}
        <View className="bg-gray-100 p-4 rounded-lg mb-6">
          <Text className="text-gray-700">
            Your payment information is encrypted and secure. We never store your full card details.
          </Text>
        </View>

        {/* Payment Methods List */}
        <Text className="text-gray-700 font-semibold mb-2">Saved Payment Methods</Text>
        {paymentMethods.map((method) => (
          <View
            key={method.id}
            className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4"
          >
            <View className="flex-row justify-between items-center">
              <View>
                <View className="flex-row items-center mb-1">
                  <Ionicons name={getPaymentIcon(method.type)} size={20} color={colorMap[color]} style={{ marginRight: 8 }} />
                  {method.type === 'card' ? (
                    <Text className="font-semibold">{method.cardNumber}</Text>
                  ) : (
                    <Text className="font-semibold">{method.email}</Text>
                  )}
                </View>
                {method.type === 'card' && (
                  <Text className="text-gray-500">Expires {method.expiryDate}</Text>
                )}
              </View>

              {/* Actions */}
              <View className="flex-row items-center space-x-2">
                {method.isDefault ? (
                  <Text style={{ color: colorMap.green }} className="font-semibold">Default</Text>
                ) : (
                  <TouchableOpacity
                    onPress={() => handleSetDefault(method.id)}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 4,
                      borderWidth: 1,
                      borderColor: colorMap[color],
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ color: colorMap[color], fontSize: 14 }}>Set as Default</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => handleDeleteMethod(method.id)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    borderWidth: 1,
                    borderColor: '#F87171',
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ color: '#EF4444', fontSize: 14 }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {/* Add New Payment Method */}
        <View style={{
          backgroundColor: colorMap[color] + '20',
          borderColor: colorMap[color],
          borderWidth: 1,
          borderRadius: 12,
          padding: 16,
          marginBottom: 24,
        }}>
          <Text style={{ color: colorMap[color], fontWeight: 'bold', marginBottom: 4 }}>Add New Payment Method</Text>
          <Text style={{ color: colorMap[color], fontSize: 14, marginBottom: 8 }}>
            Credit/Debit Card, PayPal, or Digital Wallet
          </Text>
          <Button title="Add Payment Method" onPress={handleAddPaymentMethod} />
        </View>

        {/* Security Notice */}
        <View className="bg-gray-100 p-4 rounded-lg mb-6">
          <Text className="font-semibold mb-1">Secure Payment Processing</Text>
          <Text className="text-gray-700 text-sm">
            All transactions are processed through secure, PCI-compliant payment gateways.
            Your financial information is never stored on our servers.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}