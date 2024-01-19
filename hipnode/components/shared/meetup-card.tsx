import Image from "next/image";

import { Tag } from "../index";

export default function MeetupCard() {
  return (
    <div className="w-full rounded-lg bg-white p-3 dark:bg-secondary-dark-2 ">
      <header className="flex items-center gap-3 text-secondary dark:text-white-700">
        <h2 className="text-base font-semibold ">Meetups</h2>
        <Image
          className="invert dark:invert-0"
          src="/assets/general/icons/arrow.svg"
          width={25}
          height={25}
          alt="arrow icon"
        />
      </header>
      <div className="flex flex-col gap-3 overflow-hidden">
        {[1, 2, 3].map((c) => (
          <div className="mt-4 flex gap-3" key={c}>
            <div className="flex flex-col items-center text-secondary dark:rounded-md dark:bg-secondary-dark dark:p-2 dark:text-white-700">
              <h3 className="text-xl font-semibold ">FEB</h3>
              <p className="text-2xl font-bold text-blue-600">7</p>
            </div>
            <div>
              <h3 className="line-clamp-1 truncate text-sm font-semibold text-secondary dark:text-white-700">
                UIHUT - Crunchbase Company Profile
              </h3>

              <div className="flex items-center gap-2">
                <Image
                  src="/img.png"
                  className="rounded-full"
                  width={15}
                  height={15}
                  alt=""
                />
                <p className="text-xs dark:text-white-700">
                  UIHUT • Sylhet, Bangladesh
                </p>
              </div>
              <Tag tags={[]} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
