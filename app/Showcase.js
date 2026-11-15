"use client";

import { useCallback, useEffect, useState } from "react";

const TABS = ["Projects", "Certificates / Awards"];

export default function Showcase({ projects, works, certificates }) {
  const [tab, setTab] = useState(0);
  const [view, setView] = useState(null); // { list: [{ src, title }], index }

  // every image on the Projects tab, in order, for the full-screen viewer
  const projectList = [
    ...projects.filter((p) => p.image).map((p) => ({ src: p.image, title: p.title })),
    ...works.flatMap((g) =>
      g.items.filter((i) => i.image).map((i) => ({ src: i.image, title: i.title }))
    ),
  ];
  const certList = certificates
    .filter((c) => c.image)
    .map((c) => ({ src: c.image, title: c.title }));

  function openImage(list, src) {
    const index = Math.max(0, list.findIndex((x) => x.src === src));
    setView({ list, index });
  }

  const close = useCallback(() => setView(null), []);
  const step = useCallback(
    (d) =>
      setView((v) =>
        v ? { ...v, index: (v.index + d + v.list.length) % v.list.length } : v
      ),
    []
  );

  const isOpen = view !== null;
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, close, step]);

  const current = view ? view.list[view.index] : null;

  return (
    <>
      <div className="showcase-head">
        <h2 className="showcase-title">Portfolio Showcase</h2>
        <p>Explore my journey through projects, certificates, and awards.</p>
      </div>

      <div className="tab-bar" role="tablist" data-active={tab}>
        <span className="tab-ind" aria-hidden="true"></span>
        {TABS.map((t, i) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === i}
            className={tab === i ? "on" : ""}
            onClick={() => setTab(i)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="tab-content" key={tab}>
        {tab === 0 ? (
          <>
            <div className="group">
              <h3 className="group-title">UI/UX Design</h3>
              {projects.map((p) => (
                <div className="feature" key={p.title}>
                  <button
                    type="button"
                    className="work-open"
                    disabled={!p.image}
                    onClick={() => openImage(projectList, p.image)}
                    aria-label={"View " + p.title + " full screen"}
                  >
                    <div className="ph feature-img">
                      {p.image ? (
                        <img src={p.image} alt={p.title} />
                      ) : (
                        "Add your Figma screenshots here"
                      )}
                    </div>
                  </button>
                  <div className="feature-meta">
                    <div>
                      <h3>{p.title}</h3>
                      <p>{p.text}</p>
                      {p.href && p.href !== "#" && (
                        <a
                          className="btn ghost small"
                          href={p.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View in Figma
                        </a>
                      )}
                    </div>
                    <div className="tags">
                      {p.tags.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              <div className="ph soon">More projects coming soon</div>
            </div>

            {works.map((group) => (
              <div className="group" key={group.category}>
                <h3 className="group-title">{group.category}</h3>
                <div
                  className={
                    group.category === "Pubmats" ? "gallery pubmats" : "gallery"
                  }
                >
                  {group.items.map((item, i) => (
                    <figure className="work" key={i}>
                      <button
                        type="button"
                        className="work-open"
                        disabled={!item.image}
                        onClick={() => openImage(projectList, item.image)}
                        aria-label={"View " + item.title + " full screen"}
                      >
                        <div className="ph work-img">
                          {item.image ? (
                            <img src={item.image} alt={item.title} />
                          ) : (
                            "Add image"
                          )}
                        </div>
                      </button>
                      <figcaption>{item.title}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="certs">
            {certificates.map((c, i) => (
              <figure className="work" key={i}>
                <button
                  type="button"
                  className="work-open"
                  disabled={!c.image}
                  onClick={() => openImage(certList, c.image)}
                  aria-label={"View " + c.title + " full screen"}
                >
                  <div className="ph cert-img">
                    {c.image ? <img src={c.image} alt={c.title} /> : "Certificate image"}
                  </div>
                </button>
                <figcaption>{c.title}</figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>

      {current && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={current.title}
          onClick={close}
        >
          <button
            type="button"
            className="lb-btn lb-close"
            aria-label="Close"
            onClick={close}
          >
            ✕
          </button>
          {view.list.length > 1 && (
            <>
              <button
                type="button"
                className="lb-btn lb-prev"
                aria-label="Previous"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
              >
                ‹
              </button>
              <button
                type="button"
                className="lb-btn lb-next"
                aria-label="Next"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
              >
                ›
              </button>
            </>
          )}
          <figure className="lb-fig" onClick={(e) => e.stopPropagation()}>
            <img src={current.src} alt={current.title} />
            <figcaption>{current.title}</figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
