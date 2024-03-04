import { useEffect } from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

export default function useFormReset<T extends FieldValues, K>(
	isLoading: boolean,
	isError: boolean,
	data: any | undefined,
	form: UseFormReturn<T>,
	resetValues: Record<string, K>,
	type: string
) {
	useEffect(() => {
		if (isLoading || isError || !data) return;

		// @ts-ignore
		form.reset(resetValues!);
	}, [data, isLoading, isError, form, type]);
}
