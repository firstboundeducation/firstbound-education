"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Account created! Check your email.");
    }
  };

  return (
    <div style={{ padding: "80px 20px", textAlign: "center" }}>
      <h1 style={{ fontSize: "40px", marginBottom: "20px" }}>Sign up</h1>

      <div style={{ maxWidth: "400px", margin: "0 auto" }}>
        <input
          type="text"
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "10px",
            borderRadius: "10px",
            border: "1px solid #ccc",
          }}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "10px",
            borderRadius: "10px",
            border: "1px solid #ccc",
          }}
        >
          <option value="student">Student</option>
          <option value="tutor">Tutor</option>
        </select>

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

        <button className="primary-button" onClick={handleSignup}>
          Create Account
        </button>

        {message && <p style={{ marginTop: "20px" }}>{message}</p>}
      </div>
    </div>
  );
}