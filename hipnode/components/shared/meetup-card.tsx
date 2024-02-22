import Image from 'next/image';
import Link from 'next/link';

import { Tag } from '@/components/index';
import { Meetup } from '@/types';

export default function MeetupCard({ meetups }: { meetups: Meetup[] }) {
	return (
		<div className='dark:bg-secondary-dark-2 w-full rounded-lg bg-white p-3 '>
			<header className='text-secondary dark:text-white-700 flex items-center gap-3'>
				<h2 className='text-base font-semibold'>Meetups</h2>
				<Image
					className='invert dark:invert-0'
					src='/assets/general/icons/arrow.svg'
					width={25}
					height={25}
					alt='arrow icon'
				/>
			</header>
			<div className='flex flex-col gap-3 overflow-hidden pt-2'>
				{meetups?.map((c) => (
					<Link
						href={`/meetups/${c._id}`}
						className='mt-4 flex gap-4'
						key={c._id}
					>
						<div className='text-secondary bg-white-700 dark:bg-secondary-dark dark:text-white-700 flex h-max w-11 flex-col items-center p-2 dark:rounded-md'>
							<h3 className='text-xl font-bold uppercase'>
								{new Date(c.createdAt).toLocaleString('en-US', {
									month: 'short',
								})}
							</h3>
							<p className='text-2xl font-bold text-blue-600'>
								{new Date(c.createdAt).getDate()}
							</p>
						</div>
						<div>
							<h3 className='text-secondary dark:text-white-700 line-clamp-1 truncate text-sm font-semibold capitalize md:text-base'>
								{c.title}
							</h3>

							<div className='flex items-center gap-2'>
								<Image
									src={c.image}
									className='mt-2 size-6 rounded-full object-cover'
									width={15}
									height={15}
									alt=''
								/>
								<p className='dark:text-white-700 truncate pt-2 text-xs'>
									{c.companyName} - {c.address}
								</p>
							</div>
							<Tag tags={c.tags} />
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}
