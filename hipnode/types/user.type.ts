import { Group, Meetup, Post } from "./index";
import { Podcast } from "./podcast.type";

export interface User {
  _id: string;
  password: string;
  email: string;
  username: string;
  profileImage: string;
  role: string;
  bio: string;
  website: string;
  followers: User[];
  followings: User[];
  posts: Post[];
  groups: Group[];
  podcasts: Podcast[];
  groupMembers: string[];
  meetups: Meetup[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
