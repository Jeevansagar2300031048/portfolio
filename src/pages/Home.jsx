import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";
import { resumeData } from "../data/resumeData";

export default function Home() {
  return (
    <PageTransition>
      <div className="hero-grid">
        <div>
          <p className="eyebrow">RESUME PORTFOLIO</p>
          <h1>{resumeData.name}</h1>
          <p className="lead">{resumeData.title}</p>
          <motion.div
            className="tech-tags"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, staggerChildren: 0.05 }}
          >
            {[`Email: ${resumeData.email}`, `Phone: ${resumeData.phone}`, `Location: ${resumeData.location}`].map((item) => (
              <motion.span key={item} whileHover={{ scale: 1.05 }}>
                {item}
              </motion.span>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="hero-panel"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3>Quick Links</h3>
          <ul>
            <li>
              <button
                type="button"
                className="inline-link-btn"
                onClick={() => window.open(`mailto:${resumeData.email}`, "_blank")}
              >
                Send Email
              </button>
            </li>
            <li>
              <button
                type="button"
                className="inline-link-btn"
                onClick={() => window.open(resumeData.linkedin, "_blank")}
              >
                Open LinkedIn
              </button>
            </li>
            <li>{resumeData.location}</li>
          </ul>
        </motion.div>
      </div>
    </PageTransition>
  );
}
