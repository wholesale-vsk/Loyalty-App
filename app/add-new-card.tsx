// import React, { useState } from 'react';
// import { View,Text,TouchableOpacity,Image,TextInput,ScrollView,Alert,Modal, } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Ionicons } from '@expo/vector-icons';
// import * as ImagePicker from 'expo-image-picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { router } from 'expo-router';
// import { CameraView, useCameraPermissions } from 'expo-camera';
// import * as ImageManipulator from 'expo-image-manipulator';
// import { PanResponder, Dimensions } from 'react-native';

// export default function AddNewCardScreen() {
//     // For image preview modal
//     const [previewImageUri, setPreviewImageUri] = useState<string | null>(null);
//   // For custom crop rectangle (horizontal and vertical)
//   const window = Dimensions.get('window');
//   const displayWidth = 320;
//   const displayHeight = 240;
//   // Rectangle is adjustable in both directions
//   const [cropRect, setCropRect] = useState({
//     x: displayWidth * 0.1,
//     y: displayHeight * 0.1,
//     width: displayWidth * 0.8,
//     height: displayHeight * 0.8,
//   });
//   // Freeform crop: drag from any edge/corner or move the rectangle
//   const [dragMode, setDragMode] = useState<null | 'move' | 'left' | 'right' | 'top' | 'bottom' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright'>(null);
//   const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
//   const [rectStart, setRectStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
//   const cropRectRef = React.useRef(cropRect);
//   React.useEffect(() => { cropRectRef.current = cropRect; }, [cropRect]);
//   const MIN_SIZE = 20;
//   const panResponder = PanResponder.create({
//     onStartShouldSetPanResponder: () => true,
//     onPanResponderGrant: (e, gestureState) => {
//       const localX = gestureState.x0 - (window.width - displayWidth) / 2;
//       const localY = gestureState.y0 - (window.height - displayHeight) / 2;
//       const c = cropRectRef.current;
//       // Only allow move/resize if touch is inside or on the edge/corner
//       if (Math.abs(localX - c.x) < 20 && Math.abs(localY - c.y) < 20) {
//         setDragMode('topleft');
//       } else if (Math.abs(localX - (c.x + c.width)) < 20 && Math.abs(localY - c.y) < 20) {
//         setDragMode('topright');
//       } else if (Math.abs(localX - c.x) < 20 && Math.abs(localY - (c.y + c.height)) < 20) {
//         setDragMode('bottomleft');
//       } else if (Math.abs(localX - (c.x + c.width)) < 20 && Math.abs(localY - (c.y + c.height)) < 20) {
//         setDragMode('bottomright');
//       } else if (Math.abs(localX - c.x) < 20) {
//         setDragMode('left');
//       } else if (Math.abs(localX - (c.x + c.width)) < 20) {
//         setDragMode('right');
//       } else if (Math.abs(localY - c.y) < 20) {
//         setDragMode('top');
//       } else if (Math.abs(localY - (c.y + c.height)) < 20) {
//         setDragMode('bottom');
//       } else if (
//         localX > c.x && localX < c.x + c.width &&
//         localY > c.y && localY < c.y + c.height
//       ) {
//         setDragMode('move');
//       } else {
//         setDragMode(null);
//         return;
//       }
//       setRectStart({ ...c });
//       setDragStart({ x: gestureState.x0, y: gestureState.y0 });
//     },
//     onPanResponderMove: (e, gestureState) => {
//       requestAnimationFrame(() => {
//         const dx = gestureState.moveX - dragStart.x;
//         const dy = gestureState.moveY - dragStart.y;
//         let c = { ...rectStart };
//         switch (dragMode) {
//           case 'move': {
//             let newX = c.x + dx;
//             let newY = c.y + dy;
//             newX = Math.max(0, Math.min(newX, displayWidth - c.width));
//             newY = Math.max(0, Math.min(newY, displayHeight - c.height));
//             setCropRect({ ...c, x: newX, y: newY });
//             break;
//           }
//           case 'left': {
//             let newX = c.x + dx;
//             let newWidth = c.width - dx;
//             if (newX < 0) { newWidth += newX; newX = 0; }
//             if (newWidth < MIN_SIZE) { newX = c.x + c.width - MIN_SIZE; newWidth = MIN_SIZE; }
//             setCropRect({ ...c, x: newX, width: newWidth });
//             break;
//           }
//           case 'right': {
//             let newWidth = c.width + dx;
//             if (newWidth < MIN_SIZE) newWidth = MIN_SIZE;
//             if (c.x + newWidth > displayWidth) newWidth = displayWidth - c.x;
//             setCropRect({ ...c, width: newWidth });
//             break;
//           }
//           case 'top': {
//             let newY = c.y + dy;
//             let newHeight = c.height - dy;
//             if (newY < 0) { newHeight += newY; newY = 0; }
//             if (newHeight < MIN_SIZE) { newY = c.y + c.height - MIN_SIZE; newHeight = MIN_SIZE; }
//             setCropRect({ ...c, y: newY, height: newHeight });
//             break;
//           }
//           case 'bottom': {
//             let newHeight = c.height + dy;
//             if (newHeight < MIN_SIZE) newHeight = MIN_SIZE;
//             if (c.y + newHeight > displayHeight) newHeight = displayHeight - c.y;
//             setCropRect({ ...c, height: newHeight });
//             break;
//           }
//           case 'topleft': {
//             let newX = c.x + dx;
//             let newY = c.y + dy;
//             let newWidth = c.width - dx;
//             let newHeight = c.height - dy;
//             if (newX < 0) { newWidth += newX; newX = 0; }
//             if (newY < 0) { newHeight += newY; newY = 0; }
//             if (newWidth < MIN_SIZE) { newX = c.x + c.width - MIN_SIZE; newWidth = MIN_SIZE; }
//             if (newHeight < MIN_SIZE) { newY = c.y + c.height - MIN_SIZE; newHeight = MIN_SIZE; }
//             setCropRect({ x: newX, y: newY, width: newWidth, height: newHeight });
//             break;
//           }
//           case 'topright': {
//             let newY = c.y + dy;
//             let newWidth = c.width + dx;
//             let newHeight = c.height - dy;
//             if (newWidth < MIN_SIZE) newWidth = MIN_SIZE;
//             if (c.x + newWidth > displayWidth) newWidth = displayWidth - c.x;
//             if (newY < 0) { newHeight += newY; newY = 0; }
//             if (newHeight < MIN_SIZE) { newY = c.y + c.height - MIN_SIZE; newHeight = MIN_SIZE; }
//             setCropRect({ x: c.x, y: newY, width: newWidth, height: newHeight });
//             break;
//           }
//           case 'bottomleft': {
//             let newX = c.x + dx;
//             let newWidth = c.width - dx;
//             let newHeight = c.height + dy;
//             if (newX < 0) { newWidth += newX; newX = 0; }
//             if (newWidth < MIN_SIZE) { newX = c.x + c.width - MIN_SIZE; newWidth = MIN_SIZE; }
//             if (newHeight < MIN_SIZE) newHeight = MIN_SIZE;
//             if (c.y + newHeight > displayHeight) newHeight = displayHeight - c.y;
//             setCropRect({ x: newX, y: c.y, width: newWidth, height: newHeight });
//             break;
//           }
//           case 'bottomright': {
//             let newWidth = c.width + dx;
//             let newHeight = c.height + dy;
//             if (newWidth < MIN_SIZE) newWidth = MIN_SIZE;
//             if (c.x + newWidth > displayWidth) newWidth = displayWidth - c.x;
//             if (newHeight < MIN_SIZE) newHeight = MIN_SIZE;
//             if (c.y + newHeight > displayHeight) newHeight = displayHeight - c.y;
//             setCropRect({ x: c.x, y: c.y, width: newWidth, height: newHeight });
//             break;
//           }
//         }
//       });
//     },
//     onPanResponderRelease: () => {
//       setDragMode(null);
//     },
//   });
//   // Barcode scanner
//   const [scannerVisible, setScannerVisible] = useState(false);
//   const [scanned, setScanned] = useState(false);

