import { Schema, model } from "mongoose";

const messagesSchema = new Schema(
  {
    sendBy: {
      type: String,
      ref: "User",
    },

    sendTo: {
      type: String,
      ref: "User",
    },
    message: String,
    image: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const messageModel = model("Message", messagesSchema);
export type messageModelType = typeof messageModel;
export default messageModel;
