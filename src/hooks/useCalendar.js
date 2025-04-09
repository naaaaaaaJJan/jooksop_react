import { getDaysInMonth, startOfMonth, getDay, subMonths, addMonths } from 'date-fns';
import { useState } from 'react';

export default function useCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const totalDays = getDaysInMonth(currentDate); // 이번 달 총 일수
  const firstDayOfMonth = getDay(startOfMonth(currentDate)); // 0(일)~6(토)
  const prevMonth = subMonths(currentDate, 1);
  const prevMonthTotalDays = getDaysInMonth(prevMonth);
  const prevDays = Array.from({ length: firstDayOfMonth }).map((_, i) =>
    prevMonthTotalDays - firstDayOfMonth + i + 1
  );
  const currDays = Array.from({ length: totalDays }, (_, i) => i + 1);
  const totalDayCount = prevDays.length + currDays.length;
  const isSixWeeks = totalDayCount > 35;
  const totalCells = isSixWeeks ? 42 : 35;
  const nextDaysCount = totalCells - totalDayCount;
  const nextDays = Array.from({ length: nextDaysCount }, (_, i) => i + 1);
  const calendarDays = [...prevDays, ...currDays, ...nextDays];

  // 7일씩 잘라서 주 단위로 만들기
  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  return {
    currentDate,
    setCurrentDate,
    weeks,
    goToPrevMonth: () => setCurrentDate(prev => subMonths(prev, 1)),
    goToNextMonth: () => setCurrentDate(prev => addMonths(prev, 1)),
    prevCount: prevDays.length,
    currCount: currDays.length
  };
}