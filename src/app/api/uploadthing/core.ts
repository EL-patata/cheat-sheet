import { db } from '@/db';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { currentUser } from '@clerk/nextjs/server';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { Pinecone } from '@pinecone-database/pinecone';
import { pinecone } from '@/lib/pinecone';

const f = createUploadthing();

export const ourFileRouter = {
	pdfUploader: f({ pdf: { maxFileSize: '4MB' } })
		.middleware(async () => {
			const user = await currentUser();

			if (!user || !user?.id) throw new Error('Unauthorized');

			return { userId: user?.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			const createdFile = await db?.file?.create({
				data: {
					key: file.key,
					name: file.name,
					userId: metadata.userId,
					url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
					uploadStatus: 'PROCESSING',
				},
			});

			try {
				const response = await fetch(
					`https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`
				);

				const blob = await response.blob();
				console.log(blob);

				const loader = new PDFLoader(blob);

				const pageLevelDocs = await loader.load();

				const pagesAmt = pageLevelDocs.length;

				const pineconeIndex = pinecone.Index('cheat');

				const embeddings = new OpenAIEmbeddings({
					openAIApiKey: process.env.OPENAI_API_KEY!,
				});

				await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
					pineconeIndex: pineconeIndex,
				});

				await db.file.update({
					data: {
						uploadStatus: 'SUCCESS',
					},
					where: {
						id: createdFile.id,
					},
				});
			} catch (err) {
				console.log(err);

				await db.file.update({
					data: {
						uploadStatus: 'FAILED',
					},
					where: {
						id: createdFile.id,
					},
				});
			}
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
