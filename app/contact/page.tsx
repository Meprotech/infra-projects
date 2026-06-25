import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock, type LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/ui/Reveal";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with our team about water, sewerage, irrigation and environmental infrastructure projects.",
};

interface ContactDetail {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}

const DETAILS: ContactDetail[] = [
  ...SITE.contact.addresses.map((address) => ({
    icon: MapPin,
    label: address.label,
    value: address.value,
  })),
  ...SITE.contact.phones.map((phone, index) => ({
    icon: Phone,
    label: index === 0 ? "Primary Phone" : "Alternate Phone",
    value: phone.label,
    href: `tel:${phone.href}`,
  })),
  {
    icon: Mail,
    label: "Email",
    value: SITE.contact.email,
    href: `mailto:${SITE.contact.email}`,
  },
  { icon: Clock, label: "Hours", value: "Mon–Sat, 9:30am – 6:30pm IST" },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's talk about your *project*."
        description="Share the details and our engineering team will respond with a clear next step."
      />

      <section className="bg-concrete-950 py-16 md:py-24">
        <div className="section-shell grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          {/* Details */}
          <Reveal>
            <div className="space-y-6">
              {DETAILS.map((d) => {
                const Icon = d.icon;
                return (
                  <div key={d.label} className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/20">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-concrete-500">
                        {d.label}
                      </p>
                      {d.href ? (
                        <a
                          href={d.href}
                          className="mt-0.5 block text-base text-concrete-50 hover:text-accent"
                        >
                          {d.value}
                        </a>
                      ) : (
                        <p className="mt-0.5 text-base text-concrete-50">{d.value}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
