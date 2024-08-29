
import React, { useState } from 'react';
import './index.css';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showFilteredEvents, setShowFilteredEvents] = useState(false);
  const [filter, setFilter] = useState('All');

  const getFirstDayOfMonth = () => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    return date.getDay();
  };

  const getDaysInMonth = () => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  };

  const generateCalendarDays = () => {
    const firstDay = getFirstDayOfMonth();
    const daysInMonth = getDaysInMonth();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const handleAddEvent = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
    const event = prompt("Enter event details:");
    const category = prompt("Enter event category (Work/Personal):");
    if (event && (category === 'Work' || category === 'Personal')) {
      setEvents(prevEvents => ({
        ...prevEvents,
        [date]: [...(prevEvents[date] || []), { event, category }]
      }));
    } else {
      alert("Invalid category. Please enter 'Work' or 'Personal'.");
    }
  };

  const handleDeleteEvent = (date, index) => {
    setEvents(prevEvents => {
      const updatedEvents = [...(prevEvents[date] || [])];
      updatedEvents.splice(index, 1);
      if (updatedEvents.length === 0) {
        const { [date]: _, ...rest } = prevEvents; // Remove empty dates
        return rest;
      }
      return { ...prevEvents, [date]: updatedEvents };
    });
  };

  const handleEditEvent = (date, index) => {
    const updatedEvent = prompt("Edit event details:", events[date][index].event);
    const updatedCategory = prompt("Edit event category (Work/Personal):", events[date][index].category);
    if (updatedEvent && (updatedCategory === 'Work' || updatedCategory === 'Personal')) {
      setEvents(prevEvents => ({
        ...prevEvents,
        [date]: prevEvents[date].map((event, i) => i === index ? { event: updatedEvent, category: updatedCategory } : event)
      }));
    } else {
      alert("Invalid category. Please enter 'Work' or 'Personal'.");
    }
  };

  const days = generateCalendarDays();

  const toggleEventDetails = () => {
    setShowEventDetails(!showEventDetails);
  };

  const toggleFilterEvents = () => {
    setShowFilteredEvents(!showFilteredEvents);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const filteredEvents = Object.entries(events).reduce((acc, [date, eventsOnDate]) => {
    if (filter === 'All') {
      acc[date] = eventsOnDate;
    } else {
      acc[date] = eventsOnDate.filter(event => event.category === filter);
    }
    return acc;
  }, {});

  return (
    <div className="calendar-container">
      <div className="calendar">
        <div className="calendar-header">
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}>
            &lt;
          </button>
          <span>{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}>
            &gt;
          </button>
        </div>
        <div className="calendar-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div className="calendar-cell" key={day}>{day}</div>
          ))}
          {days.map((day, index) => (
            <div
              className="calendar-cell"
              key={index}
              onClick={() => day && handleAddEvent(day)}
            >
              {day}
              {day && events[new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0]] && (
                <div>
                  {events[new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0]].map((event, i) => (
                    <div key={i}>
                      <span>{event.event} ({event.category})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="buttons">
        <button className="view-events-btn" onClick={toggleEventDetails}>
          {showEventDetails ? 'Hide Event Details' : 'Show Event Details'}
        </button>
        <button className="filter-events-btn" onClick={toggleFilterEvents}>
          {showFilteredEvents ? 'Hide Filter Options' : 'Show Filter Options'}
        </button>
      </div>
      <div className={`events-list ${showEventDetails ? 'show' : ''}`}>
        <h3>Event Details for {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
        {Object.entries(events).map(([date, eventsOnDate]) => (
          <div key={date}>
            <h4>{new Date(date).toLocaleDateString()}</h4>
            <ul>
              {eventsOnDate.map((event, index) => (
                <li key={index}>
                  {event.event} ({event.category})
                  <button className="edit-btn" onClick={() => handleEditEvent(date, index)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDeleteEvent(date, index)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {Object.keys(events).length === 0 && <p>No events for this month.</p>}
      </div>
      <div className={`filter-options ${showFilteredEvents ? 'show' : ''}`}>
        <button onClick={() => handleFilterChange('All')}>All</button>
        <button onClick={() => handleFilterChange('Work')}>Work</button>
        <button onClick={() => handleFilterChange('Personal')}>Personal</button>
        <div className="filtered-events-list">
          <h3>Filtered Events for {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
          {Object.entries(filteredEvents).map(([date, eventsOnDate]) => (
            <div key={date}>
              <h4>{new Date(date).toLocaleDateString()}</h4>
              <ul>
                {eventsOnDate.map((event, index) => (
                  <li key={index}>
                    {event.event} ({event.category})
                    <button className="edit-btn" onClick={() => handleEditEvent(date, index)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDeleteEvent(date, index)}>Delete</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {Object.keys(filteredEvents).length === 0 && <p>No events for this month with selected filter.</p>}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
