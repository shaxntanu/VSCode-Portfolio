import ContactCode from '@/components/ContactCode';

import styles from '@/styles/ContactPage.module.css';

const ContactPage = () => {
  return (
    <div className={styles.layout}>
      <h1 className={styles.pageTitle}>My Socials</h1>
      <p className={styles.pageSubtitle}>
        These are my social media handles where you can find me online, follow my work, and connect with me across different platforms.
      </p>
      <div className={styles.container}>
        <div className={styles.contactContainer}>
          <ContactCode />
        </div>
      </div>
    </div>
  );
};

export async function getStaticProps() {
  return {
    props: { title: 'Contact' },
  };
}

export default ContactPage;
