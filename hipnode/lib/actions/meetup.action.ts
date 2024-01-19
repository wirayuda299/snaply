"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { currentUser } from "@clerk/nextjs";

import prisma from "../prisma";
import { notFound } from "next/navigation";

const schema = z.object({
  address: z.string(),
  companyName: z.string(),
  date: z.string(),
  image: z.string(),
  title: z.string(),
  body: z.string(),
  tags: z.array(z.string()),
});

export async function getAllMeetups() {
  try {
    return await prisma.meetup.findMany({
      include: {
        User: {
          select: {
            image: true,
            name: true,
          },
        },
      },
    });
  } catch (error) {
    throw error;
  }
}

export async function createMeetup(props: z.infer<typeof schema>) {
  try {
    const user = await currentUser();
    if (!user) throw new Error("You must sign in to performm this action");

    const parsed = schema.safeParse(props);
    if (!parsed.success) throw new Error("Data is not valid");

    const { address, companyName, date, image, title, tags, body } =
      parsed.data;
    const tagsDocs: string[] = [];

    const meetup = await prisma.meetup.create({
      data: {
        address,
        companyName,
        date,
        image,
        title,
        authorEmail: user.emailAddresses[0].emailAddress,
        body,
      },
    });
    for (const tag of tags) {
      // create if tag doesn't exist or use tag is found
      const existingTags = await prisma.tag.upsert({
        where: { title: tag },
        // keep prev tag and push with new tag
        update: { postIds: { push: meetup.id } },
        // create new tag, assume tag in db empty
        create: { title: tag, postIds: { set: [meetup.id] } },
      });
      tagsDocs.push(existingTags.title);
    }
    await prisma.meetup.update({
      where: {
        id: meetup.id,
      },
      data: {
        tags: {
          push: tags,
        },
      },
    });
    revalidatePath("/meetups");
  } catch (error) {
    throw error;
  }
}

export async function getMeetupById(id: string) {
  try {
    const meetup = await prisma.meetup.findUnique({ where: { id } });
    if (!meetup) return notFound();
    return meetup;
  } catch (error) {}
}
