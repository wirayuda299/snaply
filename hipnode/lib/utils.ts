import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import queryString from 'query-string';
import { auth } from '@clerk/nextjs/server';
import { revalidateTag } from 'next/cache';

export const fetchConfig = async (
	url: string,
	tags: string[],
	method?: string,
	body?: Record<string, any>
) => {
	const { getToken } = auth();
	const token = await getToken();
	if (!token) throw new Error('Unauthorized');

	const serverEndpoint = process.env.SERVER_URL;
	const res = await fetch(`${serverEndpoint}${url}`, {
		method,
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-type': 'application/json',
		},
		next: { tags },
		...(method !== 'GET' && { body: JSON.stringify(body) }),
	});
	if (!res.headers.get('content-type')?.includes('application/json')) {
		return;
	}
	const data = await res.json();
	if (data.error) throw new Error(data.message);

	if (method !== 'GET' && tags.length > 0) {
		revalidateTag(tags[0]);
	}
	return data;
};

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

const roundDown = (value: number) => Math.floor(value);

export const getCreatedDate = (createdAt: Date) => {
	try {
		const now = Date.now();
		const diff = now - new Date(createdAt).getTime();

		const diffInSeconds = diff / 1000;
		const diffInMinutes = diffInSeconds / 60;
		const diffInHours = diffInMinutes / 60;
		const diffInDays = diffInHours / 24;
		const diffInWeeks = diffInDays / 7;
		const diffInMonths = diffInDays / 30;
		const diffInYears = diffInDays / 365;

		switch (true) {
			case diffInSeconds < 60:
				return 'just now';
			case diffInMinutes < 60:
				return `${roundDown(diffInMinutes)} ${
					roundDown(diffInMinutes) > 1 ? 'minutes' : 'minute'
				} ago`;
			case diffInHours < 24:
				return `${roundDown(diffInHours)} ${
					roundDown(diffInHours) > 1 ? 'hours' : 'hour'
				} ago`;
			case diffInDays < 7:
				return `${roundDown(diffInDays)} ${
					roundDown(diffInDays) > 1 ? 'days' : 'day'
				} ago`;
			case diffInWeeks < 4:
				return `${roundDown(diffInWeeks)} ${
					roundDown(diffInWeeks) > 1 ? 'weeks' : 'week'
				} ago`;
			case diffInMonths < 12:
				return `${roundDown(diffInMonths)} ${
					roundDown(diffInMonths + 1) > 1 ? 'months' : 'month'
				} ago`;
			default:
				return `${roundDown(diffInYears)} ${
					roundDown(diffInYears) > 1 ? 'years' : 'year'
				} ago`;
		}
	} catch (error: any) {
		console.log(error.message);
	}
};

export const getPostStats = (
	likes: number,
	totalComments: number,
	totalShare: number
) => {
	return [
		{
			icon: '/assets/general/icons/heart.svg',
			alt: 'hearth icon',
			value: likes,
			label: 'Hearts',
		},
		{
			icon: '/assets/general/icons/chat.svg',
			alt: 'chat icon',
			value: totalComments,
			label: 'Comments',
		},
		{
			icon: '/assets/groups/icons/share.svg',
			alt: 'share icon',
			value: totalShare,
			label: 'Share',
		},
	];
};

export const getUserCountry = async () => {
	try {
		const response1 = await fetch('https://api.ipify.org/?format=json');
		const { ip } = await response1.json();

		const response2 = await fetch(`https://ipapi.co/${ip}/json/`);
		return await response2.json();
	} catch (error) {
		throw error;
	}
};

export const copyText = (text: string) => {
	navigator.clipboard.writeText(text);
};

export const filterImage = async (file: File) => {
	try {
		// eslint-disable-next-line camelcase
		const X_RapidAPI_KEY = process.env.NEXT_PUBLIC_X_RapidAPI_KEY;
		// eslint-disable-next-line camelcase
		const X_RapidAPI_HOST = process.env.NEXT_PUBLIC_X_RapidAPI_HOST;

		// eslint-disable-next-line camelcase
		if (!X_RapidAPI_KEY || !X_RapidAPI_HOST || !file) return;

		const data = new FormData();
		data.append('image', file, file.name);

		const options = {
			method: 'POST',
			headers: {
				// eslint-disable-next-line camelcase
				'X-RapidAPI-Key': X_RapidAPI_KEY,
				// eslint-disable-next-line camelcase
				'X-RapidAPI-Host': X_RapidAPI_HOST,
			},
			body: data,
		};
		const getResult = await fetch(
			'https://nsfw-images-detection-and-classification.p.rapidapi.com/adult-content-file',
			options
		);
		return await getResult.json();
	} catch (error) {
		throw error;
	}
};

export const shareOptionData = (email: string, postUrl: string) => {
	return [
		{
			label: 'instagram',
			icon: '/assets/post/icons/instagram.svg',
			path: 'https://instagram.com',
		},
		{
			label: 'twitter',
			icon: '/assets/post/icons/twitter.svg',
			path: `https://twitter.com/intent/tweet?text=Check%20out%20this%20amazing%20post%20${postUrl}`,
		},
		{
			label: 'linkedin',
			icon: '/assets/post/icons/linkedin.svg',
			path: 'https://www.linkedin.com/feed',
		},
		{
			label: 'e-mail',
			icon: '/assets/post/icons/email.svg',
			path: `mailto:${email}?body=Checkout%20this%20amazing%20post:${postUrl}`,
		},
	];
};

export const formUrlQuery = (params: string, key: string, value: string) => {
	if (typeof window !== 'undefined') {
		const currentUrl = queryString.parse(params as string);

		currentUrl[key] = value;

		return queryString.stringifyUrl(
			{
				url: window.location.pathname,
				query: currentUrl,
			},
			{ skipNull: true }
		);
	}
};
