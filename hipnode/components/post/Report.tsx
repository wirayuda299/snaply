'use client';

import { toast } from 'sonner';
import { useState } from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

import { reportPost } from '@/lib/actions';
import { reportTags } from '@/constants';
const ReportConfirmation = dynamic(() => import('./ReportConfirmation'));
const ReportItem = dynamic(() => import('./ReportItem'));

interface ReportProps {
	user: string;
	postId: string;
}

const Report = ({ user, postId }: ReportProps) => {
	const [selectedReportItems, setSelectedReportItems] = useState<string[]>([]);
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const handlePostReport = async () => {
		try {
			await reportPost(postId, selectedReportItems);
			setSelectedReportItems([]);
			setIsOpen(false);
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			}
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<div className='flex cursor-pointer items-center gap-5'>
					<Image
						src='/assets/post/icons/report.svg'
						alt='Report icon'
						width={20}
						height={20}
					/>
					<p className='text-secondary dark:text-secondary-light'>Report</p>
				</div>
			</DialogTrigger>
			<DialogContent className='dark:bg-secondary-dark-2 flex flex-col gap-7 rounded-2xl bg-white p-7 sm:max-w-[477px]'>
				<DialogHeader>
					<DialogTitle className='heading3 text-darkSecondary-900 dark:text-white-800'>
						Why are you reporting this post by {user}?
					</DialogTitle>
				</DialogHeader>
				<div className='grid gap-4 py-4'>
					<ul className='flex flex-wrap items-center gap-5'>
						{reportTags.map((item) => (
							<ReportItem
								selectedReportItem={selectedReportItems}
								key={item.id}
								id={item.id}
								title={item.title}
								setSelectedReportItems={setSelectedReportItems}
							/>
						))}
					</ul>
				</div>

				<DialogFooter className='flex !flex-row !justify-start'>
					<ReportConfirmation
						closeParentModal={handlePostReport}
						selectedReportItems={selectedReportItems}
					/>
					<DialogClose asChild>
						<Button className='border-primary text-secondary dark:text-secondary-light border bg-transparent hover:border hover:bg-transparent focus:outline-none focus-visible:border-none focus-visible:ring-0 focus-visible:ring-offset-0'>
							Cancel
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default Report;
