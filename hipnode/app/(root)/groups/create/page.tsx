import CreateGroupForm from '@/components/groups/create-group-form';

export default function CreateGroup() {
	return (
		<div className='mx-auto max-w-[850px] rounded-2xl border p-5 dark:border-secondary-dark-2'>
			<CreateGroupForm />
		</div>
	);
}
