import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed top-0 z-50 h-screen  w-full bg-white dark:bg-secondary-dark-2">
      <div className="flex h-full items-center justify-center">
        <div>
          <Image
            className="aspect-auto object-contain"
            src="/assets/general/icons/logo.svg"
            width={100}
            height={100}
            priority
            fetchPriority="high"
            alt="Logo"
          />
        </div>
      </div>
    </div>
  );
}
