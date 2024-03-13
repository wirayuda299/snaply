import { auth } from "@clerk/nextjs/server";
import { revalidatePath, revalidateTag } from "next/cache";

import { Post } from "@/types";
import { ApiRequest } from "@/utils";

type createPostType = {
  title: string;
  body: string;
  category: string;
  image: string;
  assetId: string;
  group: string | undefined;
  tags: string[];
};

const apiRequest = new ApiRequest();
export async function createPost(props: createPostType) {
  try {
    const { userId } = auth();

    const { title, body, tags, group, image, assetId, category } = props;

    await apiRequest.post(
      "/post/create",
      { title, body, tags, group, image, assetId, category, author: userId },
      "/",
    );
    revalidatePath("/");
  } catch (error) {
    throw error;
  }
}

export async function getAllPosts(
  sort: string = "popular",
  page: number = 1,
  pageSize: number = 10,
) {
  try {
    return await apiRequest.get<{
      totalPages: number;
      allPosts: Post[];
    }>(`/post/all?sort=${sort}&page=${page}&limit=${pageSize}`);
  } catch (error) {
    throw error;
  }
}

export async function getPostById(id: string) {
  try {
    const post = await apiRequest.get<Post>(`/post?id=${id}`);
    return { post };
  } catch (error) {
    throw error;
  }
}

export async function deletePost(id: string, path: string) {
  try {
    await apiRequest.patch("/post/delete", { postId: id }, path);
    revalidatePath(path);
  } catch (error) {
    throw error;
  }
}

export async function updatePost(
  postId: string,
  title: string,
  image: string,
  assetId: string,
  body: string,
  category: string,
  tags: string[],
  path: string,
) {
  try {
    const requestBody = {
      postId,
      title,
      image,
      assetId,
      body,
      category,
      tags,
    };

    await apiRequest.post("/post/update", requestBody, path);
    revalidatePath(path);
  } catch (error) {
    throw error;
  }
}

export async function updateView(id: string) {
  try {
    await apiRequest.post("/post/increment-view", { postId: id }, "/");
  } catch (error) {
    throw error;
  }
}

export async function likePost(id: string) {
  try {
    const { userId } = auth();

    await apiRequest.post(
      "/post/like",
      {
        postId: id,
        userId,
      },
      "/",
      "all-posts",
    );
    revalidateTag("all-posts");
  } catch (error) {
    throw error;
  }
}

export async function getRelatedPosts(id: string, authorId: string) {
  try {
    const apiRequest = new ApiRequest();

    return await apiRequest.get<Post[]>(
      `/post/related-posts?id=${id}&authorId=${authorId}`,
    );
  } catch (error) {
    throw error;
  }
}

export async function reportPost(id: string, reasons: string[]) {
  try {
    const { userId } = auth();

    await apiRequest.post(
      `/report/report-post`,
      {
        postId: id,
        reasons,
        userId,
      },
      `/post/${id}`,
    );
    revalidatePath(`/post/${id}`);
  } catch (error) {
    throw error;
  }
}

export async function sharePost(id: string, path: string) {
  try {
    await apiRequest.post("/post/share", { postId: id }, path);
    revalidatePath(path);
  } catch (error) {
    throw error;
  }
}
