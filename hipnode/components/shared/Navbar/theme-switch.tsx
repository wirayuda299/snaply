'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { options } from '@/constants';

export default function ModeToggle({ id }: { id: string }) {
	const { setTheme, theme } = useTheme();
	const { signOut } = useClerk();
	const router = useRouter();

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger
				asChild
				className='focus-visible:ring-0 focus-visible:ring-offset-0'
			>
				<Button
					className='w-4 border-none !bg-transparent focus-visible:border-none'
					size='icon'
				>
					<svg
						className='invert dark:invert-0'
						width='10'
						height='8'
						viewBox='0 0 10 8'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path
							d='M9 0H1C0.175955 0 -0.294427 0.940764 0.2 1.6L4.2 6.93333C4.6 7.46667 5.4 7.46667 5.8 6.93333L9.8 1.6C10.2944 0.940764 9.82405 0 9 0Z'
							fill='#F4F6F8'
						/>
					</svg>

					<span className='sr-only'>Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align='end'
				className='dark:bg-secondary-dark-2 border-none bg-white'
			>
				{options(id).map((option) => (
					<DropdownMenuItem className='capitalize' key={option.label}>
						{option.label === 'log out' ? (
							<button
								onClick={() => signOut().then(() => router.push('/sign-in'))}
								className='flex items-center gap-3 capitalize'
							>
								<Image
									className='object-contain brightness-100'
									src={option.icon}
									width={20}
									height={20}
									alt={option.label}
								/>
								<span>{option.label}</span>
							</button>
						) : (
							<Link href={option.path} className='flex items-center gap-3'>
								<Image
									className={cn(
										'object-contain brightness-0 dark:brightness-100'
									)}
									src={option.icon}
									width={20}
									height={20}
									alt={option.label}
								/>
								<span>{option.label}</span>
							</Link>
						)}
					</DropdownMenuItem>
				))}
				<hr className='mt-2 block' />
				<div className='flex items-center gap-3 py-3'>
					<h3 className='text-base font-semibold'>Interface</h3>
					<div
						onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
						className={cn(
							'bg-white-700 dark:bg-secondary relative flex h-5 w-full cursor-pointer items-center justify-center rounded-full before:content-[""] before:absolute before:size-5 before:left-0 before:flex before:items-center dark:before:bg-[url("/assets/general/icons/sun-dark.svg")] before:bg-no-repeat before:bg-cover before:bg-center before:bg-white-700/5 before:rounded-full after:content-[""] after:absolute after:right-0 after:size-5 after:bg-cover after:bg-no-repeat after:bg-[url("/assets/general/icons/moon-dark.svg")] after:bg-white-700/5 after:grayscale dark:after:hidden '
						)}
					>
						<button
							className={cn(
								'bg-white-700  flex items-center rounded-full before:absolute before:top-0 before:size-5 before:bg-[url("/assets/general/icons/sun-light.svg")] dark:before:bg-[url("/assets/general/icons/moon-dark.svg")] before:bg-cover before:bg-center before:content-[""] transition-transform ease duration-500',
								theme === 'dark' ? ' before:right-0 ' : 'before:left-0'
							)}
						></button>
					</div>
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
