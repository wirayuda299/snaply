export const shareOptionData = (email: string, postUrl: string) => {
	return [
		{
			label: 'instagram',
			icon: '/assets/post/icons/instagram.svg',
			path: 'https://instagram.com',
		},
		{
			label: 'twitter',
			icon: '/assets/post/icons/twitter.svg',
			path: `https://twitter.com/intent/tweet?text=Check%20out%20this%20amazing%20post%20${postUrl}`,
		},
		{
			label: 'linkedin',
			icon: '/assets/post/icons/linkedin.svg',
			path: 'https://www.linkedin.com/feed',
		},
		{
			label: 'e-mail',
			icon: '/assets/post/icons/email.svg',
			path: `mailto:${email}?body=Checkout%20this%20amazing%20post:${postUrl}`,
		},
	];
};
