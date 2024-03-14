import Image from 'next/image';
import { currentUser } from '@clerk/nextjs/server';
import dynamic from 'next/dynamic';

import { Meetup, Post } from '@/types';
import { cn } from '@/lib/utils';

const Tag = dynamic(() => import('../tag'));
const Parser = dynamic(() => import('../parser'));
const PostTitle = dynamic(() => import('./title'));
const LikeButton = dynamic(() => import('./like-button'));
const CardFooter = dynamic(() => import('./card-footer'));
const Menu = dynamic(() => import('./menu'));

type PostCardTypes =
	| { type: 'post'; post: Post }
	| { type: 'meetup'; post: Meetup };

export default async function PostCard({ post, type }: PostCardTypes) {
	const user = await currentUser();
	if (!user) return null;

	const isLikedByCurrentUser =
		type === 'post' && post?.likes?.includes(user?.id);
	const date = type === 'meetup' && new Date(post.date);

	return (
		<div className='max-sm:max-h-auto min-lg:max-h-[250px] dark:border-primary-dark dark:bg-secondary-dark w-full rounded-lg border bg-white p-3 md:p-5 xl:flex'>
			<div className='flex w-full flex-col gap-5 sm:flex-row sm:gap-4'>
				<picture
					className={cn(
						'relative aspect-square min-h-[120px] w-full h-36 sm:w-36 md:h-44 md:w-40 lg:w-48 lg:h-48',
						type === 'meetup' && 'hidden md:block'
					)}
				>
					<Image
						className='aspect-square h-full min-h-full rounded-md object-cover object-center md:aspect-auto'
						src={post.image}
						fill
						sizes='100%'
						alt={post.title}
						priority
						fetchPriority='high'
					/>
				</picture>

				<div className='flex w-full flex-col justify-evenly gap-5 sm:shrink sm:grow sm:justify-between'>
					<div className='flex w-full flex-wrap items-start justify-between'>
						<header>
							<PostTitle
								type={type}
								path={
									type === 'post' ? `/post/${post._id}` : `/meetups/${post._id}`
								}
								id={post._id}
								title={post.title}
							/>
							{type === 'meetup' && (
								<p className='text-secondary dark:text-secondary-light truncate text-xs'>
									{post.companyName} - {post.address}
								</p>
							)}
							{type === 'post' && <Tag tags={post.tags} />}
							{type === 'meetup' && (
								<Parser content={post.body} styles='line-clamp-2' />
							)}
						</header>

						<div className='flex '>
							{type === 'post' ? (
								<LikeButton
									post={post}
									userId={user.id}
									isLikedByCurrentUser={isLikedByCurrentUser}
								/>
							) : (
								<p className='bg-white-800 text-secondary dark:bg-secondary-dark dark:text-secondary-light hidden h-20 w-12  flex-col items-center gap-1 truncate rounded-md p-1 text-lg font-semibold md:flex'>
									<span className='inline-block text-lg font-semibold uppercase'>
										{date.toLocaleString('en-US', { month: 'short' })}
									</span>
									<span className='inline-block text-lg font-bold text-blue-600'>
										{date && date.getDate()}
									</span>
								</p>
							)}
							{post.author._id === user.id && (
								<Menu path='/' postId={post._id} type={type} />
							)}
						</div>
					</div>
					{/* @ts-ignore */}
					<CardFooter post={post} type={type} />
				</div>
			</div>
		</div>
	);
}
