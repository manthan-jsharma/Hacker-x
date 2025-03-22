"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, Instagram, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".footer-content",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="bg-black border-t border-gray-800 pt-16 pb-8"
    >
      <div className="container mx-auto px-4">
        <div className="footer-content grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          <div>
            <h3 className="text-xl font-bold mb-4">HackSphere</h3>
            <p className="text-gray-400 mb-6">
              The world's largest hackathon, bringing together innovators to
              build the future.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="#about"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#prizes"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Prizes
                </Link>
              </li>
              <li>
                <Link
                  href="#sponsors"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Sponsors
                </Link>
              </li>
              <li>
                <Link
                  href="#judges"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Judges
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Schedule
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Rules
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Workshops
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  API Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Past Winners
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Code of Conduct
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for the latest updates and
              announcements.
            </p>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Your email address"
                className="bg-gray-900 border-gray-700"
              />
              <Button className="w-full bg-primary hover:bg-primary/90 text-black font-medium">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="footer-content pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} HackSphere. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link
              href="#"
              className="text-gray-400 hover:text-primary transition-colors text-sm"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-primary transition-colors text-sm"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-primary transition-colors text-sm"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
