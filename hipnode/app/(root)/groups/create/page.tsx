import CreateGroupForm from "@/components/groups/create-group-form";

type Props = {
  params: {};
  searchParams: { groupId: string };
};

export default function CreateGroup({ params, searchParams }: Props) {
  return (
    <div className="mx-auto max-w-[850px] rounded-2xl border px-5 pb-20 pt-5 dark:border-secondary-dark-2">
      <CreateGroupForm
        groupId={searchParams?.groupId}
        type={"create"}
        group={null}
      />
    </div>
  );
}
