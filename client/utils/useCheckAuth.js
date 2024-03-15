import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

export const useCheckAuth = () => {
  const router = useRouter();

  const { user, loading } = useContext(AuthContext);

  useEffect(() => {
    if (!loading) {
      if (user && router.route === "/login") {
        router.replace("/");
      } else if (
        !user &&
        router.route !== "/login" &&
        router.route !== "/register"
      ) {
        // router.replace("/login");
      }
    }
  }, [router, user, loading]);

  return { user, loading };
};