//   // Reset scanned state when scanner modal opens
//   React.useEffect(() => {
//     if (scannerVisible) {
//       setScanned(false);
//     }
//   }, [scannerVisible]);

//   const [frontImage, setFrontImage] = useState<string | null>(null);
//   const [backImage, setBackImage] = useState<string | null>(null);
//   const [cropSide, setCropSide] = useState<'front' | 'back' | null>(null);
//   const [cropImageUri, setCropImageUri] = useState<string | null>(null);
//   const [cardName, setCardName] = useState('');
//   const [cardNumber, setCardNumber] = useState('');
//   const [barcode, setBarcode] = useState('');
//   const [notes, setNotes] = useState('');
//   const [saving, setSaving] = useState(false);

//   const [cameraPermission, requestCameraPermission] =
//     useCameraPermissions();

//   // ===============================
//   // Image Picker
//   // ===============================

//   const takePhoto = async (side: 'front' | 'back') => {
//     const { status } = await ImagePicker.requestCameraPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission required', 'Camera access is required.');
//       return;
//     }

//     const result = await ImagePicker.launchCameraAsync({
//       allowsEditing: false, // We'll handle cropping separately
//       quality: 1,
//     });

//     if (!result.canceled && result.assets?.length) {
//       setCropSide(side);
//       setCropImageUri(result.assets[0].uri);
//     }
//   };

