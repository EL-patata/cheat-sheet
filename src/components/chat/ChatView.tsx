'use client';
import { FC } from 'react';
import Messages from './Messages';
import ChatInput from './ChatInput';
import { trpc } from '@/app/_trpc/client';
import { Loader2 } from 'lucide-react';
import { ChatContextProvider } from './context/ChatContextProvider';
import { User } from '@clerk/nextjs/server';

type Props = {
	fileId: string;
	user: User;
};

const ChatView: FC<Props> = ({ fileId, user }) => {
	const { data, isLoading } = trpc.getFileUploadStatus.useQuery(
		{
			fileId,
		},
		{
			refetchInterval: (data) =>
				data?.status === 'SUCCESS' || data?.status === 'FAILED' ? false : 500,
		}
	);

	if (isLoading)
		return (
			<div className="relative min-h-full bg-background flex divide-y divide-border flex-col justify-between gap-2">
				<div className="flex-1 flex justify-center items-center flex-col mb-28">
					<div className="flex flex-col items-center gap-2">
						<Loader2 className="h-8 w-8 text-primary animate-spin" />
						<h3 className="font-semibold text-xl">Loading...</h3>
						<p className="text-muted-foreground text-sm">
							We&apos;re preparing your PDF.
						</p>
					</div>
				</div>
				<ChatInput disable={true} />
			</div>
		);

	if (data?.status === 'PROCESSING')
		return (
			<div className="relative min-h-full bg-background flex divide-y divide-border flex-col justify-between gap-2">
				<div className="flex-1 flex justify-center items-center flex-col mb-28">
					<div className="flex flex-col items-center gap-2">
						<Loader2 className="aspect-square w-8 text-primary animate-spin" />
						<h3 className="font-semibold text-xl">Proccessing the PDF...</h3>
						<p className="text-muted-foreground text-sm">
							This won&apos;t take long.
						</p>
					</div>
				</div>
				<ChatInput disable={true} />
			</div>
		);

	return (
		<ChatContextProvider fileId={fileId}>
			<section className="min-h-full relative bg-background divide-border flex flex-col  shadow-md pb-6">
				<div className=" flex flex-col justify-between basis-11/12">
					<Messages fileId={fileId} user={user} />
				</div>
				<ChatInput />
			</section>
		</ChatContextProvider>
	);
};

export default ChatView;
