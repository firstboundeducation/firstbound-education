"use client";

import { useState } from "react";
import Link from "next/link";

const tileInfo = {
  tutoring: {
    title: "1-on-1 Tutoring",
    text: "At FirstBound Education we focus on making sure our young students get the help they need without feeling judged. High School students who have already experienced the struggles of the young students will do their best to help while maintaining an encouraging environment",
  },
  growth: {
    title: "Student Growth",
    text: "Whether a young student needs help in a class they are struggling with or if they simply want to get ahead and learn more advanced content, our tutors will make sure every student reaches their learning goals.",
  },
  community: {
    title: "Community Impact",
    text: "FirstBound Education is about community. High School students gain the opportunity to volunteer and gain service hours while students get the opportunity to recieve free education regardless of their background or skill level.",
  },
};

export default function HomePage() {
  const [activeTile, setActiveTile] = useState<null | keyof typeof tileInfo>(
    null
  );

  return (
    <main className="page">
      <div className="container">
        <section className="hero">
          <div className="hero-text">
            <h1 className="brand-title">
              <span className="brand-first">first</span>
              <span className="brand-bound">bound</span>
              <span className="brand-education">✨EDUCATION✨  </span>
            </h1>

            <p className="brand-descriptions">
              FirstBound Education helps students get accessible academic
              support while giving tutors a meaningful way to serve their
              community, build leadership, and make education more reachable.
            </p>

            <div className="button-row">
              <Link className="primary-button" href="/signup?role=student">
                Enroll as a student Today!
              </Link>

              <Link className="secondary-button" href="/signup?role=tutor">
                Sign up to tutor with us!
              </Link>
            </div>
          </div>

          <div className="image-stack">
            <button
              className="fake-image tile-one"
              type="button"
              onClick={() => setActiveTile("tutoring")}
            >
              <span>1-on-1 Tutoring</span>
            </button>

            <button
              className="fake-image tile-two"
              type="button"
              onClick={() => setActiveTile("growth")}
            >
              <span>Student Growth</span>
            </button>

            <button
              className="fake-image tile-three"
              type="button"
              onClick={() => setActiveTile("community")}
            >
              <span>Community Impact</span>
            </button>
          </div>
        </section>

        <section className="section">
          <h2>About us</h2>

          <p className="brand-descriptions">
            We are a nonprofit tutoring organization focused on connecting
            students with tutors who care about helping others learn. Our goal
            is to make tutoring easier to access, especially for students who
            may not have many academic resources outside school.
          </p>
        </section>

        <section className="section">
          <h2>Our goals</h2>

          <div className="grid">
            <div className="card">
              <h3>Accessible tutoring</h3>
              <p className="brand-card-desc">
                Help students find academic support without making the process
                confusing or intimidating.
              </p>
            </div>

            <div className="card">
              <h3>Better confidence</h3>
              <p className="brand-card-desc">
                Give students a place to ask questions, practice skills, and
                feel more prepared for class.
              </p>
            </div>

            <div className="card">
              <h3>Service leadership</h3>
              <p className="brand-card-desc">
                Give tutors a meaningful way to earn service hours while
                developing communication and teaching skills.
              </p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="card cta">
            <h2>Ready to get started?</h2>

            <p>
              Students can enroll for tutoring, and tutors can sign up to
              support students in subjects they know well.
            </p>

            <div className="button-row" style={{ justifyContent: "center" }}>
              <Link className="primary-button" href="/signup?role=student">
                Enroll as a student Today!
              </Link>

              <Link className="secondary-button" href="/signup?role=tutor">
                Sign up to tutor with us!
              </Link>
            </div>
          </div>
        </section>
      </div>

      {activeTile && (
        <div className="modal-backdrop" onClick={() => setActiveTile(null)}>
          <div className="modal-box" onClick={(event) => event.stopPropagation()}>
            <button
              className="modal-close"
              type="button"
              onClick={() => setActiveTile(null)}
            >
              ×
            </button>

            <h2>{tileInfo[activeTile].title}</h2>
            <p>{tileInfo[activeTile].text}</p>
          </div>
        </div>
      )}
    </main>
  );
}