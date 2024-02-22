'use server';

import {
	getCommentsReply,
	likeComments,
	uploadComment,
} from './comment.action';

import { uploadFile } from './fileUpload.action';

import {
	createGroup,
	getAllGroups,
	getAllGroupsWhereUserJoin,
	CreateGroupType,
	getGroupById,
	joinGroup,
	leaveGroup,
} from './group.action';

import { createMeetup, getAllMeetups, getMeetupById } from './meetup.action';
import { search } from './search.action';
import {
	createPodcast,
	getAllPodcasts,
	getPodcastById,
} from './podcast.action';

import {
	createPost,
	deletePost,
	getAllPosts,
	getPostById,
	getRelatedPosts,
	likePost,
	reportPost,
	sharePost,
	updatePost,
	updateView,
} from './post.action';

import { createUser, getUserById, handleFollow } from './user.action';

import {
	getAllNotifications,
	createNotification,
	deleteNotification,
} from './notification.action';
import { getAllTags } from './tag.action';
export {
	search,
	handleFollow,
	getAllTags,
	getAllNotifications,
	deleteNotification,
	createNotification,
	getCommentsReply,
	likeComments,
	uploadComment,
	uploadFile,
	createGroup,
	getAllGroups,
	getAllGroupsWhereUserJoin,
	getGroupById,
	joinGroup,
	leaveGroup,
	createMeetup,
	getAllMeetups,
	getMeetupById,
	createPodcast,
	getAllPodcasts,
	getPodcastById,
	createPost,
	deletePost,
	getAllPosts,
	getPostById,
	getRelatedPosts,
	likePost,
	reportPost,
	sharePost,
	updatePost,
	updateView,
	createUser,
	getUserById,
};
export type { CreateGroupType };
