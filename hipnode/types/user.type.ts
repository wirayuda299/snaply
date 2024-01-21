export interface User {
	_id: string;
	password: string;
	email: string;
	username: string;
	profileImage: string;
	role: string;
	bio: string;
	website: string;
	followers: string[];
	followings: string[];
	posts: string[];
	groups: string[];
	groupMembers: string[];
	meetups: string[];
	createdAt: Date;
	updatedAt: Date;
	__v: number;
}
