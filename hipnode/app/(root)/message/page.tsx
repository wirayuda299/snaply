import { currentUser } from '@clerk/nextjs';
import Image from 'next/image';

import { getAllMessages, getAllUsers } from '@/lib/actions';
import { MessageDialog } from '@/components/index';
import MessageList from '@/components/message/message-lists';
import ChatAuthor from '@/components/message/ChatAuthor';

type Props = {
	searchParams: { id: string };
};

export default async function Messages({ searchParams }: Props) {
	const userSession = await currentUser();
	if (!userSession) return null;

	const [messages, allUsers] = await Promise.all([
		getAllMessages(userSession.id),
		getAllUsers(userSession.id),
	]);

	return (
		<main className='grid h-screen grid-cols-2 justify-between overflow-hidden'>
			<aside className='dark:bg-secondary-dark-2 no-scrollbar sticky top-0 col-span-2 h-screen w-full overflow-y-auto bg-white p-5 md:border-r-2 lg:col-span-1'>
				<header className='dark:bg-secondary-dark-2 border-b-secondary/5 dark:border-b-secondary-dark bg-white-800 flex h-20 items-center gap-3 rounded-lg border-b'>
					<Image
						width={50}
						height={50}
						alt='user'
						src={userSession?.imageUrl!}
						className='rounded-full object-contain object-center'
					/>
					<h2 className='text-lg font-semibold capitalize'>
						{userSession?.username}
					</h2>
				</header>
				<div>
					<MessageDialog
						messages={messages}
						users={allUsers}
						userSession={userSession.id}
					/>
					<ChatAuthor
						converstations={messages}
						userSessionId={userSession.id!}
					/>
				</div>
			</aside>
			{searchParams.id ? (
				<MessageList id={searchParams.id} userId={userSession.id} />
			) : (
				<p>Your message will show here</p>
			)}
		</main>
	);
}
