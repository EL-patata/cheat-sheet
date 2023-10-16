'use client';
import { trpc } from '@/app/_trpc/client';
import { Loader2, MessageSquare } from 'lucide-react';
import { FC } from 'react';
import Message from './Message';
import { Skeleton } from '../ui/skeleton';
import { User } from '@clerk/nextjs/server';
import { useChat } from './context/ChatProvider';

type Props = { fileId: string; user: User };

export const INFINITE_QUERY_LIMIT = 10;

const Messages: FC<Props> = ({ fileId, user }) => {
	const { isLoading: isAiLoading } = useChat();

	const { data, isLoading, fetchNextPage } =
		trpc.getFileMessages.useInfiniteQuery(
			{
				fileId,
				limit: INFINITE_QUERY_LIMIT,
			},
			{
				getNextPageParam: (lastPage) => lastPage?.nextCursor,
				keepPreviousData: true,
			}
		);

	const messages = data?.pages.flatMap((page) => page?.messages);

	const loadingMessage = {
		createdAt: new Date().toISOString(),
		id: 'loading-message',
		isUserMessage: false,
		text: (
			<span className="flex h-full items items-center justify-center">
				<Loader2 className="w-4 aspect-square animate-spin" />
			</span>
		),
	};

	const combinedMessages = [
		...(isAiLoading ? [loadingMessage] : []),
		...(messages ?? []),
	];

	return (
		<section className="flex max-h-[calc(100vh-10.5rem)] border-border flex-col-reverse gap-4 flex-1 p-3 overflow-y-auto scrollbar-thumb-rounded scrollbar-w-2 scrolling-touch scrollbar-thumb-blue">
			{combinedMessages && combinedMessages.length > 0 ? (
				combinedMessages.map((message, i) => {
					const isNextMessageFromTheSameUser =
						combinedMessages[i - 1]?.isUserMessage ===
						combinedMessages[i]?.isUserMessage;

					if (i === combinedMessages.length - 1) {
						<Message
							isNextMessageFromTheSameUser={isNextMessageFromTheSameUser}
							message={message}
							userImage={user?.imageUrl}
						/>;
					} else
						return (
							<Message
								isNextMessageFromTheSameUser={isNextMessageFromTheSameUser}
								message={message}
								userImage={user?.imageUrl}
							/>
						);
				})
			) : isLoading ? (
				<div className="w-full flex flex-col gap-2">
					<Skeleton className="h-16" />
					<Skeleton className="h-20" />
					<Skeleton className="h-12" />
					<Skeleton className="h-14" />
				</div>
			) : (
				<div className="flex-1 flex flex-col items-center justify-center gap-2">
					<MessageSquare className="text-primary w-8 aspect-square" />
					<h3 className="font-semibold text-xl">You&apos;re all set!</h3>
					<p className="text-muted-foreground">Ask right away.</p>
				</div>
			)}
		</section>
	);
};

export default Messages;
