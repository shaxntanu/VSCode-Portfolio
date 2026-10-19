import Link from 'next/link';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { VscArrowLeft, VscArrowRight, VscCircuitBoard, VscExternalLink } from 'react-icons/vsc';
import { projects, categoryConfig } from '@/data/projects';
import { projectCaseStudies, type ProjectCaseStudy } from '@/data/projectCaseStudies';
import type { Project } from '@/types';

import styles from '@/styles/ProjectCaseStudy.module.css';

interface ProjectCaseStudyPageProps {
  project: Project;
  caseStudy: ProjectCaseStudy;
  title: string;
  ogDescription: string;
}

const ProjectCaseStudyPage = ({ project, caseStudy }: ProjectCaseStudyPageProps) => {
  const architectureSteps = project.architecture
    ?.split('→')
    .map((step) => step.trim())
    .filter(Boolean) ?? [];

  return (
    <main className={styles.page}>
      <Link href="/projects" className={styles.backLink}>
        <VscArrowLeft aria-hidden="true" />
        <span>All projects</span>
      </Link>

      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>
            {categoryConfig[project.category].titleHighlight.replace(/_/g, ' ')} · Case study
          </p>
          <h1>{project.title}</h1>
          <p className={styles.description}>{caseStudy.overview}</p>
          <div className={styles.meta}>
            <span>{project.dateRange}</span>
          </div>
        </div>
        <nav className={styles.resourceLinks} aria-label={`${project.title} links`}>
          <a href={project.link} target="_blank" rel="noopener noreferrer">
            <VscExternalLink aria-hidden="true" />
            GitHub repository
          </a>
          {project.reportLink && (
            <a href={project.reportLink} target="_blank" rel="noopener noreferrer">
              <VscExternalLink aria-hidden="true" />
              Technical report
            </a>
          )}
        </nav>
      </header>

      <section className={styles.section} aria-labelledby="architecture-heading">
        <div className={styles.sectionHeading}>
          <span className={styles.sectionIndex}>01</span>
          <div>
            <p className={styles.sectionKicker}>System map</p>
            <h2 id="architecture-heading">Architecture path</h2>
          </div>
        </div>
        <div className={styles.architecture}>
          {architectureSteps.map((step, index) => (
            <div className={styles.architectureStep} key={`${step}-${index}`}>
              <span className={styles.architectureNode}>{step}</span>
              {index < architectureSteps.length - 1 && (
                <VscArrowRight className={styles.architectureArrow} aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="design-heading">
        <div className={styles.sectionHeading}>
          <span className={styles.sectionIndex}>02</span>
          <div>
            <p className={styles.sectionKicker}>Engineering design</p>
            <h2 id="design-heading">Subsystem breakdown</h2>
          </div>
        </div>
        <div className={styles.designGrid}>
          {caseStudy.designSections.map((section) => (
            <article className={styles.designCard} key={section.title}>
              <h3>{section.title}</h3>
              <p>{section.description}</p>
            </article>
          ))}
        </div>
      </section>

      {project.components && project.components.length > 0 && (
        <section className={styles.section} aria-labelledby="hardware-heading">
          <div className={styles.sectionHeading}>
            <span className={styles.sectionIndex}>03</span>
            <div>
              <p className={styles.sectionKicker}>Bill of materials</p>
              <h2 id="hardware-heading">Hardware inventory</h2>
            </div>
          </div>
          <div className={styles.inventoryIntro}>
            <VscCircuitBoard aria-hidden="true" />
            <span>{project.components.length} listed components</span>
            {project.totalCost && <strong>Estimated total: {project.totalCost}</strong>}
          </div>
          <div className={styles.componentGrid}>
            {project.components.map((component, index) => (
              <article className={styles.componentCard} key={`${component.name}-${index}`}>
                <div className={styles.componentTitle}>
                  <h3>{component.name}</h3>
                  <span>×{component.quantity}</span>
                </div>
                <p>{component.role}</p>
                <dl>
                  <div>
                    <dt>Interface</dt>
                    <dd>{component.interface}</dd>
                  </div>
                  <div>
                    <dt>Voltage</dt>
                    <dd>{component.voltage}</dd>
                  </div>
                  {component.price && (
                    <div>
                      <dt>Listed price</dt>
                      <dd>{component.price}</dd>
                    </div>
                  )}
                </dl>
                {component.notes && <small>{component.notes}</small>}
              </article>
            ))}
          </div>
        </section>
      )}

      <footer className={styles.footer}>
        <p>Explore the code and project documentation.</p>
        <div className={styles.resourceLinks}>
          <a href={project.link} target="_blank" rel="noopener noreferrer">
            GitHub repository <VscExternalLink aria-hidden="true" />
          </a>
          {project.reportLink && (
            <a href={project.reportLink} target="_blank" rel="noopener noreferrer">
              Technical report <VscExternalLink aria-hidden="true" />
            </a>
          )}
          <Link href="/projects">Back to projects</Link>
        </div>
      </footer>
    </main>
  );
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: Object.keys(projectCaseStudies).map((slug) => ({ params: { slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<ProjectCaseStudyPageProps> = async ({ params }) => {
  const slug = typeof params?.slug === 'string' ? params.slug : '';
  const project = projects.find((item) => item.slug === slug);
  const caseStudy = projectCaseStudies[slug];

  if (!project || !caseStudy) {
    return { notFound: true };
  }

  return {
    props: {
      project,
      caseStudy,
      title: `${project.title} case study`,
      ogDescription: project.description,
    },
  };
};

export default ProjectCaseStudyPage;
