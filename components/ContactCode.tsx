import styles from '@/styles/ContactCode.module.css';

const contactItems = [
  {
    social: 'E-Mail',
    link: 'i.am.shantanu07@gmail.com',
    href: 'mailto:i.am.shantanu07@gmail.com',
  },
  {
    social: 'Linkedin',
    link: 'Shantanu Maratha',
    href: 'https://www.linkedin.com/in/shantanu-maratha28',
  },
  {
    social: 'GitHub',
    link: 'shaxntanu',
    href: 'https://github.com/shaxntanu',
  },
  {
    social: 'Google for Developers',
    link: 'shaxntanu',
    href: 'https://g.dev/shaxntanu',
  },
  {
    social: 'Monkeytype',
    link: 'shaxntanu',
    href: 'https://monkeytype.com/profile/shaxntanu',
  },
  {
    social: 'Instagram',
    link: 'shaxntanu',
    href: 'https://www.instagram.com/shaxntanu',
  },
  {
    social: 'Duolingo',
    link: 'shaxntanu',
    href: 'https://www.duolingo.com/profile/shaxntanu',
  },
];

const ContactCode = () => {
  return (
    <div className={styles.code}>
      <p className={styles.line}>
        <span className={styles.className}>.socials</span> &#123;
      </p>
      {contactItems.map((item, index) => (
        <p className={styles.line} key={index}>
          &nbsp;&nbsp;&nbsp;{item.social}:{' '}
          <a href={item.href} target="_blank" rel="noopener">
            {item.link}
          </a>
          ;
        </p>
      ))}
      <p className={styles.line}>&#125;</p>
    </div>
  );
};

export default ContactCode;
