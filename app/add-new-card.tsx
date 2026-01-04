import React, { useState } from 'react';
import { View,Text,TouchableOpacity,Image,TextInput,ScrollView,Alert,Modal, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { PanResponder, Dimensions } from 'react-native';

export default function AddNewCardScreen() {
    // For image preview modal
    const [previewImageUri, setPreviewImageUri] = useState<string | null>(null);
  // For custom crop rectangle (horizontal and vertical)
  const window = Dimensions.get('window');
  const displayWidth = 320;
  const displayHeight = 240;
  // Rectangle is adjustable in both directions
  const [cropRect, setCropRect] = useState({
    x: displayWidth * 0.1,
    y: displayHeight * 0.1,
    width: displayWidth * 0.8,
    height: displayHeight * 0.8,
  });
  // Freeform crop: drag from any edge/corner or move the rectangle
  const [dragMode, setDragMode] = useState<null | 'move' | 'left' | 'right' | 'top' | 'bottom' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright'>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [rectStart, setRectStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const cropRectRef = React.useRef(cropRect);
  React.useEffect(() => { cropRectRef.current = cropRect; }, [cropRect]);
  const MIN_SIZE = 20;
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (e, gestureState) => {
      const localX = gestureState.x0 - (window.width - displayWidth) / 2;
      const localY = gestureState.y0 - (window.height - displayHeight) / 2;
      const c = cropRectRef.current;
      // Only allow move/resize if touch is inside or on the edge/corner
      if (Math.abs(localX - c.x) < 20 && Math.abs(localY - c.y) < 20) {
        setDragMode('topleft');
      } else if (Math.abs(localX - (c.x + c.width)) < 20 && Math.abs(localY - c.y) < 20) {
        setDragMode('topright');
      } else if (Math.abs(localX - c.x) < 20 && Math.abs(localY - (c.y + c.height)) < 20) {
        setDragMode('bottomleft');
      } else if (Math.abs(localX - (c.x + c.width)) < 20 && Math.abs(localY - (c.y + c.height)) < 20) {
        setDragMode('bottomright');
      } else if (Math.abs(localX - c.x) < 20) {
        setDragMode('left');
      } else if (Math.abs(localX - (c.x + c.width)) < 20) {
        setDragMode('right');
      } else if (Math.abs(localY - c.y) < 20) {
        setDragMode('top');
      } else if (Math.abs(localY - (c.y + c.height)) < 20) {
        setDragMode('bottom');
      } else if (
        localX > c.x && localX < c.x + c.width &&
        localY > c.y && localY < c.y + c.height
      ) {
        setDragMode('move');
      } else {
        setDragMode(null);
        return;
      }
      setRectStart({ ...c });
      setDragStart({ x: gestureState.x0, y: gestureState.y0 });
    },
    onPanResponderMove: (e, gestureState) => {
      requestAnimationFrame(() => {
        const dx = gestureState.moveX - dragStart.x;
        const dy = gestureState.moveY - dragStart.y;
        let c = { ...rectStart };
        switch (dragMode) {
          case 'move': {
            let newX = c.x + dx;
            let newY = c.y + dy;
            newX = Math.max(0, Math.min(newX, displayWidth - c.width));
            newY = Math.max(0, Math.min(newY, displayHeight - c.height));
            setCropRect({ ...c, x: newX, y: newY });
            break;
          }
          case 'left': {
            let newX = c.x + dx;
            let newWidth = c.width - dx;
            if (newX < 0) { newWidth += newX; newX = 0; }
            if (newWidth < MIN_SIZE) { newX = c.x + c.width - MIN_SIZE; newWidth = MIN_SIZE; }
            setCropRect({ ...c, x: newX, width: newWidth });
            break;
          }
          case 'right': {
            let newWidth = c.width + dx;
            if (newWidth < MIN_SIZE) newWidth = MIN_SIZE;
            if (c.x + newWidth > displayWidth) newWidth = displayWidth - c.x;
            setCropRect({ ...c, width: newWidth });
            break;
          }
          case 'top': {
            let newY = c.y + dy;
            let newHeight = c.height - dy;
            if (newY < 0) { newHeight += newY; newY = 0; }
            if (newHeight < MIN_SIZE) { newY = c.y + c.height - MIN_SIZE; newHeight = MIN_SIZE; }
            setCropRect({ ...c, y: newY, height: newHeight });
            break;
          }
          case 'bottom': {
            let newHeight = c.height + dy;
            if (newHeight < MIN_SIZE) newHeight = MIN_SIZE;
            if (c.y + newHeight > displayHeight) newHeight = displayHeight - c.y;
            setCropRect({ ...c, height: newHeight });
            break;
          }
          case 'topleft': {
            let newX = c.x + dx;
            let newY = c.y + dy;
            let newWidth = c.width - dx;
            let newHeight = c.height - dy;
            if (newX < 0) { newWidth += newX; newX = 0; }
            if (newY < 0) { newHeight += newY; newY = 0; }
            if (newWidth < MIN_SIZE) { newX = c.x + c.width - MIN_SIZE; newWidth = MIN_SIZE; }
            if (newHeight < MIN_SIZE) { newY = c.y + c.height - MIN_SIZE; newHeight = MIN_SIZE; }
            setCropRect({ x: newX, y: newY, width: newWidth, height: newHeight });
            break;
          }
          case 'topright': {
            let newY = c.y + dy;
            let newWidth = c.width + dx;
            let newHeight = c.height - dy;
            if (newWidth < MIN_SIZE) newWidth = MIN_SIZE;
            if (c.x + newWidth > displayWidth) newWidth = displayWidth - c.x;
            if (newY < 0) { newHeight += newY; newY = 0; }
            if (newHeight < MIN_SIZE) { newY = c.y + c.height - MIN_SIZE; newHeight = MIN_SIZE; }
            setCropRect({ x: c.x, y: newY, width: newWidth, height: newHeight });
            break;
          }
          case 'bottomleft': {
            let newX = c.x + dx;
            let newWidth = c.width - dx;
            let newHeight = c.height + dy;
            if (newX < 0) { newWidth += newX; newX = 0; }
            if (newWidth < MIN_SIZE) { newX = c.x + c.width - MIN_SIZE; newWidth = MIN_SIZE; }
            if (newHeight < MIN_SIZE) newHeight = MIN_SIZE;
            if (c.y + newHeight > displayHeight) newHeight = displayHeight - c.y;
            setCropRect({ x: newX, y: c.y, width: newWidth, height: newHeight });
            break;
          }
          case 'bottomright': {
            let newWidth = c.width + dx;
            let newHeight = c.height + dy;
            if (newWidth < MIN_SIZE) newWidth = MIN_SIZE;
            if (c.x + newWidth > displayWidth) newWidth = displayWidth - c.x;
            if (newHeight < MIN_SIZE) newHeight = MIN_SIZE;
            if (c.y + newHeight > displayHeight) newHeight = displayHeight - c.y;
            setCropRect({ x: c.x, y: c.y, width: newWidth, height: newHeight });
            break;
          }
        }
      });
    },
    onPanResponderRelease: () => {
      setDragMode(null);
    },
  });
  // Barcode scanner
  const [scannerVisible, setScannerVisible] = useState(false);
  const [scanned, setScanned] = useState(false);

  // Reset scanned state when scanner modal opens
  React.useEffect(() => {
    if (scannerVisible) {
      setScanned(false);
    }
  }, [scannerVisible]);

  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [cropSide, setCropSide] = useState<'front' | 'back' | null>(null);
  const [cropImageUri, setCropImageUri] = useState<string | null>(null);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [barcode, setBarcode] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const [cameraPermission, requestCameraPermission] =
    useCameraPermissions();

  // ===============================
  // Image Picker
  // ===============================

  const takePhoto = async (side: 'front' | 'back') => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Camera access is required.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false, // We'll handle cropping separately
      quality: 1,
    });

    if (!result.canceled && result.assets?.length) {
      setCropSide(side);
      setCropImageUri(result.assets[0].uri);
    }
  };

  const pickImage = async (side: 'front' | 'back') => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Gallery access is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false, // We'll handle cropping separately
      quality: 1,
    });

    if (!result.canceled && result.assets?.length) {
      setCropSide(side);
      setCropImageUri(result.assets[0].uri);
    }

  };

  // Crop handler with custom rectangle (horizontal and vertical)
  const [imageVersion, setImageVersion] = useState(0);
  const handleCrop = async () => {
    if (!cropImageUri) return;
    const cropX = cropRect.x;
    const cropY = cropRect.y;
    const cropWidth = cropRect.width;
    const cropHeight = cropRect.height;
    Image.getSize(cropImageUri, async (imgWidth, imgHeight) => {
      const scaleX = imgWidth / displayWidth;
      const scaleY = imgHeight / displayHeight;
      const manipResult = await ImageManipulator.manipulateAsync(
        cropImageUri,
        [
          {
            crop: {
              originX: cropX * scaleX,
              originY: cropY * scaleY,
              width: cropWidth * scaleX,
              height: cropHeight * scaleY,
            },
          },
        ],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );
      if (cropSide === 'front') setFrontImage(manipResult.uri);
      if (cropSide === 'back') setBackImage(manipResult.uri);
      setImageVersion(v => v + 1); // force re-render
      setCropSide(null);
      setCropImageUri(null);
    });
  };

  // ===============================
  // Barcode Scan
  // ===============================

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    setBarcode(data);
    setCardNumber(data);
    setScannerVisible(false);
    // Show alert after modal closes to avoid UI blocking
    setTimeout(() => {
      Alert.alert('Barcode Scanned', data);
    }, 300);
  };

  // ===============================
  // Save Card
  // ===============================

  const saveCard = async () => {
    if (!cardName.trim()) {
      Alert.alert('Validation', 'Card name is required.');
      return;
    }

    const newCard = {
      id: Date.now().toString(),
      name: cardName.trim(),
      cardNumber: cardNumber || null,
      barcode: barcode || null,
      notes: notes || null,
      frontImage,
      backImage,
      createdAt: new Date().toISOString(),
    };

    setSaving(true);
    try {
      const raw = await AsyncStorage.getItem('cards');
      const list = raw ? JSON.parse(raw) : [];
      list.unshift(newCard);
      await AsyncStorage.setItem('cards', JSON.stringify(list));
      Alert.alert('Saved', 'Card added successfully', [
        { text: 'OK', onPress: () => router.push('../add-card') },
      ]);
    } catch {
      Alert.alert('Error', 'Failed to save card.');
    } finally {
      setSaving(false);
    }
  };

  // ===============================
  // UI
  // ===============================

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      {/* Image Preview Modal (moved to root for correct overlay) */}
      <Modal visible={!!previewImageUri} animationType="fade" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center' }}>
          {previewImageUri && (
            <Image source={{ uri: previewImageUri }} style={{ width: 340, height: 260, borderRadius: 16, marginBottom: 24 }} resizeMode="contain" />
          )}
          <TouchableOpacity onPress={() => setPreviewImageUri(null)} style={{ backgroundColor: '#222', padding: 14, borderRadius: 8 }}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {/* Crop Modal */}
      <Modal visible={!!cropImageUri} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' }}>
          {cropImageUri && (
            <View style={{ width: displayWidth, height: displayHeight, borderRadius: 12, marginBottom: 20, overflow: 'hidden', position: 'relative' }}>
              <Image source={{ uri: cropImageUri }} style={{ width: displayWidth, height: displayHeight }} resizeMode="contain" />
              {/* Crop Rectangle Overlay (horizontal and vertical) */}
              <View
                style={{
                  position: 'absolute',
                  left: cropRect.x,
                  top: cropRect.y,
                  width: cropRect.width,
                  height: cropRect.height,
                  borderWidth: 2,
                  borderColor: '#00FF00',
                  backgroundColor: 'rgba(0,255,0,0.1)',
                  zIndex: 10,
                }}
                {...panResponder.panHandlers}
              >
                {/* Corner handles */}
                <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#00FF00', position: 'absolute', left: -12, top: -12, zIndex: 12, opacity: 0.7 }} />
                <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#00FF00', position: 'absolute', right: -12, top: -12, zIndex: 12, opacity: 0.7 }} />
                <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#00FF00', position: 'absolute', left: -12, bottom: -12, zIndex: 12, opacity: 0.7 }} />
                <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#00FF00', position: 'absolute', right: -12, bottom: -12, zIndex: 12, opacity: 0.7 }} />
              </View>
            </View>
          )}
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <TouchableOpacity onPress={handleCrop} style={{ backgroundColor: '#2563eb', padding: 14, borderRadius: 8, marginRight: 10 }}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Crop & Use</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setCropSide(null); setCropImageUri(null); }} style={{ backgroundColor: '#aaa', padding: 14, borderRadius: 8 }}>
              <Text style={{ color: '#fff' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ color: '#fff', marginTop: 10, textAlign: 'center' }}>
            Drag or resize the green rectangle to crop
          </Text>
        </View>
      </Modal>
      {/* Back */}
      <TouchableOpacity
        onPress={() => router.push('../add-card')}
        className="pt-4 pb-2"
      >
        <Ionicons name="arrow-back" size={24} />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="text-2xl font-bold mb-6 text-center">
          Add New Card
        </Text>

        {/* Images */}
        <View className="flex-row justify-between mb-6">
          {(['front', 'back'] as const).map((side) => (
            <View key={side} className="items-center flex-1 mx-1">
              <View className="w-32 h-20 bg-gray-200 rounded-xl items-center justify-center relative">
                {(side === 'front' ? frontImage : backImage) ? (
                  <TouchableOpacity onPress={() => {
                    const uri = side === 'front' ? frontImage : backImage;
                    if (uri) setPreviewImageUri(uri);
                  }}>
                    <Image
                      key={imageVersion + side}
                      source={{ uri: side === 'front' ? frontImage! : backImage! }}
                      style={{ width: '100%', height: '100%', borderRadius: 12 }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                ) : (
                  <Ionicons
                    name="card-outline"
                    size={40}
                    color="#9CA3AF"
                  />
                )}


                <TouchableOpacity
                  className="absolute bottom-1 right-1 bg-primary rounded-full p-1"
                  onPress={() =>
                    Alert.alert('Add Photo', 'Choose option', [
                      {
                        text: 'Take Photo',
                        onPress: () => takePhoto(side),
                      },
                      {
                        text: 'Choose from Gallery',
                        onPress: () => pickImage(side),
                      },
                      { text: 'Cancel', style: 'cancel' },
                    ])
                  }
                >
                  <Ionicons name="camera" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
              <Text className="text-xs text-gray-500 capitalize">
                {side} side
              </Text>
            </View>
          ))}
        </View>

        {/* Form */}
        <Text className="font-semibold mb-1">Card Name</Text>
        <TextInput
          className="border rounded-lg px-3 py-2 mb-3"
          value={cardName}
          onChangeText={setCardName}
        />

        <Text className="font-semibold mb-1">Card Number</Text>
        <TextInput
          className="border rounded-lg px-3 py-2 mb-3"
          keyboardType="number-pad"
          value={cardNumber}
          onChangeText={setCardNumber}
        />

        <Text className="font-semibold mb-1">Barcode</Text>
        <View className="flex-row items-center mb-3">
          <TextInput
            className="flex-1 border rounded-lg px-3 py-2 mr-2"
            value={barcode}
            onChangeText={setBarcode}
            keyboardType="number-pad"
          />
          <TouchableOpacity
            className="bg-primary px-3 py-2 rounded-lg"
            onPress={async () => {
              if (!cameraPermission?.granted)
                await requestCameraPermission();
              setScannerVisible(true);
            }}
          >
            <Ionicons
              name="barcode-outline"
              size={22}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        <Text className="font-semibold mb-1">Notes</Text>
        <TextInput
          className="border rounded-lg px-3 py-2 mb-6"
          multiline
          value={notes}
          onChangeText={setNotes}
        />

        <TouchableOpacity
          className={`rounded-lg py-3 items-center mb-8 ${
            saving ? 'bg-gray-400' : 'bg-primary'
          }`}
          onPress={saveCard}
          disabled={saving}
        >
          <Text className="text-white font-bold text-lg">
            {saving ? 'Saving...' : 'Save Card'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Scanner */}
      <Modal visible={scannerVisible} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
          <CameraView
            style={{ flex: 1 }}
            onBarcodeScanned={
              scanned ? undefined : handleBarcodeScanned
            }
            barcodeScannerSettings={{
              barcodeTypes: [
                'ean13',
                'ean8',
                'code128',
                'code39',
                'upc_a',
                'upc_e',
              ],
            }}
          />

          {/* Overlay */}
          <View
            style={{
              position: 'absolute',
              top: '30%',
              left: '5%',
              width: '90%',
              height: 120,
              borderWidth: 2,
              borderColor: '#00FF00',
              borderRadius: 8,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#00FF00', fontWeight: 'bold' }}>
              Place barcode here
            </Text>
          </View>

          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 40,
              right: 20,
              backgroundColor: '#000000aa',
              padding: 10,
              borderRadius: 20,
            }}
            onPress={() => setScannerVisible(false)}
          >
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
