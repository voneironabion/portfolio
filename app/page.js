import GlassFX from "./GlassFX";
import Particles from "./Particles";
import Lanyard from "./Lanyard";
import Showcase from "./Showcase";
import ContactForm from "./ContactForm";
import {
  MailIcon,
  ArrowIcon,
  CodeIcon,
  AwardIcon,
  ImageIcon,
  DownloadIcon,
} from "./icons";
import { SiFigma } from "react-icons/si";
import { FaGithub, FaFacebookF, FaInstagram } from "react-icons/fa6";

// Simple stand-in icon for Canva
function CanvaIcon({ size = 28 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="13" />
      <path d="M21 12.5a6 6 0 1 0 0 7" strokeLinecap="round" />
    </svg>
  );
}

// Simple "Ps" badge for Photoshop
function PhotoshopIcon({ size = 28 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="26" height="26" rx="6" />
      <text
        x="16"
        y="21.5"
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fill="currentColor"
        stroke="none"
        fontFamily="system-ui, sans-serif"
      >
        Ps
      </text>
    </svg>
  );
}

/* ================= EDIT YOUR CONTENT HERE ================= */

const name = "Von Eiron";
const fullName = "Von Eiron Abion";
const role = "UI/UX Designer.";
const intro =
  "Interfaces, wireframes, and graphics that make information easy to understand.";
const email = "voneiron.abion@sorsu.edu.ph";

// Your photos: put the files in /public and set the path, e.g. "/me.jpg"
const idPhoto = "/me.png"; // photo on the ID card
const aboutPhoto = "/me.png"; // round photo in About

// Put your CV in /public as cv.pdf, then set cvHref to "/cv.pdf"
const cvHref = "#";

const heroTags = ["Figma", "Wireframing", "Canva"];

// Placeholder text, replace with your own
const bio =
  "I'm a UI/UX design student who loves turning complicated ideas into clean, easy-to-use interfaces. I start with wireframes, refine every screen in Figma, and bring the same eye for detail to the posters and infographics I make as a Public Relations Officer.";
const quote = "Turning ideas into clean, thoughtful, and meaningful design.";

// UI/UX projects. Images live in /public
const projects = [
  {
    title: "Yale School of Art, redesign",
    text: "A redesign of the Yale School of Art website, focused on clearer navigation and a cleaner layout. Designed in Figma.",
    tags: ["Figma", "UI design", "Wireframing"],
    image: "/ss1.png",
    href: "#", // your Figma link
  },
];

// Graphic design. Images live in /public/works
const works = [
  {
    category: "Pubmats",
    items: [
      { title: "Back to School", image: "/works/pm1.png" },
      { title: "Independence Day", image: "/works/pm2.png" },
      { title: "Chinese New Year", image: "/works/pm3.png" },
      { title: "National Heroes Day", image: "/works/pm4.png" },
    ],
  },
  {
    category: "Infographics",
    items: [
      { title: "Ngiting SorSUeño", image: "/works/ig1.png" },
      { title: "Local Farmers", image: "/works/ig2.png" },
    ],
  },
];

// Certificates and awards. Put the images in /public/certificates
// and change each title to the real name of the certificate
const certificates = [
  { title: "Certificate 1", image: "/certificates/cert1.jpg" },
  { title: "Certificate 2", image: "/certificates/cert2.jpg" },
  { title: "Certificate 3", image: "/certificates/cert3.jpg" },
  { title: "TOPCIT", image: "/certificates/topcit.jpg" },
];

const tools = [
  { name: "Figma", Icon: SiFigma },
  { name: "Canva", Icon: CanvaIcon },
  { name: "Photoshop", Icon: PhotoshopIcon },
  { name: "Other tool", Icon: null },
];

const skills = [
  "UI design",
  "Wireframing",
  "Visual design",
  "Layout and typography",
  "Color and style",
  "Prototyping",
];

const activities = [
  {
    role: "Public Relations Officer",
    org: "SorSU-BC CRCYC",
    time: "A.Y 2024-2026",
  },
];

const connect = [
  { label: "Email", handle: email, href: "mailto:" + email, Icon: MailIcon },
  { label: "GitHub", handle: "@voneironabion", href: "https://github.com/voneironabion", Icon: FaGithub },
  { label: "Facebook", handle: "voneiron.abion", href: "https://www.facebook.com/voneiron.abion", Icon: FaFacebookF },
  { label: "Instagram", handle: "@vrnnnbn", href: "https://www.instagram.com/vrnnnbn/", Icon: FaInstagram },
];

