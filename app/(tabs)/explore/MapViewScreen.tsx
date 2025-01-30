import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
// import firebase from '@react-native-firebase/app';
// import '@react-native-firebase/firestore';

// Define the structure of a travel plan
interface TravelPlan {
    id: string;
    title: string;
    description: string;
    latitude: number;
    longitude: number;
    startDate?: string;
    endDate?: string;
}

const MapViewScreen: React.FC = () => {
    const [plans, setPlans] = useState<TravelPlan[]>([]); // Stores travel plans
    const [region, setRegion] = useState<Region>({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    // Fetch travel plans from Firestore
    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const plansSnapshot = await firebase.firestore().collection('plans').get();
                const plansData = plansSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as TravelPlan[];
                setPlans(plansData);

                // Set initial map region to the first plan's location
                if (plansData.length > 0) {
                    const firstPlan = plansData[0];
                    setRegion({
                        latitude: firstPlan.latitude,
                        longitude: firstPlan.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    });
                }
            } catch (error) {
                console.error('Error fetching plans:', error);
            }
        };

        fetchPlans();
    }, []);

    // Request location permission and set user's current location
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
        })();
    }, []);

    return (
        <View style={styles.container}>
            <MapView style={styles.map} region={region} onRegionChangeComplete={setRegion}>
                {plans.map((plan) => (
                    <Marker
                        key={plan.id}
                        coordinate={{ latitude: plan.latitude, longitude: plan.longitude }}
                        title={plan.title}
                        description={plan.description}
                    />
                ))}
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
});

export default MapViewScreen;