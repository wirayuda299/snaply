import { useEffect } from 'react';
import type {
	DefaultValues,
	FieldValues,
	UseFormReturn,
} from 'react-hook-form';

export default function useFormReset<T extends FieldValues, K>(
	isLoading: boolean,
	isError: boolean,
	data: any | undefined,
	form: UseFormReturn<T>,
	resetValues: DefaultValues<K>,
	type: string,
	postId: string
) {
	useEffect(() => {
		if (isLoading || isError || !data) return;

		// @ts-ignore
		form.reset(resetValues);
	}, [postId, type, isError, isLoading]);
}
