import { Globe, MessageCircleMore } from "lucide-react";
import Image from "next/image";

import {
  Card,
  InterviewPostCard,
  PodcastCard,
  PostCard,
} from "@/components/index";
import Tab from "@/components/profile/tab";
import { Button } from "@/components/ui/button";
import { getUserById } from "@/lib/actions/user.action";
import { getCreatedDate } from "@/lib/utils";
import { User } from "@/types";

type ProfileProps = {
  params: {
    id: string;
  };
  searchParams: {
    type: string | undefined;
  };
};

export default async function Profile(props: ProfileProps) {
  // @ts-ignore
  const user: User = await getUserById(props.params.id);
  const type = props.searchParams.type;

  return (
    <div className="flex w-full flex-col gap-5 md:p-5 lg:flex-row">
      <aside className="w-[200px] min-w-[200px] max-lg:min-w-full lg:h-screen">
        <header className="flex flex-col items-center justify-center rounded-lg bg-gradient-to-b from-primary to-primary/80">
          <Image
            className="size-28 translate-y-10 rounded-full"
            src={user.profileImage ?? "/avatar.png"}
            width={100}
            height={100}
            alt="user"
          />
        </header>
        <div className="pt-12 text-center">
          <h2 className="text-2xl font-semibold capitalize">{user.username}</h2>
          <p className="text-xs">Developer</p>
          <div className="flex items-center gap-3 pt-3">
            <Button className="grow">Follow</Button>
            <Button className="group bg-blue-10 hover:bg-transparent dark:bg-secondary-dark-2">
              <MessageCircleMore className="bg-transparent text-black transition-colors duration-500 ease-in-out group-hover:text-primary dark:text-white-700" />
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-3 text-xs">
            <span>{user.followers.length} Followers</span>
            &#x2022;
            <span>{user.followings.length} Followings</span>
            &#x2022;
            <span>{user.followers.length} Points</span>
          </div>
          <p className="mt-4 text-xs text-secondary dark:text-secondary-light">
            Hey there... I&apos;m AR Jakir! I&apos;m here to learn from and
            support the other members of this community!
          </p>
          {user.website && (
            <div className="mt-5 flex items-center justify-center gap-3">
              <Globe size={15} />
              <h3 className="text-sm font-semibold">www.jsm.com</h3>
            </div>
          )}

          <p className="mt-10 text-base font-semibold text-secondary dark:text-secondary-light">
            Joined {getCreatedDate(user.createdAt)}
          </p>
        </div>
      </aside>

      <section className="w-full">
        <Tab />
        <div className="w-full space-y-5 pt-5">
          {(type === undefined || type === "posts") &&
            user.posts.map((post) => (
              <PostCard post={post} key={post._id} type="post" />
            ))}
          {type === "meetups" &&
            user.meetups.map((meetup) => (
              <PostCard post={meetup} key={meetup._id} type="meetup" />
            ))}
          {type === "interviews" &&
            // @ts-ignore
            user?.interviews &&
            // @ts-ignore
            user?.interviews.map((interview) => (
              <InterviewPostCard {...interview} key={interview._id} />
            ))}
          {type === "podcasts" &&
            user?.podcasts.map((podcast) => (
              <PodcastCard key={podcast._id} podcast={podcast} />
            ))}
        </div>
      </section>

      <section className="">
        <Card
          path="/create?type=interview"
          title="Start your interview"
          text="Working on your own internet business? We'd love to interview you!"
          btnLeftText="Code of Conduct"
          btnRightText="Submit a Story"
        />
      </section>
    </div>
  );
}