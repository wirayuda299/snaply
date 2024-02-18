import Tag from '../services/tag.service';
import { Response } from 'express';

export default class TagController {
	constructor(private tagService: Tag<any>) {}

	getAllTags(res: Response) {
		return this.tagService.getAllTags(res);
	}
}
