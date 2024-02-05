"use client";

import Link from "next/link";
import type { Dispatch, SetStateAction, FormEvent } from "react";
import Image from "next/image";
import { UseFormReturn } from "react-hook-form";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { authSchemaType } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";

type AuthFormFieldsType = {
  form: UseFormReturn<{
    emailAddress: string;
    password: string;
    username: string;
  }>;
  type: "signin" | "signup";
  handleSignIn: (data: authSchemaType) => Promise<void>;
  handleSignUp: (data: authSchemaType) => Promise<void>;
  loading: boolean;
  pendingVerification: boolean;
  code: string;
  setCode: Dispatch<SetStateAction<string>>;
  onPressVerify: (e: FormEvent) => Promise<void>;
};

export default function AuthFormFields({
  form,
  type,
  handleSignIn,
  handleSignUp,
  loading,
  pendingVerification,
  code,
  onPressVerify,
  setCode,
}: AuthFormFieldsType) {
  return (
    <>
      {!pendingVerification && (
        <Form {...form}>
          <form
            className="w-full"
            onSubmit={form.handleSubmit(
              type === "signup" ? handleSignUp : handleSignIn,
            )}
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="username">Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      autoComplete="off"
                      type="text"
                      placeholder="Your username..."
                      name="username"
                      id="username"
                      className="min-h-[48px] rounded-lg border-none bg-white px-5 py-3 text-base text-secondary ring-offset-0 focus:border-none focus:outline-none focus-visible:ring-0 dark:bg-secondary-dark-2 dark:text-secondary-light md:min-h-[60px]"
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            {type === "signup" && (
              <FormField
                control={form.control}
                name="emailAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        autoComplete="off"
                        type="email"
                        placeholder="Your email..."
                        name="email"
                        id="email"
                        className="min-h-[48px] rounded-lg border-none bg-white px-5 py-3 text-base text-secondary ring-offset-0 focus:border-none focus:outline-none focus-visible:ring-0 dark:bg-secondary-dark-2 dark:text-secondary-light md:min-h-[60px]"
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      autoComplete="off"
                      type="password"
                      placeholder="Your password..."
                      name="password"
                      id="password"
                      className="min-h-[48px] rounded-lg border-none bg-white px-5 py-3 text-base text-secondary ring-offset-0 focus:border-none focus:outline-none focus-visible:ring-0 dark:bg-secondary-dark-2 dark:text-secondary-light md:min-h-[60px]"
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Link
              className="block py-3 text-sm text-secondary dark:text-secondary-light"
              href={type === "signin" ? "/sign-up" : "sign-in"}
            >
              {type === "signin"
                ? "Dont have an account? Sign Up"
                : "Already have an account? Sign In"}
            </Link>
            <Button type="submit" disabled={loading}>
              {loading
                ? "Loading..."
                : type === "signin"
                  ? "Sign In"
                  : "Sign Up"}
            </Button>
          </form>
        </Form>
      )}
      {pendingVerification && (
        <Dialog open={pendingVerification}>
          <DialogContent className="flex flex-col items-center justify-center dark:border-secondary-dark-2 sm:max-w-[425px]">
            <DialogHeader className="flex w-full flex-col items-center">
              <Image
                className="aspect-auto object-contain"
                src="/assets/general/icons/logo.svg"
                width={50}
                height={50}
                priority
                fetchPriority="high"
                alt="Logo"
              />
              <DialogDescription>
                Enter code sended to your email
              </DialogDescription>
              <form onSubmit={onPressVerify} className=" w-full space-y-3">
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Code..."
                  autoFocus
                  className="mt-3 min-h-[48px] w-full rounded-lg border-none bg-white px-5 py-3 text-base text-secondary ring-offset-0 focus:border-none focus:outline-none focus-visible:ring-0 dark:bg-secondary-dark-2 dark:text-secondary-light md:min-h-[50px]"
                />
                <Button className="w-full" type="submit" disabled={loading}>
                  {loading ? "Verifying..." : "Verify Email"}
                </Button>
              </form>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
