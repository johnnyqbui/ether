import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const List = ({ experiences }) => {
    return (
        <FlatList
            data={experiences}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={styles.experienceItem}>
                    <Text style={styles.experienceName}>{item.name}</Text>
                    <Text style={styles.experienceLocations}>{item.locations.join(', ')}</Text>
                </View>
            )}
        />
    );
};

const styles = StyleSheet.create({
    experienceItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    experienceName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    experienceLocations: {
        fontSize: 14,
        color: '#666',
    },
});

export default List;