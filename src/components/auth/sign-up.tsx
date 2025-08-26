import { authClient } from "@/lib/auth-client";
import { SignUpError } from "@/lib/errors/sign-up-error";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { SubmitButton } from "../buttons/submit-button";
import PasswordInput from "../password-input";
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

const SignUpSchema = z
  .object({
    firstName: z
      .string()
      .min(1, { error: "First name is required" })
      .max(255, { error: "First name is too long" }),
    lastName: z
      .string()
      .min(1, { error: "Last name is required" })
      .max(255, { error: "Last name is too long" }),
    email: z.email({ error: "Invalid email" }),
    password: z
      .string()
      .min(8, { error: "Password must be at least 8 characters" })
      .max(255, { error: "Password is too long" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type User = z.infer<typeof SignUpSchema>;

function SignUp() {
  const navigate = useNavigate();
  const [isComplete, setIsComplete] = useState(false);
  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (data: User) => {
      const result = await authClient.signUp.email({
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        throw new SignUpError(result.error.message ?? "Unknown error");
      }
    },
    onSuccess: async () => {
      setIsComplete(true);
      new Promise((resolve) => setTimeout(resolve, 1000)).then(() =>
        navigate({ to: "/chat", from: "/auth/sign-up", replace: true }),
      );
    },
    onError: (error) => {
      form.setError("root", { message: error.message });
    },
  });

  const form = useForm<User>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
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
                <CardTitle className="text-xl">
                  Sign up for saydn.chat
                </CardTitle>
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
                  className="flex w-full flex-col gap-3 lg:flex-row"
                >
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First name</FormLabel>
                        <FormControl>
                          <Input placeholder="Joe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last name</FormLabel>
                        <FormControl>
                          <Input placeholder="Due" {...field} />
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="hello@t3.gg"
                            autoComplete="email"
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
                            autoComplete="new-password"
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
                    name="confirmPassword"
                    rules={{ deps: ["password"] }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm password</FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder="••••••••"
                            autoComplete="new-password"
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
                    completeText="Account created!"
                    isLoading={isPending}
                    loadingText="Creating account..."
                    isComplete={isComplete}
                  >
                    Sign up
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

export { SignUp };
