'use client';

import { toast } from 'sonner';
import { useAuth } from '@clerk/nextjs';

import { handleFollow } from '@/lib/actions';
import { Button } from '../ui/button';

export default function FollowButton({
	id,
	followers,
}: {
	id: string;
	followers: string[];
}) {
	const { userId } = useAuth();
	const isFollowing = followers.includes(userId!);

	async function handleFollowUnFollow() {
		try {
			await handleFollow(id);
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			}
		}
	}
	return (
		<Button className='grow' onClick={handleFollowUnFollow}>
			{isFollowing ? 'UnFollow' : 'Follow'}
		</Button>
	);
}
