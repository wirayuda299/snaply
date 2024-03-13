"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { FileAudio2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreatePostFormType, PostSchema } from "@/lib/validations";

import { Group, Meetup, Podcast, Post } from "@/types";
import { getData } from "@/lib/actions";
import { createPostData } from "@/constants";
import { useQuery } from "@tanstack/react-query";

import useUploadFile from "@/hooks/useUploadFile";
import useFormReset from "@/hooks/useFormReset";
import useFormSubmit from "@/hooks/useFormSubmit";

const Loader = dynamic(() => import("../Loader"));
const TagInput = dynamic(() => import("./TagInput"));
const GroupSelectContent = dynamic(() => import("./GroupSelectContent"));
const TextEditor = dynamic(() => import("./TextEditor"));

type Props = {
  params: { action: "update" | "create" };
  searchParams: { type: "meetup" | "post"; postId: string; title: string };
};

interface PostResult {
  post: Post;
}

interface MeetupResult {
  meetup: Meetup;
}

const CreatePost = ({
  groups,
  props: { params, searchParams },
}: {
  groups: Group[];
  props: Props;
}) => {
  const router = useRouter();
  const { data, isError, isLoading, error } = useQuery({
    queryKey: [searchParams.postId],
    queryFn: () => getData(searchParams.type, searchParams.postId),
    enabled: params.action === "update",
  });

  const DEFAULT_VALUES = {
    title: searchParams.title ?? "",
    tags: [],
    createType: searchParams.type ?? "post",
    post: "",
    postImage: "",
    country: "",
    address: "",
    companyName: "",
    date: "",
    audio: null,
    category: "",
    group: null,
  };

  const postData = data as unknown as PostResult;
  const meetupData = data as unknown as MeetupResult;
  const podcastData = data as unknown as Podcast;

  const RESET_VALUES = {
    title: postData?.post?.title || meetupData?.meetup?.title,
    tags:
      (postData?.post?.tags || meetupData?.meetup?.tags)?.map(
        (tag: { name: string }) => tag.name,
      ) || [],
    createType: searchParams.type.toLowerCase() || "post",
    post: postData?.post?.body || meetupData?.meetup?.body,
    postImage: postData?.post?.image || meetupData?.meetup?.image,
    country: "",
    address: meetupData?.meetup?.address,
    companyName: meetupData?.meetup?.companyName,
    date: meetupData?.meetup?.date,
    audio: podcastData?.audio || null,
    category: postData?.post?.category || meetupData?.meetup?.category,
    group: postData?.post?.group,
  };

  const form = useForm<CreatePostFormType>({
    resolver: zodResolver(PostSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useFormReset(
    isLoading,
    isError,
    data,
    form,
    RESET_VALUES,
    searchParams.type,
    searchParams.postId,
  );
  const { handleChange, isChecking, preview, files } = useUploadFile(form);

  const { loading, onSubmit } = useFormSubmit(
    { params, searchParams },
    files,
    data,
    router,
  );

  const type = form.watch("createType");
  const group = form.watch("group");

  if (isLoading) return <Loader />;

  if (isError) return <p>{error?.message}</p>;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-8 px-4 pb-10"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Title..."
                  {...field}
                  className="min-h-[48px] rounded-lg border-none bg-white px-5 py-3 text-base text-secondary focus-visible:outline-none focus-visible:ring-0 dark:bg-secondary-dark-2 dark:text-secondary-light md:min-h-[60px]"
                />
              </FormControl>
              <FormMessage className="text-xs text-red-600" />
            </FormItem>
          )}
        />

        <div className="flex w-full gap-5 overflow-x-auto pb-2 ">
          <FormField
            control={form.control}
            name="postImage"
            render={() => (
              <FormItem>
                <FormLabel
                  aria-disabled={isChecking.postImage}
                  htmlFor="cover-input"
                  className={`flex w-28 gap-2.5 rounded bg-white-800 p-2.5 dark:bg-secondary-dark-2 max-sm:w-max ${
                    isChecking.postImage ? "animate-pulse" : ""
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
                  <p className="my-auto cursor-pointer text-xs font-semibold leading-[160%] text-secondary dark:text-white-800">
                    {isChecking.postImage ? "Checking..." : "Set Cover"}
                  </p>
                </FormLabel>
                <FormControl className="w-full">
                  <Input
                    disabled={isChecking.postImage}
                    type="file"
                    id="cover-input"
                    accept="image/png, image/jpeg"
                    className="hidden"
                    name="file"
                    placeholder="set cover"
                    onChange={(e) => handleChange(e, "postImage")}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-600" />
              </FormItem>
            )}
          />
          {type !== "podcasts" && groups.length >= 1 && (
            <FormField
              control={form.control}
              name="group"
              render={() => (
                <FormItem>
                  <Select value={group?.name ?? "Select Group"}>
                    <FormControl>
                      <SelectTrigger className="flex items-center gap-2 truncate rounded border-none bg-white-800 text-secondary dark:bg-secondary-dark-2 dark:text-white-800">
                        {group?.name ?? "Select group"}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[500px] overflow-y-auto bg-white dark:bg-secondary-dark-2">
                      {/* @ts-ignore */}
                      <GroupSelectContent groups={groups} form={form!} />
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs text-red-600" />
                </FormItem>
              )}
            />
          )}
          {type === "podcasts" && (
            <FormField
              name="audio"
              control={form.control}
              render={() => (
                <FormItem>
                  <FormLabel
                    htmlFor="audio"
                    className="md:body-semibold bodyMd-semibold text-darkSecondary-900 dark:text-white-800"
                  >
                    <div className="flex w-36 items-center gap-3 rounded bg-white-700 px-3 py-2.5 dark:bg-secondary-dark-2">
                      <FileAudio2 size={20} />
                      <p>Add audio</p>
                    </div>
                  </FormLabel>
                  <FormControl>
                    <Input
                      required={false}
                      onChange={(e) => handleChange(e, "audio")}
                      id="audio"
                      accept=".mp3"
                      className="hidden"
                      placeholder="Add audio"
                      type="file"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-600" />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="createType"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={(val) => {
                    form.setValue("createType", val.toLowerCase());
                    const param = new URLSearchParams(searchParams);
                    param.set("type", val.toString());
                    router.push(`/create?${param.toString()}`);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="flex items-center gap-2 rounded border-none bg-white-800 text-base text-secondary-dark-2 dark:bg-secondary-dark-2 dark:text-white-800">
                      <SelectValue placeholder="Create - Post" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white dark:bg-secondary-dark-2 ">
                    {createPostData.map((data) => (
                      <SelectItem value={data.value} key={data.title}>
                        <div className="flex flex-row items-center justify-between gap-1 p-1 md:gap-2.5">
                          <Image
                            src={data.icon}
                            alt={`${data.title} - icon`}
                            width={15}
                            height={15}
                            className=" invert dark:invert-0"
                          />
                          <p className="bodyMd-semibold">{data.title}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs text-red-600" />
              </FormItem>
            )}
          />
        </div>
        {(preview || form.getValues("postImage")) && (
          <div className="relative min-h-[350px] w-full">
            <Image
              src={
                preview?.postImage ?? (form.getValues("postImage") as string)
              }
              alt="cover"
              fill
              loading="lazy"
              className="rounded-lg object-cover"
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="post"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TextEditor
                  key={searchParams.postId}
                  // @ts-ignore
                  field={field}
                  value={form.getValues("post") ?? ""}
                />
              </FormControl>
              <FormMessage className="text-xs text-red-600" />
            </FormItem>
          )}
        />
        {/* @ts-ignore */}
        <TagInput form={form} />
        {type === "meetup" && (
          <>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="md:body-semibold bodyMd-semibold text-darkSecondary-900 dark:text-white-800">
                    Address
                  </FormLabel>
                  <FormControl>
                    <>
                      <Input
                        {...field}
                        placeholder="Your address"
                        className="min-h-[50px] rounded-lg border-none bg-white px-5 py-3 text-base focus-visible:border-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-secondary-dark-2"
                      />
                    </>
                  </FormControl>
                  <FormMessage className="text-xs text-red-600" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="md:body-semibold bodyMd-semibold text-darkSecondary-900 dark:text-white-800">
                    Company Name
                  </FormLabel>
                  <FormControl>
                    <>
                      <Input
                        {...field}
                        placeholder="Company name"
                        className="min-h-[50px] rounded-lg border-none bg-white px-5 py-3 text-base focus-visible:border-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-secondary-dark-2"
                      />
                    </>
                  </FormControl>
                  <FormMessage className="text-xs text-red-600" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="md:body-semibold bodyMd-semibold text-darkSecondary-900 dark:text-white-800">
                    Date
                  </FormLabel>
                  <FormControl>
                    <>
                      <Input
                        {...field}
                        type="date"
                        placeholder="Date"
                        className="min-h-[50px] rounded-lg border-none bg-white px-5 py-3 text-base focus-visible:border-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-secondary-dark-2"
                      />
                    </>
                  </FormControl>
                  <FormMessage className="text-xs text-red-600" />
                </FormItem>
              )}
            />
          </>
        )}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="md:body-semibold bodyMd-semibold text-darkSecondary-900 dark:text-white-800">
                Category
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoComplete="off"
                  placeholder="category..."
                  className="min-h-[48px] rounded-lg border-none bg-white px-5 py-3 text-base text-secondary focus-visible:outline-none focus-visible:ring-0 dark:bg-secondary-dark-2 dark:text-secondary-light md:min-h-[60px]"
                />
              </FormControl>
              <FormMessage className="text-xs text-red-600" />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-4">
          <Button
            disabled={loading}
            aria-disabled={loading}
            type="submit"
            variant={"default"}
          >
            {loading
              ? params.action === "create"
                ? "Publishing..."
                : "Updating..."
              : params.action === "create"
                ? "Publish"
                : "Update"}
          </Button>
          <Link href={"/"} type="button" className="dark:text-white">
            Cancel
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default CreatePost;
