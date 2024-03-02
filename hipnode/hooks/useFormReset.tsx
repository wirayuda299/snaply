import { useEffect } from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

type SearchParams = { type: 'meetup' | 'post'; postId: string; title: string };

export default function useFormReset<T extends FieldValues>(
	isLoading: boolean,
	isError: boolean,
	data: any | undefined,
	form: UseFormReturn<T>,
	searchParams: SearchParams
) {
	useEffect(() => {
		if (isLoading || isError || !data) return;

		const resetValues = {
			title: data.post?.title ?? data.meetup?.title ?? '',
			tags:
				data.post?.tags?.map((tag: { name: string }) => tag.name) ??
				data.meetup?.tags.map((tag: { name: string }) => tag.name) ??
				[],
			createType: searchParams.type.toLowerCase() ?? 'post',
			post: data.post?.body ?? data.meetup?.body ?? '',
			postImage: data.post?.image ?? data.meetup?.image ?? '',
			country: '',
			address: data?.meetup?.address ?? '',
			companyName: data?.meetup?.companyName ?? '',
			date: data.meetup?.date ?? '',
			audio: data.podcast?.audio ?? null,
			category: data.post?.category ?? data.meetup?.category ?? '',
			group: data.post?.group ?? data.meetup?.group ?? null,
		};

		// @ts-ignore
		form.reset(resetValues!);
	}, [data, isLoading, isError, form, searchParams.type]);
}
