import { Category, Card, MeetupCard, PodcastCard } from "@/components/index";
import { getAllPodcasts } from "@/lib/actions/podcast.action";

const categories = [
  "indie bites",
  "software social",
  "hipnode",
  "free",
] as const;

export default async function Podcasts() {
  const { podcasts } = await getAllPodcasts();

  return (
    <div className="flex flex-col gap-5 py-5 lg:flex-row">
      <section className="top-0 w-80 max-md:w-full lg:sticky lg:h-screen">
        <Category categories={categories} title="Filter by Show" />
      </section>
      <section className="flex w-full grow flex-wrap gap-5">
        {podcasts?.map((podcast) => (
          <PodcastCard podcast={podcast} key={podcast._id} />
        ))}
      </section>
      <section className="space-y-5">
        <Card
          path="/create?type=podcasts"
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
