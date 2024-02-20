import { Suspense } from 'react';

import {
	PostCard,
	MeetupCard,
	HomeFilter,
	HomeCreatePost,
	PopularTagsCard,
	SharedPodcastCard,
} from '@/components/index';
import {
	getAllTags,
	getAllPosts,
	getAllMeetups,
	getAllPodcasts,
} from '@/lib/actions';
import { FILTER_ITEMS } from '@/constants';

type Props = {
	params: { slug: string };
	searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Home({ searchParams }: Props) {
	const [{ posts }, allTags, meetups, { podcasts }] = await Promise.all([
		getAllPosts(searchParams.sort as string),
		getAllTags(),
		getAllMeetups(),
		getAllPodcasts('popular', 1, 3),
	]);

	return (
		<section className='flex h-full flex-col gap-3 pb-16 pt-10 lg:flex-row'>
			<div className='top-0 flex flex-col gap-5 lg:sticky lg:h-screen'>
				<HomeFilter
					items={FILTER_ITEMS}
					innerStyles='md:space-x-0 gap-8 justify-center'
					rootStyles='max-h-min h-min'
					titleStyles='hidden sm:block'
				/>

				<Suspense
					fallback={
						<div className='dark:bg-secondary-dark-2 min-h-[300px] min-w-[250px] bg-white'></div>
					}
				>
					{allTags?.length >= 1 && (
						<PopularTagsCard items={allTags} styles='hidden md:block' />
					)}
				</Suspense>
			</div>
			<section className='flex size-full flex-col gap-5'>
				<HomeCreatePost />
				<Suspense
					fallback={
						<div className='dark:bg-secondary-dark min-h-[300px] w-full rounded-lg bg-white'></div>
					}
				>
					{posts?.map((post) => (
						<PostCard type='post' key={post.title} post={post} />
					))}
				</Suspense>
				<Suspense
					fallback={
						<div className='dark:bg-secondary-dark-2 min-h-[300px] min-w-[250px] bg-white'></div>
					}
				>
					{allTags.length >= 1 && (
						<PopularTagsCard
							items={allTags}
							styles='block md:hidden'
							innerStyles='justify-start items-start'
						/>
					)}
				</Suspense>
			</section>
			<section className='top-0 min-w-80 space-y-5 max-lg:min-w-full lg:sticky lg:h-screen'>
				<Suspense fallback={<p>Loading meetups...</p>}>
					<MeetupCard meetups={meetups} />
				</Suspense>
				<Suspense fallback={<p>Loading podcasts</p>}>
					{podcasts.length >= 1 && <SharedPodcastCard podcasts={podcasts} />}
				</Suspense>
			</section>
		</section>
	);
}
