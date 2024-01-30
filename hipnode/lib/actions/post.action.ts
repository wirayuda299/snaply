import { auth } from "@clerk/nextjs/server";
import { revalidatePath, revalidateTag } from "next/cache";

import { Post } from "@/types";

type createPostType = {
  title: string;
  body: string;
  category: string;
  image: string;
  assetId: string;
  group: string | undefined;
  tags: string[];
};

const serverEndpoint = process.env.SERVER_URL;

export async function createPost(props: createPostType) {
  try {
    const { userId, getToken } = auth();
    if (!userId) return new Error("You must sign in to perform this action");

    const { title, body, tags, group, image, assetId, category } = props;

    const token = await getToken();
    const res = await fetch(`${serverEndpoint}/post/create`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        title,
        body,
        tags,
        group,
        image,
        author: userId,
        assetId,
        category,
      }),
    });

    const response = await res.json();
    if (response.error) throw new Error(response.message);

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
    const { getToken } = auth();
    const token = await getToken();

    if (!token) {
      throw new Error("You are not allowed to do this request");
    }
    const posts = await fetch(
      `${serverEndpoint}/post/all?sort=${sort}&page=${page}&limit=${pageSize}`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        next: {
          tags: ["all-posts"],
        },
      },
    );
    const res = await posts.json();
    if (res.error) throw new Error(res.message);

    const totalPages = Math.ceil(res.totalPosts / pageSize);
    return {
      posts: res.data as Post[],
      totalPages,
    };
  } catch (error) {
    throw error;
  }
}

export async function getPostById(id: string) {
  try {
    const { getToken } = auth();
    const token = await getToken();
    if (!token) {
      throw new Error("You are not allowed to do this request");
    }

    const res = await fetch(`${serverEndpoint}/post?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const post = await res.json();

    return { post: post.data[0] as Post };
  } catch (error) {
    throw error;
  }
}

export async function deletePost(id: string) {
  try {
    revalidatePath("/");
  } catch (error) {
    throw error;
  }
}

export async function updatePost() {}

export async function updateView(id: string) {
  try {
    const { getToken } = auth();
    const token = await getToken();
    if (!token) {
      throw new Error("You are not allowed to do this request");
    }

    await fetch(`${serverEndpoint}/post/increment-view`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: id,
      }),
    });
    revalidatePath("/");
  } catch (error) {
    throw error;
  }
}

export async function likePost(id: string, path: string) {
  try {
    const { getToken, userId } = auth();
    const token = await getToken();
    if (!token) {
      throw new Error("You are not allowed to do this request");
    }

    await fetch(`${serverEndpoint}/post/like`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: id,
        userId,
      }),
    });

    revalidateTag("all-posts");
  } catch (error) {
    throw error;
  }
}

export async function getRelatedPosts(id: string, authorId: string) {
  try {
    const { getToken } = auth();

    const token = await getToken();
    if (!token) {
      throw new Error("You are not allowed to do this request");
    }

    const res = await fetch(
      `${serverEndpoint}/post/related-posts?id=${id}&authorId=${authorId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return (await res.json()) as Post[];
  } catch (error) {
    throw error;
  }
}

export async function reportPost(id: string, reasons: string[]) {}

export async function sharePost(id: string, path: string) {
  try {
    const { getToken } = auth();

    const token = await getToken();
    if (!token) {
      throw new Error("You are not allowed to do this request");
    }

    await fetch(`${serverEndpoint}/post/share`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: id,
      }),
    });
    revalidatePath(path);
  } catch (error) {
    throw error;
  }
}
