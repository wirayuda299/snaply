import Image from 'next/image';

import { Category, Card, MeetupCard, Parser } from '@/components/index';
import { getAllPodcasts } from '@/lib/actions/podcast.action';
import Link from 'next/link';

const categories = [
	'indie bites',
	'software social',
	'hipnode',
	'free',
] as const;

export default async function Podcasts() {
	const { podcasts } = await getAllPodcasts();
	console.log(podcasts);

	return (
		<div className='flex flex-col gap-5 py-5 lg:flex-row'>
			<section className='top-0 w-80 max-md:w-full lg:sticky lg:h-screen'>
				<Category categories={categories} title='Filter by Show' />
			</section>
			<section className='flex w-full grow flex-wrap gap-5'>
				{podcasts?.map((podcast) => (
					<article
						className='h-min max-w-xs rounded-xl bg-white p-5 dark:bg-secondary-dark-2 max-lg:max-w-full'
						key={podcast._id}
					>
						<Link
							href={`/podcasts/${podcast._id}`}
							className='block  text-xl font-semibold text-secondary first-letter:uppercase dark:text-white-700'
						>
							{podcast.title}
						</Link>
						<Parser content={podcast.body} />

						<div className='mt-5 flex items-center gap-3'>
							<Image
								className='size-14 rounded-full bg-white-800 p-2 dark:bg-secondary-dark-2'
								src={podcast.author.profileImage ?? '/avatar.png'}
								width={50}
								height={50}
								alt='user'
								priority
							/>
							<div>
								<h3 className='text-base font-semibold text-secondary dark:text-white-700'>
									{podcast.author.username}
								</h3>
								<p className='text-xs text-secondary dark:text-secondary-light'>
									{podcast.author.region}, {podcast.author.country}
								</p>
							</div>
						</div>
					</article>
				))}
			</section>
			<section className='space-y-5'>
				<Card
					path='/create?type=podcasts'
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
