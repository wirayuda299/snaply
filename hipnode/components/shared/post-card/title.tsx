'use client';

import Link from 'next/link';
import { toast } from 'sonner';

import { updateView } from '@/lib/actions';

export default function PostTitle({
	id,
	title,
	path,
	type,
}: {
	title: string;
	path: string;
	type: 'post' | 'meetup';
	id: string;
}) {
	const incremenetView = async () => {
		try {
			await updateView(id);
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			}
		}
	};

	return (
		<Link
			onClick={() => (type === 'post' ? incremenetView() : undefined)}
			href={path}
			className='dark:text-white-700 line-clamp-2 block text-balance text-base font-semibold first-letter:uppercase md:text-base'
		>
			{title}
		</Link>
	);
}
