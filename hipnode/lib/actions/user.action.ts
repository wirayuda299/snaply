"use server";

import { User } from "@/types";
import { auth } from "@clerk/nextjs/server";

const serverEndpoint = process.env.SERVER_URL;

export async function createUser(
  email: string,
  id: string,
  username: string,
  token: string,
  image: string,
  password: string,
) {
  try {
    const serverEndpoint = process.env.SERVER_URL;

    await fetch(`${serverEndpoint}/user/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email,
        id,
        image,
        password,
        username,
      }),
    });
  } catch (error) {
    throw error;
  }
}

export async function updateUser(email: string, name: string) {
  try {
    console.log("update user");
  } catch (error) {
    console.log("Error with update user", error);
  }
}

export async function deleteUser(email: string) {
  try {
    console.log(" delete user");
  } catch (error) {
    console.log("error with delete user", error);
  }
}

export async function getUserById(id: string) {
  try {
    const { userId, getToken } = auth();
    if (!userId) return new Error("You must sign in to perform this action");

    const token = await getToken();
    const res = await fetch(`${serverEndpoint}/user?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const user = await res.json();
    if (user.error) throw new Error(user.message);

    return user.data as User;
  } catch (error) {
    throw error;
  }
}
