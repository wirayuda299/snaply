import { useState } from 'react';

import { Group } from '@/types';

export default function useSelectedGroup(group: Group | null) {
	const [selectedGroup, setSelectedGroup] = useState<Group | null>(group);

	const handleSelectedGroup = () =>
		selectedGroup ? setSelectedGroup(null) : undefined;
	return { handleSelectedGroup, selectedGroup, setSelectedGroup };
}
