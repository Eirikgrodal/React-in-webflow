import './styles.css'

import { Menu, Transition } from '@headlessui/react'
import React, { Fragment, useEffect, useState } from 'react'
import { classNames, getCalenderDays, getDayOfWeek, useCalendar } from './config'

import ReactDOM from 'react-dom'
import axios from "axios";
import useSWR from 'swr'

const App = () => {
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
            console.log("test ", (calendarDates.length / 7))
            const currentEventsData = events.items.filter(event => {
                const eventDate = new Date(event['start-dato'])
                return eventDate.getMonth() === month && eventDate.getFullYear() === year
            })
            const CleansedEvents = currentEventsData.map((event) => {
                return {
                    name: event.name,
                    slug: event.slug,
                    start: findGridIndex(event['start-dato'], currentEventsData, 'start-dato'), // [rowID, colID] ex: [2, 3]
                    end: findGridIndex(event['slutt-dato'], currentEventsData, 'slutt-dato'),   // [rowID, colID] ex: [2, 3]
                    days: findHowManyDays(event['start-dato'], event['slutt-dato']),            // ex: 1
                    startDato: event['start-dato'],
                    sluttDato: event['slutt-dato'],
                    overlaps: 0,
                }
            })
            console.log("newcleanedevents ", CleansedEvents)
            const EventsDataWithOverlap =
                getMultipleMonths(
                    getMultipleWeeks(
                        getOverlaps(CleansedEvents)))
            console.log("EventDataWithOverlap ", EventsDataWithOverlap)
            setCurrentEvents(EventsDataWithOverlap)
        }
    }, [calendarDates, events])

    // printe hver event fra listen - bruk css grid - hvis den gaar over kanten saa print to element for hver rad - forst til sondag og etterpa fra mandag til event slutt


    const findHowManyDays = (startDato, sluttDato) => {
        const startDatoen = new Date(startDato)
        const sluttDatoen = new Date(sluttDato)

        const differenceInTime = sluttDatoen.getTime() - startDatoen.getTime(); //finner ut hvor mye tid som er mellom slutt dato og start dato
        const differenceInDays = differenceInTime / (1000 * 3600 * 24); // finner ut hvor mange dager det er mange dager mellom slutt og start dato

        return Math.ceil(differenceInDays) // return days
    };

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

    return (

        <div className='w-full flex justify-center'>
            <button onClick={() => console.log(currentEvents)}>Log</button>
            <div className='container'>
                <h2 className="text-lg font-semibold text-gray-900">Upcoming meetings</h2>
                <div className="lg:grid lg:grid-cols-12 lg:gap-x-16">
                    <div className="mt-10 text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 lg:mt-9 xl:col-start-9">
                        <div className="flex flex-col items-center text-gray-900">
                            <div className='flex flex-row w-full'>
                                <button
                                    className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                                    onClick={() => prevMonth()}
                                >
                                    <span className="sr-only">Previous month</span>
                                    {'<'}
                                </button>
                                <div className="flex-auto">
                                    <div className="font-semibold text-md">{getNorwegianMonthName(month)}</div>
                                    <div className="font-regular text-sm">{year}</div>

                                </div>
                                <button
                                    className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                                    onClick={() => nextMonth()}
                                >
                                    <span className="sr-only" >Next month</span>
                                    {'>'}
                                    {/*husk at du kan bruke month index */}

                                </button>
                            </div>
                            {/* dager i uka */}
                            <div className="w-full mt-6 grid grid-cols-7 text-xs leading-6 text-gray-500">
                                <div>M</div>
                                <div>T</div>
                                <div>O</div>
                                <div>T</div>
                                <div>F</div>
                                <div>L</div>
                                <div>S</div>
                            </div>
                            {/* selve grid */}
                            <div className='isolate w-full relative'>
                                <div className="relative z-0 isolate w-full mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200">
                                    {calendarDates && calendarDates.map((day, dayIdx) => (
                                        <button
                                            key={day.date}
                                            type="button"
                                            className={classNames(
                                                'py-1.5 hover:bg-gray-100 focus:z-10',
                                                day.isCurrentMonth ? 'bg-white' : 'bg-gray-50',
                                                (day.isSelected || day.isToday) && 'font-semibold',
                                                day.isSelected && 'text-white',
                                                !day.isSelected && day.isCurrentMonth && !day.isToday && 'text-gray-900',
                                                !day.isSelected && !day.isCurrentMonth && !day.isToday && 'text-gray-400',
                                                day.isToday && !day.isSelected && 'text-indigo-600',
                                                dayIdx === 0 && 'rounded-tl-lg',
                                                dayIdx === 6 && 'rounded-tr-lg',
                                                dayIdx === calendarDates.length - 7 && 'rounded-bl-lg',
                                                dayIdx === calendarDates.length - 1 && 'rounded-br-lg'
                                            )}
                                            onClick={() => setSelectedDate(day.date)}
                                        >
                                            <time
                                                dateTime={day.date}
                                                className={classNames(
                                                    'mx-auto flex h-7 w-7 items-center justify-center rounded-full',
                                                    day.isSelected && day.isToday && 'bg-indigo-600',
                                                    day.isSelected && !day.isToday && 'bg-gray-900'
                                                )}
                                            >
                                                {new Date(new Date(day.date).setDate(new Date(day.date).getDate() - 1)).getDate()}
                                            </time>
                                        </button>
                                    ))}
                                </div>
                                <div className={classNames(
                                    "absolute z-10 top-0 bottom-0 left-0 right-0 h-full isolate w-full",
                                    "mt-2 pb-2 gap-px rounded-lg bg-transparent text-sm"
                                )}
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(7, 1fr)",
                                        gridTemplateRows: `repeat(${calendarDates?.length / 7 ?? 5}, 1fr)`,
                                        alignItems: "center"
                                    }}
                                >
                                    {currentEvents && currentEvents.map((event, eventIdx) => (
                                        <>
                                            {/* single-day */}
                                            <SingleDay event={event} />
                                            {/* multi-day */}
                                            {event.days > 1 && event?.multipleWeeks === 0 && event.multipleMonths === 0 && (
                                                <>
                                                    <div
                                                        id="event"
                                                        style={{
                                                            gridRow: `${event.start[1] + 1} / ${event.end[1] + 2}`,
                                                            gridColumn: `${event.start[0] + 1} / ${event.end[0] + 2}`
                                                        }}
                                                        className='bg-gray-500 h-[65%] mx-[12px] rounded-full'
                                                    >
                                                    </div>
                                                </>
                                            )}

                                            {/* stacked multi */}
                                            {/* todo: add index on the item or check index here for the gridRow */}
                                            {event.overlaps > 0 && event.days > 1 && event?.multipleWeeks === 0 && event.multipleMonths === 0 && (
                                                <div
                                                    id="event"
                                                    style={{
                                                        gridRow: `${event.start[1]} / ${event.end[1]}`,
                                                        gridColumn: `${event.start[0]} / ${event.end[0]}`,
                                                        display: "grid",
                                                        gridTemplateColumns: "repeat(1,1fr)",
                                                        gridTemplateRows: `repeat(${event.overlaps}, 1fr)`

                                                    }}
                                                    className='h-[90%] mx-[12px]'
                                                >
                                                    <div
                                                        style={{
                                                            gridRow: `1 / 3`,
                                                        }}
                                                        className='bg-green-500 rounded-full'
                                                    />
                                                </div>)}

                                            {/* stacked single */}
                                            {/* todo: add index on the item or check index here for the gridRow */}
                                            {event.overlaps > 0 && event.days === 1 && event?.multipleWeeks === 0 && event.multipleMonths === 0 && (
                                                <div
                                                    id="event"
                                                    style={{
                                                        gridRow: `${event.start[1]} / ${event.end[1]}`,
                                                        gridColumn: `${event.start[0]} / ${event.end[0]}`,
                                                        display: "grid",
                                                        gridTemplateColumns: "repeat(1,1fr)",
                                                        gridTemplateRows: `repeat(${event.overlaps}, 1fr)`

                                                    }}
                                                    className='h-[90%] mx-[12px]'
                                                >
                                                    <div
                                                        style={{
                                                            gridRow: `2 / 3`,
                                                        }}
                                                        className='bg-blue-500 rounded-full'
                                                    />
                                                </div>)}

                                        </>
                                    ))}





                                    {/* multi-week right */}
                                    <div
                                        id="event"
                                        style={{
                                            gridRow: `3 / 4`,
                                            gridColumn: `5 / 8`
                                        }}
                                        className='bg-red-500 h-[65%] ml-[12px] rounded-l-full'
                                    >
                                    </div>

                                    {/* multi-week left */}
                                    <div
                                        id="event"
                                        style={{
                                            gridRow: `4 / 5`,
                                            gridColumn: `1 / 3`
                                        }}
                                        className='bg-red-500 h-[65%] mr-[12px] rounded-r-full'
                                    >
                                    </div>

                                    {/* stacked */}
                                    <div
                                        id="event"
                                        style={{
                                            gridRow: `5 / 6`,
                                            gridColumn: `2 / 4`,
                                            display: "grid",
                                            gridTemplateColumns: "repeat(1,1fr)",
                                            gridTemplateRows: "repeat(2, 1fr)"

                                        }}
                                        className='h-[90%] mx-[12px]'
                                    >
                                        <div
                                            style={{
                                                gridRow: `2 / 3`,
                                            }}
                                            className='bg-red-500 rounded-full'
                                        />
                                    </div>

                                </div>
                            </div>

                            {/* <button
                                type="button"
                                className="mt-8 w-full rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Add event
                            </button> */}
                        </div>

                    </div>
                    <ol className="mt-4 divide-y divide-gray-100 text-sm leading-6 lg:col-span-7 xl:col-span-8">
                        {loading && <p>Loading...</p>}
                        {error && <p>Error: {error.message}</p>}
                        {!loading && events && events?.items.map((meeting) => (
                            <li key={meeting.id} className="relative flex space-x-6 py-6 xl:static">
                                <img src={meeting?.bilde?.url} alt={meeting?.bilde?.alt} className="h-14 w-14 flex-none rounded-full" />
                                <div className="flex-auto">
                                    <h3 className="pr-10 font-semibold text-gray-900 xl:pr-0">{meeting.name}</h3>
                                    <dl className="mt-2 flex flex-col text-gray-500 xl:flex-row">
                                        <div className="flex items-start space-x-3">
                                            <dt className="mt-0.5">
                                                <span className="sr-only">Date</span>
                                                {/* <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" /> */}
                                            </dt>
                                            <dd>
                                                <time dateTime={meeting['start-dato']}>
                                                    {'fra ' + getDayAndTime(meeting['start-dato'])}
                                                </time>
                                                <time dateTime={meeting['start-dato']}>
                                                    {' - ' + getDayAndTime(meeting['slutt-dato'])}
                                                </time>
                                            </dd>
                                        </div>
                                        <div className="mt-2 flex items-start space-x-3 xl:mt-0 xl:ml-3.5 xl:border-l xl:border-gray-400 xl:border-opacity-50 xl:pl-3.5">
                                            <dt className="mt-0.5">
                                                <span className="sr-only">Location</span>
                                                {/* <MapPinIcon className="h-5 w-5 text-gray-400" aria-hidden="true" /> */}
                                            </dt>
                                            <dd>{meeting?.['hvis-fysisk-lokalisasjon']}</dd>
                                        </div>
                                    </dl>
                                </div>
                                <Menu as="div" className="absolute top-6 right-0 xl:relative xl:top-auto xl:right-auto xl:self-center">
                                    <div>
                                        <Menu.Button className="-m-2 flex items-center rounded-full p-2 text-gray-500 hover:text-gray-600">
                                            <span className="sr-only">Open options</span>
                                            {/* <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" /> */}
                                        </Menu.Button>
                                    </div>

                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <div className="py-1">
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <a
                                                            href="#"
                                                            className={classNames(
                                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                'block px-4 py-2 text-sm'
                                                            )}
                                                        >
                                                            Edit
                                                        </a>
                                                    )}
                                                </Menu.Item>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <a
                                                            href="#"
                                                            className={classNames(
                                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                'block px-4 py-2 text-sm'
                                                            )}
                                                        >
                                                            Cancel
                                                        </a>
                                                    )}
                                                </Menu.Item>
                                            </div>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </div >
    )
}

