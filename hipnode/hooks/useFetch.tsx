import { useQuery } from '@tanstack/react-query';

export default function useFetch<T>(
	queryKey: string,
	cb: () => T,
	enabled: boolean
) {
	const { data, isError, isLoading, error, refetch } = useQuery({
		queryKey: [queryKey],
		queryFn: cb,
		enabled,
	});

	return { data, isError, isLoading, error, refetch };
}
