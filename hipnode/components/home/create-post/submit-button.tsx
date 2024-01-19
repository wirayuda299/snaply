"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      aria-disabled={pending}
      disabled={pending}
      className="hidden h-9 md:block"
      type="submit"
    >
      {pending ? "Submitting..." : "Create Post"}
    </Button>
  );
}
