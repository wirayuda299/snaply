import { useState } from "react";

import { GroupWithAuthor } from "@/types";

export default function useSelectedGroup(group: GroupWithAuthor | null) {
  const [selectedGroup, setSelectedGroup] = useState<GroupWithAuthor | null>(
    group
  );

  const handleSelectedGroup = () =>
    selectedGroup ? setSelectedGroup(null) : undefined;
  return { handleSelectedGroup, selectedGroup, setSelectedGroup };
}
