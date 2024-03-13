import { Tag } from "@/types";
import { ApiRequest } from "@/utils";

const apiRequest = new ApiRequest();

export async function getAllTags() {
  try {
    return await apiRequest.get<Tag[]>("/tags/all-tags");
  } catch (error) {
    throw error;
  }
}
