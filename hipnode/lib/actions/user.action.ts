'use server';

export async function createUser(
	email: string,
	id: string,
	username: string,
	token: string,
	image: string,
	password: string
) {
	try {
		const serverEndpoint = process.env.SERVER_URL;

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
		console.log('update user');
	} catch (error) {
		console.log('Error with update user', error);
	}
}

export async function deleteUser(email: string) {
	try {
		console.log(' delete user');
	} catch (error) {
		console.log('error with delete user', error);
	}
}
