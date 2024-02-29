'use client';

import Image from 'next/image';
import { toast } from 'sonner';
import { useReducer, useRef } from 'react';
import dynamic from 'next/dynamic';

import { search } from '@/lib/actions';
import { cn } from '@/lib/utils';
import { useClickOutside } from '@/hooks/useClickOutside';
import { reducer } from '@/reducer/search.reducer';
const SearchResult = dynamic(() => import('./SearchResult'));

const IntialValues = {
	disabled: false,
	isOpen: false,
	responseKeys: [],
	searchRes: null,
};

export default function SearchForm() {
	const [states, dispatch] = useReducer(reducer, IntialValues);

	const ref = useRef(null);

	const handleSearch = async (data: FormData) => {
		try {
			dispatch({ type: 'TOOGLE_DISABLED', payload: { disabled: true } });
			const res = await search(data.get('search') as string);
			const keys = Object.keys(res);

			if (keys.length < 1) {
				toast.message(
					"Sorry, we couldn't find any results matching your search. Please try a different query"
				);
				return;
			}
			dispatch({ type: 'SET_RESPONSE_KEYS', payload: { resKeys: keys } });
			dispatch({ type: 'SET_RESULT', payload: { result: res } });
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			}
		} finally {
			dispatch({ type: 'TOOGLE_DISABLED', payload: { disabled: false } });
		}
	};

	useClickOutside(ref, () =>
		dispatch({ type: 'TOOGLE_OPEN', payload: { isOpen: false } })
	);

	return (
		<div
			className={cn('relative w-max', states.searchRes && 'w-full md:w-max')}
		>
			<form
				action={handleSearch}
				className='md:bg-white-800 dark:md:bg-secondary-dark flex items-center gap-3 rounded-lg max-md:w-auto md:w-[200px] md:flex-row-reverse md:p-1 lg:w-[400px]'
			>
				<button
					onClick={() =>
						dispatch({
							type: 'TOOGLE_OPEN',
							payload: { isOpen: !states.isOpen },
						})
					}
					type='button'
					disabled={states.disabled}
					aria-disabled={states.disabled}
					className='bg-white-800 dark:bg-secondary-dark mr-2 rounded-md p-2 sm:mr-5 md:mr-0'
				>
					<Image
						className='aspect-auto w-3 min-w-4 object-contain'
						src='/assets/general/icons/search.svg'
						width={20}
						loading='lazy'
						height={20}
						alt='search icon'
					/>
				</button>
				<input
					ref={ref}
					disabled={states.disabled}
					name='search'
					autoComplete='off'
					type='search'
					placeholder='Search....'
					className={cn(
						'pl-2 md:block md:w-full focus-visible:md:static md:focus-visible:bg-transparent focus-visible:outline-none',
						states.isOpen
							? 'fixed left-0 z-20 w-full top-3 h-10 block bg-white-700 dark:bg-primary-dark border rounded-lg md:hidden'
							: 'hidden !bg-transparent'
					)}
					id='search'
					required
				/>
			</form>
			<SearchResult dispatch={dispatch} states={states} />
		</div>
	);
}
