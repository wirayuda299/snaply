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

export const options = (id: string) => {
	return [
		{
			icon: '/assets/general/icons/user.svg',
			label: 'profile',
			path: `/profile/${id}`,
		},
		{
			icon: '/assets/general/icons/settings.svg',
			label: 'settings',
			path: `/settings`,
		},
		{
			icon: '/assets/general/icons/logout.svg',
			label: 'log out',
			path: undefined,
		},
	] as const;
};
