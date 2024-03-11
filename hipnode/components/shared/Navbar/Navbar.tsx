import Image from 'next/image';
import { currentUser } from '@clerk/nextjs';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import { getAllNotifications, getUnreadChat } from '@/lib/actions';
import Messages from './Messages';

const SearchForm = dynamic(() => import('./SearchForm'));
const Notification = dynamic(() => import('./Notification'));
const ModeToggle = dynamic(() => import('./theme-switch'));
const NavLink = dynamic(() => import('./NavLink'));

export default async function Navbar() {
	const user = await currentUser();
	if (!user) return null;

	const [allNotifications, messages] = await Promise.all([
		getAllNotifications(),
		getUnreadChat(user.id),
	]);

	return (
		<nav className='dark:bg-primary-dark fixed inset-x-0 top-0 z-10 flex items-center justify-end bg-white p-3 md:justify-between lg:p-5'>
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
				<Messages messages={messages} />
				<Notification notifications={allNotifications} />
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
