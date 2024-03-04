import { auth } from '@clerk/nextjs/server';
import { revalidatePath, revalidateTag } from 'next/cache';

import { Group } from '@/types';
import { fetchConfig } from '../utils';

export type CreateGroupType = {
	tags: string[];
	members: string[];
	banner: string;
	bannerAssetId: string;
	description: string;
	logo: string;
	logoAssetId: string;
	name: string;
	category: string;
};

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
		await fetchConfig(`/group/create`, [], 'POST', {
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
		});
		revalidateTag('groups');
	} catch (error) {
		throw error;
	}
}

export async function getAllGroups() {
	try {
		const res = await fetchConfig(`/group/all`, ['groups'], 'GET');
		return res.data as Group[];
	} catch (error) {
		throw error;
	}
}

export async function getGroupById(id: string) {
	try {
		const res = await fetchConfig(`/group?id=${id}`, ['group'], 'GET');
		return res.data as Group;
	} catch (error) {
		throw error;
	}
}

export async function joinGroup(groupId: string, userId: string) {
	try {
		revalidatePath(`/groups/${groupId}`);
	} catch (error) {
		throw error;
	}
}

export async function leaveGroup(groupId: string, userId: string) {
	console.log('leave group');
}

export async function getAllGroupsWhereUserJoin(admins: string[]) {
	try {
		const { userId } = auth();

		const res = await fetchConfig(
			`/group/group-member?admins=${admins}&members=${userId}`,
			[],
			'GET'
		);

		return res.data as Group[];
	} catch (error) {
		throw error;
	}
}

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
}: {
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
}) {
	try {
		await fetchConfig('/group/update', [groupId], 'POST', {
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
		});
		revalidatePath('/groups');
	} catch (error) {
		throw error;
	}
}
