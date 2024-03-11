import Queue from 'bull';

export const podcastQueue = new Queue('podcastQueue', {
	redis: {
		host: '127.0.0.1',
		port: 6379,
	},
});
