"use client";

import { Suspense, useEffect, useRef } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { LogOut } from "lucide-react";

import { getAllMessagesBetweenUser } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { getCreatedDate } from "@/utils";
import ChatForm from "./ChatForm";

export default function MessageList({
  id,
  userId,
  to,
}: {
  id: string;
  to: string;
  userId: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, refetch, error, isError } = useQuery({
    queryKey: [id],
    queryFn: () => getAllMessagesBetweenUser(id),
    refetchOnWindowFocus: true,
    throwOnError: false,
    enabled: id !== undefined,
    staleTime: 0,
  });

  useEffect(() => {
    let timeoutId: number | undefined;

    if (containerRef && containerRef.current) {
      const element = containerRef.current;

      timeoutId = window.setTimeout(() => {
        element.scroll({
          top: element.scrollHeight,
          left: 0,
          behavior: "smooth",
        });
      }, 100);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [containerRef, data]);

  if (isError) return <p>{error.message}</p>;

  return (
    <div className="col-span-2 flex h-screen w-full flex-col bg-white p-5 dark:bg-secondary-dark-2 lg:col-span-1">
      <div
        className="no-scrollbar ease size-full min-h-screen  overflow-y-auto pb-10 transition-all duration-500"
        ref={containerRef}
      >
        <header className="mb-auto flex h-20 items-center justify-between gap-3 border-b border-b-secondary/5 bg-white dark:border-b-secondary-dark dark:bg-secondary-dark-2">
          <div className="flex items-center gap-3">
            <Image
              width={50}
              height={50}
              alt="user"
              src={(data && data[0]?.members[1].profileImage) ?? "/avatar.png"}
              className="rounded-full object-contain object-center"
            />
            <h2 className="text-lg font-semibold capitalize text-secondary dark:text-white-700">
              {data && data[0]?.members[1].username}
            </h2>
          </div>
          <Link href={"/message"}>
            <LogOut />
          </Link>
        </header>

        <div className=" flex min-h-full w-full flex-col justify-between gap-5">
          <Suspense
            fallback={
              <div className="min-h-11 w-full rounded-lg bg-white-700 p-3"></div>
            }
          >
            {id && isLoading ? (
              <div className="flex min-h-screen justify-center pt-5">
                <div className="mx-auto flex size-32 flex-col items-center justify-center">
                  <div className="ease duration-&lsqb;5000&rsqb; size-20 animate-spin rounded-full border-t-2 border-primary transition-all"></div>
                  <p className="pt-2 text-sm">Loading chat...</p>
                </div>
              </div>
            ) : (
              data &&
              data?.map((msg) => {
                return msg?.messages.map((message) => {
                  return (
                    <div
                      key={message._id}
                      className={cn(
                        "gap-2 grid items-center pt-5",
                        // @ts-ignore
                        message.senderId === userId
                          ? "justify-end"
                          : "justify-start",
                      )}
                    >
                      {message.media && message.media.image && (
                        <Image
                          loading="lazy"
                          src={message?.media.image}
                          width={200}
                          className="aspect-auto rounded-md object-contain"
                          height={100}
                          alt="media image"
                        />
                      )}
                      <div
                        className={cn(
                          " px-3 w-full h-full py-2 overflow-hidden",
                          // @ts-ignore
                          message.senderId === userId
                            ? "rounded-e-2xl rounded-r-2xl rounded-b-2xl bg-primary"
                            : "rounded-s-2xl rounded-b-2xl bg-primary brightness-110",
                        )}
                      >
                        <p className=" break-words leading-3 text-white">
                          {message.content}
                        </p>
                      </div>
                      <time className="text-xs text-secondary-light">
                        {getCreatedDate(message.createdAt)}
                      </time>
                    </div>
                  );
                });
              })
            )}
          </Suspense>
          <ChatForm id={id} refetch={refetch} userId={userId} to={to} />
        </div>
      </div>
    </div>
  );
}
