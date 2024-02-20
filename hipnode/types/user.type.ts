import { Group, Meetup, Post, Podcast } from './index';

export interface User {
	_id: string;
	password: string;
	points: number;
	email: string;
	username: string;
	profileImage: string;
	role: string;
	bio: string;
	website: string;
	followers: string[];
	followings: string[];
	posts: Post[];
	groups: Group[];
	podcasts: Podcast[];
	groupMembers: string[];
	meetups: Meetup[];
	interviews: any[];
	createdAt: Date;
	updatedAt: Date;
}
