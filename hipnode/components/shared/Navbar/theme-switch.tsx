'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const options = (id: string) => {
	return [
		{
			icon: '/assets/general/icons/user.svg',
			label: 'profile',
			path: `/profile/${id}`,
		},
		{
			icon: '/assets/general/icons/settings.svg',
			label: 'settings',
			path: `/settings`,
		},
		{
			icon: '/assets/general/icons/logout.svg',
			label: 'log out',
			path: undefined,
		},
	] as const;
};

export default function ModeToggle({ id }: { id: string }) {
	const { setTheme, theme } = useTheme();
	const { signOut } = useClerk();
	const router = useRouter();

	return (
		<DropdownMenu>
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
					<Switch
						defaultChecked={false}
						className='bg-white-700 dark:bg-secondary-dark border'
						onClick={(e) => {
							setTheme(theme === 'light' ? 'dark' : 'light');
						}}
					/>
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
