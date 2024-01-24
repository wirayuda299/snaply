'use server';

import { Podcast } from '@/types/podcast.type';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

const serverEndpoint = process.env.SERVER_URL;
// TODO: add category to podcast
// TODO: add user address in user model

export async function createPodcast(
	audio: string,
	audioAssetId: string,
	body: string,
	tags: string[],
	postImage: string,
	title: string,
	postImageAssetId: string
) {
	try {
		const { getToken, userId } = auth();

		const token = await getToken();
		if (!token) throw new Error('token is required');

		const res = await fetch(`${serverEndpoint}/podcasts/create`, {
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify({
				audio,
				audioAssetId,
				body,
				tags,
				postImage,
				title,
				author: userId,
				postImageAssetId,
			}),
		});
		const podcast = await res.json();

		if (podcast.error) {
			throw new Error(podcast.message);
		}
		revalidatePath('/podcasts');
	} catch (error) {
		throw error;
	}
}

export async function getAllPodcasts(
	sort: string = 'newest',
	page: number = 1,
	pageSize: number = 10
) {
	try {
		const { getToken } = auth();

		const token = await getToken();
		if (!token) throw new Error('token is required');

		const podcasts = await fetch(
			`${serverEndpoint}/podcasts/all?sort=${sort}&page=${page}&limit=${pageSize}`,

			{
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				next: {
					tags: ['all-podcasts'],
				},
			}
		);
		const res = await podcasts.json();
		return {
			podcasts: res.data.allPodcasts as Podcast[],
		};
	} catch (error) {
		throw error;
	}
}
