import { User } from './user.type';

export type Comment = {
	_id: string;
	author: User;
	comment: string;
	likes: string[];
	postId: string;
	parentId?: string;
	createdAt: Date;
	updatedAt: Date;
};
