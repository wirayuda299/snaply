import { SideContent } from '@/components/index';
import { signupContents } from '@/constants';
import AuthForm from '@/components/shared/forms/auth/auth';

export default function Signup() {
	return (
		<>
			<SideContent
				position='left'
				title='Join a thriving community of entrepreneurs and developers.'
				contents={signupContents}
			/>
			<div className='dark:bg-primary-dark flex w-full items-center justify-center py-10'>
				<AuthForm type='signup' />
			</div>
		</>
	);
}
