'use client';

import Image from 'next/image';
import { useState } from 'react';

import AudioControll from './AudioControll';
import { cn } from '@/lib/utils';

export default function AudioMetadata() {
	const [isPlaying, setIsPlaying] = useState<boolean>(false);

	return (
		<header className='flex w-full items-start justify-between gap-5'>
			<div className='flex w-full gap-5'>
				<div className='flex items-center'>
					<Image
						src='/audio.png'
						width={100}
						height={100}
						alt=''
						fetchPriority='high'
						priority
						className='z-10 aspect-square size-40 border rounded-lg'
					/>
					{/* bg-[#3F4354] */}
					<div
						className={cn(
							'-ml-12 size-36 rounded-full relative flex justify-center items-center bg-[url("/audio.png")] bg-cover bg-no-repeat border-2',
							isPlaying && 'animate-spin rounded-full'
						)}
						style={{
							animationDuration: '10000ms',
						}}
					>
						<div className='absolute flex size-12 items-center justify-center rounded-full border'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								width='130'
								height='130'
								viewBox='0 0 130 130'
								fill='none'
							>
								<circle
									cx='65'
									cy='65'
									r='65'
									className={cn(
										' dark:fill-[#97989db5]',
										isPlaying ? 'fill-[#97989db5]' : 'fill-[#97989D]'
									)}
									stroke='#C5D0E6'
									stroke-width='2'
								/>
								<circle
									cx='65'
									cy='65'
									r='25'
									fill='#F7F7F7'
									className={cn('fill-white', isPlaying ? 'fill-white/75' : '')}
									stroke='#C5D0E6'
									stroke-width='2'
								/>
							</svg>
						</div>
					</div>
					{/* <Image
						className={cn(
							'-ml-12 size-36',
							isPlaying &&
								'animate-spin duration-1000 border-t border-t-primary  rounded-full'
						)}
						src='/assets/podcasts/icons/disk.svg'
						width={100}
						height={100}
						alt=''
					/> */}
				</div>
				<div className='flex grow justify-between'>
					<div className='w-full'>
						<p className='text-secondary dark:text-white-700 text-xs font-medium'>
							Hipnod • Episode 243
						</p>
						<h2 className='text-secondary dark:text-white-700 text-xl font-semibold'>
							by Courtland Allen
						</h2>
						<AudioControll isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
					</div>
				</div>
			</div>
		</header>
	);
}
