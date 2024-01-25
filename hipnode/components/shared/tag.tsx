type Tags = {
  _id: string;
  name: string;
  postIds: string[];
};
export default function Tag({ tags }: { tags: Tags[] }) {
  return (
    <div className="mb-auto mt-2 flex flex-wrap gap-3">
      {tags?.map((tag) => (
        <button
          key={tag._id}
          className="rounded-full bg-white-700 px-2 text-xs text-secondary dark:bg-secondary-dark dark:text-white-700 md:px-4"
        >
          {tag.name}
        </button>
      ))}
    </div>
  );
}
