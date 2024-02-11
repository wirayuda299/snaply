'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn, formUrlQuery } from '@/lib/utils';
import { Notification as NotificationType } from '@/types/index';

const tabValues = [
	{
		label: 'all',
		icon: '',
		title: 'All Notifications',
	},
	{
		label: 'like',
		icon: '/assets/general/icons/heart.svg',
		title: 'Reactions',
	},
	{
		label: 'comment',
		icon: '/assets/general/icons/chat.svg',
		title: 'Comments',
	},
];

export default function Notification({
	notifications,
}: {
	notifications: NotificationType[];
}) {
	const params = useSearchParams();
	const type = params.get('notificationType') || 'all';
	const router = useRouter();
	const [open, setOpen] = useState(false);

	const handleClick = (value: string) => {
		const url = formUrlQuery(params.toString(), 'notificationType', value);
		router.push(url!);
	};

	return (
		<div className='relative'>
			<button
				onClick={() => setOpen((prev) => !prev)}
				className='bg-white-800 dark:bg-secondary-dark rounded-md p-2'
			>
				<Image
					className='aspect-auto w-3 min-w-4 object-contain grayscale invert-[20%] dark:grayscale-0 dark:invert-0'
					src='/assets/general/icons/bell.svg'
					width={20}
					height={20}
					loading='lazy'
					alt='bell icon'
				/>
			</button>
			<div
				className={cn(
					'absolute min-h-96 top-0 hidden -left-40 p-1 bg-white rounded-lg border-white-800 dark:border-secondary-dark-2 dark:bg-secondary-dark-2 border max-sm:w-64 w-96 sm:-left-80',
					open && 'block top-10'
				)}
			>
				<header className='flex items-center justify-between border-b pb-5'>
					<h3 className='text-xs font-semibold'>3 Notifications</h3>
					<Button variant={'ghost'} className='text-xs font-semibold'>
						Mark All Read
					</Button>
				</header>

				<div className='no-scrollbar mt-5 flex snap-mandatory items-center gap-3 overflow-x-auto'>
					{tabValues.map((tab) => (
						<button
							onClick={() => handleClick(tab.label)}
							key={tab.label}
							className={cn(
								"flex w-max h-auto before:content-[''] before:absolute before:w-full before:left-0 before:bottom-0 before:right-0 before:rounded-full before:h-[2px] before:bg-primary transition-all ease-in-out duration-500  relative  before:opacity-0 before:transition-all before:ease-linear before:duration-500 items-center gap-2 ",
								tab.label === type && 'before:opacity-100'
							)}
						>
							{tab.icon && (
								<Image src={tab.icon} alt={tab.title} width={20} height={20} />
							)}
							<p className='text-nowrap'>{tab.title}</p>
						</button>
					))}
				</div>
				<ul>
					{notifications.map((notification) => (
						<li key={notification._id}>
							<h3>{notification.from.username}</h3>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
