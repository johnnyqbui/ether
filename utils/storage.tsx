import AsyncStorage from '@react-native-async-storage/async-storage';

// Save data to AsyncStorage
export const saveData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

// Retrieve data from AsyncStorage
export const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null;
  }
};

// Remove data from AsyncStorage
export const removeData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing data:', error);
  }
};