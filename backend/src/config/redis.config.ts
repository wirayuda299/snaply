import { createClient } from 'redis';

export const client =
	process.env.NODE_ENV === 'production'
		? createClient({
				password: 'ldYRgzwcEP4736yi6dmFZbHas81Y6RIC',
				socket: {
					host: 'redis-15920.c322.us-east-1-2.ec2.cloud.redislabs.com',
					port: 15920,
				},
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
				throw error;
			})
			.connect();
	} catch (error) {
		throw error;
	}
}
