import { revalidateTag } from 'next/cache';

import { ApiRequest } from '@/utils';
import { Notification } from '@/types';

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
		const userId = apiRequest.getUserId;
		if (!userId) throw new Error('Unauthorized');

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

export async function getAllNotifications(userId: string) {
	try {
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

export async function markAllAsRead(notifications: string[]) {
	try {
		await apiRequest.post('/notification/mark-as-read', { notifications });
		revalidateTag('notifications');
	} catch (error) {
		throw error;
	}
}
