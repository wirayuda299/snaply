import type { ReactNode } from "react";

import { Navbar } from "@/components/index";
import { SocketProvider } from "@/providers/socket-provider";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <SocketProvider>
        <Navbar />
        <div className="container">{children}</div>
      </SocketProvider>
    </>
  );
}
