import Link from 'next/link';

import {
	MeetupCard,
	GroupSidebar,
	GroupPostCard,
	SharedPodcastCard,
} from '@/components/index';
import { getAllMeetups, getAllPodcasts, getAllGroups } from '@/lib/actions';

export default async function Groups() {
	const [groups, { meetups }, { allPodcasts }] = await Promise.all([
		getAllGroups(),
		getAllMeetups(1, 3),
		getAllPodcasts('popular', 1, 3),
	]);

	const posts = groups?.map((group) => group.posts).flat(2);

	return (
		<>
			{groups?.length >= 1 ? (
				<div className='flex flex-col gap-3 pb-20 pt-5 lg:flex-row'>
					<GroupSidebar groups={groups} />
					<section className='flex w-full flex-wrap gap-3'>
						{posts?.length >= 1 ? (
							posts?.map((post) => (
								<GroupPostCard key={post?._id} post={post} />
							))
						) : (
							<p>No post made by community yet</p>
						)}
					</section>
					<section className='top-0 min-w-[250px] space-y-5 lg:sticky lg:h-screen'>
						{meetups?.length >= 1 && <MeetupCard meetups={meetups} />}
						{allPodcasts.length >= 1 && (
							<SharedPodcastCard podcasts={allPodcasts} />
						)}
					</section>
				</div>
			) : (
				<div className='mx-auto flex min-h-screen max-w-3xl items-center justify-center'>
					<div className='flex flex-col items-center'>
						<h2 className='text-center text-base'>
							It looks like you haven&apos;t created any groups yet. Start a new
							group today to connect with others who share your interests! Click
							&quot;Create Group&quot; to begin. If you need any assistance,
							feel free to reach out to our support team.
						</h2>
						<Link
							className='bg-primary mx-auto my-2 rounded-md p-2 text-white'
							href={'/groups/action/create'}
						>
							Create Group
						</Link>
					</div>
				</div>
			)}
		</>
	);
}
