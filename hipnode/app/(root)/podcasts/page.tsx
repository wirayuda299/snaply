import Image from 'next/image';

import { Category, Card, MeetupCard } from '@/components/index';

const categories = [
	'indie bites',
	'software social',
	'hipnode',
	'free',
] as const;

export default function Podcasts() {
	return (
		<div className='flex flex-col gap-5 py-5 lg:flex-row'>
			<section className='top-0 w-80 max-md:w-full lg:sticky lg:h-screen'>
				<Category categories={categories} title='Filter by Show' />
			</section>
			<section className='flex w-full grow flex-wrap gap-5'>
				{[1, 2, 3, 4, 5].map((c) => (
					<article
						className='dark:bg-secondary-dark-2 max-w-xs rounded-xl bg-white p-5 max-lg:max-w-full'
						key={c}
					>
						<h2 className='text-secondary dark:text-white-700 text-xl font-semibold'>
							Workshopping Pay-As-You-Go Failed Payments
						</h2>
						<p className='text-secondary dark:text-secondary-light line-clamp-6 pt-2 text-sm'>
							Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel,
							laboriosam, nemo provident deleniti voluptatum, ea hic ipsam
							aspernatur voluptas obcaecati dolorem quasi mollitia possimus!
							Maiores aliquam harum cumque, hic vitae deserunt vero distinctio
							accusantium ut facere consequatur velit doloribus ducimus pariatur
							neque quidem! Neque sed ipsa error facilis sit inventore.
							Obcaecati alias, a eos dolorem consectetur distinctio deleniti
							odio temporibus sapiente provident dicta eum ad quae inventore
							omnis non eligendi? Totam distinctio repellat, porro ratione aut
							magnam ducimus corporis nesciunt qui hic quia provident tempora
							eveniet, eaque culpa. Nostrum iure nesciunt exercitationem
							excepturi recusandae perspiciatis molestias minima doloremque quos
							tenetur?
						</p>

						<div className='mt-5 flex items-center gap-3'>
							<Image
								className='bg-white-800 dark:bg-secondary-dark-2 size-14 rounded-full p-2'
								src='/avatar.png'
								width={50}
								height={50}
								alt='user'
								priority
							/>
							<div>
								<h3 className='text-secondary dark:text-white-700 text-base font-semibold'>
									Moshkur Alom
								</h3>
								<p className='text-secondary dark:text-secondary-light text-xs'>
									Sylhet, Bangladesh
								</p>
							</div>
						</div>
					</article>
				))}
			</section>
			<section className='space-y-5'>
				<Card
					path='/post/create'
					text="Working on your own internet business? We'd love to interview you!"
					title='Start Your Podcasts'
					btnLeftText='Code of Conduct'
					btnRightText='Start Your Podcasts'
				/>
				<MeetupCard />
			</section>
		</div>
	);
}
