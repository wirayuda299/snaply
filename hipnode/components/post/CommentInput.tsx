import Image from 'next/image';

import { Input } from '../ui/input';

type Props = {
	image: string;
	handleReply: () => Promise<void>;
};

export default function CommentInput({ image, handleReply }: Props) {
	return (
		<form className='flex items-center gap-3' action={handleReply}>
			<div className='flex size-14 items-center justify-center rounded-full bg-white-700 p-1 dark:bg-secondary-dark-2'>
				<Image
					className='rounded-full'
					src={image}
					width={50}
					height={50}
					alt='user'
					priority
				/>
			</div>
			<Input
				required
				autoComplete='off'
				name='comment'
				placeholder='Add comment'
				className='rounded-full bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0'
			/>
		</form>
	);
}
