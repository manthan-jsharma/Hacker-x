"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Trophy, Award, Medal, Gift } from "lucide-react";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

const prizes = [
  {
    title: "Grand Prize",
    value: "$50,000",
    description:
      "The ultimate recognition for the most innovative solution with global impact potential.",
    icon: <Trophy className="h-10 w-10" />,
    color: "from-yellow-400 to-yellow-600",
    model: "trophy",
  },
  {
    title: "Runner Up",
    value: "$25,000",
    description:
      "For the second-place team that demonstrates exceptional creativity and execution.",
    icon: <Award className="h-10 w-10" />,
    color: "from-gray-400 to-gray-600",
    model: "medal",
  },
  {
    title: "Third Place",
    value: "$10,000",
    description:
      "Recognizing the third-place team for their outstanding technical achievement.",
    icon: <Medal className="h-10 w-10" />,
    color: "from-amber-700 to-amber-900",
    model: "bronze",
  },
  {
    title: "Category Prizes",
    value: "$5,000 each",
    description:
      "Special awards for the best projects in AI, Sustainability, Healthcare, and Fintech.",
    icon: <Gift className="h-10 w-10" />,
    color: "from-primary to-purple-600",
    model: "gift",
  },
];

const criteria = [
  { name: "Innovation", weight: "30%" },
  { name: "Technical Complexity", weight: "25%" },
  { name: "Impact & Practicality", weight: "25%" },
  { name: "Design & User Experience", weight: "10%" },
  { name: "Presentation", weight: "10%" },
];

