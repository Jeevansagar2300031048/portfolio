import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

export default function CircuitTransition({
  to,
  children,
  duration = 2500,
  videoSrc = "/assets/Animation_Circuit_POV.mp4"
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isActive, setIsActive] = useState(false);
  const fallbackTimerRef = useRef(null);
  const hasNavigatedRef = useRef(false);

  const cleanupTimer = () => {
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
  };

  const finishTransition = () => {
    if (hasNavigatedRef.current) {
      return;
    }

    hasNavigatedRef.current = true;
    cleanupTimer();
    setIsActive(false);
    navigate(to);
  };

  const handleTransition = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (isActive || to === location.pathname) {
      return;
    }

    hasNavigatedRef.current = false;
    setIsActive(true);
    cleanupTimer();
    fallbackTimerRef.current = setTimeout(finishTransition, duration);
  };

  useEffect(() => {
    return () => {
      cleanupTimer();
    };
  }, []);

  return (
    <>
      {typeof children === "function"
        ? children({ startTransition: handleTransition, isActive })
        : children}

      <AnimatePresence>
        {isActive && (
          <motion.div
            className="circuit-transition-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
          >
            <video
              className="circuit-transition-video"
              src={videoSrc}
              autoPlay
              muted
              playsInline
              preload="auto"
              onEnded={finishTransition}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function withCircuitTransition(WrappedComponent) {
  return function WrappedWithTransition({ to, duration, videoSrc, ...rest }) {
    return (
      <CircuitTransition to={to} duration={duration} videoSrc={videoSrc}>
        {({ startTransition, isActive }) => (
          <WrappedComponent {...rest} onClick={startTransition} disabled={isActive || rest.disabled} />
        )}
      </CircuitTransition>
    );
  };
}
