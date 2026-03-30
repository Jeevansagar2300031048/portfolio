import PageTransition from "../components/PageTransition";
import ExternalActionCard from "../components/ExternalActionCard";
import { resumeData } from "../data/resumeData";

export default function Achievements() {
  return (
    <PageTransition>
      <div className="content-card">
        <h2>Key Achievements</h2>
        <div className="project-grid">
          {resumeData.achievements.map((item) => (
            <ExternalActionCard
              key={item.title}
              title={item.title}
              description="Click to open certificate in a new tab"
              buttonText="View Certificate"
              link={item.link}
            />
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
