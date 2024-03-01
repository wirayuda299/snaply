'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { deleteMeetup, deletePost } from '@/lib/actions';

export default function DeleteButton({
	postId,
	path,
	type,
}: {
	postId: string;
	path: string;
	type: string;
}) {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	async function handleDeletePost() {
		try {
			if (type === 'post') {
				await deletePost(postId, path);
			} else {
				await deleteMeetup(postId);
			}
			setIsOpen(false);
		} catch (error) {
			if (error instanceof Error) {
				toast(error.message);
			} else {
				toast('An unknown error accured');
			}
		}
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant='ghost' title='menu'>
					<svg
						className='dark:fill-white-700 rotate-90 fill-black'
						height='20px'
						width='20px'
						version='1.1'
						id='Capa_1'
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 32.055 32.055'
						xmlSpace='preserve'
					>
						<g>
							<path
								d='M3.968,12.061C1.775,12.061,0,13.835,0,16.027c0,2.192,1.773,3.967,3.968,3.967c2.189,0,3.966-1.772,3.966-3.967
		C7.934,13.835,6.157,12.061,3.968,12.061z M16.233,12.061c-2.188,0-3.968,1.773-3.968,3.965c0,2.192,1.778,3.967,3.968,3.967
		s3.97-1.772,3.97-3.967C20.201,13.835,18.423,12.061,16.233,12.061z M28.09,12.061c-2.192,0-3.969,1.774-3.969,3.967
		c0,2.19,1.774,3.965,3.969,3.965c2.188,0,3.965-1.772,3.965-3.965S30.278,12.061,28.09,12.061z'
							/>
						</g>
					</svg>
				</Button>
			</PopoverTrigger>
			<PopoverContent className='bg-white-700 dark:bg-primary-dark dark:border-primary-dark w-80 py-1'>
				<Dialog open={isOpen} onOpenChange={setIsOpen}>
					<DialogTrigger>Delete {type}</DialogTrigger>
					<DialogContent className='bg-white-700 dark:bg-primary-dark dark:border-primary-dark'>
						<DialogHeader>
							<DialogTitle>Are you absolutely sure?</DialogTitle>
							<DialogDescription>
								This action can&apos;t be undone. This will permanently delete
								your {type}.
							</DialogDescription>
						</DialogHeader>
						<div className='flex items-center justify-end gap-2'>
							<Button className='!bg-red-600' onClick={handleDeletePost}>
								Delete
							</Button>
							<Button onClick={() => setIsOpen(false)}>Cancel</Button>
						</div>
					</DialogContent>
				</Dialog>
			</PopoverContent>
		</Popover>
	);
}
