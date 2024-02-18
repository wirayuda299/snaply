import { revalidateTag } from 'next/cache';
import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';

import { Meetup } from '@/types';
import { fetchConfig } from '../utils';

const schema = z.object({
	address: z.string(),
	companyName: z.string(),
	category: z.string(),
	date: z.string(),
	image: z.string(),
	assetId: z.string(),
	title: z.string(),
	body: z.string(),
	tags: z.array(z.string()),
});

export async function getAllMeetups() {
	try {
		const res = await fetchConfig(
			`/meetup/all?page=1&limit=10`,
			['meetups'],
			'GET'
		);
		return res.data as Meetup[];
	} catch (error) {
		throw error;
	}
}

export async function createMeetup(props: z.infer<typeof schema>) {
	try {
		const { userId } = auth();

		const parsed = schema.safeParse(props);
		if (!parsed.success) throw new Error('Data is not valid');

		const {
			address,
			companyName,
			date,
			image,
			title,
			tags,
			body,
			assetId,
			category,
		} = props;

		await fetchConfig(`/meetup/create`, [], 'POST', {
			address,
			companyName,
			date,
			image,
			title,
			tags,
			body,
			author: userId,
			assetId,
			category,
		});

		revalidateTag('meetups');
	} catch (error) {
		throw error;
	}
}

export async function getMeetupById(id: string) {
	try {
		const res = await fetchConfig(`/meetup?id=${id}`, [], 'GET');
		return res[0] as Meetup;
	} catch (error) {
		throw error;
	}
}
