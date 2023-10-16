import ChatView from '@/components/chat/ChatView';
import PDFview from '@/components/pdf/PDFView';
import { db } from '@/db';
import { currentUser } from '@clerk/nextjs';
import { FC } from 'react';

type Props = {
	params: {
		fileId: string;
	};
};

const page: FC<Props> = async ({ params }) => {
	const { fileId } = params;

	const file = await db.file.findFirst({
		where: {
			id: fileId,
		},
	});

	const user = await currentUser();

	return (
		<main className=" lg:grid lg:grid-cols-[60%,40%] gap-6 md:p-10 max-h-[75vh]">
			<PDFview url={file?.url!} />
			<ChatView fileId={file?.id!} user={user!} />
		</main>
	);
};

export default page;
