import { useSession } from "@/hooks/auth-hooks";
import { SignupMessagePrompt } from "./sign-up-message-prompt";

export const Chat = () => {
  const { data: session, isPending } = useSession();
  if (!session?.user && !isPending) {
    return (
      <div className="relative flex h-[calc(100dvh-64px)] items-center justify-center">
        <SignupMessagePrompt />
      </div>
    );
  }

  return <div className="mx-auto max-w-4xl">Signed in</div>;
};
