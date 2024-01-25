import { Query } from 'express-serve-static-core';

export interface RequestBody<T> extends Express.Request {
	body: T;
}

export type RequestBodyTypes = {
	admins: string[];
	tags: string[];
	members: string[];
	banner: string;
	description: string;
	logo: string;
	name: string;
	bannerAssetId: string;
	logoAssetId: string;
	category: string;
};

export interface RequestWithQuery<T extends Query>
	extends RequestBody<RequestBodyTypes> {
	query: T;
}
