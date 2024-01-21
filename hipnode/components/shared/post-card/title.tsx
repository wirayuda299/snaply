'use client';

import Link from 'next/link';

import { updateView } from '@/lib/actions/post.action';

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
	return (
		<Link
			onClick={() => (type === 'post' ? updateView(id) : undefined)}
			href={path}
			className='dark:text-white-700 line-clamp-2 block text-balance text-base font-semibold first-letter:uppercase md:text-base'
		>
			{title}
		</Link>
	);
}
