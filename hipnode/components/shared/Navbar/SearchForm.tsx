'use client';

import Image from 'next/image';
import { toast } from 'sonner';
import { useState } from 'react';

import { search } from '@/lib/actions';
import { Group, Meetup, Podcast, Post } from '@/types/index';
import SearchResult from './SearchResult';

type SearchResultType = {
	groups: Group[];
	post: Post[];
	podcasts: Podcast[];
	meetups: Meetup[];
};

export default function SearchForm() {
	const [disabled, setDisabled] = useState<boolean>(false);
	const [responseKeys, setresponseKeys] = useState<string[]>([]);
	const [searchRes, setSearchRes] = useState<SearchResultType | null>(null);

	const handleSearch = async (data: FormData) => {
		try {
			setDisabled(true);
			const res = await search(data.get('search') as string);
			if (
				!searchRes?.post ||
				!searchRes?.meetups ||
				!searchRes?.podcasts ||
				!searchRes?.groups
			)
				return toast.error(
					"Sorry, we couldn't find any results matching your search. Please try a different query"
				);
			setresponseKeys(Object.keys(res));

			setSearchRes(res);
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			}
		} finally {
			setDisabled(false);
		}
	};

	return (
		<div className='relative w-max'>
			<form
				action={handleSearch}
				className='md:bg-white-800 dark:md:bg-secondary-dark flex items-center gap-3 rounded-lg max-md:w-auto md:w-[200px] md:flex-row-reverse md:p-1 lg:w-[400px]'
			>
				<button
					disabled={disabled}
					aria-disabled={disabled}
					type='submit'
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
					disabled={disabled}
					name='search'
					autoComplete='off'
					type='search'
					placeholder='Search....'
					className='focus-visible:bg-white-700 hidden bg-transparent pl-2 focus-visible:absolute focus-visible:left-0 focus-visible:block focus-visible:outline-none max-md:focus-visible:w-full md:block md:w-full focus-visible:md:static md:focus-visible:bg-transparent '
					id='search'
				/>
			</form>
			<SearchResult
				setSearch={setSearchRes}
				disabled={disabled}
				responseKeys={responseKeys}
				searchRes={searchRes}
			/>
		</div>
	);
}
