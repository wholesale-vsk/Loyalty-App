import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import Header from '../components/Header';
import Input from '../components/Input';
import { useTheme } from '../contexts/ThemeContext';
import { router } from 'expo-router';

const colorMap: Record<string, string> = {
  blue: '#3B82F6',
  purple: '#4F46E5',
  green: '#10B981',
  orange: '#F59E0B',
};

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const { color } = useTheme();

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar,
    };
  };

  const handleChangePassword = async () => {
    const newErrors: {[key: string]: string} = {};

    if (!currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!newPassword) newErrors.newPassword = 'New password is required';
    else if (!validatePassword(newPassword).isValid) newErrors.newPassword = 'Password does not meet requirements';
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (newPassword !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (currentPassword && currentPassword === newPassword) newErrors.newPassword = 'New password must be different from current password';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    // TODO: Replace with Firebase password change
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Your password has been changed successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }, 1500);
  };

  const passwordValidation = validatePassword(newPassword);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Change Password" showBack={true} />

      <ScrollView className="px-4 mt-4">
        {/* Info Card */}
        <View className="bg-gray-100 p-4 rounded-lg mb-6">
          <Text className="text-gray-700">
            Make sure your new password is strong and unique. Don't reuse passwords from other accounts.
          </Text>
        </View>

        {/* Current Password */}
        <Input
          label="Current Password"
          placeholder="Enter current password"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
          error={errors.currentPassword}
        />

        {/* New Password */}
        <Input
          label="New Password"
          placeholder="Enter new password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          error={errors.newPassword}
        />

        {/* Password Requirements */}
        {newPassword.length > 0 && (
          <View className="mb-4">
            <Text className="font-semibold mb-2">Password Requirements:</Text>
            <Text className={passwordValidation.minLength ? 'text-green-600' : 'text-red-500'}>
              • At least 8 characters
            </Text>
            <Text className={passwordValidation.hasUpperCase ? 'text-green-600' : 'text-red-500'}>
              • One uppercase letter
            </Text>
            <Text className={passwordValidation.hasLowerCase ? 'text-green-600' : 'text-red-500'}>
              • One lowercase letter
            </Text>
            <Text className={passwordValidation.hasNumber ? 'text-green-600' : 'text-red-500'}>
              • One number
            </Text>
            <Text className={passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-red-500'}>
              • One special character (!@#$%^&*)
            </Text>
          </View>
        )}

        {/* Confirm Password */}
        <Input
          label="Confirm New Password"
          placeholder="Re-enter new password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          error={errors.confirmPassword}
        />

        {/* Change Password Button */}
        <TouchableOpacity
          onPress={handleChangePassword}
          disabled={loading}
          style={{
            backgroundColor: colorMap[color],
            padding: 16,
            borderRadius: 8,
            alignItems: "center",
            opacity: loading ? 0.6 : 1,
            marginTop: 8,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            {loading ? 'Saving...' : 'Change Password'}
          </Text>
        </TouchableOpacity>

        {/* Forgot Password Link */}
        <View className="mt-4 flex-row justify-center">
          <Text className="text-gray-700">Forgot your current password? </Text>
          <TouchableOpacity onPress={() => router.push('../change-password')}>
            <Text className="text-blue-500 font-semibold">Reset via Email</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}