'use client';

import type { Dispatch, SetStateAction } from 'react';

interface ReportItemProps {
	id: number;
	title: string;
	selectedReportItem: string[];
	setSelectedReportItems: Dispatch<SetStateAction<string[]>>;
}

const ReportItem = ({
	id,
	title,
	setSelectedReportItems,
	selectedReportItem,
}: ReportItemProps) => {
	const handleClick = () => {
		setSelectedReportItems((prevState) => {
			if (prevState.includes(title)) {
				return prevState.filter((prevtitle) => prevtitle !== title);
			}
			return prevState.concat(title);
		});
	};

	return (
		<li
			key={id}
			onClick={handleClick}
			className={`border-secondary bg-white-700 dark:bg-secondary-dark cursor-pointer rounded-2xl border px-5 py-2.5 ${
				selectedReportItem.includes(title)
					? 'border-primary dark:border-primary'
					: 'border-transparent'
			}
    `}
		>
			<p className='text-secondary dark:text-white-800'>{title}</p>
		</li>
	);
};

export default ReportItem;
