import { useMemo } from "react";
import { queryClient } from "../providers";
import { useSession, useToken } from "./auth-hooks";

const useBetterAuth = () => {
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
