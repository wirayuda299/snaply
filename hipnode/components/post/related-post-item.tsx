'use client';

import Link from 'next/link';
import { toast } from 'sonner';

import { Post } from '@/types';
import { updateView } from '@/lib/actions/post.action';

export default function RelatedPostItem({ post }: { post: Post }) {
	const incremenetView = async () => {
		try {
			await updateView(post._id);
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			}
		}
	};
	return (
		<Link onClick={incremenetView} className='block' href={`/post/${post._id}`}>
			<h3 className='text-base font-medium text-secondary-light'>
				{post.title}
			</h3>
			<div className='flex flex-wrap gap-3'>
				{post.tags.map((tag) => (
					<span className='text-sm text-orange-500' key={tag._id}>
						#{tag.name}
					</span>
				))}
			</div>
		</Link>
	);
}
