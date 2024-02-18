import Image from 'next/image';

const examplesPictures = [
	'/img.png',
	'/img.png',
	'/img.png',
	'/img.png',
	'/img.png',
	'/img.png',
	'/img.png',
	'/img.png',
];
export default function RecentMedia() {
	return (
		<section className='dark:bg-secondary-dark-2 w-full rounded-2xl bg-white p-5'>
			<h3 className='text-secondary dark:text-white-800 text-base font-semibold'>
				Recent Media
			</h3>
			<div className='flex flex-wrap'>
				{examplesPictures.map((pic) => (
					<Image
						src={pic}
						width={88}
						className='object-auto h-full rounded-sm shadow'
						height={88}
						alt='picture'
						key={pic}
					/>
				))}
			</div>
		</section>
	);
}
