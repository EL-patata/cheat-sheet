'use client';
import { SendHorizonal } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { useRef } from 'react';
import { useChat } from './context/ChatContextProvider';

type ChatInputProps = {
	disable?: boolean;
};

const ChatInput = ({ disable }: ChatInputProps) => {
	const { addMessage, handleInputChange, isLoading, message } = useChat();

	const textareaRef = useRef<HTMLTextAreaElement>(null);

	return (
		<div className="relative my-1 mx-3">
			<Textarea
				rows={1}
				ref={textareaRef}
				maxRows={4}
				autoFocus
				onChange={handleInputChange}
				value={message}
				onKeyDown={(e) => {
					if (e.key === 'Enter' && !e.shiftKey) {
						if (message.length === 0) return;

						e.preventDefault();

						addMessage();

						textareaRef.current?.focus();
					}
				}}
				placeholder="Enter your question..."
				className="resize-none pr-12 text-base py-3 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
			/>

			<Button
				disabled={isLoading || disable || message.length === 0}
				className="absolute rounded-full bottom-1.5 right-[8px]"
				aria-label="send message"
				size={'icon'}
				onClick={() => {
					addMessage();

					textareaRef.current?.focus();
				}}
			>
				<SendHorizonal className="h-4 w-4" />
			</Button>
		</div>
	);
};

export default ChatInput;
