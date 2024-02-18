'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

interface ReportConfirmationProps {
	closeParentModal: () => void;
	selectedReportItems: string[];
}

const ReportConfirmation = ({
	closeParentModal,
	selectedReportItems,
}: ReportConfirmationProps) => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button type='submit' disabled={selectedReportItems.length === 0}>
					Submit
				</Button>
			</DialogTrigger>
			<DialogContent className='dark:bg-secondary-dark-2 flex flex-col gap-7 rounded-2xl bg-white p-7 max-sm:max-w-[477px]'>
				<DialogHeader>
					<DialogTitle className='text-secondary dark:text-white-800 text-center text-base'>
						Post reported successfully. <br />
						<br />
						Thank you!
					</DialogTitle>
				</DialogHeader>

				<DialogFooter className='flex !flex-row !justify-center'>
					<Button
						type='button'
						onClick={() => {
							setIsOpen(false);
							closeParentModal();
						}}
						className='heading-3 !bg-secondary-blue min-w-[160px] cursor-pointer rounded-md p-2.5 text-center text-white hover:!opacity-90 dark:text-white'
					>
						Go Back
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
export default ReportConfirmation;
