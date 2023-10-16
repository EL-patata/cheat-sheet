import { cn } from '@/lib/utils';
import { AppRouter } from '@/trpc';
import { inferRouterOutputs } from '@trpc/server';
import { File } from 'lucide-react';
import Image from 'next/image';
import { FC } from 'react';
import ReactMarkDown from 'react-markdown';
import { format } from 'date-fns';

type RouterOutput = inferRouterOutputs<AppRouter>;

type Messages = RouterOutput['getFileMessages']['messages'];

type OmitText = Omit<Messages[number], 'text'>;

type ExtendedText = {
	text: string | JSX.Element;
};

type ExtendedMessage = OmitText & ExtendedText;

type Props = {
	message: ExtendedMessage;
	isNextMessageFromTheSameUser: boolean;
	userImage: string;
};

const Message: FC<Props> = ({
	isNextMessageFromTheSameUser,
	message,
	userImage,
}) => {
	return (
		<li
			className={cn('flex items-end', { 'justify-end': message.isUserMessage })}
		>
			<div
				className={cn(
					'relative flex w-6 aspect-square items-center justify-center',
					{
						'order-2': message.isUserMessage,
						'order-1': !message.isUserMessage,
						invisible: isNextMessageFromTheSameUser,
					}
				)}
			>
				{message.isUserMessage ? (
					<Image
						src={userImage}
						height={24}
						width={24}
						alt=""
						className="rounded-full"
					/>
				) : (
					<Image
						src={`/logo.ico`}
						height={24}
						width={24}
						alt=""
						className="rounded-sm bg-primary/50"
					/>
				)}
			</div>
			<div
				className={cn('flex flex-col space-y-2 text-base max-w-md mx-2', {
					'order-1 items-end': message?.isUserMessage,
					'order-2 items-start': !message.isUserMessage,
				})}
			>
				<p
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
						<ReactMarkDown>{message?.text}</ReactMarkDown>
					) : (
						message.text
					)}
					{message.id !== 'loading-message' ? (
						<span
							className={cn(
								`block text-xs select-none mt-2 w-full text-right`,
								{
									'text-muted-foreground': !message.isUserMessage,
									'text-white': message.isUserMessage,
								}
							)}
						>
							{format(new Date(message?.createdAt), 'HH:mm')}
						</span>
					) : null}
				</p>
			</div>
		</li>
	);
};

export default Message;
