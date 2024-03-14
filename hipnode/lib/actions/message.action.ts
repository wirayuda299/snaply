import { Conversation, MessageData } from '@/types';
import { Message } from '@/types/messages.type';
import { ApiRequest } from '@/utils';
import { revalidatePath } from 'next/cache';

const apiRequest = new ApiRequest();

export async function createConversation(from: string, to: string) {
	try {
		const body = { members: [from, to] };

		await apiRequest.post('/message/create', body);
		revalidatePath('/message');
	} catch (error) {
		throw error;
	}
}

export async function getAllMessages(from: string) {
	try {
		const query = `/message/all-conversation?members=${encodeURIComponent(from)}`;
		return await apiRequest.get<Conversation[]>(query);
	} catch (error) {
		throw error;
	}
}

export async function getAllMessagesBetweenUser(id: string) {
	try {
		return await apiRequest.get<MessageData[]>(`/message/chat?id=${id}`);
	} catch (error) {
		throw error;
	}
}

export async function sendMessage({
	id,
	message,
	messageId,
	receiverId,
	senderId,
	media,
}: {
	id: string;
	message: string;
	senderId: string;
	receiverId: string;
	messageId: string;
	media?: {
		image?: string;
		audio?: string;
		video?: string;
	};
}) {
	try {
		const requestBody = {
			id,
			message,
			senderId,
			...(media && { media }),
			receiverId,
			messageId,
		};
		await apiRequest.post('/message/send', requestBody, '/message');
		revalidatePath('/message');
		revalidatePath('/');
	} catch (error) {
		throw error;
	}
}

export async function getUnreadChat(receieverId: string) {
	try {
		return await apiRequest.get<Message[]>(
			`/message/unread-chat?receiverId=${receieverId}`
		);
	} catch (error) {
		throw error;
	}
}

export async function updateIsRead(messageId: string, senderId: string) {
	try {
		await apiRequest.post('/message/update-is-read', {
			messageId,
			senderId,
		});
		revalidatePath('/');
	} catch (error) {
		throw error;
	}
}
