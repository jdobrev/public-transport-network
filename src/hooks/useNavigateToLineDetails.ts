import { useRouter } from "expo-router";
import { useCallback } from "react";

export default function useNavigateToLineDetails() {
  const router = useRouter();

  return useCallback(
    (lineId: string) => {
      router.push({
        pathname: "/line/[lineId]",
        params: { lineId },
      });
    },
    [router]
  );
}
