import Link from 'next/link';
import { Button } from '../ui/button';

type CardProps = {
	title: string;
	text: string;
	btnLeftText: string;
	btnRightText: string;
	path: string;
};

export default function Card({
	text,
	title,
	btnLeftText,
	btnRightText,
	path,
}: CardProps) {
	return (
		<div className='bg-primary text-white-700 w-full rounded-md p-3'>
			<header>
				<h2 className='text-lg font-semibold'>{title}</h2>
				<p className='text-xs font-medium'>{text}</p>
			</header>
			<div className='mt-3 flex justify-between gap-3'>
				<Button className='text-primary-dark hover:text-white-700 w-28 bg-white text-xs'>
					{btnLeftText}
				</Button>
				<Link
					href={path}
					className='flex w-28 items-center justify-center rounded-lg bg-blue-500 text-center text-sm '
				>
					{btnRightText}
				</Link>
			</div>
		</div>
	);
}
