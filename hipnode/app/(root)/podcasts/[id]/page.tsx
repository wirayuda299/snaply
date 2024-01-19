import Image from "next/image";

import PodcastsAudio from "@/components/podcasts/Audio";

export default function PodcastDetail() {
  return (
    <div className="flex w-full justify-center py-5">
      <div className="w-full max-w-[850px] bg-white p-5">
        <header className="flex w-full justify-between gap-5">
          <div className="flex gap-5">
            <div className="flex w-full">
              <Image
                src="/audio.png"
                width={100}
                height={100}
                alt=""
                fetchPriority="high"
                priority
                className="z-10"
              />
              <Image
                className="-ml-7"
                src="/assets/podcasts/icons/disk.svg"
                width={100}
                height={100}
                alt=""
              />
            </div>
            <div className="flex justify-between">
              <div className="w-full">
                <p className="text-xs font-medium text-secondary dark:text-white-700">
                  Hipnod • Episode 243
                </p>
                <h2 className="text-xl font-semibold text-secondary dark:text-white-700">
                  by Courtland Allen
                </h2>
                <PodcastsAudio />
              </div>
            </div>
          </div>
          <button>
            <Image
              src={"/assets/podcasts/icons/dots.svg"}
              width={30}
              height={30}
              alt="dots icon"
            />
          </button>
        </header>
        <div className="pt-5">
          <h3 className="text-xl font-semibold text-secondary dark:text-white-700">
            #243 – Mental Health and Bootstrapping in 2022 with Rob Walling of
            TinySeed
          </h3>
          <p className="pt-3 text-sm text-secondary dark:text-white-700">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eligendi
            autem voluptates aliquid nihil nemo, explicabo ipsum voluptatem,
            esse incidunt, quis culpa doloremque nisi voluptas iste ab vero
            aspernatur laudantium officiis corrupti voluptate ducimus? Nam,
            veritatis fugit, magni commodi non voluptatem repellat veniam
            assumenda consectetur, exercitationem corrupti! Molestias veritatis,
            qui reiciendis consequuntur, similique doloremque iure pariatur est
            tenetur ullam perferendis beatae maiores, debitis voluptate expedita
            ipsam praesentium. Necessitatibus maxime libero, deserunt quod
            dolores laborum tempora reprehenderit cupiditate sed, beatae
            exercitationem ipsa neque, blanditiis saepe repudiandae cumque
            aperiam ratione! Laudantium atque sint voluptas natus beatae dolore
            assumenda. Quia neque numquam placeat recusandae.
          </p>
        </div>
      </div>
    </div>
  );
}
