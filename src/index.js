import './styles.css'
import { Menu, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'
import {
    classNames,
    getDayAndTime,
    getNorwegianMonthName,
} from './helpers'
import ReactDOM from 'react-dom'
import useStore from './utils/useStore'

const App = () => {
    const {
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
    } = useStore()

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
                                            <Event event={event} conditions={true} />
                                            {/* multi-day */}
                                            {/* {event.days > 1 && event?.multipleWeeks === 0 && event.multipleMonths === 0 && (
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
                                            )} */}

                                            {/* stacked multi */}
                                            {/* todo: add index on the item or check index here for the gridRow */}
                                            {/* {event.overlaps > 0 && event.days > 1 && event?.multipleWeeks === 0 && event.multipleMonths === 0 && (
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
                                                </div>)} */}

                                            {/* stacked single */}
                                            {/* todo: add index on the item or check index here for the gridRow */}
                                            {/* {event.overlaps > 0 && event.days === 1 && event?.multipleWeeks === 0 && event.multipleMonths === 0 && (
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
                                                </div>)} */}

                                        </>
                                    ))}





                                    {/* multi-week right */}
                                    {/* <div
                                        id="event"
                                        style={{
                                            gridRow: `3 / 4`,
                                            gridColumn: `5 / 8`
                                        }}
                                        className='bg-red-500 h-[65%] ml-[12px] rounded-l-full'
                                    >
                                    </div> */}

                                    {/* multi-week left */}
                                    {/* <div
                                        id="event"
                                        style={{
                                            gridRow: `4 / 5`,
                                            gridColumn: `1 / 3`
                                        }}
                                        className='bg-red-500 h-[65%] mr-[12px] rounded-r-full'
                                    >
                                    </div> */}

                                    {/* stacked */}
                                    {/* <div
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
                                    </div> */}

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

ReactDOM.render(
    React.createElement(App, {}, null),
    document.getElementById('react-target')
);

// conditions: event.days === 1 && event.multipleWeeks === 0 && event.multipleMonths === 0
const Event = ({ event, conditions }) => {
    return (
        <>
            {conditions && (
                <div
                    id="event"
                    style={{
                        gridRow: `${event.start[1]} / ${event.end[1] + 1}`, // hvor høyt
                        gridColumn: `${event.start[0]} / ${event.end[0] + 1}`, // hvor bredt
                        display: "grid",
                        gridTemplateColumns: "repeat(1,1fr)",
                        gridTemplateRows: `repeat(${event.overlaps + 1}, 1fr)` // hvor mange rader
                    }}
                    className={classNames(
                        event.days > 1 ? 'w-[95%]' : 'aspect-square', // if event is longer than one day
                        event.overlaps > 0 ? "h-[90%]" : "bg-green-500 h-[75%]",
                        'rounded-full justify-self-center',
                    )}
                >
                    <div
                        style={{
                            gridRow: `2 / 3`,
                        }}
                        className={classNames(
                            event.overlaps > 0 ? "bg-green-500" : "invisible",
                            "rounded-full"
                        )} />
                </div>
            )}
        </>
    )
}

// {
//     event.days > 1 && event?.multipleWeeks === 0 && event.multipleMonths === 0 && (
//         <>
//             <div
//                 id="event"
//                 style={{
//                     gridRow: `${event.start[1] + 1} / ${event.end[1] + 2}`,
//                     gridColumn: `${event.start[0] + 1} / ${event.end[0] + 2}`
//                 }}
//                 className='bg-gray-500 h-[65%] mx-[12px] rounded-full'
//             >
//             </div>
//         </>
//     )
// }

// <div
//     id="event"
//     style={{
//         gridRow: `3 / 4`,
//         gridColumn: `5 / 8`
//     }}
//     className='bg-red-500 h-[65%] ml-[12px] rounded-l-full'
// >
// </div> 

// {/* stacked multi */ }
// {/* todo: add index on the item or check index here for the gridRow */ }
// {/* {event.overlaps > 0 && event.days > 1 && event?.multipleWeeks === 0 && event.multipleMonths === 0 && (
//                                                 <div
//                                                     id="event"
//                                                     style={{
//                                                         gridRow: `${event.start[1]} / ${event.end[1]}`,
//                                                         gridColumn: `${event.start[0]} / ${event.end[0]}`,
//                                                         display: "grid",
//                                                         gridTemplateColumns: "repeat(1,1fr)",
//                                                         gridTemplateRows: `repeat(${event.overlaps}, 1fr)`

//                                                     }}
//                                                     className='h-[90%] mx-[12px]'
//                                                 >
//                                                     <div
//                                                         style={{
//                                                             gridRow: `1 / 3`,
//                                                         }}
//                                                         className='bg-green-500 rounded-full'
//                                                     />
//                                                 </div>)} */}