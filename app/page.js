import ThemeToggle from "./ThemeToggle";
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

// Edit these values to fill in your portfolio.
const name = "Von Eiron";
const role = "UI/UX Designer.";
const intro =
  "Interfaces, wireframes, and graphics that make information easy to understand.";
const email = "voneiron.abion@sorsu.edu.ph";

const about =
  "I'm a UI/UX design student who plans every screen with wireframes before polishing it in Figma. Outside of interfaces, I design pubmats and infographics as a PRO, turning information into visuals people want to read.";

// Set image to a file in /public, e.g. "/ss1.png"
const project = {
  title: "Yale School of Art, redesign",
  text: "A redesign of the Yale School of Art website, focused on clearer navigation and a cleaner layout. Designed in Figma.",
  tags: ["Figma", "UI design", "Wireframing"],
  image: "/ss1.png",
  href: "#",
};

const tools = [
  { name: "Figma", Icon: SiFigma },
  { name: "Canva", Icon: CanvaIcon },
  { name: "Photoshop", Icon: PhotoshopIcon },
  { name: "Other tool", Icon: null },
];

// Images live in /public/works
const canvaWorks = [
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

const socials = [
  { label: "GitHub", href: "https://github.com/voneironabion", Icon: FaGithub },
  { label: "Facebook", href: "https://www.facebook.com/voneiron.abion", Icon: FaFacebookF },
  { label: "Instagram", href: "https://www.instagram.com/vrnnnbn/", Icon: FaInstagram },
];

export default function Home() {
  return (
    <>
      <header>
        <div className="wrap">
          <a className="mark" href="#top" aria-label="Back to top">
            <i></i>
          </a>
          <nav>
            <a href="#about">About</a>
            <a href="#work">Work</a>
            <a href="#graphics">Graphics</a>
            <a href="#tools">Tools</a>
            <a href="#contact">Contact</a>
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <main id="top">
        <div className="wrap">
          <div className="hero">
            <div className="status">
              <i></i>Designing clarity, one screen at a time.
            </div>
            <h1>
              {name}
              <span>{role}</span>
            </h1>
            <p>{intro}</p>
          </div>
        </div>

        <div className="wrap">
          <section id="about">
            <div className="row">
              <h2>About</h2>
              <p className="about">{about}</p>
            </div>
          </section>

          <section id="work">
            <div className="row">
              <h2>UI/UX Design</h2>
              <div>
                <a className="feature" href={project.href}>
                  <div className="ph feature-img">
                    {project.image ? (
                      <img src={project.image} alt={project.title} />
                    ) : (
                      "Add your Figma screenshots here"
                    )}
                  </div>
                  <div className="feature-meta">
                    <div>
                      <h3>{project.title}</h3>
                      <p>{project.text}</p>
                    </div>
                    <div className="tags">
                      {project.tags.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                  </div>
                </a>
                <div className="ph soon">More projects coming soon</div>
              </div>
            </div>
          </section>

          <section id="graphics">
            <div className="row">
              <h2>Graphic Design</h2>
              <div>
                {canvaWorks.map((group) => (
                  <div className="group" key={group.category}>
                    <h3 className="group-title">{group.category}</h3>
                    <div
                      className={
                        group.category === "Pubmats" ? "gallery pubmats" : "gallery"
                      }
                    >
                      {group.items.map((item, i) => (
                        <figure className="work" key={i}>
                          <div className="ph work-img">
                            {item.image ? (
                              <img src={item.image} alt={item.title} />
                            ) : (
                              "Add image"
                            )}
                          </div>
                          <figcaption>{item.title}</figcaption>
                        </figure>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="tools">
            <div className="row">
              <h2>Tools</h2>
              <div className="tools">
                {tools.map(({ name, Icon }) => (
                  <div className={Icon ? "tool" : "tool empty"} key={name}>
                    {Icon && <Icon size={28} />}
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="skills">
            <div className="row">
              <h2>Skills</h2>
              <div className="chips">
                {skills.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </div>
          </section>

          <section id="activities">
            <div className="row">
              <h2>Experiences</h2>
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
          </section>

          <section id="contact" className="contact">
            <div className="row">
              <h2>Contact</h2>
              <div>
                <a className="email" href={`mailto:${email}`}>
                  {email}
                </a>
                <div className="socials">
                  {socials.map(({ label, href, Icon }) => (
                    <a href={href} key={label} aria-label={label}>
                      <Icon size={18} />
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