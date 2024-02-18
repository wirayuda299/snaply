import type { ReactNode } from 'react';

import { Navbar } from '@/components/index';

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<>
			<Navbar />
			<div className='container h-full'>{children}</div>
		</>
	);
}
