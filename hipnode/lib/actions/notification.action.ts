import { auth } from '@clerk/nextjs/server';

import { ApiRequest } from '@/utils';
import { Notification } from '@/types';
import { revalidateTag } from 'next/cache';

type createNotificationProps = {
	to: string;
	from: string;
	message: string;
	type: string;
	postId: string;
	model: string;
	comments?: string;
};
const apiRequest = new ApiRequest();

export async function createNotification(props: createNotificationProps) {
	try {
		const { to, from, message, type, postId, model, comments } = props;

		await apiRequest.post('/notification/create', {
			to,
			from,
			message,
			type,
			postId,
			model,
			comments,
		});
		revalidateTag('notifications');
	} catch (error) {
		throw error;
	}
}

export async function deleteNotification(type: string, postId: string) {
	try {
		const { userId } = auth();

		await apiRequest.post('/notification/delete', {
			type,
			postId,
			userId,
		});
		revalidateTag('notifications');
	} catch (error) {
		throw error;
	}
}

export async function getAllNotifications() {
	try {
		const { userId } = auth();
		const query = `/notification/all-notifications?userId=${userId}`;

		const notifications = await apiRequest.get<Notification[]>(
			query,
			'notifications'
		);
		return notifications;
	} catch (error) {
		throw error;
	}
}
