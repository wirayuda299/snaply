import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

export const client =
	process.env.NODE_ENV === 'production'
		? createClient({
				url: 'rediss://default:f651f52905834b8e9e2015b1cec7b812@engaged-liger-45328.upstash.io:45328',
		  })
		: createClient();

// {
// 	password: 'ldYRgzwcEP4736yi6dmFZbHas81Y6RIC',
// 	socket: {
// 		host: 'redis-15920.c322.us-east-1-2.ec2.cloud.redislabs.com',
// 		port: 15920,
// 	},
// }

export async function connectRedis() {
	try {
		await client
			.on('error', (error) => {
				console.log(error);

				throw error;
			})
			.connect()
			.then((res) => {
				console.log('connected to redis -> ', res.ACL_USERS);
			});
	} catch (error) {
		throw error;
	}
}
