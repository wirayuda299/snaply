'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '../ui/button';
import { formUrlQuery } from '@/utils';

type PaginationProps = {
	totalPages: number;
};

export default function Pagination({ totalPages }: PaginationProps) {
	const router = useRouter();
	const params = useSearchParams();

	let page = params.get('page') ?? 1;

	const handlePagination = (direction: string) => {
		switch (direction) {
			case 'start':
				page = 1;
				break;
			case 'end':
				page = totalPages;
				break;
			case 'next':
				page = +page + 1;
				break;
			case 'prev':
				page = +page - 1;
				break;
			default:
				throw new Error('Invalid direction');
		}

		const newQueryString = formUrlQuery(
			params.toString(),
			'page',
			page.toString()
		);

		router.push(newQueryString!);
	};

	return (
		<div className='mt-5 flex w-full items-center justify-center gap-2 sm:gap-5'>
			<Button
				disabled={+page === 1}
				onClick={() => handlePagination('start')}
				className='w-12 text-white  sm:w-20'
			>
				Start
			</Button>
			<Button
				disabled={+page === 1}
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
				disabled={+page === totalPages}
				onClick={() => handlePagination('next')}
				className=' w-12 !text-white sm:w-20'
			>
				Next
			</Button>
			<Button
				disabled={+page === totalPages}
				onClick={() => handlePagination('end')}
				className='w-12 !text-white  sm:w-20'
			>
				End
			</Button>
		</div>
	);
}
