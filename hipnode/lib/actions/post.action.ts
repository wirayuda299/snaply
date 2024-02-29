import { auth } from "@clerk/nextjs/server";
import { revalidatePath, revalidateTag } from "next/cache";

import { Post } from "@/types";
import { fetchConfig } from "../utils";

type createPostType = {
  title: string;
  body: string;
  category: string;
  image: string;
  assetId: string;
  group: string | undefined;
  tags: string[];
};

export async function createPost(props: createPostType) {
  try {
    const { userId } = auth();

    const { title, body, tags, group, image, assetId, category } = props;
    await fetchConfig("/post/create", [], "POST", {
      title,
      body,
      tags,
      group,
      image,
      assetId,
      category,
      author: userId,
    });

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
    const posts = await fetchConfig(
      `/post/all?sort=${sort}&page=${page}&limit=${pageSize}`,
      ["all-posts"],
      "GET",
    );

    const totalPages = Math.ceil(posts.totalPosts / pageSize);
    return {
      posts: posts.data as Post[],
      totalPages,
    };
  } catch (error) {
    throw error;
  }
}

export async function getPostById(id: string) {
  try {
    const res = await fetchConfig(`/post?id=${id}`, ["post"], "GET");
    return { post: res?.data as Post };
  } catch (error) {
    throw error;
  }
}

export async function deletePost(id: string, path: string) {
  try {
    await fetchConfig("/post/delete", [], "POST", { postId: id });
    revalidatePath(path);
    revalidatePath("/");
  } catch (error) {
    throw error;
  }
}

export async function updatePost() {}

export async function updateView(id: string) {
  try {
    await fetchConfig(`/post/increment-view`, [], "POST", { postId: id });
    revalidatePath("/");
  } catch (error) {
    throw error;
  }
}

export async function likePost(id: string) {
  try {
    const { userId } = auth();

    await fetchConfig(`/post/like`, [], "POST", {
      postId: id,
      userId,
    });

    revalidateTag("all-posts");
  } catch (error) {
    throw error;
  }
}

export async function getRelatedPosts(id: string, authorId: string) {
  try {
    const res = await fetchConfig(
      `/post/related-posts?id=${id}&authorId=${authorId}`,
      [],
      "GET",
    );
    return (await res.data) as Post[];
  } catch (error) {
    throw error;
  }
}

export async function reportPost(id: string, reasons: string[]) {
  try {
    const { userId } = auth();

    await fetchConfig(`/report/report-post`, [], "POST", {
      postId: id,
      reasons,
      userId,
    });
    revalidatePath(`/post/${id}`);
  } catch (error) {
    throw error;
  }
}

export async function sharePost(id: string, path: string) {
  try {
    await fetchConfig(`/post/share`, [], "POST", { postId: id });
    revalidatePath(path);
  } catch (error) {
    throw error;
  }
}
