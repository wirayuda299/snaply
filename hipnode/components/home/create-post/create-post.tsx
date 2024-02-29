import Image from 'next/image';
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs';

import SubmitButton from './submit-button';
import CreatePostInput from './input';

export default async function CreatePost() {
	const user = await currentUser();

	async function redirectToCreatePost(data: FormData) {
		'use server';
		const title = data.get('title');
		if (title !== '') {
			redirect(`/create?title=${title?.toString()}&type=post`);
		}
	}

	return (
		<form
			action={redirectToCreatePost}
			className=' dark:bg-secondary-dark-2 flex h-min w-full items-center gap-3 rounded-xl bg-white p-2 md:p-3'
		>
			<Image
				className='bg-white-700 dark:bg-secondary-dark hidden size-14 rounded-full object-contain p-2 sm:block'
				src={user?.imageUrl ?? ''}
				width={50}
				height={50}
				alt='user'
				priority
			/>
			<div className=' bg-white-700 dark:bg-secondary-dark flex w-full items-center gap-2 rounded-lg p-2 md:rounded-xl md:p-3'>
				<CreatePostInput />
				<SubmitButton />
			</div>
		</form>
	);
}
