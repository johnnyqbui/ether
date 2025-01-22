import React, { useState } from 'react';
import { View, TextInput, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { firestore, storage, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function CreatePostScreen() {
  const [text, setText] = useState<string>('');
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access location was denied');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  const uploadImage = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `images/${new Date().toISOString()}`);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  };

  const handlePost = async () => {
    const imageUrl = image ? await uploadImage(image) : null;
    const userId = auth.currentUser?.uid;

    if (userId) {
      await addDoc(collection(firestore, 'posts'), {
        userId,
        text,
        imageUrl,
        location,
        likes: [],
        comments: [],
        timestamp: new Date(),
      });
    }
  };

  return (
    <View>
      <TextInput placeholder="What's on your mind?" value={text} onChangeText={setText} />
      <Button title="Pick an image" onPress={pickImage} />
      <Button title="Add Location" onPress={getLocation} />
      <Button title="Post" onPress={handlePost} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
    </View>
  );
}