import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
    Feed: undefined;
    Profile: undefined;
    CreatePost: undefined;
    Auth: undefined;
    Map: undefined;
};

export type FeedScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'Feed'
>;

export enum ActivityType {
    OUTDOOR = 'OUTDOOR',
    INDOOR = 'INDOOR',
    CULTURAL = 'CULTURAL',
    SPORTS = 'SPORTS',
    FOOD = 'FOOD'
}

export interface Location {
    latitude: number;
    longitude: number;
}

export interface Activity {
    id: string;
    name: string;
    type: ActivityType;
    location: Location;
    rating?: number;
    distance?: number;
    imageUrl?: string;
}

export interface Attraction {
    id: string;
    name: string;
    description: string;
    location: Location;
    openingHours?: string;
    priceRange?: string;
    rating?: number;
    distance?: number;
    imageUrl?: string;
}

export interface MapFilter {
    radius: number;
    types: ActivityType[];
    sortBy: 'distance' | 'rating';
}
