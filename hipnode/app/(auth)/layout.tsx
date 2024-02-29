import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className=" mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-10 p-5 lg:flex-row">
      {children}
    </div>
  );
}
