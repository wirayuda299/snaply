import queryString from 'query-string';

export const formUrlQuery = (params: string, key: string, value: string) => {
	if (typeof window !== 'undefined') {
		const currentUrl = queryString.parse(params as string);

		currentUrl[key] = value;

		return queryString.stringifyUrl(
			{
				url: window.location.pathname,
				query: currentUrl,
			},
			{ skipNull: true }
		);
	}
};
