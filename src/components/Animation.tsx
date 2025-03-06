"use client";

import React, { useEffect, useRef, useState } from "react";

interface Circle {
  cx: number;
  cy: number;
  r: number;
}

interface Particle {
  x: number;       // Current x
  y: number;       // Current y
  r: number;       // Current radius
  targetX: number; // Target x
  targetY: number; // Target y
  targetR: number; // Target radius
}

export default function Animation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shapeA, setShapeA] = useState<Circle[]>([]); // "ap-logo.svg" dots
  const [shapeB, setShapeB] = useState<Circle[]>([]); // "writing-logo.svg" dots
  const [shapeC, setShapeC] = useState<Circle[]>([]); // "wrench-logo.svg" dots
  const [particles, setParticles] = useState<Particle[]>([]);
  const [currentShapeIndex, setCurrentShapeIndex] = useState(0); // 0: shapeA, 1: shapeB, 2: shapeC
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const duration = 2000; // Transition duration: 2 seconds
  const ω = 4 * Math.PI; // Angular speed: 2 full rotations

  // Load all three SVGs and initialize particles on mount
  useEffect(() => {
    async function loadSvgs() {
      const shapeAData = await fetchAndParseSvg("/ap-logo.svg");
      const shapeBData = await fetchAndParseSvg("/writing-logo.svg");
      const shapeCData = await fetchAndParseSvg("/wrench-logo.svg");
      setShapeA(shapeAData);
      setShapeB(shapeBData);
      setShapeC(shapeCData);
      // Initialize particles with shapeA (index 0)
      setParticles(shapeAData.map(dot => ({
        x: dot.cx,
        y: dot.cy,
        r: dot.r,
        targetX: dot.cx,
        targetY: dot.cy,
        targetR: dot.r,
      })));
    }
    loadSvgs();
  }, []);

  // Function to start transition to the next shape
  const startTransition = (targetShape: Circle[]) => {
    setIsTransitioning(true);
    setStartTime(performance.now());

    const newParticles: Particle[] = [];
    const availableTargets = [...targetShape];

    // Map existing particles to closest targets or fade them out
    particles.forEach(p => {
      if (availableTargets.length === 0) {
        // No more targets, fade out by setting target radius to 0
        newParticles.push({
          ...p,
          targetX: p.x,
          targetY: p.y,
          targetR: 0,
        });
      } else {
        // Find closest target
        let closestIndex = 0;
        let minDist = distance(p.x, p.y, availableTargets[0].cx, availableTargets[0].cy);
        for (let i = 1; i < availableTargets.length; i++) {
          const dist = distance(p.x, p.y, availableTargets[i].cx, availableTargets[i].cy);
          if (dist < minDist) {
            minDist = dist;
            closestIndex = i;
          }
        }
        const target = availableTargets.splice(closestIndex, 1)[0];
        newParticles.push({
          ...p,
          targetX: target.cx,
          targetY: target.cy,
          targetR: target.r,
        });
      }
    });

    // Spawn new particles for remaining targets
    availableTargets.forEach(target => {
      newParticles.push({
        x: canvasRef.current ? canvasRef.current.width / (2 * scale) : target.cx,
        y: canvasRef.current ? canvasRef.current.height / (2 * scale) : target.cy,
        r: 0,
        targetX: target.cx,
        targetY: target.cy,
        targetR: target.r,
      });
    });

    setParticles(newParticles);
  };

  // Animation loop
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || particles.length === 0) return;

    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;

    // Calculate scaling based on all three shapes
    const findBounds = (shapes: Circle[]) => {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      shapes.forEach(c => {
        minX = Math.min(minX, c.cx - c.r);
        minY = Math.min(minY, c.cy - c.r);
        maxX = Math.max(maxX, c.cx + c.r);
        maxY = Math.max(maxY, c.cy + c.r);
      });
      return { minX, minY, maxX, maxY };
    };

    const boundsA = shapeA.length ? findBounds(shapeA) : { minX: 0, minY: 0, maxX: 300, maxY: 300 };
    const boundsB = shapeB.length ? findBounds(shapeB) : { minX: 0, minY: 0, maxX: 300, maxY: 300 };
    const boundsC = shapeC.length ? findBounds(shapeC) : { minX: 0, minY: 0, maxX: 300, maxY: 300 };
    const minX = Math.min(boundsA.minX, boundsB.minX, boundsC.minX);
    const minY = Math.min(boundsA.minY, boundsB.minY, boundsC.minY);
    const maxX = Math.max(boundsA.maxX, boundsB.maxX, boundsC.maxX);
    const maxY = Math.max(boundsA.maxY, boundsB.maxY, boundsC.maxY);
    const svgWidth = maxX - minX;
    const svgHeight = maxY - minY;
    const scaleX = canvasWidth / svgWidth;
    const scaleY = canvasHeight / svgHeight;
    const scale = Math.min(scaleX, scaleY) * 0.9;

    let reqId: number;

    function animate(time: number) {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.save();
      ctx.translate(canvasWidth / 2, canvasHeight / 2);
      ctx.scale(scale, scale);
      ctx.translate(-(minX + svgWidth / 2), -(minY + svgHeight / 2));

      const currentShape = currentShapeIndex === 0 ? shapeA : currentShapeIndex === 1 ? shapeB : shapeC;

      if (isTransitioning) {
        const t = Math.min((time - startTime) / duration, 1);
        if (t >= 1) {
          setIsTransitioning(false);
          const nextShapeIndex = (currentShapeIndex + 1) % 3;
          setCurrentShapeIndex(nextShapeIndex);
          setParticles(particles.map(p => ({
            ...p,
            x: p.targetX,
            y: p.targetY,
            r: p.targetR,
          })));
        }

        // Animate all particles
        particles.forEach(p => {
          const dx = p.targetX - p.x;
          const dy = p.targetY - p.y;
          const r_initial = Math.sqrt(dx * dx + dy * dy);
          const radius = p.r + (p.targetR - p.r) * t;

          if (r_initial === 0 || radius <= 0) {
            if (radius > 0) {
              ctx.beginPath();
              ctx.arc(p.targetX, p.targetY, radius, 0, 2 * Math.PI);
              ctx.fillStyle = "black";
              ctx.fill();
            }
            return;
          }

          const φ_initial = Math.atan2(dy, dx);
          const r = r_initial * (1 - t);
          const φ = φ_initial + ω * t;
          const x = p.targetX + r * Math.cos(φ);
          const y = p.targetY + r * Math.sin(φ);

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, 2 * Math.PI);
          ctx.fillStyle = "black";
          ctx.fill();
        });
      } else {
        particles.forEach(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
          ctx.fillStyle = "black";
          ctx.fill();
        });
      }

      ctx.restore();
      reqId = requestAnimationFrame(animate);
    }

    animate(performance.now());
    return () => cancelAnimationFrame(reqId);
  }, [particles, isTransitioning, startTime, shapeA, shapeB, shapeC, currentShapeIndex]);

  // Trigger transition every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      const nextShapeIndex = (currentShapeIndex + 1) % 3;
      const targetShape = nextShapeIndex === 0 ? shapeA : nextShapeIndex === 1 ? shapeB : shapeC;
      startTransition(targetShape);
    }, 4000); // 2s transition + 2s pause
    return () => clearInterval(timer);
  }, [shapeA, shapeB, shapeC, currentShapeIndex, particles]);

  return (
    <div className="w-full aspect-square max-w-[250px] mx-auto mb-4">
      <canvas ref={canvasRef} width={250} height={250} />
    </div>
  );
}

// Utility functions
async function fetchAndParseSvg(url: string): Promise<Circle[]> {
  const resp = await fetch(url);
  const svgText = await resp.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgText, "image/svg+xml");
  const circles = [...doc.querySelectorAll("circle")];
  return circles.map(circle => ({
    cx: parseFloat(circle.getAttribute("cx") || "0"),
    cy: parseFloat(circle.getAttribute("cy") || "0"),
    r: parseFloat(circle.getAttribute("r") || "0"),
  }));
}

function distance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}