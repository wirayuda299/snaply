import {
	PostCard,
	MeetupCard,
	HomeFilter,
	HomeCreatePost,
	PopularTagsCard,
	SharedPodcastCard,
	Pagination,
} from '@/components/index';

import {
	getAllTags,
	getAllPosts,
	getAllMeetups,
	getAllPodcasts,
} from '@/lib/actions';
import { Suspense } from 'react';

type Props = {
	params: { slug: string };
	searchParams: {
		sort: 'popular' | 'newest';
		page: number | undefined;
	};
};

export default async function Home({ searchParams }: Props) {
	const [{ allPosts, totalPages }, allTags, meetups, podcasts] =
		await Promise.all([
			getAllPosts(searchParams.sort as string, searchParams.page),
			getAllTags(),
			getAllMeetups(),
			getAllPodcasts('popular', 1, 3),
		]);

	return (
		<section className='flex size-full flex-col gap-3 pb-20 lg:flex-row'>
			<div className='top-0 flex flex-col gap-5 lg:sticky lg:h-screen'>
				<HomeFilter
					innerStyles='md:space-x-0 gap-8 justify-center '
					rootStyles='max-h-min h-min'
					titleStyles='hidden sm:block'
				/>

				{allTags?.length >= 1 && (
					<PopularTagsCard items={allTags} styles='hidden md:block' />
				)}
			</div>
			<section className='flex size-full grow flex-col gap-5'>
				<HomeCreatePost />
				<Suspense
					fallback={
						<div className='dark:bg-secondary-dark min-h-[200px] w-full animate-pulse rounded-lg bg-white'></div>
					}
				>
					{allPosts?.map((post) => (
						<PostCard type='post' key={post.title} post={post} />
					))}
				</Suspense>

				{allTags.length >= 1 && (
					<PopularTagsCard
						items={allTags}
						styles='block md:hidden'
						innerStyles='justify-start !items-start'
					/>
				)}
				<Pagination totalPages={totalPages} />
			</section>
			<section className='top-0 min-w-80 space-y-5 max-lg:min-w-full lg:sticky lg:h-screen'>
				{meetups.meetups.length >= 1 && (
					<MeetupCard meetups={meetups.meetups} />
				)}

				{podcasts?.allPodcasts.length >= 1 && (
					<SharedPodcastCard podcasts={podcasts.allPodcasts} />
				)}
			</section>
		</section>
	);
}
