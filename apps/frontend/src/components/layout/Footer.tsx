import Link from "next/link";
import { Shield } from "lucide-react";
import { FaGithub, FaTwitter, FaLinkedin, FaEnvelope } from "react-icons/fa";

const footerLinks = {
  Product: [
    { label: "Dashboard",       href: "/dashboard"            },
    { label: "Tasks",           href: "/dashboard/tasks"      },
    { label: "Analytics",       href: "/dashboard/analytics"  },
    { label: "Admin",           href: "/dashboard/admin"      },
  ],
  Account: [
    { label: "Sign In",         href: "/auth/login"           },
    { label: "Register",        href: "/auth/register"        },
    { label: "Profile",         href: "/dashboard/profile"    },
    { label: "Forgot Password", href: "/auth/forgot-password" },
  ],
  Legal: [
    { label: "Privacy Policy",  href: "#" },
    { label: "Terms of Use",    href: "#" },
    { label: "Cookie Policy",   href: "#" },
    { label: "Support",         href: "#" },
  ],
};

const socials = [
  {
    label: "GitHub",
    href:  "https://github.com/adeoluwaadeoye",
    icon:  <FaGithub className="h-4 w-4" />,
  },
  {
    label: "Twitter",
    href:  "https://twitter.com",
    icon:  <FaTwitter className="h-4 w-4" />,
  },
  {
    label: "LinkedIn",
    href:  "https://linkedin.com",
    icon:  <FaLinkedin className="h-4 w-4" />,
  },
  {
    label: "Email",
    href:  "mailto:adeoluwaadeoye7@gmail.com",
    icon:  <FaEnvelope className="h-4 w-4" />,
  },
];

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-6xl px-4 md:px-6">

        {/* ── TOP SECTION ──────────────────────────────── */}
        <div className="py-10 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">

          {/* BRAND COLUMN — full width on mobile & tablet */}
          <div className="col-span-2 lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-base">AdminHub</span>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              A full-stack task management platform built with Next.js,
              Express, and MongoDB. Secure, real-time, and production-ready.
            </p>

            {/* SOCIAL ICONS */}
            <div className="flex items-center gap-2">
              {socials.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="h-8 w-8 flex items-center justify-center rounded-lg border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  {s.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* LINK COLUMNS — 1 col each on tablet, side by side */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className="col-span-1 space-y-3">
              <p className="text-sm font-semibold text-foreground">
                {section}
              </p>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* ── DIVIDER ───────────────────────────────────── */}
        <div className="border-t" />

        {/* ── BOTTOM SECTION ───────────────────────────── */}
        <div className="py-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">

          {/* COPYRIGHT */}
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            © {new Date().getFullYear()} AdminHub. All rights reserved. Built by{" "}
            <Link
              href="https://adeoluwaadeoye.netlify.app"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600 hover:text-indigo-700 transition-colors font-medium"
            >
              Adeoluwa Adeoye
            </Link>
          </p>

          {/* STATUS */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            All systems operational
          </div>

        </div>
      </div>
    </footer>
  );
}