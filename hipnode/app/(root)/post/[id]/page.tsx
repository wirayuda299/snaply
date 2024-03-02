import Image from 'next/image';

import { getPostById, getRelatedPosts, getUserById } from '@/lib/actions';
import { getCreatedDate, getPostStats } from '@/lib/utils';
import {
	Parser,
	Comment,
	PostStats,
	CommentInput,
	RelatedPostItem,
} from '@/components/index';
import FollowButton from '@/components/shared/follow-button';

type Props = {
	params: {
		id: string;
	};
};

export const dynamic = 'force-dynamic';

export default async function PostDetail({ params }: Props) {
	const { post } = await getPostById(params.id);

	const user = await getUserById(post.author._id);
	const relatedPosts = await getRelatedPosts(params.id, post.author._id);
	const postStats = getPostStats(
		post.likes.length,
		post.comments.length,
		post.share
	);

	return (
		<div className='flex flex-col gap-5 py-5 lg:flex-row'>
			<section className='top-0 min-w-[200px] lg:sticky lg:h-screen'>
				<PostStats
					stats={postStats}
					postAuthorName={post?.author?.username}
					postId={post._id}
				/>
			</section>
			<section className='w-full'>
				<section className='relative h-[400px] w-full'>
					<Image
						src={post.image}
						className='rounded-lg object-cover object-center'
						fill
						fetchPriority='high'
						alt={post.title}
						priority
					/>
				</section>
				<section className='py-5'>
					<div className='flex gap-5'>
						<span className='text-2xl font-light uppercase text-slate-500'>
							H1
						</span>
						<div>
							<h2 className='text-secondary-light text-3xl font-bold md:text-4xl'>
								{post.title}
							</h2>
							<div className='flex flex-wrap gap-3 pt-3'>
								{post?.tags.map((tag) => (
									<span className='text-sm text-orange-500' key={tag._id}>
										#{tag.name}
									</span>
								))}
							</div>
							<Parser content={post.body} />
						</div>
					</div>
					<div className='mt-5'>
						<CommentInput
							parentId={null}
							postId={post._id}
							postAuthorId={post.author._id}
						/>
					</div>
				</section>
				<section className='ml-1 space-y-3'>
					{post.comments.map((comment) => (
						<Comment
							key={comment._id}
							_id={comment._id}
							author={comment.author}
							comment={comment.comment}
							createdAt={comment.createdAt}
							likes={comment.likes}
							postAuthor={post.author}
							postId={post._id}
							updatedAt={comment.updatedAt}
						/>
					))}
				</section>
			</section>
			<div className='top-0 w-[380px] space-y-5 max-lg:w-full lg:sticky lg:h-screen'>
				<section className='dark:bg-secondary-dark-2  flex flex-col items-center rounded-xl bg-white p-5 '>
					<div className='w-full'>
						<Image
							className='mx-auto rounded-full'
							src={post.author.profileImage ?? '/avatar.png'}
							width={100}
							height={100}
							alt='user'
						/>
						<h2 className='text-secondary dark:text-secondary-light py-3 text-center text-3xl font-semibold'>
							{post.author.username}
						</h2>
						<FollowButton
							followers={user.followers}
							id={post.author._id}
							path={`/post/${post._id}`}
						/>
						<p className='text-secondary-light pt-3 text-center text-xs'>
							Joined {getCreatedDate(post.author.createdAt)}
						</p>
					</div>
				</section>
				{relatedPosts.length >= 1 && (
					<section className='dark:bg-secondary-dark-2 mb-5 mt-4 rounded-xl bg-white p-5'>
						<h2 className='text-secondary border-secondary dark:border-b-secondary-dark mb-5 truncate border-b pb-2 text-lg font-semibold dark:text-white'>
							More from{' '}
							<span className='capitalize'>{post.author.username}</span>
						</h2>
						<div className='divide-secondary-light dark:divide-secondary-dark space-y-5 divide-y divide-solid'>
							{relatedPosts.map((post) => (
								<RelatedPostItem post={post} key={post._id} />
							))}
						</div>
					</section>
				)}
			</div>
		</div>
	);
}
