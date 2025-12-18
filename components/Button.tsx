import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  disabled?: boolean;
}

export default function Button({ 
  title, 
  onPress, 
  variant = 'primary',
  loading = false,
  disabled = false 
}: ButtonProps) {
  const bgColor = variant === 'primary' ? 'bg-primary' : 'bg-white border-2 border-primary';
  const textColor = variant === 'primary' ? 'text-white' : 'text-primary';

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled || loading} style={{ backgroundColor: variant === 'primary' ? '#4F46E5' : 'white' }}>
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? 'white' : '#4F46E5'} />
      ) : (
        <Text style={{ color: variant === 'primary' ? 'white' : '#4F46E5' }}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}