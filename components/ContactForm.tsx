"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

const FIELDS = [
  { name: "name", label: "Full Name", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", type: "tel", required: false },
  { name: "subject", label: "Subject", type: "text", required: false },
] as const;

const floatingLabelSpan =
  "contact-form-control__char";

function FloatingLabel({ htmlFor, label }: { htmlFor: string; label: string }) {
  return (
    <label htmlFor={htmlFor} className="pointer-events-none absolute left-0 top-3.5">
      {label.split("").map((char, index) => (
        <span
          key={`${char}-${index}`}
          className={floatingLabelSpan}
          style={{ transitionDelay: `${index * 18}ms` }}
        >
          {char === " " ? "\u00a0" : char}
        </span>
      ))}
    </label>
  );
}

function keepDigitsOnly(e: React.FormEvent<HTMLInputElement>) {
  e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverMsg, setServerMsg] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrors({});

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) {
        setErrors(json.errors ?? {});
        setServerMsg(json.error ?? "Please check the highlighted fields.");
        setStatus("error");
        return;
      }

      setServerMsg(json.message ?? "Thanks - we'll be in touch.");
      setStatus("success");
      form.reset();
    } catch {
      setServerMsg("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center rounded-2xl border border-accent/30 bg-concrete-900/60 p-12 text-center"
      >
        <CheckCircle2 className="h-12 w-12 text-accent" />
        <h3 className="mt-4 font-heading text-xl font-semibold text-concrete-50">
          Message sent
        </h3>
        <p className="mt-2 max-w-sm text-sm text-concrete-400">{serverMsg}</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-medium text-accent hover:underline"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-concrete-700 bg-concrete-900/60 p-6 sm:p-8"
      noValidate
    >
      <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <div key={f.name} className={cn(f.name === "subject" && "sm:col-span-2")}>
            <div className="contact-form-control relative">
              <input
                id={f.name}
                name={f.name}
                type={f.type}
                inputMode={f.name === "phone" ? "numeric" : undefined}
                pattern={f.name === "phone" ? "[0-9]*" : undefined}
                onInput={f.name === "phone" ? keepDigitsOnly : undefined}
                required={f.required}
                className={cn(
                  "block w-full border-0 border-b-2 bg-transparent px-0 pb-2.5 pt-3.5 text-base text-concrete-50 outline-none transition-colors placeholder:text-transparent focus:border-accent",
                  errors[f.name] ? "border-red-500/70" : "border-concrete-500/70",
                )}
                placeholder=" "
              />
              <FloatingLabel
                htmlFor={f.name}
                label={`${f.label}${f.required ? " *" : ""}`}
              />
            </div>
            {errors[f.name] && (
              <p className="mt-2 text-xs text-red-500">{errors[f.name]}</p>
            )}
          </div>
        ))}

        <div className="sm:col-span-2">
          <div className="contact-form-control relative">
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className={cn(
                "block w-full resize-none border-0 border-b-2 bg-transparent px-0 pb-2.5 pt-3.5 text-base text-concrete-50 outline-none transition-colors placeholder:text-transparent focus:border-accent",
                errors.message ? "border-red-500/70" : "border-concrete-500/70",
              )}
              placeholder=" "
            />
            <FloatingLabel htmlFor="message" label="Message *" />
          </div>
          {errors.message && (
            <p className="mt-2 text-xs text-red-500">{errors.message}</p>
          )}
        </div>
      </div>

      {status === "error" && serverMsg && (
        <p className="mt-4 flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          {serverMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-ink transition-all hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}
