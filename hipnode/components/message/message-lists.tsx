'use client';

import { Suspense, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';

import { getAllMessagesBetweenUser } from '@/lib/actions';
import { cn } from '@/lib/utils';
import { getCreatedDate } from '@/utils';
import ChatForm from './ChatForm';

export default function MessageList({
	id,
	userId,
}: {
	id: string;
	userId: string;
}) {
	const containerRef = useRef<HTMLDivElement>(null);

	const { data, isLoading, refetch } = useQuery({
		queryKey: [id],
		queryFn: () => getAllMessagesBetweenUser(id),
		refetchOnWindowFocus: true,
	});

	useEffect(() => {
		if (containerRef && containerRef.current) {
			const element = containerRef.current;
			setTimeout(() => {
				element.scroll({
					top: element.scrollHeight,
					left: 0,
					behavior: 'smooth',
				});
			}, 100);
		}
	}, [containerRef, data]);

	if (id && isLoading) return <p>Loading....</p>;

	return (
		<div className='dark:bg-secondary-dark-2 col-span-2 flex h-screen w-full flex-col bg-white p-5  lg:col-span-1'>
			<div
				className='no-scrollbar ease size-full overflow-y-auto pb-40 transition-all duration-500 will-change-auto'
				ref={containerRef}
			>
				<header className='dark:bg-secondary-dark-2 border-b-secondary/5 dark:border-b-secondary-dark flex h-20 items-center gap-3 border-b bg-white'>
					<Image
						width={50}
						height={50}
						alt='user'
						src={(data && data[0].members[1].profileImage) ?? '/avatar.png'}
						className='rounded-full object-contain object-center'
					/>
					<h2 className='text-secondary dark:text-white-700 text-lg font-semibold capitalize'>
						{data && data[0].members[1].username}
					</h2>
				</header>

				<div className=' flex size-full flex-col justify-between gap-5'>
					{data &&
						data?.map((msg) => {
							return msg.messages.map((message, i) => {
								return (
									<Suspense
										key={message._id}
										fallback={
											<div className='bg-white-700 min-h-11 w-full rounded-lg p-3'></div>
										}
									>
										<div
											key={message._id}
											className={cn(
												'gap-2 grid items-center',
												message.senderId === userId
													? 'justify-end'
													: 'justify-start'
											)}
										>
											{message.media && message.media.image && (
												<Image
													loading='lazy'
													src={message?.media.image}
													width={200}
													className='aspect-auto rounded-md object-contain'
													height={100}
													alt='media image'
												/>
											)}
											<div
												className={cn(
													' px-3 w-full h-full py-2 overflow-hidden',
													message.senderId === userId
														? 'rounded-e-2xl rounded-r-2xl rounded-b-2xl bg-primary'
														: 'rounded-s-2xl rounded-b-2xl bg-primary brightness-110'
												)}
											>
												<p className=' break-words leading-3 text-white'>
													{message.content}
												</p>
											</div>
											<time className='text-secondary-light text-xs'>
												{getCreatedDate(message.createdAt)}
											</time>
										</div>
									</Suspense>
								);
							});
						})}
					<ChatForm id={id} refetch={refetch} userId={userId} />
				</div>
			</div>
		</div>
	);
}
