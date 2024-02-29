'use client';

import { toast } from 'sonner';
import { useAuth } from '@clerk/nextjs';
import { useCallback } from 'react';

import { handleFollow } from '@/lib/actions';
import { Button } from '../ui/button';

export default function FollowButton({
	id,
	followers,
	path,
}: {
	id: string;
	followers: string[];
	path: string;
}) {
	const { userId } = useAuth();
	const isFollowing = followers.includes(userId!);

	const handleFollowUnFollow = useCallback(async () => {
		try {
			await handleFollow(id, path);
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			}
		}
	}, [id, path]);

	return (
		<Button className='w-full grow' onClick={handleFollowUnFollow}>
			{isFollowing ? 'UnFollow' : 'Follow'}
		</Button>
	);
}
