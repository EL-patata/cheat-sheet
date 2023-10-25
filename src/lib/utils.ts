import { type ClassValue, clsx } from 'clsx';
import { Metadata } from 'next';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function constructMetadata({
	title = 'Cheat sheet - the SaaS for PDFs',
	description = 'Cheat sheet is a SaaS to make chatting with your PDF files easy.',
	image = '/thumbnail.png',
	icons = '/favicon.ico',
	noIndex = false,
}: {
	title?: string;
	description?: string;
	image?: string;
	icons?: string;
	noIndex?: boolean;
} = {}): Metadata {
	return {
		title,
		description,
		openGraph: {
			title,
			description,
			images: [{ url: image }],
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: [image],
		},
		icons,
		metadataBase: new URL(`https://cheat-sheet-gohm.vercel.app`),
		themeColor: '#FFF',
		...(noIndex && {
			robots: {
				index: false,
				follow: false,
			},
		}),
	};
}
