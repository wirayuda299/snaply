import { useAuth } from "@clerk/nextjs";

export default function useFetch() {
  const { getToken } = useAuth();

  const makeRequest = async (url: string) => {
    return await fetch(url, {
      headers: { Authorization: `Bearer ${await getToken()}` },
    }).then((res) => res.json());
  };

  return { makeRequest };
}
