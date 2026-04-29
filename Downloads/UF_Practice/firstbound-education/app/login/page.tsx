"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div style={{ padding: "80px 20px", textAlign: "center" }}>
      <h1 style={{ fontSize: "40px", marginBottom: "20px" }}>
        Log in
      </h1>

      <div style={{ maxWidth: "400px", margin: "0 auto" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "10px",
            borderRadius: "10px",
            border: "1px solid #ccc",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            borderRadius: "10px",
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "999px",
            border: "none",
            fontWeight: "bold",
            background: "linear-gradient(135deg, #1e3a8a, #38bdf8)",
            color: "white",
            cursor: "pointer",
          }}
        >
          Log in
        </button>

        {message && (
          <p style={{ marginTop: "20px", color: "red" }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}