import Image from "next/image";

export default function PodcastCard() {
  return (
    <div className="w-full rounded-lg bg-white p-3 dark:bg-secondary-dark-2 ">
      <header className="flex items-center gap-3 text-secondary dark:text-white-700">
        <h2 className="text-base font-semibold">Podcast</h2>
        <Image
          className="invert dark:invert-0"
          src="/assets/general/icons/arrow.svg"
          width={25}
          height={25}
          alt="arrow icon"
        />
      </header>
      {[1, 2, 3].map((c) => (
        <div className="mt-3 overflow-hidden" key={c}>
          <div className="flex justify-between gap-3 dark:text-white-700">
            <div className="flex gap-3">
              <Image src="/img.png" width={60} height={50} alt="" />
              <h3 className="line-clamp-2 truncate text-sm font-semibold text-secondary dark:text-secondary-light">
                Selling a Business and Scaling Another Amidst Tragedy.
                <p className="truncate text-xs font-light text-secondary">
                  by Michele Hansen
                </p>
              </h3>
            </div>
            <Image
              className="invert dark:invert-0"
              src="/assets/general/icons/arrow.svg"
              width={40}
              height={40}
              alt="arrow icon"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
