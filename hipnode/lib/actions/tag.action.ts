import { Tag } from '@/types';
import { fetchConfig } from '../utils';

export async function getAllTags() {
	try {
		const res = await fetchConfig('/tags/all-tags', ['tags'], 'GET');
		return res.data as Tag[];
	} catch (error) {
		throw error;
	}
}
