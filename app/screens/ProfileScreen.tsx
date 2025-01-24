import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Alert } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore, auth } from '../firebase';
import { generateProfilePicture } from '../deepseek';

const ProfileScreen = () => {
  const [bio, setBio] = useState<string>('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const userId = auth.currentUser?.uid;

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;

      const userRef = doc(firestore, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        setBio(userDoc.data().bio || '');
        setProfilePicture(userDoc.data().profilePicture || null);
      }
    };

    fetchProfile();
  }, [userId]);

  // Save bio to Firestore
  const handleSaveBio = async () => {
    if (!userId) return;

    try {
      const userRef = doc(firestore, 'users', userId);
      await updateDoc(userRef, { bio });
      Alert.alert('Success', 'Bio updated!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update bio');
    }
  };

  // Generate and save AI profile picture
  const handleGenerateProfilePicture = async () => {
    if (!userId) return;

    try {
      const prompt = "A futuristic avatar for a social media user"; // Set your AI prompt
      const imageUrl = await generateProfilePicture(prompt); // Generate the image using DeepSeek

      const userRef = doc(firestore, 'users', userId);
      await updateDoc(userRef, { profilePicture: imageUrl });
      setProfilePicture(imageUrl); // Update the local state
      Alert.alert('Success', 'Profile picture updated!');
    } catch (error) {
      console.log({ error })
      Alert.alert('Error', 'Failed to generate profile picture');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      {profilePicture && (
        <Image source={{ uri: profilePicture }} style={styles.profileImage} />
      )}

      <Button
        title="Generate Profile Picture"
        onPress={handleGenerateProfilePicture}
      />

      <TextInput
        placeholder="Enter your bio"
        value={bio}
        onChangeText={setBio}
        style={styles.bioInput}
        multiline
      />

      <Button title="Save Bio" onPress={handleSaveBio} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  bioInput: {
    marginBottom: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    minHeight: 100,
  },
});

export default ProfileScreen;