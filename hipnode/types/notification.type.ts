export type Notification = {
  _id: string;
  notificationType: string;
  message: string;
  to: string;
  from: {
    _id: string;
    username: string;
    profileImage?: string;
  };
  is_read: boolean;
  postId: string;
  modelPath: string;
  createdAt: Date;
  updatedAt: Date;
  comments?: string;
};
