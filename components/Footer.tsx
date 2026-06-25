import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin } from "lucide-react";
import { SITE } from "@/data/site";
import { SERVICES } from "@/data/services";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-concrete-700/60 bg-concrete-900">
      <div className="section-shell relative grid grid-cols-2 gap-x-6 gap-y-10 py-16 md:grid-cols-12 md:gap-12">
        {/* Brand */}
        <div className="col-span-2 md:col-span-4">
          <Link href="/#home" className="inline-block">
            <Image
              src={SITE.logo.full}
              alt={SITE.name}
              width={380}
              height={256}
              sizes="(max-width: 768px) 160px, 192px"
              className="h-auto w-40 sm:w-44 md:w-48"
              priority
            />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-concrete-400">
            {SITE.description}
          </p>
        </div>

        {/* Quick links */}
        <div className="md:col-span-2">
          <h4 className="font-heading text-sm font-semibold text-concrete-50">
            Company
          </h4>
          <ul className="mt-4 space-y-2.5">
            {SITE.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-concrete-400 transition-colors hover:text-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Competencies */}
        <div className="md:col-span-3">
          <h4 className="font-heading text-sm font-semibold text-concrete-50">
            Competencies
          </h4>
          <ul className="mt-4 space-y-2.5">
            {SERVICES.map((s) => (
              <li key={s.id}>
                <Link
                  href="/#services"
                  className="text-sm text-concrete-400 transition-colors hover:text-accent"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="col-span-2 md:col-span-3">
          <h4 className="font-heading text-sm font-semibold text-concrete-50">
            Contact
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-concrete-400">
            {SITE.contact.addresses.map((address) => (
              <li key={address.label} className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>
                  <strong className="block font-medium text-concrete-300">
                    {address.label}
                  </strong>
                  {address.value}
                </span>
              </li>
            ))}
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-accent" />
              <a
                href={`mailto:${SITE.contact.email}`}
                className="break-all hover:text-accent"
              >
                {SITE.contact.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="section-shell relative flex justify-center border-t border-concrete-700/60 py-6 text-xs text-concrete-500">
        <p>
          © {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
