import AWS from 'aws-sdk';

// Configure AWS
AWS.config.update({
    accessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY,
    region: process.env.EXPO_PUBLIC_AWS_REGION,
});

const s3 = new AWS.S3();

// Upload an image to S3
export const uploadImage = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const params = {
        Bucket: 'ether-app-images', // Replace with your S3 bucket name
        Key: `images/${new Date().toISOString()}.jpg`, // Unique file name
        Body: blob,
        ContentType: 'image/jpeg', // Adjust based on the image type
    };

    try {
        const data = await s3.upload(params).promise();
        return data.Location; // Return the S3 file URL
    } catch (error) {
        console.error('Error uploading image:', error);
        return null;
    }
};