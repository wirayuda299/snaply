import dotenv from 'dotenv';
dotenv.config();

import type { ConfigOptions } from 'cloudinary';

export const cloudinaryConfig: ConfigOptions = {
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
	secure: true,
	cloud_name: process.env.CLOUDINARY_API_CLOUD_NAME,
};
