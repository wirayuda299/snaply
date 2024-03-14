import { revalidatePath } from 'next/cache';

import { Group } from '@/types';
import { ApiRequest } from '@/utils';

const apiRequest = new ApiRequest();

export async function createGroup(
	admins: string[],
	tags: string[],
	banner: string,
	bannerAssetId: string,
	description: string,
	logo: string,
	logoAssetId: string,
	name: string,
	category: string
) {
	try {
		const requestBody = {
			admins,
			tags,
			members: [],
			banner,
			description,
			logo,
			name,
			bannerAssetId,
			logoAssetId,
			category,
		};

		await apiRequest.post(`/group/create`, requestBody);
		revalidatePath('/groups');
	} catch (error) {
		throw error;
	}
}

export async function getAllGroups() {
	try {
		return await apiRequest.get<Group[]>('/group/all');
	} catch (error) {
		throw error;
	}
}

export async function getGroupById(id: string) {
	try {
		if (!id) return;

		return await apiRequest.get<Group>(`/group?id=${id}`);
	} catch (error) {
		throw error;
	}
}

export async function joinGroup(groupId: string, userId: string) {
	try {
		await apiRequest.post('/group/join', { groupId, userId });
		revalidatePath(`/groups/${groupId}`);
	} catch (error) {
		throw error;
	}
}

export async function leaveGroup(groupId: string, userId: string) {
	try {
		await apiRequest.post('/group/leave', { groupId, userId });
		revalidatePath(`/groups/${groupId}`);
	} catch (error) {
		throw error;
	}
}

export async function getAllGroupsWhereUserJoin(admins: string[]) {
	try {
		const userId = apiRequest.getUserId;
		if (!userId) throw new Error('Unauthorized');

		const query = `/group/group-member?admins=${admins}&members=${userId}`;

		return await apiRequest.get<Group[]>(query);
	} catch (error) {
		throw error;
	}
}

type Props = {
	groupId: string;
	members: string[];
	admins: string[];
	tags: string[];
	banner: string;
	description: string;
	logo: string;
	name: string;
	category: string;
	bannerAssetId: string;
	logoAssetId: string;
};

export async function updateGroup({
	groupId,
	tags,
	banner,
	description,
	logo,
	name,
	category,
	bannerAssetId,
	logoAssetId,
	admins,
	members,
}: Props) {
	try {
		const body = {
			groupId,
			tags,
			...(banner && { banner }),
			description,
			...(logo && { logo }),
			name,
			category,
			...(bannerAssetId && { bannerAssetId }),
			...(logoAssetId && { logoAssetId }),
			admins,
			members,
		};
		await apiRequest.post('/group/update', body);
		revalidatePath('/groups');
	} catch (error) {
		throw error;
	}
}
