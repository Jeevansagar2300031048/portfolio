import { motion } from "framer-motion";
import { NAV_ITEMS } from "../utils/routes";
import CircuitLink from "./CircuitLink";

export default function Layout({ children, currentPath }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">Jeevan.dev</div>

        <nav className="nav-buttons" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => {
            const active = currentPath === item.path;
            return (
              <CircuitLink key={item.path} to={item.path}>
                {({ onClick, isTransitioning }) => (
                  <motion.button
                    className={`nav-btn ${active ? "active" : ""}`}
                    type="button"
                    whileHover={{ y: -2, boxShadow: "0 0 14px rgba(0, 229, 255, 0.55)" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onClick}
                    disabled={isTransitioning}
                  >
                    {item.label}
                  </motion.button>
                )}
              </CircuitLink>
            );
          })}
        </nav>
      </header>

      <div className="page-wrap">{children}</div>
    </div>
  );
}
