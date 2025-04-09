import useCalendar from '../hooks/useCalendar';
import styles from './Calendar.module.css';
import { isToday, format } from 'date-fns';

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export default function Calendar({ onSelect, selectedDate }) {
  const {
    currentDate,
    weeks,
    goToPrevMonth,
    goToNextMonth,
    prevCount,
    currCount,
    setCurrentDate
  } = useCalendar();

  // 날짜 타입 판별 함수
  const getDayType = (index) => {
    if (index < prevCount) return 'prev';
    if (index < prevCount + currCount) return 'current';
    return 'next';
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <button onClick={goToPrevMonth}>‹</button>
        <span className={styles.title}>
          {format(currentDate, 'yyyy MMM').toUpperCase()}.
        </span>
        <button onClick={goToNextMonth}>›</button>
      </div>

      <div className={styles.weekdays}>
        {WEEKDAYS.map(day => (
          <div key={day} className={styles.weekday}>{day}</div>
        ))}
      </div>

      <div className={styles.grid}>
        {weeks.map((week, wIdx) => (
          <div key={wIdx} className={styles.weekRow}>
            {week.map((date, dIdx) => {
              const index = wIdx * 7 + dIdx;
              const type = getDayType(index);

              const isTodayDate =
                type === 'current' &&
                isToday(new Date(currentDate.getFullYear(), currentDate.getMonth(), date));

              const isSelectedDate =
                type === 'current' &&
                selectedDate === format(new Date(currentDate.getFullYear(), currentDate.getMonth(), date), 'yyyy.MM.dd');

              return (
                <div
                  key={dIdx}
                  className={`
                    ${styles.day}
                    ${type !== 'current' ? styles.otherMonth : styles.dayActive}
                    ${isTodayDate ? styles.today : ''}
                    ${isSelectedDate ? styles.selected : ''}
                  `}
                  onClick={() => {
                    if (type === 'prev') {
                      const newDate = new Date(currentDate);
                      newDate.setMonth(newDate.getMonth() - 1);
                      newDate.setDate(date);
                      setCurrentDate(newDate);
                    } else if (type === 'next') {
                      const newDate = new Date(currentDate);
                      newDate.setMonth(newDate.getMonth() + 1);
                      newDate.setDate(date);
                      setCurrentDate(newDate);
                    } else {
                      const fullDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), date);
                      const formatted = format(fullDate, 'yyyy.MM.dd');
                      onSelect?.(formatted);
                    }
                  }}
                >
                  {date || ''}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}