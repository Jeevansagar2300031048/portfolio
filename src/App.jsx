import { AnimatePresence, motion } from "framer-motion";
import { Routes, Route, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import { TransitionOverlay, TransitionProvider, useTransition } from "./components/TransitionProvider";
import Home from "./pages/Home";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Education from "./pages/Education";
import Experience from "./pages/Experience";
import Projects from "./pages/Projects";
import Achievements from "./pages/Achievements";

export default function App() {
  return (
    <TransitionProvider>
      <AppShell />
    </TransitionProvider>
  );
}

function AppShell() {
  const location = useLocation();
  const { phase, zoomOrigin, stageRef } = useTransition();

  const stageAnimate =
    phase === "idle"
      ? { scale: 1, filter: "blur(0px)", opacity: 1 }
      : { scale: 5, filter: "blur(12px)", opacity: 0.2 };

  return (
    <>
      <motion.div
        ref={stageRef}
        className="transition-zoom-stage"
        style={{ transformOrigin: `${zoomOrigin.x}px ${zoomOrigin.y}px` }}
        animate={stageAnimate}
        transition={{ duration: 0.42, ease: [0.25, 0.9, 0.34, 1] }}
      >
        <Layout currentPath={location.pathname}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/education" element={<Education />} />
              <Route path="/experience" element={<Experience />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/achievements" element={<Achievements />} />
            </Routes>
          </AnimatePresence>
        </Layout>
      </motion.div>

      <TransitionOverlay />
    </>
  );
}
