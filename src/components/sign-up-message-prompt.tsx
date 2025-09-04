import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { MessageCircleHeart } from "lucide-react";
import { motion } from "motion/react";

export const SignupMessagePrompt = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate({
      to: "/auth/sign-in",
      replace: true,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="isolate mx-auto flex max-w-md flex-col items-center justify-center md:p-8"
    >
      <div className="z-2 mb-8 space-y-12 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border dark:border-0">
            <MessageCircleHeart className="size-8 stroke-1" />
          </div>
          <h1 className="from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-4xl font-bold tracking-tight text-transparent">
            saydn.chat
          </h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium italic">
            the best ai chat app
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="flex w-full gap-3"
      >
        <Button
          onClick={handleNavigation}
          className="min-w-64 font-medium transition-all hover:scale-102 active:scale-98"
          size="lg"
        >
          Get Started
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 0.4, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4, ease: "easeOut" }}
        className="pointer-events-none fixed inset-x-0 top-0 z-1 mx-auto w-full max-w-none opacity-40 md:absolute md:-top-10 md:h-[50rem] md:w-[50rem] md:max-w-[90vw] dark:opacity-20"
        style={{
          mask: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 80%)",
          WebkitMask:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 80%)",
        }}
      ></motion.div>
    </motion.div>
  );
};
