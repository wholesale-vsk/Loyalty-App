import { View, TextInput, Text, TouchableOpacity, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

interface InputProps extends TextInputProps {
  error?: string;
  label?: string;
}

export default function Input({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  editable = true,
  error,
  label,
  multiline = false,
  ...rest
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="mb-4">
      {label && <Text className="text-gray-700 mb-1">{label}</Text>}
      <View className="relative">
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          editable={editable}
          multiline={multiline}
          className="border border-gray-300 rounded-lg p-2"
          {...rest}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-2"
          >
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="gray" />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className="text-red-500 mt-1">{error}</Text>}
    </View>
  );
}