import { trpc } from '@/app/_trpc/client';
import { Loader2, MessageSquare } from 'lucide-react';
import Message from './Message';
import { useEffect, useRef } from 'react';
import { useIntersection } from '@mantine/hooks';
import { Skeleton } from '../ui/skeleton';
import { useChat } from './context/ChatContextProvider';
import { User } from '@clerk/nextjs/server';

type Props = {
	user?: User;
	fileId: string;
};

const INFINITE_QUERY_LIMIT = 10;

const Messages = ({ fileId, user }: Props) => {
	const { isLoading: isAiThinking } = useChat();

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

	const messages = data?.pages.flatMap((page) => page.messages);

	const loadingMessage = {
		createdAt: new Date().toISOString(),
		id: 'loading-message',
		isUserMessage: false,
		text: (
			<span className="flex h-full items-center justify-center bg-background">
				<Loader2 className="h-4 w-4 animate-spin" />
			</span>
		),
	};

	const combinedMessages = [
		...(isAiThinking ? [loadingMessage] : []),
		...(messages ?? []),
	];

	const lastMessageRef = useRef<HTMLDivElement>(null);

	const { ref, entry } = useIntersection({
		root: lastMessageRef.current,
		threshold: 1,
	});

	useEffect(() => {
		if (entry?.isIntersecting) {
			fetchNextPage();
		}
	}, [entry, fetchNextPage]);

	return (
		<div className="flex max-h-[calc(100vh-10.5rem)] bg-background border-border flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
			{combinedMessages && combinedMessages.length > 0 ? (
				combinedMessages.map((message, i) => {
					const isNextMessageFromTheSameUser =
						combinedMessages[i - 1]?.isUserMessage ===
						combinedMessages[i]?.isUserMessage;

					if (i === combinedMessages.length - 1) {
						return (
							<Message
								userImage={user?.imageUrl!}
								ref={ref}
								message={message}
								isNextMessageFromTheSameUser={isNextMessageFromTheSameUser}
								key={message.id}
							/>
						);
					} else
						return (
							<Message
								userImage={user?.imageUrl!}
								message={message}
								isNextMessageFromTheSameUser={isNextMessageFromTheSameUser}
								key={message.id}
							/>
						);
				})
			) : isLoading ? (
				<div className="w-full flex flex-col gap-2">
					<Skeleton className="h-16" />
					<Skeleton className="h-16" />
					<Skeleton className="h-16" />
					<Skeleton className="h-16" />
				</div>
			) : (
				<div className="flex-1 flex flex-col items-center justify-center gap-2">
					<MessageSquare className="h-8 w-8 text-primary" />
					<h3 className="font-semibold text-xl">You&apos;re all set!</h3>
					<p className="text-muted-foreground text-sm">
						Ask your first question to get started.
					</p>
				</div>
			)}
		</div>
	);
};

export default Messages;
