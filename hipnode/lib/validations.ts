import { z } from 'zod';

export const PostSchema = z.object({
	title: z.string().min(4).max(130),
	post: z.string(),
	postImage: z.string(),
	group: z
		.object({
			id: z.string(),
			name: z.string(),
			profileImage: z.string(),
		})
		.nullable()
		.optional(),
	createType: z.string(),
	tags: z.array(z.string().min(1).max(15)).min(1).max(5),
	country: z.string(),
	address: z.string(),
	date: z.string(),
	companyName: z.string().min(4).max(100),
	audio: z.any().nullable(),
	category: z.string().min(3).max(100),
});

export const createCommentSchema = z.object({
	postId: z.string(),
	message: z.string(),
	type: z.enum(['comment', 'children']),
	parentId: z.string().nullable(),
	path: z.string(),
});

export const createGroupSchema = z.object({
	cover: z.string(),
	profileImage: z.string(),
	name: z.string().min(3).max(100),
	category: z.string().min(3).max(100),
	description: z.string().min(100).max(400),
	admins: z.array(z.string()),
	members: z.array(z.string()),
	tags: z.array(z.string()),
});

export const authSchema = z.object({
	emailAddress: z.string(),
	password: z.string().min(6).max(20),
	username: z.string().min(4).max(50),
});
export type authSchemaType = z.infer<typeof authSchema>;

export const createPostSchema = PostSchema;
export const createPostSchemaForm = PostSchema.required();
export type CreatePostFormType = z.infer<typeof createPostSchemaForm>;
export type CreatePostType = z.infer<typeof createPostSchema>;
export type CreateCommentTye = z.infer<typeof createCommentSchema>;
export type UpdatePostSchemaType = z.infer<typeof PostSchema>;
export type createGroupSchemaTypes = z.infer<typeof createGroupSchema>;
