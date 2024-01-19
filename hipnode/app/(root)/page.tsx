import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import {
	HomeCreatePost,
	HomeFilter,
	MeetupCard,
	PodcastCard,
	PostCard,
} from '@/components/index';
import { FILTER_ITEMS } from '@/constants/home';
import { getAllPosts } from '@/lib/actions/post.action';
const PopularTags = dynamic(() => import('@/components/shared/popular-tags'));
const Loader = dynamic(() => import('@/components/shared/Loader'));

export default async function Home() {
	const { posts } = await getAllPosts('popular', 1, 10);
	const tags = posts.map((post) => post.tags).flat(2);

	return (
		<section className='flex flex-col gap-3 py-5 lg:flex-row'>
			<div className='top-0 flex flex-col gap-5 lg:sticky lg:h-screen'>
				<HomeFilter
					items={FILTER_ITEMS}
					innerStyles='md:space-x-0 gap-8 justify-center'
					rootStyles='max-h-min h-min'
					titleStyles='hidden sm:block'
				/>
				<Suspense fallback='Loading....'>
					{tags.length >= 1 && (
						<PopularTags
							items={Array.from(new Set(tags))}
							styles='hidden md:block'
						/>
					)}
				</Suspense>
			</div>
			<section className='flex w-full flex-col gap-5'>
				<HomeCreatePost />
				<Suspense fallback={<Loader />}>
					{posts?.map((post) => (
						<PostCard type='post' key={post.title} post={post} />
					))}
				</Suspense>
				<Suspense fallback='Loading...'>
					{tags.length >= 1 && (
						<PopularTags
							items={Array.from(new Set(tags))}
							styles='block md:hidden'
							innerStyles='justify-start items-start'
						/>
					)}
				</Suspense>
			</section>
			<section className='top-0 w-80 space-y-5 max-lg:w-full lg:sticky lg:h-screen'>
				<MeetupCard />
				<PodcastCard />
			</section>
		</section>
	);
}
