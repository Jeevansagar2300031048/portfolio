import { motion } from "framer-motion";

export default function ExternalActionCard({ title, description, buttonText, link }) {
  return (
    <motion.article
      className="external-card"
      whileHover={{ y: -6, boxShadow: "0 0 24px rgba(0, 229, 255, 0.22)" }}
      transition={{ duration: 0.2 }}
    >
      <h3>{title}</h3>
      {description ? <p>{description}</p> : null}
      <button
        type="button"
        className="neon-btn"
        onClick={() => window.open(link, "_blank")}
      >
        {buttonText}
      </button>
    </motion.article>
  );
}
