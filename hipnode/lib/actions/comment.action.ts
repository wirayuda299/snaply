import { currentUser } from '@clerk/nextjs';
import { revalidatePath, revalidateTag } from 'next/cache';

import { Comment } from '@/types';
import { fetchConfig } from '../utils';

type Props = {
	author: string;
	comment: string;
	postId: string;
	parentId: string | null;
};

export async function uploadComment(data: Props) {
	const { author, comment, parentId, postId } = data;
	try {
		await fetchConfig(`/comment/create`, ['comment'], 'POST', {
			author,
			comment,
			parentId,
			postId,
		});
		revalidatePath(`/post/${postId}`);
	} catch (error) {
		throw error;
	}
}

export async function likeComments(commentId: string) {
	try {
		const user = await currentUser();

		if (!user) throw new Error('You must sign in to perform this action');

		await fetchConfig(`/comment/like`, ['comment'], 'POST', {
			userId: user.id,
			commentId,
		});

		revalidateTag('comment');
	} catch (error) {
		throw error;
	}
}

export async function getCommentsReply(commentId: string) {
	try {
		const res = await fetchConfig(`/comment/${commentId}`, [], 'GET');

		return res.data as Comment[];
	} catch (error) {
		throw error;
	}
}
