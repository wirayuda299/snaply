import dotenv from 'dotenv';
dotenv.config();

import winston, { transports } from 'winston';
import path from 'path';
import fs from 'fs';
import type { Request, Response } from 'express';

const logDir = 'log';

const { combine, timestamp, json, printf, prettyPrint, label, errors } =
	winston.format;
const timestampFormat = 'MMM-DD-YYYY HH:mm:ss';

const customFormat = printf(({ timestamp, level, message, ...meta }) => {
	return `${timestamp} \n ${level}: ${message}  \n ${JSON.stringify(meta)}`;
});

export default class Logger {
	constructor() {
		if (!fs.existsSync(logDir)) {
			fs.mkdirSync(logDir);
		}
	}
	createLogger(pathname: string) {
		return winston.createLogger({
			format: combine(
				timestamp({ format: timestampFormat }),
				json(),
				label({ label: pathname }),
				errors(),
				customFormat,
				prettyPrint()
			),

			transports: [
				new transports.Console(),
				new transports.File({
					filename: path.join(logDir, `${pathname}.txt`),
				}),
			],
		});
	}

	formatHTTPLoggerResponse = <T>(
		req: Request,
		res: Response,
		responseBody: T
	) => {
		const requestInfo = {
			method: req.method,
			url: req.url,
			headers: req.headers,
			body: req.body,
			params: req.params,
			query: req.query,
			clientIp: req.headers['x-forwarded-for'] ?? req.socket.remoteAddress,
		};

		const responseInfo = {
			statusCode: res.statusCode,
			headers: res.getHeaders(),
		};

		return {
			body: responseBody,
			request: requestInfo,
			response: responseInfo,
		};
	};
}
