export default function Categories({
  categories,
  title,
}: {
  title: string;
  categories: Readonly<string[]>;
}) {
  return (
    <div className="h-min min-w-56 rounded-lg bg-white p-3 dark:bg-secondary-dark-2">
      <h2 className="text-lg font-semibold dark:text-white-700">{title}</h2>
      <ul className="mt-4 flex flex-col  gap-3">
        {categories.map((category) => (
          <li
            key={category}
            className="flex justify-between text-base font-semibold capitalize"
          >
            <label
              className="text-secondary dark:text-white-700"
              htmlFor={category}
            >
              {category}
            </label>
            <input className="block" type="checkbox" id={category} />
          </li>
        ))}
      </ul>
    </div>
  );
}
