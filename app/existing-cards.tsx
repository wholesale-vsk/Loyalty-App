import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';

type Card = {
  id: string;
  name: string;
  cardNumber?: string | null;
  barcode?: string | null;
  notes?: string | null;
  frontImage?: string | null;
  backImage?: string | null;
  createdAt?: string;
};

export default function ExistingCardsScreen() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // 🔹 Image preview state
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);

  const loadCards = async () => {
    setLoading(true);
    try {
      const raw = await AsyncStorage.getItem('cards');
      const list = raw ? JSON.parse(raw) : [];
      setCards(Array.isArray(list) ? list : []);
    } catch {
      Alert.alert('Error', 'Failed to load cards.');
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCards();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCards();
    }, [])
  );

  const confirmDelete = (id: string) => {
    Alert.alert('Delete Card', 'Are you sure you want to delete this card?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const raw = await AsyncStorage.getItem('cards');
            const list = raw ? JSON.parse(raw) : [];
            const newList = list.filter((c: Card) => c.id !== id);
            await AsyncStorage.setItem('cards', JSON.stringify(newList));
            loadCards();
          } catch {
            Alert.alert('Error', 'Failed to delete card.');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Card }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        Alert.alert(
          item.name,
          `${item.cardNumber ?? ''}${item.cardNumber || item.barcode ? '\n' : ''}${item.barcode ?? ''}\n\n${item.notes ?? ''}`,
          [
            {
              text: 'Show Details',
              onPress: () => {
                setSelectedCard(item);
                setShowDetails(true);
              },
            },
            { text: 'Close', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => confirmDelete(item.id),
            },
          ]
        );
      }}
    >
      {/* 🔹 Image tap preview */}
      <TouchableOpacity
        style={styles.thumb}
        disabled={!item.frontImage}
        onPress={() => {
          if (item.frontImage) {
            setPreviewImage(item.frontImage);
            setShowImagePreview(true);
          }
        }}
      >
        {item.frontImage ? (
          <Image source={{ uri: item.frontImage }} style={styles.thumbImage} />
        ) : (
          <Ionicons name="card-outline" size={28} color="#9CA3AF" />
        )}
      </TouchableOpacity>

      <View style={styles.info}>
        <Text style={styles.title}>{item.name}</Text>
        {item.cardNumber ? (
          <Text style={styles.subtitle}>{item.cardNumber}</Text>
        ) : null}
      </View>

      <Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Existing Cards</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {loading ? (
          <Text style={styles.centerText}>Loading...</Text>
        ) : cards.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No cards added yet.</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('../add-new-card')}
            >
              <Text style={styles.addButtonText}>Add a Card</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={cards}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        )}
      </View>

      {/* 🔹 Card Details Modal */}
      <Modal
        visible={showDetails && !!selectedCard}
        animationType="slide"
        transparent
        onRequestClose={() => setShowDetails(false)}
      >
        <View style={styles.detailsOverlay}>
          <View style={styles.detailsBox}>
            <ScrollView>
              <Text style={styles.detailsTitle}>{selectedCard?.name}</Text>

              {selectedCard?.frontImage && (
                <View style={{ backgroundColor: '#fff', borderRadius: 12, marginBottom: 8, alignItems: 'center', justifyContent: 'center', width: '100%', height: 120 }}>
                  <Image
                    source={{ uri: selectedCard.frontImage }}
                    style={{ width: '100%', height: '100%', borderRadius: 12 }}
                    resizeMode="contain"
                  />
                </View>
              )}

              {selectedCard?.backImage && (
                <View style={{ backgroundColor: '#fff', borderRadius: 12, marginBottom: 8, alignItems: 'center', justifyContent: 'center', width: '100%', height: 120 }}>
                  <Image
                    source={{ uri: selectedCard.backImage }}
                    style={{ width: '100%', height: '100%', borderRadius: 12 }}
                    resizeMode="contain"
                  />
                </View>
              )}

              {selectedCard?.barcode && (
                <Text style={styles.mono}>{selectedCard.barcode}</Text>
              )}

              {selectedCard?.cardNumber && (
                <Text style={styles.mono}>{selectedCard.cardNumber}</Text>
              )}

              {selectedCard?.notes && (
                <Text style={styles.notes}>{selectedCard.notes}</Text>
              )}
            </ScrollView>

            <TouchableOpacity
              onPress={() => setShowDetails(false)}
              style={styles.closeBtn}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 🔹 Image Preview Modal */}
      <Modal
        visible={showImagePreview && !!previewImage}
        transparent
        animationType="fade"
        onRequestClose={() => setShowImagePreview(false)}
      >
        <View style={styles.imageOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            onPress={() => setShowImagePreview(false)}
          />

          <Image
            source={{ uri: previewImage! }}
            style={styles.previewImage}
            resizeMode="contain"
          />

          <TouchableOpacity
            style={styles.previewClose}
            onPress={() => setShowImagePreview(false)}
          >
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },

  header: {
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', marginLeft: 12 },

  content: { flex: 1, marginTop: 12 },
  centerText: { textAlign: 'center', marginTop: 32, color: '#6B7280' },

  empty: { alignItems: 'center', marginTop: 32 },
  emptyText: { color: '#6B7280' },
  addButton: {
    marginTop: 16,
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: { color: '#fff' },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },

  thumb: {
    width: 64,
    height: 40,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumbImage: { width: '100%', height: '100%' },

  info: { flex: 1 },
  title: { fontWeight: '600' },
  subtitle: { color: '#6B7280' },

  detailsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsBox: {
    backgroundColor: '#fff',
    width: '90%',
    maxHeight: '80%',
    borderRadius: 16,
    padding: 20,
  },
  detailsTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  detailsImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  mono: { fontFamily: 'monospace', marginBottom: 8 },
  notes: { marginBottom: 8 },

  closeBtn: {
    marginTop: 12,
    backgroundColor: '#4F46E5',
    paddingVertical: 10,
    borderRadius: 8,
  },
  closeText: { color: '#fff', textAlign: 'center', fontWeight: '700' },

  imageOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '90%',
    height: '70%',
  },
  previewClose: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
});
