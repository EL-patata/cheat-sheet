import z from 'zod';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { currentUser } from '@clerk/nextjs';
import { NextRequest } from 'next/server';
import { db } from '@/db';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { pinecone } from '@/lib/pinecone';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { openai } from '@/lib/openai';

export async function POST(req: NextRequest) {
	const sendMessageValidator = z.object({
		fileId: z.string(),
		message: z.string(),
	});

	const body = await req.json();

	const user = await currentUser();

	const userId = user?.id;

	if (!userId) new Response('Unauthorized', { status: 401 });

	const { fileId, message } = sendMessageValidator.parse(body);

	const file = await db.file.findFirst({
		where: {
			id: fileId,
			userId,
		},
	});

	if (!file) new Response('Not found', { status: 404 });

	await db.message.create({
		data: {
			text: message,
			isUserMessage: true,
			userId,
			fileId,
		},
	});

	const embeddings = new OpenAIEmbeddings({
		openAIApiKey: process.env.OPENAI_API_KEY!,
	});

	const pineconeIndex = pinecone.index('cheat');

	const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
		pineconeIndex,
	});

	const results = await vectorStore.similaritySearch(message, 4);

	const previousMessages = await db.message.findMany({
		where: {
			fileId,
		},
		orderBy: {
			createdAt: 'asc',
		},
		take: 6,
	});

	const formattedPreviousMessages = previousMessages.map((message) => ({
		role: message.isUserMessage ? ('user' as const) : ('assistant' as const),
		content: message.text,
	}));

	const response = await openai.chat.completions.create({
		model: 'gpt-3.5-turbo',
		temperature: 0,
		stream: true,
		messages: [
			{
				role: 'system',
				content:
					'Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.',
			},
			{
				role: 'user',
				content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
        
  \n----------------\n
  
  PREVIOUS CONVERSATION:
  ${formattedPreviousMessages.map((message) => {
		if (message.role === 'user') return `User: ${message.content}\n`;
		return `Assistant: ${message.content}\n`;
	})}
  
  \n----------------\n
  
  CONTEXT:
  ${results.map((r) => r.pageContent).join('\n\n')}
  
  USER INPUT: ${message}`,
			},
		],
	});

	const stream = OpenAIStream(response, {
		async onCompletion(completion) {
			await db.message.create({
				data: {
					text: completion,
					isUserMessage: false,
					fileId,
					userId,
				},
			});
		},
	});

	return new StreamingTextResponse(stream);
}
