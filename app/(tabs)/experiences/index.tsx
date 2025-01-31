import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button } from 'react-native';
import { Link } from 'expo-router';
import List from '@/components/List';

export default function Experiences() {
    const [experiences, setExperiences] = useState([
        { id: '1', name: 'Weekend in Paris', locations: ['Eiffel Tower', 'Louvre Museum'] },
        { id: '2', name: 'New York Adventure', locations: ['Central Park', 'Times Square'] },
    ]);

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>My Experiences</Text>
            <List experiences={experiences} />
            <Link href="./create" asChild>
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        bottom: 20,
                        right: 20,
                        backgroundColor: 'blue',
                        borderRadius: 30,
                        width: 60,
                        height: 60,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ color: 'white', fontSize: 24 }}>+</Text>
                </TouchableOpacity>
            </Link>
        </View>
    );
}