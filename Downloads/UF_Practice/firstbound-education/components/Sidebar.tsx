"use client";

import { useState } from "react";
import Link from "next/link";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <>
      <button
        className="hamburger-button"
        onClick={() => setOpen(!open)}
        aria-label="Open navigation menu"
      >
        <span className={open ? "hamburger-line line-one open" : "hamburger-line line-one"}></span>
        <span className={open ? "hamburger-line line-two open" : "hamburger-line line-two"}></span>
        <span className={open ? "hamburger-line line-three open" : "hamburger-line line-three"}></span>
      </button>

      <div
        className={open ? "sidebar-backdrop show" : "sidebar-backdrop"}
        onClick={closeMenu}
      ></div>

      <aside className={open ? "sidebar open" : "sidebar"}>
        <div className="sidebar-header">
          <h2>FirstBound</h2>
          <p>Education for everyone.</p>
        </div>

        <nav className="sidebar-nav">
          <Link href="/" onClick={closeMenu}>
            Home
          </Link>

          <Link href="/signup?role=student" onClick={closeMenu}>
            Enroll as a student Today!
          </Link>

          <Link href="/signup?role=tutor" onClick={closeMenu}>
            Sign up to tutor with us!
          </Link>

          <Link href="/contact" onClick={closeMenu}>
            Contact us!
          </Link>

          <Link href="/login" onClick={closeMenu}>
            Log in
          </Link>

          <Link href="/signup" onClick={closeMenu}>
            Sign up
          </Link>
        </nav>

        <div className="sidebar-footer">
          <p>FirstBound Education</p>
        </div>
      </aside>
    </>
  );
}