//   const pickImage = async (side: 'front' | 'back') => {
//     const { status } =
//       await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission required', 'Gallery access is required.');
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       allowsEditing: false, // We'll handle cropping separately
//       quality: 1,
//     });

//     if (!result.canceled && result.assets?.length) {
//       setCropSide(side);
//       setCropImageUri(result.assets[0].uri);
//     }

//   };

//   // Crop handler with custom rectangle (horizontal and vertical)
//   const [imageVersion, setImageVersion] = useState(0);
//   const handleCrop = async () => {
//     if (!cropImageUri) return;
//     const cropX = cropRect.x;
//     const cropY = cropRect.y;
//     const cropWidth = cropRect.width;
//     const cropHeight = cropRect.height;
//     Image.getSize(cropImageUri, async (imgWidth, imgHeight) => {
//       const scaleX = imgWidth / displayWidth;
//       const scaleY = imgHeight / displayHeight;
//       const manipResult = await ImageManipulator.manipulateAsync(
//         cropImageUri,
//         [
//           {
//             crop: {
//               originX: cropX * scaleX,
//               originY: cropY * scaleY,
//               width: cropWidth * scaleX,
//               height: cropHeight * scaleY,
//             },
//           },
//         ],
//         { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
//       );
//       if (cropSide === 'front') setFrontImage(manipResult.uri);
//       if (cropSide === 'back') setBackImage(manipResult.uri);
//       setImageVersion(v => v + 1); // force re-render
//       setCropSide(null);
//       setCropImageUri(null);
//     });
//   };

//   // ===============================
//   // Barcode Scan
//   // ===============================

//   const handleBarcodeScanned = ({ data }: { data: string }) => {
//     if (scanned) return;
//     setScanned(true);
//     setBarcode(data);
//     setCardNumber(data);
//     setScannerVisible(false);
//     // Show alert after modal closes to avoid UI blocking
//     setTimeout(() => {
//       Alert.alert('Barcode Scanned', data);
//     }, 300);
//   };

//   // ===============================
//   // Save Card
//   // ===============================

//   const saveCard = async () => {
//     if (!cardName.trim()) {
//       Alert.alert('Validation', 'Card name is required.');
//       return;
//     }

//     const newCard = {
//       id: Date.now().toString(),
//       name: cardName.trim(),
//       cardNumber: cardNumber || null,
//       barcode: barcode || null,
//       notes: notes || null,
//       frontImage,
//       backImage,
//       createdAt: new Date().toISOString(),
//     };

//     setSaving(true);
//     try {
//       const raw = await AsyncStorage.getItem('cards');
//       const list = raw ? JSON.parse(raw) : [];
//       list.unshift(newCard);
//       await AsyncStorage.setItem('cards', JSON.stringify(list));
//       Alert.alert('Saved', 'Card added successfully', [
//         { text: 'OK', onPress: () => router.push('../add-card') },
//       ]);
//     } catch {
//       Alert.alert('Error', 'Failed to save card.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ===============================
//   // UI
//   // ===============================

//   return (
//     <SafeAreaView className="flex-1 bg-white px-6">
//       {/* Image Preview Modal (moved to root for correct overlay) */}
//       <Modal visible={!!previewImageUri} animationType="fade" transparent>
//         <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center' }}>
//           {previewImageUri && (
//             <Image source={{ uri: previewImageUri }} style={{ width: 340, height: 260, borderRadius: 16, marginBottom: 24 }} resizeMode="contain" />
//           )}
//           <TouchableOpacity onPress={() => setPreviewImageUri(null)} style={{ backgroundColor: '#222', padding: 14, borderRadius: 8 }}>
//             <Text style={{ color: '#fff', fontWeight: 'bold' }}>Close</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>
//       {/* Crop Modal */}
//       <Modal visible={!!cropImageUri} animationType="slide" transparent>
//         <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' }}>
//           {cropImageUri && (
//             <View style={{ width: displayWidth, height: displayHeight, borderRadius: 12, marginBottom: 20, overflow: 'hidden', position: 'relative' }}>
//               <Image source={{ uri: cropImageUri }} style={{ width: displayWidth, height: displayHeight }} resizeMode="contain" />
//               {/* Crop Rectangle Overlay (horizontal and vertical) */}
//               <View
//                 style={{
//                   position: 'absolute',
//                   left: cropRect.x,
//                   top: cropRect.y,
//                   width: cropRect.width,
//                   height: cropRect.height,
//                   borderWidth: 2,
//                   borderColor: '#00FF00',
//                   backgroundColor: 'rgba(0,255,0,0.1)',
//                   zIndex: 10,
//                 }}
//                 {...panResponder.panHandlers}
//               >
//                 {/* Corner handles */}
//                 <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#00FF00', position: 'absolute', left: -12, top: -12, zIndex: 12, opacity: 0.7 }} />
//                 <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#00FF00', position: 'absolute', right: -12, top: -12, zIndex: 12, opacity: 0.7 }} />
//                 <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#00FF00', position: 'absolute', left: -12, bottom: -12, zIndex: 12, opacity: 0.7 }} />
//                 <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#00FF00', position: 'absolute', right: -12, bottom: -12, zIndex: 12, opacity: 0.7 }} />
//               </View>
//             </View>
//           )}
//           <View style={{ flexDirection: 'row', gap: 16 }}>
//             <TouchableOpacity onPress={handleCrop} style={{ backgroundColor: '#2563eb', padding: 14, borderRadius: 8, marginRight: 10 }}>
//               <Text style={{ color: '#fff', fontWeight: 'bold' }}>Crop & Use</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => { setCropSide(null); setCropImageUri(null); }} style={{ backgroundColor: '#aaa', padding: 14, borderRadius: 8 }}>
//               <Text style={{ color: '#fff' }}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//           <Text style={{ color: '#fff', marginTop: 10, textAlign: 'center' }}>
//             Drag or resize the green rectangle to crop
//           </Text>
//         </View>
//       </Modal>
//       {/* Back */}
//       <TouchableOpacity
//         onPress={() => router.push('../add-card')}
//         className="pt-4 pb-2"
//       >
//         <Ionicons name="arrow-back" size={24} />
//       </TouchableOpacity>

