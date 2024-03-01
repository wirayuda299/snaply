'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Meetup, Post } from '@/types';
import { cn, getCreatedDate } from '@/lib/utils';

type PostCardTypes =
	| { type: 'meetup'; post: Meetup }
	| { type: 'post'; post: Post };

export default function CardFooter({ post, type }: PostCardTypes) {
	console.log(post);

	return (
		<footer className='flex flex-wrap items-center justify-between'>
			<div className='flex items-center gap-3'>
				<Image
					className='dark:bg-secondary-dark rounded-full object-cover object-center p-2'
					src={post?.author?.profileImage ?? '/avatar.png'}
					loading='lazy'
					width={50}
					height={50}
					alt='user'
				/>
				<div>
					<h4 className='text-secondary dark:text-white-700 text-xs font-semibold sm:text-sm'>
						{type === 'post' && (
							<Link
								href={`/profile/${post?.author?._id}`}
								className='text-secondary dark:text-white-700 inline-flex items-center gap-3'
							>
								{post?.author.username}{' '}
								<span
									className={cn(
										'w-2 h-2 rounded-full bg-slate-500 inline-block',
										'bg-green-600'
									)}
								></span>
							</Link>
						)}
						{type === 'meetup' && post?.companyName}
					</h4>
					{type === 'post' && (
						<p className='text-secondary dark:text-white-700 truncate text-[10px] sm:text-xs'>
							{getCreatedDate(post?.createdAt)}
						</p>
					)}
				</div>
			</div>
			<div className='hidden sm:block'>
				{type === 'post' && (
					<div className=' mt-auto flex flex-wrap gap-5'>
						<p className='text-secondary dark:text-white-700 text-xs font-semibold'>
							{post?.views} views
						</p>
						<p className='text-secondary dark:text-white-700 text-xs font-semibold'>
							{post?.likes.length} Likes
						</p>
						<p className='text-secondary dark:text-white-700 text-xs font-semibold'>
							{post?.comments.length} comments
						</p>
					</div>
				)}
			</div>
		</footer>
	);
}
