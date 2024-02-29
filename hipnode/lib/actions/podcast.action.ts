import { auth } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";

import { Podcast } from "@/types/podcast.type";
import { fetchConfig } from "../utils";

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
    await fetchConfig(`/podcasts/create`, [], "POST", {
      audio,
      audioAssetId,
      body,
      tags,
      postImage,
      title,
      author: userId,
      postImageAssetId,
      category,
    });

    revalidateTag("podcasts");
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
    const podcasts = await fetchConfig(
      `/podcasts/all?sort=${sort}&page=${page}&limit=${pageSize}`,
      ["podcasts"],
      "GET",
    );
    return {
      podcasts: podcasts.data.allPodcasts as Podcast[],
    };
  } catch (error) {
    throw error;
  }
}

export async function getPodcastById(id: string) {
  try {
    const res = await fetchConfig(`/podcasts?id=${id}`, ["podcast"], "GET");
    return res.data as Podcast;
  } catch (error) {
    throw error;
  }
}
