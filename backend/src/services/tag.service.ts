import type { Model, Types } from 'mongoose';
import { Response } from 'express';

import { TagModel } from '../models/tag.model';
import { RedisService } from './redis.service';

export default class Tag<T extends Model<any>> {
	constructor(private model: T, private tagModel: TagModel) {}

	async createTagIfExists(tagsDocs: string[], postId: string) {
		try {
			const tags = new Set();
			if (this.tagModel && this.model) {
				for (const tag of [...new Set(tagsDocs)]) {
					const [existingTags] = await Promise.all([
						this.tagModel.findOneAndUpdate(
							{ name: tag },
							{ $setOnInsert: { name: tag }, $push: { postIds: postId } },
							{ upsert: true, new: true }
						),
					]);
					tags.add(existingTags._id);
				}
				await this.model.findByIdAndUpdate(postId, { tags: [...tags] });
				return [...tags];
			}
		} catch (error) {
			throw error;
		}
	}

	async getAllTags(res: Response) {
		try {
			if (this.tagModel) {
				const data = await new RedisService().getOrCacheData(
					'tags',
					async () => {
						const tags = await this.tagModel
							.find()
							.sort({
								postIds: -1,
							})
							.limit(5);

						return tags;
					},
					res
				);
				return res.json({ data: data, error: false });
			}
		} catch (error) {
			return res.status(500).json({ error });
		}
	}

	async deleteTag(tags: Types.ObjectId[], id: Types.ObjectId) {
		try {
			tags.forEach(async (tag) => {
				// @ts-ignore
				let foundTag = await this.tagModel.findById(tag._id);
				if (foundTag) {
					if (foundTag.postIds.length === 1) {
						await this.tagModel.deleteOne({ name: foundTag.name });
					} else {
						let postIds = foundTag.postIds.filter(
							(postId) => postId.toString() !== id.toString()
						);
						foundTag.postIds = postIds;
						await foundTag.save();
					}
				}
			});
		} catch (error) {
			throw error;
		}
	}
}
