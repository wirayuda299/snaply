import { z } from "zod";
import { auth } from "@clerk/nextjs/server";

import { Meetup } from "@/types";
import { ApiRequest } from "@/utils";
import { revalidatePath } from "next/cache";

const schema = z.object({
  address: z.string(),
  companyName: z.string(),
  category: z.string(),
  date: z.string(),
  image: z.string(),
  assetId: z.string(),
  title: z.string(),
  body: z.string(),
  tags: z.array(z.string()),
});

const apiRequest = new ApiRequest();

export async function getAllMeetups() {
  try {
    return await apiRequest.get<{
      totalPages: number;
      meetups: Meetup[];
    }>(`/meetup/all?page=1&limit=10`);
  } catch (error) {
    throw error;
  }
}

export async function createMeetup(props: z.infer<typeof schema>) {
  try {
    const { userId } = auth();

    const parsed = schema.safeParse(props);
    if (!parsed.success) throw new Error("Data is not valid");

    const {
      address,
      companyName,
      date,
      image,
      title,
      tags,
      body,
      assetId,
      category,
    } = parsed.data;

    await apiRequest.post(
      "/meetup/create",
      {
        address,
        companyName,
        date,
        image,
        title,
        tags,
        body,
        assetId,
        category,
        author: userId,
      },
      "/meetups",
    );
    revalidatePath("/meetups");
  } catch (error) {
    throw error;
  }
}

export async function getMeetupById(id: string) {
  try {
    const res = await apiRequest.get<Meetup>(`/meetup?id=${id}`);

    return { meetup: res };
  } catch (error) {
    throw error;
  }
}

export async function deleteMeetup(id: string) {
  try {
    const body = { meetupId: id };

    await apiRequest.post("/meetup/delete", body, "/meetups");
    revalidatePath("/meetups");
  } catch (error) {
    throw error;
  }
}

export async function updateMeetup(
  id: string,
  address: string,
  companyName: string,
  date: string,
  image: string,
  title: string,
  tags: string[],
  body: string,
  assetId: string,
  category: string,
) {
  try {
    const requestBody = {
      meetupId: id,
      address,
      companyName,
      date,
      image,
      title,
      tags,
      body,
      assetId,
      category,
    };

    await apiRequest.post("/meetup/update", requestBody, "/meetups");
    revalidatePath("/meetups");
  } catch (error) {
    throw error;
  }
}
