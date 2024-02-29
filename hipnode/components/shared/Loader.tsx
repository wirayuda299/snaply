import Image from 'next/image';

export default function Loader() {
	return (
		<div className='flex min-h-screen w-full items-center justify-center'>
			<Image
				className='aspect-auto object-contain'
				src='/assets/general/icons/logo.svg'
				width={50}
				height={50}
				loading='lazy'
				alt='Logo'
			/>
		</div>
	);
}
