'use client';
import { FC, useState } from 'react';
import UploadButton from './UploadButton';
import { trpc } from '@/app/_trpc/client';
import { FolderOpen, Loader2, MessageSquare, Plus, Trash } from 'lucide-react';
import Link from 'next/link';

import { format } from 'date-fns';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';

type Props = {};

const Dashboard: FC<Props> = ({}) => {
	const [deletingFile, setDeletingFile] = useState<string | null>(null);

	const utils = trpc.useContext();

	const { data, isLoading } = trpc.getUserFiles.useQuery();

	const { mutate: deleteFile } = trpc.deleteFile.useMutation({
		onMutate: ({ id }) => {
			setDeletingFile(id);
		},
		onSuccess: () => {
			utils.getUserFiles.invalidate();
			return toast({ title: 'File deleted successfully.', duration: 5000 });
		},
		onSettled: () => {
			setDeletingFile(null);
		},
	});

	return (
		<main className="mx-auto max-w-7xl p-4 md:p-10">
			<header className="flex items-center justify-between">
				<h1 className="text-4xl font-bold">My files</h1>
				<UploadButton />
			</header>
			{data && data?.length !== 0 ? (
				<ul className="grid mt-8 lg:grid-cols-3 gap-6">
					{data?.map((file) => (
						<li
							key={file.id}
							className="list-none col-span-1 divide-y divide-secondary rounded-lg bg-background shadow hover:shadow-lg transition-all"
						>
							<Link
								href={`/dashboard/${file.id}`}
								className="flex flex-col gap2"
							>
								<div className="p-6 pb-0 flex w-full items-center justify-between gap-2">
									<div className="w-10 aspect-square flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"></div>
									<div className="flex-1 truncate">
										<div className="flex items-center space-x-3 ">
											<h3 className="truncate text-lg font-medium ">
												{file.name}
											</h3>
										</div>
									</div>
								</div>
							</Link>
							<div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-muted-foreground">
								<p className="flex items-center">
									<Plus className="w-4 aspect-square" />
									{format(new Date(file.createdAt), 'dd MMM yyyy')}
								</p>
								<p className={`flex items-center gap-2 `}>
									<MessageSquare className="w-4 aspect-square" />
									{file.uploadStatus}
								</p>
								<Button
									size={'icon'}
									variant={'destructive'}
									onClick={() => deleteFile({ id: file.id })}
								>
									{deletingFile === file.id ? (
										<Loader2 className="animate-spin" />
									) : (
										<Trash />
									)}
								</Button>
							</div>
						</li>
					))}
				</ul>
			) : isLoading ? (
				<Loader2 className="animate-spin mx-auto mt-8" />
			) : (
				<h3 className="mt-16 flex flex-col items-center gap-2 ">
					<FolderOpen /> No files to show here.{' '}
					<p className="text-muted-foreground">
						Upload a PDF file to show it here.
					</p>
				</h3>
			)}
		</main>
	);
};

export default Dashboard;
