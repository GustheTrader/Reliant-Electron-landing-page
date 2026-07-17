"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

const assetRoot =
  "https://img1.wsimg.com/isteam/ip/aa66c39e-4ff7-437e-9aae-aa24b6c3da16";

const projects = [
  { src: `${assetRoot}/fire%20station%203%20.jpg`, title: "Civic readiness", tag: "Public infrastructure" },
  { src: "/interior-lighting-project.jpg", title: "Designed to shine", tag: "Commercial lighting" },
  { src: `${assetRoot}/hells%20kitchen.jpg`, title: "Built for the rush", tag: "Hospitality" },
  { src: `${assetRoot}/gennybig.jpg`, title: "Critical backup", tag: "Power systems" },
  { src: `${assetRoot}/gear1.jpg`, title: "Precision inside", tag: "Distribution" },
  { src: `${assetRoot}/conduit.JPG`, title: "The work behind the walls", tag: "Electrical construction" },
  { src: `${assetRoot}/zlite.jpg`, title: "Lighting the next shift", tag: "Industrial" },
  { src: `${assetRoot}/IR_0332.jpg`, title: "Made here", tag: "Northern Nevada" },
];

const heroSlides = [
  {
    src: `${assetRoot}/fire%20station%203%20.jpg`,
    alt: "Reliant Electric work at a Northern Nevada fire station",
    label: "Public infrastructure",
    line1: "Ready when",
    line2: "it matters.",
    description: "Dependable electrical construction for the places our communities count on most.",
  },
  {
    src: `${assetRoot}/hells%20kitchen.jpg`,
    alt: "Reliant Electric hospitality project",
    label: "Hospitality",
    line1: "Power behind",
    line2: "the rush.",
    description: "Coordinated commercial electrical work built around demanding schedules and busy spaces.",
  },
  {
    src: `${assetRoot}/gennybig.jpg`,
    alt: "Large backup generator installed by Reliant Electric",
    label: "Critical power",
    line1: "Backup without",
    line2: "compromise.",
    description: "Critical systems planned and installed to perform when ordinary power cannot.",
  },
  {
    src: "/interior-lighting-project.jpg",
    alt: "Custom linear lighting installed by Reliant Electric",
    label: "Commercial lighting",
    line1: "Details that",
    line2: "define a space.",
    description: "Purposeful lighting installations delivered with the precision of a design-build electrical partner.",
  },
  {
    src: `${assetRoot}/Shop%20Photo%20no%20sign.JPG`,
    alt: "Reliant Electric service trucks outside the Reno shop",
    label: "Local team + fleet",
    line1: "Here when",
    line2: "you need us.",
    description: "A Reno-based crew, a ready fleet and 24/7 emergency service for Northern Nevada.",
  },
];

