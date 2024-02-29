import {
  Card,
  Category,
  InterviewPostCard,
  SharedPodcastCard,
} from "@/components/index";

export default function Interviews() {
  return (
    <div className="grid grid-cols-1 justify-evenly gap-5 py-5 md:grid-cols-2 lg:grid-cols-7 lg:p-5">
      <div className="col-span-4 lg:col-span-1 ">
        <Category categories={[]} title="Categories" />
      </div>
      <div className="col-span-4 w-full grow space-y-5">
        {[1, 2, 3].map((post) => (
          <InterviewPostCard
            key={post}
            image="/img.png"
            createdAt="Today, 17 February"
            name="Valentin Hinov"
            authorImage="/avatar.png"
            captions="How I Launched and Grew My Startup by 500% During the COVID Crisis"
          />
        ))}
      </div>
      <div className="no-scrollbar col-span-4 space-y-5  max-lg:w-full lg:col-span-2">
        <Card
          path="/post/create"
          title="Start your interview"
          text="Working on your own internet business? We'd love to interview you!"
          btnLeftText="Code of Conduct"
          btnRightText="Submit a Story"
        />
        <SharedPodcastCard podcasts={[]} />
      </div>
    </div>
  );
}
