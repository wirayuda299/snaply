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
		<section className='flex h-full flex-col gap-3 pb-20 pt-10 lg:flex-row'>
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

				{posts?.map((post) => (
					<PostCard type='post' key={post.title} post={post} />
				))}

				{allTags.length >= 1 && (
					<PopularTagsCard
						items={allTags}
						styles='block md:hidden'
						innerStyles='justify-start !items-start'
					/>
				)}
			</section>
			<section className='top-0 min-w-80 space-y-5 max-lg:min-w-full lg:sticky lg:h-screen'>
				{meetups.length >= 1 && <MeetupCard meetups={meetups} />}
				{podcasts.length >= 1 && <SharedPodcastCard podcasts={podcasts} />}
			</section>
		</section>
	);
}
