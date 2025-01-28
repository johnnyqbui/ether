import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Alert, TouchableOpacity, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '../hooks/useThemeColor';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  doc,
  getDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { firestore, auth } from '../firebase';

interface Post {
  id: string;
  userId: string;
  userAvatar?: string;
  username: string;
  text: string;
  imageUrl?: string;
  likes: string[];
  comments: number;
  timestamp: Date;
}

const FeedScreen = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Fetch posts from Firestore
  useEffect(() => {
    const postsRef = collection(firestore, 'posts');
    const q = query(postsRef, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];
      setPosts(postsData);
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  // Handle like button press
  const handleLike = async (postId: string) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const postRef = doc(firestore, 'posts', postId);
    const post = await getDoc(postRef);
    const likes = post.data()?.likes || [];

    if (likes.includes(userId)) {
      // Unlike the post
      await updateDoc(postRef, {
        likes: likes.filter((id: string) => id !== userId),
      });
    } else {
      // Like the post
      await updateDoc(postRef, {
        likes: [...likes, userId],
      });
    }
  };

  // Handle post deletion
  const handleDeletePost = async (postId: string, userId: string) => {
    const currentUserId = auth.currentUser?.uid;
    if (currentUserId !== userId) {
      Alert.alert('Error', 'You can only delete your own posts');
      return;
    }

    try {
      await deleteDoc(doc(firestore, 'posts', postId)); // Delete the post from Firestore
      Alert.alert('Success', 'Post deleted!');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete post');
    }
  };

  // Render each post item
  const renderPost = ({ item }: { item: Post }) => {
    const isLiked = item.likes?.includes(auth.currentUser?.uid || '');
    const colors = useThemeColor();

    return (
      <LinearGradient
        colors={[colors.background, colors.cardBackground]}
        style={styles.postContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.postHeader}>
          <Image
            source={{ uri: item.userAvatar || 'https://i.pravatar.cc/150?img=3' }}
            style={styles.avatar}
          />
          <Text style={styles.username}>{item.username}</Text>
        </View>

        <Text style={styles.postText}>{item.text}</Text>

        {item.imageUrl && (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.postImage}
            resizeMode="cover"
          />
        )}

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleLike(item.id)}
          >
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={24}
              color={isLiked ? '#ff4757' : colors.text}
            />
            <Text style={styles.actionText}>{item.likes?.length || 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={24} color={colors.text} />
            <Text style={styles.actionText}>{item.comments || 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-social-outline" size={24} color={colors.text} />
          </TouchableOpacity>

          {auth.currentUser?.uid === item.userId && (
            <TouchableOpacity
              style={[styles.actionButton, { marginLeft: 'auto' }]}
              onPress={() => handleDeletePost(item.id, item.userId)}
            >
              <Ionicons name="trash-outline" size={24} color="#ff6b81" />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        contentContainerStyle={styles.listContainer}
      />
      <Button
        title="Create Post"
        onPress={() => navigation.navigate('CreatePost')}
      />
      <Button
        title="Go to Profile"
        onPress={() => navigation.navigate('Profile')} // Navigate to ProfileScreen
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  postContainer: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
  },
  postText: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 24,
  },
  postImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 14,
  },
});

export default FeedScreen;
