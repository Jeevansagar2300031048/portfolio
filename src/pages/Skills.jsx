import PageTransition from "../components/PageTransition";
import { resumeData } from "../data/resumeData";

export default function Skills() {
  const groupedSkills = [
    { title: "Languages", values: resumeData.skills.languages },
    { title: "Tools", values: resumeData.skills.tools },
    { title: "Web Technologies", values: resumeData.skills.webTechnologies }
  ];

  return (
    <PageTransition>
      <div className="content-card">
        <h2>Skills</h2>
        <div className="section-stack">
          {groupedSkills.map((group) => (
            <section className="content-subcard" key={group.title}>
              <h3>{group.title}</h3>
              <div className="chip-grid">
                {group.values.map((skill) => (
                  <span className="chip" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
