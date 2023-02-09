import { useEffect, useState } from 'react'
import {
  getCalenderDays,
  findEndIndex,
  sortEvents,
  getOverlaps,
  getMultipleWeeks,
  getMultipleMonths,
  splitMultiWeeks,
  findHowManyDays
} from '../helpers'
import axios from 'axios'

export default function useStore() {
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth())
  const [calendarDates, setCalendarDates] = useState()
  const [selectedDate, setSelectedDate] = useState()
  const [currentEvents, setCurrentEvents] = useState()
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function nextMonth() {
    if (month >= 0 && month < 11) {
      setMonth(month + 1);
    } else {
      setYear(year + 1);
      setMonth(0);
    }
  }
  function prevMonth() {
    if (month > 0 && month <= 11) {
      setMonth(month - 1);
    } else {
      setYear(year - 1);
      setMonth(11);
    }
  }

  useEffect(() => {
    if (events.length !== 0) {
      const currentEventsData = events.items.filter(event => {
        const eventDate = new Date(event['start-dato'])
        return eventDate.getMonth() === month && eventDate.getFullYear() === year
      })
      const CleansedEvents = currentEventsData.map((event) => {
        return {
          name: event.name,
          slug: event.slug,
          start: findEndIndex(event['start-dato'], calendarDates), // [rowID, colID] ex: [2, 3]
          end: findEndIndex(event['slutt-dato'], calendarDates),   // [rowID, colID] ex: [2, 3]
          days: findHowManyDays(event['start-dato'], event['slutt-dato']),            // ex: 1
          startDato: event['start-dato'],
          sluttDato: event['slutt-dato'],
          squaredEnd: false,
          squaredStart: false,
          overlaps: 0,
        }
      })
      const EventsDataWithOverlap =
        splitMultiWeeks(
          getOverlaps(
            getMultipleMonths(
              getMultipleWeeks(
                sortEvents(CleansedEvents)
              ))))
      console.log("cleaned events ", EventsDataWithOverlap)
      setCurrentEvents(EventsDataWithOverlap)
    }
  }, [calendarDates, events])

  useEffect(() => {
    setCalendarDates(getCalenderDays(year, month))
  }, [month, year])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios(`https://vindel.vercel.app/api/events`);
        setEvents(result.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return {
    year,
    setYear,
    month,
    setMonth,
    calendarDates,
    setCalendarDates,
    selectedDate,
    setSelectedDate,
    currentEvents,
    setCurrentEvents,
    events,
    setEvents,
    loading,
    setLoading,
    error,
    setError,
    nextMonth,
    prevMonth
  }
}