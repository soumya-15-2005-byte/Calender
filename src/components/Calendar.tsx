import React, { useState, useEffect } from 'react';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, 
  isWithinInterval, isBefore, isAfter 
} from 'date-fns';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import './Calendar.css';

const holidays: Record<string, string> = {
  '01-01': "New Year's Day",
  '01-14': "Makar Sankranti",
  '01-26': "Republic Day",
  '03-03': "Holi (2026)",
  '04-14': "Ambedkar Jayanti",
  '08-15': "Independence Day",
  '10-02': "Gandhi Jayanti",
  '11-08': "Diwali (2026)",
  '12-25': "Merry Christmas"
};

const imagesByMonth = [
  "https://picsum.photos/seed/january/1200/800",
  "https://picsum.photos/seed/february/1200/800",
  "https://picsum.photos/seed/march/1200/800",
  "https://picsum.photos/seed/april/1200/800",
  "https://picsum.photos/seed/may/1200/800",
  "https://picsum.photos/seed/june/1200/800",
  "https://picsum.photos/seed/july/1200/800",
  "https://picsum.photos/seed/august/1200/800",
  "https://picsum.photos/seed/september/1200/800",
  "https://picsum.photos/seed/october/1200/800",
  "https://picsum.photos/seed/november/1200/800",
  "https://picsum.photos/seed/december/1200/800",
];