export default function Prizes() {
  const sectionRef = useRef<HTMLElement>(null);
  const prizesRef = useRef<HTMLDivElement>(null);
  const criteriaRef = useRef<HTMLDivElement>(null);
  const [hoveredPrize, setHoveredPrize] = useState<number | null>(null);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  // Initialize canvas refs array
  useEffect(() => {
    canvasRefs.current = canvasRefs.current.slice(0, prizes.length);
  }, []);

  // 3D models for each prize
  useEffect(() => {
    // Setup 3D scenes for each prize
    prizes.forEach((prize, index) => {
      const canvas = canvasRefs.current[index];
      if (!canvas) return;

      // Scene setup
      const scene = new THREE.Scene();

      // Camera
      const camera = new THREE.PerspectiveCamera(
        75,
        canvas.clientWidth / canvas.clientHeight,
        0.1,
        1000
      );
      camera.position.z = 5;

      // Renderer
      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
      });
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      const pointLight = new THREE.PointLight(0x00ffaa, 2, 10);
      pointLight.position.set(2, 2, 2);
      scene.add(pointLight);

      // Create model based on prize type
      let geometry: THREE.BufferGeometry;
      let material: THREE.Material;

      switch (prize.model) {
        case "trophy":
          // Trophy - cylinder with cone on top
          const trophyGroup = new THREE.Group();

          // Base
          const baseGeometry = new THREE.CylinderGeometry(0.8, 1, 0.3, 32);
          const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0xd4af37,
            metalness: 1,
            roughness: 0.3,
          });
          const base = new THREE.Mesh(baseGeometry, baseMaterial);
          base.position.y = -1.5;
          trophyGroup.add(base);

          // Stem
          const stemGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 32);
          const stemMaterial = new THREE.MeshStandardMaterial({
            color: 0xd4af37,
            metalness: 1,
            roughness: 0.3,
          });
          const stem = new THREE.Mesh(stemGeometry, stemMaterial);
          stem.position.y = -0.5;
          trophyGroup.add(stem);

          // Cup
          const cupGeometry = new THREE.CylinderGeometry(0.7, 0.2, 1.2, 32);
          const cupMaterial = new THREE.MeshStandardMaterial({
            color: 0xd4af37,
            metalness: 1,
            roughness: 0.3,
          });
          const cup = new THREE.Mesh(cupGeometry, cupMaterial);
          cup.position.y = 0.6;
          trophyGroup.add(cup);

          scene.add(trophyGroup);

          // Animation
          const animateTrophy = () => {
            if (hoveredPrize === index) {
              trophyGroup.rotation.y += 0.02;
              pointLight.intensity = 3 + Math.sin(Date.now() * 0.003) * 1;
            } else {
              trophyGroup.rotation.y += 0.005;
              pointLight.intensity = 2;
            }

            renderer.render(scene, camera);
            requestAnimationFrame(animateTrophy);
          };

          animateTrophy();
          break;

        case "medal":
          // Medal - torus with star
          const medalGroup = new THREE.Group();

          // Medal body
          const medalGeometry = new THREE.TorusGeometry(1, 0.3, 16, 100);
          const medalMaterial = new THREE.MeshStandardMaterial({
            color: 0xc0c0c0,
            metalness: 0.8,
            roughness: 0.2,
          });
          const medal = new THREE.Mesh(medalGeometry, medalMaterial);
          medalGroup.add(medal);

          // Star in center
          const starGeometry = new THREE.OctahedronGeometry(0.7, 0);
          const starMaterial = new THREE.MeshStandardMaterial({
            color: 0xc0c0c0,
            metalness: 0.9,
            roughness: 0.1,
          });
          const star = new THREE.Mesh(starGeometry, starMaterial);
          medalGroup.add(star);

          scene.add(medalGroup);

          // Animation
          const animateMedal = () => {
            if (hoveredPrize === index) {
              medalGroup.rotation.y += 0.02;
              medalGroup.rotation.x = Math.sin(Date.now() * 0.001) * 0.2;
              pointLight.intensity = 3 + Math.sin(Date.now() * 0.003) * 1;
            } else {
              medalGroup.rotation.y += 0.005;
              medalGroup.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
              pointLight.intensity = 2;
            }

            renderer.render(scene, camera);
            requestAnimationFrame(animateMedal);
          };

          animateMedal();
          break;

        case "bronze":
          // Bronze medal
          const bronzeGroup = new THREE.Group();

          // Medal body
          const bronzeGeometry = new THREE.TorusGeometry(1, 0.3, 16, 100);
          const bronzeMaterial = new THREE.MeshStandardMaterial({
            color: 0xcd7f32,
            metalness: 0.8,
            roughness: 0.3,
          });
          const bronzeMedal = new THREE.Mesh(bronzeGeometry, bronzeMaterial);
          bronzeGroup.add(bronzeMedal);

          // Number 3
          const textGeometry = new THREE.ExtrudeGeometry(
            new THREE.Shape()
              .moveTo(0, 1)
              .bezierCurveTo(0.5, 1, 0.5, 0.5, 0.5, 0.5)
              .bezierCurveTo(0.5, 0, 0, 0, 0, 0)
              .bezierCurveTo(0.5, 0, 0.5, -0.5, 0.5, -0.5)
              .bezierCurveTo(0.5, -1, 0, -1, 0, -1),
            { depth: 0.2, bevelEnabled: false }
          );
          const textMaterial = new THREE.MeshStandardMaterial({
            color: 0xcd7f32,
            metalness: 0.9,
            roughness: 0.1,
          });
          const text = new THREE.Mesh(textGeometry, textMaterial);
          text.scale.set(0.5, 0.5, 0.5);
          text.position.z = 0.3;
          bronzeGroup.add(text);

          scene.add(bronzeGroup);

          // Animation
          const animateBronze = () => {
            if (hoveredPrize === index) {
              bronzeGroup.rotation.y += 0.02;
              bronzeGroup.rotation.x = Math.sin(Date.now() * 0.001) * 0.2;
              pointLight.intensity = 3 + Math.sin(Date.now() * 0.003) * 1;
            } else {
              bronzeGroup.rotation.y += 0.005;
              bronzeGroup.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
              pointLight.intensity = 2;
            }

            renderer.render(scene, camera);
            requestAnimationFrame(animateBronze);
          };

          animateBronze();
          break;

        case "gift":
          // Gift box
          const giftGroup = new THREE.Group();

          // Box
          const boxGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
          const boxMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ffaa,
            metalness: 0.2,
            roughness: 0.8,
          });
          const box = new THREE.Mesh(boxGeometry, boxMaterial);
          giftGroup.add(box);

          // Ribbon
          const ribbonGeometry1 = new THREE.BoxGeometry(1.6, 0.3, 0.3);
          const ribbonMaterial = new THREE.MeshStandardMaterial({
            color: 0x9900ff,
            metalness: 0.3,
            roughness: 0.7,
          });
          const ribbon1 = new THREE.Mesh(ribbonGeometry1, ribbonMaterial);
          ribbon1.position.y = 0.75;
          giftGroup.add(ribbon1);

          const ribbonGeometry2 = new THREE.BoxGeometry(0.3, 0.3, 1.6);
          const ribbon2 = new THREE.Mesh(ribbonGeometry2, ribbonMaterial);
          ribbon2.position.y = 0.75;
          giftGroup.add(ribbon2);

          // Bow
          const bowGeometry = new THREE.TorusGeometry(0.3, 0.1, 16, 100);
          const bow1 = new THREE.Mesh(bowGeometry, ribbonMaterial);
          bow1.position.y = 1;
          bow1.rotation.x = Math.PI / 2;
          giftGroup.add(bow1);

          const bow2 = new THREE.Mesh(bowGeometry, ribbonMaterial);
          bow2.position.y = 1;
          bow2.rotation.x = Math.PI / 2;
          bow2.rotation.y = Math.PI / 2;
          giftGroup.add(bow2);

          scene.add(giftGroup);

          // Animation
          const animateGift = () => {
            if (hoveredPrize === index) {
              giftGroup.rotation.y += 0.02;
              giftGroup.position.y = Math.sin(Date.now() * 0.002) * 0.1;
              pointLight.intensity = 3 + Math.sin(Date.now() * 0.003) * 1;
            } else {
              giftGroup.rotation.y += 0.005;
              giftGroup.position.y = Math.sin(Date.now() * 0.002) * 0.05;
              pointLight.intensity = 2;
            }

            renderer.render(scene, camera);
            requestAnimationFrame(animateGift);
          };

          animateGift();
          break;
      }

      // Handle window resize
      const handleResize = () => {
        if (!canvas) return;

        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
      };

      window.addEventListener("resize", handleResize);

      // Cleanup
      return () => {
        window.removeEventListener("resize", handleResize);
        scene.clear();
      };
    });
  }, [hoveredPrize]);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate section title with split text
      const titleSplit = new SplitText(".prizes-title", { type: "chars" });

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

      // Animate prize cards with 3D effect
      gsap.fromTo(
        ".prize-card",
        {
          y: 100,
          opacity: 0,
          rotationY: -20,
          transformPerspective: 1000,
          transformOrigin: "center",
        },
        {
          y: 0,
          opacity: 1,
          rotationY: 0,
          stagger: 0.2,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: prizesRef.current,
            start: "top 70%",
          },
        }
      );

      // Animate criteria bars with drawing effect
      gsap.fromTo(
        ".criteria-bar",
        { width: 0 },
        {
          width: "100%",
          stagger: 0.2,
          duration: 1.5,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: criteriaRef.current,
            start: "top 80%",
          },
        }
      );

      // Animate criteria percentages with counting effect
      document.querySelectorAll(".criteria-percentage").forEach((element) => {
        const target = element.textContent;
        const counter = { val: 0 };

        gsap.to(counter, {
          val: Number.parseInt(target || "0"),
          duration: 2,
          ease: "power2.inOut",
          onUpdate: () => {
            element.textContent = Math.floor(counter.val) + "%";
          },
          scrollTrigger: {
            trigger: criteriaRef.current,
            start: "top 80%",
          },
        });
      });

      // Create hover animations for prize cards
      document.querySelectorAll(".prize-card").forEach((card, index) => {
        card.addEventListener("mouseenter", () => {
          setHoveredPrize(index);

          gsap.to(card, {
            y: -15,
            scale: 1.05,
            boxShadow: "0 30px 60px rgba(0, 0, 0, 0.3)",
            duration: 0.4,
            ease: "power2.out",
          });

          // Glow effect
          gsap.to(card.querySelector(".prize-glow"), {
            opacity: 0.8,
            duration: 0.4,
          });
        });

        card.addEventListener("mouseleave", () => {
          setHoveredPrize(null);

          gsap.to(card, {
            y: 0,
            scale: 1,
            boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
            duration: 0.4,
            ease: "power2.out",
          });

          // Remove glow effect
          gsap.to(card.querySelector(".prize-glow"), {
            opacity: 0,
            duration: 0.4,
          });
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-black relative" id="prizes">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-40 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-20 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="prizes-title text-4xl md:text-5xl font-bold mb-6">
            Epic <span className="text-primary">Prizes</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-300">
            Compete for glory and substantial rewards that recognize your
            innovation and hard work.
          </p>
        </div>

        {/* Prize Cards */}
        <div
          ref={prizesRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {prizes.map((prize, index) => (
            <div
              key={index}
              className="prize-card relative group perspective-1000"
            >
              {/* Glow effect */}
              <div className="prize-glow absolute inset-0 bg-gradient-to-br opacity-0 rounded-xl blur-md -m-1"></div>

              <div className="relative bg-gray-900 border border-gray-800 rounded-xl p-6 h-full flex flex-col group-hover:border-primary/50 transition-all duration-300 transform-gpu">
                {/* 3D Model Canvas */}
                <div className="mb-4 h-40 w-full">
                  <canvas
                    ref={(el) => {
                      canvasRefs.current[index] = el;
                    }}
                    className="w-full h-full"
                  />
                </div>

                <h3 className="text-xl font-bold mb-1">{prize.title}</h3>
                <div
                  className={`text-3xl font-bold mb-4 bg-gradient-to-r ${prize.color} bg-clip-text text-transparent`}
                >
                  {prize.value}
                </div>
                <p className="text-gray-400 flex-grow">{prize.description}</p>

                {/* Decorative elements */}
                <div className="absolute top-2 right-2 w-8 h-8">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full text-primary/30"
                  >
                    <path
                      d="M0,0 L100,0 L100,20 L20,20 L20,100 L0,100 Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div className="absolute bottom-2 left-2 w-8 h-8">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full text-primary/30"
                  >
                    <path
                      d="M100,100 L0,100 L0,80 L80,80 L80,0 L100,0 Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Judging Criteria */}
        <div ref={criteriaRef} className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-10 text-center">
            Judging Criteria
          </h3>

          <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
            <p className="text-gray-300 mb-8">
              Our panel of industry experts will evaluate projects based on the
              following criteria:
            </p>

            <div className="space-y-6">
              {criteria.map((item, index) => (
                <div key={index} className="criteria-item">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">{item.name}</span>
                    <span className="criteria-percentage text-primary font-mono">
                      {item.weight}
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="criteria-bar bg-gradient-to-r from-primary to-purple-500 h-2.5 rounded-full relative"
                      style={{ width: item.weight }}
                    >
                      {/* Animated particles inside the bar */}
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className="absolute top-1/2 bg-white rounded-full w-1 h-1 opacity-70"
                              style={{
                                left: `${i * 20}%`,
                                animation: `particleMove 3s linear ${
                                  i * 0.5
                                }s infinite`,
                              }}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-400">
                <span className="text-primary font-semibold">Note:</span> All
                submissions must be original work created during the hackathon
                period. Projects will be evaluated through a combination of live
                demos and code reviews.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes particleMove {
          0% {
            transform: translateX(0) translateY(-50%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(100px) translateY(-50%);
            opacity: 0;
          }
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
