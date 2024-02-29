'use client';

import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';

export default function SubmitButton() {
	const { pending } = useFormStatus();
	return (
		<Button
			aria-disabled={pending}
			disabled={pending}
			className='hidden h-9 md:block'
			type='submit'
		>
			{pending ? 'Submitting...' : 'Create Post'}
		</Button>
	);
}
