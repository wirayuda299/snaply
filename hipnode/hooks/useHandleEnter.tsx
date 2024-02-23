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
		if (e.key === 'Enter' && field === name) {
			e.preventDefault();

			const tagInput = e.target as HTMLInputElement;
			const tagValue = tagInput.value.trim();

			if (tagValue !== '') {
				if (tagValue.length > 15) {
					return form.setError(name, {
						type: 'required',
						message: 'Tags must be less than 15 characters',
					});
				}

				if (!field.includes(tagValue)) {
					const currentValues = form.getValues(field as Path<T>);
					if (currentValues.length > 0) {
						form.setValue(
							name as Path<T>,
							[currentValues, tagValue] as PathValue<T, Path<T>>
						);
					} else {
						form.setValue(name as Path<T>, [tagValue] as PathValue<T, Path<T>>);
					}
					tagInput.value = '';
					form.clearErrors(name);
				}
			} else {
				form.trigger();
			}
		}
	};
	return { handleEnter };
}
