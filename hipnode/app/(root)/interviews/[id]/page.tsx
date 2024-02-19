import Image from 'next/image';

import Statistic from '@/components/interviews/statistic';
import { Parser } from '@/components/index';

export default function InterviewDetail() {
	const tags = ['#technology', '#diversity', '#hr'];

	const exampleData = `
  <p>In a recent interview with HR and people management experts, we explored the significance of leading with empathy in today's business world. Here are the key takeaways:</p>
`;
	return (
		<div className='mx-auto mt-28 size-full min-h-screen max-w-[785px] p-5'>
			<section className='dark:bg-secondary-dark-2 flex w-full flex-col justify-center rounded-lg bg-white'>
				<Image
					className='mx-auto object-cover object-center'
					src={'/banner.png'}
					width={785}
					height={273}
					alt='image'
				/>
				<div className='p-5'>
					<div className='flex items-center gap-5'>
						<h1 className='text-darkSecondary-600 text-lg font-normal'>H1</h1>
						<h2 className='text-darkSecondary-900 dark:text-white-800 py-5 text-base font-semibold md:text-[26px]'>
							Leading with Empathy: An Interview with HR and People Management
							Experts
						</h2>
					</div>
					<section className='flex flex-wrap items-center justify-between gap-5 '>
						<Statistic />
						<ul className='flex items-center gap-5'>
							{tags.map((tag) => (
								<li
									key={tag}
									className='text-secondary-yellow-90 text-xs font-normal md:text-base'
								>
									{tag}
								</li>
							))}
						</ul>
					</section>
					<Parser content={exampleData} />
				</div>
			</section>
		</div>
	);
}
