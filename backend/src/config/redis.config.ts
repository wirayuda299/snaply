import { Redis } from '@upstash/redis';

export const client = new Redis({
	url: 'https://engaged-liger-45328.upstash.io',
	token:
		'AbEQASQgZjhkNjRmMTYtZGI4NS00ODVjLTk5NTctZWU5MzY5NDZkZjNmZjY1MWY1MjkwNTgzNGI4ZTllMjAxNWIxY2VjN2I4MTI=',
});

// {
// 	password: 'ldYRgzwcEP4736yi6dmFZbHas81Y6RIC',
// 	socket: {
// 		host: 'redis-15920.c322.us-east-1-2.ec2.cloud.redislabs.com',
// 		port: 15920,
// 	},
// }
