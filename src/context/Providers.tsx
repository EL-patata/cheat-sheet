'use client';
import React, { FC, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc } from '@/app/_trpc/client';
import { httpBatchLink } from '@trpc/client';

type Props = {
	children: React.ReactNode;
};

const env = process.env.NODE_ENV;

const Providers: FC<Props> = ({ children }) => {
	const [queryClient] = useState(() => new QueryClient());
	const [trpcClient] = useState(() =>
		trpc.createClient({
			links: [
				httpBatchLink({
					url: `${
						env === 'development'
							? process.env.NEXT_PUBLIC_DEV_BASE_URL!
							: process.env.NEXT_PUBLIC_BUILD_BASE_URL!
					}/api/trpc`,
				}),
			],
		})
	);

	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</trpc.Provider>
	);
};

export default Providers;
