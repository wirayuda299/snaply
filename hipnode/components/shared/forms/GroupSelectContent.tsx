'use client';

import Image from 'next/image';
import type { UseFormReturn } from 'react-hook-form';

import { Group } from '@/types';

type ReturnTypes = {
	title: string;
	post: string;
	postImage: string;
	group: {
		id: string;
		name: string;
		profileImage: string;
	} | null;
	date: string;
	createType: string;
	tags: string[];
	country: string;
	address: string;
	companyName: string;
	audio: string;
};

export default function GroupSelectContent({
	groups,
	form,
}: {
	groups: Group[];
	form: UseFormReturn<ReturnTypes>;
}) {
	return (
		<div className='flex w-full flex-col gap-3 p-3 dark:bg-secondary-dark-2 md:flex-row'>
			{groups.map((group) => (
				<div
					onClick={() =>
						form.setValue('group', {
							id: group._id,
							name: group.name,
							profileImage: group.logo,
						})
					}
					className='mb-2 flex cursor-pointer flex-col items-start  space-y-5'
					key={group._id}
				>
					<div className='w-full flex-1 rounded-lg  p-3'>
						<div className=' flex gap-2'>
							<Image
								className='aspect-auto size-12 rounded-full object-cover object-center'
								src={group.logo}
								alt='profile'
								width={20}
								height={20}
							/>
							<h2 className='line-clamp-1 text-left text-lg font-semibold text-secondary dark:text-secondary-light'>
								{group.name}
								<p className='text-xs'>
									Created by{' '}
									{group.admins.map((admin) => (
										<span key={admin._id}>{admin.username}</span>
									))}
								</p>
							</h2>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
