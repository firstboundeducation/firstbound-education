import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact | FirstBound Education",
  description: "Contact FirstBound Education.",
};

// Edit this section to choose what information shows up on the contact page.
const contactCards = [
  {
    title: "Email",
    text: "For questions about tutoring, volunteering, or partnerships, contact us by email.",
    display: "firstboundeducation@gmail.com",
    href: "mailto:firstboundeducation@gmail.com",
  },
  {
    title: "Students",
    text: "Students and parents can reach out if they have questions about tutoring or enrollment.",
    display: "Enroll as a student",
    href: "/signup?role=student",
  },
  {
    title: "Tutors",
    text: "High school students interested in volunteering can sign up to become tutors.",
    display: "Sign up to tutor",
    href: "/signup?role=tutor",
  },
];

export default function ContactPage() {
  return (
    <main className="page">
      <div className="container">
        <section className="section">
          <div className="card cta">
            <h1>Contact Us</h1>

            <p className="brand-descriptions">
              Have a question about FirstBound Education? Use the information
              below to contact us or get started.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="grid">
            {contactCards.map((card) => (
              <div className="card" key={card.title}>
                <h3>{card.title}</h3>

                <p className="brand-card-desc">{card.text}</p>

                <Link className="primary-button" href={card.href}>
                  {card.display}
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="card cta">
            <h2>FirstBound Education</h2>

            <p>
              We are working to make tutoring more accessible while giving
              tutors a meaningful way to serve their community.
            </p>

            <div className="button-row" style={{ justifyContent: "center" }}>
              <Link className="secondary-button" href="/">
                Back to Home
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}