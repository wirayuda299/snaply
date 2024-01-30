import { cn } from "@/lib/utils";
import { Tag } from "@/types";

export default function PopularTags({
  items,
  styles,
  innerStyles,
}: {
  items: Tag[];
  styles?: string;
  innerStyles?: string;
}) {
  const names = new Set(items.map((item) => item.name));

  return (
    <aside
      className={cn(
        "rounded-lg bg-white dark:bg-secondary-dark-2 p-3 min-w-[218px] max-lg:w-full w-[218px] hidden md:block",
        styles,
      )}
    >
      <ul
        className={cn(
          "no-scrollbar flex flex-col items-center gap-5 space-x-3 overflow-x-auto md:flex-col md:items-start md:space-x-0",
          innerStyles,
        )}
      >
        {Array.from(names).map((item) => (
          <li className="flex items-center justify-start gap-2" key={item}>
            <div>
              <h3
                className={
                  "w-full truncate text-sm font-semibold text-secondary dark:text-white-700 max-lg:w-full"
                }
              >
                #{item}
              </h3>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
