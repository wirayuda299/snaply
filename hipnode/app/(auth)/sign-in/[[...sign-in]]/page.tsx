import { SideContent } from '@/components/index';
import { signInContents } from '@/constants';
import AuthForm from '@/components/shared/forms/auth/auth';

export default function Signin() {
	return (
		<>
			<SideContent
				position='left'
				title='Sign in to Snaply.'
				contents={signInContents}
			/>
			<div className='dark:bg-primary-dark flex w-[800px] items-center justify-center py-10 max-lg:w-full'>
				<AuthForm type='signin' />
			</div>
		</>
	);
}
