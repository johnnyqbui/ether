import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { firestore, auth } from '../firebase';

interface Post {
  id: string;
  userId: string;
  text: string;
  imageUrl?: string;
  likes: string[];
  timestamp: Date;
}

const FeedScreen = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const navigation = useNavigation();

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

  console.log({ posts })

  // Render each post item
  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postContainer}>
      <Text style={styles.postText}>{item.text}</Text>
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
      )}
      <View style={styles.likeContainer}>
        <Button
          title={`Likes: ${item.likes?.length || 0}`}
          onPress={() => handleLike(item.id)}
        />
      </View>
    </View>
  );

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
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  postText: {
    fontSize: 16,
    marginBottom: 8,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default FeedScreen;