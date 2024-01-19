import Image from "next/image";

import { Category, HostMeetupCard, MeetupCard } from "@/components/index";

const categories = [
  "indie bites",
  "software social",
  "hipnode",
  "free",
] as const;

export default function Podcasts() {
  return (
    <div className="flex flex-col gap-5 py-5 lg:flex-row">
      <section className="top-0 lg:sticky lg:h-screen">
        <Category categories={categories} title="Filter by Show" />
      </section>
      <section className="flex flex-wrap gap-5">
        {[1, 2, 3, 4, 5].map((c) => (
          <article
            className="max-w-xs grow rounded-xl bg-white p-5 dark:bg-secondary-dark-2 max-sm:max-w-full"
            key={c}
          >
            <h2 className="text-xl font-semibold text-secondary dark:text-white-700">
              Workshopping Pay-As-You-Go Failed Payments
            </h2>
            <p className="line-clamp-6 pt-2 text-sm text-secondary dark:text-secondary-light">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel,
              laboriosam, nemo provident deleniti voluptatum, ea hic ipsam
              aspernatur voluptas obcaecati dolorem quasi mollitia possimus!
              Maiores aliquam harum cumque, hic vitae deserunt vero distinctio
              accusantium ut facere consequatur velit doloribus ducimus pariatur
              neque quidem! Neque sed ipsa error facilis sit inventore.
              Obcaecati alias, a eos dolorem consectetur distinctio deleniti
              odio temporibus sapiente provident dicta eum ad quae inventore
              omnis non eligendi? Totam distinctio repellat, porro ratione aut
              magnam ducimus corporis nesciunt qui hic quia provident tempora
              eveniet, eaque culpa. Nostrum iure nesciunt exercitationem
              excepturi recusandae perspiciatis molestias minima doloremque quos
              tenetur?
            </p>

            <div className="mt-5 flex items-center gap-3">
              <Image
                className="h-14 w-14 rounded-full bg-white-800 p-2 dark:bg-secondary-dark-2"
                src="/avatar.png"
                width={50}
                height={50}
                alt="user"
                priority
              />
              <div>
                <h3 className="text-base font-semibold text-secondary dark:text-white-700">
                  Moshkur Alom
                </h3>
                <p className="text-xs text-secondary dark:text-secondary-light">
                  Sylhet, Bangladesh
                </p>
              </div>
            </div>
          </article>
        ))}
      </section>
      <section className="space-y-5">
        <HostMeetupCard
          text="Working on your own internet business? We'd love to interview you!"
          title="Start Your Podcasts"
          btnLeftText="Code of Conduct"
          btnRightText="Start Your Podcasts"
        />
        <MeetupCard />
      </section>
    </div>
  );
}
