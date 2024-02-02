
export type Notification = {
  _id: string
  notificationType: string
  message: string
  to: string
  from: string
  is_read: boolean
  postId: string
  modelPath: string
  createdAt: Date
  updatedAt: Date
}