//       <ScrollView showsVerticalScrollIndicator={false}>
//         <Text className="text-2xl font-bold mb-6 text-center">
//           Add New Card
//         </Text>

//         {/* Images */}
//         <View className="flex-row justify-between mb-6">
//           {(['front', 'back'] as const).map((side) => (
//             <View key={side} className="items-center flex-1 mx-1">
//               <View className="w-32 h-20 bg-gray-200 rounded-xl items-center justify-center relative">
//                 {(side === 'front' ? frontImage : backImage) ? (
//                   <TouchableOpacity onPress={() => {
//                     const uri = side === 'front' ? frontImage : backImage;
//                     if (uri) setPreviewImageUri(uri);
//                   }}>
//                     <Image
//                       key={imageVersion + side}
//                       source={{ uri: side === 'front' ? frontImage! : backImage! }}
//                       style={{ width: '100%', height: '100%', borderRadius: 12 }}
//                       resizeMode="contain"
//                     />
//                   </TouchableOpacity>
//                 ) : (
//                   <Ionicons
//                     name="card-outline"
//                     size={40}
//                     color="#9CA3AF"
//                   />
//                 )}


//                 <TouchableOpacity
//                   className="absolute bottom-1 right-1 bg-primary rounded-full p-1"
//                   onPress={() =>
//                     Alert.alert('Add Photo', 'Choose option', [
//                       {
//                         text: 'Take Photo',
//                         onPress: () => takePhoto(side),
//                       },
//                       {
//                         text: 'Choose from Gallery',
//                         onPress: () => pickImage(side),
//                       },
//                       { text: 'Cancel', style: 'cancel' },
//                     ])
//                   }
//                 >
//                   <Ionicons name="camera" size={18} color="#fff" />
//                 </TouchableOpacity>
//               </View>
//               <Text className="text-xs text-gray-500 capitalize">
//                 {side} side
//               </Text>
//             </View>
//           ))}
//         </View>

//         {/* Form */}
//         <Text className="font-semibold mb-1">Card Name</Text>
//         <TextInput
//           className="border rounded-lg px-3 py-2 mb-3"
//           value={cardName}
//           onChangeText={setCardName}
//         />

//         <Text className="font-semibold mb-1">Card Number</Text>
//         <TextInput
//           className="border rounded-lg px-3 py-2 mb-3"
//           keyboardType="number-pad"
//           value={cardNumber}
//           onChangeText={setCardNumber}
//         />

//         <Text className="font-semibold mb-1">Barcode</Text>
//         <View className="flex-row items-center mb-3">
//           <TextInput
//             className="flex-1 border rounded-lg px-3 py-2 mr-2"
//             value={barcode}
//             onChangeText={setBarcode}
//             keyboardType="number-pad"
//           />
//           <TouchableOpacity
//             className="bg-primary px-3 py-2 rounded-lg"
//             onPress={async () => {
//               if (!cameraPermission?.granted)
//                 await requestCameraPermission();
//               setScannerVisible(true);
//             }}
//           >
//             <Ionicons
//               name="barcode-outline"
//               size={22}
//               color="#fff"
//             />
//           </TouchableOpacity>
//         </View>

//         <Text className="font-semibold mb-1">Notes</Text>
//         <TextInput
//           className="border rounded-lg px-3 py-2 mb-6"
//           multiline
//           value={notes}
//           onChangeText={setNotes}
//         />

