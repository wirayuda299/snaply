'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { formUrlQuery } from '@/utils';
import { Notification as NotificationType } from '@/types';
import { tabValues } from '@/constants';
import { useClickOutside } from '@/hooks/useClickOutside';
import { cn } from '@/lib/utils';
import { markAllAsRead } from '@/lib/actions';
import NotificationItem from './Item';
import { BellOff } from 'lucide-react';

export default function Notification({
	notifications,
}: {
	notifications: NotificationType[];
}) {
	const params = useSearchParams();
	const router = useRouter();
	const ref = useRef(null);
	const [open, setOpen] = useState(false);
	const [disabled, setDisabled] = useState<boolean>(false);

	const type = params.get('notificationType') || 'all';
	const notificationIds = notifications.map((notification) => notification._id);

	const handleClick = (value: string) => {
		const url = formUrlQuery(params.toString(), 'notificationType', value);
		router.push(url!);
	};

	useClickOutside(ref, () => setOpen(false));

	async function handleMarkAsRead() {
		setDisabled(true);
		try {
			await markAllAsRead(notificationIds);
		} catch (error) {
			toast.error('Unknon error');
		} finally {
			setDisabled(false);
		}
	}
	const isNotRead = notifications.some((notification) => !notification.is_read);

	return (
		<div className='relative'>
			<button
				title='notifications'
				onClick={() => setOpen((prev) => !prev)}
				className='bg-white-800 dark:bg-secondary-dark relative rounded-md p-2'
			>
				<Image
					className='aspect-auto w-3 min-w-4 object-contain grayscale invert-[20%] dark:grayscale-0 dark:invert-0'
					src='/assets/general/icons/bell.svg'
					width={20}
					height={20}
					loading='lazy'
					alt='bell icon'
				/>
				{notifications.length >= 1 && isNotRead && (
					<div className='bg-primary absolute right-1 top-1 size-2 rounded-full'></div>
				)}
			</button>
			<ul
				ref={ref}
				className={cn(
					'absolute min-h-96 top-0 hidden -left-44 p-3 bg-white rounded-lg border-white-800 dark:border-secondary-dark-2 dark:bg-secondary-dark-2 border z-[999] max-sm:w-72 w-96 sm:-left-80',
					open && 'block top-10'
				)}
			>
				{notifications?.length >= 1 ? (
					<>
						<header className='border-white-800 dark:border-secondary flex items-center justify-between border-b pb-5'>
							<h3 className='text-sm font-semibold'>
								{notifications.length} Notifications
							</h3>
							<Button
								disabled={disabled || !isNotRead}
								aria-disabled={disabled || !isNotRead}
								title='mark as read'
								onClick={handleMarkAsRead}
								variant={'ghost'}
								className={cn(
									'text-xs font-semibold',
									isNotRead && 'text-primary'
								)}
							>
								Mark All Read
							</Button>
						</header>

						<div className='mt-5 flex w-full snap-mandatory items-center gap-3 space-x-5 overflow-x-auto pb-3'>
							{tabValues.map((tab) => (
								<button
									onClick={() => handleClick(tab.label)}
									key={tab.label}
									className={cn(
										"flex w-full h-auto snap-center before:content-[''] before:absolute before:left-0 before:bottom-0 before:right-0 before:rounded-full before:h-[2px] before:bg-primary transition-all ease-in-out duration-500  relative before:w-full before:scale-x-0 before:transition-all before:ease-linear before:duration-300 items-center gap-3",
										tab.label === type && 'before:scale-x-100'
									)}
								>
									{tab.icon && (
										<Image
											src={tab.icon}
											alt={tab.title}
											width={20}
											height={20}
										/>
									)}
									<p className='text-nowrap'>{tab.title}</p>
								</button>
							))}
						</div>
						<ul className='max-h-[300px] w-full space-y-5 overflow-y-auto overflow-x-hidden pt-5 '>
							{type === 'all'
								? notifications.map((notification) => (
										<NotificationItem
											notification={notification}
											key={notification._id}
										/>
									))
								: notifications
										.filter(
											(notification) => notification.notificationType === type
										)
										.map((notification) => (
											<NotificationItem
												notification={notification}
												key={notification._id}
											/>
										))}
						</ul>
					</>
				) : (
					<div className='flex min-h-96 flex-col items-center justify-center pt-5'>
						<BellOff />
						<p className='pt-3'>No notification yet</p>
					</div>
				)}
			</ul>
		</div>
	);
}
