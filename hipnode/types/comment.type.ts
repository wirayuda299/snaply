export type Comment = {
  _id: string;
  author: { _id: string; username: string; profileImage?: string };
  comment: string;
  likes: string[];
  postId: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
  postAuthor: {
    _id: string;
    username: string;
    profileImage?: string;
  };
};
