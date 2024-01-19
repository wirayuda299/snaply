'use server';

import prisma from '../prisma';

export async function createUser(
	email: string,
	id: string,
	username: string,
	token: string,
	image: string,
	password: string
) {
	try {
		const serverEndpoint = process.env.NEXT_PUBLIC_SERVER_URL;

		await fetch(`${serverEndpoint}/user/create`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				email,
				id,
				image,
				password,
				username,
			}),
		});
	} catch (error) {
		throw error;
	}
}

export async function updateUser(email: string, name: string) {
	try {
		const updatedUser = await prisma.user.update({
			where: {
				email,
			},
			data: {
				name,
			},
		});
		return updatedUser;
	} catch (error) {
		console.log('Error with update user', error);
	}
}

export async function deleteUser(email: string) {
	try {
		const deletedUser = await prisma.user.delete({
			where: {
				email,
			},
		});

		return deletedUser;
	} catch (error) {
		console.log('error with delete user', error);
	}
}
