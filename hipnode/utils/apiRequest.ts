import { auth } from '@clerk/nextjs';

export class ApiRequest {
	private readonly serverEndpoint: string = process.env.SERVER_URL!;
	private userId: string | null = null;

	private async getTokenSession() {
		try {
			const { getToken, userId } = auth();

			const token = await getToken();
			if (token === null) {
				throw new Error('Unauthorized');
			}
			this.userId = userId;

			return {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-type': 'application/json',
				},
			};
		} catch (error) {
			throw error;
		}
	}

	async get<T>(query: string, tag?: string) {
		const token = await this.getTokenSession();

		const res = await fetch(this.serverEndpoint + query, {
			method: 'GET',
			headers: token.headers,
			credentials: 'include',
			...(tag && {
				next: {
					tags: [tag],
				},
			}),
		});

		const data = await res.json();

		if (data.error) throw new Error(data.message);
		return data.data as T;
	}

	async post<T, U, K extends Record<string, U>>(
		url: string,
		body: K,
		tag?: string
	) {
		try {
			const token = await this.getTokenSession();

			const res = await fetch(this.serverEndpoint + url, {
				method: 'POST',
				headers: token.headers,
				credentials: 'include',
				...(tag && { next: { tags: [tag] } }),
				body: JSON.stringify(body),
			});

			if (!res.headers.get('content-type')?.includes('application/json')) {
				return;
			}

			const data = await res.json();
			if (data.error) throw new Error(data.message);

			return data.data as T;
		} catch (error) {
			throw error;
		}
	}

	async patch<T, U, K extends Record<string, U>>(
		url: string,
		body: K,
		path?: string,
		tag?: string
	) {
		try {
			const token = await this.getTokenSession();

			const res = await fetch(this.serverEndpoint + url, {
				method: 'PATCH',
				headers: token.headers,
				credentials: 'include',
				...(tag && { next: { tags: [tag] } }),
				body: JSON.stringify(body),
			});

			if (!res.headers.get('content-type')?.includes('application/json')) {
				return;
			}

			const data = await res.json();

			if (data.error) throw new Error(data.message);
			return data.data as T;
		} catch (error) {
			throw error;
		}
	}

	public get getUserId(): string {
		return this.userId as string;
	}
}
