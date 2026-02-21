import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      label: 'Product',
      links: [
        { name: 'Features', href: '#' },
        { name: 'Pricing', href: '#' },
        { name: 'Security', href: '#' },
        { name: 'Roadmap', href: '#' },
      ],
    },
    {
      label: 'Company',
      links: [
        { name: 'About', href: '#' },
        { name: 'Blog', href: '#' },
        { name: 'Careers', href: '#' },
        { name: 'Contact', href: '#' },
      ],
    },
    {
      label: 'Resources',
      links: [
        { name: 'Documentation', href: '#' },
        { name: 'Guides', href: '#' },
        { name: 'API', href: '#' },
        { name: 'Support', href: '#' },
      ],
    },
    {
      label: 'Legal',
      links: [
        { name: 'Privacy', href: '#' },
        { name: 'Terms', href: '#' },
        { name: 'Cookies', href: '#' },
        { name: 'License', href: '#' },
      ],
    },
  ];

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Mail, href: '#', label: 'Email' },
  ];

  return (
    <footer className="border-t border-gray-900 bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Main footer content */}
        <div className="mb-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand section */}
          <div className="lg:col-span-1">
            <h3 className="mb-4 text-lg font-semibold text-white">Smart Job Tracker</h3>
            <p className="text-sm text-gray-400">
              Organize your job search and land your dream role with confidence.
            </p>
          </div>

          {/* Footer link sections */}
          {footerLinks.map((section) => (
            <div key={section.label}>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-300">
                {section.label}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-400 transition-colors hover:text-cyan-400"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mb-8 border-t border-gray-900" />

        {/* Bottom section */}
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          <p className="text-sm text-gray-400">
            © {currentYear} Smart Job Tracker. All rights reserved.
          </p>

          {/* Social links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="text-gray-400 transition-colors hover:text-cyan-400"
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
