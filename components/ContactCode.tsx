import styles from '@/styles/ContactCode.module.css';

const contactCategories = [
  {
    category: 'Professional',
    items: [
      {
        social: 'E-Mail',
        link: 'i.am.shantanu07@gmail.com',
        href: 'mailto:i.am.shantanu07@gmail.com',
      },
      {
        social: 'LinkedIn',
        link: 'Shantanu M.',
        href: 'https://www.linkedin.com/in/shantanu-maratha28',
      },
    ],
  },
  {
    category: 'Engineering',
    items: [
      {
        social: 'GitHub',
        link: 'shaxntanu',
        href: 'https://github.com/shaxntanu',
      },
      {
        social: 'CircuitLab',
        link: 'shaxntanu',
        href: 'https://www.circuitlab.com/user/shaxntanu/',
      },
      {
        social: 'Hackaday',
        link: 'shaxntanu',
        href: 'https://hackaday.io/shaxntanu',
      },
      {
        social: 'Instructables',
        link: 'shaxntanu',
        href: 'https://www.instructables.com/member/shaxntanu',
      },
      {
        social: 'Google for Developers',
        link: 'shaxntanu',
        href: 'https://g.dev/shaxntanu',
      },
    ],
  },
  {
    category: 'Developer Platforms',
    items: [
      {
        social: 'Git City',
        link: 'shaxntanu',
        href: 'https://www.thegitcity.com/dev/shaxntanu',
      },
      {
        social: 'Medium',
        link: 'shaxntanu',
        href: 'https://shaxntanu.medium.com',
      },
      {
        social: 'GSSoC',
        link: 'shaxntanu',
        href: 'https://gssoc.girlscript.org/profile/57b69c1c-a1c8-454a-a4c5-1e94093eefd7',
      },
    ],
  },
  {
    category: 'Personal',
    items: [
      {
        social: 'Monkeytype',
        link: 'shaxntanu',
        href: 'https://monkeytype.com/profile/shaxntanu',
      },
      {
        social: 'VSCO',
        link: 'shaxntanu',
        href: 'https://vsco.co/shaxntanu',
      },
    ],
  },
];

const ContactCode = () => {
  return (
    <div className={styles.code}>
      <p className={styles.line}>
        <span className={styles.className}>.socials</span> &#123;
      </p>
      {contactCategories.map((category, catIndex) => (
        <div key={catIndex}>
          <p className={`${styles.line} ${styles.category}`}>
            <span className={styles.categoryName}>{category.category}</span> &#123;
          </p>
          {category.items.map((item, itemIndex) => (
            <p className={`${styles.line} ${styles.property}`} key={itemIndex}>
              <span className={styles.indent}>{item.social}:</span>{' '}
              <a href={item.href} target="_blank" rel="noopener">
                {item.link}
              </a>
              ;
            </p>
          ))}
          <p className={`${styles.line} ${styles.category}`}>&#125;</p>
        </div>
      ))}
      <p className={styles.line}>&#125;</p>
    </div>
  );
};

export default ContactCode;
