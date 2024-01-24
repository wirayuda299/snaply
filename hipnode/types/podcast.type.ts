import { Tag } from './tag.type';

export type Podcast = {
	_id: string;
	audio: string;
	audioAssetId: string;
	author: {
		_id: string;
		username: string;
		profileImage?: string;
	};
	title: string;
	body: string;
	postImage: string;
	postImageAssetId: string;
	tags: Tag[];
	updatedAt: Date;
};
