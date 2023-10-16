'use client';
import { FC, useRef } from 'react';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { SendHorizonal } from 'lucide-react';
import { useChat } from './context/ChatProvider';

type Props = {
	disable?: boolean;
};

const ChatInput: FC<Props> = ({ disable }) => {
	const { addMessage, handleInputChange, isLoading, message } = useChat();

	const textareaRef = useRef<HTMLTextAreaElement>(null);

	return (
		<div className="absolute bottom-0 left-0 w-full">
			<form
				onSubmit={(e) => e.preventDefault()}
				className="mx-2 flex gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-2xl xl:max-w-3xl"
			>
				<div className="flex h-full flex-1 items-stretch md:flex-col">
					<div className="relative flex flex-col w-full flex-grow p-4">
						<div className="relative">
							<Textarea
								rows={1}
								maxRows={4}
								autoFocus
								ref={textareaRef}
								onKeyDown={(e) => {
									if (e.key === 'Enter' && !e.shiftKey) {
										e.preventDefault();

										addMessage();

										textareaRef.current?.focus();
									}
								}}
								onChange={handleInputChange}
								value={message}
								placeholder="Ask a question here."
								className="resize-none pr-12 text-base py-3 scrollbar-thumb-blue scrollbar-blue-lighter scrollbar-w-2 scrolling-touch"
							/>
							<Button
								disabled={isLoading}
								onClick={() => addMessage()}
								size={'icon'}
								aria-label="send message"
								className="absolute bottom-1.5 right-2 rounded-full"
							>
								<SendHorizonal />
							</Button>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
};

export default ChatInput;
