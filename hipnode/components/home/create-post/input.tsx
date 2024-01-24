'use client';

import { useFormStatus } from 'react-dom';

export default function CreatePostInput() {
	const { pending } = useFormStatus();
	return (
		<input
			disabled={pending}
			name='title'
			required
			type='text'
			className='w-full !bg-transparent placeholder:text-xs focus:border-none focus-visible:bg-transparent focus-visible:outline-none disabled:cursor-not-allowed dark:bg-transparent '
			autoComplete='off'
			placeholder='Let’s share what going on your mind...'
		/>
	);
}
