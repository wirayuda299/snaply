import dotenv from 'dotenv';
dotenv.config();

import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

import Middleware from '../middleware/middleware';

import Database from '../services/db.service';
import userRoutes from '../routes/user.route';
import postRoutes from '../routes/post.route';
import commentRoutes from '../routes/comment.route';
import groupRoutes from '../routes/group.route';
import meetupRoutes from '../routes/meetup.route';
import NotificationRoutes from '../routes/notification.route';
import podcastRoutes from '../routes/podcast.route';
import fileUploadRoutes from '../routes/fileupload.route';
import tagsRoutes from '../routes/tag.route';
import reportRoutes from '../routes/report.route';
import searchRoutes from '../routes/search.route';

export default class Application {
	private corsAllowUrl = process.env.CLIENT_URL;
	private app;

	database = new Database(process.env.DATABASE_URL);
	private readonly port = process.env.PORT! || 3000;

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

	constructor() {
		this.app = express();
		this.intializeMiddleware();
		this.intializeRoutes();
	}

	listen() {
		this.app.listen(this.port, async () => {
			try {
				await this.database.connectToDb().then(() => {
					console.log(`⚡️[server]: Server is running at port ${this.port} `);
				});
			} catch (error) {
				console.error(`Failed to start server: ${error}`);
			}
		});
	}

	intializeMiddleware() {
		this.app.use(this.setCorsHeaders);
		this.app.use(express.json());
		this.app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(helmet());
		this.app.use(compression());
		this.app.disable('x-powered-by');
	}

	intializeRoutes() {
		this.app.get('/', (req, res) => {
			res.json({ message: 'Hello from server' }).end();
		});
		this.app.use('/api/notification', Middleware.validate, NotificationRoutes);
		this.app.use('/api/podcasts', Middleware.validate, podcastRoutes);
		this.app.use('/api', fileUploadRoutes);
		this.app.use('/api/user', userRoutes);
		this.app.use('/api/post', Middleware.validate, postRoutes);
		this.app.use('/api/comment', Middleware.validate, commentRoutes);
		this.app.use('/api/group', Middleware.validate, groupRoutes);
		this.app.use('/api/meetup', Middleware.validate, meetupRoutes);
		this.app.use('/api/tags', Middleware.validate, tagsRoutes);
		this.app.use('/api/report', Middleware.validate, reportRoutes);
		this.app.use('/api/search', Middleware.validate, searchRoutes);
	}

	connectDb() {
		return this.database.connectToDb();
	}
}
