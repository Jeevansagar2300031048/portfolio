import PageTransition from "../components/PageTransition";
import ExternalActionCard from "../components/ExternalActionCard";
import { resumeData } from "../data/resumeData";

export default function Projects() {
  return (
    <PageTransition>
      <div className="content-card">
        <h2>Projects</h2>
        <div className="project-grid">
          {resumeData.projects.map((project) => (
            <ExternalActionCard
              key={project.title}
              title={project.title}
              description={project.points.join(" ")}
              buttonText="View Code"
              link={project.codeLink}
            />
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
