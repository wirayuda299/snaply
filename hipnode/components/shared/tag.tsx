type TagType = {
  _id: string;
  name: string;
  postIds: string[];
};

export default function Tag({ tags }: { tags: TagType[] }) {
  return (
    <div className="mb-auto mt-3 flex flex-wrap gap-3">
      {tags.map((tag) => (
        <button
          key={tag._id}
          className="rounded-full bg-white-700 px-2 text-xs text-secondary dark:bg-secondary-dark dark:text-secondary-light md:px-4"
        >
          #{tag?.name}
        </button>
      ))}
    </div>
  );
}
