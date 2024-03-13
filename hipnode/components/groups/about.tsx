export default function GroupsAbout({ about }: { about: string }) {
	return (
		<article className='top-0 hidden lg:sticky lg:block'>
			<div className='text-secondary dark:bg-secondary-dark-2 dark:text-white-800 mt-5 h-full rounded-2xl bg-white p-5 lg:mt-0'>
				<h3 className='text-base font-semibold'>About</h3>
				<p className='w-full break-words pt-2 text-xs font-normal md:text-base lg:text-xs'>
					{about}
				</p>
			</div>
		</article>
	);
}
