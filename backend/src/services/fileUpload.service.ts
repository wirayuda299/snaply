import cloudinary from 'cloudinary';
import { Request, Response } from 'express';

import { cloudinaryConfig } from '../config/cloudinary.config';

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
						public_id: response.public_id,
						secure_url: response.secure_url,
					})
					.end();
			}
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ message: error.message, error: true });
			}
		}
	}
}
