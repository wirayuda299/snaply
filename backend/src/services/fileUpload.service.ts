import cloudinary from 'cloudinary';
import { Request, Response } from 'express';

import { cloudinaryConfig } from '../config/cloudinary.config';
import { createError } from '../utils/createError';

export default class FileUploadService {
	async upload(req: Request, res: Response) {
		try {
			if (req.file) {
				cloudinary.v2.config(cloudinaryConfig);
				const b64 = Buffer.from(req.file.buffer).toString('base64');
				let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
				const response = await cloudinary.v2.uploader.upload(dataURI, {
					resource_type: 'auto',
				});
				res
					.status(200)
					.json({
						error: false,
						public_id: response.public_id,
						secure_url: response.secure_url,
						thumbnail: response.placeholder,
					})
					.end();
			}
		} catch (error) {
			console.log(error);

			createError(error, res);
		}
	}

	async deleteAsset(assetId: string, res: Response) {
		try {
			cloudinary.v2.config(cloudinaryConfig);
			await cloudinary.v2.uploader.destroy(assetId);
		} catch (error) {
			createError(error, res);
		}
	}
}
