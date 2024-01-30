import { auth } from "@clerk/nextjs/server";

type createNotificationProps = {
  to: string;
  from: string;
  message: string;
  type: string;
};

const serverUrl = process.env.SERVER_URL;
export async function createNotification(props: createNotificationProps) {
  try {
    const { getToken } = auth();
    const token = await getToken();

    if (!token) {
      throw new Error("token is required");
    }

    const { to, from, message, type } = props;

    await fetch(`${serverUrl}/notification/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to, from, type, message }),
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
    console.log(error);

    throw error;
  }
}
