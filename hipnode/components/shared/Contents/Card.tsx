import Image from "next/image";

import { cn } from "@/lib/utils";

type ContentCardProps = {
  background: string;
  icon?: string;
  alt?: string;
  text: string;
  position: "left" | "right";
  cardBg: string;
};

export default function ContentCard({
  background,
  cardBg,
  position,
  text,
  alt,
  icon,
}: ContentCardProps) {
  return (
    <div
      className={cn(
        `group flex h-full w-full max-w-[600px] items-center justify-start gap-6 rounded-lg bg-white p-5 dark:bg-secondary-dark-2 ${
          position === "right" ? "hover:!bg-secondary-red-60" : ""
        }`,
        cardBg
      )}
    >
      {icon && (
        <div
          className={cn(
            `flex aspect-square w-[10px] h-[10px] md:h-[60px] md:w-[60px] items-center justify-center rounded-lg dark:bg-secondary-dark-2`,
            background
          )}
        >
          <Image
            className="size-5 object-contain"
            src={icon}
            width={50}
            height={50}
            alt={alt ?? ""}
          />
        </div>
      )}
      <p
        className={`text-sm font-semibold leading-5 text-secondary-dark-2  dark:text-white-800 md:text-lg ${
          position === "right" ? "group-hover:text-white" : ""
        }`}
      >
        {text}
      </p>
    </div>
  );
}
