import {
  Card,
  Category,
  PostCard,
  Pagination,
  SharedPodcastCard,
} from "@/components/index";
import { getAllPodcasts, getAllMeetups } from "@/lib/actions";

type Props = {
  searchParams: { category: string };
};
export default async function Meetups({ searchParams }: Props) {
  const [{ meetups, totalPages }, podcasts] = await Promise.all([
    getAllMeetups(),
    getAllPodcasts("popular", 1, 3),
  ]);

  const category = searchParams?.category;
  const categoriesSet = new Set(meetups.map((meetup) => meetup.category));

  return (
    <div className="flex flex-col gap-5 pb-20 pt-5 lg:flex-row">
      <section className="top-0 w-80 max-lg:w-full lg:sticky lg:h-screen">
        <Category categories={Array.from(categoriesSet)} title="Categories" />
      </section>
      <section className="w-full space-y-5">
        {category
          ? meetups
              .filter((meetup) => meetup.category === category)
              .map((meetup) => (
                <PostCard type="meetup" key={meetup._id} post={meetup} />
              ))
          : meetups?.map((meetup) => (
              <PostCard type="meetup" key={meetup._id} post={meetup} />
            ))}
        <Pagination totalPages={totalPages} />
      </section>
      <section className="top-0 w-[300px] space-y-5 max-lg:w-full lg:sticky  lg:h-screen">
        <Card
          path="/create?type=meetup"
          btnLeftText="Code of Conduct"
          btnRightText="Host a Meetup"
          title="Host a meetup"
          text="Find other Hipnoders in your area so you can learn, share, and work together."
        />
        {podcasts.allPodcasts.length >= 1 && (
          <SharedPodcastCard podcasts={podcasts.allPodcasts} />
        )}
      </section>
    </div>
  );
}
