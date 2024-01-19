type Tags = {
	_id: string;
	name: string;
	postIds: string[];
};
export default function Tag({ tags }: { tags: Tags[] }) {
	return (
		<div className='mb-auto mt-2 flex flex-wrap gap-3'>
			{tags?.map((tag) => (
				<button
					key={tag._id}
					className='bg-white-700 text-secondary dark:bg-secondary-dark dark:text-white-700 rounded-full px-2 text-xs md:px-4'
				>
					{tag.name}
				</button>
			))}
		</div>
	);
}
