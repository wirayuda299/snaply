import Image from 'next/image';
import { currentUser } from '@clerk/nextjs';

import Tag from '../tag';
import { cn, getCreatedDate } from '@/lib/utils';
import LikeButton from './like-button';
import PostTitle from './title';
import Parser from '../parser';
import { Post } from '@/types';

type Meetups = {
	User: {
		image: string;
		name: string | null;
	} | null;
} & {
	id: string;
	image: string;
	title: string;
	address: string;
	companyName: string;
	date: string;
	body: string;
	tags: string[];
	authorEmail: string | null;
};

type PostCardTypes =
	| { type: 'post'; post: Post }
	| { type: 'meetup'; post: Meetups };

export default async function PostCard({ post, type }: PostCardTypes) {
	const user = await currentUser();
	if (!user) return null;

	const isLikedByCurrentUser = type === 'post' && post.likes.includes(user.id);
	const date =
		type === 'meetup' ? new Date(post.date) : new Date(post.createdAt);

	return (
		<article className='dark:border-primary-dark dark:bg-secondary-dark-2 min-h-[100px] w-full rounded-lg border bg-white p-3 md:p-5'>
			<div className='flex size-full items-start gap-3'>
				<div
					className={cn(
						'relative aspect-square min-h-[120px] w-24 h-24 sm:h-36 sm:w-36 md:h-44 md:w-40 lg:w-48 lg:h-48',
						type === 'meetup' ? 'hidden md:block  ' : ''
					)}
				>
					<Image
						className={`aspect-square h-full min-h-full rounded-md  object-cover object-center md:aspect-auto `}
						src={type === 'post' ? post.image : post.image}
						fill
						sizes='100%'
						alt={post.title}
						priority
						fetchPriority='high'
					/>
				</div>
				<div className='flex size-full grow items-start justify-between gap-3'>
					<div className='flex size-full flex-col items-baseline justify-between gap-8'>
						<div className='flex w-full justify-between'>
							<div>
								<PostTitle
									type={type}
									path={
										type === 'post'
											? `/post/${post._id}`
											: `/meetups/${post.id}`
									}
									id={type === 'post' ? post._id : post.id}
									title={post.title}
								/>
								{type === 'meetup' && (
									<p className='text-secondary dark:text-secondary-light truncate text-xs'>
										{post.companyName} - {post.address}
									</p>
								)}
								{type === 'post' && <Tag tags={post.tags} />}
								{type === 'meetup' && <Parser content={post.body} />}
							</div>
							{type === 'post' ? (
								<LikeButton
									post={post}
									isLikedByCurrentUser={isLikedByCurrentUser}
								/>
							) : (
								<p className=' text-secondary dark:bg-secondary-dark dark:text-secondary-light hidden h-20 w-14 flex-col items-center gap-1 rounded-md bg-white p-1 text-lg font-semibold md:flex'>
									<span className='uppercase'>
										{date.toLocaleString('en-US', { month: 'short' })}
									</span>
									<span className='text-blue-600'> {date.getDate()}</span>
								</p>
							)}
						</div>
						<div className=' flex w-full max-w-full flex-wrap items-center justify-between gap-5'>
							<div className='flex items-center gap-2 md:gap-5'>
								<Image
									className='bg-white-700 dark:bg-secondary-dark size-10 rounded-full object-cover object-center p-2 md:size-14'
									src={
										type === 'post'
											? post.author.profileImage ?? '/avatar.png'
											: ''
									}
									loading='lazy'
									width={50}
									height={50}
									alt='user'
								/>
								<div>
									<h4 className='text-secondary dark:text-white-700 text-sm font-semibold'>
										{type === 'post' ? post.author.username : post.companyName}
									</h4>
									{type === 'post' && (
										<p className='text-secondary dark:text-white-700 truncate text-xs'>
											{getCreatedDate(post.createdAt)}
										</p>
									)}
								</div>
							</div>
							{type === 'post' && (
								<div className=' hidden flex-wrap gap-5 xl:flex'>
									<p className='text-secondary dark:text-white-700 text-xs font-semibold'>
										{post.views} views
									</p>
									<p className='text-secondary dark:text-white-700 text-xs font-semibold'>
										{post.likes.length} Likes
									</p>
									<p className='text-secondary dark:text-white-700 text-xs font-semibold'>
										0 comments
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</article>
	);
}
