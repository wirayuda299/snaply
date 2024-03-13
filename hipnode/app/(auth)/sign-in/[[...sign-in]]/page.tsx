import { SideContent } from "@/components/index";
import { signInContents } from "@/constants";
import AuthForm from "@/components/shared/forms/auth/auth";

export default function Signin() {
  return (
    <>
      <SideContent
        position="left"
        title="Sign in to Snaply."
        contents={signInContents}
      />
      <div className="flex w-[800px] items-center justify-center py-10 dark:bg-primary-dark max-lg:w-full">
        <AuthForm type="signin" />
      </div>
    </>
  );
}
