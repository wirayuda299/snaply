import {
  GroupSidebar,
  MeetupCard,
  GroupSidebarMobile,
  GroupPostCard,
} from "@/components/index";
import PodcastCard from "@/components/shared/podcast-card";
import { getAllGroups } from "@/lib/actions/group.action";

export default async function Groups() {
  const groups = await getAllGroups();
  const posts = groups.map((group) => group.posts).flat(2);

  return (
    <div className="flex flex-col gap-3 py-5 lg:flex-row">
      <GroupSidebar groups={groups} />
      <GroupSidebarMobile groups={groups} />
      <section className="flex w-full flex-wrap gap-3">
        {posts.map((post) => (
          <GroupPostCard key={post?._id} post={post} />
        ))}
      </section>
      <section className="top-0 min-w-[250px] space-y-5 lg:sticky lg:h-screen">
        <MeetupCard />
        <PodcastCard />
      </section>
    </div>
  );
}
