import Image from 'next/image';

import { Button } from '../ui/button';
import Statistic from './statistic';

type InterviewPostCardProps = {
	authorImage: string;
	name: string;
	createdAt: string;
	captions: string;
	image: string;
};

export default function InterviewsPostCard({
	authorImage,
	captions,
	createdAt,
	image,
	name,
}: InterviewPostCardProps) {
	return (
		<div className='flex w-full flex-col gap-2.5 rounded-2xl bg-white p-5 dark:bg-secondary-dark-2 '>
			<div className='flex w-full items-start justify-between gap-[30px]'>
				<div className='flex w-full flex-col gap-5'>
					<header className='flex items-center gap-4'>
						<Image
							className='size-11 rounded-full'
							src={authorImage}
							alt='author image'
							width={44}
							height={44}
						/>
						<div className='flex flex-col'>
							<h3 className='text-darkSecondary-900 text-sm font-semibold leading-normal dark:text-white-800 md:text-base'>
								{name}
							</h3>
							<p className='text-xs font-normal leading-snug text-neutral-400 md:text-sm'>
								{createdAt}
							</p>
						</div>
					</header>
					<Image
						alt='post'
						width={280}
						height={180}
						className='block w-full rounded-lg object-contain lg:hidden'
						src={'/assets/images/illustration.png'}
					/>
					<p className='text-darkSecondary-900 text-base font-semibold leading-relaxed dark:text-white-800 md:text-lg'>
						{captions}
					</p>
					<div className='flex w-full flex-wrap items-center justify-between gap-5'>
						<Statistic />
						<Button className='flex items-center justify-center gap-2.5 rounded'>
							<span className='text-sm font-semibold leading-snug text-white'>
								Full Details
							</span>
						</Button>
					</div>
				</div>
				<Image
					alt='post'
					width={280}
					height={180}
					className='hidden h-[180px] w-[280px] rounded-lg lg:block'
					src={image}
				/>
			</div>
		</div>
	);
}
