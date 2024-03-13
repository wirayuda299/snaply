import { client } from '../config/redis.config';
import { Response } from 'express';

export class RedisService<T> {
	private readonly cacheExpirationTime = 3600;

	async getOrCacheData(key: string, cb: () => Promise<T>, res: Response) {
		try {
			const cacheValue = await client.get(key);

			if (cacheValue) {
				return cacheValue as T;
			} else {
				const data = await cb();
				await client.setex(key, this.cacheExpirationTime, data);
				return data;
			}
		} catch (error) {
			console.log('Redis error', error);

			throw error;
		}
	}

	async addData<T>(key: string, value: T) {
		try {
			await client.append(key, JSON.stringify(value));
		} catch (error) {
			throw error;
		}
	}
	async clearCache(keyPrefix: string) {
		const keys = await client.keys(`${keyPrefix}:*`);
		if (keys.length) {
			await client.del(...keys);
		}
	}

	async clearCacheSingle(keyPrefix: string) {
		const keys = await client.keys(keyPrefix);
		if (keys.length) {
			await client.del(...keys);
		}
	}
}
