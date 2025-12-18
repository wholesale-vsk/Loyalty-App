import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { doc, updateDoc } from "firebase/firestore";
import { auth } from "../../firebaseConfig";
import { db } from "../../lib/firestore";
import { useTheme } from '../../contexts/ThemeContext';

const colorMap: Record<string, string> = {
  blue: '#3B82F6',
  purple: '#4F46E5',
  green: '#10B981',
  orange: '#F59E0B',
};

export default function MembershipScreen() {
  const [selectedPlan, setSelectedPlan] = useState('Gold');
  const [saving, setSaving] = useState(false);
  const { color } = useTheme();

  const plans = [
    {
      name: 'Silver',
      price: 49,
      period: 'month',
      benefits: [
        '5% discount on all purchases',
        'Early access to sales',
        'Birthday offers',
      ],
      points: 5000,
    },
    {
      name: 'Gold',
      price: 99,
      period: 'year',
      benefits: [
        '10% discount on all purchases',
        'Priority access to sales',
        'Birthday & anniversary offers',
        'Free home delivery',
        'Priority customer support',
      ],
      popular: true,
      points: 10000,
    },
    {
      name: 'Platinum',
      price: 199,
      period: 'year',
      benefits: [
        '15% discount on all purchases',
        'Exclusive early access',
        'Birthday & anniversary offers',
        'Free home delivery',
        'Priority customer support',
        'Exclusive events access',
      ],
      points: 20000,
    },
  ];

  const handleSelectPlan = async () => {
    setSaving(true);
    try {
      const plan = plans.find(p => p.name === selectedPlan);
      if (!auth.currentUser || !plan) {
        Alert.alert("Error", "No user or plan selected.");
        setSaving(false);
        return;
      }
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        membershipType: plan.name,
        points: plan.points,
      });
      router.replace("../(tabs)");
    } catch (error) {
      Alert.alert("Error", "Failed to save membership. Please try again.");
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-4 pb-6">
          <View className="flex-row items-center mb-6">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center mr-3"
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-gray-900">
              Membership
            </Text>
          </View>

          {/* Plan Selector */}
          <View className="flex-row bg-gray-100 rounded-xl p-1 mb-6">
            {['Silver', 'Gold', 'Platinum'].map((plan) => (
              <TouchableOpacity
                key={plan}
                onPress={() => setSelectedPlan(plan)}
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  borderRadius: 8,
                  backgroundColor: selectedPlan === plan ? colorMap[color] : 'transparent',
                }}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: '600',
                    color: selectedPlan === plan ? '#fff' : '#4B5563',
                  }}
                >
                  {plan}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Plans */}
        <View className="px-6">
          {plans
            .filter((p) => p.name === selectedPlan)
            .map((plan) => (
              <View key={plan.name}>
                {/* Price Card */}
                <View
                  style={{
                    borderRadius: 18,
                    padding: 24,
                    marginBottom: 24,
                    backgroundColor: colorMap[color],
                    shadowColor: colorMap[color],
                    shadowOpacity: 0.15,
                    shadowRadius: 12,
                    shadowOffset: { width: 0, height: 6 },
                  }}
                >
                  <View className="flex-row items-center justify-between mb-4">
                    <View>
                      <Text style={{ color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 4 }}>
                        {plan.name} Plan
                      </Text>
                      {/* Popular Badge */}
                      {plan.popular && (
                        <View style={{ backgroundColor: '#F59E0B', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 9999, alignSelf: 'flex-start', marginTop: 4 }}>
                          <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>
                            ⭐ Most Popular
                          </Text>
                        </View>
                      )}
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <Text style={{ color: '#fff', fontSize: 32, fontWeight: 'bold' }}>
                        ${plan.price}
                      </Text>
                      <Text style={{ color: '#fff', opacity: 0.8, fontSize: 14 }}>
                        /{plan.period}
                      </Text>
                    </View>
                  </View>
                  <Text style={{ color: '#fff', opacity: 0.9 }}>
                    Enjoy exclusive {plan.name.toLowerCase()} member perks
                  </Text>
                </View>

                {/* Benefits */}
                <View className="mb-6">
                  <Text className="text-xl font-bold text-gray-900 mb-4">
                    Benefits
                  </Text>
                  {plan.benefits.map((benefit, index) => (
                    <View
                      key={index}
                      className="flex-row items-center bg-gray-50 rounded-xl p-4 mb-3"
                    >
                      <View
                        style={{
                          width: 24,
                          height: 24,
                          backgroundColor: colorMap[color],
                          borderRadius: 9999,
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: 12,
                        }}
                      >
                        <Ionicons name="checkmark" size={16} color="#fff" />
                      </View>
                      <Text className="flex-1 text-gray-800">{benefit}</Text>
                    </View>
                  ))}
                </View>

                {/* Select Plan Button */}
                <TouchableOpacity
                  onPress={handleSelectPlan}
                  style={{
                    backgroundColor: colorMap[color],
                    paddingVertical: 16,
                    borderRadius: 12,
                    alignItems: 'center',
                    marginBottom: 24,
                    opacity: saving ? 0.7 : 1,
                  }}
                  disabled={saving}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                    {saving ? "Saving..." : "Select Plan"}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}

          {/* Comparison Note */}
          <View style={{ backgroundColor: colorMap['blue'] + '20', borderRadius: 12, padding: 16, marginBottom: 24 }}>
            <Text style={{ color: '#374151', textAlign: 'center' }}>
              💡 Compare all plans to find the best fit for you
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}