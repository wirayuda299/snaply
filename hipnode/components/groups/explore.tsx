import Image from "next/image";

import { Button } from "@/components/ui/button";
import NewIcon from "./icon";

export default function Explore() {
  return (
    <section className="mt-5 w-full">
      <div className="flex flex-wrap items-center justify-between gap-5 rounded-2xl bg-white p-5 dark:bg-secondary-dark-2">
        <h4 className="text-secondarytext-base font-semibold dark:text-white-800">
          Explore
        </h4>
        <div className="flex items-center gap-5 max-sm:w-full">
          <Button className="dark:hover:bg-darkPrimary-3 inline-flex w-24 gap-2 truncate bg-white-800 hover:bg-white-700 dark:bg-secondary-dark max-sm:w-full">
            <NewIcon />
            <span className="text-xs font-bold text-secondary dark:text-white">
              New
            </span>
          </Button>
          <Button className="dark:bg-secondary-red-10 group inline-flex w-24 gap-2 truncate bg-secondary-red hover:bg-secondary-red/50 max-sm:w-full">
            <Image
              className="aspect-auto object-contain"
              src={"/assets/home/icons/popular.svg"}
              width={20}
              height={20}
              alt="popular icon"
            />
            <span className=" text-xs font-bold text-secondary ">Popular</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
