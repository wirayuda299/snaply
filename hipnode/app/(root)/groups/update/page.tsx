import CreateGroupForm from "@/components/groups/create-group-form";
import { getGroupById } from "@/lib/actions";

type Props = {
  params: { type: "update" | "create" };
  searchParams: { groupId: string };
};
export default async function CreateGroup({ params, searchParams }: Props) {
  if (params.type === "update" && !searchParams.groupId) return null;

  const group = await getGroupById(searchParams.groupId);
  return (
    <div className="mx-auto max-w-[850px] rounded-2xl border px-5 pb-20 pt-5 dark:border-secondary-dark-2">
      <CreateGroupForm
        groupId={searchParams?.groupId}
        type={"update"}
        group={group!}
      />
    </div>
  );
}
