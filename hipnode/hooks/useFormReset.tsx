import { useEffect } from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

import { Post, Meetup, Podcast } from '@/types';

interface PostResult {
	post: Post;
}

interface MeetupResult {
	meetup: Meetup;
}

type DataResult = PostResult | MeetupResult | Podcast;

type SearchParams = { type: 'meetup' | 'post'; postId: string; title: string };

export default function useFormReset<T extends FieldValues>(
	isLoading: boolean,
	isError: boolean,
	data: DataResult | undefined,
	form: UseFormReturn<T>,
	searchParams: SearchParams
) {
	useEffect(() => {
		if (isLoading || isError || !data) return;

		const resetValues = {
			// @ts-ignore
			title: data.post?.title ?? data.meetup?.title ?? '',
			tags:
				// @ts-ignore
				data.post?.tags?.map((tag) => tag.name) ??
				// @ts-ignore
				data.meetup?.tags.map((tag) => tag.name) ??
				[],
			createType: searchParams.type.toLowerCase() ?? 'post',
			// @ts-ignore
			post: data.post?.body ?? data.meetup?.body ?? '',
			// @ts-ignore
			postImage: data.post?.image ?? data.meetup?.image ?? '',
			country: '',
			// @ts-ignore
			address: data?.meetup?.address ?? '',
			// @ts-ignore
			companyName: data?.meetup?.companyName ?? '',
			// @ts-ignore
			date: data.meetup?.date ?? '',
			// @ts-ignore
			audio: data.podcast?.audio ?? null,
			// @ts-ignore
			category: data.post?.category ?? data.meetup?.category ?? '',
			// @ts-ignore
			group: data.post?.group ?? data.meetup?.group ?? null,
		};

		// @ts-ignore
		form.reset(resetValues!);
	}, [data, isLoading, isError, form, searchParams.type]);
}
