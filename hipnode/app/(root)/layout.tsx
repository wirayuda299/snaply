import type { ReactNode } from "react";

import { Navbar } from "@/components/index";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="mx-auto w-full max-w-[1440px] px-5 pt-24">{children}</div>
    </>
  );
}
