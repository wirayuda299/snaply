import { Response } from 'express';

export function createError(error: unknown, res: Response) {
	if (error instanceof Error) {
		res.status(500).json({ message: error.message, error: true }).end();
	} else {
		res
			.status(500)
			.json({ message: 'An unknown error occurred', error: true })
			.end();
	}
}
