import PageTransition from "../components/PageTransition";
import { resumeData } from "../data/resumeData";

export default function Experience() {
  const { role, company, duration, points } = resumeData.experience;

  return (
    <PageTransition>
      <div className="content-card">
        <h2>Experience</h2>
        <article className="content-subcard">
          <div className="row-space">
            <h3>{role}</h3>
            <span className="meta-text">{duration}</span>
          </div>
          <p>{company}</p>
          <ul className="resume-list">
            {points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </article>
      </div>
    </PageTransition>
  );
}
