'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Group } from '@/types';
import useSelectedGroup from '@/hooks/useSelectedGroup';

export default function Sidebar({ groups }: { groups: Group[] }) {
	const { handleSelectedGroup, selectedGroup } = useSelectedGroup(null);

	return (
		<aside className=' dark:bg-secondary-dark-2 top-0 hidden h-full min-w-[250px] items-start justify-start gap-2.5 overflow-y-auto rounded-2xl bg-white p-3 max-md:w-full lg:sticky lg:flex lg:h-screen'>
			<div className='flex w-full flex-col items-start justify-start gap-5'>
				{selectedGroup && (
					<button
						className='bg-white-800 dark:bg-secondary-dark-2 flex size-9 items-center justify-center rounded-full'
						onClick={handleSelectedGroup}
					>
						<Image
							className='rotate-180 invert dark:invert-0'
							src={'/assets/general/icons/arrow.svg'}
							width={20}
							alt='back icon'
							height={20}
						/>
					</button>
				)}
				{selectedGroup ? (
					<div>{selectedGroup.name}</div>
				) : (
					<>
						<h2 className='py-3 text-lg font-semibold'>All Groups</h2>
						{groups?.map((group) => (
							<div key={group._id}>
								<header className='flex gap-3'>
									<Image
										className='size-12 rounded-full object-cover object-center'
										src={group.logo ?? '/avatar.png'}
										width={50}
										height={50}
										alt={group.name}
									/>
									<Link href={`/groups/${group._id}`}>
										<h3
											title={group.name}
											className='text-secondary line-clamp-1 text-base font-semibold dark:text-white'
										>
											{group.name}
										</h3>
										<p className='text-secondary dark:text-secondary-light text-[11px] font-normal'>
											Created by{' '}
											<span className='capitalize'>
												{group.admins[0].username}
											</span>
										</p>
									</Link>
								</header>
							</div>
						))}
					</>
				)}
			</div>
		</aside>
	);
}
