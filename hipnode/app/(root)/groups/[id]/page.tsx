import {
  ActiveMember,
  HostMeetupCard,
  GroupBanner,
  GroupAdmin,
  RecentMedia,
  GroupAbout,
  Explore,
} from "@/components/index";
import { getGroupById } from "@/lib/actions/group.action";

type Props = {
  params: {
    id: string;
  };
};

export default async function GroupDetail({ params }: Props) {
  const group = await getGroupById(params.id);

  return (
    <div className="h-full min-h-full w-full py-5">
      <div className="flex w-full justify-between gap-5 max-lg:flex-wrap">
        <aside className="top-0 hidden h-full max-h-screen w-full max-w-[210px] gap-5 overflow-y-auto lg:sticky lg:flex lg:flex-col">
          <GroupAbout about={group?.description ?? ""} />
          {/* @ts-ignore */}

          <GroupAdmin admins={group?.admins} />
        </aside>
        <section className=" w-full grow space-y-5">
          <GroupBanner
            id={params.id}
            // @ts-ignore
            members={group?.members}
            logo={group?.profileImage ?? ""}
            author={group?.author?.name ?? ""}
            banner={group?.cover ?? ""}
            title={group?.name ?? ""}
          />
          <Explore />
          {/* {[1, 2, 3, 4].map((p) => (
            <div key={p} className="w-full">
              <PostCard post={} />
            </div>
          ))} */}
          <div className="flex flex-wrap gap-5 lg:hidden">
            <aside className="top-0 hidden h-full max-h-screen w-full max-w-[210px] gap-5 overflow-y-auto lg:sticky lg:flex lg:flex-col">
              <GroupAbout about={group?.description ?? ""} />
              {/* @ts-ignore */}
              <GroupAdmin admins={group?.admins! ?? []} />
            </aside>
          </div>
        </section>
        <aside className="flex h-full w-full max-w-[325px] flex-col gap-5 overflow-y-auto overflow-x-hidden max-lg:max-w-full lg:sticky lg:top-0">
          <HostMeetupCard
            title="Create Group"
            text="Create a community and unite with like-minded individuals. Embark on exciting journeys together."
            btnLeftText="Code of Conduct"
            btnRightText="Create group."
          />
          <ActiveMember />
          <RecentMedia />
        </aside>
      </div>
    </div>
  );
}
