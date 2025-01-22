import React, { useState } from 'react';
import { View, Text, Image, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth, storage, firestore } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';

export default function ProfileScreen() {
  const [avatar, setAvatar] = useState<string | null>(null);

  const pickAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
      await uploadAvatar(result.assets[0].uri);
    }
  };

  const uploadAvatar = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `avatars/${auth.currentUser?.uid}`);
    await uploadBytes(storageRef, blob);
    const avatarUrl = await getDownloadURL(storageRef);
    await updateDoc(doc(firestore, 'users', auth.currentUser?.uid), { avatarUrl });
  };

  return (
    <View>
      <Text>Profile</Text>
      {avatar && <Image source={{ uri: avatar }} style={{ width: 100, height: 100, borderRadius: 50 }} />}
      <Button title="Upload Avatar" onPress={pickAvatar} />
    </View>
  );
}