import { privateProcedure, router } from './trpc';
import { z } from 'zod';
import { db } from '@/db';
import { TRPCError } from '@trpc/server';

export const appRouter = router({
	getUserFiles: privateProcedure.query(async ({ ctx }) => {
		const { userId } = ctx;

		return await db.file.findMany({
			where: {
				userId,
			},
		});
	}),

	getFile: privateProcedure
		.input(z.object({ key: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const { userId } = ctx;

			const file = await db.file.findFirst({
				where: {
					key: input.key,
					userId,
				},
			});

			if (!file) throw new TRPCError({ code: 'NOT_FOUND' });

			return file;
		}),

	deleteFile: privateProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const { userId } = ctx;

			const file = await db.file.findFirst({
				where: {
					id: input.id,
					userId,
				},
			});

			if (!file) throw new TRPCError({ code: 'NOT_FOUND' });

			await db.file.delete({
				where: {
					id: input.id,
				},
			});

			return file;
		}),

	getFileUploadStatus: privateProcedure
		.input(z.object({ fileId: z.string() }))
		.query(async ({ ctx, input }) => {
			const { fileId } = input;
			const { userId } = ctx;

			const file = await db.file.findFirst({
				where: {
					id: fileId,
					userId,
				},
			});

			if (!file) return { status: 'PENDING' as const };

			return { status: file.uploadStatus };
		}),

	getFileMessages: privateProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(100),
				cursor: z.string().nullish(),
				fileId: z.string(),
			})
		)
		.query(async ({ ctx, input }) => {
			const { fileId, limit, cursor } = input;

			const { userId } = ctx;

			const file = await db.file.findFirst({
				where: {
					id: fileId,
					userId,
				},
			});

			if (!file) throw new TRPCError({ code: 'NOT_FOUND' });

			const messages = await db.message.findMany({
				where: {
					fileId,
				},
				orderBy: {
					createdAt: 'desc',
				},
				take: limit + 1,
				cursor: cursor ? { id: cursor } : undefined,
				select: {
					id: true,
					isUserMessage: true,
					createdAt: true,
					text: true,
				},
			});

			let nextCursor: typeof cursor | undefined;

			if (messages.length > limit) {
				const nextItem = messages.pop();

				nextCursor = nextItem?.id;
			}

			return { messages, nextCursor };
		}),
});

export type AppRouter = typeof appRouter;
