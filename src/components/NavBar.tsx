import Link from 'next/link';
import MaxWidthWrapper from './MaxWidthWrapper';
import { buttonVariants } from './ui/button';

import { User } from '@clerk/nextjs/server';
import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';

const Navbar = ({ user }: { user: User }) => {
	return (
		<nav className="sticky flex items-center h-14 inset-x-0 top-0 z-30 w-full border-b border-border bg-white/75 backdrop-blur-lg transition-all">
			<MaxWidthWrapper>
				<div className="flex h-14 items-center justify-between border-b border-border">
					<Link href="/" className="flex z-40 font-semibold gap-1 items-center">
						<span className="bg-primary/50 rounded-full w-10 aspect-square flex items-center justify-center">
							<Image src="/logo.ico" width={30} height={30} alt="logo" />
						</span>
						<span>Cheat sheet</span>
					</Link>

					<div className="hidden items-center space-x-4 sm:flex">
						{!user ? (
							<>
								<Link
									href={`sign-in`}
									className={buttonVariants({
										size: 'sm',
										className: 'min-w-[88px]',
									})}
								>
									Sign in
								</Link>
							</>
						) : (
							<>
								<Link href="/dashboard" className={buttonVariants({})}>
									Dashboard
								</Link>

								<UserButton afterSignOutUrl="/sign-in" />
							</>
						)}
					</div>
				</div>
			</MaxWidthWrapper>
		</nav>
	);
};

export default Navbar;
