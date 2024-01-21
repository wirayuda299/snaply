'use client';

import Image from 'next/image';

import { likePost } from '@/lib/actions/post.action';
import { Post } from '@/types';

export default function LikeButton({
	post,
	isLikedByCurrentUser,
}: {
	isLikedByCurrentUser: boolean;
	post: Post;
}) {
	return (
		<button
			className={isLikedByCurrentUser ? 'grayscale-0' : 'grayscale-[50]'}
			onClick={() => likePost(post._id, '/')}
		>
			<Image
				className={` bg-white-700 dark:bg-secondary-dark size-9 rounded-lg object-contain p-2 `}
				src={'/assets/general/icons/filled-heart.svg'}
				width={40}
				height={40}
				alt='heart icon'
			/>
		</button>
	);
}
