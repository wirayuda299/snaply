import Link from "next/link";

import { interests } from "@/constants";
import { InterestItem } from "@/components/index";

export default function Introduce() {
  return (
    <section className="flex min-h-full w-full flex-col items-center justify-center bg-white p-5 dark:bg-secondary-dark-2 lg:max-w-[720px]">
      <div className="w-full max-w-[442px]">
        <h2 className="py-10 text-lg font-semibold text-secondary dark:text-white-800 md:text-3xl md:font-bold">
          What types of businesses are you most interested in running?
        </h2>
        <p className="text-base font-semibold text-primary">
          Choose as many as you like.
        </p>
        <>
          <div className="mt-5 flex w-full flex-wrap gap-5">
            {interests.map((interest) => (
              <InterestItem key={interest} interest={interest} />
            ))}
          </div>
          <Link
            href="/"
            className="mt-5 block w-min rounded bg-primary px-10 py-3 text-white-700"
          >
            Next
          </Link>
        </>
      </div>
    </section>
  );
}
