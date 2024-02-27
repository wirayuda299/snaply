import type { ReactNode } from 'react';

import { introductionItems } from '@/constants/questionaire';
import Contents from '@/components/shared/SideContent/SideContent';

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<section className='container mx-auto flex min-h-screen w-full flex-col lg:flex-row'>
			<aside className='top-0 h-screen w-full lg:sticky'>
				<Contents
					position='left'
					contents={introductionItems}
					title='Tell us a little about yourself!'
				/>
			</aside>
			{children}
		</section>
	);
}
