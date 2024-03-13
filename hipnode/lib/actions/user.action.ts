import { auth } from "@clerk/nextjs/server";

import { User } from "@/types";
import { ApiRequest } from "@/utils";
import { revalidatePath } from "next/cache";

const apiRequest = new ApiRequest();

export async function createUser(
  email: string,
  id: string,
  image: string,
  username: string,
  password: string,
) {
  try {
    await fetch(`${process.env.SERVER_URL}/user/create`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email,
        id,
        image,
        username,
        password,
      }),
    });
  } catch (error) {
    throw error;
  }
}

export async function getUserById(id: string) {
  try {
    return await apiRequest.get<User>(`/user?id=${id}`);
  } catch (error) {
    throw error;
  }
}

export async function handleFollow(id: string, path: string) {
  try {
    const { userId } = auth();
    const requestBody = { userId: id, followerId: userId };

    await apiRequest.post("/user/follow", requestBody, path);
    revalidatePath(path);
  } catch (error) {
    throw error;
  }
}

export async function getAllUsers(userId: string) {
  try {
    return await apiRequest.get<User[]>(`/user/all-users?userId=${userId}`);
  } catch (error) {
    throw error;
  }
}
