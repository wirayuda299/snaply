import { Post, Meetup, Group, Podcast } from '@/types';

type ActionTypes =
	| 'SET_RESULT'
	| 'TOOGLE_OPEN'
	| 'SET_RESPONSE_KEYS'
	| 'TOOGLE_DISABLED';
type SearchResultType = {
	groups: Group[];
	post: Post[];
	podcasts: Podcast[];
	meetups: Meetup[];
};
type StateTypes = {
	disabled: boolean;
	responseKeys: string[];
	searchRes: SearchResultType | null;
	isOpen: boolean;
};

export function reducer(
	state: StateTypes,
	action: { type: ActionTypes; payload: any }
) {
	switch (action.type) {
		case 'SET_RESULT':
			return {
				...state,
				searchRes: action.payload.result,
			};
		case 'TOOGLE_OPEN':
			return {
				...state,
				isOpen: action.payload.isOpen,
			};
		case 'SET_RESPONSE_KEYS':
			return {
				...state,
				responseKeys: action.payload.resKeys,
			};
		case 'TOOGLE_DISABLED':
			return {
				...state,
				disabled: action.payload.disabled,
			};

		default:
			throw new Error('Invalid actions');
	}
}
