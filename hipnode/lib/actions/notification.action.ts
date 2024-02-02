import { Notification } from "@/types";
import { auth } from "@clerk/nextjs/server";

type createNotificationProps = {
  to: string;
  from: string;
  message: string;
  type: string;
  postId: string
  model: string
};

const serverUrl = process.env.SERVER_URL;


export async function createNotification(props: createNotificationProps) {
  try {
    const { getToken } = auth();
    const token = await getToken();

    if (!token) {
      throw new Error("token is required");
    }

    const { to, from, message, type, postId, model } = props;

    await fetch(`${serverUrl}/notification/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to, from, type, message, postId, model }),
    });
  } catch (e) {
    throw e;
  }
}
export async function deleteNotification(type: string, postId: string) {
  try {
    const { getToken, userId } = auth();
    const token = await getToken();

    if (!token) {
      throw new Error("token is required");
    }

    await fetch(`${serverUrl}/notification/delete`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type,
        postId,
        userId,
      }),
    });
  } catch (error) {
    throw error;
  }
}

export async function getAllNotifications() {

  try {
    const { getToken, userId } = auth();
    const token = await getToken();

    if (!token) {
      throw new Error("token is required");
    }

    const res = await fetch(`${serverUrl}/notification/all-notifications?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    const allNotifications = await res.json()
    if (!allNotifications.error) {
      return allNotifications.data as Notification[]
    }

  } catch (error) {
    throw error
  }
}
