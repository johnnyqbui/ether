import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
    Feed: undefined;
    Profile: undefined;
    CreatePost: undefined;
    Auth: undefined;
};

export type FeedScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'Feed'
>;
