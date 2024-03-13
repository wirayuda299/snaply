'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '../ui/button';
import { formUrlQuery } from '@/utils';
import { useTransition } from 'react';

type PaginationProps = {
	totalPages: number;
};

export default function Pagination({ totalPages }: PaginationProps) {
	const router = useRouter();
	const params = useSearchParams();
	const [pending, startTransition] = useTransition();

	let page = params.get('page') ?? '1';

	const handlePagination = (direction: string) => {
		switch (direction) {
			case 'start':
				page = '1';
				break;
			case 'end':
				page = totalPages.toString();
				break;
			case 'next':
				page = (+page + 1).toString();
				break;
			case 'prev':
				page = (+page - 1).toString();
				break;
			default:
				throw new Error('Invalid direction');
		}

		const newQueryString = formUrlQuery(
			params.toString(),
			'page',
			page.toString()
		);

		startTransition(() => {
			router.push(newQueryString!);
		});
	};

	return (
		<div className='mt-5 flex w-full items-center justify-center gap-2 sm:gap-5'>
			<Button
				disabled={parseInt(page) === 1 || pending}
				onClick={() => handlePagination('start')}
				className='w-12 text-white  sm:w-20'
			>
				Start
			</Button>
			<Button
				disabled={parseInt(page) === 1 || pending}
				onClick={() => handlePagination('prev')}
				className=' w-12 text-white sm:w-20'
			>
				Prev
			</Button>
			<p className='dark:text-white-800 truncate text-xs font-semibold sm:text-base'>
				<span className='text-darkPrimary-2 dark:text-white-800'>
					{params.get('page') ?? 1}
				</span>{' '}
				/ <span className='text-primary'>{totalPages}</span>
			</p>
			<Button
				disabled={parseInt(page) === totalPages || pending}
				onClick={() => handlePagination('next')}
				className=' w-12 !text-white sm:w-20'
			>
				Next
			</Button>
			<Button
				disabled={parseInt(page) === totalPages || pending}
				onClick={() => handlePagination('end')}
				className='w-12 !text-white  sm:w-20'
			>
				End
			</Button>
		</div>
	);
}
