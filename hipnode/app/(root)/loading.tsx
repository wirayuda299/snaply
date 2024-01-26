import Image from "next/image";

export default function Loading() {
  return (
    <div className="w-full fixed top-0 z-50  h-screen bg-white dark:bg-secondary-dark-2">
      <div className="flex justify-center items-center h-full">
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
