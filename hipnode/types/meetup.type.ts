import { Tag } from './tag.type';

export interface Meetup {
	_id: string;
	title: string;
	image: string;
	address: string;
	category: string;
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
	createdAt: Date;
	updatedAt: Date;
}
