import Image from 'next/image';
import Link from 'next/link';
import { currentUser } from '@clerk/nextjs';

import LikeButton from './like-button';
import { Post } from '@/types';

export default async function PostCard({ post }: { post: Post }) {
	const user = await currentUser();
	if (!user) return null;

	const isLikedByCurrentUser = post.likes.includes(user.id);
	return (
		<article className='card dark:bg-secondary-dark-2 flex size-min max-w-[250px] grow flex-col items-stretch rounded-2xl bg-white p-2.5 max-md:max-w-full max-sm:max-w-full'>
			<header className='card-header flex items-stretch justify-between gap-2.5'>
				<Image
					width={34}
					height={34}
					loading='lazy'
					src={'/avatar.png'}
					className=' size-[34px] max-w-full shrink-0 overflow-hidden rounded-full object-cover object-center'
					alt='Profile Picture'
				/>
				<Link
					href={`/post/${post._id}`}
					className='card-info flex grow basis-[0%] flex-col items-stretch'
				>
					<h2 className='card-title text-secondary text-xs font-semibold leading-5 dark:text-white'>
						{post?.group?.name}
					</h2>
					<p className='card-author text-secondary text-xs leading-4 dark:text-white'>
						{post?.group?.admins[0].username}
					</p>
				</Link>
			</header>
			<Image
				width={300}
				height={300}
				priority
				fetchPriority='high'
				src={post.image}
				className='mt-2.5 aspect-[1.81] w-full overflow-hidden rounded-lg object-cover object-center'
				alt='post image'
			/>
			<form className='card-actions mt-2.5 flex items-stretch gap-5 pr-20'>
				<LikeButton id={post._id} isLikedByCurrentUser={isLikedByCurrentUser} />
				<Link
					href={`/post/${post._id}`}
					className='aspect-square w-5 max-w-full shrink-0 overflow-hidden object-contain object-center '
					aria-label='comment'
					role='button'
				>
					<Image
						width={25}
						height={25}
						loading='lazy'
						src='/assets/groups/icons/comment.svg'
						alt='comment icon'
					/>
				</Link>
				<button
					className=' aspect-square w-5 max-w-full shrink-0 overflow-hidden object-contain object-center'
					aria-label='share'
					role='button'
				>
					<Image
						width={25}
						height={25}
						loading='lazy'
						src='/assets/groups/icons/share.svg'
						alt='share'
					/>
				</button>
			</form>
			<h3 className='text-secondary pt-2 text-sm font-semibold leading-6 dark:text-white'>
				{post.title}
			</h3>
			<time className=' mt-2.5 text-xs leading-5 text-neutral-400'>
				{new Date(post.createdAt).toDateString()}
			</time>
		</article>
	);
}
