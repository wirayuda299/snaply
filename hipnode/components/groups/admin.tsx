import { currentUser } from "@clerk/nextjs";
import Image from "next/image";

type Admin = {
  _id: string;
  username: string;
  profileImage: string;
};

export default async function GroupsAdmin({
  admins,
}: {
  admins: Admin[] | undefined;
}) {
  const user = await currentUser();
  return (
    <section className="flex w-[210px] flex-col gap-5 rounded-2xl bg-white p-5 text-secondary dark:bg-secondary-dark-2 dark:text-white-800 max-lg:w-full">
      <h3 className="text-base font-semibold text-secondary dark:text-white-800">
        Admins
      </h3>
      {admins?.map((admin) => (
        <div
          key={admin._id}
          className="flex w-full items-center justify-between gap-x-2"
        >
          <div className="flex items-center gap-x-2">
            <Image
              src={admin.profileImage ?? "/avatar.png"}
              width={35}
              height={35}
              className="rounded-full object-cover object-center"
              alt={admin.username}
            />

            <h3>{admin.username}</h3>
          </div>
          {admin._id !== user?.id && (
            <button className="flex size-8 items-center justify-center rounded-full bg-secondary-blue">
              <Image
                src={"/assets/groups/icons/follow.svg"}
                width={20}
                height={20}
                alt={admin.username}
              />
            </button>
          )}
        </div>
      ))}
    </section>
  );
}
