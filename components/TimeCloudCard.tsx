import { useState, useEffect } from 'react';
import styles from '@/styles/TimeCloudCard.module.css';

const TimeCloudCard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  return (
    <div className={styles.cardTimeCloud}>
      <div className={styles.cardTimeCloudFront}></div>
      <div className={styles.cardTimeCloudBack}>
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#ed782a"
            d="M39.1,-11.5C46.9,11.5,47,38.1,34.9,46.6C22.8,55.1,-1.6,45.4,-16.5,32.3C-31.3,19.2,-36.8,2.8,-32.4,-15.3C-28.1,-33.4,-14.1,-53,0.8,-53.3C15.6,-53.5,31.2,-34.4,39.1,-11.5Z"
            transform="translate(100 100)"
          ></path>
        </svg>
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#ed782a"
            d="M39.1,-11.5C46.9,11.5,47,38.1,34.9,46.6C22.8,55.1,-1.6,45.4,-16.5,32.3C-31.3,19.2,-36.8,2.8,-32.4,-15.3C-28.1,-33.4,-14.1,-53,0.8,-53.3C15.6,-53.5,31.2,-34.4,39.1,-11.5Z"
            transform="translate(100 100)"
          ></path>
        </svg>
      </div>
      <p className={styles.cardTimeCloudDay}>{getDayName(currentTime)}</p>
      <p className={styles.cardTimeCloudDayNumber}>{formatDate(currentTime)}</p>
      <p className={styles.cardTimeCloudHour}>{formatTime(currentTime)}</p>
      <div className={styles.cardTimeCloudIcon}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <path
              d="M8 22H16"
              stroke="#ed782a"
              strokeWidth="1.44"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M5 19H19"
              stroke="#ed782a"
              strokeWidth="1.44"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M2 16H22"
              stroke="#ed782a"
              strokeWidth="1.44"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M12 6C8.68629 6 6 8.68629 6 12C6 13.5217 6.56645 14.911 7.5 15.9687H16.5C17.4335 14.911 18 13.5217 18 12C18 8.68629 15.3137 6 12 6Z"
              stroke="#ed782a"
              strokeWidth="1.44"
            ></path>
            <path
              d="M12 2V3"
              stroke="#ed782a"
              strokeWidth="1.44"
              strokeLinecap="round"
            ></path>
            <path
              d="M22 12L21 12"
              stroke="#ed782a"
              strokeWidth="1.44"
              strokeLinecap="round"
            ></path>
            <path
              d="M3 12L2 12"
              stroke="#ed782a"
              strokeWidth="1.44"
              strokeLinecap="round"
            ></path>
            <path
              d="M19.0708 4.92969L18.678 5.32252"
              stroke="#ed782a"
              strokeWidth="1.44"
              strokeLinecap="round"
            ></path>
            <path
              d="M5.32178 5.32227L4.92894 4.92943"
              stroke="#ed782a"
              strokeWidth="1.44"
              strokeLinecap="round"
            ></path>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default TimeCloudCard;
