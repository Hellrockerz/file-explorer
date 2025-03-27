"use client";
import { useRouter } from "next/navigation";
import Loginform from "@/components/Loginform";

export default function Home() {
  const router = useRouter();
  return <Loginform onLogin={() => router.push("/dashboard")} />;
}