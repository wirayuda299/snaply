import Image from 'next/image';

type Admin = {
	_id: string;
	username: string;
	profileImage: string;
};

export default async function GroupsAdmin({
	admins,
}: {
	admins: Admin[] | undefined;
}) {
	return (
		<section className='text-secondary dark:bg-secondary-dark-2 dark:text-white-800 flex w-[210px] flex-col gap-5 rounded-2xl bg-white p-5 max-lg:w-full'>
			<h3 className='text-secondary dark:text-white-800 text-base font-semibold'>
				Admins
			</h3>
			{admins?.map((admin) => (
				<div
					key={admin._id}
					className='flex w-full items-center justify-between gap-3'
				>
					<div className='flex items-center gap-x-2'>
						<Image
							src={admin.profileImage ?? '/avatar.png'}
							width={35}
							height={35}
							className='rounded-full object-cover object-center'
							alt={admin.username}
						/>

						<h3 className='capitalize'>{admin.username}</h3>
					</div>
				</div>
			))}
		</section>
	);
}
