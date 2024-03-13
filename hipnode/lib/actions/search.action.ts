import { Group, Meetup, Podcast, Post } from "@/types";
import { ApiRequest } from "@/utils";

const apiRequest = new ApiRequest();

type ReturnTypes = {
  groups: Group[];
  post: Post[];
  podcasts: Podcast[];
  meetups: Meetup[];
};

export async function search(searchTerm: string) {
  try {
    const query = `/search/all?searchTerm=${searchTerm}`;

    const res = await apiRequest.get<ReturnTypes>(query);

    return Object.fromEntries(
      Object.entries(res).filter(
        ([key, value]) => Array.isArray(value) && value.length >= 1,
      ),
    );
  } catch (error) {
    throw error;
  }
}
