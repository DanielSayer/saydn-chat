import { useMemo } from "react";
import { useSession, useToken } from "./auth-hooks";
import { useQueryClient } from "@tanstack/react-query";

const useBetterAuth = () => {
  const queryClient = useQueryClient();

  const data = useToken({
    initialData: () => {
      const token = queryClient.getQueryData(["auth_token"]);
      return token ?? undefined;
    },
  });
  const session = useSession();
  return useMemo(
    () => ({
      isLoading: data.isPending || data.isLoading,
      isAuthenticated: !!session.user?.id,
      fetchAccessToken: async () => data.token ?? null,
    }),
    [data.isPending, data.isLoading, session.user?.id, data.token],
  );
};

export { useBetterAuth };
