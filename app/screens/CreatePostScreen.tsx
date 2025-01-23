import React, { useState } from 'react';
import { View, TextInput, Button, Image, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { firestore, storage, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function CreatePostScreen() {
  const [text, setText] = useState<string>('');
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigation = useNavigation();

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
    console.log({ response, blob, storageRef })
    const result = await uploadBytes(storageRef, blob);
    console.log({ result })
    return await getDownloadURL(storageRef);
  };

  const handlePost = async () => {
    console.log('post')
    console.log({ image })
    const imageUrl = image ? await uploadImage(image) : null;
    console.log({ imageUrl })
    const userId = auth.currentUser?.uid;
    setIsLoading(true); // Show loading indicator

    if (!text.trim()) {
      Alert.alert('Error', 'Post cannot be empty');
      setIsLoading(false); // Hide loading indicator
      return;
    }

    if (!userId) {
      Alert.alert('Error', 'User not logged in');
      setIsLoading(false); // Hide loading indicator
      return;
    }

    try {
      // Add the post to Firestore
      await addDoc(collection(firestore, 'posts'), {
        userId,
        text,
        imageUrl,
        location,
        likes: [],
        comments: [],
        timestamp: new Date(),
      });

      Alert.alert('Success', 'Post created!');
      navigation.goBack(); // Go back to the previous screen
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  return (
    <View>
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
      <TextInput placeholder="What's on your mind?" value={text} onChangeText={setText} />
      <Button title="Pick an image" onPress={pickImage} />
      <Button title="Add Location" onPress={getLocation} />
      <Button title="Post" onPress={handlePost} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
    </View>
  );
}