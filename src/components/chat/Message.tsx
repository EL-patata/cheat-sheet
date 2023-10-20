import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { forwardRef } from 'react';
import { User } from 'lucide-react';
import Image from 'next/image';
import { AppRouter } from '@/trpc';
import { inferRouterOutputs } from '@trpc/server';

type RouterOutput = inferRouterOutputs<AppRouter>;

type Messages = RouterOutput['getFileMessages']['messages'];

type OmitText = Omit<Messages[number], 'text'>;

type ExtendedText = {
	text: string | JSX.Element;
};

type ExtendedMessage = OmitText & ExtendedText;

type Props = {
	message: ExtendedMessage;
	userImage: string;
	isNextMessageFromTheSameUser: boolean;
};

const Message = forwardRef<HTMLDivElement, Props>(
	({ message, isNextMessageFromTheSameUser, userImage }, ref) => {
		return (
			<div
				ref={ref}
				className={cn('flex items-end pointer-events-none', {
					'justify-end': message.isUserMessage,
				})}
			>
				<div
					className={cn(
						'relative flex h-6 w-6 aspect-square items-center justify-center',
						{
							'order-2 rounded-sm': message.isUserMessage,
							'order-1 bg-gradient-to-tr from-orange-600 to-primary rounded-sm':
								!message.isUserMessage,
							invisible: isNextMessageFromTheSameUser,
						}
					)}
				>
					{message.isUserMessage ? (
						<Image
							alt="chat user profile picture"
							src={userImage}
							height={24}
							width={24}
							className="rounded-sm"
						/>
					) : (
						<Image
							alt="logo chat"
							src={`/logo.ico`}
							height={24}
							width={24}
							className="invert"
						/>
					)}
				</div>

				<div
					className={cn('flex flex-col space-y-2 text-base max-w-md mx-2', {
						'order-1 items-end': message.isUserMessage,
						'order-2 items-start': !message.isUserMessage,
					})}
				>
					<div
						className={cn('px-4 py-2 rounded-lg inline-block', {
							'bg-primary text-white': message.isUserMessage,
							'bg-accent': !message.isUserMessage,
							'rounded-br-none':
								!isNextMessageFromTheSameUser && message.isUserMessage,
							'rounded-bl-none':
								!isNextMessageFromTheSameUser && !message.isUserMessage,
						})}
					>
						{typeof message.text === 'string' ? (
							<ReactMarkdown
								className={cn('prose', {
									'text-zinc-50': message.isUserMessage,
								})}
							>
								{message.text}
							</ReactMarkdown>
						) : (
							message.text
						)}
						{message.id !== 'loading-message' ? (
							<div
								className={cn('text-xs select-none mt-2 w-full text-right', {
									'text-muted-foreground': !message.isUserMessage,
									'text-red-200': message.isUserMessage,
								})}
							>
								{format(new Date(message.createdAt), 'HH:mm')}
							</div>
						) : null}
					</div>
				</div>
			</div>
		);
	}
);

Message.displayName = 'Message';

export default Message;
