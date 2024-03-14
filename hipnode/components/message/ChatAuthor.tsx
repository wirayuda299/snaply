'use client';

import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Menu, Plus } from 'lucide-react';

import { Conversation, User } from '@/types';
import { cn } from '@/lib/utils';
const MessageDialog = dynamic(() => import('./message-dialog'));

type Props = {
	converstations: Conversation[];
	userSessionId: string;
	imageUrl: string;
	username: string;
	conversationId: string;
	allUsers: User[];
};

export default function ChatAuthor({
	converstations,
	userSessionId,
	conversationId,
	allUsers,
	imageUrl,
	username,
}: Props) {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<>
			<button
				className='absolute right-0 top-0 lg:hidden'
				onClick={() => setIsOpen(true)}
			>
				<Menu />
			</button>
			<aside
				className={cn(
					'dark:bg-secondary-dark-2 no-scrollbar dark:border-r-secondary-dark fixed -top-0 z-[9999] lg:z-0 h-screen w-full overflow-y-auto bg-white md:border-r-2 lg:sticky transition-all ease duration-500 p-5',
					isOpen ? 'left-0 right-0' : '-left-full lg:col-span-1'
				)}
			>
				<div>
					<header className='border-b-secondary/5 dark:border-b-secondary-dark dark:bg-secondary-dark-2 flex h-20 items-center justify-between gap-3 rounded-lg border-b-2'>
						<div className='flex items-center gap-3'>
							<Image
								width={50}
								height={50}
								alt='user'
								src={imageUrl ?? '/avatar.png'}
								className='rounded-full object-contain object-center'
							/>
							<h2 className='text-lg font-semibold capitalize'>{username}</h2>
						</div>
						<button
							title='close'
							className='rotate-45 lg:hidden'
							onClick={() => setIsOpen(false)}
						>
							<Plus />
						</button>
					</header>
					<MessageDialog
						messages={converstations}
						users={allUsers}
						userSession={userSessionId}
					/>

					<div className='divide-secondary-light mt-3 min-h-screen divide-y overflow-y-auto'>
						{converstations?.map((converstation) => {
							return converstation?.members
								.filter((member) => member._id !== userSessionId)
								.map((member) => (
									<Link
										onClick={() => setIsOpen(false)}
										prefetch
										href={`/message?id=${converstation._id}&to=${member._id}`}
										key={member._id}
										className={cn(
											'flex cursor-pointer items-center gap-3',
											conversationId === converstation._id &&
												'bg-white-800 dark:bg-secondary-dark rounded-md p-2'
										)}
									>
										<Image
											src={member.profileImage ?? '/avatar.png'}
											width={50}
											height={50}
											alt={member.username}
											className='rounded-full'
										/>
										<h2 className='text-secondary dark:text-white-700 text-lg font-semibold capitalize'>
											{member.username}
										</h2>
									</Link>
								));
						})}
					</div>
				</div>
			</aside>
		</>
	);
}
