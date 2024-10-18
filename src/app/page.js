"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";


export default function Home() {
  const auth = getAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (pathname === "/") {
        if (user) {
          router.push("/all-posts");
        } else {
          router.push("/login");
        }
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  return null;
}
