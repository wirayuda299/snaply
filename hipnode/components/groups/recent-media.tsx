import Image from "next/image";

export default function RecentMedia({
  recentMedia,
}: {
  recentMedia: string[];
}) {
  if (recentMedia.length < 1) return null;

  return (
    <section className="dark:bg-secondary-dark-2 w-full rounded-2xl bg-white p-5">
      <h3 className="text-secondary dark:text-white-800 text-base font-semibold">
        Recent Media
      </h3>
      <div className="mt-3 flex flex-wrap">
        {recentMedia.map((pic) => (
          <Image
            src={pic}
            width={88}
            className="object-auto size-20 rounded-sm shadow"
            height={88}
            alt="picture"
            key={pic}
          />
        ))}
      </div>
    </section>
  );
}
