import { client } from '../config/redis.config';

export class RedisService<T> {
	private readonly cacheExpirationTime = 3600; // Cache expiration time in seconds

	async getOrCacheData(key: string, cb: () => Promise<T>): Promise<T> {
		try {
			const cacheValue = await client.get(key);
			if (cacheValue) {
				// @ts-ignore
				return cacheValue as T;
			} else {
				// If the value is not in the cache, fetch it, cache it, and return it
				const data = await cb();
				await client.setex(key, this.cacheExpirationTime, data);
				return data;
			}
		} catch (error) {
			console.error(`Error fetching or caching data for key ${key}:`, error);
			throw error; // Rethrow the error after logging
		}
	}
}