//         <TouchableOpacity
//           className={`rounded-lg py-3 items-center mb-8 ${
//             saving ? 'bg-gray-400' : 'bg-primary'
//           }`}
//           onPress={saveCard}
//           disabled={saving}
//         >
//           <Text className="text-white font-bold text-lg">
//             {saving ? 'Saving...' : 'Save Card'}
//           </Text>
//         </TouchableOpacity>
//       </ScrollView>

//       {/* Scanner */}
//       <Modal visible={scannerVisible} animationType="slide">
//         <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
//           <CameraView
//             style={{ flex: 1 }}
//             onBarcodeScanned={
//               scanned ? undefined : handleBarcodeScanned
//             }
//             barcodeScannerSettings={{
//               barcodeTypes: [
//                 'ean13',
//                 'ean8',
//                 'code128',
//                 'code39',
//                 'upc_a',
//                 'upc_e',
//               ],
//             }}
//           />

//           {/* Overlay */}
//           <View
//             style={{
//               position: 'absolute',
//               top: '30%',
//               left: '5%',
//               width: '90%',
//               height: 120,
//               borderWidth: 2,
//               borderColor: '#00FF00',
//               borderRadius: 8,
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}
//           >
//             <Text style={{ color: '#00FF00', fontWeight: 'bold' }}>
//               Place barcode here
//             </Text>
//           </View>

//           <TouchableOpacity
//             style={{
//               position: 'absolute',
//               top: 40,
//               right: 20,
//               backgroundColor: '#000000aa',
//               padding: 10,
//               borderRadius: 20,
//             }}
//             onPress={() => setScannerVisible(false)}
//           >
//             <Ionicons name="close" size={24} color="#fff" />
//           </TouchableOpacity>
//         </SafeAreaView>
//       </Modal>
//     </SafeAreaView>
//   );
// }

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, ScrollView, Alert, Modal, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { PanResponder } from 'react-native';

