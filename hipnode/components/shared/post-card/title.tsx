'use client';

import { updateView } from '@/lib/actions/post.action';
import Link from 'next/link';

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
			className='dark:text-white-700 line-clamp-2 text-balance text-base font-semibold md:text-base'
		>
			{title}
		</Link>
	);
}
