import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { currentUser } from '@clerk/nextjs';

import { Podcast } from '@/types';
import { getCreatedDate } from '@/utils';
const Parser = dynamic(() => import('../index').then((mod) => mod.Parser));
const DeleteButton = dynamic(() => import('./Delete-Button'));

export default async function PodcastCard({ podcast }: { podcast: Podcast }) {
	const userSession = await currentUser();
	if (!userSession) return null;

	return (
		<article
			className='dark:bg-secondary-dark-2 h-min max-w-sm rounded-xl bg-white p-5 max-lg:max-w-full'
			key={podcast._id}
		>
			<div className='flex items-center justify-between gap-4'>
				<Link
					href={`/podcasts/${podcast._id}`}
					className='text-secondary  dark:text-white-700 block text-xl font-semibold first-letter:uppercase'
				>
					{podcast.title}
				</Link>
				{userSession.id === podcast.author._id && (
					<DeleteButton id={podcast._id} />
				)}
			</div>
			<Parser content={podcast.body} styles='line-clamp-2' />

			<div className='mt-5 flex items-center gap-3'>
				<Image
					className='bg-white-800 dark:bg-secondary-dark-2 size-14 rounded-full p-2'
					src={podcast.author?.profileImage ?? '/avatar.png'}
					width={50}
					height={50}
					alt='user'
					priority
				/>
				<div>
					<h3 className='text-secondary dark:text-white-700 text-base font-semibold'>
						{podcast.author.username}
					</h3>
					<p className='text-secondary dark:text-secondary-light text-xs'>
						{getCreatedDate(podcast.createdAt)}
					</p>
				</div>
			</div>
		</article>
	);
}
