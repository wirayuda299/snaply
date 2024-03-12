export function formattedPathname(endpoint: string) {
	const date = new Date();
	const formattedDate = date.toISOString().split('T')[0].replace(/-/g, '-');
	const pathname = `/${endpoint}-${formattedDate}`;
	return pathname;
}
