import { Meetup, Podcast, Post } from '@/types';
import { getPostById } from './post.action';
import { getMeetupById } from './meetup.action';
import { getPodcastById } from './podcast.action';

interface PostResult {
	post: Post;
}

interface MeetupResult {
	meetup: Meetup;
}

export async function getData(type: string, postId: string) {
	switch (type) {
		case 'post':
			return (await getPostById(postId)) as PostResult;
		case 'meetup':
			return (await getMeetupById(postId)) as MeetupResult;
		case 'podcast':
			return (await getPodcastById(postId)) as Podcast;
		default:
			return undefined;
	}
}
