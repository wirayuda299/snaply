export const navLinks = [
	{
		label: 'Home',
		path: '/',
		icon: '/assets/general/icons/home.svg',
	},
	{
		label: 'Meetups',
		path: '/meetups',
		icon: '/assets/general/icons/calendar.svg',
	},
	{
		label: 'Groups',
		path: '/groups',
		icon: '/assets/general/icons/group.svg',
	},
	{
		label: 'Podcasts',
		path: '/podcasts',
		icon: '/assets/general/icons/podcast.svg',
	},
	{
		label: 'Interviews',
		path: '/interviews',
		icon: '/assets/general/icons/interview.svg',
	},
] as const;

export const tabValues = [
	{
		label: 'all',
		icon: '',
		title: 'All Notifications',
	},
	{
		label: 'like',
		icon: '/assets/general/icons/heart.svg',
		title: 'Reactions',
	},
	{
		label: 'comment',
		icon: '/assets/general/icons/chat.svg',
		title: 'Comments',
	},
] as const;
