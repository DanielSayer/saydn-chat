import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import PasswordInput from "../password-input";
import z from "zod";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { SignInError } from "@/lib/errors/sign-in-error";
import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { SubmitButton } from "../buttons/submit-button";

const SignUpSchema = z.object({
  email: z.email().min(1, { message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type User = z.infer<typeof SignUpSchema>;

function SignIn() {
  const navigate = useNavigate();
  const [isComplete, setIsComplete] = useState(false);
  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (data: User) => {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        throw new SignInError(
          result.error.message ?? "Email or password is incorrect",
        );
      }
    },
    onSuccess: async () => {
      setIsComplete(true);
      new Promise((resolve) => setTimeout(resolve, 1000)).then(() =>
        navigate({ to: "/chat", from: "/auth/sign-in", replace: true }),
      );
    },
    onError: (error) => {
      form.setError("root", { message: error.message });
    },
  });

  const form = useForm<User>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: standardSchemaResolver(SignUpSchema),
  });

  const onSubmit = async (user: User) => {
    await mutateAsync(user);
  };

  return (
    <MotionConfig
      transition={{
        type: "tween",
        duration: 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <div className="flex w-full max-w-sm flex-col gap-6 md:max-w-md">
        <Card className="bg-card gap-4 overflow-hidden border-2 pt-3 pb-5 inset-shadow-sm">
          <CardHeader className="flex justify-center border-b-2 [.border-b-2]:pb-2.5">
            <AnimatePresence mode="wait">
              <motion.div
                key={`title`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <CardTitle className="text-xl">Sign into saydn.chat</CardTitle>
              </motion.div>
            </AnimatePresence>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            autoComplete="email"
                            placeholder="hello@saydn.chat"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder="••••••••"
                            autoComplete="current-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
                {form.formState.errors.root && (
                  <p className="text-destructive -my-2 text-sm">
                    {form.formState.errors.root.message}
                  </p>
                )}
                <motion.div
                  className="mt-6 w-full"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <SubmitButton
                    className="h-10 w-full"
                    isLoading={isPending}
                    loadingText="Signing in..."
                    completeText="Signed in!"
                    isComplete={isComplete}
                  >
                    Sign in
                  </SubmitButton>
                </motion.div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </MotionConfig>
  );
}

export { SignIn };
