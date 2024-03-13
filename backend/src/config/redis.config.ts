import dotenv from 'dotenv';
dotenv.config();

import { Redis } from '@upstash/redis';

export const client = new Redis({
	cache: 'force-cache',
	url: process.env.REDIS_URL!,
	token: process.env.REDIS_TOKEN!,
	automaticDeserialization: true,
});
