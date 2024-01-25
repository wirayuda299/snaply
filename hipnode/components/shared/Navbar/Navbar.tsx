import Image from "next/image";
import { currentUser } from "@clerk/nextjs";
import Link from "next/link";

import NavLink from "./NavLink";
import ModeToggle from "./theme-switch";

export default async function Navbar() {
  const user = await currentUser();

  if (!user) return null;

  return (
    <nav className="relative flex items-center justify-end bg-white p-3 dark:bg-primary-dark md:justify-between lg:sticky lg:top-0 lg:z-50  lg:p-5">
      <Link
        href={"/"}
        className="flex flex-1 items-center gap-2 text-2xl font-semibold md:flex-none"
      >
        <Image
          className="aspect-auto object-contain"
          src="/assets/general/icons/logo.svg"
          width={28}
          height={34}
          loading="lazy"
          alt="Logo"
        />
        <h1 className="hidden dark:text-white-700 sm:block">Snaply</h1>
      </Link>
      <NavLink />
      <form className="flex items-center gap-3 rounded-lg max-md:w-auto md:w-[200px] md:flex-row-reverse md:bg-white-800 md:p-1 dark:md:bg-secondary-dark lg:w-[400px]">
        <label
          htmlFor="search"
          className="mr-2 rounded-md bg-white-800 p-2 dark:bg-secondary-dark sm:mr-5 md:mr-0"
        >
          <Image
            className="aspect-auto w-3 min-w-4 object-contain"
            src="/assets/general/icons/search.svg"
            width={20}
            loading="lazy"
            height={20}
            alt="search icon"
          />
        </label>
        <input
          autoComplete="off"
          type="search"
          placeholder="Search...."
          className="hidden bg-transparent pl-2 focus-visible:absolute focus-visible:left-0 focus-visible:block focus-visible:bg-white-700 focus-visible:outline-none max-md:focus-visible:w-full md:block md:w-full focus-visible:md:static md:focus-visible:bg-transparent "
          id="search"
        />
      </form>
      <div className="flex items-center gap-2 sm:gap-5">
        <button className="rounded-md bg-white-800 p-2 dark:bg-secondary-dark">
          <Image
            className="aspect-auto w-3 min-w-4 object-contain grayscale invert-[20%] dark:grayscale-0 dark:invert-0"
            src="/assets/general/icons/chat.svg"
            width={20}
            height={20}
            loading="lazy"
            alt="bell icon"
          />
        </button>
        <button className="rounded-md bg-white-800 p-2 dark:bg-secondary-dark">
          <Image
            className="aspect-auto w-3 min-w-4 object-contain grayscale invert-[20%] dark:grayscale-0 dark:invert-0"
            src="/assets/general/icons/bell.svg"
            width={20}
            height={20}
            loading="lazy"
            alt="bell icon"
          />
        </button>
        <button className="flex w-8 items-center gap-2 md:w-auto">
          <Image
            className="aspect-auto min-w-4 rounded-lg border-2 object-contain"
            src={user?.imageUrl ?? ""}
            width={35}
            loading="lazy"
            height={35}
            alt=" user"
          />
          <Link
            href={`/profile/${user.id}`}
            className="hidden text-lg font-semibold capitalize dark:text-white-700 md:block"
          >
            {user?.username ?? user?.firstName}
          </Link>
        </button>
        <ModeToggle />
      </div>
    </nav>
  );
}
