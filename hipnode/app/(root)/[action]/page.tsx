import { currentUser } from '@clerk/nextjs/server';

import { CreateForm } from '@/components/index';
import { getAllGroupsWhereUserJoin } from '@/lib/actions';

type Props = {
	params: { action: 'update' | 'create' };
	searchParams: { type: 'meetup' | 'post'; postId: string; title: string };
};
export default async function Create(props: Props) {
	const user = await currentUser();
	const groups = await getAllGroupsWhereUserJoin([user?.id!]);

	return (
		<div className='dark:border-secondary-dark-2 mx-auto flex w-full max-w-[900px] justify-center rounded-xl border pb-20 pt-5'>
			<CreateForm groups={groups} props={props} />
		</div>
	);
}
