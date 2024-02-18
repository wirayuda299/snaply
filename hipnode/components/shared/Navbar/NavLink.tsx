'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import { navLinks } from '@/constants/general';
import { cn } from '@/lib/utils';

export default function NavLink() {
	const pathname = usePathname();

	const isActive = (path: string) => pathname === path;

	return (
		<ul className='dark:border-secondary-dark-2 dark:bg-secondary-dark-2 fixed inset-x-0 bottom-0 z-50 flex items-center justify-between gap-1 border-t bg-white p-3 sm:gap-3 md:static md:border-none md:bg-transparent md:p-0 lg:gap-5 xl:gap-8 md:dark:bg-transparent'>
			{navLinks.map((navLink) => (
				<li
					key={navLink.label}
					className={isActive(navLink.path) ? 'bg-primary rounded-md p-2' : ''}
				>
					<Link href={navLink.path}>
						<Image
							className={cn(
								'aspect-auto object-contain grayscale invert-[20%] dark:grayscale-0 dark:invert-0 ',
								isActive(navLink.path) ? 'grayscale-0 invert-0' : ''
							)}
							src={navLink.icon}
							width={25}
							height={25}
							alt={navLink.label}
						/>
					</Link>
				</li>
			))}
		</ul>
	);
}
