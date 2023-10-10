import ChatView from '@/components/ChatView';
import PDFview from '@/components/PDFView';
import { currentUser } from '@clerk/nextjs';
import { FC } from 'react';

type Props = {
	params: {
		fileId: string;
	};
};

const page: FC<Props> = async ({ params }) => {
	const { fileId } = params;

	const user = await currentUser();

	return (
		<main className="text-black grid grid-cols-[60%,40%] gap-6 md:p-10">
			<PDFview />
			<ChatView />
		</main>
	);
};

export default page;
