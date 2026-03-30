import { motion, AnimatePresence } from "framer-motion";

function CircuitPath({ d, delay }) {
  return (
    <motion.path
      d={d}
      stroke="url(#lineGradient)"
      strokeWidth="2"
      fill="none"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: [0.2, 1, 0.4] }}
      transition={{ duration: 0.75, delay, ease: "easeInOut" }}
      strokeLinecap="round"
    />
  );
}

export default function CircuitLoader({ isActive, onComplete, targetLabel }) {
  const paths = [
    "M 40 110 L 130 110 L 180 60 L 290 60",
    "M 40 140 L 120 140 L 180 190 L 290 190",
    "M 320 125 L 420 125 L 500 60 L 620 60",
    "M 320 125 L 440 125 L 500 200 L 620 200"
  ];

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="circuit-loader-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onAnimationComplete={(definition) => {
            if (definition === "animate") {
              setTimeout(onComplete, 800);
            }
          }}
        >
          <div className="circuit-loader-content">
            <motion.h3
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              Routing to {targetLabel}
            </motion.h3>

            <svg
              className="circuit-loader-svg"
              viewBox="0 0 660 250"
              role="img"
              aria-label="Circuit loading animation"
            >
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00e5ff" />
                  <stop offset="50%" stopColor="#4cc9ff" />
                  <stop offset="100%" stopColor="#00e5ff" />
                </linearGradient>
                <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <g filter="url(#neonGlow)">
                {paths.map((d, i) => (
                  <CircuitPath d={d} delay={i * 0.08} key={d} />
                ))}
              </g>

              <motion.circle
                cx="290"
                cy="125"
                r="28"
                className="core-node"
                initial={{ scale: 0.7, opacity: 0.4 }}
                animate={{ scale: [0.85, 1.06, 0.95], opacity: [0.5, 1, 0.6] }}
                transition={{ duration: 0.7, repeat: Infinity }}
              />

              {[60, 120, 175, 230, 390, 470, 550].map((x, i) => (
                <motion.circle
                  key={x}
                  cx={x}
                  cy={i % 2 === 0 ? 110 : 140}
                  r="4"
                  className="pulse-node"
                  initial={{ opacity: 0.2 }}
                  animate={{ opacity: [0.25, 1, 0.3] }}
                  transition={{ duration: 0.5, delay: i * 0.06, repeat: Infinity }}
                />
              ))}

              <motion.rect
                x="622"
                y="45"
                width="22"
                height="22"
                rx="4"
                className="target-chip"
                initial={{ opacity: 0.3 }}
                animate={{ opacity: [0.2, 1, 0.45] }}
                transition={{ duration: 0.55, repeat: Infinity }}
              />
              <motion.rect
                x="622"
                y="188"
                width="22"
                height="22"
                rx="4"
                className="target-chip"
                initial={{ opacity: 0.3 }}
                animate={{ opacity: [0.2, 1, 0.45] }}
                transition={{ duration: 0.55, repeat: Infinity, delay: 0.2 }}
              />
            </svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
