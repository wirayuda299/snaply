import {
	HomeCreatePost,
	HomeFilter,
	MeetupCard,
	PostCard,
} from '@/components/index';
import { FILTER_ITEMS } from '@/constants/home';
import { getAllPosts } from '@/lib/actions/post.action';
import PodcastCard from '@/components/shared/podcast-card';
import PopularTags from '@/components/shared/popular-tags';
import { getAllMeetups, getAllPodcasts, getAllTags } from '@/lib/actions';

type Props = {
	params: { slug: string };
	searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Home({ searchParams }: Props) {
	const { posts } = await getAllPosts(searchParams.sort as string);
	const allTags = await getAllTags();
	const meetups = await getAllMeetups();
	const podcasts = await getAllPodcasts('popular', 1, 3);

	return (
		<section className='flex h-full flex-col gap-3 pb-16 pt-10 lg:flex-row'>
			<div className='top-0 flex flex-col gap-5 lg:sticky lg:h-screen'>
				<HomeFilter
					items={FILTER_ITEMS}
					innerStyles='md:space-x-0 gap-8 justify-center'
					rootStyles='max-h-min h-min'
					titleStyles='hidden sm:block'
				/>
				{allTags?.length >= 1 && (
					<PopularTags items={allTags} styles='hidden md:block' />
				)}
			</div>
			<section className='flex size-full flex-col gap-5'>
				<HomeCreatePost />
				{posts?.map((post) => (
					<PostCard type='post' key={post.title} post={post} />
				))}
				{allTags.length >= 1 && (
					<PopularTags
						items={allTags}
						styles='block md:hidden'
						innerStyles='justify-start items-start'
					/>
				)}
			</section>
			<section className='top-0 min-w-80 space-y-5 max-lg:min-w-full lg:sticky lg:h-screen'>
				<MeetupCard meetups={meetups} />
				<PodcastCard podcasts={podcasts.podcasts} />
			</section>
		</section>
	);
}
