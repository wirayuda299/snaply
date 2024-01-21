'use client';

import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { CreatePostFormType, createPostSchema } from '@/lib/validations';
import GroupSelectContent from './GroupSelectContent';
import { createPost } from '@/lib/actions/post.action';
import { uploadImageToS3 } from '@/lib/aws/upload';
import { createPostData } from '@/constants/create-post';
import useUploadFile from '@/hooks/useUploadFile';
import { createMeetup } from '@/lib/actions/meetup.action';
import TagInput from './TagInput';
import { Group } from '@/types';

const CreatePost = ({ groups }: { groups: Group[] }) => {
	const [loading, setLoading] = useState<boolean>(false);
	const params = useSearchParams();
	const form = useForm<CreatePostFormType>({
		resolver: zodResolver(createPostSchema),
		defaultValues: {
			title: params.get('title') ?? '',
			tags: [],
			createType: 'post',
			post: '',
			postImage: '',
			country: '',
			address: '',
			companyName: '',
			date: '',
		},
	});
	const { theme } = useTheme();
	const router = useRouter();

	const { handleChange, isChecking, preview, files } = useUploadFile(form);

	const onSubmit = async (values: CreatePostFormType) => {
		const { createType, group, post, tags, title, address, companyName, date } =
			values;

		setLoading(true);

		try {
			switch (createType) {
				case 'post':
					if (files && files.postImage) {
						const postImage = await uploadImageToS3(files.postImage);

						await createPost({
							group: group?.id,
							image: postImage?.Location!,
							tags,
							title,
							body: post,
						});
						toast('Your Post has been uploaded🎉');
						router.push('/');
					}
					break;

				case 'meetup':
					if (files && files.postImage) {
						const image = await uploadImageToS3(files.postImage);
						await createMeetup({
							address,
							image: image?.Location!,
							companyName,
							date,
							title,
							tags,
							body: post,
						}).then(() => {
							toast('Meetup event has been uploaded🎉');
							router.push('/meetups');
						});
					}
					break;

				case 'interviews':
					// implement your create meetup here
					break;
				case 'podcasts':
					// implement your create podcasts here
					break;
				default:
					throw new Error('Invalid action');
			}
		} catch (error) {
			if (error instanceof Error) {
				toast(error.message);
			}
		} finally {
			setLoading(false);
		}
	};

	const type = form.watch('createType');
	const group = form.watch('group');

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='w-full space-y-8 p-4'
			>
				<FormField
					control={form.control}
					name='title'
					render={({ field }) => (
						<FormItem>
							<FormControl className=''>
								<Input
									placeholder='Title...'
									{...field}
									className='text-secondary dark:bg-secondary-dark-2 min-h-[48px] rounded-lg border-none bg-white px-5 py-3 text-base md:min-h-[60px]'
								/>
							</FormControl>
							<FormMessage className='text-xs text-red-600' />
						</FormItem>
					)}
				/>

				<div className='flex gap-5'>
					<FormField
						control={form.control}
						name='postImage'
						render={() => (
							<FormItem className='w-fit max-sm:w-full'>
								<FormLabel
									aria-disabled={isChecking.postImage}
									htmlFor='cover-input'
									className={`bg-white-800 dark:bg-secondary-dark-2 flex w-28 gap-2.5 rounded p-2.5 max-sm:w-full${
										isChecking.postImage ? 'animate-pulse' : ''
									}`}
								>
									<Image
										width={20}
										height={20}
										src={'/assets/create-post/image.svg'}
										alt='Cover Image'
										className='aspect-square w-5 dark:invert'
										loading='lazy'
									/>
									<span className='text-secondary dark:text-white-800 my-auto cursor-pointer text-xs font-semibold leading-[160%]'>
										{isChecking.postImage ? 'Checking...' : 'Set Cover'}
									</span>
								</FormLabel>
								<FormControl>
									<Input
										disabled={isChecking.postImage}
										type='file'
										id='cover-input'
										accept='image/png, image/jpeg'
										className='hidden'
										placeholder='set cover'
										onChange={(e) => handleChange(e, 'postImage')}
									/>
								</FormControl>
								<FormMessage className='text-xs text-red-600' />
							</FormItem>
						)}
					/>
					{groups.length >= 1 && (
						<FormField
							control={form.control}
							name='group'
							render={() => (
								<FormItem>
									<Select value={group?.name ?? 'Select Group'}>
										<FormControl>
											<SelectTrigger className='bg-white-800 text-secondary dark:bg-secondary-dark-2 dark:text-white-800 flex items-center gap-2 rounded border-none'>
												{group?.name ?? 'Select group'}
											</SelectTrigger>
										</FormControl>
										<SelectContent className='dark:bg-secondary-dark-2 max-h-[500px] overflow-y-auto bg-white'>
											<GroupSelectContent groups={groups} form={form} />
										</SelectContent>
									</Select>
									<FormMessage className='text-xs text-red-600' />
								</FormItem>
							)}
						/>
					)}

					<FormField
						control={form.control}
						name='createType'
						render={({ field }) => (
							<FormItem>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger className='bg-white-800 text-secondary-dark-2 dark:bg-secondary-dark-2 dark:text-white-800 flex items-center gap-2 rounded border-none text-base'>
											<SelectValue placeholder='Create - Post' />
										</SelectTrigger>
									</FormControl>
									<SelectContent className='dark:bg-secondary-dark-2 bg-white '>
										{createPostData.map((data) => (
											<SelectItem value={data.value} key={data.title}>
												<div className='flex flex-row items-center justify-between gap-1 p-1 md:gap-2.5'>
													<Image
														src={data.icon}
														alt={`${data.title} - icon`}
														width={15}
														height={15}
														className=' invert dark:invert-0'
													/>
													<p className='bodyMd-semibold'>{data.title}</p>
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage className='text-xs text-red-600' />
							</FormItem>
						)}
					/>
				</div>
				{preview && (
					<div className='relative min-h-[350px] w-full'>
						<Image
							src={preview.postImage as string}
							alt='cover'
							fill
							className='rounded-lg object-cover'
							priority
						/>
					</div>
				)}

				<FormField
					control={form.control}
					name='post'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Editor
									key={theme}
									apiKey={process.env.EDITOR_API_KEY}
									initialValue=''
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
							</FormControl>
							<FormMessage className='text-xs text-red-600' />
						</FormItem>
					)}
				/>

				<TagInput form={form} />
				{type === 'meetup' && (
					<>
						<FormField
							control={form.control}
							name='address'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='md:body-semibold bodyMd-semibold text-darkSecondary-900 dark:text-white-800'>
										Address
									</FormLabel>
									<FormControl>
										<>
											<Input
												{...field}
												placeholder='Your address'
												className='dark:bg-secondary-dark-2 min-h-[50px] rounded-lg border-none bg-white px-5 py-3 text-base focus-visible:border-none focus-visible:ring-0 focus-visible:ring-offset-0'
											/>
										</>
									</FormControl>
									<FormMessage className='text-xs text-red-600' />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='companyName'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='md:body-semibold bodyMd-semibold text-darkSecondary-900 dark:text-white-800'>
										Company Name
									</FormLabel>
									<FormControl>
										<>
											<Input
												{...field}
												placeholder='Company name'
												className='dark:bg-secondary-dark-2 min-h-[50px] rounded-lg border-none bg-white px-5 py-3 text-base focus-visible:border-none focus-visible:ring-0 focus-visible:ring-offset-0'
											/>
										</>
									</FormControl>
									<FormMessage className='text-xs text-red-600' />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='date'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='md:body-semibold bodyMd-semibold text-darkSecondary-900 dark:text-white-800'>
										Date
									</FormLabel>
									<FormControl>
										<>
											<Input
												{...field}
												type='date'
												placeholder='Date'
												className='dark:bg-secondary-dark-2 min-h-[50px] rounded-lg border-none bg-white px-5 py-3 text-base focus-visible:border-none focus-visible:ring-0 focus-visible:ring-offset-0'
											/>
										</>
									</FormControl>
									<FormMessage className='text-xs text-red-600' />
								</FormItem>
							)}
						/>
					</>
				)}

				<div className='flex items-center gap-4'>
					<Button disabled={loading} type='submit' variant={'default'}>
						{loading ? 'Publishing...' : 'Publish'}
					</Button>
					<Link href={'/'} type='button' className='dark:text-white'>
						Cancel
					</Link>
				</div>
			</form>
		</Form>
	);
};

export default CreatePost;
