import Image from 'next/image';
import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from 'react';

import { Button } from '../ui/button';
import { Pause, Play } from 'lucide-react';

export default function AudioControll({
	isPlaying,
	setIsPlaying,
}: {
	isPlaying: boolean;
	setIsPlaying: Dispatch<SetStateAction<boolean>>;
}) {
	const ref = useRef<HTMLAudioElement>(null);
	const [currentTime, setCurrentTime] = useState<number>(
		ref.current?.currentTime ?? 0
	);

	const handleClick = () => {
		if (!ref.current) return;

		if (isPlaying) {
			ref.current.pause();
			setIsPlaying(false);
		} else {
			ref.current.play();
			setIsPlaying(true);
		}
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (ref.current) {
			ref.current.currentTime = +e.target.value;
		}
	};

	return (
		<div className='mt-4 flex w-full items-center gap-3'>
			<div className='flex w-full flex-col justify-between gap-5'>
				<input
					type='range'
					onChange={handleChange}
					className='!bg-primary !accent-primary w-full bg-none'
					max={ref.current?.duration}
					value={currentTime}
				/>
				<div className='flex items-center gap-3'>
					<Button
						onClick={handleClick}
						className=' flex items-center gap-3 rounded-full'
					>
						{isPlaying ? <Pause /> : <Play />}
						<span>{isPlaying ? 'Pause' : 'Play Now'}</span>
					</Button>{' '}
					<button className='bg-white-700 dark:bg-secondary-dark dark:border-secondary-dark-2 rounded-full border p-2'>
						<Image
							className='min-w-5 invert dark:invert-0'
							src={'/assets/podcasts/icons/share.svg'}
							width={20}
							height={20}
							alt='share icon'
						/>
					</button>
				</div>
				<audio
					onLoadedMetadata={(e) => setCurrentTime(e.currentTarget.currentTime)}
					onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
					src='/1.mp3'
					preload='metadata'
					ref={ref}
				></audio>
			</div>
		</div>
	);
}
