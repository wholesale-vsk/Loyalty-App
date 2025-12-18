import { View, Text, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

export default function LocationScreen() {
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [preciseLocation, setPreciseLocation] = useState(true);
  const [backgroundLocation, setBackgroundLocation] = useState(false);
  const [nearbyOffers, setNearbyOffers] = useState(true);
  const { color } = useTheme();

  const handleLocationToggle = (value: boolean) => {
    if (!value) {
      Alert.alert(
        'Disable Location Services',
        "Some features like nearby offers and store locator won't work without location access.",
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Disable',
            style: 'destructive',
            onPress: () => {
              setLocationEnabled(false);
              setPreciseLocation(false);
              setBackgroundLocation(false);
              setNearbyOffers(false);
            },
          },
        ]
      );
    } else {
      setLocationEnabled(true);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Location Services" showBack={true} />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6">
          {/* Main Toggle */}
          <View className="bg-gray-50 rounded-2xl p-4 mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-1 mr-4">
                <Text className="text-base font-semibold text-gray-900 mb-1">
                  Location Services
                </Text>
                <Text className="text-sm text-gray-600">
                  Allow app to access your location
                </Text>
              </View>
              <Switch
                value={locationEnabled}
                onValueChange={handleLocationToggle}
                trackColor={{ false: '#D1D5DB', true: colorMap[color] }}
                thumbColor="#fff"
              />
            </View>
          </View>

          {/* Current Location */}
          {locationEnabled && (
            <View
              className="rounded-2xl p-4 mb-6"
              style={{
                backgroundColor: colorMap[color] + '10',
                borderColor: colorMap[color] + '40',
                borderWidth: 1,
              }}
            >
              <View className="flex-row items-center mb-3">
                <View
                  className="w-12 h-12 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: colorMap[color] }}
                >
                  <Ionicons name="location" size={24} color="#fff" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm text-gray-600 mb-1">Current Location</Text>
                  <Text className="text-base font-semibold text-gray-900">
                    New York, NY
                  </Text>
                  <Text className="text-sm text-gray-600">Accuracy: 10 meters</Text>
                </View>
              </View>
              <Button
                title="Update Location"
                onPress={() => Alert.alert('Location Updated')}
              />
            </View>
          )}

          {/* Permission Settings */}
          {locationEnabled && (
            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-900 mb-4">
                Permission Settings
              </Text>

              {[
                { label: 'Precise Location', desc: 'Share your exact location', value: preciseLocation, setter: setPreciseLocation },
                { label: 'Background Location', desc: 'Allow when app is in background', value: backgroundLocation, setter: setBackgroundLocation },
                { label: 'Nearby Offers', desc: 'Get notified of nearby deals', value: nearbyOffers, setter: setNearbyOffers },
              ].map((setting, idx) => (
                <View key={idx} className="bg-gray-50 rounded-xl p-4 mb-3">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1 mr-4">
                      <Text className="text-base font-medium text-gray-900 mb-1">{setting.label}</Text>
                      <Text className="text-sm text-gray-600">{setting.desc}</Text>
                    </View>
                    <Switch
                      value={setting.value}
                      onValueChange={setting.setter}
                      trackColor={{ false: '#D1D5DB', true: colorMap[color] }}
                      thumbColor="#fff"
                    />
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* How We Use Location */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              How We Use Your Location
            </Text>

            {[
              { icon: 'storefront-outline', title: 'Find Nearby Stores', desc: 'Locate stores and check-in locations near you' },
              { icon: 'pricetag-outline', title: 'Local Offers', desc: 'Show relevant deals based on your location' },
              { icon: 'stats-chart-outline', title: 'Personalized Experience', desc: 'Customize content based on your region' },
            ].map((item, idx) => (
              <View key={idx} className="flex-row items-start bg-gray-50 rounded-xl p-4 mb-3">
                <Ionicons name={item.icon as any} size={24} color={colorMap[color]} />
                <View className="flex-1 ml-3">
                  <Text className="text-base font-semibold text-gray-900 mb-1">{item.title}</Text>
                  <Text className="text-sm text-gray-600">{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Privacy Notice */}
          <View
            className="rounded-xl p-4 mb-8"
            style={{ backgroundColor: colorMap['blue'] + '20' }}
          >
            <View className="flex-row items-start">
              <Ionicons name="shield-checkmark" size={20} color={colorMap['blue']} />
              <View className="flex-1 ml-3">
                <Text className="text-sm font-semibold text-gray-900 mb-1">Your Privacy Matters</Text>
                <Text className="text-xs text-gray-600">
                  Your location data is encrypted and never shared with third parties without your consent. You can disable location services anytime.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}