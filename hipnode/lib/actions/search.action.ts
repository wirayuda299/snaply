import { Group, Meetup, Podcast, Post } from '@/types';
import { fetchConfig } from '../utils';

export async function search(searchTerm: string) {
	const res = await fetchConfig(
		`/search/all?searchTerm=${searchTerm}`,
		['search-res'],
		'GET'
	);
	const filteredData = Object.fromEntries(
		Object.entries(res.data).filter(
			([key, value]) => Array.isArray(value) && value.length >= 1
		)
	);
	return filteredData as {
		groups: Group[];
		post: Post[];
		podcasts: Podcast[];
		meetups: Meetup[];
	};
}
