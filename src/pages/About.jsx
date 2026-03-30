import PageTransition from "../components/PageTransition";
import { resumeData } from "../data/resumeData";

export default function About() {
  return (
    <PageTransition>
      <div className="content-card">
        <h2>Summary</h2>
        <p>{resumeData.summary}</p>
      </div>
    </PageTransition>
  );
}
