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

type DataResult = PostResult | MeetupResult | Podcast;

export async function getData(
	type: string,
	postId: string
): Promise<DataResult | undefined> {
	let results: DataResult | undefined;

	switch (type) {
		case 'post':
			results = (await getPostById(postId)) as PostResult;
			break;
		case 'meetup':
			results = (await getMeetupById(postId)) as MeetupResult;
			break;
		case 'podcast':
			results = await getPodcastById(postId)!;
			break;
		default:
			return undefined;
	}
	return results;
}
