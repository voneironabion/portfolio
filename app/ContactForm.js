"use client";

import { useState } from "react";
import { UserIcon, MailIcon, MessageIcon, SendIcon } from "./icons";

// No backend needed: the button opens the visitor's email app with the message filled in.
export default function ContactForm({ to }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function set(key) {
    return (e) => setForm({ ...form, [key]: e.target.value });
  }

  function submit(e) {
    e.preventDefault();
    const subject = encodeURIComponent("Portfolio message from " + form.name);
    const body = encodeURIComponent(
      form.message + "\n\n" + form.name + " (" + form.email + ")"
    );
    window.location.href = "mailto:" + to + "?subject=" + subject + "&body=" + body;
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <label className="field">
        <UserIcon size={18} />
        <input
          type="text"
          placeholder="Your name"
          value={form.name}
          onChange={set("name")}
          required
        />
      </label>
      <label className="field">
        <MailIcon size={18} />
        <input
          type="email"
          placeholder="Your email"
          value={form.email}
          onChange={set("email")}
          required
        />
      </label>
      <label className="field">
        <MessageIcon size={18} />
        <textarea
          placeholder="Your message"
          rows={5}
          value={form.message}
          onChange={set("message")}
          required
        />
      </label>
      <button type="submit" className="btn primary">
        <SendIcon size={16} />
        Send message
      </button>
      <p className="form-note">This opens your email app with the message ready to send.</p>
    </form>
  );
}
