'use client';

import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

import { joinGroup, leaveGroup } from '@/lib/actions';
import { Button } from '../ui/button';

import {
	Dialog,
	DialogContent,
	DialogClose,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import Link from 'next/link';

export default function ActionButton({
	groupId,
	userId,
	isMember,
	isAdmin,
}: {
	groupId: string;
	userId: string;
	isMember: boolean;
	isAdmin: boolean;
}) {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const handleToggle = () => setIsOpen((prev) => !prev);

	const handleGroupAction = async () => {
		try {
			if (isMember) {
				await leaveGroup(groupId, userId).then(handleToggle);
			} else {
				await joinGroup(groupId, userId);
			}
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			}
		}
	};

	return (
		<>
			{isMember && (
				<Dialog open={isOpen} onOpenChange={handleToggle}>
					<DialogTrigger className='bg-white-700 hover:bg-white-800 dark:bg-primary-dark dark:hover:bg-secondary-dark-2 flex h-10 w-20 items-center justify-center gap-2 rounded max-sm:w-full'>
						<Image
							src={'/assets/groups/icons/leave.svg'}
							width={20}
							height={19}
							alt='leave icon'
						/>
						<span className='text-secondary dark:text-white-700 font-semibold'>
							Leave
						</span>
					</DialogTrigger>
					<DialogContent className='dark:bg-primary-dark flex justify-center bg-white'>
						<DialogHeader>
							<DialogTitle className='text-darkSecondary-900 dark:text-white-800 text-center text-lg sm:text-left'>
								Are You Sure to Leave From This Group?
							</DialogTitle>
							<div className='flex items-center gap-5 pt-[30px]'>
								<Button
									onClick={handleGroupAction}
									className=' bg-white-700 text-secondary hover:bg-white-800 dark:bg-secondary-dark dark:hover:bg-secondary-dark-2 w-[160px] max-sm:w-full dark:text-white'
								>
									Leave Group
								</Button>
								<DialogClose className='text-darkSecondary-800 w-[160px] bg-transparent text-lg hover:bg-transparent max-sm:w-full'>
									Cancel
								</DialogClose>
							</div>
						</DialogHeader>
					</DialogContent>
				</Dialog>
			)}

			{!isMember ||
				(isAdmin && (
					<Button
						onClick={handleGroupAction}
						className='bg-white-700 text-secondary hover:bg-white-800 dark:bg-primary-dark dark:hover:bg-secondary-dark-2 flex h-10 w-20 items-center justify-center gap-2 rounded max-sm:w-full dark:text-white'
					>
						Join
					</Button>
				))}
			{isAdmin && (
				<Link
					href={`/groups/action/update?groupId=${groupId}`}
					className='bg-white-700 text-secondary hover:bg-white-800 dark:bg-primary-dark dark:hover:bg-secondary-dark-2 flex h-10 w-20 items-center justify-center gap-2 rounded max-sm:w-full dark:text-white'
				>
					Update
				</Link>
			)}
		</>
	);
}
