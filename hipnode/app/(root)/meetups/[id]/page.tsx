import Image from 'next/image';
import Link from 'next/link';

import { Parser } from '@/components/index';
import FollowButton from '@/components/shared/follow-button';
import { getMeetupById, getRelatedMeetups, getUserById } from '@/lib/actions';
import { getCreatedDate } from '@/utils';

type Props = {
	params: {
		id: string;
	};
};

export default async function MeetupDetail(props: Props) {
	const { meetup } = await getMeetupById(props.params.id);
	const [user, relatedMeetups] = await Promise.all([
		getUserById(meetup.author._id),
		getRelatedMeetups(meetup.author._id, meetup._id),
	]);

	return (
		<div className=' flex  flex-col justify-between gap-5 pb-20 pt-5 lg:flex-row'>
			<section className='w-full'>
				<section className='relative h-[400px] w-full'>
					<Image
						src={meetup?.image}
						className='rounded-lg object-contain object-center'
						fill
						fetchPriority='high'
						alt={meetup?.title}
						priority
					/>
				</section>
				<section className='py-5'>
					<div className='flex gap-5'>
						<span className='text-2xl font-light uppercase text-slate-500'>
							H1
						</span>
						<div>
							<h2 className='text-secondary-light text-3xl font-bold md:text-4xl'>
								{meetup?.title}
							</h2>
							<div className='flex flex-wrap gap-3 pt-3'>
								{meetup?.tags.map((tag) => (
									<span className='text-sm text-orange-500' key={tag._id}>
										#{tag?.name}
									</span>
								))}
							</div>
							<Parser content={meetup?.body} />
						</div>
					</div>
				</section>
			</section>
			<div className='top-0 w-[380px] space-y-5 max-lg:w-full lg:sticky lg:h-screen'>
				<section className='dark:bg-secondary-dark-2  flex flex-col items-center rounded-xl bg-white p-5 '>
					<div className='w-full'>
						<Image
							className='mx-auto rounded-full'
							src={meetup?.author?.profileImage ?? '/avatar.png'}
							width={100}
							height={100}
							alt='user'
						/>
						<h2 className='text-secondary dark:text-secondary-light py-3 text-center text-3xl font-semibold'>
							{meetup?.author?.username}
						</h2>
						{user?._id !== meetup?.author?._id && (
							<FollowButton
								followers={user?.followers}
								id={meetup?.author?._id}
								path={`/meetups/${meetup?._id}`}
							/>
						)}
						<p className='text-secondary-light pt-3 text-center text-xs'>
							Joined {getCreatedDate(meetup?.author?.createdAt)}
						</p>
					</div>
					{relatedMeetups?.length >= 1 && (
						<section className='dark:bg-secondary-dark-2 mb-5 mt-4 rounded-xl bg-white p-5'>
							<h2 className='border-secondary text-secondary dark:border-b-secondary-dark mb-5 truncate border-b pb-2 text-lg font-semibold dark:text-white'>
								More from{' '}
								<span className='capitalize'>{meetup?.author?.username}</span>
							</h2>
							<div className='divide-secondary-light dark:divide-secondary-dark space-y-5 divide-y divide-solid'>
								{relatedMeetups?.map((meetup) => (
									<Link
										key={meetup?._id}
										className='block'
										href={`/meetups/${meetup?._id}`}
									>
										<h3 className='text-secondary-light text-base font-medium capitalize'>
											{meetup?.title}
										</h3>
										<div className='flex flex-wrap gap-3 pt-1'>
											{meetup?.tags.map((tag) => (
												<span
													className='text-xs text-orange-500'
													key={tag?._id}
												>
													#{tag?.name}
												</span>
											))}
										</div>
									</Link>
								))}
							</div>
						</section>
					)}
				</section>
			</div>
		</div>
	);
}
