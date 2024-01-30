import { Schema, model } from "mongoose";

const schema = new Schema(
  {
    notificationType: {
      type: String,
      required: true,
    },
    message: String,
    to: {
      type: String,
      ref: "User",
    },
    from: {
      type: String,
      ref: "User",
    },
    is_read: {
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: true,
  },
);

const notificationModel = model("Notification", schema);
export type notificationModelType = typeof notificationModel;
export default notificationModel;
