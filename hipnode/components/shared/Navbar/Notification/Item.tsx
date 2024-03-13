import Image from 'next/image';
import { Notification } from '@/types';
import { cn } from '@/lib/utils';

const notificationType = {
	comment: '/assets/notification/comment.svg',
	like: '/assets/notification/like.svg',
};

export default function NotificationItem({
	notification,
}: {
	notification: Notification;
}) {
	return (
		<li key={notification._id}>
			<div className='flex gap-3'>
				<div className='relative h-[50px] w-[60px]'>
					<Image
						src={notification.from.profileImage ?? '/avatar.png'}
						width={45}
						height={45}
						alt='user'
						className='aspect-auto min-w-[40px] rounded-full object-contain'
					/>
					<Image
						src={
							// @ts-ignore
							notificationType[notification.notificationType!]
						}
						width={20}
						height={20}
						alt='notification'
						className='absolute -bottom-1 right-2 aspect-auto rounded-full object-contain'
					/>
				</div>

				<div className={'w-full'}>
					<h3 className='inline-flex items-center gap-3 text-lg font-semibold capitalize'>
						{notification.from.username}
						<p className='inline-block truncate  text-sm font-light'>
							{notification.message}
						</p>
					</h3>
					{notification.comments && (
						<div className='bg-white-700 dark:bg-secondary-dark w-full rounded-md p-2'>
							<p className={cn(!notification.is_read && 'text-primary')}>
								{notification.comments}
							</p>
						</div>
					)}
				</div>
			</div>
		</li>
	);
}
