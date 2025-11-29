import styles from '@/styles/AboutPage.module.css';

const AboutPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}># DATASHEET: Shantanu Maratha</h1>
        <div className={styles.subtitle}>Version: 2.3 | Architecture: IoT & Embedded Engineer</div>

        <div className={styles.aboutContent}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Origin Story</h2>
            <p className={styles.paragraph}>
              My interest in engineering started early when robotics was first introduced in my school. It wasn&apos;t just a class for me; it was the moment I knew exactly what I wanted to do. While other kids were playing, I was trying to figure out how things worked. That curiosity never left, and it&apos;s what drives every project I take on today.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Why I Build</h2>
            <p className={styles.paragraph}>
              I believe technology is only useful if it actually helps people. That&apos;s the common thread in my work. Whether it&apos;s the Smart Blind Stick helping someone navigate safely or the Zephyr Station monitoring air quality, I want my code to have a tangible impact on the real world. I&apos;m not just building gadgets; I&apos;m trying to solve actual problems.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Startup Experience</h2>
            <p className={styles.paragraph}>
              Working as a Product Developer at <span className={styles.highlight}>Grosity</span> taught me that great engineering is about more than just writing clean code. It&apos;s about finding new paths when the first plan fails, learning on the fly, and working with a team to ship a product. The fast-paced environment forced me to be adaptable and focused on results, not just theory.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Offline Mode</h2>
            <p className={styles.paragraph}>
              When I step away from the keyboard, I&apos;m usually reading. I dive into self-help and philosophy books or browse the latest research papers to see where the industry is going. I spend a lot of time listening to music and mentally sketching out my next project ideas.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. The Dream Build</h2>
            <p className={styles.paragraph}>
              If I had unlimited resources, I&apos;d build a <span className={styles.highlight}>Neural-Feedback Prosthetic System</span>. Imagine a prosthetic limb that doesn&apos;t just move but actually lets the user feel what they are touching through advanced sensor arrays. It combines my passion for assistive tech with complex sensor integration, taking the concept of the Blind Stick to a completely new level.
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
