import {
	ActiveMember,
	HostMeetupCard,
	GroupBanner,
	GroupAdmin,
	RecentMedia,
	GroupAbout,
	Explore,
	PostCard,
} from '@/components/index';
import { getGroupById } from '@/lib/actions/group.action';

type Props = {
	params: {
		id: string;
	};
};

export default async function GroupDetail({ params }: Props) {
	const group = await getGroupById(params.id);

	return (
		<div className='size-full min-h-full py-5'>
			<div className='flex w-full justify-between gap-5 max-lg:flex-wrap'>
				<aside className='top-0 hidden size-full max-w-[210px] gap-5 overflow-y-auto lg:sticky lg:flex lg:flex-col'>
					<GroupAbout about={group?.description ?? ''} />
					<GroupAdmin admins={group?.admins} />
				</aside>
				<section className=' w-full grow space-y-5'>
					<GroupBanner
						id={params.id}
						members={group?.members}
						logo={group?.logo ?? ''}
						author={group?.admins[0].username ?? ''}
						banner={group?.banner ?? ''}
						title={group?.name ?? ''}
					/>
					<Explore />
					{group.posts.map((post) => (
						<div key={post._id} className='w-full'>
							<PostCard post={post} type='post' />
						</div>
					))}
					<div className='flex flex-wrap gap-5 lg:hidden'>
						<aside className='top-0 hidden size-full max-h-screen max-w-[210px] gap-5 overflow-y-auto lg:sticky lg:flex lg:flex-col'>
							<GroupAbout about={group?.description ?? ''} />
							<GroupAdmin admins={group?.admins ?? []} />
						</aside>
					</div>
				</section>
				<aside className='flex size-full max-w-[325px] flex-col gap-5 overflow-y-auto overflow-x-hidden max-lg:max-w-full lg:sticky lg:top-0'>
					<HostMeetupCard
						title='Create Group'
						text='Create a community and unite with like-minded individuals. Embark on exciting journeys together.'
						btnLeftText='Code of Conduct'
						btnRightText='Create group.'
					/>
					<ActiveMember />
					<RecentMedia />
				</aside>
			</div>
		</div>
	);
}
