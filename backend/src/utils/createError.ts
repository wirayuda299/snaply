import { Request, Response } from 'express';

import Logger from '../services/logger.service';

const logger = new Logger();

export function createError(
	error: unknown,
	req: Request,
	res: Response,
	pathname: string
) {
	const formattedError = logger.formatHTTPLoggerResponse(req, res, { error });
	logger
		.createLogger(pathname)
		.error('Error Message', formattedError, { error });
	if (error instanceof Error) {
		res.status(500).json({ message: error.message, error: true }).end();
	} else {
		res
			.status(500)
			.json({ message: 'An unknown error occurred', error: true })
			.end();
	}
}
