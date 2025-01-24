import axios from 'axios';
import Config from 'react-native-config';

const DEEPSEEK_API_KEY = Config.DS_API_KEY // Replace with your DeepSeek API key
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/images/generate'; // Replace with the actual DeepSeek API endpoint

export const generateProfilePicture = async (prompt: string) => {
    try {
        const response = await axios.post(
            DEEPSEEK_API_URL,
            {
                prompt: prompt,
                n: 1, // Number of images to generate
                size: '256x256', // Image size
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
                },
            }
        );

        console.log({ response })

        return response.data.data[0].url; // Return the generated image URL
    } catch (error) {
        console.error('Error generating profile picture:', error);
        throw error;
    }
};