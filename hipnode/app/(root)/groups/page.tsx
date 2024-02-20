import {
	MeetupCard,
	GroupSidebar,
	GroupPostCard,
	SharedPodcastCard,
	GroupSidebarMobile,
} from '@/components/index';
import { getAllMeetups, getAllPodcasts, getAllGroups } from '@/lib/actions';

export default async function Groups() {
	const [groups, meetups, { podcasts }] = await Promise.all([
		getAllGroups(),
		getAllMeetups(),
		getAllPodcasts('popular', 1, 3),
	]);

	const posts = groups.map((group) => group.posts).flat(2);

	return (
		<div className='flex flex-col gap-3 py-5 lg:flex-row'>
			<GroupSidebar groups={groups} />
			<GroupSidebarMobile groups={groups} />
			<section className='flex w-full flex-wrap gap-3'>
				{posts.length >= 1 ? (
					posts.map((post) => <GroupPostCard key={post?._id} post={post} />)
				) : (
					<p>No post made by community yet</p>
				)}
			</section>
			<section className='top-0 min-w-[250px] space-y-5 lg:sticky lg:h-screen'>
				{meetups.length >= 1 && <MeetupCard meetups={meetups} />}
				{podcasts.length >= 1 && <SharedPodcastCard podcasts={podcasts} />}
			</section>
		</div>
	);
}
