"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cpu, Globe, Zap, Users } from "lucide-react";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

const timelineEvents = [
  {
    year: "2018",
    title: "The Beginning",
    description:
      "HackSphere was founded with just 100 participants in a small university campus.",
  },
  {
    year: "2019",
    title: "Going National",
    description:
      "Expanded to 1,000 participants from across the country with 20+ sponsors.",
  },
  {
    year: "2020",
    title: "Virtual Transformation",
    description:
      "Adapted to a fully virtual format reaching 2,500 hackers worldwide.",
  },
  {
    year: "2021",
    title: "Global Recognition",
    description:
      "Recognized as one of the top 10 hackathons globally with 3,500 participants.",
  },
  {
    year: "2022",
    title: "Record Breaking",
    description:
      "Set the record for the largest hackathon with 4,500+ participants from 70+ countries.",
  },
  {
    year: "2023",
    title: "The Revolution",
    description:
      "Introducing HackSphere as we know it today - the world's premier hackathon experience.",
  },
];

const values = [
  {
    icon: <Globe className="h-8 w-8 text-primary" />,
    title: "Innovation",
    description:
      "We believe in pushing boundaries and challenging the status quo.",
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Collaboration",
    description: "Great ideas emerge when diverse minds work together.",
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: "Impact",
    description: "We build solutions that address real-world problems.",
  },
  {
    icon: <Cpu className="h-8 w-8 text-primary" />,
    title: "Learning",
    description:
      "Continuous growth through experimentation and knowledge sharing.",
  },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const threeContainerRef = useRef<HTMLDivElement>(null);
  const [activeTimelineIndex, setActiveTimelineIndex] = useState(0);

  // 3D Globe animation
  useEffect(() => {
    if (!threeContainerRef.current) return;

    // Setup
    const container = threeContainerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene, camera, renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create globe geometry
    const globeGeometry = new THREE.SphereGeometry(2, 64, 64);

    // Create globe material with custom shader
    const globeMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        // Simplex noise function
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
        
        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy));
          vec2 x0 = v - i + dot(i, C.xx);
          vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
          vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
          m = m*m;
          m = m*m;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }
        
        void main() {
          // Create a flowing grid pattern
          vec2 uv = vUv * 10.0;
          float noise = snoise(uv + vec2(uTime * 0.1));
          
          // Edge glow effect
          float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
          
          // Primary color (neon green)
          vec3 primaryColor = vec3(0.0, 1.0, 0.67);
          
          // Create grid lines
          float gridX = smoothstep(0.95, 0.98, abs(sin(uv.x * 3.14159)));
          float gridY = smoothstep(0.95, 0.98, abs(sin(uv.y * 3.14159)));
          float grid = max(gridX, gridY) * 0.5;
          
          // Combine effects
          vec3 finalColor = mix(vec3(0.0), primaryColor, grid + fresnel * 0.5 + noise * 0.2);
          
          // Apply alpha for transparency
          float alpha = grid * 0.8 + fresnel * 0.6;
          
          gl_FragColor = vec4(finalColor, alpha * 0.5);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
      },
      transparent: true,
      side: THREE.DoubleSide,
    });

    // Create globe mesh
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);

    // Create points for connections
    const pointsGeometry = new THREE.BufferGeometry();
    const pointsCount = 100;
    const positions = new Float32Array(pointsCount * 3);
    const sizes = new Float32Array(pointsCount);
    const colors = new Float32Array(pointsCount * 3);

    for (let i = 0; i < pointsCount; i++) {
      // Random position on sphere
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      const radius = 2.1;

      positions[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
      positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.cos(theta);

      // Random size
      sizes[i] = Math.random() * 0.1 + 0.02;

      // Color (primary with slight variation)
      colors[i * 3] = 0; // R
      colors[i * 3 + 1] = Math.random() * 0.3 + 0.7; // G
      colors[i * 3 + 2] = Math.random() * 0.3 + 0.5; // B
    }

    pointsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    pointsGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    pointsGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Points material
    const pointsMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float uTime;
        
        void main() {
          vColor = color;
          
          // Pulsating size
          float scale = 1.0 + 0.3 * sin(uTime * 2.0 + position.x * 10.0);
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * scale * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          // Create circular point
          float distanceToCenter = length(gl_PointCoord - vec2(0.5));
          float strength = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
          
          // Apply glow effect
          vec3 color = vColor;
          float alpha = strength * 0.8;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // Create points mesh
    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(points);

    // Animation loop
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Update uniforms
      globeMaterial.uniforms.uTime.value = elapsedTime;
      pointsMaterial.uniforms.uTime.value = elapsedTime;

      // Rotate globe
      globe.rotation.y = elapsedTime * 0.1;
      points.rotation.y = elapsedTime * 0.1;

      // Render
      renderer.render(scene, camera);

      requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      container.removeChild(renderer.domElement);
      scene.clear();
    };
  }, []);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate section title with text reveal effect
      const titleSplit = new SplitText(".section-title", { type: "chars" });

      gsap.fromTo(
        titleSplit.chars,
        {
          y: 100,
          opacity: 0,
          rotationX: -90,
        },
        {
          y: 0,
          opacity: 1,
          rotationX: 0,
          stagger: 0.02,
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );

      // Animate timeline with 3D effect
      gsap.fromTo(
        ".timeline-item",
        {
          opacity: 0,
          rotationY: -30,
          transformPerspective: 600,
          transformOrigin: "left center",
        },
        {
          opacity: 1,
          rotationY: 0,
          stagger: 0.2,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 70%",
          },
        }
      );

      // Create a timeline for each timeline item
      timelineEvents.forEach((_, index) => {
        const itemTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: `.timeline-item-${index}`,
            start: "top center",
            end: "bottom center",
            toggleActions: "play none none reverse",
            onEnter: () => setActiveTimelineIndex(index),
            onEnterBack: () => setActiveTimelineIndex(index),
          },
        });

        itemTimeline.to(`.timeline-item-${index}`, {
          scale: 1.05,
          duration: 0.3,
          ease: "power1.out",
        });
      });

      // Animate values cards with 3D hover effect
      gsap.fromTo(
        ".value-card",
        {
          y: 100,
          opacity: 0,
          rotationX: 20,
          transformPerspective: 800,
        },
        {
          y: 0,
          opacity: 1,
          rotationX: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: valuesRef.current,
            start: "top 70%",
          },
        }
      );

      // Create hover animations for value cards
      document.querySelectorAll(".value-card").forEach((card) => {
        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            y: -10,
            scale: 1.05,
            boxShadow: "0 20px 30px rgba(0, 0, 0, 0.2)",
            duration: 0.3,
          });

          // Animate the icon
          const icon = card.querySelector(".value-icon");
          gsap.to(icon, {
            rotateY: 360,
            duration: 0.8,
            ease: "power2.out",
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
            duration: 0.3,
          });
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-black relative" id="about">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="section-title text-4xl md:text-5xl font-bold mb-6">
            About <span className="text-primary">HackSphere</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-300">
            More than just a hackathon, HackSphere is a movement that brings
            together the brightest minds to solve the world's most pressing
            challenges.
          </p>
        </div>

        {/* 3D Globe Visualization */}
        <div ref={threeContainerRef} className="w-full h-[300px] mb-16"></div>

        {/* Timeline */}
        <div ref={timelineRef} className="mb-20">
          <h3 className="text-2xl font-bold mb-10 text-center">Our Journey</h3>
          <div className="relative">
            {/* Timeline line with animated gradient */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary to-purple-500 timeline-line"></div>

            {/* Timeline events */}
            <div className="space-y-12">
              {timelineEvents.map((event, index) => (
                <div
                  key={index}
                  className={`timeline-item timeline-item-${index} relative flex ${
                    index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  <div className="w-1/2"></div>
                  <div
                    className={`absolute left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full border-4 border-black z-10 transition-all duration-300 ${
                      activeTimelineIndex === index
                        ? "bg-primary scale-150"
                        : "bg-gray-600"
                    }`}
                  ></div>
                  <div className="w-1/2 pl-8 pr-4">
                    <div
                      className={`bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl border transition-all duration-300 ${
                        activeTimelineIndex === index
                          ? "border-primary shadow-[0_0_15px_rgba(0,255,170,0.3)]"
                          : "border-gray-800"
                      }`}
                    >
                      <span className="text-primary font-mono text-sm">
                        {event.year}
                      </span>
                      <h4 className="text-xl font-bold mb-2">{event.title}</h4>
                      <p className="text-gray-400">{event.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission & Values */}
        <div ref={valuesRef} className="text-center mb-10">
          <h3 className="text-2xl font-bold mb-10">Our Mission & Values</h3>
          <p className="max-w-3xl mx-auto mb-12 text-gray-300">
            Our mission is to empower the next generation of innovators to
            create technology that solves real-world problems and shapes a
            better future for all.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="value-card bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-primary/50 transition-all duration-300 transform perspective-800"
              >
                <div className="flex justify-center mb-4">
                  <div className="value-icon p-3 bg-gray-800 rounded-lg transform transition-all duration-300">
                    {value.icon}
                  </div>
                </div>
                <h4 className="text-xl font-bold mb-2">{value.title}</h4>
                <p className="text-gray-400">{value.description}</p>

                {/* Decorative elements */}
                <div className="absolute -bottom-2 -right-2 w-12 h-12 border-r-2 border-b-2 border-primary/30 rounded-br-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -top-2 -left-2 w-12 h-12 border-l-2 border-t-2 border-primary/30 rounded-tl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
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
