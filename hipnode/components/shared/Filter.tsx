import Image from 'next/image';

import { cn } from '@/lib/utils';
import Link from 'next/link';

type ItemProps = {
	label: string;
	icon: string;
	subText: string;
};

type Props = {
	items: Readonly<ItemProps[]>;
	rootStyles?: string;
	innerStyles?: string;
	titleStyles?: string;
};

export default function Filter({
	items,
	rootStyles,
	innerStyles,
	titleStyles,
}: Props) {
	return (
		<aside
			className={cn(
				'rounded-lg bg-white dark:bg-secondary-dark-2 p-3 min-w-[218px]',
				rootStyles
			)}
		>
			<ul
				className={cn(
					'flex gap-5 items-center md:items-start overflow-x-auto no-scrollbar space-x-3 md:flex-col',
					innerStyles
				)}
			>
				{items.map((item, i) => (
					<Link
						href={`${i === 0 ? '?sort=newest' : '?sort=popular'}`}
						className='flex items-center justify-start gap-2'
						key={item.label}
					>
						<Image
							src={item.icon}
							loading='lazy'
							width={28}
							height={28}
							alt={item.label}
						/>
						<div>
							<h3
								className={cn(
									'truncate text-sm font-semibold text-secondary dark:text-white-700',
									titleStyles
								)}
							>
								{item.label}
							</h3>
							{item.subText && (
								<p className='text-secondary-light hidden text-[10px] md:block'>
									{item.subText}
								</p>
							)}
						</div>
					</Link>
				))}
			</ul>
		</aside>
	);
}