function getDayAndTime(date) {
    const dateObject = new Date(date);
    const options = { weekday: 'long', hour: 'numeric', minute: 'numeric' };
    return dateObject.toLocaleString('no-NO', options);
}

function getNorwegianMonthName(monthIndex) {
    const norwegianMonthNames = [
        "Januar", "Februar", "Mars", "April", "Mai", "Juni",
        "Juli", "August", "September", "Oktober", "November", "Desember"
    ];
    return norwegianMonthNames[monthIndex];
}

ReactDOM.render(
    React.createElement(App, {}, null),
    document.getElementById('react-target')
);

const findGridIndex = (date, array, compareString) => {
    const day = getDayOfWeek(date)
    const weekIndex = array.findIndex((e) => e[compareString] === date)
    const week = Math.floor(weekIndex / 7)
    console.log("hmm ", weekIndex, " ", week)
    const month = new Date(date).getMonth()
    return [day, week, month]
};

const sortEvents = (events) => {
    return events.sort((a, b) => {
        if (a.start[0] === b.start[0]) {
            return a.start[1] - b.start[1];
        } else {
            return a.start[0] - b.start[0];
        }
    });
}

const getOverlaps = (events) => {
    const sortedEvents = sortEvents(events); // sort events
    const compareWeeks = sortedEvents.map((e) => {
        return getDaysBetween(e.start, e.end); // get all the days of the comparison event as an array
    })
    const eventsWithOverlap = sortedEvents.map((event) => { // for each event 
        let overlapCount = -1; // start with 0 overlaps (-1 because it will always match itself)
        let eventDays = getDaysBetween(event.start, event.end); // get all the days of the event as an array
        compareWeeks.map((compareWeek) => {
            if (compareWeek.some(compareWeekDay =>
                eventDays.some(eventDay => compareWeekDay.toString() === eventDay.toString())
            )) overlapCount++; // if any of them match, add 1 to overlapCount
        })
        return { ...event, overlaps: overlapCount }; // return the event with the correct overlapCount
    })
    return eventsWithOverlap
}

