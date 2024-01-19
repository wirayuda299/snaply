export interface BaseGroup {
	id: string;
	name: string;
	cover: string;
	profileImage: string;
	tags: string[];
	createdAt: Date;
	updateAt: Date;
	description: string;
}

export interface GroupWithAuthor extends BaseGroup {
	author: {
		name: string | null;
		image: string;
	} | null;
}

export interface GroupWithCurrentUser extends BaseGroup {
	memberIds: string[];
	adminIds: string[];
	authorId: string;
	groupIds: string | null;
	postId: string[];
}

export type Tag = {
	_id: string;
	name: string;
	postIds: string[];
};

type User = {
	_id: string;
	password: string;
	email: string;
	username: string;
	profileImage: string;
	role: string;
	bio: string;
	website: string;
	followers: string[]; // Assuming followers are an array of user IDs
	followings: string[]; // Assuming followings are an array of user IDs
	posts: string[]; // Assuming posts are an array of post IDs
	groups: string[]; // Assuming groups are an array of group IDs
	groupMembers: string[]; // Assuming groupMembers are an array of user IDs
	meetups: string[]; // Assuming meetups are an array of meetup IDs
	createdAt: Date;
	updatedAt: Date;
	__v: number;
};

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

export type Post = {
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
	__v: number;
};

export interface Meetup {
	_id: string;
	title: string;
	image: string;
	address: string;
	companyName: string;
	date: string;
	body: string;
	tags: Tag[];
	author: {
		_id: string;
		username: string;
		createdAt: Date;
		profileImage?: string;
	};
}
