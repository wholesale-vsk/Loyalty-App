import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import Button from '../components/Button';
import { useTheme } from '../contexts/ThemeContext';

export default function PaymentScreen() {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const { color } = useTheme();

  const colorMap: Record<string, string> = {
    blue: '#3B82F6',
    purple: '#4F46E5',
    green: '#10B981',
    orange: '#F59E0B',
  };

  const paymentMethods = [
    { id: 'card', title: 'Credit/Debit Card', icon: 'card-outline' },
    { id: 'apple', title: 'Apple Pay', icon: 'logo-apple' },
    { id: 'google', title: 'Google Pay', icon: 'logo-google' },
  ];

  const handlePayment = async () => {
    setLoading(true);

    // TODO: Add real payment processing
    setTimeout(() => {
      setLoading(false);
      router.push('../(tabs)/payment-success');
    }, 2000);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <View className="flex-row items-center mb-6">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center mr-3"
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>

            <Text className="text-2xl font-bold text-gray-900">Payment</Text>
          </View>

          <Text className="text-base text-gray-600">
            Complete your gold membership
          </Text>
        </View>

        {/* Order Summary */}
        <View className="px-6 mb-6">
          <View className="bg-gray-50 rounded-2xl p-4">
            <Text className="text-lg font-bold text-gray-900 mb-3">
              Order Summary
            </Text>

            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Gold Membership</Text>
              <Text className="text-gray-900 font-semibold">$99</Text>
            </View>

            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Validity</Text>
              <Text className="text-gray-900 font-semibold">1 Year</Text>
            </View>

            <View className="border-t border-gray-200 my-3" />

            <View className="flex-row justify-between">
              <Text className="text-lg font-bold text-gray-900">Total</Text>
              <Text className="text-lg font-bold" style={{ color: colorMap[color] }}>$99</Text>
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">
            Payment Method
          </Text>

          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              onPress={() => setSelectedMethod(method.id)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 16,
                borderRadius: 16,
                marginBottom: 8,
                backgroundColor: selectedMethod === method.id ? colorMap[color] + '20' : '#F3F4F6',
                borderWidth: 2,
                borderColor: selectedMethod === method.id ? colorMap[color] : 'transparent',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 9999,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                    backgroundColor: selectedMethod === method.id ? colorMap[color] : '#E5E7EB',
                  }}
                >
                  <Ionicons 
                    name={method.icon as any} 
                    size={20} 
                    color={selectedMethod === method.id ? '#fff' : '#6B7280'}
                  />
                </View>

                <Text
                  style={{
                    fontWeight: '500',
                    color: selectedMethod === method.id ? colorMap[color] : '#111827',
                  }}
                >
                  {method.title}
                </Text>
              </View>

              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 9999,
                  borderWidth: 2,
                  borderColor: selectedMethod === method.id ? colorMap[color] : '#D1D5DB',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {selectedMethod === method.id && (
                  <View style={{
                    width: 12,
                    height: 12,
                    borderRadius: 9999,
                    backgroundColor: colorMap[color],
                  }} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Card Details */}
        {selectedMethod === 'card' && (
          <View className="px-6 mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-3">
              Card Details
            </Text>

            <View className="mb-4">
              <Text className="text-sm text-gray-600 mb-2">Card Number</Text>
              <TextInput
                value={cardNumber}
                onChangeText={setCardNumber}
                placeholder="1234 5678 9012 3456"
                keyboardType="numeric"
                maxLength={19}
                className="bg-gray-50 rounded-xl px-4 py-3 text-base border border-gray-200"
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm text-gray-600 mb-2">Cardholder Name</Text>
              <TextInput
                value={cardHolder}
                onChangeText={setCardHolder}
                placeholder="John Doe"
                className="bg-gray-50 rounded-xl px-4 py-3 text-base border border-gray-200"
              />
            </View>

            <View className="flex-row space-x-4">
              <View className="flex-1">
                <Text className="text-sm text-gray-600 mb-2">Expiry Date</Text>
                <TextInput
                  value={expiryDate}
                  onChangeText={setExpiryDate}
                  placeholder="MM/YY"
                  keyboardType="numeric"
                  maxLength={5}
                  className="bg-gray-50 rounded-xl px-4 py-3 text-base border border-gray-200"
                />
              </View>

              <View className="flex-1">
                <Text className="text-sm text-gray-600 mb-2">CVV</Text>
                <TextInput
                  value={cvv}
                  onChangeText={setCvv}
                  placeholder="123"
                  keyboardType="numeric"
                  maxLength={3}
                  secureTextEntry
                  className="bg-gray-50 rounded-xl px-4 py-3 text-base border border-gray-200"
                />
              </View>
            </View>
          </View>
        )}

        {/* Pay Button */}
        <View className="px-6 pb-8">
          <Button
            title="Pay $99"
            onPress={handlePayment}
            loading={loading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}