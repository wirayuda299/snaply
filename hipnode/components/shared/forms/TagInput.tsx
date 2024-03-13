import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import useHandleEnter from "@/hooks/useHandleEnter";
import { Input } from "@/components/ui/input";

export default function TagInput<T extends FieldValues>({
  form,
}: {
  form: UseFormReturn<T>;
}) {
  const { handleEnter } = useHandleEnter(form);

  const handleTagRemove = (tag: string, field: any) => {
    form.setValue(
      "tags" as Path<T>,
      field.value.filter((t: string) => t !== tag),
    );
  };
  return (
    <FormField
      control={form.control}
      name={"tags" as Path<T>}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="md:body-semibold bodyMd-semibold text-darkSecondary-900 dark:text-white-800">
            Add or change tags (up to 5) so readers know what your story is
            about
          </FormLabel>
          <FormControl>
            <>
              <Input
                autoComplete="off"
                placeholder="Add a tag..."
                className="min-h-[50px] rounded-lg border-none bg-white px-5 py-3 text-base focus-visible:border-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-secondary-dark-2"
                onKeyDown={(e) => handleEnter(e, "tags", "tags" as Path<T>)}
              />
              {field.value.length > 0 && (
                <div className="flex-start flex gap-2.5">
                  {field?.value.map((tag: any) => (
                    <div
                      key={tag}
                      className="mt-2.5 cursor-pointer rounded-[4px] bg-white-700 px-[10px] py-[6px] text-secondary-light dark:bg-secondary-dark-2"
                      onClick={() => handleTagRemove(tag, field)}
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              )}
            </>
          </FormControl>
          <FormMessage className="text-xs text-red-600" />
        </FormItem>
      )}
    />
  );
}
