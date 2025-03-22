"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Github, Linkedin, Twitter } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const judges = [
  {
    name: "Dr. Sarah Chen",
    role: "AI Research Director",
    company: "TechGiant",
    image: "/placeholder.svg",
    bio: "Leading AI researcher with over 15 years of experience in machine learning and neural networks. Dr. Chen has published numerous papers on artificial intelligence and has been a keynote speaker at major tech conferences worldwide.",
    social: {
      twitter: "#",
      linkedin: "#",
      github: "#",
    },
  },
  {
    name: "Michael Rodriguez",
    role: "CTO",
    company: "InnovateCorp",
    image: "/placeholder.svg",
    bio: "Serial entrepreneur who has founded three successful tech startups in the last decade. Michael brings a wealth of experience in scaling technology solutions and identifying promising innovations with market potential.",
    social: {
      twitter: "#",
      linkedin: "#",
      github: "#",
    },
  },
  {
    name: "Aisha Patel",
    role: "VP of Engineering",
    company: "FutureTech",
    image: "/placeholder.svg",
    bio: "Engineering leader specializing in scalable systems and cloud architecture. Aisha has led engineering teams at several Fortune 500 companies and has a passion for mentoring the next generation of tech talent.",
    social: {
      twitter: "#",
      linkedin: "#",
      github: "#",
    },
  },
  {
    name: "James Wilson",
    role: "Venture Partner",
    company: "Tech Ventures",
    image: "/placeholder.svg",
    bio: "Investor with a portfolio of over 50 tech startups and expertise in scaling early-stage companies. James has a keen eye for disruptive technologies and has helped numerous founders turn their ideas into successful businesses.",
    social: {
      twitter: "#",
      linkedin: "#",
      github: "#",
    },
  },
  {
    name: "Dr. Elena Kim",
    role: "Professor",
    company: "MIT",
    image: "/placeholder.svg",
    bio: "Award-winning computer science professor specializing in distributed systems and blockchain. Dr. Kim's research has been instrumental in advancing the field of decentralized technologies and secure computing.",
    social: {
      twitter: "#",
      linkedin: "#",
      github: "#",
    },
  },
  {
    name: "David Okafor",
    role: "Product Director",
    company: "DevSolutions",
    image: "/placeholder.svg",
    bio: "Product visionary with experience leading teams at some of the world's most innovative companies. David has a track record of turning complex technical solutions into user-friendly products that solve real-world problems.",
    social: {
      twitter: "#",
      linkedin: "#",
      github: "#",
    },
  },
];

const process = [
  {
    step: "1",
    title: "Initial Screening",
    description:
      "All submissions undergo a preliminary review to ensure they meet the hackathon requirements.",
  },
  {
    step: "2",
    title: "Technical Evaluation",
    description:
      "Judges assess the technical implementation, code quality, and innovation of each project.",
  },
  {
    step: "3",
    title: "Live Demos",
    description:
      "Finalists present their projects to the judges through a live demonstration and Q&A session.",
  },
  {
    step: "4",
    title: "Final Deliberation",
    description:
      "Judges collaborate to select winners based on the established criteria and overall impact.",
  },
];

