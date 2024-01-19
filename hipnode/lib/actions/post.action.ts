'use server';

import {
	redirectToSignIn,
	currentUser as getCurrentUser,
	auth,
} from '@clerk/nextjs/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { notFound } from 'next/navigation';

import prisma from '../prisma';
import { PostSchema, UpdatePostSchemaType } from '../validations';
import { Post } from '@/types';

type createPostType = {
	title: string;
	body: string;
	image: string;
	group: string | undefined;
	tags: string[];
};

const serverEndpoint = process.env.NEXT_PUBLIC_SERVER_URL;

export async function createPost(props: createPostType) {
	try {
		const { userId, getToken } = auth();
		if (!userId) return new Error('You must sign in to perform this action');

		const { title, body, tags, group, image } = props;

		const token = await getToken();
		const res = await fetch(`${serverEndpoint}/post/create`, {
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify({
				title,
				body,
				tags,
				group,
				image,
				author: userId,
			}),
		});

		const response = await res.json();
		if (response.error) throw new Error(response.message);

		revalidatePath('/');
	} catch (error) {
		throw error;
	}
}

export async function getAllPosts(
	sort: 'popular' | 'newest' = 'popular',
	page: number = 1,
	pageSize: number = 10
) {
	try {
		const { getToken } = auth();
		const token = await getToken();

		if (!token) {
			throw new Error('You are not allowed to do this request');
		}
		const posts = await fetch(
			`${serverEndpoint}/post/all?sort=${sort}&page=${page}&limit=${pageSize}`,

			{
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				next: {
					tags: ['all-posts'],
				},
			}
		);
		const res = await posts.json();
		if (res.error) throw new Error(res.message);

		const totalPages = Math.ceil(res.totalPosts / pageSize);
		return {
			posts: res.data as Post[],
			totalPages,
		};
	} catch (error) {
		throw error;
	}
}

export async function getPostById(id: string) {
	try {
		const { getToken } = auth();
		const token = await getToken();
		if (!token) {
			throw new Error('You are not allowed to do this request');
		}

		const res = await fetch(`${serverEndpoint}/post?id=${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		});
		const post = await res.json();

		return { post: post.data[0] as Post };
	} catch (error) {
		throw error;
	}
}

export async function deletePost(id: string) {
	try {
		const session = await getCurrentUser();
		if (!session) throw new Error('You must sign in to perform this action');

		const foundPost = await prisma.post.findFirst({
			where: { id },
			include: { author: true },
		});

		if (session.id !== foundPost?.author.id)
			throw new Error('You are not allowed to delete this post');

		const tags = await prisma.tag.findMany();

		for (const { title } of tags) {
			await removeTagOrUpdatePostIds(title, id);
		}

		await prisma.post.delete({
			where: { id },
			include: { comments: true },
		});

		revalidatePath('/');
	} catch (error) {
		throw error;
	}
}

async function removeTagOrUpdatePostIds(title: string, postId: string) {
	try {
		const tag = await prisma.tag.findUnique({ where: { title } });

		if (tag) {
			const updatedPostIds = tag.postIds.filter((id) => id !== postId);
			if (updatedPostIds.length === 0) {
				await prisma.tag.delete({ where: { title } });
			} else {
				await prisma.tag.update({
					where: { title },
					data: { postIds: updatedPostIds },
				});
			}
		}
	} catch (error) {
		throw error;
	}
}

export async function updatePost({
	data,
	id,
}: {
	data: UpdatePostSchemaType;
	id: string;
}) {
	try {
		const parsedData = PostSchema.safeParse(data);
		if (!parsedData.success) throw new Error(parsedData.error.message);

		const session = await getCurrentUser();
		if (!session) throw new Error(`No current user`);

		const foundPost = await prisma.post.findFirst({
			where: { id },
			include: { author: true },
		});
		if (!foundPost) return notFound();

		if (foundPost?.author.id !== session.id)
			throw new Error('You not allowed edit this post');

		await prisma.post.update({
			where: { id: foundPost.id },
			// @ts-ignore
			data,
		});
		revalidatePath('/');
	} catch (error) {
		throw error;
	}
}

export async function updateView(id: string) {
	try {
		const { getToken } = auth();
		const token = await getToken();
		if (!token) {
			throw new Error('You are not allowed to do this request');
		}

		await fetch(`${serverEndpoint}/post/increment-view`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				postId: id,
			}),
		});
		revalidatePath('/');
	} catch (error) {
		throw error;
	}
}

export async function likePost(id: string, path: string) {
	try {
		const { getToken, userId } = auth();
		const token = await getToken();
		if (!token) {
			throw new Error('You are not allowed to do this request');
		}

		await fetch(`${serverEndpoint}/post/like`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				postId: id,
				userId,
			}),
		});

		revalidateTag('all-posts');
	} catch (error) {
		throw error;
	}
}

export async function getRelatedPosts(id: string, authorId: string) {
	try {
		const { getToken } = auth();

		const token = await getToken();
		if (!token) {
			throw new Error('You are not allowed to do this request');
		}

		const res = await fetch(
			`${serverEndpoint}/post/related-posts?id=${id}&authorId=${authorId}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			}
		);
		return (await res.json()) as Post[];
	} catch (error) {
		throw error;
	}
}

export async function reportPost(id: string, reasons: string[]) {
	try {
		const currentUser = await getCurrentUser();
		if (!currentUser) return redirectToSignIn();

		await prisma.report.create({
			data: {
				postId: id,
				reportedBy:
					currentUser.username ??
					currentUser.firstName ??
					currentUser.lastName ??
					currentUser.emailAddresses[0].emailAddress,
				reasons: { set: reasons },
			},
		});
	} catch (error) {
		throw error;
	}
}

export async function sharePost(id: string, path: string) {
	try {
		const { getToken } = auth();
		const token = await getToken();
		if (!token) {
			throw new Error('You are not allowed to do this request');
		}

		await fetch(`${serverEndpoint}/post/share`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				postId: id,
			}),
		});
		revalidatePath(path);
	} catch (error) {
		throw error;
	}
}
