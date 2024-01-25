import Image from "next/image";
import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs";

import { getPostById, getRelatedPosts } from "@/lib/actions/post.action";
import { getCreatedDate, getPostStats } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  PostStats,
  Comment,
  CommentInput,
  RelatedPostItem,
  Parser,
} from "@/components/index";
import { uploadComment } from "@/lib/actions/comment.action";

type Props = {
  params: {
    id: string;
  };
};

export const dynamic = "force-dynamic";

export default async function PostDetail({ params }: Props) {
  const { post } = await getPostById(params.id);
  const user = await currentUser();
  if (!user) return null;
  if (!post) return notFound();

  const relatedPosts = await getRelatedPosts(params.id, post.author._id);
  const postStats = getPostStats(
    post.likes.length,
    post.comments.length,
    post.share,
  );

  async function handleComment(data: FormData) {
    "use server";
    const comment = data.get("comment");
    if (comment === "") return;

    await uploadComment({
      comment: comment?.toString() ?? "",
      parentId: null,
      postId: params?.id,
      author: user?.id!,
    });
  }

  return (
    <div className="flex flex-col gap-5 py-5 lg:flex-row">
      <section className="top-0 min-w-[200px] lg:sticky lg:h-screen">
        <PostStats
          stats={postStats}
          postAuthorName={post?.author?.username}
          postId={post._id}
        />
      </section>
      <section className="w-full">
        <section className="relative h-[400px] w-full">
          <Image
            src={post.image}
            className="rounded-lg"
            fill
            fetchPriority="high"
            alt={post.title}
            priority
          />
        </section>
        <section className="py-5">
          <div className="flex gap-5">
            <span className="text-2xl font-light uppercase text-slate-500">
              H1
            </span>
            <div>
              <h2 className="text-3xl font-bold text-secondary-light md:text-4xl">
                {post.title}
              </h2>
              <div className="flex flex-wrap gap-3">
                {post?.tags.map((tag) => (
                  <span className="text-sm text-orange-500" key={tag._id}>
                    #{tag.name}
                  </span>
                ))}
              </div>
              <Parser content={post.body} />
            </div>
          </div>
          <div className="mt-5">
            <CommentInput
              image={user?.imageUrl ?? ""}
              // @ts-ignore
              handleReply={handleComment}
            />
          </div>
        </section>
        <section className="ml-1 space-y-3">
          {post.comments.map((comment) => (
            <Comment key={comment._id} {...comment} />
          ))}
        </section>
      </section>
      <div className="top-0 w-[380px] space-y-5 max-lg:w-full lg:sticky lg:h-screen">
        <section className="flex  flex-col items-center rounded-xl bg-white p-5 dark:bg-secondary-dark-2 ">
          <div className="w-full">
            <Image
              className="mx-auto rounded-full"
              src={post.author.profileImage ?? "/avatar.png"}
              width={100}
              height={100}
              alt="user"
            />
            <h2 className="py-3 text-center text-3xl font-semibold text-secondary dark:text-secondary-light">
              {post.author.username}
            </h2>
            <Button className="w-full grow">Follow</Button>
            <p className="pt-3 text-center text-xs text-secondary-light">
              Joined {getCreatedDate(post.author.createdAt)}
            </p>
          </div>
        </section>
        <section className="mt-3 rounded-xl bg-white p-5 dark:bg-secondary-dark-2">
          <h2 className="text-lg font-semibold text-secondary dark:text-white">
            More from <span className="capitalize">{post.author.username}</span>
          </h2>
          <div className="space-y-3 divide-y divide-solid divide-secondary-light">
            {relatedPosts.map((post) => (
              <RelatedPostItem post={post} key={post._id} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
