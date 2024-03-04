'use client';

import Image from 'next/image';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useAuth } from '@clerk/nextjs';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import {
	Form,
	FormItem,
	FormLabel,
	FormField,
	FormMessage,
	FormControl,
} from '@/components/ui/form';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import TagInput from '../shared/forms/TagInput';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { uploadFile } from '@/lib/actions/fileUpload.action';
import { createGroup, getGroupById, updateGroup } from '@/lib/actions';
import useUploadFile from '@/hooks/useUploadFile';
import { createGroupSchema, createGroupSchemaTypes } from '@/lib/validations';
import useFormReset from '@/hooks/useFormReset';
import useFetch from '@/hooks/useFetch';
import Loader from '../shared/Loader';
import { Group } from '@/types';

export default function CreateGroupForm({
	groupId,
	type,
}: {
	groupId: string;
	type: string;
}) {
	const router = useRouter();
	const [loading, setLoading] = useState<boolean>(false);
	const { userId } = useAuth();

	const DEFAULT_VALUES = {
		admins: [userId!],
		tags: [],
		cover: '',
		description: '',
		members: [],
		name: '',
		profileImage: '',
		category: '',
	};

	const form = useForm<createGroupSchemaTypes>({
		resolver: zodResolver(createGroupSchema),
		defaultValues: DEFAULT_VALUES,
	});

	const { isChecking, handleChange, preview, files } = useUploadFile(form);
	const { data, isError, error, isLoading } = useFetch<Promise<Group>>(
		groupId,
		async () => await getGroupById(groupId),
		type === 'update'
	);

	useFormReset(
		isLoading,
		isError,
		data,
		form,
		{
			tags: (data as unknown as Group)?.tags.map((tag) => tag.name),
			cover: (data as unknown as Group)?.banner,
			description: (data as unknown as Group)?.description,
			members: (data as unknown as Group)?.members.map((member) => member._id),
			name: (data as unknown as Group)?.name,
			profileImage: (data as unknown as Group)?.logo,
			category: (data as unknown as Group)?.category,
			admins: (data as unknown as Group)?.admins.map((admin) => admin._id),
		},
		type
	);

	if (isLoading) return <Loader />;
	if (isError) return <p>{error?.message}</p>;

	async function onSubmit(formData: createGroupSchemaTypes) {
		try {
			setLoading(true);
			const filesToUpload = files
				? [files.cover, files.profileImage].filter(Boolean)
				: [];
			const uploadPromises = filesToUpload.map(uploadFile);
			const uploadResults = await Promise.all(uploadPromises);

			const banner = uploadResults[0]?.secure_url;
			const bannerAssetId = uploadResults[0]?.public_id;
			const logo = uploadResults[1]?.secure_url;
			const logoAssetId = uploadResults[1]?.public_id;

			const groupData = {
				banner,
				bannerAssetId,
				category: formData.category,
				description: formData.description,
				groupId,
				logo,
				logoAssetId,
				name: formData.name,
				tags: formData.tags,
				admins: (data as unknown as Group)?.admins.map((admin) => admin._id),
				members: (data as unknown as Group)?.members.map(
					(member) => member._id
				),
			};

			if (type === 'update') {
				await updateGroup(groupData);
				toast.success('Group has been updated 🥳');
			} else {
				await createGroup(
					formData.admins,
					formData.tags,
					banner,
					bannerAssetId,
					formData.description,
					logo,
					logoAssetId,
					formData.name,
					formData.category
				);
				toast.success('Group has been created 🎉');
			}
			router.push('/groups');
		} catch (error) {
			console.error(error);
			if (type === 'create') {
				toast.error('Something went wrong while creating a group 😢');
			} else {
				toast.error('Something went wrong while updating a group 😢');
			}
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
				{(preview || data) &&
				(preview?.cover || (data as unknown as Group)?.banner) ? (
					<div className='relative min-h-[250px] w-full'>
						<Image
							className='rounded-md object-cover object-center'
							src={preview?.cover || (data as unknown as Group)?.banner || ''}
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
							'flex size-15 sm:size-12 object-contain items-center justify-center rounded-full bg-white-700 p-1 dark:bg-secondary-dark-2',
							isChecking.profileImage && 'animate-pulse cursor-not-allowed'
						)}
					>
						<Image
							width={30}
							height={30}
							src={
								(preview || data) &&
								(preview?.profileImage || (data as unknown as Group).logo)
									? preview?.profileImage || (data as unknown as Group).logo
									: '/assets/create-post/image.svg'
							}
							alt='profile image'
							className={cn(
								'aspect-auto size-4 sm:size-7 object-contain object-center ',
								(preview || data) &&
									(preview?.profileImage || (data as unknown as Group).logo) &&
									'h-full w-full rounded-full aspect-auto size-8 object-cover'
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
									autoComplete='off'
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
										autoComplete='off'
										placeholder='category...'
										className='text-secondary dark:bg-secondary-dark-2 dark:text-secondary-light min-h-[48px] rounded-lg  bg-white px-5 py-3 text-base  md:min-h-[60px]'
									/>
								</>
							</FormControl>
							<FormMessage className='text-xs text-red-600' />
						</FormItem>
					)}
				/>
				<Button disabled={loading}>
					{loading
						? type === 'create'
							? 'Creating...'
							: 'Updating'
						: type === 'create'
							? 'Create'
							: 'Update'}
				</Button>
			</form>
		</Form>
	);
}