/* ========================================================== */

const graphicCount = works.reduce((n, g) => n + g.items.length, 0);

const stats = [
  { label: "Projects", value: projects.length, Icon: CodeIcon },
  { label: "Certificates", value: certificates.length, Icon: AwardIcon },
  { label: "Graphic works", value: graphicCount, Icon: ImageIcon },
];

export default function Home() {
  return (
    <>
      <GlassFX />
      <Particles />

      <header>
        <div className="wrap">
          <nav aria-label="Main">
            <span className="nav-ind" aria-hidden="true"></span>
            <a href="#top">Home</a>
            <a href="#about">About</a>
            <a href="#portfolio">Portfolio</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <main>
        {/* ---------- HOME ---------- */}
        <div className="home" id="top">
          <div className="wrap">
            <div className="home-copy">
              <h1>
                {name}
                <span>{role}</span>
              </h1>
              <p className="intro">{intro}</p>
              <div className="chips hero-tags">
                {heroTags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          <Lanyard photo={idPhoto} name={name} role="UI/UX Designer" />
        </div>

        <div className="wrap">
          {/* ---------- ABOUT ---------- */}
          <section id="about">
            <div className="about-top">
              <div className="about-copy">
                <span className="kicker">About me</span>
                <h2 className="about-name">{fullName}</h2>
                <p>{bio}</p>
                <p className="quote">“{quote}”</p>
                <div className="btns">
                  <a className="btn primary" href={cvHref}>
                    <DownloadIcon size={16} />
                    Download CV
                  </a>
                  <a className="btn ghost" href="#portfolio">
                    <ArrowIcon size={16} />
                    View Portfolio
                  </a>
                </div>
              </div>

              <div className="about-photo">
                {aboutPhoto ? <img src={aboutPhoto} alt={fullName} /> : "Your photo"}
              </div>
            </div>

            <div className="stats">
              {stats.map(({ label, value, Icon }) => (
                <a className="stat" href="#portfolio" key={label}>
                  <span className="stat-ic">
                    <Icon size={18} />
                  </span>
                  <b className="stat-n">{value}</b>
                  <span className="stat-l">{label}</span>
                  <span className="stat-ar">
                    <ArrowIcon size={16} />
                  </span>
                </a>
              ))}
            </div>

            <div className="about-more">
              <div>
                <h3 className="sub-title">Experiences</h3>
                <div className="list">
                  {activities.map((a) => (
                    <div className="item" key={a.role + a.org}>
                      <div>
                        <h3>{a.role}</h3>
                        <p>{a.org}</p>
                      </div>
                      <span>{a.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="sub-title">Skills</h3>
                <div className="chips">
                  {skills.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="sub-title">Tools</h3>
                <div className="tools">
                  {tools.map(({ name, Icon }) => (
                    <div className={Icon ? "tool" : "tool empty"} key={name}>
                      {Icon && <Icon size={28} />}
                      <span>{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ---------- PORTFOLIO SHOWCASE ---------- */}
          <section id="portfolio">
            <Showcase projects={projects} works={works} certificates={certificates} />
          </section>

          {/* ---------- CONTACT ---------- */}
          <section id="contact">
            <div className="contact-head">
              <h2 className="contact-title">Get in touch</h2>
              <p>Have something in mind? Send a message and let's connect.</p>
            </div>

            <div className="contact-grid">
              <div>
                <h3 className="col-title">Send a message</h3>
                <ContactForm to={email} />
              </div>

              <div>
                <h3 className="col-title">Connect with me</h3>
                <div className="connect">
                  {connect.map(({ label, handle, href, Icon }) => (
                    <a
                      className="connect-row"
                      href={href}
                      key={label}
                      target={label === "Email" ? undefined : "_blank"}
                      rel="noopener noreferrer"
                    >
                      <span className="connect-ic">
                        <Icon size={18} />
                      </span>
                      <span className="connect-t">
                        <b>{label}</b>
                        <span>{handle}</span>
                      </span>
                      <span className="connect-ar">
                        <ArrowIcon size={16} />
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer>
        <div className="wrap">
          © {new Date().getFullYear()} {name}
        </div>
      </footer>
    </>
  );
}
