import { Tag } from './tag.type';

export type Podcast = {
	_id: string;
	audio: string;
	category: string;
	audioAssetId: string;
	author: {
		_id: string;
		username: string;
		profileImage?: string;
		region: string;
		country?: string;
	};
	title: string;
	body: string;
	postImage: string;
	postImageAssetId: string;
	tags: Tag[];
	updatedAt: Date;
	createdAt: Date;
};
