'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';

import { Meetup } from '@/types';

const schema = z.object({
	address: z.string(),
	companyName: z.string(),
	date: z.string(),
	image: z.string(),
	title: z.string(),
	body: z.string(),
	tags: z.array(z.string()),
});

const serverEndpoint = process.env.SERVER_URL;

export async function getAllMeetups() {
	try {
		const { getToken } = auth();

		const token = await getToken();
		if (!token) {
			throw new Error('You are not allowed to do this request');
		}
		const res = await fetch(`${serverEndpoint}/meetup/all`, {
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		});
		const meetups = await res.json();
		return meetups.data as Meetup[];
	} catch (error) {
		throw error;
	}
}

export async function createMeetup(props: z.infer<typeof schema>) {
	try {
		const { getToken, userId } = auth();

		const parsed = schema.safeParse(props);
		if (!parsed.success) throw new Error('Data is not valid');

		const { address, companyName, date, image, title, tags, body } = props;

		const token = await getToken();
		if (!token) {
			throw new Error('You are not allowed to do this request');
		}

		const res = await fetch(`${serverEndpoint}/meetup/create`, {
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify({
				address,
				companyName,
				date,
				image,
				title,
				tags,
				body,
				author: userId,
			}),
		});
		const meetup = await res.json();
		if (meetup.error) throw new Error(meetup.message);

		revalidatePath('/meetups');
	} catch (error) {
		throw error;
	}
}

export async function getMeetupById(id: string) {
	try {
		const { getToken } = auth();
		const token = await getToken();
		if (!token) {
			throw new Error('You are not allowed to do this request');
		}
		const res = await fetch(`${serverEndpoint}/meetup?id=${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		});

		const meetup = await res.json();

		if (meetup.error) throw new Error(meetup.message);

		return meetup[0] as Meetup;
	} catch (error) {
		throw error;
	}
}
