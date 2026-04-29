"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

type Profile = {
  id: string;
  full_name: string | null;
  role: string;
};

type Session = {
  id: number;
  student_id: string;
  tutor_id: string;
  subject: string;
  session_date: string;
  start_time: string;
  end_time: string;
  hours: number;
  status: string;
};

export default function Dashboard() {
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      window.location.href = "/login";
      return;
    }

    setEmail(userData.user.email ?? "");

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userData.user.id)
      .single();

    if (profileError || !profileData) {
      setMessage("Could not load profile.");
      return;
    }

    setProfile(profileData);

    const sessionQuery = supabase
      .from("sessions")
      .select("*")
      .order("session_date", { ascending: true });

    const { data: sessionData, error: sessionError } =
      profileData.role === "tutor"
        ? await sessionQuery.eq("tutor_id", userData.user.id)
        : await sessionQuery.eq("student_id", userData.user.id);

    if (sessionError) {
      setMessage(sessionError.message);
      return;
    }

    setSessions(sessionData ?? []);
    setMessage("");
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const totalHours = sessions.reduce(
    (sum, session) => sum + Number(session.hours),
    0
  );

  return (
    <main className="page">
      <div className="container">
        <section className="dashboard-hero">
          <div>
            <h1 className="dashboard-title">
              {profile?.role === "tutor" ? "Tutor Dashboard" : "Student Dashboard"}
            </h1>

            <p>You are logged in as:</p>
            <strong>{email}</strong>

            {profile && (
              <p>
                Role: <strong>{profile.role}</strong>
              </p>
            )}
          </div>

          <button className="danger-button" onClick={handleLogout}>
            Log out
          </button>
        </section>

        {message && <p>{message}</p>}

        {profile?.role === "tutor" && (
          <section className="stats">
            <div className="stat-card">
              <span>Total Tutoring Hours</span>
              <strong>{totalHours}</strong>
            </div>

            <div className="stat-card">
              <span>Scheduled Sessions</span>
              <strong>{sessions.length}</strong>
            </div>
          </section>
        )}

        {profile?.role === "student" && (
          <section className="stats">
            <div className="stat-card">
              <span>Upcoming Sessions</span>
              <strong>{sessions.length}</strong>
            </div>
          </section>
        )}

        <section className="section">
          <h2>
            {profile?.role === "tutor"
              ? "Your Tutoring Schedule"
              : "Your Student Schedule"}
          </h2>

          {sessions.length === 0 ? (
            <div className="session-card">
              <h3>No sessions yet</h3>
              <p>
                Once a tutoring session is assigned, it will show up here.
              </p>
            </div>
          ) : (
            <div className="session-list">
              {sessions.map((session) => (
                <div className="session-card" key={session.id}>
                  <div className="session-top">
                    <div>
                      <h3>{session.subject}</h3>
                      <p>
                        {session.session_date} • {session.start_time} -{" "}
                        {session.end_time}
                      </p>
                      <p>Status: {session.status}</p>
                    </div>

                    <span className="pill">{session.hours} hr</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}