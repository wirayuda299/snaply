'use client';

import { useAuth, useSignIn, useSignUp, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { FormEvent, useState } from 'react';

import { authSchemaType, authSchema } from '@/lib/validations';
import AuthFormFields from './FormFields';
import { createUser } from '@/lib/actions/user.action';

export default function AuthForm({ type }: { type: 'signin' | 'signup' }) {
	const { getToken } = useAuth();
	const { user } = useUser();
	const { isLoaded, signIn, setActive } = useSignIn();
	const [loading, setLoading] = useState(false);
	const {
		isLoaded: signUpIsLoaded,
		signUp,
		setActive: signInSetActive,
	} = useSignUp();
	const [code, setCode] = useState('');
	const [pendingVerification, setPendingVerification] = useState(false);
	const router = useRouter();

	const form = useForm<authSchemaType>({
		resolver: zodResolver(authSchema),
		defaultValues: {
			emailAddress: '',
			password: '',
			username: '',
		},
	});
	if (!isLoaded || !signUpIsLoaded) return null;

	const pwd = form.watch('password');

	const handleAuthOperation = async (
		data: authSchemaType,
		operation: 'signin' | 'signup'
	) => {
		try {
			setLoading(true);
			const result =
				operation === 'signin'
					? await signIn.create({
							identifier: data.username,
							password: data.password,
						})
					: await signUp.create({
							emailAddress: data.emailAddress,
							password: data.password,
							username: data.username,
						});

			if (result.status === 'complete') {
				const setActiveFunc =
					operation === 'signin' ? setActive : signInSetActive;
				await setActiveFunc({ session: result.createdSessionId });
				toast.success('Authentication successful');
				router.push('/');
			} else if (operation === 'signup') {
				await signUp.prepareEmailAddressVerification({
					strategy: 'email_code',
				});

				setPendingVerification(true);
			}
		} catch (err) {
			// @ts-ignore
			if (err.clerkError) {
				// @ts-ignore
				// eslint-disable-next-line array-callback-return
				err.errors.map((e) => {
					toast.error(e.message);
				});
			} else if (err instanceof Error) {
				toast.error(err.message);
			} else {
				console.log(err);
			}
		} finally {
			setLoading(false);
		}
	};

	const handleSignIn = (data: authSchemaType) =>
		handleAuthOperation(data, 'signin');
	const handleSignUp = (data: authSchemaType) =>
		handleAuthOperation(data, 'signup');

	const onPressVerify = async (e: FormEvent) => {
		e.preventDefault();
		try {
			setLoading(true);
			const completeSignUp = await signUp.attemptEmailAddressVerification({
				code,
			});
			if (completeSignUp.status === 'complete') {
				if (
					completeSignUp.emailAddress &&
					completeSignUp.createdUserId &&
					completeSignUp.username
				) {
					const token = await getToken();
					await Promise.all([
						setActive({ session: completeSignUp.createdSessionId }),
						handleCreateUser(
							completeSignUp.emailAddress,
							completeSignUp.createdUserId,
							completeSignUp.username,
							token!,
							user?.imageUrl!,
							pwd
						),
					]);
					toast.success('Email verification successful');
					router.push('/');
				}
			}
		} catch (err) {
			// @ts-ignore
			if (err.clerkError) {
				// @ts-ignore
				// eslint-disable-next-line array-callback-return
				err.errors.map((e) => {
					toast.error(e.message);
				});
			} else if (err instanceof Error) {
				toast.error(err.message);
			} else {
				console.log(err);
			}
		} finally {
			setLoading(false);
		}
	};

	const handleCreateUser = async (
		email: string,
		id: string,
		username: string,
		token: string,
		image: string,
		password: string
	) => {
		try {
			await createUser(email, id, username, token, image, password);
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			}
		}
	};

	return (
		<AuthFormFields
			form={form}
			type={type}
			handleSignIn={handleSignIn}
			handleSignUp={handleSignUp}
			loading={loading}
			code={code}
			onPressVerify={onPressVerify}
			pendingVerification={pendingVerification}
			setCode={setCode}
		/>
	);
}
