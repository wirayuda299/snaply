import { NextFunction, Request, Response } from 'express';

export default class Middleware {
	public static async validate(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		try {
			const header = req.headers.authorization?.split(' ')[1];
			if (!header) {
				return res
					.status(403)
					.json({ message: 'Unauthorized', error: true })
					.end();
			}
			return next();
		} catch (error) {
			return res
				.status(500)
				.json({ message: 'Internal Server Error', error: true })
				.end();
		}
	}
}
