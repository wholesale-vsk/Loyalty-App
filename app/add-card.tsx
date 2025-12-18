
// import { View, Text, TouchableOpacity } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Ionicons } from '@expo/vector-icons';
// import { router } from 'expo-router';

// export default function AddCardScreen() {
//   return (
//     <SafeAreaView className="flex-1 bg-white px-6">
//       {/* Back Button */}
//       <View className="pt-4 pb-2">
//         <TouchableOpacity
//           onPress={() => router.replace('../(tabs)/index')}
//           className="w-10 h-10 items-center justify-center"
//         >
//           <Ionicons name="arrow-back" size={24} color="#000" />
//         </TouchableOpacity>
//       </View>
//       <View className="w-full mt-2">
//         <Text className="text-2xl font-bold mb-4">Add Card</Text>
//         <Text className="text-gray-600 text-center mb-8">
//           Here you can add a new loyalty or payment card.
//         </Text>
//         {/* Other Card Option */}
//         <TouchableOpacity
//           className="flex-row items-center justify-between w-full bg-gray-100 rounded-xl p-4 mb-4"
//           onPress={() => router.push('../../../add-new-card')}
//         >
//           <View className="flex-row items-center">
//             <Ionicons name="card-outline" size={28} color="#4F46E5" />
//             <Text className="ml-4 text-lg font-semibold text-gray-900">Other Card</Text>
//           </View>
//           <Ionicons name="chevron-forward-outline" size={24} color="#9CA3AF" />
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// }

import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function AddCardScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      {/* Back Button */}
      <View className="pt-4 pb-2">
        <TouchableOpacity
            onPress={() => router.push('../(tabs)')}
          className="w-10 h-10 items-center justify-center"
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View className="w-full mt-2">
        <Text className="text-2xl font-bold mb-4">Add Card</Text>
        <Text className="text-gray-600 text-center mb-8">
          Here you can add a new loyalty or payment card.
        </Text>

        {/* Other Card Option */}
        <TouchableOpacity
          className="flex-row items-center justify-between w-full bg-gray-100 rounded-xl p-4 mb-4"
          onPress={() => router.push('../add-new-card')}
        >
          <View className="flex-row items-center">
            <Ionicons name="card-outline" size={28} color="#4F46E5" />
            <Text className="ml-4 text-lg font-semibold text-gray-900">
              Other Card
            </Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={24} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
