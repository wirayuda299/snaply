"use server";

import { Group } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export type CreateGroupType = {
  admins: string[];
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

const serverEndpoint = process.env.SERVER_URL;

export async function createGroup(props: CreateGroupType) {
  try {
    const {
      admins,
      tags,
      members,
      banner,
      description,
      logo,
      name,
      bannerAssetId,
      logoAssetId,
      category,
    } = props;

    const { getToken } = auth();

    const token = await getToken();
    if (!token) throw new Error("token is required");

    const res = await fetch(`${serverEndpoint}/group/create`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        admins,
        tags,
        members,
        banner,
        description,
        logo,
        name,
        bannerAssetId,
        logoAssetId,
        category,
      }),
    });

    const group = await res.json();
    if (group.error) throw new Error(group.message);
  } catch (error) {
    throw error;
  }
}

export async function getAllGroups() {
  try {
    const { getToken } = auth();

    const token = await getToken();
    if (!token) throw new Error("token is required");

    const res = await fetch(`${serverEndpoint}/group/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const groups = await res.json();
    if (groups.error) {
      throw new Error(groups.message);
    }
    return groups.data as Group[];
  } catch (error) {
    throw error;
  }
}

export async function getGroupById(id: string) {
  try {
    const { getToken } = auth();

    const token = await getToken();
    if (!token) throw new Error("token is required");

    const res = await fetch(`${serverEndpoint}/group?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const group = await res.json();
    if (group.error) {
      throw new Error(group.message);
    }
    return group.data as Group;
  } catch (error) {
    throw error;
  }
}

export async function joinGroup(groupId: string, userId: string) {
  try {
    console.log("join group");
    revalidatePath(`/groups/${groupId}`);
  } catch (error) {
    throw error;
  }
}

export async function leaveGroup(groupId: string, userId: string) {
  console.log("leave group");
}

export async function getAllGroupsWhereUserJoin(admins: string[]) {
  try {
    const { getToken, userId } = auth();

    const token = await getToken();
    if (!token) throw new Error("token is required");

    const res = await fetch(
      `${serverEndpoint}/group/group-member?admins=${admins}&members=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    const groups = await res.json();
    if (groups.error) {
      throw new Error(groups.message);
    }
    return groups.data as Group[];
  } catch (error) {
    throw error;
  }
}
