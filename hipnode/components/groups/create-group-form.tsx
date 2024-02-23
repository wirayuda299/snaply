'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { uploadFile } from '@/lib/actions/fileUpload.action';
import { createGroup } from '@/lib/actions';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import useUploadFile from '@/hooks/useUploadFile';
import { cn } from '@/lib/utils';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { createGroupSchema, createGroupSchemaTypes } from '@/lib/validations';
import TagInput from '../shared/forms/TagInput';

export default function CreateGroupForm() {
	const router = useRouter();
	const [loading, setLoading] = useState<boolean>(false);
	const { userId } = useAuth();

	const form = useForm<createGroupSchemaTypes>({
		resolver: zodResolver(createGroupSchema),
		defaultValues: {
			admins: [userId!],
			tags: [],
			cover: '',
			description: '',
			members: [],
			name: '',
			profileImage: '',
			category: '',
		},
	});
	const { isChecking, handleChange, preview, files } = useUploadFile(form);

	async function onSubmit(data: createGroupSchemaTypes) {
		try {
			setLoading(true);

			if (files && files.cover && files.profileImage) {
				const cover = await uploadFile(files?.cover);
				const profileImage = await uploadFile(files?.profileImage);

				await createGroup(
					data.admins,
					data.tags,
					cover?.secure_url,
					cover?.public_id,
					data.description,
					profileImage?.secure_url,
					profileImage?.public_id,
					data.name,
					data.category
				);
				toast.success('Group has been created 🎉');
				router.push('/groups');
			}
		} catch (error) {
			toast.error('Something went wrong while create a group 😢');
		} finally {
			setLoading(false);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5 pb-10'>
				<FormField
					control={form.control}
					name='cover'
					render={() => (
						<FormItem className='w-fit max-sm:w-full'>
							<FormLabel
								aria-disabled={isChecking.cover}
								htmlFor='cover-input'
								className={`bg-white-800 dark:bg-secondary-dark-2 flex w-28  cursor-pointer gap-2.5 rounded px-2.5  py-2 max-sm:w-full ${
									isChecking.cover ? 'animate-pulse cursor-not-allowed' : ''
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
									{isChecking.cover ? 'Checking...' : 'Set Cover'}
								</span>
							</FormLabel>
							<FormControl>
								<Input
									disabled={isChecking.cover}
									type='file'
									id='cover-input'
									accept='image/png, image/jpeg'
									className='hidden '
									placeholder='set cover'
									onChange={(e) => handleChange(e, 'cover')}
								/>
							</FormControl>
							<FormMessage className='text-xs text-red-600' />
						</FormItem>
					)}
				/>
				{preview && preview.cover ? (
					<div className='relative min-h-[250px] w-full'>
						<Image
							className='rounded-md object-cover object-center'
							src={preview.cover}
							alt='cover'
							fill
						/>
					</div>
				) : (
					<div className='bg-white-700 dark:bg-secondary-dark-2 flex min-h-[200px] w-full items-center justify-center rounded-md '>
						<Image
							width={50}
							height={50}
							src={'/assets/create-post/image.svg'}
							alt='cover'
						/>
					</div>
				)}
				<div className='flex items-center gap-3'>
					<div
						className={cn(
							'flex w-15 sm:size-16 object-contain items-center justify-center rounded-full bg-white-700 p-2 dark:bg-secondary-dark-2',
							isChecking.profileImage && 'animate-pulse cursor-not-allowed'
						)}
					>
						<Image
							width={30}
							height={30}
							src={
								preview && preview.profileImage
									? preview.profileImage
									: '/assets/create-post/image.svg'
							}
							alt='profile image'
							className={cn(
								'aspect-auto size-7 sm:size-9 object-contain object-center ',
								preview &&
									preview.profileImage &&
									'h-full w-full rounded-full aspect-auto object-cover'
							)}
							loading='lazy'
						/>
					</div>
					<FormField
						control={form.control}
						name='profileImage'
						render={() => (
							<FormItem className='w-fit max-sm:w-full'>
								<FormLabel
									aria-disabled={isChecking.profileImage}
									htmlFor='profile'
									className={`bg-white-800 dark:bg-secondary-dark-2 flex w-28 cursor-pointer gap-2.5 rounded px-2.5 py-2 max-sm:w-full ${
										isChecking.profileImage
											? 'animate-pulse cursor-not-allowed'
											: ''
									}`}
								>
									<Image
										width={20}
										height={20}
										src={'/assets/create-post/image.svg'}
										alt='Cover Image'
										className='aspect-square size-5 object-contain dark:invert'
										loading='lazy'
									/>
									<span className='text-secondary dark:text-white-800 my-auto cursor-pointer text-xs font-semibold leading-[160%]'>
										{isChecking.profileImage ? 'Checking...' : 'Set Profile'}
									</span>
								</FormLabel>
								<FormControl>
									<Input
										disabled={isChecking.profileImage}
										type='file'
										id='profile'
										accept='image/png, image/jpeg'
										className='hidden disabled:cursor-not-allowed'
										placeholder='set profile'
										onChange={(e) => handleChange(e, 'profileImage')}
									/>
								</FormControl>
								<FormMessage className='text-xs text-red-600' />
							</FormItem>
						)}
					/>
				</div>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='md:body-semibold bodyMd-semibold text-darkSecondary-900 dark:text-white-800'>
								Group Name
							</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder='Group name'
									className='dark:bg-secondary-dark-2 min-h-[50px] rounded-lg border-none bg-white px-5 py-3 text-base focus-visible:border-none focus-visible:ring-0 focus-visible:ring-offset-0'
								/>
							</FormControl>
							<FormMessage className='text-xs text-red-600' />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='description'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='md:body-semibold bodyMd-semibold text-darkSecondary-900 dark:text-white-800'>
								Group Description
							</FormLabel>
							<FormControl>
								<Textarea
									{...field}
									placeholder='Group description'
									className='dark:bg-secondary-dark-2 min-h-[100px] rounded-lg border-none bg-white px-5 py-3 text-base focus-visible:border-none focus-visible:ring-0 focus-visible:ring-offset-0'
								/>
							</FormControl>
							<FormMessage className='text-xs text-red-600' />
						</FormItem>
					)}
				/>

				<TagInput form={form} />

				<FormField
					control={form.control}
					name='category'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='md:body-semibold bodyMd-semibold text-darkSecondary-900 dark:text-white-800'>
								Category
							</FormLabel>
							<FormControl>
								<>
									<Input
										{...field}
										placeholder='category...'
										className='text-secondary dark:bg-secondary-dark-2 dark:text-secondary-light min-h-[48px] rounded-lg border-none bg-white px-5 py-3 text-base focus-visible:outline-none focus-visible:ring-0 md:min-h-[60px]'
									/>
								</>
							</FormControl>
							<FormMessage className='text-xs text-red-600' />
						</FormItem>
					)}
				/>
				<Button disabled={loading}>{loading ? 'Creating...' : 'Create'}</Button>
			</form>
		</Form>
	);
}
