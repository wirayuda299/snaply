import { Model } from 'mongoose';
import { Response } from 'express';
import { TagModel } from '../models/tag.model';

export default class Tag<T extends Model<any>> {
	constructor(private model: T, private tagModel: TagModel) {}

	async createTagIfExists(tagsDocs: string[], postId: string) {
		try {
			const tags = [];
			if (this.tagModel && this.model) {
				for (const tag of tagsDocs) {
					const [existingTags] = await Promise.all([
						this.tagModel.findOneAndUpdate(
							{ name: tag },
							{ $setOnInsert: { name: tag }, $push: { postIds: postId } },
							{ upsert: true, new: true }
						),
					]);
					tags.push(existingTags.id);
				}
				await this.model.findByIdAndUpdate(postId, { tags });
				return tags;
			}
		} catch (error) {
			throw error;
		}
	}

	async getAllTags(res: Response) {
		try {
			if (this.tagModel) {
				const tags = await this.tagModel.find();
				return res.json({ data: tags, error: false });
			}
		} catch (error) {
			return res.status(500).json({ error });
		}
	}
}
