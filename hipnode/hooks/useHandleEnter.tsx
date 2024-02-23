import type {
	FieldValues,
	Path,
	PathValue,
	UseFormReturn,
} from 'react-hook-form';

import type { KeyboardEvent } from 'react';

export default function useHandleEnter<T extends FieldValues>(
	form: UseFormReturn<T>
) {
	const handleEnter = (
		e: KeyboardEvent<HTMLInputElement>,
		field: string,
		name: Path<T>
	) => {
		if (e.key !== 'Enter' || field !== name) return;
		e.preventDefault();

		const tagInput = e.target as HTMLInputElement;
		const tagValue = tagInput.value
			.trim()
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-');

		if (tagValue === '') {
			form.trigger();
			return;
		}

		if (tagValue.length > 15) {
			form.setError(name, {
				type: 'required',
				message: 'Tags must be less than  15 characters',
			});
			return;
		}

		const currentValues = form.getValues(field as Path<T>);
		const values = new Set(currentValues as string[]);

		if (values.has(tagValue)) return;

		if (values.size >= 5) {
			form.setError(name, { message: 'Tag can only maximum  5' });
			return;
		}

		values.add(tagValue);
		form.setValue(name as Path<T>, Array.from(values) as PathValue<T, Path<T>>);
		tagInput.value = '';
		form.clearErrors(name);
	};

	return { handleEnter };
}
