import { auth } from '@clerk/nextjs/server';

import { Notification } from '@/types';
import { fetchConfig } from '../utils';

type createNotificationProps = {
	to: string;
	from: string;
	message: string;
	type: string;
	postId: string;
	model: string;
	comments?: string;
};

export async function createNotification(props: createNotificationProps) {
	try {
		const { to, from, message, type, postId, model, comments } = props;
		await fetchConfig(`/notification/create`, [], 'POST', {
			to,
			from,
			message,
			type,
			postId,
			model,
			comments,
		});
	} catch (e) {
		throw e;
	}
}

export async function deleteNotification(type: string, postId: string) {
	try {
		const { userId } = auth();
		await fetchConfig(`/notification/delete`, [], 'POST', {
			type,
			postId,
			userId,
		});
	} catch (error) {
		throw error;
	}
}

export async function getAllNotifications() {
	try {
		const { userId } = auth();
		const res = await fetchConfig(
			`/notification/all-notifications?userId=${userId}`,
			['notifications'],
			'GET'
		);

		return res.data as Notification[];
	} catch (error) {
		throw error;
	}
}
