import Image from 'next/image';
import Link from 'next/link';

import Loader from '../Loader';
import { cn } from '@/lib/utils';
import { Post, Meetup, Group, Podcast } from '@/types';
import { useClickOutside } from '@/hooks/useClickOutside';
import { Dispatch, SetStateAction, useRef } from 'react';
type SearchResultType = {
	groups: Group[];
	posts: Post[];
	podcasts: Podcast[];
	meetups: Meetup[];
};

const tabs = ['posts', 'meetups', 'podcasts', 'groups'];

const icons = {
	posts: '/assets/general/icons/post.svg',
	meetups: '/assets/general/icons/calendar.svg',
	groups: '/assets/general/icons/group.svg',
	podcasts: '/assets/general/icons/podcast.svg',
};

export default function SearchResult({
	disabled,
	responseKeys,
	searchRes,
	setSearch,
}: {
	disabled: boolean;
	responseKeys: string[];
	searchRes: SearchResultType | null;
	setSearch: Dispatch<SetStateAction<SearchResultType | null>>;
}) {
	const ref = useRef<HTMLDivElement>(null);
	useClickOutside(ref, () => setSearch(null));

	if (!searchRes) return null;

	return (
		<div
			ref={ref}
			className='dark:bg-primary-dark dark:border-secondary-dark absolute left-0 top-14 w-full rounded-lg border bg-white p-3'
		>
			{disabled ? (
				<div className='flex items-center justify-center'>
					<Loader />
				</div>
			) : (
				<>
					<div className='border-white-700 border-b-white-800 dark:border-b-secondary flex items-center gap-3 border-b pb-3'>
						<h3 className='text-base font-semibold'>Type : </h3>
						{tabs.map((tab) => (
							<button
								title={tab}
								key={tab}
								className={cn(
									' rounded-full px-3 py-1 text-sm font-normal capitalize',
									responseKeys.includes(tab)
										? 'bg-primary'
										: 'bg-white-700 dark:bg-secondary-dark'
								)}
							>
								{tab}
							</button>
						))}
					</div>
					<div>
						<h4 className='py-3 text-base font-semibold'>Top Match</h4>
						{tabs.map((key) =>
							// @ts-ignore
							searchRes[key]?.map((data) => (
								<div key={data._id} className='flex items-center gap-3'>
									<Image
										// @ts-ignore
										src={icons[key] as string}
										width={25}
										height={25}
										alt={key}
										className='object-contain'
									/>
									<div>
										<Link
											href={`${key}/${data._id}`}
											className='truncate text-base font-semibold capitalize'
										>
											{/* @ts-ignore */}
											{data?.title || data?.name}
										</Link>
										<p className='text-primary text-base font-semibold capitalize'>
											{key}
										</p>
									</div>
								</div>
							))
						)}
					</div>
				</>
			)}
		</div>
	);
}
