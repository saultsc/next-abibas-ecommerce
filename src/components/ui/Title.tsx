import { titleFonts } from '@/config/fonts';
import Link from 'next/link';
import { IoChevronBack } from 'react-icons/io5';

interface Props {
	title: string;
	subTitle?: string;
	clssName?: string;
	backUrl?: string;
}

export const Title = ({ title, subTitle, clssName, backUrl }: Props) => {
	return (
		<div className={`mt-3 ${clssName}`}>
			<h1 className={`${titleFonts.className} antialiased text-4xl font-semibold my-7 mb-1`}>
				{title}
			</h1>

			{backUrl && (
				<Link
					href={backUrl}
					className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-800 transition-all text-sm hover:gap-0.5 mb-8">
					<IoChevronBack className="size-4" />
					<span>Volver</span>
				</Link>
			)}

			{subTitle && <h3 className="text-xl mb-6">{subTitle}</h3>}
		</div>
	);
};