const getDaysBetween = (start, end) => {
    let days = [];
    if (start[1] === end[1]) { // hvis ukene er like
        for (let j = start[0]; j <= end[0]; j++) { // for hver dag mellom start og end
            days.push([j, start[1]]); // legg til dagene
        }
    }
    else for (let i = start[1]; i <= end[1]; i++) { // for hver uke
        switch (true) {
            case i === start[1]:
                for (let j = start[0]; j <= 6; j++) {
                    days.push([j, i]);
                }
                break;
            case i < end[1]:
                for (let j = 0; j <= 6; j++) {
                    days.push([j, i]);
                }
                break;
            case i === end[1]:
                console.log("last week");
                for (let j = 0; j <= end[0]; j++) {
                    days.push([j, i]);
                }
                break;
        }
    }
    return days
}

const getMultipleWeeks = (events) => {
    const eventsWithMW = events.map((event) => {
        return { ...event, multipleWeeks: event.start[1] - event.end[1] };
    })
    return eventsWithMW;
}

const getMultipleMonths = (events) => {
    const eventsWithMM = events.map((event) => {
        return { ...event, multipleMonths: event.start[2] - event.end[2] };
    })
    return eventsWithMM;
}

const SingleDay = ({ event }) => {
    return (
        <>
            {event.days === 1 && event.multipleWeeks === 0 && event.multipleMonths === 0 && (
                <div
                    id="event"
                    style={{
                        gridRow: `1 / 2`,
                        gridColumn: `1 / 1`
                    }}
                    className='bg-green-500 w-[50%] aspect-square rounded-full justify-self-center'
                />
            )}
        </>
    )
}