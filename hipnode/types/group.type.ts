import { Post } from "./post.type";
import { Tag } from "./tag.type";

export type Group = {
  _id: string;
  name: string;
  banner: string;
  logo: string;
  bannerAssetId: string;
  logoAssetId: string;
  category: string;
  description: string;
  members: {
    _id: string;
    username: string;
    profileImage: string;
  }[];
  admins: {
    _id: string;
    username: string;
    profileImage: string;
  }[];
  tags: Tag[];
  createdAt: Date;
  updatedAt: Date;
  posts: Post[];
};

export type CreateGroupType = {
  tags: string[];
  members: string[];
  banner: string;
  bannerAssetId: string;
  description: string;
  logo: string;
  logoAssetId: string;
  name: string;
  category: string;
};
