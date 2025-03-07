"use client";

import React, { useEffect, useRef, useState } from "react";

interface Circle {
  cx: number;
  cy: number;
  r: number;
}

interface Particle {
  x: number;
  y: number;
  r: number;
  targetX: number;
  targetY: number;
  targetR: number;
  startX: number;
  startY: number;
  startR: number;
  isStationary: boolean;
  convergeStart: number;
  convergeEnd: number;
  waitEnd: number;
  divergeEnd: number;
  swirlAngle: number;
  swirlSpeed: number;
}

interface ShapeData {
  circles: Circle[];
  width: number;
  height: number;
}

export default function Animation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shapes, setShapes] = useState<ShapeData[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [currentShapeIndex, setCurrentShapeIndex] = useState(0);
  const [targetShapeIndex, setTargetShapeIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const duration = 3000; // Transition duration in ms
  const cycleTime = 6000; // Time between shape cycles in ms
  const swirlMag = 3.0; // Consistent swirl magnitude for smooth motion

  // Load SVGs and initialize particles
  useEffect(() => {
    async function loadSvgs() {
      const urls = ["/ap-logo.svg", "/writing-logo.svg", "/dev-logo.svg"];
      const shapeData = await Promise.all(urls.map(fetchAndParseSvg));
      setShapes(shapeData);
      if (shapeData.length > 0) {
        const first = shapeData[0];
        const initParticles = first.circles.map((dot) => ({
          x: dot.cx,
          y: dot.cy,
          r: dot.r,
          targetX: dot.cx,
          targetY: dot.cy,
          targetR: dot.r,
          startX: dot.cx,
          startY: dot.cy,
          startR: dot.r,
          isStationary: true,
          convergeStart: 0,
          convergeEnd: 0,
          waitEnd: 0,
          divergeEnd: 0,
          swirlAngle: Math.random() * 2 * Math.PI,
          swirlSpeed: 0.02 + Math.random() * 0.02,
        }));
        setParticles(initParticles);
      }
    }
    loadSvgs();
  }, []);

  // Automatic shape cycling
  useEffect(() => {
    if (!shapes.length) return;
    const timer = setInterval(() => {
      const nextShapeIndex = (currentShapeIndex + 1) % shapes.length;
      startTransition(nextShapeIndex);
    }, cycleTime);
    return () => clearInterval(timer);
  }, [shapes, currentShapeIndex]);

  // Start a transition to a new shape
  function startTransition(nextIndex: number) {
    if (!shapes[nextIndex]) return;
    const targetShape = shapes[nextIndex].circles;
    setIsTransitioning(true);
    setStartTime(performance.now());
    setTargetShapeIndex(nextIndex);
    const availableTargets = [...targetShape];
    const threshold = 2.0;
    const newParticles: Particle[] = [];
    particles.forEach((p) => {
      if (!availableTargets.length) {
        newParticles.push(createMovingParticle(p, 0, 0, 0, false));
        return;
      }
      let closestIndex = 0;
      let minDist = distance(p.x, p.y, availableTargets[0].cx, availableTargets[0].cy);
      for (let i = 1; i < availableTargets.length; i++) {
        const distVal = distance(p.x, p.y, availableTargets[i].cx, availableTargets[i].cy);
        if (distVal < minDist) {
          minDist = distVal;
          closestIndex = i;
        }
      }
      const chosen = availableTargets.splice(closestIndex, 1)[0];
      const closeEnough = minDist <= threshold;
      if (closeEnough) {
        const stationaryP = {
          ...p,
          targetX: chosen.cx,
          targetY: chosen.cy,
          targetR: chosen.r,
          isStationary: true,
          divergeEnd: duration,
        };
        newParticles.push(stationaryP);
      } else {
        const movingP = createMovingParticle(p, chosen.cx, chosen.cy, chosen.r, false);
        newParticles.push(movingP);
      }
    });
    availableTargets.forEach((t) => {
      const spawnParticle = createMovingParticle({ x: 0, y: 0, r: 0 } as Particle, t.cx, t.cy, t.r, true);
      newParticles.push(spawnParticle);
    });
    setParticles(newParticles);
  }

  // Create a moving particle with a converge-wait-diverge timeline
  function createMovingParticle(p: Particle, tx: number, ty: number, tr: number, isSpawn: boolean): Particle {
    const convergeStart = Math.random() * 0.2 * duration;
    const convergeLen = randomRange(0.2, 0.4) * duration;
    let convergeEnd = convergeStart + convergeLen;
    if (convergeEnd > duration) convergeEnd = duration;
    const waitLen = Math.random() * 0.1 * duration;
    let waitEnd = convergeEnd + waitLen;
    if (waitEnd > duration) waitEnd = duration;
    const divergeLen = randomRange(0.2, 0.4) * duration;
    let divergeEnd = waitEnd + divergeLen;
    if (divergeEnd > duration) divergeEnd = duration;
    const sx = isSpawn ? 0 : p.x;
    const sy = isSpawn ? 0 : p.y;
    const sr = isSpawn ? 0 : p.r;
    return {
      x: sx,
      y: sy,
      r: sr,
      targetX: tx,
      targetY: ty,
      targetR: tr,
      startX: sx,
      startY: sy,
      startR: sr,
      isStationary: false,
      convergeStart,
      convergeEnd,
      waitEnd,
      divergeEnd,
      swirlAngle: Math.random() * 2 * Math.PI,
      swirlSpeed: 0.02 + Math.random() * 0.02,
    };
  }

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !shapes.length || !particles.length) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const width = 300;
    const height = 300;
    
    // Track mouse velocity for directional wind
    let prevMousePos = mousePos;
    let mouseVelocity = { x: 0, y: 0 };

    function calcScale(shape: ShapeData) {
      const { width: w, height: h } = shape;
      const scaleX = (width * 0.9) / w;
      const scaleY = (height * 0.9) / h;
      return Math.min(scaleX, scaleY);
    }

    let reqId: number;
    function animate(frameTime: number) {
      ctx.clearRect(0, 0, width, height);
      const t = isTransitioning ? Math.min(frameTime - startTime, duration) : 0;
      if (isTransitioning && t >= duration && targetShapeIndex !== null) {
        endTransition();
      }
      const currentScale = calcScale(shapes[currentShapeIndex]);
      const nextScale = targetShapeIndex !== null ? calcScale(shapes[targetShapeIndex]) : currentScale;
      const ratio = isTransitioning ? t / duration : 0;
      const overallScale = lerp(currentScale, nextScale, ratio);
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.scale(overallScale, overallScale);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.swirlAngle += p.swirlSpeed;

        // Calculate base position based on transition state
        let baseX, baseY, pr;
        if (p.isStationary) {
          baseX = p.startX;
          baseY = p.startY;
          pr = p.startR;
        } else {
          if (t < p.convergeStart) {
            baseX = p.startX;
            baseY = p.startY;
            pr = p.startR;
          } else if (t >= p.convergeStart && t < p.convergeEnd) {
            const convergeRatio = (t - p.convergeStart) / (p.convergeEnd - p.convergeStart);
            const e = easeInOutQuad(convergeRatio);
            baseX = lerp(p.startX, 0, e);
            baseY = lerp(p.startY, 0, e);
            pr = lerp(p.startR, 0.1, e);
          } else if (t >= p.convergeEnd && t < p.waitEnd) {
            baseX = 0;
            baseY = 0;
            pr = 0.1;
          } else if (t >= p.waitEnd && t < p.divergeEnd) {
            const divergeRatio = (t - p.waitEnd) / (p.divergeEnd - p.waitEnd);
            const e = easeInOutQuad(divergeRatio);
            baseX = lerp(0, p.targetX, e);
            baseY = lerp(0, p.targetY, e);
            pr = lerp(0.1, p.targetR, e);
          } else {
            baseX = p.targetX;
            baseY = p.targetY;
            pr = p.targetR;
          }
        }

        // Apply swirl effect
        const swirlOffsetX = swirlMag * Math.cos(p.swirlAngle);
        const swirlOffsetY = swirlMag * Math.sin(p.swirlAngle);
        let px = baseX + swirlOffsetX;
        let py = baseY + swirlOffsetY;

        // Apply COSMIC EXPLOSION effect - dramatically amplified
        if (mousePos) {
          // Convert mouse position to shape coordinate space
          const mouseX = (mousePos.x - width / 2) / overallScale;
          const mouseY = (mousePos.y - height / 2) / overallScale;
          
          const dx = px - mouseX;
          const dy = py - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          // COSMIC parameters - dramatically increased
          const cosmicRadius = 240.0;  // Enormous influence radius
          const vortexStrength = 210.0;  // Extreme vortex
          const pushStrength = 160.0;  // Massive push
          const turbulenceFactor = 2.0;  // Chaotic turbulence
          const pulseFrequency = 0.005; // Pulsing frequency
          
          // Create pulsing effect (from Grok's code)
          const pulse = Math.sin(frameTime * pulseFrequency) * 0.5 + 0.5; // 0 to 1
          const attractFactor = pulse;
          const repelFactor = (1 - pulse) * 1.5; // Extra strong repulsion
          
          if (dist < cosmicRadius) {
            // Calculate influence factor (aggressive falloff)
            const influence = Math.pow(1 - dist / cosmicRadius, 2);
            
            // Vortex effect (swirl around cursor)
            const angle = Math.atan2(dy, dx);
            const vortexX = Math.cos(angle + Math.PI/2) * vortexStrength * influence;
            const vortexY = Math.sin(angle + Math.PI/2) * vortexStrength * influence;
            
            // Magnetic pulse effect (attract then repel) - from Grok's code
            const attractX = -Math.cos(angle) * vortexStrength * influence * attractFactor * 0.7;
            const attractY = -Math.sin(angle) * vortexStrength * influence * attractFactor * 0.7;
            const repelX = Math.cos(angle) * pushStrength * influence * repelFactor;
            const repelY = Math.sin(angle) * pushStrength * influence * repelFactor;
            
            // Random turbulence
            const turbulenceX = (Math.random() - 0.5) * turbulenceFactor * cosmicRadius * influence;
            const turbulenceY = (Math.random() - 0.5) * turbulenceFactor * cosmicRadius * influence;
            
            // Apply all effects, weighted by particle size (smaller particles affected more)
            const sizeWeight = 8.0 / (p.r + 0.1);  // Ultra-strong effect on small particles
            const totalForceX = (vortexX + attractX + repelX + turbulenceX) * sizeWeight;
            const totalForceY = (vortexY + attractY + repelY + turbulenceY) * sizeWeight;
            
            // Allow particles to fly off-canvas (don't constrain movement)
            px += totalForceX;
            py += totalForceY;
            
            // Temporarily increase swirl for affected particles
            p.swirlAngle += influence * 0.8;
            
            // Draw particle with visual effect when influenced
            if (pr > 0.05) {
              ctx.beginPath();
              
              // Calculate movement magnitude for visual effects
              const moveMagnitude = Math.sqrt(totalForceX * totalForceX + totalForceY * totalForceY);
              const stretchFactor = Math.min(12, moveMagnitude * 0.015);  // More extreme stretching
              
              // Calculate stretch direction
              const moveAngle = Math.atan2(totalForceY, totalForceX);
              
              // Blue cosmic glow for fast particles
              const glowIntensity = Math.min(0.8, influence * stretchFactor * 0.2);
              if (glowIntensity > 0.05) {
                ctx.save();
                const glowRadius = pr * (2 + stretchFactor * 2);
                const glow = ctx.createRadialGradient(px, py, 0, px, py, glowRadius);
                
                // Blue color scheme with pulse variation
                let blueHue = 210 + pulse * 40; // 210-250 range (blue to purple-blue)
                glow.addColorStop(0, `hsla(${blueHue}, 100%, 50%, ${glowIntensity})`);
                glow.addColorStop(0.6, `hsla(${blueHue + 20}, 100%, 70%, ${glowIntensity * 0.5})`);
                glow.addColorStop(1, `hsla(${blueHue - 10}, 100%, 40%, 0)`);
                
                ctx.fillStyle = glow;
                ctx.fillRect(px - glowRadius, py - glowRadius, glowRadius * 2, glowRadius * 2);
                ctx.restore();
              }
              
              // Draw elongated particle
              ctx.save();
              ctx.translate(px, py);
              ctx.rotate(moveAngle);
              
              if (stretchFactor > 1.2) {
                // Ultra-stretched particles when moving fast
                ctx.scale(stretchFactor, 1/Math.sqrt(stretchFactor));
                ctx.beginPath();
                ctx.arc(0, 0, pr, 0, 2 * Math.PI);
                
                // Apply color based on speed (blue for fast particles)
                const speedAlpha = Math.min(1, 0.4 + stretchFactor * 0.1);
                if (stretchFactor > 3) {
                  ctx.fillStyle = `rgba(100, 150, 255, ${speedAlpha})`;
                } else {
                  // Blend between black and blue based on stretch
                  const blendToBlue = (stretchFactor - 1.2) / 1.8; // 0 to 1
                  const r = Math.floor(blendToBlue * 100);
                  const g = Math.floor(blendToBlue * 150);
                  const b = Math.floor(blendToBlue * 255);
                  ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${speedAlpha})`;
                }
                
                // Add epic cosmic trails
                if (stretchFactor > 2) {
                  // Create multiple trail segments for a comet-like effect
                  const trailSegments = Math.floor(stretchFactor * 2);
                  const baseTrailLength = pr * stretchFactor * 5;
                  
                  for (let seg = 0; seg < trailSegments; seg++) {
                    const segOffset = -(baseTrailLength * seg/trailSegments);
                    const segWidth = pr * (1 - seg/trailSegments * 0.7);
                    const trailGradient = ctx.createLinearGradient(
                      segOffset - baseTrailLength/trailSegments, 0,
                      segOffset, 0
                    );
                    
                    // Blue flame trail effect
                    const opacity = (1 - seg/trailSegments) * glowIntensity * 0.7;
                    trailGradient.addColorStop(0, `rgba(50, 100, 255, 0)`);
                    trailGradient.addColorStop(0.4, `rgba(100, 150, 255, ${opacity * 0.3})`);
                    trailGradient.addColorStop(1, `rgba(150, 200, 255, ${opacity})`);
                    
                    ctx.fillStyle = trailGradient;
                    ctx.beginPath();
                    ctx.moveTo(segOffset, 0);
                    ctx.lineTo(segOffset - baseTrailLength/trailSegments, segWidth);
                    ctx.lineTo(segOffset - baseTrailLength/trailSegments, -segWidth);
                    ctx.closePath();
                    ctx.fill();
                  }
                  
                  // Add cosmic particles/sparks emanating from fast-moving particles
                  if (stretchFactor > 5 && Math.random() > 0.7) {
                    const sparkCount = Math.floor(stretchFactor * 2);
                    for (let i = 0; i < sparkCount; i++) {
                      const sparkAngle = (Math.random() - 0.5) * Math.PI * 0.8;
                      const sparkDist = Math.random() * baseTrailLength * 0.7;
                      const sparkSize = Math.random() * pr * 0.6;
                      
                      ctx.save();
                      ctx.rotate(sparkAngle);
                      ctx.translate(-sparkDist, 0);
                      
                      // Spark glow
                      const sparkGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, sparkSize * 3);
                      sparkGlow.addColorStop(0, `rgba(200, 220, 255, ${0.7 * Math.random()})`);
                      sparkGlow.addColorStop(1, 'rgba(100, 180, 255, 0)');
                      ctx.fillStyle = sparkGlow;
                      ctx.fillRect(-sparkSize * 3, -sparkSize * 3, sparkSize * 6, sparkSize * 6);
                      
                      // Spark core
                      ctx.beginPath();
                      ctx.arc(0, 0, sparkSize, 0, Math.PI * 2);
                      ctx.fillStyle = 'rgba(220, 240, 255, 0.9)';
                      ctx.fill();
                      ctx.restore();
                    }
                  }
                }
              } else {
                // Regular circle for slow-moving particles with subtle blue hint
                ctx.arc(0, 0, pr, 0, 2 * Math.PI);
                const blueHint = influence * 0.3;
                ctx.fillStyle = `rgba(${0}, ${0}, ${Math.floor(blueHint * 255)}, 1)`;
              }
              
              ctx.fill();
              ctx.restore();
              
              // Skip the regular draw since we just did a custom one
              continue;
            }
          }
        }

        // Draw particle (only reached if not affected by mouse)
        if (pr > 0.05) {
          ctx.beginPath();
          ctx.arc(px, py, pr, 0, 2 * Math.PI);
          ctx.fillStyle = "black";
          ctx.fill();
        }
      }
      ctx.restore();
      reqId = requestAnimationFrame(animate);
    }

    reqId = requestAnimationFrame(animate);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePos({ x, y });
    };

    const handleMouseLeave = () => {
      setMousePos(null);
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(reqId);
    };
  }, [particles, isTransitioning, startTime, shapes, currentShapeIndex, targetShapeIndex, mousePos]);

  function endTransition() {
    setIsTransitioning(false);
    if (targetShapeIndex !== null) {
      setCurrentShapeIndex(targetShapeIndex);
      setTargetShapeIndex(null);
    }
    setParticles((old) =>
      old.map((p) => ({
        ...p,
        x: p.targetX,
        y: p.targetY,
        r: p.targetR,
        startX: p.targetX,
        startY: p.targetY,
        startR: p.targetR,
        isStationary: true,
      }))
    );
  }

  return (
    <div className="w-full aspect-square max-w-[300px] mx-auto mb-4">
      <canvas ref={canvasRef} width={300} height={300} />
    </div>
  );
}

// Utility functions (unchanged)
async function fetchAndParseSvg(url: string): Promise<ShapeData> {
  const resp = await fetch(url);
  const svgText = await resp.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgText, "image/svg+xml");
  const svgElement = doc.querySelector("svg");
  const width = parseFloat(svgElement?.getAttribute("width") || "0");
  const height = parseFloat(svgElement?.getAttribute("height") || "0");
  const centerX = width / 2;
  const centerY = height / 2;
  const circles = [...doc.querySelectorAll("circle")].map((circle) => {
    const cx = parseFloat(circle.getAttribute("cx") || "0") - centerX;
    const cy = parseFloat(circle.getAttribute("cy") || "0") - centerY;
    const r = parseFloat(circle.getAttribute("r") || "0");
    return { cx, cy, r };
  });
  return { circles, width, height };
}

function distance(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function randomRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function easeInOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}