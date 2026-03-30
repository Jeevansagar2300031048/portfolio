import PageTransition from "../components/PageTransition";
import { resumeData } from "../data/resumeData";

export default function Education() {
  return (
    <PageTransition>
      <div className="content-card">
        <h2>Education</h2>
        <div className="section-stack">
          {resumeData.education.map((item) => (
            <article className="content-subcard" key={item.degree}>
              <div className="row-space">
                <h3>{item.degree}</h3>
                <span className="meta-text">{item.years}</span>
              </div>
              <p>{item.institution}</p>
            </article>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
