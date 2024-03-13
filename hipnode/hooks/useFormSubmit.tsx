import { toast } from "sonner";
import { useState } from "react";

import {
  createPost,
  updatePost,
  createMeetup,
  createPodcast,
  updateMeetup,
} from "@/lib/actions";
import { uploadFile } from "@/lib/actions/fileUpload.action";
import { CreatePostFormType } from "@/lib/validations";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type Props = {
  params: { action: "update" | "create" };
  searchParams: { type: "meetup" | "post"; postId: string; title: string };
};

export default function useFormSubmit(
  { params, searchParams }: Props,
  files: Record<string, File> | null,
  data: any,
  router: AppRouterInstance,
) {
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (values: CreatePostFormType) => {
    const {
      createType,
      group,
      post,
      tags,
      title,
      address,
      companyName,
      date,
      category,
    } = values;

    setLoading(true);

    try {
      switch (createType) {
        case "post":
          if (params.action === "update") {
            if (files) {
              const image = await uploadFile(files.postImage);
              await updatePost(
                searchParams.postId,
                title,
                image?.secure_url,
                image?.public_id,
                post,
                category,
                tags,
                "/",
              );
            } else {
              await updatePost(
                searchParams.postId,
                title,
                data?.post.image,
                data?.post.assetId,
                post,
                category,
                tags,
                searchParams.type === "post" ? "/" : "/meetups",
              );
            }
            toast.success("Your post has been updated 🥳");
            router.push(searchParams.type === "post" ? "/" : "/meetups");
          } else {
            if (files && files.postImage) {
              const image = await uploadFile(files.postImage);

              await createPost({
                group: group?.id,
                assetId: image?.public_id,
                image: image?.secure_url,
                tags,
                title,
                body: post,
                category,
              });
              toast.success("Your post has been published 🥳");
              router.push("/");
            }
          }
          break;

        case "meetup":
          if (params.action === "update") {
            if (files) {
              const image = await uploadFile(files.postImage);
              await updateMeetup(
                searchParams.postId,
                address!,
                companyName!,
                date!,
                image?.secure_url,
                title,
                tags,
                post,
                image?.public_id,
                category,
              );
            }
            toast.success("Your meetup has been updated 🥳");
            router.push("/meetups");
          } else {
            if (files && files.postImage) {
              const image = await uploadFile(files.postImage);

              await createMeetup({
                address: address as string,
                assetId: image?.public_id,
                image: image?.secure_url,
                companyName: companyName as string,
                date: date as string,
                title,
                tags,
                body: post,
                category,
              });
              toast.success("Meetup event has been published");
              router.push("/meetups");
            }
          }
          break;
        case "podcasts":
          if (files && files.audio && files.postImage) {
            const audio = await uploadFile(files.audio);
            const image = await uploadFile(files.postImage);

            await createPodcast(
              audio?.secure_url,
              audio?.public_id,
              post,
              tags,
              image?.secure_url,
              title,
              image?.public_id,
              category,
            );
            toast.success("Podcast has been published");
            router.push("/podcasts");
          }
          break;
        default:
          throw new Error("Invalid action");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return { onSubmit, loading, setLoading };
}
