'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { cn, formUrlQuery } from '@/lib/utils';

const tabs = ['posts', 'meetups', 'interviews', 'podcasts', 'history'];

export default function Tab() {
	const params = useSearchParams();
	const type = params?.get('type') || 'posts';

	return (
		<div className='no-scrollbar flex w-full snap-mandatory  justify-center gap-5 overflow-x-auto rounded bg-white-700 p-2 dark:bg-secondary-dark-2  md:justify-evenly md:p-4'>
			{tabs.map((tab) => (
				<Link
					href={formUrlQuery(params?.toString()!, 'type', tab)!}
					className={cn(
						'min-w-20 h-8 md:w-24 md:h-10 text-sm md:text-lg font-semibold text-center flex items-center justify-center  rounded-full bg-transparent capitalize',
						type === tab && 'bg-primary'
					)}
					key={tab}
				>
					{tab}
				</Link>
			))}
		</div>
	);
}
