import { cn } from '@/lib/utils';
import parse from 'html-react-parser';

export default function Parser({
	content,
	styles,
}: {
	content: string;
	styles?: string;
}) {
	return (
		<div
			className={cn(
				'prose prose-slate text-secondary-light dark:text-white-700 prose-p:text-xs pt-3 prose-ol:text-white-700 prose-ol:dark:text-white-700 prose-ul:text-white-700 prose-ul:dark:text-white-700',
				styles
			)}
		>
			{parse(content)}
		</div>
	);
}
