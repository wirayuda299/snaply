import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

import { User } from '@/types';
import { fetchConfig } from '../utils';

export async function createUser(
	email: string,
	id: string,
	image: string,
	username: string,
	password: string
) {
	try {
		await fetch(`${process.env.SERVER_URL}/user/create`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
			},
			body: JSON.stringify({
				email,
				id,
				image,
				username,
				password,
			}),
		});
	} catch (error) {
		throw error;
	}
}

export async function getUserById(id: string) {
	try {
		const res = await fetchConfig(`/user?id=${id}`, [`/profile/${id}`], 'GET');
		return res.data as User;
	} catch (error) {
		throw error;
	}
}

export async function handleFollow(id: string, path: string) {
	try {
		const { userId } = auth();
		await fetchConfig(`/user/follow`, [], 'POST', {
			userId: id,
			followerId: userId,
		});
		revalidatePath(path);
	} catch (error) {
		throw error;
	}
}
