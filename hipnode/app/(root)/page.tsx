import dynamic from "next/dynamic";
import { Suspense } from "react";

import {
  HomeCreatePost,
  HomeFilter,
  MeetupCard,
  PostCard,
} from "@/components/index";
import { FILTER_ITEMS } from "@/constants/home";
import { getAllPosts } from "@/lib/actions/post.action";
import PodcastCard from "@/components/shared/podcast-card";
import { Tag } from "@/types";
import result from "postcss/lib/result";
const PopularTags = dynamic(() => import("@/components/shared/popular-tags"));
const Loader = dynamic(() => import("@/components/shared/Loader"));

const uniqueFlatTags = (tagArrays: Tag[][]) => {
  const uniqueNames: Tag[] = [];

  tagArrays.flat().forEach((tag) => {
    for (let i = 0; i < uniqueNames.length; i++) {
      const element = uniqueNames[i];
      console.log(element);
    }
  });
  return uniqueNames;
};

export default async function Home({
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { posts } = await getAllPosts(searchParams.sort as string, 1, 10);
  const tags = posts.map((post) => post.tags).flat();

  return (
    <section className="flex flex-col gap-3 py-5 lg:flex-row">
      <div className="top-0 flex flex-col gap-5 lg:sticky lg:h-screen">
        <HomeFilter
          items={FILTER_ITEMS}
          innerStyles="md:space-x-0 gap-8 justify-center"
          rootStyles="max-h-min h-min"
          titleStyles="hidden sm:block"
        />
        <Suspense fallback="Loading....">
          {result?.length >= 1 && (
            <PopularTags items={tags} styles="hidden md:block" />
          )}
        </Suspense>
      </div>
      <section className="flex w-full flex-col gap-5">
        <HomeCreatePost />
        <Suspense fallback={<Loader />}>
          {posts?.map((post) => (
            <PostCard type="post" key={post.title} post={post} />
          ))}
        </Suspense>
        <Suspense fallback="Loading...">
          {tags.length >= 1 && (
            <PopularTags
              items={tags}
              styles="block md:hidden"
              innerStyles="justify-start items-start"
            />
          )}
        </Suspense>
      </section>
      <section className="top-0 w-80 space-y-5 max-lg:w-full lg:sticky lg:h-screen">
        <MeetupCard />
        <PodcastCard />
      </section>
    </section>
  );
}