const themesByMonth = [
  '#2563eb', // Jan: Blue
  '#e11d48', // Feb: Rose
  '#059669', // Mar: Emerald
  '#d97706', // Apr: Amber
  '#16a34a', // May: Green
  '#0284c7', // Jun: Light Blue
  '#eab308', // Jul: Yellow
  '#c026d3', // Aug: Fuchsia
  '#ea580c', // Sep: Orange
  '#9333ea', // Oct: Purple
  '#b91c1c', // Nov: Red
  '#0f172a', // Dec: Slate
];

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [flipClass, setFlipClass] = useState('');

  // Notes state - Persisted via localStorage
  const [notes, setNotes] = useState<Record<string, string>>(() => {
    const savedNotes = localStorage.getItem('calendar_notes_v2');
    return savedNotes ? JSON.parse(savedNotes) : {};
  });

  useEffect(() => {
    localStorage.setItem('calendar_notes_v2', JSON.stringify(notes));
  }, [notes]);

  const currentMonthIndex = currentDate.getMonth();
  const heroImage = imagesByMonth[currentMonthIndex];
  const currentTheme = themesByMonth[currentMonthIndex];
  
  const getNoteKey = () => {
    if (startDate && endDate) {
      return `range_${format(startDate, 'yyyy-MM-dd')}_${format(endDate, 'yyyy-MM-dd')}`;
    }
    return `month_${format(currentDate, 'yyyy-MM')}`;
  };

  const currentNotesTitle = (startDate && endDate) 
    ? `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}` 
    : `${format(currentDate, 'MMMM yyyy')} Notes`;

  const noteKey = getNoteKey();
  const currentNotes = notes[noteKey] || '';

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes({
      ...notes,
      [noteKey]: e.target.value
    });
  };

  const animateMonthChange = (direction: 'next' | 'prev') => {
    setFlipClass(`flip-${direction}-exit`);
    setTimeout(() => {
      const newDate = direction === 'next' ? addMonths(currentDate, 1) : subMonths(currentDate, 1);
      setCurrentDate(newDate);
      setFlipClass(`flip-${direction}-enter`);
      setTimeout(() => {
        setFlipClass('');
      }, 300);
    }, 300);
  };

  const nextMonth = () => animateMonthChange('next');
  const prevMonth = () => animateMonthChange('prev');

  const onDateClick = (day: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (isBefore(day, startDate)) {
        setEndDate(startDate);
        setStartDate(day);
      } else {
        setEndDate(day);
      }
    }
  };

  const onDateHover = (day: Date) => {
    if (startDate && !endDate) {
      setHoverDate(day);
    }
  };

  const onMouseLeaveGrid = () => {
    setHoverDate(null);
  };

  const isSelectedStart = (day: Date) => !!(startDate && isSameDay(day, startDate));
  const isSelectedEnd = (day: Date) => !!(endDate && isSameDay(day, endDate));

  const isInRange = (day: Date) => {
    if (startDate && endDate) {
      return isWithinInterval(day, { start: startDate, end: endDate }) && 
             !isSameDay(day, startDate) && !isSameDay(day, endDate);
    }
    if (startDate && hoverDate) {
      const start = isBefore(startDate, hoverDate) ? startDate : hoverDate;
      const end = isAfter(startDate, hoverDate) ? startDate : hoverDate;
      return isWithinInterval(day, { start, end }) && 
             !isSameDay(day, start) && !isSameDay(day, end);
    }
    return false;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDateGrid = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDateGrid = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = startDateGrid;

    while (day <= endDateGrid) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, 'd');
        const cloneDay = day;
        
        const holidayName = holidays[format(day, 'MM-dd')];

        let cellClasses = 'day';
        if (!isSameMonth(day, monthStart)) {
          cellClasses += i >= 5 ? ' weekend prev-month' : ' prev-month';
        } else {
          if (i >= 5) cellClasses += ' weekend';
        }

        if (isSelectedStart(day)) cellClasses += ' selected-start';
        if (isSelectedEnd(day)) cellClasses += ' selected-end';
        if (isInRange(day)) cellClasses += ' in-range';
        if (isSameDay(day, new Date())) cellClasses += ' today';

        days.push(
          <div
            className={cellClasses}
            key={day.toString()}
            onClick={() => onDateClick(cloneDay)}
            onMouseEnter={() => onDateHover(cloneDay)}
          >
            <div className="day-number">{formattedDate}</div>
            {holidayName && <div className="holiday-text" title={holidayName}>{holidayName}</div>}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="days-row" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return rows;
  };

  return (
    <div className="calendar-wall floating-effect" style={{ '--theme-color': currentTheme } as React.CSSProperties}>
      <div className="calendar-rings">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="ring" />
        ))}
      </div>
      
      <div className="calendar-left">
        <div className={`hero-image-wrapper ${flipClass}`}>
          <img 
            src={heroImage} 
            alt="Calendar Theme" 
            className="hero-image"
          />
          <div className="hero-gradient"></div>
          
          <div className="hero-content">
            <div className="hero-date">
              <span className="hero-year">{format(currentDate, 'yyyy')}</span>
              <span className="hero-month">{format(currentDate, 'MMMM')}</span>
            </div>
            {startDate && endDate && (
               <div className="hero-selection-badge">
                  <span>Selected Range</span>
                  <p>{format(startDate, 'MMM d')} - {format(endDate, 'MMM d')}</p>
               </div>
            )}
          </div>
        </div>
      </div>

      <div className="calendar-right">
        <div className="calendar-header">
           <div className="nav-buttons">
             <button onClick={prevMonth} className="nav-btn"><ChevronLeft size={20}/></button>
             <button onClick={() => setCurrentDate(new Date())} className="today-btn">Today</button>
             <button onClick={nextMonth} className="nav-btn"><ChevronRight size={20}/></button>
           </div>
        </div>

        <div className={`calendar-grid-container ${flipClass}`} onMouseLeave={onMouseLeaveGrid}>
          <div className="week-days">
            <span>MON</span>
            <span>TUE</span>
            <span>WED</span>
            <span>THU</span>
            <span>FRI</span>
            <span className="weekend">SAT</span>
            <span className="weekend">SUN</span>
          </div>
          <div className="days-grid-wrapper">
             {renderCells()}
          </div>
        </div>

        <div className={`calendar-notes ${startDate && endDate ? 'range-active' : ''}`}>
          <div className="notes-header">
            <BookOpen size={16} />
            <span className="notes-title">{currentNotesTitle}</span>
          </div>
          <textarea 
            className="note-input" 
            placeholder="Jot down notes here..." 
            value={currentNotes}
            onChange={handleNoteChange}
            spellCheck="false"
          />
        </div>
      </div>
    </div>
  );
};

export default Calendar;
