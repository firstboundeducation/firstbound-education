"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function UserDashboardButton() {
  const router = useRouter();

  async function handleClick() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }

  return (
    <button onClick={handleClick} className="user-dashboard-button">
      User Dashboard
    </button>
  );
}