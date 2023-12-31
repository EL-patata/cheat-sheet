import { cn, constructMetadata } from '@/lib/utils';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NavBar from '@/components/NavBar';
import Providers from '@/context/Providers';
import { ClerkProvider, currentUser } from '@clerk/nextjs';
import { Toaster } from '@/components/ui/toaster';
import 'simplebar-react/dist/simplebar.min.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = constructMetadata();
export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await currentUser();

	return (
		<ClerkProvider>
			<html lang="en">
				<Providers>
					<body
						className={cn(
							inter.className,
							'min-h-screen font-sans antialiased grainy'
						)}
					>
						<NavBar user={user!} />
						{children}
						<Toaster />
					</body>
				</Providers>
			</html>
		</ClerkProvider>
	);
}
