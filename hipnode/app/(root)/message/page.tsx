import { currentUser } from '@clerk/nextjs';
import dynamic from 'next/dynamic';
import { MessagesSquare } from 'lucide-react';

import { getAllMessages, getAllUsers } from '@/lib/actions';
const ChatAuthor = dynamic(() => import('@/components/message/ChatAuthor'));
const MessageList = dynamic(() => import('@/components/message/message-lists'));

type Props = {
	searchParams: { id: string; to: string };
};

export default async function Messages({ searchParams }: Props) {
	const userSession = await currentUser();
	if (!userSession) return null;

	const [messages, allUsers] = await Promise.all([
		getAllMessages(userSession.id),
		getAllUsers(userSession.id),
	]);

	return (
		<main className='relative flex h-screen grid-cols-2 justify-between !overflow-hidden lg:grid'>
			<ChatAuthor
				imageUrl={userSession.imageUrl}
				username={userSession?.username! ?? 'Error loading username'}
				allUsers={allUsers}
				conversationId={searchParams.id}
				converstations={messages}
				userSessionId={userSession.id}
			/>
			{searchParams.id ? (
				<MessageList
					id={searchParams.id}
					userId={userSession.id}
					to={searchParams.to}
				/>
			) : (
				<div className='flex min-h-screen w-full flex-col items-center justify-center pt-5 '>
					<MessagesSquare size={100} />
					<p className='pt-3'>Your message will show here</p>
				</div>
			)}
		</main>
	);
}
