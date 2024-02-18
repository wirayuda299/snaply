import { Category, Card, PostCard } from '@/components/index';
import PodcastCard from '@/components/shared/podcast-card';
import { getAllPodcasts, getAllMeetups } from '@/lib/actions';

type Props = {
	searchParams: {
		category: string;
	};
};
export default async function Meetups({ searchParams }: Props) {
	const meetups = await getAllMeetups();
	const podcasts = await getAllPodcasts('popular', 1, 3);
	const categoriesSet = new Set(meetups.map((meetup) => meetup.category));
	const category = searchParams?.category;

	return (
		<div className='flex flex-col gap-5 py-5 lg:flex-row'>
			<section className='top-0 w-80 max-lg:w-full lg:sticky lg:h-screen'>
				<Category categories={Array.from(categoriesSet)} title='Categories' />
			</section>
			<section className='w-full space-y-5'>
				{category
					? meetups
							.filter((meetup) => meetup.category === category)
							.map((meetup) => (
								<PostCard type='meetup' key={meetup._id} post={meetup} />
							))
					: meetups?.map((meetup) => (
							<PostCard type='meetup' key={meetup._id} post={meetup} />
						))}
			</section>
			<section className='top-0 w-[300px] space-y-5 max-lg:w-full lg:sticky  lg:h-screen'>
				<Card
					path='/create?type=meetup'
					btnLeftText='Code of Conduct'
					btnRightText='Host a Meetup'
					title='Host a meetup'
					text='Find other Hipnoders in your area so you can learn, share, and work together.'
				/>
				<PodcastCard podcasts={podcasts.podcasts} />
			</section>
		</div>
	);
}
