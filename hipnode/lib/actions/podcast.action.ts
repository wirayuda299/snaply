import { auth } from "@clerk/nextjs/server";

import { Podcast } from "@/types/podcast.type";
import { ApiRequest } from "@/utils";
import { revalidatePath } from "next/cache";

const apiRequest = new ApiRequest();

export async function createPodcast(
  audio: string,
  audioAssetId: string,
  body: string,
  tags: string[],
  postImage: string,
  title: string,
  postImageAssetId: string,
  category: string,
) {
  try {
    const { userId } = auth();

    const requestBody = {
      audio,
      audioAssetId,
      body,
      tags,
      postImage,
      title,
      author: userId,
      postImageAssetId,
      category,
    };
    await apiRequest.post("/podcasts/create", requestBody, "/podcasts");
    revalidatePath("/podcasts");
  } catch (error) {
    throw error;
  }
}

export async function getAllPodcasts(
  sort: string = "newest",
  page: number = 1,
  pageSize: number = 10,
) {
  try {
    const query = `/podcasts/all?sort=${sort}&page=${page}&limit=${pageSize}`;

    return await apiRequest.get<{
      allPodcasts: Podcast[];
      totalPages: number;
    }>(query);
  } catch (error) {
    throw error;
  }
}

export async function getPodcastById(id: string) {
  try {
    return await apiRequest.get<Podcast>(`/podcasts?id=${id}`);
  } catch (error) {
    throw error;
  }
}
export async function deletePodcast(id: string) {
  try {
    await apiRequest.patch(
      `/podcasts/delete`,
      {
        podcastId: id,
      },
      "/podcasts",
    );
    revalidatePath("/podcasts");
  } catch (error) {
    throw error;
  }
}