export default function Judges() {
  const sectionRef = useRef<HTMLElement>(null);
  const judgesRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const [activeJudge, setActiveJudge] = useState(0);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate section title
      gsap.fromTo(
        ".judges-title",
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );

      // Create scroll-triggered animations for each judge
      judges.forEach((_, index) => {
        // Create a ScrollTrigger for each judge
        ScrollTrigger.create({
          trigger: `.judge-section-${index}`,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActiveJudge(index),
          onEnterBack: () => setActiveJudge(index),
          markers: false,
        });

        // Animate judge image
        gsap.fromTo(
          `.judge-image-${index}`,
          {
            x: index % 2 === 0 ? -100 : 100,
            opacity: 0,
            scale: 0.9,
          },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: `.judge-section-${index}`,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Animate judge info
        gsap.fromTo(
          `.judge-info-${index}`,
          {
            x: index % 2 === 0 ? 100 : -100,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            delay: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: `.judge-section-${index}`,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Animate judge bio text reveal
        gsap.fromTo(
          `.judge-bio-${index}`,
          {
            y: 30,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: 0.4,
            ease: "power2.out",
            scrollTrigger: {
              trigger: `.judge-section-${index}`,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Animate social icons
        gsap.fromTo(
          `.judge-social-${index} a`,
          {
            y: 20,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.6,
            delay: 0.6,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: `.judge-section-${index}`,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Animate process steps
      gsap.fromTo(
        ".process-step",
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.2,
          duration: 0.8,
          scrollTrigger: {
            trigger: processRef.current,
            start: "top 70%",
          },
        }
      );

      // Create a progress indicator animation
      gsap.to(".judges-progress-bar", {
        height: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: judgesRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-black relative" id="judges">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="judges-title text-4xl md:text-5xl font-bold mb-6">
            Expert <span className="text-primary">Judges</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-300">
            Meet our distinguished panel of industry experts who will evaluate
            your innovations.
          </p>
        </div>

        {/* Vertical progress indicator */}
        <div className="fixed left-8 top-1/2 transform -translate-y-1/2 h-1/3 w-1 bg-gray-800 rounded-full z-50 hidden lg:block">
          <div className="judges-progress-bar w-full bg-primary rounded-full"></div>
        </div>

        {/* Judges vertical layout */}
        <div ref={judgesRef} className="space-y-40 mb-20">
          {judges.map((judge, index) => (
            <div
              key={index}
              className={`judge-section-${index} min-h-screen flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Judge Image */}
              <div className={`judge-image-${index} w-full md:w-1/2 relative`}>
                <div className="relative h-[70vh] w-full overflow-hidden rounded-2xl">
                  <Image
                    src={judge.image || "/placeholder.svg"}
                    alt={judge.name}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>

                  {/* Decorative elements */}
                  <div className="absolute top-4 left-4 w-16 h-16">
                    <svg
                      viewBox="0 0 100 100"
                      className="w-full h-full text-primary/50"
                    >
                      <path
                        d="M0,0 L100,0 L100,20 L20,20 L20,100 L0,100 Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                    </svg>
                  </div>
                  <div className="absolute bottom-4 right-4 w-16 h-16">
                    <svg
                      viewBox="0 0 100 100"
                      className="w-full h-full text-primary/50"
                    >
                      <path
                        d="M100,100 L0,100 L0,80 L80,80 L80,0 L100,0 Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Judge Info */}
              <div className={`judge-info-${index} w-full md:w-1/2 p-6`}>
                <div className="space-y-4">
                  <div className="inline-block px-4 py-1 bg-primary/10 border border-primary/30 rounded-full mb-2">
                    <span className="text-primary font-mono text-sm">
                      {judge.role}
                    </span>
                  </div>

                  <h3 className="text-4xl font-bold">{judge.name}</h3>
                  <p className="text-xl text-primary">{judge.company}</p>

                  <div
                    className={`judge-bio-${index} text-gray-300 text-lg leading-relaxed mt-6`}
                  >
                    {judge.bio}
                  </div>

                  <div className={`judge-social-${index} flex space-x-6 mt-8`}>
                    <a
                      href={judge.social.twitter}
                      className="text-gray-400 hover:text-primary transition-colors transform hover:scale-110 duration-300"
                    >
                      <Twitter className="h-6 w-6" />
                    </a>
                    <a
                      href={judge.social.linkedin}
                      className="text-gray-400 hover:text-primary transition-colors transform hover:scale-110 duration-300"
                    >
                      <Linkedin className="h-6 w-6" />
                    </a>
                    <a
                      href={judge.social.github}
                      className="text-gray-400 hover:text-primary transition-colors transform hover:scale-110 duration-300"
                    >
                      <Github className="h-6 w-6" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Judge indicator dots (mobile only) */}
        <div className="flex justify-center space-x-2 mb-16 md:hidden">
          {judges.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeJudge === index ? "bg-primary scale-125" : "bg-gray-600"
              }`}
            ></div>
          ))}
        </div>

        {/* Judging Process */}
        <div ref={processRef} className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-10 text-center">
            Judging Process
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {process.map((step, index) => (
              <div
                key={index}
                className="process-step bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800 p-6 hover:border-primary/50 transition-all duration-300"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-black font-bold flex items-center justify-center mr-4">
                    {step.step}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">{step.title}</h4>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 p-6 bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800">
            <p className="text-center text-gray-300">
              Our judging process is designed to be transparent, fair, and
              focused on identifying truly innovative solutions. All decisions
              by the judges are final and will be announced during the closing
              ceremony.
            </p>
          </div>
        </div>
      </div>

      {/* CSS for scroll-based animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
