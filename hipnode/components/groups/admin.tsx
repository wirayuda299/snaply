import Image from "next/image";

type Admin = {
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

export default function GroupsAdmin({
  admins,
}: {
  admins: Admin[] | undefined;
}) {
  return (
    <section className="flex w-[210px] flex-col gap-5 rounded-2xl bg-white p-5 text-secondary dark:bg-secondary-dark-2 dark:text-white-800 max-lg:w-full">
      <h3 className="text-base font-semibold text-secondary dark:text-white-800">
        Admins
      </h3>
      {admins?.map((admin) => (
        <div
          key={admin.id}
          className="flex w-full items-center justify-between gap-x-2"
        >
          <div className="flex items-center gap-x-2">
            <Image
              src={admin.image}
              width={35}
              height={35}
              className="rounded-full object-cover object-center"
              alt={admin.name ?? admin.email}
            />

            <h3>{admin.name}</h3>
          </div>
          <button className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-secondary-blue">
            <Image
              src={"/assets/groups/icons/follow.svg"}
              width={20}
              height={20}
              alt={admin.name ?? admin.email}
            />
          </button>
        </div>
      ))}
    </section>
  );
}
