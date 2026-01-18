import styles from '@/styles/CertificatesPage.module.css';

interface Course {
  name: string;
  url: string;
  tags: string[];
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
          { name: "Generative AI", url: "https://drive.google.com/file/d/1ZVLtjz0xh-Yxdh__egPgba0zjxqEiLeF/view?usp=sharing", tags: ["#GenerativeAI", "#AIFoundations", "#MLBasics"] },
          { name: "IoT", url: "https://drive.google.com/file/d/1yQglfFhR8SS8y3ibK8zGnDyMitvzIPrU/view?usp=sharing", tags: ["#InternetOfThings", "#EmbeddedSystems", "#SmartDevices"] }
        ]
      },
      {
        provider: "Google x Santander",
        courses: [
          { name: "Introduction to AI", url: "https://drive.google.com/file/d/16lO-SM8k2TGsSAl6qkyhInfl8d3UZnD5/view?usp=sharing", tags: ["#AIProductivity", "#GoogleAI", "#FutureOfWork"] }
        ]
      },
      {
        provider: "Santander",
        courses: [
          { name: "Introduction to Python", url: "https://drive.google.com/file/d/1zmsYr8FqLh2Liwx0VFE2YnlydhGDm2E4/view?usp=sharing", tags: ["#PythonProgramming", "#ProgrammingBasics", "#ProblemSolving"] }
        ]
      },
      {
        provider: "DishaAI",
        courses: [
          { name: "Generative AI Fundamentals", url: "https://drive.google.com/file/d/16eQ8iMVPF9vurbloSS-g0Fwt-r4MFML1/view?usp=sharing", tags: ["#GenAI", "#AIFundamentals", "#AppliedAI"] }
        ]
      },
      {
        provider: "Humble Coders",
        courses: [
          { name: "Android App Development", url: "https://drive.google.com/file/d/17XK9oVthSAgXq4OPoHJxRYKTchSmWv0x/view?usp=drive_link", tags: ["#AndroidDevelopment", "#Kotlin", "#JetpackCompose"] }
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
          { name: "Leadership", url: "https://drive.google.com/file/d/1xO1YFj5lDT6cGhEAfhUgioW6dyHj9OpC/view?usp=drive_link", tags: ["#LeadershipSkills", "#HighPerformance", "#TeamDynamics"] }
        ]
      },
      {
        provider: "Thapar Institute Counselling Cell",
        courses: [
          { name: "Understanding Personality Traits", url: "https://drive.google.com/file/d/1kq0KTQisGhxVRJL-GTaoDm3t_e8yfGjk/view?usp=drive_link", tags: ["#PersonalityDevelopment", "#SelfAwareness", "#BehavioralSkills"] },
          { name: "Executive Skills", url: "https://drive.google.com/file/d/1iFBvntUKCkd_N5zJ_roYin3OWLhAn9vv/view?usp=drive_link", tags: ["#ExecutiveSkills", "#ProfessionalDevelopment", "#DecisionMaking"] },
          { name: "Interpersonal Skills", url: "https://drive.google.com/file/d/1q1TTpTJ41ckRn_qqkyE-U8yYXceFFcNW/view?usp=drive_link", tags: ["#SocialIntelligence", "#InterpersonalSkills", "#CommunicationSkills"] },
          { name: "Stress Management", url: "https://drive.google.com/file/d/1q1TTpTJ41ckRn_qqkyE-U8yYXceFFcNW/view?usp=drive_link", tags: ["#LifelongLearning", "#SkillBuilding", "#ProfessionalGrowth"] }
        ]
      }
    ]
  },
  {
    category: "Language Skills",
    certificates: [
      {
        provider: "Penn ELP x Santander",
        courses: [
          { name: "English Fundamentals", url: "https://drive.google.com/file/d/1AE5whHmGpSl8Z7njfOE6gBEVDHYXP8bh/view?usp=sharing", tags: ["#EnglishCommunication", "#LanguageSkills", "#ProfessionalEnglish"] }
        ]
      }
    ]
  }
];

const CertificatesPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>upgrades.yaml</h1>
      <p className={styles.pageSubtitle}>
        A comprehensive collection of professional certifications and training programs spanning technical skills, soft skills, and language proficiency. From AI and IoT courses by MIT and Google to leadership training by Formula 1, these credentials reflect continuous learning and skill development across multiple domains.
      </p>
      <div className={styles.yamlContent}>
        <div className={styles.yamlLine}>
          <span className={styles.comment}># Professional Certifications & Training Programs</span>
        </div>
        <div className={styles.yamlLine}>
          <span className={styles.comment}># Last Updated: January 2026</span>
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
                  <div key={courseIndex}>
                    <div className={styles.yamlLine}>
                      <span className={styles.indent}>      </span>
                      <span className={styles.listItem}>- </span>
                      <a href={course.url} className={styles.link} target="_blank" rel="noopener noreferrer">
                        {course.name}
                      </a>
                    </div>
                    <div className={styles.yamlLine}>
                      <span className={styles.indent}>        </span>
                      <span className={styles.tags}>
                        {course.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className={styles.tag}>{tag} </span>
                        ))}
                      </span>
                    </div>
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
