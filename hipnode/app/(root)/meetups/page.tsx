import { Category, Card, PodcastCard, PostCard } from '@/components/index';
import { jobCategories } from '@/constants';
import { getAllMeetups } from '@/lib/actions/meetup.action';

export default async function Meetups() {
	const meetups = await getAllMeetups();

	return (
		<div className='flex flex-col gap-5 py-5 lg:flex-row'>
			<section className='top-0 w-80 max-lg:w-full lg:sticky lg:h-screen'>
				<Category categories={jobCategories} title='Categories' />
			</section>
			<section className='w-full space-y-5'>
				{meetups?.map((meetup) => (
					<PostCard type='meetup' key={meetup._id} post={meetup} />
				))}
			</section>
			<section className='top-0 w-[300px] space-y-5 max-lg:w-full lg:sticky  lg:h-screen'>
				<Card
					path='/post/create'
					btnLeftText='Code of Conduct'
					btnRightText='Host a Meetup'
					title='Host a meetup'
					text='Find other Hipnoders in your area so you can learn, share, and work together.'
				/>
				<PodcastCard />
			</section>
		</div>
	);
}
