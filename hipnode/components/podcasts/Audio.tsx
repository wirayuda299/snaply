"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { Button } from "../ui/button";

export default function PodcastsAudio() {
  const ref = useRef<HTMLAudioElement>(null);
  const [duration, setDuration] = useState<number>(ref.current?.duration ?? 0);

  const handleClick = () => {
    if (ref.current) {
      if (ref.current.paused) {
        ref.current.play()
      } else {
        ref.current.pause();
      }
    }
  };

  return (
    <div className="mt-4 flex items-center gap-3">
      <div className="">
        <input
          type="range"
          min={0}
          onChange={(e) => setDuration(+e.target.value)}
          className="w-full !bg-primary bg-none !accent-primary"
          max={ref.current?.duration}
          value={duration}
        />
        <Button
          onClick={handleClick}
          className="mt-4 flex items-center gap-3 rounded-full"
        >
          <Image
            src={"/assets/podcasts/icons/play.svg"}
            width={15}
            height={15}
            alt="play icon"
          />
          <span>Play Now</span>
        </Button>
        <audio src="/1.mp3" ref={ref}></audio>
      </div>
      <button className="mt-10 rounded-full border bg-white-700 p-2">
        <Image
          className="min-w-5 invert dark:invert-0"
          src={"/assets/podcasts/icons/share.svg"}
          width={20}
          height={20}
          alt="share icon"
        />
      </button>
    </div>
  );
}
