import { Editor } from '@tinymce/tinymce-react';
import { useTheme } from 'next-themes';
import type { ControllerRenderProps } from 'react-hook-form';

import { CreatePostFormType } from '@/lib/validations';

export default function TextEditor({
	field,
	value,
}: {
	field: ControllerRenderProps<CreatePostFormType>;
	value: string;
}) {
	const { theme } = useTheme();

	return (
		<Editor
			key={theme || 'light'}
			apiKey={process.env.EDITOR_API_KEY}
			initialValue={value}
			onEditorChange={(content) => field.onChange(content)}
			init={{
				skin: theme === 'dark' ? 'oxide-dark' : 'oxide',
				content_css: theme === 'dark' ? 'dark' : 'light',
				setup: function (editor) {
					editor.ui.registry.addButton('Write', {
						icon: 'edit-block',
						text: 'Write',
						onAction: function () {
							return editor.focus();
						},
					});
				},
				height: 500,
				menubar: false,
				plugins: [
					'advlist',
					'autolink',
					'lists',
					'link',
					'image',
					'anchor',
					'searchreplace',
					'code',
					'insertdatetime',
					'media',
					'table',
					'code',
				],
				toolbar:
					'Write preview |' +
					'bold italic underline  forecolor codesample link image alignleft aligncenter alignright alignjustify bullist numlist |',
				content_style:
					'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
			}}
		/>
	);
}
