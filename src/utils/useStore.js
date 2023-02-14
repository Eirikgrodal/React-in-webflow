import { useEffect, useState } from 'react'
import {
  getCalenderDays,
  findDayIndex,
  sortEventsByStart,
  getOverlaps,
  getMultipleWeeks,
  getMultipleMonths,
  splitMultiWeeks,
  findHowManyDays,
  createOverlapIndexes,
  createLayers
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
          start: findDayIndex(event['start-dato'], calendarDates), // [rowID, colID] ex: [2, 3]
          end: findDayIndex(event['slutt-dato'], calendarDates),   // [rowID, colID] ex: [2, 3]
          days: findHowManyDays(event['start-dato'], event['slutt-dato']),            // ex: 1
          startDato: event['start-dato'],
          sluttDato: event['slutt-dato'],
          squaredEnd: false,
          color: event.color ?? undefined,
          squaredStart: false,
          overlaps: 0,
        }
      })
      const EventsDataWithOverlap =
        splitMultiWeeks(
          createLayers(
            // createOverlapIndexes(
            getOverlaps(
              getMultipleMonths(
                getMultipleWeeks(
                  sortEventsByStart(CleansedEvents)
                )))))
      console.log("cleaned events ", EventsDataWithOverlap)
      setCurrentEvents(EventsDataWithOverlap)
    }
    console.log("dates: ", calendarDates)
  }, [calendarDates, events])

  useEffect(() => {
    setCalendarDates(getCalenderDays(year, month))
  }, [month, year])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios(`https://vindel.vercel.app/api/events`);
        setEvents(result.data);
        console.log('fersk data: ', result.data.items)
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