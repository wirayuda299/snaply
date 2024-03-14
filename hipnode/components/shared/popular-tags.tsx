import { cn } from '@/lib/utils';
import { Tag } from '@/types';

export default function PopularTags({
	items,
	styles,
	innerStyles,
}: {
	items: Tag[];
	styles?: string;
	innerStyles?: string;
}) {
	return (
		<aside
			className={cn(
				'rounded-lg bg-white dark:bg-secondary-dark-2 p-3 min-w-[218px] max-lg:w-full w-[218px] hidden md:block',
				styles
			)}
		>
			<ul
				className={cn(
					'no-scrollbar flex flex-col items-center gap-5  overflow-x-auto md:flex-col md:items-start ',
					innerStyles
				)}
			>
				{items.map((item) => (
					<li key={item._id}>
						<h3
							className={
								'text-secondary dark:text-white-700 w-full truncate text-sm font-semibold max-lg:w-full'
							}
						>
							#{item.name}
						</h3>
						{item.postIds.length >= 1 && (
							<p className='text-secondary dark:text-secondary-light text-xs font-normal'>
								{item.postIds.length} posts using this tag
							</p>
						)}
					</li>
				))}
			</ul>
		</aside>
	);
}
