"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { formUrlQuery } from "@/utils";
import { Notification as NotificationType } from "@/types";
import { tabValues } from "@/constants";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/utils";
import { markAllAsRead } from "@/lib/actions";

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
  const router = useRouter();
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState<boolean>(false);

  const type = params.get("notificationType") || "all";
  const notificationIds = notifications.map((notification) => notification._id);

  const handleClick = (value: string) => {
    const url = formUrlQuery(params.toString(), "notificationType", value);
    router.push(url!);
  };

  useClickOutside(ref, () => setOpen(false));

  async function handleMarkAsRead() {
    setDisabled(true);
    try {
      await markAllAsRead(notificationIds);
    } catch (error) {
      toast.error("Unknon error");
    } finally {
      setDisabled(false);
    }
  }
  const isNotRead = notifications.some((notification) => !notification.is_read);

  return (
    <div className="relative">
      <button
        title="notifications"
        onClick={() => setOpen((prev) => !prev)}
        className="relative rounded-md bg-white-800 p-2 dark:bg-secondary-dark"
      >
        <Image
          className="aspect-auto w-3 min-w-4 object-contain grayscale invert-[20%] dark:grayscale-0 dark:invert-0"
          src="/assets/general/icons/bell.svg"
          width={20}
          height={20}
          loading="lazy"
          alt="bell icon"
        />
        {notifications.length >= 1 && isNotRead && (
          <div className="absolute right-1 top-1 size-2 rounded-full bg-primary"></div>
        )}
      </button>
      <ul
        ref={ref}
        className={cn(
          "absolute min-h-96 top-0 hidden -left-44 p-3 bg-white rounded-lg border-white-800 dark:border-secondary-dark-2 dark:bg-secondary-dark-2 border z-[999] max-sm:w-72 w-96 sm:-left-80",
          open && "block top-10",
        )}
      >
        {notifications?.length >= 1 ? (
          <>
            <header className="flex items-center justify-between border-b border-white-800 pb-5 dark:border-secondary">
              <h3 className="text-sm font-semibold">
                {notifications.length} Notifications
              </h3>
              <Button
                disabled={disabled}
                aria-disabled={disabled}
                title="mark as read"
                onClick={handleMarkAsRead}
                variant={"ghost"}
                className={cn(
                  "text-xs font-semibold",
                  isNotRead && "text-primary",
                )}
              >
                Mark All Read
              </Button>
            </header>

            <div className="mt-5 flex w-full snap-mandatory items-center gap-3 space-x-5 overflow-x-auto pb-3">
              {tabValues.map((tab) => (
                <button
                  onClick={() => handleClick(tab.label)}
                  key={tab.label}
                  className={cn(
                    "flex w-full h-auto snap-center before:content-[''] before:absolute before:left-0 before:bottom-0 before:right-0 before:rounded-full before:h-[2px] before:bg-primary transition-all ease-in-out duration-500  relative before:w-full before:scale-x-0 before:transition-all before:ease-linear before:duration-300 items-center gap-3",
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
            <ul className="max-h-[300px] w-full space-y-5 overflow-y-auto overflow-x-hidden pt-5 ">
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
                            className="aspect-auto min-w-[40px] rounded-full object-contain"
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
                            !notification.is_read && "text-primary",
                          )}
                        >
                          <h3 className="inline-flex items-center gap-3 text-lg font-semibold capitalize">
                            {notification.from.username}
                            <p className="inline-block truncate  text-sm font-light">
                              {notification.message}
                            </p>
                          </h3>
                          {notification.comments && (
                            <div className="w-full rounded-md bg-white-700 p-2 dark:bg-secondary-dark">
                              <p
                                className={cn(
                                  !notification.is_read && "text-primary",
                                )}
                              >
                                {notification.comments}
                              </p>
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
                            <h3 className="flex items-center gap-3 truncate text-lg font-bold">
                              {notification.from.username}
                              <span className="truncate text-sm font-light">
                                {notification.message}
                              </span>
                            </h3>
                            {notification.comments && (
                              <div className="w-full rounded-md bg-white-700 p-2 dark:bg-secondary-dark">
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
