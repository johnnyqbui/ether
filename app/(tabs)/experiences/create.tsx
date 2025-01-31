import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Button, Modal, StyleSheet } from 'react-native';
import { Link, router } from 'expo-router';

// Mock data for suggested places
const suggestedPlaces = [
    { id: '1', name: 'Eiffel Tower', city: 'Paris' },
    { id: '2', name: 'Louvre Museum', city: 'Paris' },
    { id: '3', name: 'Central Park', city: 'New York' },
    { id: '4', name: 'Times Square', city: 'New York' },
    { id: '5', name: 'Golden Gate Bridge', city: 'San Francisco' },
    { id: '6', name: 'Fisherman\'s Wharf', city: 'San Francisco' },
];

export default function CreateExperience() {
    const [step, setStep] = useState(1);
    const [selectedPlaces, setSelectedPlaces] = useState([]);
    const [currentSuggestions, setCurrentSuggestions] = useState(suggestedPlaces.slice(0, 6));

    const handleSelectPlace = (place) => {
        setSelectedPlaces([...selectedPlaces, place]);
        if (step < 3) {
            setStep(step + 1);
            // Update suggestions based on the selected place (mock logic)
            setCurrentSuggestions(suggestedPlaces.slice(step * 2, step * 2 + 6));
        } else {
            // Save the experience and close the modal
            console.log('Experience created:', selectedPlaces);
            // Navigate back to the main experience screen
            router.back();
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Experience</Text>
            <Text style={styles.step}>Step {step} of 3</Text>
            <FlatList
                data={currentSuggestions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.placeItem}
                        onPress={() => handleSelectPlace(item)}
                    >
                        <Text style={styles.placeName}>{item.name}</Text>
                        <Text style={styles.placeCity}>{item.city}</Text>
                    </TouchableOpacity>
                )}
            />
            <Button title="Cancel" onPress={() => router.back()} />
        </View>
    );
}

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
    step: {
        fontSize: 16,
        marginBottom: 16,
    },
    placeItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    placeName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    placeCity: {
        fontSize: 14,
        color: '#666',
    },
});