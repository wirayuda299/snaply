import { Comment } from '@/types';
import { ApiRequest } from '@/utils';
import { revalidatePath, revalidateTag } from 'next/cache';

type Props = {
	author: string;
	comment: string;
	postId: string;
	parentId: string | null;
};
const apiRequest = new ApiRequest();

export async function uploadComment(data: Props) {
	const { author, comment, parentId, postId } = data;
	try {
		const requestBody = {
			author,
			comment,
			parentId,
			postId,
		};

		await apiRequest.post('/comment/create', requestBody);
		revalidatePath(`/post/${postId}`);
	} catch (error) {
		throw error;
	}
}

export async function likeComments(commentId: string, userId: string) {
	try {
		await apiRequest.post('/comment/like', { userId, commentId });
		revalidateTag('comment');
	} catch (error) {
		throw error;
	}
}

export async function getCommentsReply(commentId: string) {
	try {
		return await apiRequest.get<Comment[]>(`/comment/${commentId}`);
	} catch (error) {
		throw error;
	}
}
