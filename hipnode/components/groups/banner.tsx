import Image from "next/image";

import { currentUser } from "@clerk/nextjs";
import ActionButton from "./action-button";

type Member = {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
  updateAt: Date;
  image: string;
  role: string;
  followers: string[];
  followings: string[];
  bio: string;
  website: string;
  memberIds: string[];
  adminIds: string[];
};

type GroupBannerProps = {
  banner: string;
  title: string;
  author: string;
  logo: string;
  members: Member[] | undefined;
  id: string;
};

export default async function GroupsBanner({
  author,
  banner,
  title,
  logo,
  id,
  members,
}: GroupBannerProps) {
  const user = await currentUser();
  const isMember = members?.map((member) => member.id).includes(user?.id!);

  return (
    <section className=" w-full flex-1 rounded-2xl bg-white p-3 dark:bg-secondary-dark-2 md:p-5">
      <Image
        className="h-full min-h-[200px] w-full rounded-2xl object-cover object-center"
        src={banner}
        sizes="100vw"
        width={765}
        height={200}
        priority
        fetchPriority="high"
        alt="banner"
      />
      <div className="flex flex-wrap items-center justify-between gap-5 pt-5">
        <div className="flex items-center gap-3 md:gap-5">
          <Image
            className="h-12 w-12 rounded-full object-cover md:h-[70px] md:w-[70px]"
            src={logo}
            width={50}
            height={50}
            alt="group logo"
          />

          <div className="text-secondary dark:text-white-800">
            <h2 className="text-base font-semibold lg:text-3xl ">{title}</h2>
            <p className="text-10 dark:text-darkSecondary-800 font-normal md:text-sm">
              Created by{" "}
              <span className="font-semibold dark:text-white-800">
                {" "}
                {author}
              </span>
            </p>
          </div>
        </div>
        <ActionButton groupId={id} isMember={!!isMember} userId={user?.id!} />
      </div>
    </section>
  );
}
