import Image from 'next/image';

export default function ActiveMember() {
	return (
		<section className='dark:bg-primary-dark hidden w-full rounded-2xl bg-white p-5'>
			<h3 className='text-secondary dark:text-white-700 pb-5 text-base font-semibold'>
				Active Members
			</h3>
			<div className='flex flex-wrap gap-5'>
				{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((activeMember) => (
					<div key={activeMember}>
						<Image
							src={'/assets/images/profile.svg'}
							width={40}
							height={40}
							alt='user'
						/>
					</div>
				))}
			</div>
		</section>
	);
}
