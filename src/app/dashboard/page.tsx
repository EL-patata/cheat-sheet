import Dashboard from '@/components/Dashboard';
import { db } from '@/db';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { FC } from 'react';

type Props = {};

const page: FC<Props> = async ({}) => {
	const user = await currentUser();

	if (!user) redirect('/sign-in');

	const dbUser = await db.user.findFirst({
		where: {
			id: user?.id,
		},
	});

	if (!dbUser) {
		await db.user.create({
			data: {
				id: user.id,
				email: user.emailAddresses[0].emailAddress,
			},
		});
	}

	return <Dashboard />;
};

export default page;
