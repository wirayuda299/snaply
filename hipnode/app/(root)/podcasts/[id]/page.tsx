import { Parser } from "@/components/index";
import AudioMetadata from "@/components/podcasts/AudioMetadata";
import { getPodcastById } from "@/lib/actions";

type Props = {
  params: {
    id: string;
  };
};
export default async function PodcastDetail({ params }: Props) {
  const podcast = await getPodcastById(params.id);

  return (
    <div className="flex w-full justify-center py-5">
      <div className="w-full max-w-[850px] bg-white p-5 dark:bg-secondary-dark-2">
        <AudioMetadata
          audioUrl={podcast.audio}
          author={podcast.author.username}
          thumbnail={podcast.postImage}
          title={podcast.title}
        />
        <div className="pt-5">
          <h3 className="line-clamp-2 text-2xl font-semibold text-secondary first-letter:capitalize dark:text-white-700">
            {podcast.title}
          </h3>
          <Parser content={podcast.body} styles="line-clamp-2" />
        </div>
      </div>
    </div>
  );
}
