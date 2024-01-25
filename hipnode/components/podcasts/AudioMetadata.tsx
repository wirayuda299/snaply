"use client";

import Image from "next/image";
import { useState } from "react";

import AudioControll from "./AudioControll";
import { cn } from "@/lib/utils";

type Props = {
  audioUrl: string;
  thumbnail: string;
  title: string;
  author: string;
};

export default function AudioMetadata({
  audioUrl,
  thumbnail,
  author,
  title,
}: Props) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  return (
    <header className="flex w-full items-start justify-between gap-5">
      <div
        className={cn(
          "flex w-full gap-16 transition-all ease-in-out duration-500",
          isPlaying && "gap-5",
        )}
      >
        <div className="relative flex items-center">
          <Image
            src={thumbnail}
            width={100}
            height={100}
            alt=""
            fetchPriority="high"
            priority
            className="z-10 aspect-square size-40 min-w-40 rounded-lg border object-cover"
          />
          {/* bg-[#3F4354] */}
          <div
            className={cn(
              `-ml-44 opacity-0 size-36 rounded-full relative flex transition-all ease duration-500 justify-center items-center  bg-cover bg-no-repeatW`,
              isPlaying && "animate-spin rounded-full -ml-12 opacity-100",
            )}
            style={{
              animationDuration: "10000ms",
              ...(isPlaying && { backgroundImage: `url('${thumbnail}')` }),
            }}
          >
            <div className="absolute flex size-12 items-center justify-center rounded-full border">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="130"
                height="130"
                viewBox="0 0 130 130"
                fill="none"
              >
                <circle
                  cx="65"
                  cy="65"
                  r="65"
                  className={cn(
                    " dark:fill-[#97989db5]",
                    isPlaying ? "fill-[#97989db5]" : "fill-[#97989D]",
                  )}
                  stroke="#C5D0E6"
                  stroke-width="2"
                />
                <circle
                  cx="65"
                  cy="65"
                  r="25"
                  fill="#F7F7F7"
                  className={cn("fill-white", isPlaying ? "fill-white/75" : "")}
                  stroke="#C5D0E6"
                  stroke-width="2"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex grow justify-between">
          <div className="w-full">
            <p className="text-xs font-medium text-secondary dark:text-white-700">
              {title}
            </p>
            <h2 className="text-xl font-semibold text-secondary dark:text-white-700">
              by {author}
            </h2>
            <AudioControll
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              audioUrl={audioUrl}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
