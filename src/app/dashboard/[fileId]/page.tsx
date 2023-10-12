import ChatView from '@/components/ChatView';
import PDFview from '@/components/PDFView';
import { db } from '@/db';
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

	return (
		<main className=" lg:grid lg:grid-cols-[60%,40%] gap-6 md:p-10 max-h-[75vh]">
			<PDFview url={file?.url!} />
			<ChatView />
		</main>
	);
};

export default page;
