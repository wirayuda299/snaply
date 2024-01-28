'use client';

import Image from 'next/image';

import { useSocket } from '@/providers/socket-provider';
import { Meetup, Post } from '@/types';
import { cn, getCreatedDate } from '@/lib/utils';

type PostCardTypes =
	| { type: 'post'; post: Post }
	| { type: 'meetup'; post: Meetup };

export default function CardFooter({ post, type }: PostCardTypes) {
	const { activeUsers } = useSocket();

	return (
		<footer className='flex flex-wrap items-center justify-between'>
			<div className='flex items-center gap-3'>
				<Image
					className='rounded-full object-cover object-center p-2 dark:bg-secondary-dark'
					src={post?.author?.profileImage ?? '/avatar.png'}
					loading='lazy'
					width={50}
					height={50}
					alt='user'
				/>
				<div>
					<h4 className='text-xs font-semibold text-secondary dark:text-white-700 sm:text-sm'>
						{type === 'post' ? (
							<span className='inline-flex items-center gap-3'>
								{post.author.username}{' '}
								<span
									className={cn(
										'w-2 h-2 rounded-full bg-slate-500 inline-block',
										activeUsers.includes(post.author._id) && 'bg-green-600'
									)}
								></span>
							</span>
						) : (
							post.companyName
						)}
					</h4>
					{type === 'post' && (
						<p className='truncate text-[10px] text-secondary dark:text-white-700 sm:text-xs'>
							{getCreatedDate(post.createdAt)}
						</p>
					)}
				</div>
			</div>
			<div className='hidden sm:block'>
				{type === 'post' && (
					<div className=' mt-auto flex flex-wrap gap-5'>
						<p className='text-xs font-semibold text-secondary dark:text-white-700'>
							{post.views} views
						</p>
						<p className='text-xs font-semibold text-secondary dark:text-white-700'>
							{post.likes.length} Likes
						</p>
						<p className='text-xs font-semibold text-secondary dark:text-white-700'>
							{post.comments.length} comments
						</p>
					</div>
				)}
			</div>
		</footer>
	);
}
