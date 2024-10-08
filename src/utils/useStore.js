import { useEffect, useState } from 'react'
import {
  getCalenderDays,
  findFirstDayIndex,
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
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchData = async () => {
    try {
      await axios(`https://vindel.vercel.app/api/events`).then(res => { setEvents(res.data); setMeetings(res.data.items) })
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }
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

  // useEffect(() => {
  //   if (events.items && events.items.length !== 0) {
  //     const currentEventsData = events.items.filter(event => {
  //       const eventDate = new Date(event['start-dato'])
  //       console.log("is eventDate", eventDate)
  //       console.log("return", eventDate.getMonth() === month && eventDate.getFullYear() === year)
  //       return eventDate.getMonth() === month && eventDate.getFullYear() === year
  //     })
  //     const CleansedEvents = currentEventsData.map((event) => {
  //       return {
  //         name: event.name,
  //         slug: event.slug,
  //         start: findFirstDayIndex(event['start-dato'], calendarDates), // [rowID, colID] ex: [2, 3]
  //         end: findFirstDayIndex(event['slutt-dato'], calendarDates),   // [rowID, colID] ex: [2, 3]
  //         days: findHowManyDays(event['start-dato'], event['slutt-dato']),            // ex: 1
  //         startDato: event['start-dato'],
  //         sluttDato: event['slutt-dato'],
  //         squaredEnd: false,
  //         color: event.color ?? undefined,
  //         squaredStart: false,
  //         overlaps: 0,
  //       }
  //     })
  //     const EventsDataWithOverlap =
  //       splitMultiWeeks(
  //         createLayers(
  //           // createOverlapIndexes(
  //           getOverlaps(
  //             getMultipleMonths(
  //               getMultipleWeeks(
  //                 sortEventsByStart(CleansedEvents)
  //               )))))
      
  //     setCurrentEvents(EventsDataWithOverlap)
  //   }
    
  // }, [calendarDates, events])
  useEffect(async () => {
    await fetchData();
  }, [])

  useEffect(() => {
    setCalendarDates(getCalenderDays(year, month))
  }, [month, year])

  


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
    meetings,
    setMeetings,
    loading,
    setLoading,
    error,
    setError,
    nextMonth,
    prevMonth
  }
}