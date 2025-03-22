"use client";

import { useEffect, useRef } from "react";
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
    image: "/judge5.png",
    bio: "Leading AI researcher with over 15 years of experience in machine learning and neural networks.",
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
    image: "/judge6.png",
    bio: "Serial entrepreneur who has founded three successful tech startups in the last decade.",
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
    image: "/judje4.png",
    bio: "Engineering leader specializing in scalable systems and cloud architecture.",
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
    image: "/judje3.png",
    bio: "Investor with a portfolio of over 50 tech startups and expertise in scaling early-stage companies.",
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
    image: "/judje1.png",
    bio: "Award-winning computer science professor specializing in distributed systems and blockchain.",
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
    image: "/judje2.png",
    bio: "Product visionary with experience leading teams at some of the world's most innovative companies.",
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

      // Animate judge cards
      gsap.fromTo(
        ".judge-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          scrollTrigger: {
            trigger: judgesRef.current,
            start: "top 70%",
          },
        }
      );

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

        {/* Judges Grid */}
        <div
          ref={judgesRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
        >
          {judges.map((judge, index) => (
            <div key={index} className="judge-card group">
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden group-hover:border-primary/50 transition-all duration-300">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={judge.image || "/placeholder.svg"}
                    alt={judge.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>

                  <div className="absolute bottom-0 left-0 w-full p-4">
                    <h3 className="text-xl font-bold">{judge.name}</h3>
                    <p className="text-primary">{judge.role}</p>
                    <p className="text-sm text-gray-300">{judge.company}</p>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-400 mb-4">{judge.bio}</p>

                  <div className="flex space-x-4">
                    <a
                      href={judge.social.twitter}
                      className="text-gray-400 hover:text-primary transition-colors"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                    <a
                      href={judge.social.linkedin}
                      className="text-gray-400 hover:text-primary transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                    <a
                      href={judge.social.github}
                      className="text-gray-400 hover:text-primary transition-colors"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
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
    </section>
  );
}
