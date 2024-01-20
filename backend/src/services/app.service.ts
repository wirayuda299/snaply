import dotenv from 'dotenv';
dotenv.config();

import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

import Database from '../controllers/db.controller';
import userRoutes from '../routes/user.route';
import postRoutes from '../routes/post.route';
import commentRoutes from '../routes/comment.route';
import groupRoutes from '../routes/group.route';
import meetupRoutes from '../routes/meetup.route';
import Middleware from '../middleware/middleware';

export default class AppService {
	private app;
	private corsAllowUrl = process.env.CLIENT_URL;

	setCorsHeaders = (req: Request, res: Response, next: NextFunction) => {
		res.setHeader('Access-Control-Allow-Origin', this.corsAllowUrl!);
		res.setHeader(
			'Access-Control-Allow-Methods',
			'GET, POST, PATCH, PUT, DELETE'
		);
		res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
		res.setHeader('Access-Control-Allow-Credentials', 'true');
		next();
	};
	database = new Database(process.env.DATABASE_URL!);
	constructor(private readonly port = process.env.PORT! || 3000) {
		if (!this.port) {
			throw new Error('Invalid port number');
		}

		this.app = express();
		this.app.use(helmet());
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(this.setCorsHeaders);
		this.app.use(compression());
		this.app.disable('x-powered-by');
		this.app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

		this.app.use('/api/user', userRoutes);
		this.app.use('/api/post', Middleware.validate, postRoutes);
		this.app.use('/api/comment', Middleware.validate, commentRoutes);
		this.app.use('/api/group', Middleware.validate, groupRoutes);
		this.app.use('/api/meetup', Middleware.validate, meetupRoutes);
	}

	listen() {
		this.app.listen(this.port, async () => {
			try {
				await this.database.connectToDb().then(() => {
					console.log(
						`⚡️[server]: Server is running at https://localhost:${this.port}`
					);
				});
			} catch (error) {
				console.error(`Failed to start server: ${error}`);
			}
		});
	}

	connectDb() {
		return this.database.connectToDb();
	}
}
