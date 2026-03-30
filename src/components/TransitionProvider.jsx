import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

const TransitionContext = createContext(null);
const VIDEO_START_DELAY_MS = 220;
const VIDEO_PLAY_MS = 1500;
const TOTAL_TRANSITION_MS = VIDEO_START_DELAY_MS + VIDEO_PLAY_MS;

export function TransitionProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const stageRef = useRef(null);
  const timersRef = useRef({ video: null, fallback: null });
  const navigatingRef = useRef(false);
  const targetRouteRef = useRef(null);

  const [phase, setPhase] = useState("idle");
  const [targetRoute, setTargetRoute] = useState(null);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 0, y: 0 });
  const [videoSrc] = useState("/assets/transition.mp4");

  const clearTimers = () => {
    if (timersRef.current.video) {
      clearTimeout(timersRef.current.video);
      timersRef.current.video = null;
    }

    if (timersRef.current.fallback) {
      clearTimeout(timersRef.current.fallback);
      timersRef.current.fallback = null;
    }
  };

  const resetTransition = () => {
    clearTimers();
    navigatingRef.current = false;
    targetRouteRef.current = null;
    setPhase("idle");
    setTargetRoute(null);
  };

  const completeTransition = (routeOverride) => {
    const routeToNavigate = routeOverride || targetRouteRef.current;

    if (navigatingRef.current || !routeToNavigate) {
      return;
    }

    navigatingRef.current = true;
    clearTimers();
    navigate(routeToNavigate);
    resetTransition();
  };

  const startTransition = (event, to) => {
    if (phase !== "idle" || to === location.pathname) {
      return;
    }

    const triggerRect = event.currentTarget.getBoundingClientRect();
    const stageRect = stageRef.current?.getBoundingClientRect();

    const originX = triggerRect.left + triggerRect.width / 2 - (stageRect?.left || 0);
    const originY = triggerRect.top + triggerRect.height / 2 - (stageRect?.top || 0);

    setZoomOrigin({ x: originX, y: originY });
    setTargetRoute(to);
    targetRouteRef.current = to;
    setPhase("zooming");

    timersRef.current.video = setTimeout(() => {
      setPhase("video");
    }, VIDEO_START_DELAY_MS);

    timersRef.current.fallback = setTimeout(() => {
      completeTransition(to);
    }, TOTAL_TRANSITION_MS);
  };

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  const value = useMemo(
    () => ({
      phase,
      zoomOrigin,
      stageRef,
      startTransition,
      completeTransition,
      videoSrc,
      isTransitioning: phase !== "idle"
    }),
    [phase, zoomOrigin, videoSrc]
  );

  return <TransitionContext.Provider value={value}>{children}</TransitionContext.Provider>;
}

export function useTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error("useTransition must be used inside TransitionProvider");
  }
  return context;
}

export function TransitionOverlay() {
  const { phase, completeTransition, videoSrc } = useTransition();

  return (
    <AnimatePresence>
      {phase === "video" && (
        <motion.div
          className="cinematic-transition-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="cinematic-transition-flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          />

          <video
            className="cinematic-transition-video"
            autoPlay
            muted
            playsInline
            onEnded={completeTransition}
            preload="auto"
          >
            <source src={videoSrc} type="video/mp4" />
            <source src="/assets/Animation_Circuit_POV.mp4" type="video/mp4" />
          </video>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
