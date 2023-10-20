'use client';
import {
	ChevronDown,
	ChevronUp,
	Loader2,
	RotateCw,
	ZoomIn,
} from 'lucide-react';
import { FC, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { toast } from '../ui/use-toast';
import { useResizeDetector } from 'react-resize-detector';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { cn } from '@/lib/utils';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import SimpleBar from 'simplebar-react';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import PDFFullscreen from './PDFFullscreen';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type Props = {
	url: string;
};

const PDFview: FC<Props> = ({ url }) => {
	const { ref, width } = useResizeDetector();

	const CustomPageValidator = z.object({
		page: z.string().refine((num) => Number(num) > 0 && Number(num) <= pages!),
	});

	type TypeCustomPageValidator = z.infer<typeof CustomPageValidator>;

	const {
		formState: { errors },
		handleSubmit,
		register,
		setValue,
	} = useForm<TypeCustomPageValidator>({
		defaultValues: {
			page: '1',
		},
		resolver: zodResolver(CustomPageValidator),
	});

	const [pages, setPages] = useState<number>();
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [scale, setScale] = useState<number>(1);
	const [rotation, setRotation] = useState<number>(0);
	const [renderedScale, setRenderedScale] = useState<number | null>(null);

	const isLoading = renderedScale !== scale;

	function changePageNumber(num: number) {
		let toPage =
			currentPage + num > pages!
				? pages
				: currentPage + num < 1
				? 1
				: currentPage + num;

		setCurrentPage(toPage!);
		setValue('page', String(toPage));
	}

	function inputChangePageNumber({ page }: TypeCustomPageValidator) {
		setCurrentPage(Number(page));
		setValue('page', String(page));
	}
	return (
		<section className="bg-white shadow-md">
			<header className="h-14 w-full border-b border-border px-2 flex items-center gap-2">
				<Button
					variant={`ghost`}
					size={'icon'}
					aria-label="previous page"
					disabled={currentPage === 1 || pages === undefined}
					onClick={() => changePageNumber(-1)}
				>
					<ChevronDown className="w-6 aspect-square" />
				</Button>
				<div className="flex items-center gap-1">
					<Input
						{...register('page')}
						className={cn(
							'w-8 h-8 text-end',
							pages! > 9 && 'w-12',
							errors.page && 'focus-visible:ring-red-500'
						)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								handleSubmit(inputChangePageNumber)();
							}
						}}
					/>
					<p className="text-muted-foreground text-sm space-x-1">
						<span>/</span>
						<span>{pages}</span>
					</p>
				</div>
				<Button
					variant={`ghost`}
					size={'icon'}
					aria-label="next page"
					disabled={currentPage === pages || pages === undefined}
					onClick={() => changePageNumber(1)}
				>
					<ChevronUp className="w-6 aspect-square" />
				</Button>
				<div className="ml-auto">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant={'ghost'} className="rounded gap-2">
								<ZoomIn className="w-5 aspect-square" />
								{scale * 100}%
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem defaultChecked onSelect={() => setScale(0.5)}>
								50%
							</DropdownMenuItem>
							<DropdownMenuItem defaultChecked onSelect={() => setScale(0.75)}>
								75%
							</DropdownMenuItem>
							<DropdownMenuItem defaultChecked onSelect={() => setScale(1)}>
								100%
							</DropdownMenuItem>
							<DropdownMenuItem onSelect={() => setScale(1.5)}>
								150%
							</DropdownMenuItem>
							<DropdownMenuItem onSelect={() => setScale(2)}>
								200%
							</DropdownMenuItem>
							<DropdownMenuItem onSelect={() => setScale(2.5)}>
								250%
							</DropdownMenuItem>
							<DropdownMenuItem onSelect={() => setScale(3)}>
								300%
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<Button
						size={'icon'}
						variant={'ghost'}
						onClick={() => setRotation((prev) => (prev === 0 ? 90 : 0))}
						aria-label="rotate PDF"
					>
						<RotateCw
							className={cn(
								'w-4 aspect-square transition-all',
								rotation === 90 && 'rotate-[240deg]'
							)}
						/>
					</Button>
					<PDFFullscreen url={url} />
				</div>
			</header>
			<SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)]">
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
						{isLoading && renderedScale ? (
							<Page
								width={width ? width : 1}
								pageNumber={currentPage}
								scale={scale}
								rotate={rotation}
								key={'@' + renderedScale}
							/>
						) : null}

						<Page
							className={cn(
								isLoading ? 'hidden' : 'flex justify-center items-center'
							)}
							width={width ? width : 1}
							pageNumber={currentPage}
							scale={scale}
							rotate={rotation}
							key={'@' + scale}
							loading={
								<div className="flex justify-center">
									<Loader2 className="my-24 h-6 w-6 animate-spin" />
								</div>
							}
							onRenderSuccess={() => setRenderedScale(scale)}
						/>
					</Document>
				</div>
			</SimpleBar>
		</section>
	);
};

export default PDFview;
