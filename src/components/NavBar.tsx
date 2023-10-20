import Link from 'next/link';
import MaxWidthWrapper from './MaxWidthWrapper';
import { buttonVariants } from './ui/button';

import { User } from '@clerk/nextjs/server';
import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import { Files } from 'lucide-react';

const Navbar = ({ user }: { user: User }) => {
	return (
		<nav className="sticky flex items-center h-14 inset-x-0 top-0 z-30 w-full border-b border-border bg-white/75 backdrop-blur-lg transition-all">
			<MaxWidthWrapper>
				<div className="flex h-14 items-center justify-between border-b border-border">
					<Link href="/" className="flex z-40 font-semibold gap-1 items-center">
						<span className="bg-gradient-to-tr from-orange-600 to-primary rounded-md w-8 aspect-square flex items-center justify-center">
							<Image
								src="/logo.ico"
								width={25}
								height={25}
								alt="logo"
								className="invert"
							/>
						</span>
						<span>Cheat sheet</span>
					</Link>

					<div className="items-center space-x-4 flex">
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
								<Link
									href="/dashboard"
									className={buttonVariants({ className: 'gap-2' })}
								>
									Dashboard <Files />
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