export default function AddNewCardScreen() {
  const window = Dimensions.get('window');
  const displayWidth = window.width;
  const displayHeight = window.height * 0.7;

  // States
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [cropSide, setCropSide] = useState<'front' | 'back' | null>(null);
  const [cropImageUri, setCropImageUri] = useState<string | null>(null);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [barcode, setBarcode] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // Scanner states
  const [scannerVisible, setScannerVisible] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  // Crop rectangle state
  const [cropRect, setCropRect] = useState({
    x: displayWidth * 0.1,
    y: displayHeight * 0.25,
    width: displayWidth * 0.8,
    height: displayHeight * 0.35,
  });

  const [dragMode, setDragMode] = useState<null | 'move' | 'resize'>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [rectStart, setRectStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const cropRectRef = React.useRef(cropRect);

  React.useEffect(() => {
    cropRectRef.current = cropRect;
  }, [cropRect]);

  React.useEffect(() => {
    if (scannerVisible) {
      setScanned(false);
      setShowManualEntry(false);
      setManualBarcode('');
    }
  }, [scannerVisible]);

  const MIN_SIZE = 60;

  // Pan responder for crop rectangle
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (e, gestureState) => {
      const touchX = gestureState.x0;
      const touchY = gestureState.y0;
      const c = cropRectRef.current;

      // Check corners for resize
      const cornerSize = 50;
      const corners = [
        { x: c.x, y: c.y },
        { x: c.x + c.width, y: c.y },
        { x: c.x, y: c.y + c.height },
        { x: c.x + c.width, y: c.y + c.height },
      ];

      for (const corner of corners) {
        if (Math.abs(touchX - corner.x) < cornerSize && Math.abs(touchY - corner.y) < cornerSize) {
          setDragMode('resize');
          setRectStart({ ...c });
          setDragStart({ x: gestureState.x0, y: gestureState.y0 });
          return;
        }
      }

      // Check if inside for moving
      if (touchX > c.x && touchX < c.x + c.width && touchY > c.y && touchY < c.y + c.height) {
        setDragMode('move');
        setRectStart({ ...c });
        setDragStart({ x: gestureState.x0, y: gestureState.y0 });
      }
    },
    onPanResponderMove: (e, gestureState) => {
      const dx = gestureState.moveX - dragStart.x;
      const dy = gestureState.moveY - dragStart.y;
      const c = { ...rectStart };

      if (dragMode === 'move') {
        let newX = c.x + dx;
        let newY = c.y + dy;
        newX = Math.max(0, Math.min(newX, displayWidth - c.width));
        newY = Math.max(0, Math.min(newY, displayHeight - c.height));
        setCropRect({ ...c, x: newX, y: newY });
      } else if (dragMode === 'resize') {
        let newWidth = Math.max(MIN_SIZE, c.width + dx * 1.5);
        let newHeight = Math.max(MIN_SIZE, c.height + dy * 1.5);

        if (c.x + newWidth > displayWidth) newWidth = displayWidth - c.x;
        if (c.y + newHeight > displayHeight) newHeight = displayHeight - c.y;

        const newX = c.x + c.width / 2 - newWidth / 2;
        const newY = c.y + c.height / 2 - newHeight / 2;

        setCropRect({ x: Math.max(0, newX), y: Math.max(0, newY), width: newWidth, height: newHeight });
      }
    },
    onPanResponderRelease: () => {
      setDragMode(null);
    },
  });

  // Image Picker Functions
  const takePhoto = async (side: 'front' | 'back') => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera access is needed to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length) {
      setCropSide(side);
      setCropImageUri(result.assets[0].uri);
    }
  };

  const pickImage = async (side: 'front' | 'back') => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Gallery access is needed to select photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length) {
      setCropSide(side);
      setCropImageUri(result.assets[0].uri);
    }
  };

  const handleCrop = async () => {
    if (!cropImageUri) return;

    Image.getSize(cropImageUri, async (imgWidth, imgHeight) => {
      const scaleX = imgWidth / displayWidth;
      const scaleY = imgHeight / displayHeight;

      const manipResult = await ImageManipulator.manipulateAsync(
        cropImageUri,
        [
          {
            crop: {
              originX: cropRect.x * scaleX,
              originY: cropRect.y * scaleY,
              width: cropRect.width * scaleX,
              height: cropRect.height * scaleY,
            },
          },
        ],
        { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
      );

      if (cropSide === 'front') setFrontImage(manipResult.uri);
      if (cropSide === 'back') setBackImage(manipResult.uri);

      setCropSide(null);
      setCropImageUri(null);
    });
  };

  // Barcode Scanner Functions
  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    setBarcode(data);
    setScannerVisible(false);
    setTimeout(() => {
      Alert.alert('Success', `Barcode scanned: ${data}`);
    }, 300);
  };

  const handleManualEntry = () => {
    if (manualBarcode.trim()) {
      setBarcode(manualBarcode.trim());
      setScannerVisible(false);
      setManualBarcode('');
      Alert.alert('Success', 'Barcode added manually');
    } else {
      Alert.alert('Error', 'Please enter a valid barcode');
    }
  };

  // Save Card Function
  const saveCard = async () => {
    if (!cardName.trim()) {
      Alert.alert('Required Field', 'Please enter a card name.');
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
      Alert.alert('Success', 'Card saved successfully!', [
        { text: 'OK', onPress: () => router.push('../add-card') },
      ]);
    } catch {
      Alert.alert('Error', 'Failed to save card. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('../add-card')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Card</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Subtitle */}
        <Text style={styles.subtitle}>Create your new loyalty or payment card</Text>

        {/* Card Images Section */}
        <View style={styles.cardImagesSection}>
          <Text style={styles.sectionTitle}>Card Images</Text>
          
          <View style={styles.cardImagesGrid}>
            {/* Front Card */}
            <View style={styles.cardImageWrapper}>
              <TouchableOpacity
                style={styles.cardImageContainer}
                onPress={() => {
                  if (!frontImage) {
                    Alert.alert('Add Front Image', 'Choose an option', [
                      { text: 'Take Photo', onPress: () => takePhoto('front') },
                      { text: 'From Gallery', onPress: () => pickImage('front') },
                      { text: 'Cancel', style: 'cancel' },
                    ]);
                  }
                }}
              >
                {frontImage ? (
                  <Image source={{ uri: frontImage }} style={styles.cardImage} resizeMode="cover" />
                ) : (
                  <View style={styles.emptyCardPlaceholder}>
                    <Ionicons name="card" size={48} color="#6366F1" />
                    <Text style={styles.placeholderText}>Front Side</Text>
                  </View>
                )}
              </TouchableOpacity>
              
              <View style={styles.cardImageActions}>
                {frontImage && (
                  <TouchableOpacity style={styles.iconButton} onPress={() => setFrontImage(null)}>
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.iconButton, styles.primaryIconButton]}
                  onPress={() =>
                    Alert.alert('Add Front Image', 'Choose an option', [
                      { text: 'Take Photo', onPress: () => takePhoto('front') },
                      { text: 'From Gallery', onPress: () => pickImage('front') },
                      { text: 'Cancel', style: 'cancel' },
                    ])
                  }
                >
                  <Ionicons name="camera" size={18} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Back Card */}
            <View style={styles.cardImageWrapper}>
              <TouchableOpacity
                style={styles.cardImageContainer}
                onPress={() => {
                  if (!backImage) {
                    Alert.alert('Add Back Image', 'Choose an option', [
                      { text: 'Take Photo', onPress: () => takePhoto('back') },
                      { text: 'From Gallery', onPress: () => pickImage('back') },
                      { text: 'Cancel', style: 'cancel' },
                    ]);
                  }
                }}
              >
                {backImage ? (
                  <Image source={{ uri: backImage }} style={styles.cardImage} resizeMode="cover" />
                ) : (
                  <View style={styles.emptyCardPlaceholder}>
                    <Ionicons name="barcode" size={48} color="#6366F1" />
                    <Text style={styles.placeholderText}>Back Side</Text>
                  </View>
                )}
              </TouchableOpacity>
              
              <View style={styles.cardImageActions}>
                {backImage && (
                  <TouchableOpacity style={styles.iconButton} onPress={() => setBackImage(null)}>
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.iconButton, styles.primaryIconButton]}
                  onPress={() =>
                    Alert.alert('Add Back Image', 'Choose an option', [
                      { text: 'Take Photo', onPress: () => takePhoto('back') },
                      { text: 'From Gallery', onPress: () => pickImage('back') },
                      { text: 'Cancel', style: 'cancel' },
                    ])
                  }
                >
                  <Ionicons name="camera" size={18} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Card Details Section */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Card Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Card Name *</Text>
            <TextInput
              style={styles.textInput}
              value={cardName}
              onChangeText={setCardName}
              placeholder="Enter card name"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Card Number</Text>
            <TextInput
              style={styles.textInput}
              value={cardNumber}
              onChangeText={setCardNumber}
              placeholder="Optional"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Barcode</Text>
            <TouchableOpacity
              style={styles.barcodeInput}
              onPress={async () => {
                if (!cameraPermission?.granted) await requestCameraPermission();
                setScannerVisible(true);
              }}
            >
              <Ionicons name="barcode-outline" size={24} color="#6366F1" />
              <Text style={barcode ? styles.barcodeText : styles.barcodePlaceholder}>
                {barcode || 'Tap to scan barcode'}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Notes</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any additional notes..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={saveCard}
          disabled={saving}
        >
          <Ionicons name="checkmark-circle" size={24} color="#FFF" />
          <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save Card'}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Crop Modal */}
      <Modal visible={!!cropImageUri} animationType="slide" transparent={false}>
        <SafeAreaView style={styles.cropModalContainer} edges={['top', 'bottom']}>
          <View style={styles.cropHeader}>
            <TouchableOpacity onPress={() => { setCropSide(null); setCropImageUri(null); }}>
              <Text style={styles.cropCancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.cropTitle}>Adjust Image</Text>
            <TouchableOpacity onPress={handleCrop}>
              <Text style={styles.cropDoneText}>Done</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cropContent} {...panResponder.panHandlers}>
            {cropImageUri && (
              <>
                <Image source={{ uri: cropImageUri }} style={styles.cropImage} resizeMode="contain" />
                <View
                  style={[
                    styles.cropOverlay,
                    {
                      left: cropRect.x,
                      top: cropRect.y,
                      width: cropRect.width,
                      height: cropRect.height,
                    },
                  ]}
                >
                  <View style={[styles.cropCorner, styles.topLeftCorner]} />
                  <View style={[styles.cropCorner, styles.topRightCorner]} />
                  <View style={[styles.cropCorner, styles.bottomLeftCorner]} />
                  <View style={[styles.cropCorner, styles.bottomRightCorner]} />
                </View>
              </>
            )}
          </View>

          <View style={styles.cropInstructions}>
            <Ionicons name="information-circle-outline" size={20} color="#6366F1" />
            <Text style={styles.cropInstructionsText}>
              Drag the corners to resize or move the frame to adjust your crop
            </Text>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Barcode Scanner Modal */}
      <Modal visible={scannerVisible} animationType="slide">
        <SafeAreaView style={styles.scannerContainer} edges={['top', 'bottom']}>
          <View style={styles.scannerHeader}>
            <Text style={styles.scannerHeaderTitle}>Scan Barcode</Text>
            <TouchableOpacity onPress={() => setScannerVisible(false)} style={styles.scannerCloseButton}>
              <Ionicons name="close-circle" size={32} color="#6366F1" />
            </TouchableOpacity>
          </View>

          {!showManualEntry ? (
            <>
              <View style={styles.cameraContainer}>
                <CameraView
                  style={styles.camera}
                  onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                  barcodeScannerSettings={{
                    barcodeTypes: ['ean13', 'ean8', 'code128', 'code39', 'upc_a', 'upc_e', 'qr'],
                  }}
                  enableTorch={flashEnabled}
                />
                <View style={styles.scannerFrameContainer}>
                  <View style={styles.scannerFrame}>
                    <View style={[styles.scannerCornerBorder, styles.topLeftBorder]} />
                    <View style={[styles.scannerCornerBorder, styles.topRightBorder]} />
                    <View style={[styles.scannerCornerBorder, styles.bottomLeftBorder]} />
                    <View style={[styles.scannerCornerBorder, styles.bottomRightBorder]} />
                  </View>
                  <Text style={styles.scannerInstruction}>
                    Position barcode within the frame
                  </Text>
                </View>
              </View>

              <View style={styles.scannerControls}>
                <TouchableOpacity
                  style={styles.scannerControlButton}
                  onPress={() => setShowManualEntry(true)}
                >
                  <Ionicons name="keypad" size={24} color="#6366F1" />
                  <Text style={styles.scannerControlText}>Enter Manually</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.scannerControlButton}
                  onPress={() => setFlashEnabled(!flashEnabled)}
                >
                  <Ionicons
                    name={flashEnabled ? 'flash' : 'flash-off'}
                    size={24}
                    color={flashEnabled ? '#6366F1' : '#9CA3AF'}
                  />
                  <Text style={[styles.scannerControlText, flashEnabled && styles.scannerControlTextActive]}>
                    Flashlight
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.manualEntryContainer}>
              <Text style={styles.manualEntryTitle}>Enter Barcode Number</Text>
              <Text style={styles.manualEntrySubtitle}>
                Type the barcode number manually if scanning doesn't work
              </Text>

              <TextInput
                style={styles.manualEntryInput}
                value={manualBarcode}
                onChangeText={setManualBarcode}
                placeholder="Enter barcode number"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                autoFocus
              />

              <TouchableOpacity style={styles.manualEntrySubmit} onPress={handleManualEntry}>
                <Text style={styles.manualEntrySubmitText}>Add Barcode</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.manualEntryBack}
                onPress={() => setShowManualEntry(false)}
              >
                <Ionicons name="arrow-back" size={20} color="#6366F1" />
                <Text style={styles.manualEntryBackText}>Back to Scanner</Text>
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 40,
    paddingTop: 8,
    paddingBottom: 24,
  },
  cardImagesSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  cardImagesGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  cardImageWrapper: {
    flex: 1,
  },
  cardImageContainer: {
    aspectRatio: 1.6,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  emptyCardPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  placeholderText: {
    fontSize: 13,
    color: '#6366F1',
    fontWeight: '600',
  },
  cardImageActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  primaryIconButton: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  detailsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
    textAlignVertical: 'top',
  },
  barcodeInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  barcodeText: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  barcodePlaceholder: {
    flex: 1,
    fontSize: 16,
    color: '#9CA3AF',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366F1',
    marginHorizontal: 20,
    marginBottom: 40,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  // Crop Modal Styles
  cropModalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  cropHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1F2937',
  },
  cropCancelText: {
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  cropTitle: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: '700',
  },
  cropDoneText: {
    fontSize: 16,
    color: '#6366F1',
    fontWeight: '700',
  },
  cropContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cropImage: {
    width: '100%',
    height: '100%',
  },
  cropOverlay: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: '#6366F1',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  cropCorner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#6366F1',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  topLeftCorner: { top: -12, left: -12 },
  topRightCorner: { top: -12, right: -12 },
  bottomLeftCorner: { bottom: -12, left: -12 },
  bottomRightCorner: { bottom: -12, right: -12 },
  cropInstructions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#1F2937',
    gap: 8,
  },
  cropInstructionsText: {
    fontSize: 14,
    color: '#9CA3AF',
    flex: 1,
  },
  // Scanner Modal Styles
  scannerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  scannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1F2937',
  },
  scannerHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },
  scannerCloseButton: {
    padding: 4,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  scannerFrameContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    width: '75%',
    aspectRatio: 1.8,
    position: 'relative',
  },
  scannerCornerBorder: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#6366F1',
  },
  topLeftBorder: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 8,
  },
  topRightBorder: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 8,
  },
  bottomLeftBorder: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 8,
  },
  bottomRightBorder: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 8,
  },
  scannerInstruction: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 24,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  scannerControls: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 16,
  },
  scannerControlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#374151',
    borderRadius: 12,
    gap: 12,
  },
  scannerControlText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  scannerControlTextActive: {
    color: '#6366F1',
  },
  manualEntryContainer: {
    flex: 1,
    padding: 24,
    backgroundColor: '#FFF',
  },
  manualEntryTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  manualEntrySubtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 32,
  },
  manualEntryInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 18,
    color: '#111827',
    borderWidth: 2,
    borderColor: '#6366F1',
    marginBottom: 20,
  },
  manualEntrySubmit: {
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  manualEntrySubmitText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  manualEntryBack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  manualEntryBackText: {
    fontSize: 16,
    color: '#6366F1',
    fontWeight: '600',
  },
});