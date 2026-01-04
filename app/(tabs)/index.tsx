import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { router } from "expo-router";
import { doc, getDoc, getDocFromCache } from "firebase/firestore";
import { auth } from "../../firebaseConfig";
import { db } from "../../lib/firestore";
import { useTheme } from '../../contexts/ThemeContext';

// ...existing code...

const colorMap: Record<string, string> = {
  blue: '#3B82F6',
  purple: '#4F46E5',
  green: '#10B981',
  orange: '#F59E0B',
};

export default function HomeScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('All Offers');
  const { color } = useTheme();

  const offers = [
    {
      id: 1,
      title: '25% Off Your Next Purchase',
      description: 'Enjoy a special discount on all premium items',
      expiresIn: '2 Days',
      image: '🏪',
    },
    {
      id: 2,
      title: 'Free Coffee with Any Pastry',
      description: 'Your daily treat just got better!',
      expiresIn: '5 Days',
      image: '☕',
    },
    {
      id: 3,
      title: 'Free Shipping on All Orders',
      description: 'Get your favorites delivered to your door',
      expiresIn: '3 Days',
      image: '📦',
    },
  ];

  const activities = [
    {
      id: 1,
      title: 'Reward Redeemed: Free Coffee',
      description: 'December 20, 2023',
      points: '+50 pts',
    },
    {
      id: 2,
      title: 'Points Earned: In-Store Purchase',
      description: 'December 18, 2023',
      points: '+50 pts',
    },
    {
      id: 3,
      title: 'Points Earned: Welcome Bonus',
      description: 'December 15, 2023',
      points: '+50 pts',
    },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!auth.currentUser) return;
        const userRef = doc(db, "users", auth.currentUser.uid);
        let docSnap = null as any;
        try {
          docSnap = await getDoc(userRef);
        } catch (readErr) {
          console.warn('getDoc failed, attempting cache fallback', readErr);
          try {
            docSnap = await getDocFromCache(userRef);
          } catch (cacheErr) {
            console.warn('getDocFromCache also failed', cacheErr);
            throw readErr;
          }
        }

        if (docSnap && docSnap.exists()) {
          setProfile(docSnap.data());
        }
      } catch (e) {
        console.warn('Failed to fetch profile', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color={colorMap[color] || '#3B82F6'} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header + Points Card - render only when profile is available */}
        {profile && (
          <View className="px-6 pt-4 pb-6">
            <View className="flex-row items-center justify-between mb-6">
              <View>
                <Text className="text-sm text-gray-600">Hello,</Text>
                <Text className="text-2xl font-bold text-gray-900">
                  {profile.username}
                </Text>
              </View>
              <TouchableOpacity
                className="w-10 h-10 bg-primary rounded-full items-center justify-center"
                onPress={() => router.push('../add-card')}
              >
                <Ionicons name="add" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View
              className="rounded-2xl p-6 mb-6 shadow-lg"
              style={{ backgroundColor: colorMap[color] }}
            >
              <View className="flex-row items-center justify-between mb-4">
                <View>
                  <Text className="text-white text-sm opacity-80">
                    {profile.membershipType}
                  </Text>
                  <Text className="text-white text-3xl font-bold mt-1">
                    {`${profile.firstName} ${profile.lastName}`}
                  </Text>
                </View>
                <View className="w-16 h-16 bg-white rounded-xl items-center justify-center">
                  <Ionicons name="card" size={32} color={colorMap[color]} />
                </View>
              </View>

              <View className="border-t border-white/30 pt-4">
                <Text className="text-white text-sm opacity-80">Available Points</Text>
                <Text className="text-white text-2xl font-bold mt-1">
                  {profile.points}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Tabs */}
        <View className="flex-row px-6 mb-4">
          {['All Offers', 'Activity'].map(tab => (
            <TouchableOpacity
              key={tab}
              className={`flex-1 py-2 rounded-lg ${selectedTab === tab ? '' : 'bg-gray-100'}`}
              style={selectedTab === tab ? { backgroundColor: colorMap[color] } : {}}
              onPress={() => setSelectedTab(tab)}
            >
              <Text
                className={`text-center font-semibold ${selectedTab === tab ? 'text-white' : 'text-gray-600'}`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View className="px-6">
          {selectedTab === 'All Offers' ? (
            offers.map(offer => (
              <View key={offer.id} className="bg-gray-50 rounded-xl p-4 mb-4 flex-row items-center">
                <Text className="text-3xl mr-4">{offer.image}</Text>
                <View className="flex-1">
                  <Text className="font-bold text-lg text-gray-900">{offer.title}</Text>
                  <Text className="text-gray-600">{offer.description}</Text>
                  <Text
                    className="text-xs mt-1"
                    style={{ color: colorMap[color] }}
                  >
                    Expires in {offer.expiresIn}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            activities.map(activity => (
              <View key={activity.id} className="bg-gray-50 rounded-xl p-4 mb-4 flex-row items-center">
                <View className="flex-1">
                  <Text className="font-bold text-lg text-gray-900">{activity.title}</Text>
                  <Text className="text-gray-600">{activity.description}</Text>
                </View>
                <Text
                  className="font-bold ml-4"
                  style={{ color: colorMap[color] }}
                >
                  {activity.points}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}