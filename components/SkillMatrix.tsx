import { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import styles from '@/styles/SkillMatrix.module.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

interface Skill {
  name: string;
  tools: string;
  score: number;
  categoryColor: string;
}

interface SkillCategory {
  title: string;
  titleHighlight: string;
  color: string;
  skills: Skill[];
}

const skillData: SkillCategory[] = [
  {
    title: '// ',
    titleHighlight: 'HARDWARE_LAYER',
    color: '#ff8c50',
    skills: [
      { name: 'PCB Design & Schematics', tools: 'KiCad, EasyEDA', score: 99, categoryColor: '#ff8c50' },
      { name: 'Sensor Integration', tools: 'I2C, SPI, Analog', score: 99, categoryColor: '#ff8c50' },
      { name: 'ESP32 / Arduino', tools: 'PlatformIO, Arduino IDE', score: 66, categoryColor: '#ff8c50' },
      { name: 'MQTT / IoT Protocols', tools: 'Mosquitto, HiveMQ', score: 99, categoryColor: '#ff8c50' },
    ],
  },
  {
    title: '// ',
    titleHighlight: 'FIRMWARE_LOGIC',
    color: '#00dc8c',
    skills: [
      { name: 'C / C++ (Embedded)', tools: 'GCC, PlatformIO', score: 66, categoryColor: '#00dc8c' },
      { name: 'Multimeter', tools: 'Fluke, Analog', score: 66, categoryColor: '#00dc8c' },
      { name: 'Python (Scripting)', tools: 'NumPy, Automation', score: 33, categoryColor: '#00dc8c' },
    ],
  },
  {
    title: '// ',
    titleHighlight: 'TOOLCHAIN_OPS',
    color: '#a078ff',
    skills: [
      { name: 'VS Code / PlatformIO', tools: 'Extensions, Debugging', score: 99, categoryColor: '#a078ff' },
      { name: 'Git / Version Control', tools: 'GitHub, GitLab', score: 66, categoryColor: '#a078ff' },
      { name: 'Tinkercad', tools: '3D Modeling, Circuits', score: 66, categoryColor: '#a078ff' },
      { name: 'Wokwi', tools: '3D Modeling, Circuits', score: 66, categoryColor: '#a078ff' },
      { name: 'Notion', tools: 'Docs, Planning', score: 99, categoryColor: '#a078ff' },
      { name: 'Obsidian', tools: 'Notes, Knowledge Base', score: 99, categoryColor: '#a078ff' },
    ],
  },
];

const SkillMatrix = () => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [, setHoveredChartIndex] = useState<number | null>(null);
  const [animatedScores, setAnimatedScores] = useState<{ [key: string]: number }>({});
  const chartRef = useRef<any>(null);

  // Counter animation effect - counts from 0 to target score
  useEffect(() => {
    if (hoveredSkill) {
      const [catIdx, skillIdx] = hoveredSkill.split('-').map(Number);
      const targetScore = skillData[catIdx].skills[skillIdx].score;
      
      let current = 0;
      const duration = 600; // Total animation duration in ms (0.6 seconds)
      const steps = 12; // Number of steps in animation
      const increment = targetScore / steps;
      const intervalTime = duration / steps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= targetScore) {
          current = targetScore;
          setAnimatedScores(prev => ({ ...prev, [hoveredSkill]: Math.round(current) }));
          clearInterval(timer);
        } else {
          setAnimatedScores(prev => ({ ...prev, [hoveredSkill]: Math.round(current) }));
        }
      }, intervalTime);

      return () => clearInterval(timer);
    }
  }, [hoveredSkill]);

  // Prepare chart data
  const allSkills = skillData.flatMap((cat) => cat.skills);
  const labels = allSkills.map((s) => s.name);
  const scores = allSkills.map((s) => s.score);
  const colors = skillData.flatMap((cat) => cat.skills.map(() => cat.color));

  const chartData = {
    labels,
    datasets: [
      {
        data: scores,
        borderColor: (context: { dataIndex: number }) => colors[context.dataIndex] || '#00dc8c',
        backgroundColor: 'rgba(0, 220, 140, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: colors,
        pointBorderColor: colors,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4,
        segment: {
          borderColor: (ctx: { p0DataIndex: number }) => colors[ctx.p0DataIndex] || '#00dc8c',
        },
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    onHover: (event: any, activeElements: any[]) => {
      if (activeElements.length > 0 && activeElements[0].element) {
        const index = activeElements[0].index;
        setHoveredChartIndex(index);
        
        // Find the skill key for this index
        let count = 0;
        for (let catIdx = 0; catIdx < skillData.length; catIdx++) {
          for (let skillIdx = 0; skillIdx < skillData[catIdx].skills.length; skillIdx++) {
            if (count === index) {
              setHoveredSkill(`${catIdx}-${skillIdx}`);
              return;
            }
            count++;
          }
        }
      } else {
        setHoveredChartIndex(null);
        setHoveredSkill(null);
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(10, 10, 10, 0.9)',
        titleColor: '#fff',
        bodyColor: 'rgba(255, 255, 255, 0.7)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: (context: any) => `Score: ${context.raw}`,
        },
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
        min: 0,
        max: 110,
      },
    },
  };

  return (
    <div className={styles.matrixContainer}>
      <div className={styles.matrixHeader}>
        <span className={styles.matrixIcon}>▐▌▌</span>
        <span className={styles.matrixTitle}>SKILL MATRIX</span>
      </div>

      <div className={styles.content}>
        <div className={styles.skillsColumn}>
          <div className={styles.columnHeader}>SKILL</div>
          {skillData.map((category, catIdx) => (
            <div key={catIdx}>
              <div className={styles.categoryHeader}>
                <span className={styles.comment}>{category.title}</span>
                <span style={{ color: category.color }}>{category.titleHighlight}</span>
              </div>
              {category.skills.map((skill, skillIdx) => {
                const skillKey = `${catIdx}-${skillIdx}`;
                const isHovered = hoveredSkill === skillKey;
                return (
                  <div
                    key={skillKey}
                    className={`${styles.skillRow} ${isHovered ? styles.hovered : ''}`}
                    onMouseEnter={() => setHoveredSkill(skillKey)}
                    onMouseLeave={() => setHoveredSkill(null)}
                  >
                    <span className={styles.skillName} style={isHovered ? { color: category.color } : {}}>
                      {skill.name}
                    </span>
                    <span
                      className={styles.scoreBadge}
                      style={{
                        backgroundColor: isHovered ? category.color : 'rgba(255, 255, 255, 0.15)',
                        color: isHovered ? '#050505' : 'rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      {isHovered ? (animatedScores[skillKey] || 0) : 0}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className={styles.toolsColumn}>
          <div className={styles.columnHeader}>TOOL</div>
          {skillData.map((category, catIdx) => (
            <div key={catIdx}>
              <div className={styles.categoryHeaderSpacer} />
              {category.skills.map((skill, skillIdx) => {
                const skillKey = `${catIdx}-${skillIdx}`;
                const isHovered = hoveredSkill === skillKey;
                return (
                  <div
                    key={skillKey}
                    className={styles.toolRow}
                    onMouseEnter={() => setHoveredSkill(skillKey)}
                    onMouseLeave={() => setHoveredSkill(null)}
                  >
                    <span className={styles.toolName} style={isHovered ? { color: 'rgba(255, 255, 255, 0.8)' } : {}}>
                      {skill.tools}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.footerNote}>
          <span className={styles.comment}>{'// skill scores are self-assessed '}</span>
          <span style={{ color: '#a078ff' }}>(total = 100)</span>
        </div>
        <div className={styles.footerNote}>
          <span className={styles.comment}>{'// always '}</span>
          <span style={{ color: '#00dc8c' }}>iterating</span>
          <span className={styles.comment}>{', always '}</span>
          <span style={{ color: '#ff8c50' }}>improving</span>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <Line ref={chartRef} data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default SkillMatrix;
