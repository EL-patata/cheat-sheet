import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { SignIn } from '@clerk/nextjs';

export default function Page() {
	return (
		<MaxWidthWrapper className="flex items-center justify-center min-h-[90vh]">
			<SignIn />
		</MaxWidthWrapper>
	);
}
