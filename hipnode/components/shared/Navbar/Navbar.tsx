import Image from 'next/image';
import { currentUser } from '@clerk/nextjs';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import { getAllNotifications } from '@/lib/actions';

const SearchForm = dynamic(() => import('./SearchForm'));
const Notification = dynamic(() => import('./Notification'));
const ModeToggle = dynamic(() => import('./theme-switch'));
const NavLink = dynamic(() => import('./NavLink'));

export default async function Navbar() {
	const user = await currentUser();
	if (!user) return null;

	const allNotifications = await getAllNotifications();

	return (
		<nav className='dark:bg-primary-dark relative flex items-center justify-end bg-white p-3 md:justify-between lg:sticky lg:top-0 lg:z-50  lg:p-5'>
			<Link
				href={'/'}
				className='flex flex-1 items-center gap-2 text-2xl font-semibold md:flex-none'
			>
				<Image
					className='aspect-auto object-contain'
					src='/assets/general/icons/logo.svg'
					width={30}
					height={34}
					loading='lazy'
					alt='Logo'
				/>
				<h1 className='dark:text-white-700 hidden lg:block'>Snaply</h1>
			</Link>
			<NavLink />
			<SearchForm />
			<div className='flex items-center gap-2'>
				<button className='bg-white-800 dark:bg-secondary-dark rounded-md p-2'>
					<Image
						className='aspect-auto w-3 min-w-4 object-contain grayscale invert-[20%] dark:grayscale-0 dark:invert-0'
						src='/assets/general/icons/chat.svg'
						width={20}
						height={20}
						loading='lazy'
						alt='bell icon'
					/>
				</button>
				{!allNotifications.error && (
					<Notification notifications={allNotifications.data ?? []} />
				)}
				<div className='flex w-8 items-center gap-3 md:w-auto'>
					<Image
						className='aspect-auto min-w-4 rounded-lg border-2 object-contain'
						src={user?.imageUrl ?? ''}
						width={35}
						loading='lazy'
						height={35}
						alt=' user'
					/>
					<p className='dark:text-white-700 hidden text-lg font-semibold capitalize md:block'>
						{user?.username ?? user?.firstName}
					</p>
				</div>
				<ModeToggle id={user.id} />
			</div>
		</nav>
	);
}
