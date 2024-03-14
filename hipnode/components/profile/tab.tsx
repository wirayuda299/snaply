'use client';

import { useCallback, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { cn } from '@/lib/utils';
import { formUrlQuery } from '@/utils';

const tabs = ['posts', 'meetups', 'podcasts', 'groups'] as const;

export default function Tab() {
	const params = useSearchParams();
	const router = useRouter();
	const selectedTab = params.get('type') || 'posts';

	const [pending, startTransition] = useTransition();

	const handleClick = useCallback(
		(type: string) => {
			const url = formUrlQuery(params.toString(), 'type', type) as string;
			startTransition(() => {
				router.push(url, { scroll: false });
			});
		},
		[selectedTab]
	);

	return (
		<div className='no-scrollbar dark:bg-secondary-dark-2 flex w-full  justify-between gap-5 overflow-x-auto rounded-md bg-white p-2  md:p-4'>
			{tabs.map((tab) => (
				<button
					aria-disabled={pending}
					disabled={pending}
					title={tab}
					onClick={() => handleClick(tab)}
					className={cn(
						'min-w-20 h-8 md:w-24 md:h-10 text-sm md:text-lg font-semibold text-center flex items-center justify-center rounded-full bg-transparent disabled:cursor-not-allowed capitalize transition-all ease duration-300',
						selectedTab === tab && 'bg-primary text-white-700'
					)}
					key={tab}
				>
					{tab}
				</button>
			))}
		</div>
	);
}
