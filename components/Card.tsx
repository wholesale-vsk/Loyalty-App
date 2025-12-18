import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onPress?: () => void;
}

/* ================================
    BASIC CARD WRAPPER
================================ */
export default function Card({ children, className = "", onPress }: CardProps) {
  const Component: any = onPress ? TouchableOpacity : View;

  return (
    <Component className={`rounded-xl bg-white p-4 shadow ${className}`} onPress={onPress}>
      {children}
    </Component>
  );
}

/* ================================
    OFFER CARD
================================ */
interface OfferCardProps {
  title: string;
  description: string;
  expiresIn: string;
  image: string;
  onRedeem?: () => void;
}

export function OfferCard({ title, description, expiresIn, image, onRedeem }: OfferCardProps) {
  return (
    <View className="rounded-2xl bg-white p-4 shadow mb-4">
      <Image
        source={{ uri: image }}
        className="w-full h-40 rounded-xl mb-3"
        resizeMode="cover"
      />

      <Text className="text-lg font-semibold">{title}</Text>
      <Text className="text-gray-600 mt-1">{description}</Text>

      <View className="flex-row items-center justify-between mt-3">
        <Text className="text-gray-500">Expires in {expiresIn}</Text>

        <TouchableOpacity
          onPress={onRedeem}
          className="bg-primary px-4 py-2 rounded-xl"
        >
          <Text className="text-white font-semibold">Redeem</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ================================
    MEMBERSHIP CARD
================================ */
interface MembershipCardProps {
  userName: string;
  memberType: string;
  points: number;
  onPress?: () => void;
}

export function MembershipCard({ userName, memberType, points, onPress }: MembershipCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-2xl p-5 shadow mb-4"
    >
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-primary font-semibold">{memberType}</Text>
          <Text className="text-xl font-bold mt-1">{userName}</Text>
        </View>

        <Ionicons name="card-outline" size={36} color="#444" />
      </View>

      <View className="mt-5 p-4 bg-primary/10 rounded-xl">
        <Text className="text-gray-700">Available Points</Text>
        <Text className="text-2xl font-bold text-primary mt-1">
          {points.toLocaleString()} Points
        </Text>
      </View>
    </TouchableOpacity>
  );
}

/* ================================
    ACTIVITY CARD
================================ */
interface ActivityCardProps {
  title: string;
  description: string;
  points: string;
  icon?: string;
}

export function ActivityCard({ title, description, points, icon = "trophy-outline" }: ActivityCardProps) {
  return (
    <View className="flex-row bg-white rounded-2xl p-4 shadow mb-3 items-center">
      <Ionicons name={icon as any} size={30} color="#444" className="mr-4" />

      <View className="flex-1">
        <Text className="text-lg font-semibold">{title}</Text>
        <Text className="text-gray-500">{description}</Text>
      </View>

      <Text className="text-primary font-bold">{points}</Text>
    </View>
  );
}

/* ================================
    SETTINGS ITEM
================================ */
interface SettingsItemProps {
  title: string;
  icon: string;
  onPress?: () => void;
  subtitle?: string;
  showChevron?: boolean;
}

export function SettingsItem({
  title,
  icon,
  onPress,
  subtitle,
  showChevron = true,
}: SettingsItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between bg-white p-4 rounded-xl shadow mb-3"
    >
      <View className="flex-row items-center">
        <Ionicons name={icon as any} size={24} color="#444" />

        <View className="ml-3">
          <Text className="text-base font-semibold">{title}</Text>
          {subtitle && <Text className="text-gray-500 text-sm">{subtitle}</Text>}
        </View>
      </View>

      {showChevron && (
        <Ionicons name="chevron-forward" size={20} color="#999" />
      )}
    </TouchableOpacity>
  );
}

/* ================================
    PLAN CARD
================================ */
interface PlanCardProps {
  name: string;
  price: number;
  period: string;
  benefits: string[];
  popular?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}

export function PlanCard({
  name,
  price,
  period,
  benefits,
  popular,
  selected,
  onSelect,
}: PlanCardProps) {
  return (
    <TouchableOpacity
      onPress={onSelect}
      className={`rounded-2xl p-6 mb-4 border-2 ${
        selected ? "border-primary bg-primary/5" : "border-gray-200 bg-white"
      }`}
    >
      <View className="flex-row justify-between items-center">
        <Text className="text-xl font-bold">{name} Plan</Text>

        {popular && (
          <View className="bg-primary/20 px-3 py-1 rounded-xl">
            <Text className="text-primary font-semibold">⭐ Most Popular</Text>
          </View>
        )}
      </View>

      <View className="mt-3 mb-3">
        <Text className="text-3xl font-bold">${price}</Text>
        <Text className="text-gray-600">/{period}</Text>
      </View>

      <View className="mt-2">
        {benefits.map((benefit, index) => (
          <View key={index} className="flex-row items-center mb-2">
            <Ionicons name="checkmark-circle" size={22} color="green" />
            <Text className="ml-2 text-gray-700">{benefit}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
}
