"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn, formUrlQuery } from "@/lib/utils";
import { Notification as NotificationType } from "@/types";
import { tabValues } from "@/constants";
import { useClickOutside } from "@/hooks/useClickOutside";

const notificationType = {
  comment: "/assets/notification/comment.svg",
  like: "/assets/notification/like.svg",
};

export default function Notification({
  notifications,
}: {
  notifications: NotificationType[];
}) {
  const params = useSearchParams();
  const type = params.get("notificationType") || "all";
  const router = useRouter();
  const ref = useRef(null);
  const [open, setOpen] = useState(false);

  const handleClick = (value: string) => {
    const url = formUrlQuery(params.toString(), "notificationType", value);
    router.push(url!);
  };

  useClickOutside(ref, () => setOpen(false));

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="bg-white-800 dark:bg-secondary-dark rounded-md p-2"
      >
        <Image
          className="aspect-auto w-3 min-w-4 object-contain grayscale invert-[20%] dark:grayscale-0 dark:invert-0"
          src="/assets/general/icons/bell.svg"
          width={20}
          height={20}
          loading="lazy"
          alt="bell icon"
        />
      </button>
      <ul
        ref={ref}
        className={cn(
          "absolute min-h-96 top-0 hidden -left-40 p-3 bg-white rounded-lg border-white-800 dark:border-secondary-dark-2 dark:bg-secondary-dark-2 border z-50 max-sm:w-64 w-96 sm:-left-80",
          open && "block top-10",
        )}
      >
        {notifications.length >= 1 ? (
          <>
            <header className="border-white-800 dark:border-secondary flex items-center justify-between border-b pb-5">
              <h3 className="text-sm font-semibold">
                {notifications.length} Notifications
              </h3>
              <Button variant={"ghost"} className="text-xs font-semibold">
                Mark All Read
              </Button>
            </header>

            <div className="no-scrollbar mt-5 flex w-full snap-mandatory items-center gap-3 space-x-3 overflow-x-auto">
              {tabValues.map((tab) => (
                <button
                  onClick={() => handleClick(tab.label)}
                  key={tab.label}
                  className={cn(
                    "flex w-full h-auto snap-center before:content-[''] before:absolute before:left-0 before:bottom-0 before:right-0 before:rounded-full before:h-[2px] before:bg-primary transition-all ease-in-out duration-500  relative before:w-full before:scale-x-0 before:transition-all before:ease-linear before:duration-300 items-center gap-2",
                    tab.label === type && "before:scale-x-100",
                  )}
                >
                  {tab.icon && (
                    <Image
                      src={tab.icon}
                      alt={tab.title}
                      width={20}
                      height={20}
                    />
                  )}
                  <p className="text-nowrap">{tab.title}</p>
                </button>
              ))}
            </div>
            <ul className="space-y-5 pt-5">
              {type === "all"
                ? notifications.map((notification) => (
                    <li key={notification._id}>
                      <div className="flex gap-3">
                        <div className="relative h-[50px] w-[60px]">
                          <Image
                            src={
                              notification.from.profileImage ?? "/avatar.png"
                            }
                            width={45}
                            height={45}
                            alt="user"
                            className="aspect-auto rounded-full object-contain"
                          />
                          <Image
                            src={
                              // @ts-ignore
                              notificationType[notification.notificationType!]
                            }
                            width={20}
                            height={20}
                            alt="notification"
                            className="absolute -bottom-1 right-2 aspect-auto rounded-full object-contain"
                          />
                        </div>

                        <div
                          className={cn(
                            "w-full",
                            notification.is_read && "text-primary",
                          )}
                        >
                          <h3 className="inline-flex items-center gap-3 text-lg font-bold">
                            {notification.from.username}
                            <span className="inline-block text-sm font-light">
                              {notification.message}
                            </span>
                          </h3>
                          {notification.comments && (
                            <div className="bg-white-700 dark:bg-secondary-dark w-full rounded-md p-2">
                              <p>{notification.comments}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))
                : notifications
                    .filter(
                      (notification) => notification.notificationType === type,
                    )
                    .map((notification) => (
                      <li key={notification._id}>
                        <div className="flex gap-3">
                          <div className="relative h-[50px] w-[60px]">
                            <Image
                              src={
                                notification.from.profileImage ?? "/avatar.png"
                              }
                              width={45}
                              height={45}
                              alt="user"
                              className="aspect-auto rounded-full object-contain"
                            />
                            <Image
                              src={
                                // @ts-ignore
                                notificationType[notification.notificationType!]
                              }
                              width={20}
                              height={20}
                              alt="notification"
                              className="absolute -bottom-1 right-2 aspect-auto rounded-full object-contain"
                            />
                          </div>

                          <div
                            className={cn(
                              "w-full",
                              notification.is_read && "text-primary",
                            )}
                          >
                            <h3 className="inline-flex items-center gap-3 text-lg font-bold">
                              {notification.from.username}
                              <span className="inline-block text-sm font-light">
                                {notification.message}
                              </span>
                            </h3>
                            {notification.comments && (
                              <div className="bg-white-700 dark:bg-secondary-dark w-full rounded-md p-2">
                                <p>{notification.comments}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
            </ul>
          </>
        ) : (
          <p className="text-center">No notification yet</p>
        )}
      </ul>
    </div>
  );
}
