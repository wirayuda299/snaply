import { useQuery } from '@tanstack/react-query';

export default function useFetch<T>(
	queryKey: string,
	cb: () => T,
	enabled: boolean
) {
	const { data, isError, isLoading, error } = useQuery({
		queryKey: [queryKey],
		queryFn: () => {
			return cb();
		},
		enabled,
	});

	return { data, isError, isLoading, error };
}
