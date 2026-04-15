import styles from '@/styles/AboutPage.module.css';

const AboutPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}># DATASHEET: Shantanu Maratha</h1>
        <div className={styles.subtitle}>Version: 2.3 | Architecture: IoT & Embedded Systems</div>

        <div className={styles.aboutContent}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>01. Origin Story</h2>
            <p className={styles.paragraph}>
              My interest in engineering started when robotics was introduced in school. It wasn&apos;t just another subject — it was the first time I actually got pulled into how things work.
            </p>
            <p className={styles.paragraph}>
              While most people treated it like a class, I kept going deeper — opening things up, experimenting, and trying to understand systems instead of just using them.
            </p>
            <p className={styles.paragraph}>
              That curiosity stayed. Now I mostly learn by building — breaking things, fixing them, and repeating the cycle.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>02. Why I Build</h2>
            <p className={styles.paragraph}>
              I don&apos;t like building things just to show them off. If something doesn&apos;t solve a real problem, it&apos;s not worth the time.
            </p>
            <p className={styles.paragraph}>
              Most of my projects are centered around practical impact — whether it&apos;s assistive systems like a Smart Blind Stick or environmental monitoring like Zephyr Station.
            </p>
            <p className={styles.paragraph}>
              The goal is simple: make things that actually work in the real world, not just on paper.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>03. Startup Experience</h2>
            <p className={styles.paragraph}>
              Being a core member and working on <span className={styles.highlight}>Ragastra</span> gave me direct exposure to what building a product from scratch actually feels like.
            </p>
            <p className={styles.paragraph}>
              There was no fixed roadmap — we had to figure things out as we went. From shaping ideas to turning them into working systems, I was involved in making decisions, solving problems, and pushing things forward.
            </p>
            <p className={styles.paragraph}>
              It forced me to think beyond just code — handling uncertainty, adapting quickly, and focusing on execution instead of overplanning.
            </p>
            <p className={styles.paragraph}>
              It made one thing clear: real-world building is chaotic, and you learn by doing, not by waiting.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>04. Offline Mode</h2>
            <p className={styles.paragraph}>
              When I&apos;m not building, I&apos;m usually reading or thinking about ideas.
            </p>
            <p className={styles.paragraph}>
              I read a mix of self-improvement, philosophy, and technical research — mostly to understand how people think and where technology is heading.
            </p>
            <p className={styles.paragraph}>
              Music is a big part of my routine, and a lot of project ideas actually come from just sitting and thinking.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>05. The Dream Build</h2>
            <p className={styles.paragraph}>
              If I had the resources, I&apos;d work on a <span className={styles.highlight}>Neural-Feedback Prosthetic System</span>.
            </p>
            <p className={styles.paragraph}>
              The idea is to build a prosthetic limb that doesn&apos;t just move, but also provides real sensory feedback — allowing the user to feel touch.
            </p>
            <p className={styles.paragraph}>
              It combines embedded systems, sensor integration, and assistive technology — everything I&apos;m currently exploring, but at a much deeper level.
            </p>
            <p className={styles.paragraph}>
              Right now, I&apos;m focused on building smaller systems that move in that direction.
            </p>
          </section>

          <section className={styles.section}>
            <div className={styles.mapContainer}>
              <iframe 
                src="/map.html" 
                className={styles.mapFrame}
                title="World Map"
                scrolling="no"
              />
            </div>
            <p className={styles.proudText}>
              <span className={styles.proudWord}>Proud</span>{' '}
              <span className={styles.indianOrange}>In</span>
              <span className={styles.indianWhite}>di</span>
              <span className={styles.indianGreen}>an</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export async function getStaticProps() {
  return {
    props: { title: 'About' },
  };
}

export default AboutPage;
