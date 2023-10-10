import Link from 'next/link';
import MaxWidthWrapper from './MaxWidthWrapper';
import { buttonVariants } from './ui/button';

import { User } from '@clerk/nextjs/server';
import { SignInButton, UserButton } from '@clerk/nextjs';

const Navbar = ({ user }: { user: User }) => {
	return (
		<nav className="sticky flex items-center h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
			<MaxWidthWrapper>
				<div className="flex h-14 items-center justify-between border-b border-zinc-200">
					<Link href="/" className="flex z-40 font-semibold">
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
								<Link
									href="/dashboard"
									className={buttonVariants({
										size: 'sm',
									})}
								>
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
