"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const sponsorTiers = [
  {
    tier: "Platinum",
    sponsors: [
      { name: "TechGiant", logo: "/logo3.png" },
      { name: "InnovateCorp", logo: "/logo2.png" },
    ],
  },
  {
    tier: "Gold",
    sponsors: [
      { name: "FutureTech", logo: "/logo4.png" },
      { name: "DevSolutions", logo: "/logo1.png" },
      { name: "CloudSystems", logo: "/logo7.png" },
    ],
  },
  {
    tier: "Silver",
    sponsors: [
      { name: "CodeLabs", logo: "/logo5.png" },
      { name: "DataSphere", logo: "/logo6.png" },
      { name: "AIVentures", logo: "/logo9.png" },
      { name: "WebPioneers", logo: "/logo8.png" },
    ],
  },
];

const benefits = [
  "Direct access to 5,000+ top tech talents",
  "Brand visibility to a global audience of innovators",
  "Opportunity to showcase your API/products to developers",
  "Recruitment pipeline for identifying exceptional talent",
  "Mentorship opportunities to connect with participants",
  "Product feedback from fresh perspectives",
];

export default function Sponsors() {
  const sectionRef = useRef<HTMLElement>(null);
  const sponsorsRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);
  const [activeSponsors, setActiveSponsors] = useState<{
    [key: string]: boolean;
  }>({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Handle mouse movement for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate section title with text reveal
      const titleSplit = new SplitText(".sponsors-title", { type: "chars" });

      gsap.fromTo(
        titleSplit.chars,
        {
          opacity: 0,
          y: 100,
          rotationX: -90,
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          stagger: 0.02,
          duration: 1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );

      // Animate sponsor tiers with staggered reveal
      gsap.fromTo(
        ".sponsor-tier",
        {
          y: 100,
          opacity: 0,
          clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
        },
        {
          y: 0,
          opacity: 1,
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          stagger: 0.3,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sponsorsRef.current,
            start: "top 70%",
          },
        }
      );

      // Create a timeline for each sponsor tier
      sponsorTiers.forEach((tier, tierIndex) => {
        // Animate sponsor logos with floating effect
        tier.sponsors.forEach((sponsor, sponsorIndex) => {
          const logoElement = document.querySelector(
            `.sponsor-logo-${tierIndex}-${sponsorIndex}`
          );

          if (logoElement) {
            // Random floating animation
            gsap.to(logoElement, {
              y: "random(-10, 10)",
              x: "random(-5, 5)",
              rotation: "random(-5, 5)",
              duration: "random(3, 5)",
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });

            // Hover animation setup
            logoElement.addEventListener("mouseenter", () => {
              setActiveSponsors((prev) => ({
                ...prev,
                [`${tierIndex}-${sponsorIndex}`]: true,
              }));

              gsap.to(logoElement, {
                scale: 1.05,
                boxShadow: "0 20px 30px rgba(0, 0, 0, 0.2)",
                borderColor: "#00FFAA",
                duration: 0.3,
              });
            });

            logoElement.addEventListener("mouseleave", () => {
              setActiveSponsors((prev) => ({
                ...prev,
                [`${tierIndex}-${sponsorIndex}`]: false,
              }));

              gsap.to(logoElement, {
                scale: 1,
                boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
                borderColor: "rgba(75, 85, 99, 0.8)",
                duration: 0.3,
              });
            });
          }
        });
      });

      // Animate benefits with staggered reveal and icon animation
      gsap.fromTo(
        ".benefit-item",
        {
          x: -50,
          opacity: 0,
          clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)",
        },
        {
          x: 0,
          opacity: 1,
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          stagger: 0.1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: benefitsRef.current,
            start: "top 70%",
          },
        }
      );

      // Animate the benefits icons
      gsap.fromTo(
        ".benefit-icon",
        {
          scale: 0,
          rotation: -30,
        },
        {
          scale: 1,
          rotation: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: "back.out(1.7)",
          delay: 0.3,
          scrollTrigger: {
            trigger: benefitsRef.current,
            start: "top 70%",
          },
        }
      );

      // Create a pulsing animation for the CTA button
      gsap.to(".sponsor-cta-button", {
        boxShadow: "0 0 30px rgba(0, 255, 170, 0.5)",
        repeat: -1,
        yoyo: true,
        duration: 2,
        ease: "sine.inOut",
      });

      // Create a floating animation for the packages card
      gsap.to(".packages-card", {
        y: 10,
        repeat: -1,
        yoyo: true,
        duration: 3,
        ease: "sine.inOut",
      });
    });

    return () => ctx.revert();
  }, []);

  // Parallax effect based on mouse position
  useEffect(() => {
    // Apply parallax effect to sponsor logos
    document.querySelectorAll(".sponsor-logo").forEach((logo) => {
      gsap.to(logo, {
        x: mousePosition.x * 20,
        y: mousePosition.y * 20,
        duration: 1,
        ease: "power2.out",
      });
    });
  }, [mousePosition]);

  return (
    <section ref={sectionRef} className="py-20 bg-black relative" id="sponsors">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>

        {/* Circuit board pattern */}
        <svg
          className="absolute inset-0 w-full h-full z-0 opacity-10"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <pattern
            id="grid"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 10 0 L 0 0 0 10"
              fill="none"
              stroke="rgba(0, 255, 170, 0.5)"
              strokeWidth="0.2"
            />
          </pattern>
          <rect width="100" height="100" fill="url(#grid)" />

          {/* Random connection lines */}
          <path
            d="M10,10 L30,30 L50,20 L70,40 L90,30"
            stroke="rgba(0, 255, 170, 0.8)"
            strokeWidth="0.3"
            fill="none"
          />
          <path
            d="M10,50 L30,40 L50,60 L70,50 L90,70"
            stroke="rgba(0, 255, 170, 0.8)"
            strokeWidth="0.3"
            fill="none"
          />
          <path
            d="M10,90 L30,70 L50,80 L70,60 L90,50"
            stroke="rgba(0, 255, 170, 0.8)"
            strokeWidth="0.3"
            fill="none"
          />
        </svg>
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="sponsors-title text-4xl md:text-5xl font-bold mb-6">
            Our <span className="text-primary">Sponsors</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-300">
            HackSphere is made possible by the generous support of
            industry-leading companies committed to fostering innovation.
          </p>
        </div>

        {/* Sponsors Grid with Interactive Elements */}
        <div ref={sponsorsRef} className="mb-20 space-y-16">
          {sponsorTiers.map((tier, tierIndex) => (
            <div key={tierIndex} className="sponsor-tier">
              <h3 className="text-2xl font-bold mb-8 text-center">
                <span
                  className={`
                  ${tier.tier === "Platinum" ? "text-gray-100 relative" : ""}
                  ${tier.tier === "Gold" ? "text-yellow-400 relative" : ""}
                  ${tier.tier === "Silver" ? "text-gray-400 relative" : ""}
                `}
                >
                  {tier.tier} Sponsors
                  {/* Decorative underline */}
                  <span
                    className={`absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r 
                    ${
                      tier.tier === "Platinum"
                        ? "from-white/0 via-white to-white/0"
                        : ""
                    }
                    ${
                      tier.tier === "Gold"
                        ? "from-yellow-400/0 via-yellow-400 to-yellow-400/0"
                        : ""
                    }
                    ${
                      tier.tier === "Silver"
                        ? "from-gray-400/0 via-gray-400 to-gray-400/0"
                        : ""
                    }
                  `}
                  ></span>
                </span>
              </h3>

              <div
                className={`
                grid gap-8 justify-items-center
                ${tier.tier === "Platinum" ? "grid-cols-1 md:grid-cols-2" : ""}
                ${tier.tier === "Gold" ? "grid-cols-2 md:grid-cols-3" : ""}
                ${tier.tier === "Silver" ? "grid-cols-2 md:grid-cols-4" : ""}
              `}
              >
                {tier.sponsors.map((sponsor, sponsorIndex) => (
                  <div
                    key={sponsorIndex}
                    className={`
                      sponsor-logo sponsor-logo-${tierIndex}-${sponsorIndex}
                      bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800 
                      hover:border-primary/50 transition-all duration-300 p-6 flex flex-col items-center justify-center
                      relative overflow-hidden transform perspective-800
                      ${tier.tier === "Platinum" ? "w-full h-48" : ""}
                      ${tier.tier === "Gold" ? "w-full h-36" : ""}
                      ${tier.tier === "Silver" ? "w-full h-28" : ""}
                    `}
                  >
                    {/* Animated background */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300
                      ${
                        tier.tier === "Platinum"
                          ? "from-white/5 to-white/0"
                          : ""
                      }
                      ${
                        tier.tier === "Gold"
                          ? "from-yellow-400/5 to-yellow-400/0"
                          : ""
                      }
                      ${
                        tier.tier === "Silver"
                          ? "from-gray-400/5 to-gray-400/0"
                          : ""
                      }
                      ${
                        activeSponsors[`${tierIndex}-${sponsorIndex}`]
                          ? "opacity-100"
                          : ""
                      }
                    `}
                    ></div>

                    {/* Animated particles */}
                    {activeSponsors[`${tierIndex}-${sponsorIndex}`] && (
                      <div className="absolute inset-0 overflow-hidden">
                        {[...Array(10)].map((_, i) => (
                          <div
                            key={i}
                            className={`
                              absolute rounded-full
                              ${tier.tier === "Platinum" ? "bg-white/30" : ""}
                              ${tier.tier === "Gold" ? "bg-yellow-400/30" : ""}
                              ${tier.tier === "Silver" ? "bg-gray-400/30" : ""}
                            `}
                            style={{
                              width: `${Math.random() * 10 + 5}px`,
                              height: `${Math.random() * 10 + 5}px`,
                              top: `${Math.random() * 100}%`,
                              left: `${Math.random() * 100}%`,
                              animation: `floatParticle ${
                                Math.random() * 3 + 2
                              }s linear infinite`,
                            }}
                          ></div>
                        ))}
                      </div>
                    )}

                    <Image
                      src={sponsor.logo || "/placeholder.svg"}
                      alt={sponsor.name}
                      width={
                        tier.tier === "Platinum"
                          ? 200
                          : tier.tier === "Gold"
                          ? 150
                          : 100
                      }
                      height={
                        tier.tier === "Platinum"
                          ? 80
                          : tier.tier === "Gold"
                          ? 60
                          : 40
                      }
                      className="mb-4 opacity-90 hover:opacity-100 transition-opacity duration-300 relative z-10"
                    />
                    <p className="text-center font-medium relative z-10">
                      {sponsor.name}
                    </p>

                    {/* Decorative corner elements */}
                    <div className="absolute top-2 right-2 w-6 h-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <svg
                        viewBox="0 0 100 100"
                        className="w-full h-full text-primary"
                      >
                        <path
                          d="M0,0 L100,0 L100,20 L20,20 L20,100 L0,100 Z"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="5"
                        />
                      </svg>
                    </div>
                    <div className="absolute bottom-2 left-2 w-6 h-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <svg
                        viewBox="0 0 100 100"
                        className="w-full h-full text-primary"
                      >
                        <path
                          d="M100,100 L0,100 L0,80 L80,80 L80,0 L100,0 Z"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="5"
                        />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Sponsorship Benefits with Interactive Elements */}
        <div
          ref={benefitsRef}
          className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center"
        >
          <div>
            <h3 className="text-2xl font-bold mb-6">Why Sponsor HackSphere?</h3>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="benefit-item flex items-start group">
                  <div className="benefit-icon mr-3 mt-1 text-primary flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 group-hover:scale-110 transition-transform duration-300"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Button className="sponsor-cta-button bg-primary hover:bg-primary/90 text-black font-bold px-6 py-5 rounded-full relative overflow-hidden group">
                <span className="absolute inset-0 w-full h-full bg-white/30 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
                <span className="relative flex items-center">
                  Become a Sponsor{" "}
                  <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
            </div>
          </div>

          <div className="packages-card bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800 p-8 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-50"></div>

            {/* Animated circuit lines */}
            <div className="absolute inset-0">
              <svg
                className="w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,20 C20,20 20,40 40,40 C60,40 60,60 80,60 C100,60 100,80 100,80"
                  stroke="rgba(0, 255, 170, 0.2)"
                  strokeWidth="0.5"
                  fill="none"
                  strokeDasharray="5,5"
                  className="animate-circuit1"
                />
                <path
                  d="M0,40 C30,40 30,60 60,60 C90,60 90,80 100,80"
                  stroke="rgba(0, 255, 170, 0.2)"
                  strokeWidth="0.5"
                  fill="none"
                  strokeDasharray="5,5"
                  className="animate-circuit2"
                />
              </svg>
            </div>

            <div className="relative z-10">
              <h4 className="text-xl font-bold mb-4">Sponsorship Packages</h4>
              <p className="text-gray-300 mb-6">
                We offer customizable sponsorship packages to align with your
                company's goals and budget.
              </p>

              <div className="space-y-4">
                <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1">
                  <h5 className="font-semibold mb-2 flex items-center">
                    <span className="inline-block w-3 h-3 bg-white rounded-full mr-2"></span>
                    Platinum Tier
                  </h5>
                  <p className="text-sm text-gray-400">
                    Premium branding, keynote opportunity, dedicated workshop,
                    recruiting booth, and more.
                  </p>
                </div>

                <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1">
                  <h5 className="font-semibold mb-2 flex items-center">
                    <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
                    Gold Tier
                  </h5>
                  <p className="text-sm text-gray-400">
                    Prominent branding, workshop session, recruiting
                    opportunities, and API showcase.
                  </p>
                </div>

                <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1">
                  <h5 className="font-semibold mb-2 flex items-center">
                    <span className="inline-block w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
                    Silver Tier
                  </h5>
                  <p className="text-sm text-gray-400">
                    Logo placement, branded swag items, social media mentions,
                    and demo opportunities.
                  </p>
                </div>
              </div>

              <div className="mt-6 text-sm text-gray-400">
                <p>
                  Contact our sponsorship team for detailed information and
                  custom packages.
                </p>
                <p className="mt-2 font-mono text-primary">
                  sponsors@hacksphere.io
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes floatParticle {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) translateX(20px);
            opacity: 0;
          }
        }

        @keyframes circuit1 {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: 100;
          }
        }

        @keyframes circuit2 {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -100;
          }
        }

        .animate-circuit1 {
          animation: circuit1 20s linear infinite;
        }

        .animate-circuit2 {
          animation: circuit2 15s linear infinite;
        }
      `}</style>
    </section>
  );
}

// Helper class for text animation (simplified version of GSAP SplitText)
class SplitText {
  chars: HTMLElement[] = [];

  constructor(selector: string, options: { type: string }) {
    const elements = document.querySelectorAll(selector);

    elements.forEach((element) => {
      const text = element.textContent || "";
      element.textContent = "";

      for (let i = 0; i < text.length; i++) {
        const char = document.createElement("span");
        char.textContent = text[i];
        char.style.display = "inline-block";
        char.style.position = "relative";
        element.appendChild(char);
        this.chars.push(char as HTMLElement);
      }
    });
  }
}
