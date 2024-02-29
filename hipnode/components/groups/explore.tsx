import Image from "next/image";

import { Button } from "@/components/ui/button";
import NewIcon from "./icon";

export default function Explore() {
  return (
    <section className="mt-5 w-full">
      <div className="dark:bg-secondary-dark-2 flex flex-wrap items-center justify-between gap-5 rounded-2xl bg-white p-5">
        <h4 className="text-secondarytext-base dark:text-white-800 font-semibold">
          Explore
        </h4>
        <div className="flex items-center gap-5 max-sm:w-full">
          <Button className="dark:hover:bg-darkPrimary-3 bg-white-800 hover:bg-white-700 dark:bg-secondary-dark inline-flex w-24 gap-2 truncate max-sm:w-full">
            <NewIcon />
            <span className="text-secondary text-xs font-bold dark:text-white">
              New
            </span>
          </Button>
          <Button className="dark:bg-secondary-red-10 bg-secondary-red hover:bg-secondary-red/50 group inline-flex w-24 gap-2 truncate max-sm:w-full">
            <Image
              className="aspect-auto object-contain"
              src={"/assets/home/icons/popular.svg"}
              width={20}
              height={20}
              alt="popular icon"
            />
            <span className=" text-secondary text-xs font-bold ">Popular</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
