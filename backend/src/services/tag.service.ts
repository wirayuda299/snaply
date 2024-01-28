import { Model } from "mongoose";

import { TagModel } from "../models/tag.model";

export default class Tag<T extends Model<any>> {
  constructor(
    private model: T,
    private tagModel: TagModel,
  ) { }

  async createTagIfExists(tagsDocs: string[], postId: string) {
    try {
      const tags = [];
      // create if doesn't exists
      for (const tag of tagsDocs) {
        const [existingTags] = await Promise.all([
          this.tagModel.findOneAndUpdate(
            { name: tag },
            { $setOnInsert: { name: tag }, $push: { postIds: postId } },
            { upsert: true, new: true },
          ),
        ]);
        tags.push(existingTags.id);
      }
      // update post
      await this.model.findByIdAndUpdate(postId, { tags });
      return tags;
    } catch (error) {
      throw error;
    }
  }
}
