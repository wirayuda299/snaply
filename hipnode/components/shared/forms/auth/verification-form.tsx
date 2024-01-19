import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Dispatch, FormEvent, SetStateAction } from 'react';

type VerificationFormType = {
	code: string;
	setCode: Dispatch<SetStateAction<string>>;
	onPressVerify: (e: FormEvent) => Promise<void>;
	loading: boolean;
};

export default function VerificationForm({
	code,
	setCode,
	onPressVerify,
	loading,
}: VerificationFormType) {
	return (
		<form onSubmit={onPressVerify} className='flex items-center gap-3'>
			<Input
				value={code}
				onChange={(e) => setCode(e.target.value)}
				placeholder='Code...'
				autoFocus
				className='text-secondary dark:bg-secondary-dark-2 dark:text-secondary-light mt-3 min-h-[48px] w-full rounded-lg border-none bg-white px-5 py-3 text-base ring-offset-0 focus:border-none focus:outline-none focus-visible:ring-0 md:min-h-[60px]'
			/>
			<Button type='submit' disabled={loading}>
				{loading ? 'Verifying...' : 'Verify Email'}
			</Button>
		</form>
	);
}
