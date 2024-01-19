"use client";

import { useTheme } from "next-themes";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const modes = ["light", "dark", "system"] as const;

export default function ModeToggle() {
  const { setTheme } = useTheme();

  const handleThemeChange = (mode: (typeof modes)[number]) => setTheme(mode);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="focus-visible:ring-0 focus-visible:ring-offset-0"
      >
        <Button
          className="w-4 border-none !bg-transparent focus-visible:border-none"
          size="icon"
        >
          <Image
            src={"/assets/groups/icons/arrow.svg"}
            width={10}
            height={10}
            alt="arrow icon"
            className="  invert transition-all"
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="border-none bg-white dark:bg-secondary-dark-2"
      >
        {modes.map((mode) => (
          <DropdownMenuItem
            className="capitalize"
            key={mode}
            onClick={() => handleThemeChange(mode)}
          >
            {mode}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
