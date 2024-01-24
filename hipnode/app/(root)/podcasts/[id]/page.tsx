import AudioMetadata from '@/components/podcasts/AudioMetadata';

export default function PodcastDetail() {
	return (
		<div className='flex w-full justify-center py-5'>
			<div className='dark:bg-secondary-dark-2 w-full max-w-[850px] bg-white p-5'>
				<AudioMetadata />
				<div className='pt-5'>
					<h3 className='text-secondary dark:text-white-700 text-xl font-semibold'>
						#243 – Mental Health and Bootstrapping in 2022 with Rob Walling of
						TinySeed
					</h3>
					<p className='text-secondary dark:text-white-700 pt-3 text-sm'>
						Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eligendi
						autem voluptates aliquid nihil nemo, explicabo ipsum voluptatem,
						esse incidunt, quis culpa doloremque nisi voluptas iste ab vero
						aspernatur laudantium officiis corrupti voluptate ducimus? Nam,
						veritatis fugit, magni commodi non voluptatem repellat veniam
						assumenda consectetur, exercitationem corrupti! Molestias veritatis,
						qui reiciendis consequuntur, similique doloremque iure pariatur est
						tenetur ullam perferendis beatae maiores, debitis voluptate expedita
						ipsam praesentium. Necessitatibus maxime libero, deserunt quod
						dolores laborum tempora reprehenderit cupiditate sed, beatae
						exercitationem ipsa neque, blanditiis saepe repudiandae cumque
						aperiam ratione! Laudantium atque sint voluptas natus beatae dolore
						assumenda. Quia neque numquam placeat recusandae.
					</p>
					A
				</div>
			</div>
		</div>
	);
}
