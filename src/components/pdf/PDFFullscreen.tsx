'use client';

import { FC, useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Expand, Loader2 } from 'lucide-react';
import SimpleBar from 'simplebar-react';
import { toast } from '../ui/use-toast';
import { Document, Page } from 'react-pdf';
import { useResizeDetector } from 'react-resize-detector';

type Props = {
	url: string;
};

const PDFFullscreen: FC<Props> = ({ url }) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [pages, setPages] = useState<number>();
	const { ref, width } = useResizeDetector();

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(v) => {
				if (!v) {
					setIsOpen(v);
				}
			}}
		>
			<DialogTrigger onClick={() => setIsOpen(true)} asChild>
				<Button size="icon" variant="ghost">
					<Expand className="w-4 aspect-square" />
				</Button>
			</DialogTrigger>

			<DialogContent className="max-w-7xl w-full">
				<SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)] mt-6">
					<div ref={ref} className="w-full">
						<Document
							loading={
								<div className="flex justify-center">
									<Loader2 className="mt-24 animate-spin w-8 aspect-square" />
								</div>
							}
							onLoadSuccess={({ numPages }) => {
								setPages(numPages ?? 'x');
							}}
							onLoadError={() =>
								toast({
									title: 'Error in loading',
									description: 'Please try again later.',
									variant: 'destructive',
								})
							}
							file={url}
							className={'w-full h-full'}
						>
							{new Array(pages).fill(0).map((_, i) => (
								<Page key={i} pageNumber={i + 1} width={width ? width : 1} />
							))}
						</Document>
					</div>
				</SimpleBar>
			</DialogContent>
		</Dialog>
	);
};

export default PDFFullscreen;
