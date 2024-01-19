"use client";

import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import useUploadFile from "@/hooks/useUploadFile";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import useUsers from "@/hooks/useUsers";
import { createGroupSchema, createGroupSchemaTypes } from "@/lib/validations";
import { createGroup } from "@/lib/actions/group.action";
import { uploadImageToS3 } from "@/lib/aws/upload";

export default function CreateGroupForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<createGroupSchemaTypes>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      admins: [],
      cover: "",
      description: "",
      members: [],
      name: "",
      profileImage: "",
    },
  });
  const router = useRouter();
  const { isChecking, handleChange, preview, files } = useUploadFile(form);
  const { users } = useUsers();

  async function onSubmit(data: createGroupSchemaTypes) {
    try {
      console.log(data);

      setLoading(true);
      if (files && files.cover && files.profileImage) {
        const [cover, profileImage] = await Promise.all([
          uploadImageToS3(files.cover),
          uploadImageToS3(files.profileImage),
        ]);
        await createGroup({
          admins: data.admins,
          cover: cover?.Location!,
          description: data.description,
          members: data.members,
          name: data.name,
          profileImage: profileImage?.Location!,
        });
      }
      toast("Group has been created 🎉");
      router.push("/groups");
    } catch (error) {
      toast("Something went wrong while create a group 😢");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="cover"
          render={() => (
            <FormItem className="w-fit max-sm:w-full">
              <FormLabel
                aria-disabled={isChecking.cover}
                htmlFor="cover-input"
                className={`flex w-28 cursor-pointer gap-2.5  rounded bg-white-800 px-2.5 py-2  dark:bg-secondary-dark-2 max-sm:w-full ${
                  isChecking.cover ? "animate-pulse cursor-not-allowed" : ""
                }`}
              >
                <Image
                  width={20}
                  height={20}
                  src={"/assets/create-post/image.svg"}
                  alt="Cover Image"
                  className="aspect-square w-5 dark:invert"
                  loading="lazy"
                />
                <span className="my-auto cursor-pointer text-xs font-semibold leading-[160%] text-secondary dark:text-white-800">
                  {isChecking.cover ? "Checking..." : "Set Cover"}
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  disabled={isChecking.cover}
                  type="file"
                  id="cover-input"
                  accept="image/png, image/jpeg"
                  className="hidden "
                  placeholder="set cover"
                  onChange={(e) => handleChange(e, "cover")}
                />
              </FormControl>
              <FormMessage className="text-xs text-red-600" />
            </FormItem>
          )}
        />
        {preview && preview.cover ? (
          <div className="relative min-h-[250px] w-full">
            <Image
              className="rounded-md object-cover object-center"
              src={preview.cover}
              alt="cover"
              fill
            />
          </div>
        ) : (
          <div className="flex min-h-[200px] w-full items-center justify-center rounded-md bg-white-700 dark:bg-secondary-dark-2 ">
            <Image
              width={50}
              height={50}
              src={"/assets/create-post/image.svg"}
              alt="cover"
            />
          </div>
        )}
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex w-min sm:h-14 sm:w-14 items-center justify-center rounded-full bg-white-700 p-1 dark:bg-secondary-dark-2",
              isChecking.profileImage && "animate-pulse cursor-not-allowed"
            )}
          >
            <Image
              width={30}
              height={30}
              src={
                preview && preview.profileImage
                  ? preview.profileImage
                  : "/assets/create-post/image.svg"
              }
              alt="profile image"
              className={cn(
                "aspect-auto object-cover object-center ",
                preview &&
                  preview.profileImage &&
                  "h-full w-full rounded-full aspect-auto"
              )}
              loading="lazy"
            />
          </div>
          <FormField
            control={form.control}
            name="profileImage"
            render={() => (
              <FormItem className="w-fit max-sm:w-full">
                <FormLabel
                  aria-disabled={isChecking.profileImage}
                  htmlFor="profile"
                  className={`flex w-28 cursor-pointer gap-2.5 rounded bg-white-800 px-2.5 py-1  dark:bg-secondary-dark-2 max-sm:w-full ${
                    isChecking.profileImage
                      ? "animate-pulse cursor-not-allowed"
                      : ""
                  }`}
                >
                  <Image
                    width={20}
                    height={20}
                    src={"/assets/create-post/image.svg"}
                    alt="Cover Image"
                    className="aspect-square w-5 dark:invert"
                    loading="lazy"
                  />
                  <span className="my-auto cursor-pointer text-xs font-semibold leading-[160%] text-secondary dark:text-white-800">
                    {isChecking.profileImage ? "Checking..." : "Set Profile"}
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isChecking.profileImage}
                    type="file"
                    id="profile"
                    accept="image/png, image/jpeg"
                    className="hidden disabled:cursor-not-allowed"
                    placeholder="set profile"
                    onChange={(e) => handleChange(e, "profileImage")}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-600" />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="md:body-semibold bodyMd-semibold text-darkSecondary-900 dark:text-white-800">
                Group Name
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Group name"
                  className="min-h-[50px] rounded-lg border-none bg-white px-5 py-3 text-base focus-visible:border-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-secondary-dark-2"
                />
              </FormControl>
              <FormMessage className="text-xs text-red-600" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="md:body-semibold bodyMd-semibold text-darkSecondary-900 dark:text-white-800">
                Group Description
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Group description"
                  className="min-h-[100px] rounded-lg border-none bg-white px-5 py-3 text-base focus-visible:border-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-secondary-dark-2"
                />
              </FormControl>
              <FormMessage className="text-xs text-red-600" />
            </FormItem>
          )}
        />

        {users?.length >= 1 && (
          <FormField
            control={form.control}
            name="admins"
            render={() => (
              <FormItem>
                <FormLabel className="text-lg font-semibold dark:text-white-800">
                  Add Admin
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(e) => {
                      form.setValue("admins", [e]);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder="Add other admin"
                        className="placeholder:text-xs "
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-secondary-dark-2">
                      {users.map((user) => (
                        <SelectItem value={user.email} key={user.name}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-xs text-red-600" />
              </FormItem>
            )}
          />
        )}
        {users?.length >= 1 &&
          users.filter(
            (user) => !form.getValues("admins").includes(user.email)
          ) && (
            <FormField
              control={form.control}
              name="members"
              render={() => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold dark:text-white-800">
                    Add Member
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(e) => form.setValue("members", [e])}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder="Add member..."
                          className="placeholder:text-xs "
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-secondary-dark-2">
                        {users.map((user) => (
                          <SelectItem value={user.email} key={user.name}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-xs text-red-600" />
                </FormItem>
              )}
            />
          )}
        <Button disabled={loading}>{loading ? "Creating..." : "Create"}</Button>
      </form>
    </Form>
  );
}
