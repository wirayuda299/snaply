import { Comment } from "@/types";
import { currentUser } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";

type Props = {
  author: string;
  comment: string;
  postId: string;
  parentId: string | null;
};

const serverEndpoint = process.env.SERVER_URL;

export async function uploadComment(data: Props) {
  const { author, comment, parentId, postId } = data;
  try {
    const { getToken } = auth();
    const token = await getToken();
    const res = await fetch(`${serverEndpoint}/comment/create`, {
      next: {
        tags: ["comment"],
      },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        author,
        comment,
        parentId,
        postId,
      }),
    });
    const commentRes = await res.json();

    if (commentRes.error) {
      throw new Error(commentRes.message);
    }

    revalidateTag("comment");
  } catch (error) {
    throw error;
  }
}

export async function likeComments(commentId: string, postId: string) {
  try {
    const user = await currentUser();
    const { getToken } = auth();
    const token = await getToken();

    if (!user || !token)
      throw new Error("You must sign in to perform this action");

    await fetch(`${serverEndpoint}/comment/like`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
        commentId,
      }),
    });

    revalidateTag("comment");
  } catch (error) {
    console.log(error);

    throw error;
  }
}

export async function getCommentsReply(commentId: string) {
  try {
    const { getToken } = auth();
    const token = await getToken();

    if (!token) throw new Error("You must sign in to perform this action");

    const res = await fetch(`${serverEndpoint}/comment/${commentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const comments = await res.json();

    if (comments.error) {
      throw new Error(comments.message);
    } else {
      return comments.data as Comment[];
    }

    // return await res.json();
  } catch (error) {
    throw error;
  }
}
