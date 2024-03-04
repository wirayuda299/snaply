import { getAllMeetups, getAllPodcasts } from '@/lib/actions';

import { Category, Card, MeetupCard, PodcastCard } from '@/components/index';

type Props = {
	params: { slug: string };
	searchParams: { [key: string]: string | string[] | undefined };
};
export default async function Podcasts({ searchParams }: Props) {
	const [{ podcasts }, meetups] = await Promise.all([
		getAllPodcasts(),
		getAllMeetups(),
	]);
	const categoriesSet = new Set(podcasts.map((podcast) => podcast.category));
	const category = searchParams.category;

	return (
		<div className='flex flex-col gap-5 pb-20 lg:flex-row'>
			<section className='top-0 w-80 max-md:w-full lg:sticky lg:h-screen'>
				<Category
					categories={Array.from(categoriesSet)}
					title='Filter by Show'
				/>
			</section>
			<section className='flex w-full grow flex-wrap gap-5'>
				{category
					? podcasts
							.filter((podcast) => podcast.category === category)
							?.map((podcast) => (
								<PodcastCard podcast={podcast} key={podcast._id} />
							))
					: podcasts?.map((podcast) => (
							<PodcastCard podcast={podcast} key={podcast._id} />
						))}
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
