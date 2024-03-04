import Image from 'next/image';
import { Globe, MessageCircleMore } from 'lucide-react';
import Link from 'next/link';

import {
	Card,
	PostCard,
	PodcastCard,
	InterviewPostCard,
} from '@/components/index';
import Tab from '@/components/profile/tab';
import FollowButton from '@/components/shared/follow-button';
import { getUserById } from '@/lib/actions';
import { getCreatedDate } from '@/lib/utils';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

type ProfileProps = {
	params: {
		id: string;
	};
	searchParams: {
		type?: string;
	};
};

export default async function Profile({ searchParams, params }: ProfileProps) {
	const [currentSession, user] = await Promise.all([
		currentUser(),
		getUserById(params.id),
	]);
	const type = searchParams.type ?? 'posts';

	if (currentSession == null) {
		return redirect('/sign-in');
	}

	return (
		<div className='flex w-full flex-col gap-5 md:p-5 lg:flex-row'>
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
								<Link
									href={'/messages'}
									className='bg-blue-10 dark:bg-secondary-dark-2 group hover:bg-transparent'
								>
									<MessageCircleMore className='group-hover:text-primary dark:text-white-700 bg-transparent text-black transition-colors duration-500 ease-in-out' />
								</Link>
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
					<p className='text-secondary dark:text-secondary-light mt-4 text-xs'>
						Hey there... I&apos;m AR Jakir! I&apos;m here to learn from and
						support the other members of this community!
					</p>
					{user.website && (
						<div className='mt-5 flex items-center justify-center gap-3'>
							<Globe size={15} />
							<h3 className='text-sm font-semibold'>www.jsm.com</h3>
						</div>
					)}

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
					{type === 'interviews' &&
						user?.interviews &&
						user?.interviews.map((interview) => (
							<InterviewPostCard {...interview} key={interview._id} />
						))}
					{type === 'podcasts' &&
						user?.podcasts.map((podcast) => (
							<PodcastCard key={podcast._id} podcast={podcast} />
						))}
				</div>
			</section>

			<section>
				<Card
					path='/create?type=interview'
					title='Start your interview'
					text="Working on your own internet business? We'd love to interview you!"
					btnLeftText='Code of Conduct'
					btnRightText='Submit a Story'
				/>
			</section>
		</div>
	);
}
