import { CreateForm } from "@/components/index";
import { getAllGroupsWhereUserJoin } from "@/lib/actions/group.action";

export default async function Create() {
  const groups = await getAllGroupsWhereUserJoin();

  return (
    <div className="mx-auto flex w-full max-w-[900px] justify-center rounded-xl border py-5 dark:border-secondary-dark-2">
      <CreateForm groups={groups} />
    </div>
  );
}
