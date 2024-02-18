import Link from 'next/link';
import Image from 'next/image';

import { Parser } from '../index';
import { Podcast } from '@/types/podcast.type';
import { getCreatedDate } from '@/lib/utils';

export default function PodcastCard({ podcast }: { podcast: Podcast }) {
	return (
		<article
			className='dark:bg-secondary-dark-2 h-min max-w-xs rounded-xl bg-white p-5 max-lg:max-w-full'
			key={podcast._id}
		>
			<Link
				href={`/podcasts/${podcast._id}`}
				className='text-secondary  dark:text-white-700 block text-xl font-semibold first-letter:uppercase'
			>
				{podcast.title}
			</Link>
			<Parser content={podcast.body} />

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
