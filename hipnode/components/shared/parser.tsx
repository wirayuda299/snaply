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
				'prose prose-slate text-secondary-light prose-p:text-xs pt-3',
				styles
			)}
		>
			{parse(content)}
		</div>
	);
}
