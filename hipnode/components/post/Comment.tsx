'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import type { Comment as PostComment } from '@/types';
import { toast } from 'sonner';
import { useAuth } from '@clerk/nextjs';

import { getCommentsReply, likeComments } from '@/lib/actions';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import CommentInput from './CommentInput';
import { cn } from '@/lib/utils';
import { getCreatedDate } from '@/utils';

const Comment = ({
	comment,
	createdAt,
	postId,
	likes,
	author,
	parentId,
	_id,
	postAuthor,
}: PostComment) => {
	const { userId } = useAuth();

	const [showReplyInput, setShowReplyInput] = useState<boolean>(false);
	const [replies, setReplies] = useState<PostComment[]>([]);

	const isLikedByCurrentUser = useMemo(() => {
		return likes?.includes(userId as string);
	}, [likes, userId]);

	const handleLike = async () => {
		try {
			await likeComments(_id, userId!);
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			}
		}
	};

	const showAllReplies = async () => {
		try {
			if (replies.length < 1) {
				const commentsReply = await getCommentsReply(_id);
				if (commentsReply.length < 1) {
					return toast.message('There are no replies yet');
				} else {
					return setReplies(commentsReply);
				}
			} else {
				return setReplies([]);
			}
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error('Something went wrong');
			}
		}
	};

	return (
		<div>
			<div className={cn('flex rounded-2xl', parentId && 'ml-[60px]')}>
				<Avatar className='mr-4 size-11 rounded-full'>
					<AvatarImage
						src={author.profileImage ?? '/avatar.png'}
						className='rounded-full'
					/>
					<AvatarFallback className='rounded-full '>
						{author.username}
					</AvatarFallback>
				</Avatar>

				<div className='flex flex-1 flex-col gap-3.5'>
					<div className='dark:border-secondary-dark-2 flex-wrap break-words rounded-3xl border border-slate-300 p-3.5'>
						<div className='flex flex-col items-start'>
							<div className='flex flex-wrap items-center gap-1'>
								<p className='text-secondary dark:text-secondary-light text-base font-semibold'>
									{author?.username} •
								</p>
								<p className='text-secondary-light dark:text-secondary-light text-xs'>
									{getCreatedDate(createdAt)}
								</p>
							</div>
							<p className='text-secondary dark:text-secondary-light w-full break-words pt-3 text-sm'>
								{comment}
							</p>
						</div>
					</div>
					<div>
						<div className='ml-4 flex gap-5'>
							<Image
								src={
									isLikedByCurrentUser
										? '/assets/general/icons/filled-heart.svg'
										: '/assets/general/icons/heart.svg'
								}
								alt='Heart'
								width={20}
								height={20}
								className='cursor-pointer object-contain'
								onClick={handleLike}
							/>

							<Image
								src='/assets/groups/icons/share.svg'
								alt='Reply Icon'
								width={20}
								height={20}
								className='cursor-pointer object-contain grayscale'
								onClick={() => setShowReplyInput(!showReplyInput)}
							/>
						</div>
						<button
							onClick={showAllReplies}
							className='text-secondary dark:text-secondary-light pl-4 pt-2 text-left text-sm'
						>
							{replies && replies.length >= 1
								? 'Hide all replies'
								: 'See all replies'}
						</button>
					</div>

					{showReplyInput && (
						<div className='mt-3 pr-4'>
							<CommentInput
								postAuthorId={postAuthor?._id}
								parentId={_id}
								postId={postId}
							/>
						</div>
					)}
				</div>
			</div>
			<div className='mt-5'>
				{replies?.map((reply) => (
					<Comment
						postAuthor={postAuthor}
						parentId={reply.parentId}
						key={reply._id}
						postId={postId}
						likes={reply.likes}
						_id={reply._id}
						comment={reply.comment}
						createdAt={reply.createdAt}
						author={reply.author}
						updatedAt={reply.updatedAt}
					/>
				))}
			</div>
		</div>
	);
};

export default Comment;
