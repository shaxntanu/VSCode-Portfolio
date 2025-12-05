import Image from 'next/image';
import styles from '@/styles/CertificatesPage.module.css';

interface Course {
  name: string;
  url: string;
}

interface Certificate {
  provider: string;
  courses: Course[];
}

interface CertificateCategory {
  category: string;
  certificates: Certificate[];
}

const certificateData: CertificateCategory[] = [
  {
    category: "Technical Skills",
    certificates: [
      {
        provider: "MIT x Santander",
        courses: [
          { name: "Generative AI", url: "https://drive.google.com/file/d/1ZVLtjz0xh-Yxdh__egPgba0zjxqEiLeF/view?usp=sharing" },
          { name: "IoT", url: "https://drive.google.com/file/d/1yQglfFhR8SS8y3ibK8zGnDyMitvzIPrU/view?usp=sharing" }
        ]
      },
      {
        provider: "Google x Santander",
        courses: [
          { name: "Introduction to AI", url: "https://drive.google.com/file/d/16lO-SM8k2TGsSAl6qkyhInfl8d3UZnD5/view?usp=sharing" }
        ]
      },
      {
        provider: "Santander",
        courses: [
          { name: "Introduction to Python", url: "https://drive.google.com/file/d/1zmsYr8FqLh2Liwx0VFE2YnlydhGDm2E4/view?usp=sharing" }
        ]
      },
      {
        provider: "DishaAI",
        courses: [
          { name: "Generative AI Fundamentals", url: "https://drive.google.com/file/d/16eQ8iMVPF9vurbloSS-g0Fwt-r4MFML1/view?usp=sharing" }
        ]
      }
    ]
  },
  {
    category: "Soft Skills",
    certificates: [
      {
        provider: "Formula 1 x Santander",
        courses: [
          { name: "Leadership", url: "https://drive.google.com/file/d/1xO1YFj5lDT6cGhEAfhUgioW6dyHj9OpC/view?usp=drive_link" }
        ]
      },
      {
        provider: "Thapar Institute Counselling Cell",
        courses: [
          { name: "Understanding Personality Traits", url: "https://drive.google.com/file/d/1kq0KTQisGhxVRJL-GTaoDm3t_e8yfGjk/view?usp=drive_link" },
          { name: "Executive Skills", url: "https://drive.google.com/file/d/1iFBvntUKCkd_N5zJ_roYin3OWLhAn9vv/view?usp=drive_link" },
          { name: "Interpersonal Skills", url: "https://drive.google.com/file/d/1q1TTpTJ41ckRn_qqkyE-U8yYXceFFcNW/view?usp=drive_link" },
          { name: "Stress Management", url: "https://drive.google.com/file/d/1q1TTpTJ41ckRn_qqkyE-U8yYXceFFcNW/view?usp=drive_link" }
        ]
      }
    ]
  },
  {
    category: "Language Skills",
    certificates: [
      {
        provider: "Penn ELP",
        courses: [
          { name: "English Fundamentals", url: "https://drive.google.com/file/d/1AE5whHmGpSl8Z7njfOE6gBEVDHYXP8bh/view?usp=sharing" }
        ]
      }
    ]
  }
];

const CertificatesPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <Image
          src="/logos/yaml_icon.svg"
          alt="YAML"
          width={28}
          height={28}
          className={styles.titleIcon}
        />
        upgrades.yaml
      </h1>
      <div className={styles.yamlContent}>
        <div className={styles.yamlLine}>
          <span className={styles.comment}># Professional Certifications & Training Programs</span>
        </div>
        <div className={styles.yamlLine}>
          <span className={styles.comment}># Last Updated: December 2025</span>
        </div>
        <div className={styles.yamlLine}></div>
        
        {certificateData.map((category, catIndex) => (
          <div key={catIndex} className={styles.categoryBlock}>
            <div className={styles.yamlLine}>
              <span className={styles.key}>{category.category.toLowerCase().replace(' ', '_')}:</span>
            </div>
            {category.certificates.map((cert, certIndex) => (
              <div key={certIndex} className={styles.certBlock}>
                <div className={styles.yamlLine}>
                  <span className={styles.indent}>  </span>
                  <span className={styles.listItem}>- </span>
                  <span className={styles.key}>provider:</span>
                  <span className={styles.string}> &quot;{cert.provider}&quot;</span>
                </div>
                <div className={styles.yamlLine}>
                  <span className={styles.indent}>    </span>
                  <span className={styles.key}>courses:</span>
                </div>
                {cert.courses.map((course, courseIndex) => (
                  <div key={courseIndex} className={styles.yamlLine}>
                    <span className={styles.indent}>      </span>
                    <span className={styles.listItem}>- </span>
                    <a href={course.url} className={styles.link} target="_blank" rel="noopener noreferrer">
                      {course.name}
                    </a>
                  </div>
                ))}
              </div>
            ))}
            <div className={styles.yamlLine}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export async function getStaticProps() {
  return {
    props: { title: 'Certificates' },
  };
}

export default CertificatesPage;