export default function GroupsAbout({ about }: { about: string }) {
  return (
    <aside className="top-0 hidden size-full max-h-screen max-w-[210px] gap-5 overflow-y-auto lg:sticky lg:flex lg:flex-col">
      <div className="mt-5 w-full rounded-2xl bg-white p-5 text-secondary dark:bg-secondary-dark-2 dark:text-white-800 lg:mt-0">
        <h3 className="text-base font-semibold">About</h3>
        <p className="pt-2 text-xs font-normal md:text-base lg:text-xs">
          {about}
        </p>
      </div>
    </aside>
  );
}
