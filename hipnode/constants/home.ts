export function filterItems(following: number = 0) {
	return [
		{
			label: 'newest',
			title: 'New and Recent',
			icon: '/assets/home/icons/new.svg',
			subText: 'Find the latest update',
		},
		{
			label: 'popular',
			title: 'Popular of the Day',
			icon: '/assets/home/icons/popular.svg',
			subText: 'FShots featured today by curators',
		},
		{
			label: 'following',
			title: 'Following',
			icon: '/assets/home/icons/user.svg',
			subText: following,
		},
	] as const;
}
