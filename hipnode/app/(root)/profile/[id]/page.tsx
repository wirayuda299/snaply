import Image from 'next/image';
import { currentUser } from '@clerk/nextjs';

import {
	PostCard,
	PodcastCard,
	MeetupCard,
	SharedPodcastCard,
} from '@/components/index';
import Tab from '@/components/profile/tab';
import FollowButton from '@/components/shared/follow-button';
import { getAllMeetups, getAllPodcasts, getUserById } from '@/lib/actions';
import { getCreatedDate } from '@/utils';
import MessageLink from '@/components/profile/MessageLink';

type ProfileProps = {
	params: {
		id: string;
	};
	searchParams: {
		type?: string;
	};
};

export default async function Profile({ searchParams, params }: ProfileProps) {
	const [currentSession, user, { meetups }, { allPodcasts }] =
		await Promise.all([
			currentUser(),
			getUserById(params.id),
			getAllMeetups(),
			getAllPodcasts('popular', 1, 3),
		]);
	const type = searchParams.type ?? 'posts';

	return (
		<div className='flex w-full flex-col gap-5 pb-20 md:px-5 lg:flex-row'>
			<aside className='w-[200px] min-w-[200px] max-lg:min-w-full lg:h-screen'>
				<header className='from-primary to-primary/80 flex flex-col items-center justify-center rounded-lg bg-gradient-to-b'>
					<Image
						className='size-28 translate-y-10 rounded-full'
						src={user.profileImage ?? '/avatar.png'}
						width={100}
						height={100}
						alt='user'
						priority
					/>
				</header>
				<div className='pt-12 text-center'>
					<h2 className='text-2xl font-semibold capitalize'>{user.username}</h2>
					<p className='text-xs'>Developer</p>
					<div className='flex items-center gap-3 pt-3'>
						{currentSession?.id !== user._id && (
							<>
								<FollowButton
									id={user._id}
									followers={user.followers}
									path={`/profile/${user._id}`}
								/>
								<MessageLink
									receiverId={user._id}
									userSession={currentSession?.id!}
								/>
							</>
						)}
					</div>
					<div className='mt-3 flex flex-wrap justify-center gap-3 text-xs'>
						<span>{user.followers.length} Followers</span>
						&#x2022;
						<span>{user.followings.length} Followings</span>
						&#x2022;
						<span>{user.points} Points</span>
					</div>

					<p className='text-secondary dark:text-secondary-light mt-10 text-base font-semibold'>
						Joined {getCreatedDate(user.createdAt)}
					</p>
				</div>
			</aside>

			<section className='w-full'>
				<Tab />
				<div className='w-full space-y-5 pt-5'>
					{(type === undefined || type === 'posts') &&
						user.posts.map((post) => (
							<PostCard post={post} key={post._id} type='post' />
						))}
					{type === 'meetups' &&
						user.meetups.map((meetup) => (
							<PostCard post={meetup} key={meetup._id} type='meetup' />
						))}

					{type === 'podcasts' &&
						user?.podcasts.map((podcast) => (
							<PodcastCard key={podcast._id} podcast={podcast} />
						))}
				</div>
			</section>

			<section className='top-0 min-w-80 space-y-5 max-lg:min-w-full lg:sticky lg:h-screen'>
				{meetups.length >= 1 && <MeetupCard meetups={meetups} />}

				{allPodcasts.length >= 1 && (
					<SharedPodcastCard podcasts={allPodcasts} />
				)}
			</section>
		</div>
	);
}