const knowledge = [
  {
    match: ["service", "do you", "work"],
    answer:
      "Reliant Electric is a design-build electrical construction contractor serving commercial, industrial, hospitality, public-infrastructure and service needs across Northern Nevada.",
  },
  {
    match: ["emergency", "24/7", "after hours"],
    answer:
      "Emergency electrical service is available 24/7. Call Reliant directly at 775-342-2900 for the fastest response.",
  },
  {
    match: ["license", "licensed", "limit"],
    answer:
      "Reliant holds Nevada license #0065968, C-2 Electrical, with a $5M limit.",
  },
  {
    match: ["location", "address", "where"],
    answer:
      "Reliant Electric is at 685 Edison Way, Reno, Nevada 89502, serving projects throughout Northern Nevada.",
  },
  {
    match: ["hour", "open"],
    answer:
      "Office hours are Monday through Friday, 7:00 AM–4:00 PM. Emergency service is available around the clock by phone.",
  },
  {
    match: ["quote", "estimate", "start", "contact"],
    answer:
      "Start with a call to 775-342-2900 or email kyle@reliantreno.com. Share your project type, location and timing so the team can route it quickly.",
  },
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [requestType, setRequestType] = useState("emergency");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi — I’m Reliant Guide. Ask me about services, licensing, hours, emergency support or starting a project.",
    },
  ]);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.14 },
    );
    document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (heroPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(
      () => setHeroIndex((current) => (current + 1) % heroSlides.length),
      5000,
    );
    return () => window.clearInterval(timer);
  }, [heroIndex, heroPaused]);

  const ask = (event: FormEvent) => {
    event.preventDefault();
    const prompt = question.trim();
    if (!prompt) return;
    const lower = prompt.toLowerCase();
    const found = knowledge.find((item) => item.match.some((term) => lower.includes(term)));
    const answer =
      found?.answer ??
      "I can help with Reliant’s services, license, office hours, emergency support, location or starting a quote. For project-specific questions, call 775-342-2900.";
    setMessages((current) => [...current, { role: "user", text: prompt }, { role: "assistant", text: answer }]);
    setQuestion("");
  };

  const scrollGallery = (direction: number) => {
    galleryRef.current?.scrollBy({ left: direction * 460, behavior: "smooth" });
  };

  const submitRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const labels: Record<string, string> = {
      emergency: "Emergency Contact",
      service: "Service Request",
      bid: "Project Bid Request",
    };
    const recipient = requestType === "bid" ? "kyle@reliantreno.com" : "matt@reliantreno.com";
    const subject = `${labels[requestType]} — ${data.get("company") || data.get("name")}`;
    const body = [
      `Request type: ${labels[requestType]}`,
      `Name: ${data.get("name")}`,
      `Company: ${data.get("company") || "Not provided"}`,
      `Phone: ${data.get("phone")}`,
      `Email: ${data.get("email")}`,
      `Project location: ${data.get("location")}`,
      `Requested timing: ${data.get("timing") || "Not provided"}`,
      "",
      "Project or service details:",
      String(data.get("details")),
    ].join("\n");
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <main>
      <div className="topline">
        <span>Emergency service available 24/7</span>
        <a href="tel:+17753422900">775.342.2900</a>
      </div>

      <nav className="nav" aria-label="Main navigation">
        <a className="header-logo" href="#top" aria-label="Reliant Electric home">
          <img src="/reliant-logo.png" alt="Reliant Electric — a design-build contractor" />
        </a>
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <a href="#services" onClick={() => setMenuOpen(false)}>Capabilities</a>
          <a href="#work" onClick={() => setMenuOpen(false)}>Our work</a>
          <a href="#story" onClick={() => setMenuOpen(false)}>20 years</a>
          <a className="service-cta" href="#request-form" onClick={() => setRequestType("service")}>Request service <Arrow /></a>
          <a className="nav-cta mobile-project-cta" href="#request-form" onClick={() => setRequestType("bid")}>Start a project <Arrow /></a>
        </div>
        <a className="nav-cta header-project-cta" href="#request-form" onClick={() => setRequestType("bid")}>Start a project <Arrow /></a>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle menu">
          <span /> <span />
        </button>
      </nav>

      <header
        className={`hero ${heroPaused ? "is-paused" : ""}`}
        id="top"
      >
        <div className="hero-slides" aria-hidden="true">
          {heroSlides.map((slide, index) => (
            <div className={`hero-slide ${index === heroIndex ? "active" : ""}`} key={slide.src}>
              <img src={slide.src} alt="" />
            </div>
          ))}
        </div>
        <div className="hero-shade" />
        <div className="hero-content reveal is-visible" aria-live="polite" key={heroIndex}>
          <div className="eyebrow"><span /> {heroSlides[heroIndex].label} · Northern Nevada</div>
          <h1>{heroSlides[heroIndex].line1}<br /><em>{heroSlides[heroIndex].line2}</em></h1>
          <p>{heroSlides[heroIndex].description}</p>
          <div className="hero-actions">
            <a className="button primary" href="#request-form" onClick={() => setRequestType("emergency")}>Emergency service <Arrow /></a>
            <a className="text-link" href="#work">See our work <span>↓</span></a>
          </div>
        </div>
        <div className="hero-pagination" aria-label="Featured projects">
          {heroSlides.map((slide, index) => (
            <button
              className={`hero-dot ${index === heroIndex ? "active" : ""}`}
              key={slide.label}
              onClick={() => setHeroIndex(index)}
              aria-label={`Show slide ${index + 1}: ${slide.label}`}
              aria-current={index === heroIndex ? "true" : undefined}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
            </button>
          ))}
          <button
            className="hero-pause"
            onClick={() => setHeroPaused((current) => !current)}
            aria-label={heroPaused ? "Resume automatic slides" : "Pause automatic slides"}
          >
            {heroPaused ? "Play" : "Pause"}
          </button>
        </div>
        <div className="hero-proof">
          <div><strong>20</strong><span>Years serving<br />Northern Nevada</span></div>
          <div><strong>$5M</strong><span>Nevada license<br />project limit</span></div>
          <div><strong>24/7</strong><span>Emergency<br />availability</span></div>
        </div>
      </header>

      <section className="intro reveal" id="story">
        <div className="section-kicker">01 / Local by design</div>
        <div>
          <h2>The team you call is the team that shows up.</h2>
          <div className="intro-copy">
            <p>Reliant Electric pairs the planning discipline of a serious construction partner with the accountability of a local business. We communicate, coordinate and stay on the job until the work is complete.</p>
            <p>From complex ground-up construction to service calls that cannot wait, our reputation is connected to every project we energize.</p>
          </div>
        </div>
      </section>

      <section className="work" id="work">
        <div className="work-heading reveal">
          <div>
            <div className="section-kicker light">02 / In the field</div>
            <h2>Work worth<br />looking closer at.</h2>
          </div>
          <div className="gallery-controls" aria-label="Project gallery controls">
            <button onClick={() => scrollGallery(-1)} aria-label="Previous projects">←</button>
            <button onClick={() => scrollGallery(1)} aria-label="Next projects">→</button>
          </div>
        </div>
        <div className="project-track" ref={galleryRef}>
          {projects.map((project, index) => (
            <article className="project-card" key={project.src}>
              <div className="project-image-wrap">
                <img src={project.src} alt={`${project.title} — Reliant Electric project`} loading={index < 2 ? "eager" : "lazy"} />
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="project-meta"><h3>{project.title}</h3><p>{project.tag}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="capabilities" id="services">
        <div className="section-kicker">03 / What we do</div>
        <div className="capability-grid">
          <div className="cap-intro reveal">
            <h2>One partner.<br />Every phase.</h2>
            <p>Practical answers, coordinated execution and work built to perform long after turnover.</p>
            <a className="text-link dark" href="mailto:kyle@reliantreno.com?subject=Capabilities%20inquiry">Talk through your scope <Arrow /></a>
          </div>
          <div className="service-list reveal">
            {[
              ["01", "Design + build", "Constructability, budgeting and electrical planning aligned from day one."],
              ["02", "Commercial construction", "Reliable power and systems for offices, retail, hospitality and community spaces."],
              ["03", "Industrial + infrastructure", "Distribution, equipment, lighting and critical systems for demanding environments."],
              ["04", "Service + emergencies", "Responsive troubleshooting, repairs and around-the-clock emergency availability."],
            ].map(([number, title, copy]) => (
              <article className="service" key={number}>
                <span>{number}</span><h3>{title}</h3><p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="legacy reveal">
        <div className="legacy-number">20</div>
        <div className="legacy-copy">
          <div className="section-kicker light">04 / Two decades here</div>
          <h2>Not just serving<br />Northern Nevada.<br /><em>Part of it.</em></h2>
          <p>Since 2006, Reliant has grown alongside the region—helping local businesses, public facilities and essential operations keep moving.</p>
        </div>
        <div className="license-stamp"><span>NV</span><strong>0065968</strong><small>C-2 Electrical · $5M Limit</small></div>
      </section>

      <section className="contact reveal" id="contact">
        <div>
          <div className="section-kicker">05 / Let’s build</div>
          <h2>Bring us the plans.<br /><em>Or the problem.</em></h2>
        </div>
        <div className="contact-card">
          <div className="contact-primary">
            <p>Tell us where the project is, what you’re building and when you need to move.</p>
            <a className="contact-phone" href="tel:+17753422900">775.342.2900 <Arrow /></a>
            <span>Service available 24/7</span>
            <address>685 Edison Way<br />Reno, Nevada 89502</address>
          </div>
          <div className="contact-info-grid">
            <section className="contact-team" aria-labelledby="contact-team-title">
              <h3 id="contact-team-title">Project contacts</h3>
              <a href="mailto:kyle@reliantreno.com"><strong>Kyle Gardella</strong><span>President</span><small>kyle@reliantreno.com</small></a>
              <a href="mailto:matt@reliantreno.com"><strong>Matt Cottom</strong><span>Service Manager</span><small>matt@reliantreno.com</small></a>
              <a href="mailto:dwalker@reliantreno.com"><strong>David Walker</strong><span>Project Manager</span><small>dwalker@reliantreno.com</small></a>
              <a href="mailto:leif@reliantreno.com"><strong>Leif Burrell</strong><span>Estimator</span><small>leif@reliantreno.com</small></a>
            </section>
            <section className="business-hours" aria-labelledby="business-hours-title">
              <h3 id="business-hours-title">Office hours</h3>
              <dl>
                <div><dt>Monday–Friday</dt><dd>7:00 AM–4:00 PM</dd></div>
                <div><dt>Saturday</dt><dd>Closed</dd></div>
                <div><dt>Sunday</dt><dd>Closed</dd></div>
              </dl>
              <p>Closed on federal and Nevada state holidays.</p>
            </section>
          </div>
        </div>
        <form className="request-form" id="request-form" onSubmit={submitRequest}>
          <div className="request-form-intro">
            <div className="section-kicker light">Choose your next step</div>
            <h3>One form.<br /><em>Direct to our team.</em></h3>
            <p>Select what you need and give us the essential details. We’ll prepare an email for the right Reliant contact.</p>
            {requestType === "emergency" && (
              <a className="urgent-call" href="tel:+17753422900">For immediate help, call 775.342.2900 <Arrow /></a>
            )}
          </div>
          <div className="request-form-fields">
            <fieldset className="request-options">
              <legend>What can we help with?</legend>
              {[
                ["emergency", "Emergency contact", "Urgent electrical problem"],
                ["service", "Request service", "Repair, troubleshooting or maintenance"],
                ["bid", "Start a project bid", "Plans, pricing and project scope"],
              ].map(([value, label, note]) => (
                <label className={requestType === value ? "selected" : ""} key={value}>
                  <input type="radio" name="requestType" value={value} checked={requestType === value} onChange={() => setRequestType(value)} />
                  <span><strong>{label}</strong><small>{note}</small></span>
                </label>
              ))}
            </fieldset>
            <div className="request-fields-grid">
              <label><span>Your name *</span><input name="name" autoComplete="name" required /></label>
              <label><span>Company</span><input name="company" autoComplete="organization" /></label>
              <label><span>Phone *</span><input name="phone" type="tel" autoComplete="tel" required /></label>
              <label><span>Email *</span><input name="email" type="email" autoComplete="email" required /></label>
              <label><span>Project or service location *</span><input name="location" autoComplete="street-address" required /></label>
              <label><span>Requested timing</span><input name="timing" placeholder="Today, this week, bid due date…" /></label>
              <label className="request-details"><span>Tell us what you need *</span><textarea name="details" rows={5} required placeholder="Describe the issue, project scope, plans available and any important deadlines." /></label>
            </div>
            <div className="request-submit-row">
              <p>Your device will open a prepared email addressed to the correct Reliant team member.</p>
              <button type="submit">Prepare request email <Arrow /></button>
            </div>
          </div>
        </form>
      </section>

      <footer>
        <a className="brand footer-brand" href="#top"><span className="brand-mark">R</span><span><b>RELIANT</b><small>ELECTRIC</small></span></a>
        <p>Design-build electrical construction<br />for Northern Nevada.</p>
        <div><span>© 2026 Reliant Electric</span><span>NV #0065968 · C-2</span></div>
      </footer>

      <button className={`assistant-trigger ${assistantOpen ? "active" : ""}`} onClick={() => setAssistantOpen(!assistantOpen)} aria-expanded={assistantOpen} aria-controls="reliant-assistant">
        <span className="pulse" />
        <span><b>Ask Reliant</b><small>Company guide</small></span>
        <span aria-hidden="true">{assistantOpen ? "×" : "↗"}</span>
      </button>

      <aside className={`assistant ${assistantOpen ? "open" : ""}`} id="reliant-assistant" aria-label="Reliant company guide">
        <div className="assistant-head">
          <div><span className="pulse" /><div><b>Reliant Guide</b><small>Company knowledge assistant</small></div></div>
          <button onClick={() => setAssistantOpen(false)} aria-label="Close assistant">×</button>
        </div>
        <div className="assistant-messages" aria-live="polite">
          {messages.map((message, index) => <p className={message.role} key={index}>{message.text}</p>)}
        </div>
        {messages.length < 2 && (
          <div className="quick-questions">
            {["What services do you offer?", "Are you available 24/7?", "How do I start a quote?"].map((item) => (
              <button key={item} onClick={() => setQuestion(item)}>{item}</button>
            ))}
          </div>
        )}
        <form onSubmit={ask}>
          <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask about Reliant…" aria-label="Ask Reliant a question" />
          <button type="submit" aria-label="Send question">↑</button>
        </form>
        <small className="assistant-note">For emergencies, call 775-342-2900.</small>
      </aside>
    </main>
  );
}
