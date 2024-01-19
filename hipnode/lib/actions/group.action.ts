"use server";

import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { createGroupSchema, createGroupSchemaTypes } from "../validations";
import prisma from "../prisma";

const createFields = (users: string[]) => {
  return users.map((user) => ({
    id: user,
  }));
};

export async function createGroup(data: createGroupSchemaTypes) {
  try {
    const user = await currentUser();
    if (user === null) throw new Error("Please sign in to perform this action");

    const parsed = createGroupSchema.safeParse(data);
    if (!parsed.success) throw new Error("Data is not valid");

    const admins = data.admins.includes(user.id)
      ? createFields(data.admins)
      : data.admins.concat(user.id).map((admin) => ({ id: admin }));

    const members = createFields(data.members);

    await prisma.group.create({
      data: {
        cover: data.cover,
        description: data.description,
        profileImage: data.profileImage,
        name: data.name,
        admins: {
          connect: admins,
        },
        members: {
          connect: members,
        },
        author: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    revalidatePath("/groups");
  } catch (error) {
    throw error;
  }
}

export async function getAllGroups() {
  try {
    return await prisma.group.findMany({
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        Post: {
          include: {
            group: {
              select: {
                id: true,
                name: true,
                profileImage: true,
                author: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      take: 10,
    });
  } catch (error) {
    throw error;
  }
}

export async function getGroupById(id: string) {
  try {
    return await prisma.group.findUnique({
      where: { id },
      include: {
        admins: true,
        author: true,
        members: true,
      },
    });
  } catch (error) {
    throw error;
  }
}

export async function joinGroup(groupId: string, userId: string) {
  try {
    if (!groupId || !userId)
      throw new Error("Group id and user id are required");
    const foundGroup = await prisma.group.findUnique({
      where: { id: groupId },
    });
    if (!foundGroup) return;
    await prisma.group.update({
      where: { id: foundGroup.id },
      data: {
        members: {
          connect: {
            id: userId,
          },
        },
      },
    });
    revalidatePath(`/groups/${groupId}`);
  } catch (error) {
    throw error;
  }
}

export async function leaveGroup(groupId: string, userId: string) {
  try {
    const foundGroup = await prisma.group.findUnique({
      where: { id: groupId },
    });
    if (!foundGroup) return;

    await prisma.group.update({
      where: { id: foundGroup.id },
      data: {
        members: {
          disconnect: {
            id: userId,
          },
        },
      },
    });
    revalidatePath(`/groups/${groupId}`);
  } catch (error) {
    throw error;
  }
}

export async function getAllGroupsWhereUserJoin() {
  try {
    const user = await currentUser();
    if (user === null) throw new Error("Please sign in");

    return await prisma.group.findMany({
      where: {
        members: {
          some: {
            id: user.id,
          },
        },
      },
    });
  } catch (error) {
    throw error;
  }
}
