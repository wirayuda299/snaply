import Image from "next/image";

import { currentUser } from "@clerk/nextjs";
import ActionButton from "./action-button";

type Member = {
  _id: string;
  username: string;
  profileImage: string;
};

type GroupBannerProps = {
  banner: string;
  title: string;
  author: string;
  logo: string;
  members: Member[] | undefined;
  id: string;
  adminId: string;
};

export default async function GroupsBanner({
  author,
  banner,
  title,
  logo,
  id,
  members,
  adminId,
}: GroupBannerProps) {
  const user = await currentUser();
  const isMember = members?.map((member) => member._id).includes(user?.id!);
  const isAdmin = user?.id === adminId;

  return (
    <section className=" w-full flex-1 rounded-2xl bg-white p-3 dark:bg-secondary-dark-2 md:p-5">
      <Image
        className="size-full min-h-[200px] rounded-2xl object-cover object-center"
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
            className="size-12 rounded-full object-cover md:size-[70px]"
            src={logo}
            width={50}
            height={50}
            alt="group logo"
          />

          <div className="text-secondary dark:text-white-800">
            <h2 className="text-base font-semibold lg:text-3xl">{title}</h2>
            <p className="text-10 dark:text-darkSecondary-800 font-normal md:text-sm">
              Created by{" "}
              <span className="font-semibold dark:text-white-800">
                {" "}
                {author}
              </span>
            </p>
          </div>
        </div>
        <ActionButton
          isAdmin={isAdmin}
          groupId={id}
          isMember={!!isMember}
          userId={user?.id!}
        />
      </div>
    </section>
  );
}
