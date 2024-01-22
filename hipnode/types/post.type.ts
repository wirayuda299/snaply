import { Group } from './group.type';
import { Tag } from './tag.type';
import { User } from './user.type';
import { Comment } from './comment.type';

export interface Post {
	_id: string;
	title: string;
	body: string;
	views: number;
	image: string;
	tags: Tag[];
	share: number;
	country: string;
	likes: string[];
	comments: Comment[];
	author: User;
	report: any[];
	createdAt: Date;
	updatedAt: Date;
	group: Group | null;
}
