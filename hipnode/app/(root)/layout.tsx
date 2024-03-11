import type { ReactNode } from 'react';

import { Navbar } from '@/components/index';

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<div className='!no-scrollbar size-full'>
			<Navbar />
			<div className='!no-scrollbar container h-full pt-24'>{children}</div>
		</div>
	);
}
