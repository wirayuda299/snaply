import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import {
  QueryObserverResult,
  RefetchOptions,
  useMutation,
} from "@tanstack/react-query";
import Image from "next/image";
import { Paperclip, Send, MessageCircleX } from "lucide-react";

import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { sendMessage } from "@/lib/actions";
import { uploadFile } from "@/lib/actions/fileUpload.action";
import { MessageData } from "@/types";
import { cn } from "@/lib/utils";
import useUploadFile from "@/hooks/useUploadFile";

const schema = z.object({
  message: z.string(),
  id: z.string(),
  from: z.string(),
  media: z
    .object({
      image: z.string().optional().nullable(),
      audio: z.string().optional().nullable(),
      video: z.string().optional().nullable(),
    })
    .nullable()
    .nullish()
    .optional()
    .optional(),
});

export default function ChatForm({
  userId,
  id,
  to,
  refetch,
}: {
  userId: string;
  id: string;
  to: string;
  refetch: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<MessageData[], Error>>;
}) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      from: userId,
      message: "",
      id,
    },
  });
  const { files, preview, handleChange, isChecking } = useUploadFile(form);

  const { mutateAsync, isPending } = useMutation({
    mutationKey: [id],
    mutationFn: async () => {
      if (files && files["media.image"]) {
        const image = await uploadFile(files["media.image"]);

        return await sendMessage({
          id,
          message: form.getValues("message"),
          receiverId: to,
          messageId: id,
          media: { image },
          senderId: userId,
        });
      } else {
        return await sendMessage({
          id,
          message: form.getValues("message"),
          receiverId: to,
          messageId: id,
          senderId: userId,
        });
      }
    },
    onSuccess: () => {
      refetch();
    },
  });
  async function onSubmit() {
    try {
      await mutateAsync();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Unknown error");
      }
    } finally {
      form.setValue("message", "");
      form.setValue("media", null);
    }
  }
  const image = form.watch("media");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" relative mt-[calc(100vh-200px)] flex items-center justify-end gap-2"
      >
        <FormField
          control={form.control}
          name="media.image"
          render={() => (
            <FormItem>
              <FormLabel htmlFor="image" className="cursor-pointer">
                {isChecking["media.image"] ? (
                  <div className="ease size-6 animate-spin rounded-full border-t-2 border-primary transition-all duration-1000"></div>
                ) : (
                  <Paperclip className="text-gray-400" />
                )}
              </FormLabel>
              <FormControl>
                <Input
                  aria-disabled={isChecking["media.image"]}
                  onChange={(e) => handleChange(e, "media.image")}
                  id="image"
                  type="file"
                  name="file"
                  disabled={isChecking["media.image"]}
                  className="hidden"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl className="w-full">
                <div className="flex w-full items-center">
                  {preview && image?.image && preview["media.image"] && (
                    <div className=" absolute bottom-12 left-0">
                      <Image
                        className="aspect-auto rounded-lg object-contain"
                        src={preview["media.image"]}
                        width={150}
                        height={100}
                        alt="preview"
                      />
                      <button
                        title="delete image"
                        onClick={() => form.setValue("media.image", null)}
                        type="button"
                        className="absolute -right-2 -top-2 text-red-600"
                      >
                        <MessageCircleX size={20} fill="black" />
                      </button>
                    </div>
                  )}
                  <Input
                    {...field}
                    disabled={isPending}
                    aria-disabled={isPending}
                    autoComplete="off"
                    placeholder="Chat...."
                    className={cn(
                      "bg-white-700 dark:bg-secondary-dark focus-visible:outline-none disabled:cursor-not-allowed",
                      isPending && "animate-pulse",
                    )}
                  />
                  <Button
                    disabled={isPending}
                    aria-disabled={isPending}
                    type="submit"
                  >
                    {isPending ? (
                      <div className="ease size-6 animate-spin rounded-full border-t-2 border-white-700 transition-all duration-1000"></div>
                    ) : (
                      <Send />
                    )}
                  </Button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
