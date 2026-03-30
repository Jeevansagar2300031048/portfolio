import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function AnimeTransition({ target, targetLabel, duration = 1300, onFinish }) {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);

  const streaks = useMemo(
    () =>
      Array.from({ length: 13 }).map((_, i) => ({
        id: i,
        top: `${4 + i * 7}%`,
        delay: i * 0.035,
        rotate: i % 2 === 0 ? -8 : 8,
        scale: 0.85 + i * 0.03
      })),
    []
  );

  useEffect(() => {
    if (!target) {
      return undefined;
    }

    setActive(true);

    const timer = setTimeout(() => {
      navigate(target);
      setActive(false);
      if (onFinish) {
        setTimeout(onFinish, 160);
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, navigate, onFinish, target]);

  return (
    <AnimatePresence>
      {target && (
        <motion.div
          className="anime-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: active ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="anime-backdrop"
            initial={{ scale: 1, filter: "blur(0px)" }}
            animate={{
              scale: [1, 1.05, 1.12],
              filter: ["blur(0px)", "blur(4px)", "blur(9px)"]
            }}
            transition={{ duration: duration / 1000, ease: [0.17, 0.67, 0.33, 1] }}
          />

          <motion.div
            className="anime-flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.15, 0] }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          />

          <motion.div
            className="anime-wave"
            initial={{ scale: 0.08, opacity: 0.95 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 0.84, 0.44, 1], delay: 0.08 }}
          />

          <div className="anime-streaks-wrap">
            {streaks.map((streak) => (
              <motion.div
                key={streak.id}
                className="anime-streak"
                style={{ top: streak.top, rotate: `${streak.rotate}deg` }}
                initial={{ x: "-120%", opacity: 0, scaleX: streak.scale }}
                animate={{
                  x: ["-120%", "0%", "140%"],
                  opacity: [0, 1, 0.82, 0]
                }}
                transition={{ duration: 0.65, delay: streak.delay, ease: "easeOut" }}
              />
            ))}
          </div>

          <motion.div
            className="anime-core-burst"
            initial={{ scale: 0.2, opacity: 0.95 }}
            animate={{ scale: [0.2, 1.25, 1.6], opacity: [0.95, 0.52, 0] }}
            transition={{ duration: 0.72, ease: "easeOut", delay: 0.05 }}
          />

          <motion.div
            className="anime-hud"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: [0, 1, 0.5], y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <p>SCENE SHIFT</p>
            <h2>{targetLabel}</h2>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
