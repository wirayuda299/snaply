"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import Image from "next/image";
import { CheckIcon } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogClose,
} from "@/components/ui/dialog";
import { sharePost } from "@/lib/actions/post.action";

import { copyText, shareOptionData } from "@/lib/utils";
import { toast } from "sonner";

export type PostStatsType = {
  icon: string;
  alt: string;
  value: number;
  label: string;
};

type SharePostProps = {
  stat: PostStatsType;
  isOpen: boolean;
  setIsIopen: Dispatch<SetStateAction<boolean>>;
  postId: string;
};

export default function SharePost({
  stat,
  isOpen,
  setIsIopen,
  postId,
}: SharePostProps) {
  const { user } = useUser();
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const pathname = usePathname();

  const handleCopytext = (text: string) => {
    copyText(text);
    setIsChecked(true);

    setTimeout(() => setIsChecked(false), 2000);
  };

  const shareOptions = shareOptionData(
    user?.emailAddresses[0].emailAddress as string,
    `${process.env.NEXT_PUBLIC_SITE_URL}${pathname}`,
  );

  const handleShare = async () => {
    try {
      await sharePost(postId, window.location.pathname);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsIopen}>
      <DialogTrigger asChild>
        <div className="flex cursor-pointer items-center gap-5">
          <Image
            src={stat.icon}
            alt={stat.alt}
            width={20}
            height={20}
            className="object-contain"
          />
          <p className=" text-secondary dark:text-secondary-light">
            {stat.value} {stat.label}
          </p>
        </div>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-[30px] rounded-3xl bg-white p-5 dark:bg-primary-dark max-sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Share With</h3>
            <DialogClose>
              <Image
                className="dark:invert"
                src={"/assets/post/icons/close.svg"}
                width={30}
                height={30}
                alt={"close icon"}
              />
            </DialogClose>
          </div>
        </DialogHeader>
        <div className="flex flex-wrap items-center justify-center gap-5">
          {shareOptions.map((option) =>
            option.path ? (
              <a
                onClick={handleShare}
                rel="canonical"
                target="_blank"
                href={option.path}
                key={option.label}
                className="group"
              >
                <div className="ease bg-secondary-red-10 dark:bg-darkPrimary-4 dark:group-hover:bg-secondary-red-10 flex size-12 items-center justify-center rounded-full grayscale transition-all duration-300 group-hover:grayscale-0 dark:grayscale-0 md:size-[68px]">
                  <Image
                    className="dark:grayscale dark:group-hover:grayscale-0"
                    src={option.icon}
                    width={20}
                    height={20}
                    alt={option.label}
                  />
                </div>
                <p className="text-darkSecondary-800 group-hover:text-secondary-red-80 pt-2 text-center text-sm font-semibold capitalize">
                  {option.label}
                </p>
              </a>
            ) : (
              <button onClick={handleShare} key={option.label}>
                <div className="ease bg-secondary-red-10 dark:bg-darkPrimary-4 dark:group-hover:bg-secondary-red-10 flex size-12 items-center justify-center rounded-full grayscale transition-all duration-300 group-hover:grayscale-0 dark:grayscale-0 md:size-[68px]">
                  <Image
                    className="dark:grayscale dark:group-hover:grayscale-0"
                    src={option.icon}
                    width={20}
                    height={20}
                    alt={option.label}
                  />
                </div>
                <p className="text-darkSecondary-800 group-hover:text-secondary-red-80 pt-2 text-center text-sm font-semibold capitalize">
                  {option.label}
                </p>
              </button>
            ),
          )}
        </div>
        <p className="text-center text-xs font-semibold text-secondary dark:text-secondary-light">
          or share with link
        </p>
        <div className="w-full rounded-2xl bg-white-700 p-5 dark:bg-secondary-dark-2">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-semibold text-secondary dark:text-secondary-light">
              {process.env.NEXT_PUBLIC_SITE_URL}/post/{postId}
            </p>
            <button
              onClick={() => {
                handleCopytext(
                  `${process.env.NEXT_PUBLIC_SITE_URL}/post/${postId}`,
                );
              }}
            >
              {isChecked ? (
                <CheckIcon color="#FF4401" className="size-[30px]" />
              ) : (
                <Image
                  src={"/assets/post/icons/copy.svg"}
                  width={30}
                  height={30}
                  alt="copy"
                />
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
