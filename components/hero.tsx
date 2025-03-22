"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [programInfo, setProgramInfo] = useState<any>(null);
  const [buffers, setBuffers] = useState<any>(null);
  const [glContext, setGlContext] = useState<WebGLRenderingContext | null>(
    null
  );
  const [time, setTime] = useState(0);

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

  // WebGL animation for the background
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    setGlContext(gl);

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Vertex shader program
    const vsSource = `
      attribute vec4 aVertexPosition;
      attribute vec2 aTextureCoord;
      varying highp vec2 vTextureCoord;
      void main(void) {
        gl_Position = aVertexPosition;
        vTextureCoord = aTextureCoord;
      }
    `;

    // Fragment shader program
    const fsSource = `
      precision highp float;
      varying highp vec2 vTextureCoord;
      uniform float uTime;
      
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
      
      void main(void) {
        vec2 uv = vTextureCoord;
        
        // Center the coordinates
        uv = uv * 2.0 - 1.0;
        
        // Create a flowing noise pattern
        float noise1 = snoise(uv * 3.0 + vec2(uTime * 0.1, uTime * 0.08));
        float noise2 = snoise(uv * 2.0 + vec2(uTime * -0.07, uTime * 0.05));
        float noise3 = snoise(uv * 5.0 + vec2(uTime * 0.05, uTime * -0.1));
        
        // Create a radial gradient
        float dist = length(uv);
        float radialGradient = smoothstep(1.0, 0.0, dist);
        
        // Mix colors based on noise and position
        vec3 color1 = vec3(0.0, 1.0, 0.67); // Primary color (neon green)
        vec3 color2 = vec3(0.5, 0.0, 1.0);  // Purple
        vec3 color3 = vec3(0.0, 0.0, 0.1);  // Dark blue/black
        
        // Mix colors based on noise
        vec3 finalColor = mix(color3, color1, noise1 * 0.5 + 0.5);
        finalColor = mix(finalColor, color2, noise2 * 0.3 + 0.2);
        
        // Apply radial gradient and vignette
        finalColor = mix(vec3(0.0), finalColor, radialGradient);
        
        // Add some "electric" lines
        float lines = smoothstep(0.3, 0.32, fract(noise3 * 5.0));
        finalColor += color1 * lines * 0.1 * (1.0 - dist);
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    // Initialize shader program
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    if (!shaderProgram) return;

    const programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
        textureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord"),
      },
      uniformLocations: {
        time: gl.getUniformLocation(shaderProgram, "uTime"),
      },
    };

    setProgramInfo(programInfo);

    // Create buffers
    const buffers = initBuffers(gl);
    setBuffers(buffers);

    let then = 0;

    // Render loop
    function render(now: number) {
      now *= 0.001; // Convert to seconds
      const deltaTime = now - then;
      then = now;
      setTime((prevTime) => prevTime + deltaTime);

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(0);
    };
  }, []);

  // Initialize shader program
  function initShaderProgram(
    gl: WebGLRenderingContext,
    vsSource: string,
    fsSource: string
  ) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    if (!vertexShader || !fragmentShader) return null;

    const shaderProgram = gl.createProgram();
    if (!shaderProgram) return null;

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error(
        "Unable to initialize the shader program: " +
          gl.getProgramInfoLog(shaderProgram)
      );
      return null;
    }

    return shaderProgram;
  }

  // Load shader
  function loadShader(gl: WebGLRenderingContext, type: number, source: string) {
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(
        "An error occurred compiling the shaders: " +
          gl.getShaderInfoLog(shader)
      );
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  // Initialize buffers
  function initBuffers(gl: WebGLRenderingContext) {
    // Create a buffer for the square's positions
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Create a square
    const positions = [-1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Create a buffer for texture coordinates
    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

    const textureCoordinates = [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0];

    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(textureCoordinates),
      gl.STATIC_DRAW
    );

    return {
      position: positionBuffer,
      textureCoord: textureCoordBuffer,
    };
  }

  // Draw the scene
  const drawScene = useCallback(
    (
      gl: WebGLRenderingContext,
      programInfo: any,
      buffers: any,
      time: number
    ) => {
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clearDepth(1.0);
      gl.disable(gl.DEPTH_TEST);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // Tell WebGL how to pull out the positions from the position buffer
      {
        const numComponents = 2; // pull out 2 values per iteration
        const type = gl.FLOAT; // the data in the buffer is 32bit floats
        const normalize = false; // don't normalize
        const stride = 0; // how many bytes to get from one set of values to the next
        const offset = 0; // how many bytes inside the buffer to start from
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.vertexAttribPointer(
          programInfo.attribLocations.vertexPosition,
          numComponents,
          type,
          normalize,
          stride,
          offset
        );
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
      }

      // Tell WebGL how to pull out the texture coordinates from buffer
      {
        const numComponents = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
        gl.vertexAttribPointer(
          programInfo.attribLocations.textureCoord,
          numComponents,
          type,
          normalize,
          stride,
          offset
        );
        gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
      }

      // Tell WebGL to use our program when drawing
      gl.useProgram(programInfo.program);

      // Set the shader uniforms
      gl.uniform1f(programInfo.uniformLocations.time, time);

      // Draw the square
      {
        const offset = 0;
        const vertexCount = 4;
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
      }
    },
    []
  );

  useEffect(() => {
    if (glContext && programInfo && buffers) {
      drawScene(glContext, programInfo, buffers, time);
    }
  }, [glContext, programInfo, buffers, time, drawScene]);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create floating particles
      if (particlesRef.current) {
        const particles = particlesRef.current;
        const particleCount = 30;

        // Clear any existing particles
        particles.innerHTML = "";

        // Create new particles
        for (let i = 0; i < particleCount; i++) {
          const particle = document.createElement("div");
          particle.className =
            "absolute rounded-full bg-primary/30 backdrop-blur-sm";

          // Random size between 4px and 20px
          const size = Math.random() * 16 + 4;
          particle.style.width = `${size}px`;
          particle.style.height = `${size}px`;

          // Random starting position
          const x = Math.random() * 100;
          const y = Math.random() * 100;
          particle.style.left = `${x}%`;
          particle.style.top = `${y}%`;

          particles.appendChild(particle);

          // Animate each particle
          gsap.to(particle, {
            x: `random(-100, 100, 10)`,
            y: `random(-100, 100, 10)`,
            opacity: `random(0.1, 0.7)`,
            scale: `random(0.5, 2, 0.1)`,
            duration: `random(10, 20)`,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }
      }

      // Animate the hero text with a glitch effect
      const glitchTimeline = gsap.timeline({ repeat: -1, repeatDelay: 5 });

      glitchTimeline
        .to(".glitch-text", {
          skewX: 20,
          duration: 0.1,
          ease: "power1.inOut",
        })
        .to(".glitch-text", {
          skewX: 0,
          duration: 0.1,
          ease: "power1.inOut",
        })
        .to(".glitch-text", {
          opacity: 0.8,
          duration: 0.1,
          ease: "power1.inOut",
        })
        .to(".glitch-text", {
          opacity: 1,
          duration: 0.1,
          ease: "power1.inOut",
        })
        .to(".glitch-text", {
          x: -5,
          duration: 0.1,
          ease: "power1.inOut",
        })
        .to(".glitch-text", {
          x: 5,
          duration: 0.1,
          ease: "power1.inOut",
        })
        .to(".glitch-text", {
          x: 0,
          duration: 0.1,
          ease: "power1.inOut",
        });

      // Main entrance animation
      gsap.fromTo(
        heroRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.5 }
      );

      // Animate the text with a staggered effect
      gsap.fromTo(
        ".hero-text > *",
        {
          y: 100,
          opacity: 0,
          filter: "blur(10px)",
        },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          stagger: 0.2,
          duration: 1,
          delay: 0.5,
          ease: "power3.out",
        }
      );

      // Animate the button with a bounce effect
      gsap.fromTo(
        buttonRef.current,
        {
          y: 50,
          opacity: 0,
          scale: 0.8,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          delay: 1.5,
          ease: "elastic.out(1, 0.5)",
        }
      );

      // Create a pulsing effect for the CTA button
      gsap.to(".cta-button", {
        boxShadow: "0 0 30px rgba(0, 255, 170, 0.7)",
        repeat: -1,
        yoyo: true,
        duration: 2,
        ease: "sine.inOut",
      });

      // Animate the scroll indicator
      gsap.to(".scroll-indicator", {
        y: 10,
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: "sine.inOut",
      });
    });

    return () => ctx.revert();
  }, []);

  // Parallax effect based on mouse position
  useEffect(() => {
    if (textRef.current) {
      gsap.to(textRef.current, {
        x: mousePosition.x * 20,
        y: mousePosition.y * 20,
        duration: 1,
        ease: "power2.out",
      });
    }
  }, [mousePosition]);

  return (
    <section
      ref={heroRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* WebGL Background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Floating particles */}
      <div
        ref={particlesRef}
        className="absolute inset-0 z-10 pointer-events-none"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black z-10"></div>

      {/* Content */}
      <div className="container mx-auto px-4 z-20">
        <div ref={textRef} className="hero-text text-center max-w-4xl mx-auto">
          <div className="inline-block px-6 py-3 mb-8 border border-primary/30 rounded-full bg-black/30 backdrop-blur-sm transform transition-transform hover:scale-105 duration-300">
            <span className="text-primary font-mono">
              48 HOURS. 5000+ HACKERS. UNLIMITED POTENTIAL.
            </span>
          </div>
          <h1 className="glitch-text text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 relative">
            HackSphere
            <span className="absolute inset-0 text-primary opacity-70 blur-sm">
              HackSphere
            </span>
            <span className="absolute inset-0 text-purple-500 opacity-70 blur-sm -translate-x-1">
              HackSphere
            </span>
          </h1>
          <p className="text-2xl md:text-4xl font-light mb-8 relative overflow-hidden">
            <span className="block transform transition-transform hover:translate-x-2 duration-300">
              Shape The Future
            </span>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"></span>
          </p>
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join the world's largest hackathon and collaborate with brilliant
            minds to build revolutionary solutions.
          </p>
        </div>

        <div ref={buttonRef} className="flex justify-center">
          <Button
            size="lg"
            className="cta-button bg-primary hover:bg-primary/90 text-black font-bold px-8 py-6 text-lg rounded-full relative overflow-hidden group"
            onClick={() => router.push("#register")}
          >
            <span className="absolute inset-0 w-full h-full bg-white/30 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
            <span className="relative flex items-center">
              Register Now{" "}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-20">
        <span className="text-sm text-gray-400 mb-2">Scroll to explore</span>
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-white rounded-full animate-bounce"></div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10"></div>

      {/* Circuit board lines */}
      <svg
        className="absolute inset-0 w-full h-full z-5 opacity-20 pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 L100,0 L100,100 L0,100 Z"
          fill="none"
          stroke="rgba(0, 255, 170, 0.3)"
          strokeWidth="0.1"
        />
        <path
          d="M0,20 L100,20"
          stroke="rgba(0, 255, 170, 0.2)"
          strokeWidth="0.1"
        />
        <path
          d="M0,40 L100,40"
          stroke="rgba(0, 255, 170, 0.2)"
          strokeWidth="0.1"
        />
        <path
          d="M0,60 L100,60"
          stroke="rgba(0, 255, 170, 0.2)"
          strokeWidth="0.1"
        />
        <path
          d="M0,80 L100,80"
          stroke="rgba(0, 255, 170, 0.2)"
          strokeWidth="0.1"
        />
        <path
          d="M20,0 L20,100"
          stroke="rgba(0, 255, 170, 0.2)"
          strokeWidth="0.1"
        />
        <path
          d="M40,0 L40,100"
          stroke="rgba(0, 255, 170, 0.2)"
          strokeWidth="0.1"
        />
        <path
          d="M60,0 L60,100"
          stroke="rgba(0, 255, 170, 0.2)"
          strokeWidth="0.1"
        />
        <path
          d="M80,0 L80,100"
          stroke="rgba(0, 255, 170, 0.2)"
          strokeWidth="0.1"
        />
      </svg>
    </section>
  );
}
