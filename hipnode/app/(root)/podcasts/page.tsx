import { getAllMeetups, getAllPodcasts } from '@/lib/actions';

import {
	Category,
	Card,
	MeetupCard,
	PodcastCard,
	Pagination,
} from '@/components/index';

type Props = {
	params: { slug: string };
	searchParams: { category: string; page: number | undefined };
};
export default async function Podcasts({ searchParams }: Props) {
	const [{ allPodcasts, totalPages }, { meetups }] = await Promise.all([
		getAllPodcasts('popular', searchParams.page),
		getAllMeetups(1, 3),
	]);
	const categoriesSet = new Set(allPodcasts.map((podcast) => podcast.category));
	const category = searchParams.category;

	return (
		<div className='flex flex-col gap-5 lg:flex-row'>
			<section className='top-0 w-80 max-md:w-full lg:sticky lg:h-screen'>
				<Category
					categories={Array.from(categoriesSet)}
					title='Filter by Show'
				/>
			</section>
			<section className='flex w-full grow flex-wrap gap-5'>
				{category
					? allPodcasts
							.filter((podcast) => podcast.category === category)
							?.map((podcast) => (
								<PodcastCard podcast={podcast} key={podcast._id} />
							))
					: allPodcasts?.map((podcast) => (
							<PodcastCard podcast={podcast} key={podcast._id} />
						))}
				<Pagination totalPages={totalPages} />
			</section>
			<section className='space-y-5'>
				<Card
					path='/create?type=podcasts'
					text="Working on your own internet business? We'd love to interview you!"
					title='Start Your Podcasts'
					btnLeftText='Code of Conduct'
					btnRightText='Start Your Podcasts'
				/>
				<MeetupCard meetups={meetups} />
			</section>
		</div>
	);
}
