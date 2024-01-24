import { getMeetupById } from '@/lib/actions/meetup.action';

type Props = {
	params: {
		id: string;
	};
};
export const dynamic = 'force-dynamic';

export default async function MeetupDetail(props: Props) {
	const meetup = await getMeetupById(props.params.id);

	return <div>{JSON.stringify(props)}</div>;
}
