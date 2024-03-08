import { Conversation, MessageData } from '@/types';
import { ApiRequest } from '@/utils';
import { revalidatePath } from 'next/cache';

const apiRequest = new ApiRequest();

export async function createConversation(from: string, to: string) {
	try {
		const body = { members: [from, to] };

		await apiRequest.post('/message/create', body);
	} catch (error) {
		throw error;
	}
}
export async function getAllMessages(from: string) {
	try {
		const query = `/message/all-conversation?members=${[from]}`;
		return await apiRequest.get<Conversation[]>(query);
	} catch (error) {
		throw error;
	}
}

export async function getAllMessagesBetweenUser(to: string) {
	try {
		return await apiRequest.get<MessageData[]>(`/message/chat?id=${to}`);
	} catch (error) {
		throw error;
	}
}

export async function sendMessage(
	id: string,
	message: string,
	senderId: string,
	media?: {
		image?: string;
		audio?: string;
		video?: string;
	}
) {
	try {
		await apiRequest.post(
			'/message/send',
			{ id, message, senderId, ...(media && { media }) },
			'/message'
		);
		revalidatePath('/message');
	} catch (error) {
		throw error;
	}
}
