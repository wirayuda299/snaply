import CreateGroupForm from '@/components/groups/create-group-form';
type Props = {
	params: { type: 'update' | 'create' };
	searchParams: { groupId: string };
};
export default function CreateGroup({ params, searchParams }: Props) {
	console.log({ params, searchParams });

	return (
		<div className='dark:border-secondary-dark-2 mx-auto max-w-[850px] rounded-2xl border p-5'>
			<CreateGroupForm groupId={searchParams.groupId} type={params.type} />
		</div>
	);
}
