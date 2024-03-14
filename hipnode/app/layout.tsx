import './globals.css';

import { Source_Sans_3 as SourceSans3 } from 'next/font/google';
import type { ReactNode } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import NextTopLoader from 'nextjs-toploader';

import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/providers/theme-provider';
import ReactQueryProvider from '@/providers/react-query-provider';

const sourceSansPro = SourceSans3({
	subsets: ['latin'],
	variable: '--font-source-sans',
	weight: ['700', '600', '400'],
	preload: true,
	fallback: ['sans-serif'],
});

export const metadata = {
	title: 'Snaply - Social Media Platform',
	description: 'Social Media Web Application',
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang='en'>
			<ClerkProvider>
				<body
					className={`${sourceSansPro.className} bg-white-800 dark:bg-primary-dark w-full`}
				>
					<ReactQueryProvider>
						<ThemeProvider
							attribute='class'
							defaultTheme='light'
							enableSystem={false}
							disableTransitionOnChange
						>
							{children}
							<Toaster />
							<NextTopLoader showSpinner={false} color='#2FA8F2' />
						</ThemeProvider>
					</ReactQueryProvider>
				</body>
			</ClerkProvider>
		</html>
	);
}
