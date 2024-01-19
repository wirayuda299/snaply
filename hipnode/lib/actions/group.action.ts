'use server';

import { revalidatePath } from 'next/cache';

export async function createGroup() {
	console.log('create group');
}

export async function getAllGroups() {
	console.log('get all group');
}

export async function getGroupById(id: string) {
	try {
		console.log('get group');
	} catch (error) {
		throw error;
	}
}

export async function joinGroup(groupId: string, userId: string) {
	try {
		console.log('join group');
		revalidatePath(`/groups/${groupId}`);
	} catch (error) {
		throw error;
	}
}

export async function leaveGroup(groupId: string, userId: string) {
	console.log('leave group');
}

export async function getAllGroupsWhereUserJoin() {
	console.log('get group where user join');
}
