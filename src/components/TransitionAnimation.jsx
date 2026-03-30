import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";

function buildCircuitScene(scene) {
  const curves = [];
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x00d5ff,
    transparent: true,
    opacity: 0.78
  });

  for (let lane = -4; lane <= 4; lane += 2) {
    const points = [];
    for (let i = 0; i < 24; i += 1) {
      const z = -i * 18;
      const x = lane * 1.8 + Math.sin(i * 0.5 + lane) * 1.2;
      const y = Math.cos(i * 0.35 + lane * 0.2) * 1.4;
      points.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(points);
    curves.push(curve);

    const tubePoints = curve.getPoints(500);
    const geometry = new THREE.BufferGeometry().setFromPoints(tubePoints);
    const line = new THREE.Line(geometry, lineMaterial.clone());
    scene.add(line);
  }

  return curves;
}

function addEnergyPulses(scene, curves) {
  const pulses = [];

  curves.forEach((curve, idx) => {
    const pulseGeometry = new THREE.SphereGeometry(0.18, 8, 8);
    const pulseMaterial = new THREE.MeshBasicMaterial({
      color: idx % 2 === 0 ? 0x4cd8ff : 0x00ffe5
    });

    for (let i = 0; i < 4; i += 1) {
      const mesh = new THREE.Mesh(pulseGeometry, pulseMaterial.clone());
      const t = (i * 0.24 + idx * 0.09) % 1;
      const speed = 0.14 + (idx % 3) * 0.03;
      const offset = i * 0.17;
      scene.add(mesh);
      pulses.push({ mesh, curve, t, speed, offset });
    }
  });

  return pulses;
}

function addParticles(scene) {
  const particleCount = 1200;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 26;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 2] = -Math.random() * 520;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0x4cc9ff,
    size: 0.06,
    transparent: true,
    opacity: 0.72,
    blending: THREE.AdditiveBlending
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);
  return points;
}

export default function TransitionAnimation({
  targetRoute,
  targetLabel,
  duration = 2000,
  onFinish
}) {
  const navigate = useNavigate();
  const mountRef = useRef(null);
  const frameRef = useRef(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!targetRoute) {
      return undefined;
    }

    setIsVisible(true);

    if (!mountRef.current) {
      return undefined;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000205);
    scene.fog = new THREE.Fog(0x000205, 14, 230);

    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 500);
    camera.position.set(0, 0, 20);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0x3abfff, 0.42);
    scene.add(ambient);

    const curves = buildCircuitScene(scene);
    const pulses = addEnergyPulses(scene, curves);
    const particles = addParticles(scene);

    let disposed = false;
    const clock = new THREE.Clock();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onResize);

    const animate = () => {
      if (disposed) {
        return;
      }

      const elapsed = clock.getElapsedTime();
      const delta = clock.getDelta();

      camera.position.z -= delta * 22;
      camera.position.x = Math.sin(elapsed * 0.9) * 1.4;
      camera.position.y = Math.cos(elapsed * 0.65) * 0.8;

      if (camera.position.z < -160) {
        camera.position.z = 20;
      }

      const pAttr = particles.geometry.attributes.position;
      for (let i = 0; i < pAttr.count; i += 1) {
        pAttr.array[i * 3 + 2] += delta * 45;
        if (pAttr.array[i * 3 + 2] > 14) {
          pAttr.array[i * 3 + 2] = -500;
        }
      }
      pAttr.needsUpdate = true;

      pulses.forEach((pulse, idx) => {
        pulse.t = (pulse.t + delta * pulse.speed) % 1;
        const pos = pulse.curve.getPointAt((pulse.t + pulse.offset) % 1);
        pulse.mesh.position.copy(pos);
        const glow = 0.6 + Math.sin(elapsed * 6 + idx) * 0.4;
        pulse.mesh.scale.setScalar(0.8 + glow * 0.9);
      });

      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    const navigateTimer = setTimeout(() => {
      setIsVisible(false);
      navigate(targetRoute);
      if (onFinish) {
        setTimeout(onFinish, 180);
      }
    }, duration);

    return () => {
      disposed = true;
      clearTimeout(navigateTimer);
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", onResize);

      scene.traverse((obj) => {
        if (obj.geometry) {
          obj.geometry.dispose();
        }
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((mat) => mat.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });

      renderer.dispose();
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [duration, navigate, onFinish, targetRoute]);

  return (
    <AnimatePresence>
      {targetRoute && (
        <motion.div
          className="transition-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="transition-canvas" ref={mountRef} />
          <div className="transition-hud">
            <p>NAVIGATING TO</p>
            <h2>{targetLabel}</h2>
            <span>Entering digital circuit space...</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
