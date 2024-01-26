import Image from "next/image";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";

import SubmitButton from "./submit-button";
import CreatePostInput from "./input";

export default async function CreatePost() {
  const user = await currentUser();

  async function redirectToCreatePost(data: FormData) {
    "use server";
    const title = data.get("title");

    redirect(`/create?title=${title?.toString()}&type=post`);
  }

  return (
    <form
      action={redirectToCreatePost}
      className=" flex h-min w-full items-center gap-3 rounded-xl bg-white p-2 dark:bg-secondary-dark-2 md:p-3"
    >
      <Image
        className=" rounded-full bg-white-700 object-contain p-2 dark:bg-secondary-dark size-14"
        src={user?.imageUrl ?? ""}
        width={50}
        height={50}
        alt="user"
        priority
      />
      <div className=" flex w-full items-center gap-2 rounded-lg bg-white-700 p-2 dark:bg-secondary-dark md:rounded-xl md:p-3">
        <CreatePostInput />
        <SubmitButton />
      </div>
    </form>
  );
}
