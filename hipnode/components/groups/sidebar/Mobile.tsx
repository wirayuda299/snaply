'use client';

import { useState } from 'react';
import Image from 'next/image';

import { Group } from '@/types';
import useSelectedGroup from '@/hooks/useSelectedGroup';

export default function Mobile({ groups }: { groups: Group[] }) {
	const { selectedGroup, setSelectedGroup } = useSelectedGroup(groups[0]);
	const [isExpanded, setIsExpanded] = useState<boolean>(false);

	const handleClick = (content: Group) => {
		setSelectedGroup(content);
		setIsExpanded(false);
	};

	return (
		<div className='dark:bg-secondary-dark-2 relative flex w-full flex-col !rounded-2xl bg-white p-2 lg:hidden'>
			{selectedGroup ? (
				<div className='bg-secondary-yellow-10 flex items-center justify-between rounded-2xl p-2'>
					<h2 className='text-lg font-semibold'>{selectedGroup.name}</h2>

					<button onClick={() => setIsExpanded((prev) => !prev)}>
						<Image
							src='/assets/groups/icons/arrow.svg'
							width={20}
							height={20}
							className={`ease transition-all duration-500 ${
								isExpanded ? 'rotate-180' : ''
							}`}
							alt='arrow down icon'
						/>
					</button>
				</div>
			) : (
				<div className='bg-secondary-yellow-10 flex items-center justify-between rounded-xl px-3 py-2'>
					<button onClick={() => setIsExpanded((prev) => !prev)}>
						<Image
							src='/assets/groups/icons/arrow.svg'
							width={20}
							height={20}
							className={`ease transition-all duration-300 ${
								isExpanded ? 'rotate-180' : ''
							}`}
							alt='arrow down icon'
						/>
					</button>
				</div>
			)}
			<div
				className={`ease dark:bg-darkPrimary-3 bg-white-800 dark:bg-primary-dark  dark:border-secondary absolute left-0 z-10 w-full flex-col overflow-hidden rounded-md border py-3 transition-all duration-500 dark:px-3 [&>*:not(:first-child)]:mt-5  ${
					isExpanded ? 'top-16 flex' : '-top-full hidden'
				}`}
			>
				{groups.map((group) => (
					<div
						key={group._id}
						onClick={() => handleClick(group)}
						className='flex items-center gap-2'
					>
						<Image
							src={group.logo}
							width={50}
							alt={group.name}
							height={50}
							className='rounded-full object-contain object-center'
						/>
						{group.name}
					</div>
				))}
			</div>
		</div>
	);
}
