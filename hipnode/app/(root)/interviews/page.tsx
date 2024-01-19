import {
  Category,
  PodcastCard,
  HostMeetupCard,
  InterviewPostCard,
} from "@/components/index";
import { jobCategories } from "@/constants";

export default function Interviews() {
  return (
    <div className="flex size-full flex-wrap gap-5 py-5">
      <section className=" w-full max-w-[250px] max-lg:max-w-full lg:sticky lg:top-0 lg:h-screen">
        <Category categories={jobCategories} title="Categories" />
      </section>
      <section className="w-full max-w-[700px] space-y-5">
        {[1, 2, 3].map((post) => (
          <InterviewPostCard
            key={post}
            image="/banner.png"
            createdAt="Today, 17 February"
            name="Valentin Hinov"
            authorImage="/avatar.png"
            captions="How I Launched and Grew My Startup by 500% During the COVID Crisis"
          />
        ))}
      </section>
      <section className="no-scrollbar space-y-5 max-md:w-full">
        <HostMeetupCard
          title="Start your interview"
          text="Working on your own internet business? We'd love to interview you!"
          btnLeftText="Code of Conduct"
          btnRightText="Submit a Story"
        />
        <PodcastCard />
      </section>
    </div>
  );
}
