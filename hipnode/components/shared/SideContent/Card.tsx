import { cn } from '@/lib/utils';

type ContentCardProps = {
	background: string;
	icon?: string;
	alt?: string;
	text: string;
	position: 'left' | 'right';
	cardBg: string;
};

export default function ContentCard({
	background,
	cardBg,
	position,
	text,
	alt,
	icon,
}: ContentCardProps) {
	return (
		<div
			className={cn(
				`group flex h-full w-full max-w-[600px] items-center justify-start gap-6 rounded-lg bg-white p-5 dark:bg-secondary-dark-2 ${
					position === 'right' ? 'hover:!bg-secondary-red-60' : ''
				}`,
				cardBg
			)}
		>
			<p
				className={`text-secondary-dark-2 dark:text-white-800 text-sm font-semibold  leading-5 md:text-lg ${
					position === 'right' ? 'group-hover:text-white' : ''
				}`}
			>
				{text}
			</p>
		</div>
	);
}
