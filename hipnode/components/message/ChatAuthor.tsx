'use client';

import Image from 'next/image';

import { Conversation } from '@/types';
import { formUrlQuery } from '@/utils';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ChatAuthor({
	converstations,
	userSessionId,
}: {
	converstations: Conversation[];
	userSessionId: string;
}) {
	const params = useSearchParams();
	const router = useRouter();

	function updateSearchParams(id: string) {
		const url = formUrlQuery(params.toString(), 'id', id);
		router.replace(url!);
	}

	return (
		<div className='divide-secondary-light divide-y'>
			{converstations.map((converstation) => {
				return converstation.members
					.filter((member) => member._id !== userSessionId)
					.map((member) => (
						<div
							onClick={() => updateSearchParams(converstation._id)}
							key={member._id}
							className='flex cursor-pointer items-center gap-3'
						>
							<Image
								src={member.profileImage ?? '/avatar.png'}
								width={50}
								height={50}
								alt={member.username}
								className='rounded-full'
							/>
							<h2 className='text-secondary text-lg font-semibold capitalize'>
								{member.username}
							</h2>
						</div>
					));
			})}
		</div>
	);
}
