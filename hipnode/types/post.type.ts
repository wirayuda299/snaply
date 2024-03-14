import { Group } from './group.type';
import { Tag } from './tag.type';
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
	category: string;
	likes: string[];
	comments: Comment[];
	author: {
		_id: string;
		username: string;
		profileImage?: string;
		createdAt: Date;
	};
	report: any[];
	createdAt: Date;
	updatedAt: Date;
	group: Group | null;
}
