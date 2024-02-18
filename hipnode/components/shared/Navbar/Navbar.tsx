import Image from 'next/image';
import { currentUser } from '@clerk/nextjs';
import Link from 'next/link';

import NavLink from './NavLink';
import ModeToggle from './theme-switch';
import { getAllNotifications } from '@/lib/actions';
import Notification from './Notification';

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
					width={28}
					height={34}
					loading='lazy'
					alt='Logo'
				/>
				<h1 className='dark:text-white-700 hidden sm:block'>Snaply</h1>
			</Link>
			<NavLink />
			<form className='md:bg-white-800 dark:md:bg-secondary-dark flex items-center gap-3 rounded-lg max-md:w-auto md:w-[200px] md:flex-row-reverse md:p-1 lg:w-[400px]'>
				<label
					htmlFor='search'
					className='bg-white-800 dark:bg-secondary-dark mr-2 rounded-md p-2 sm:mr-5 md:mr-0'
				>
					<Image
						className='aspect-auto w-3 min-w-4 object-contain'
						src='/assets/general/icons/search.svg'
						width={20}
						loading='lazy'
						height={20}
						alt='search icon'
					/>
				</label>
				<input
					autoComplete='off'
					type='search'
					placeholder='Search....'
					className='focus-visible:bg-white-700 hidden bg-transparent pl-2 focus-visible:absolute focus-visible:left-0 focus-visible:block focus-visible:outline-none max-md:focus-visible:w-full md:block md:w-full focus-visible:md:static md:focus-visible:bg-transparent '
					id='search'
				/>
			</form>
			<div className='flex items-center gap-2 sm:gap-5'>
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
				<Notification notifications={allNotifications ?? []} />
				<button className='flex w-8 items-center gap-2 md:w-auto'>
					<Image
						className='aspect-auto min-w-4 rounded-lg border-2 object-contain'
						src={user?.imageUrl ?? ''}
						width={35}
						loading='lazy'
						height={35}
						alt=' user'
					/>
					<Link
						href={`/profile/${user.id}`}
						className='dark:text-white-700 hidden text-lg font-semibold capitalize md:block'
					>
						{user?.username ?? user?.firstName}
					</Link>
				</button>
				<ModeToggle />
			</div>
		</nav>
	);
}
