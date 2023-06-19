import './styles.css'
import { Menu, Transition } from '@headlessui/react'
import React, { Fragment, useEffect, useState } from 'react'
import {
    classNames,
    getDayAndTime,
    getNorwegianMonthName,
    getNorwegianDate
} from './helpers'
import ReactDOM from 'react-dom'
import useStore from './utils/useStore'



const App = ({ event, meeting }) => {
    const {
        year,
        month,
        calendarDates,
        setSelectedDate,
        currentEvents,
        events,
        loading,
        error,
        nextMonth,
        prevMonth
    } = useStore()

    console.log("meetings", meetings)

    console.log("calender dates", calendarDates)

    const [visibleClearButton, setVisibleClearButton] = useState(false);
    const [visibleMeetings, setVisibleMeetings] = useState(3);
    const meetingsPerPage = 3;

    const [meetings, setMeetings] = useState([]);

    const handleLoadMore = () => {
        const totalMeetings = events?.items.length || 0;
        const newVisibleMeetings = Math.min(
            visibleMeetings + meetingsPerPage,
            totalMeetings
        );
        setVisibleMeetings(newVisibleMeetings);
    };


   

    useEffect(() => {
        if (events?.items) {
            const slicedMeetings = events.items.slice(0, visibleMeetings);
            setMeetings(slicedMeetings);
        }
    }, [events, visibleMeetings]);


    const [hover, setHover] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [mobileClicked, setMobileClicked] = useState(false)
    useEffect(() => { setLoaded(true) }, [])

    const handleHover = (isHovered) => {
        setHover(isHovered);
        if (isHovered) {
            const mousePosition = getMousePosition();
            setHoverPosition({ x: mousePosition.x - 100, y: mousePosition.y - 120 });
        }
    };


    const setGray = (selectedDate) => {

        let grayFlag = false

        const result = events?.items?.filter((meeting) => {
            const startDate = new Date(meeting['start-dato']);
            const endDate = new Date(meeting['slutt-dato']);
            const selectedDateTime = new Date(selectedDate);

            return startDate <= selectedDateTime && selectedDateTime <= endDate;
        });
        result.map(item => {
            if (item['hvis-online-lenke']) {
                grayFlag = true
            }
        })
        return grayFlag
    };

    const setOrange = (selectedDate) => {
        let orangeFlag = false

        const result = events?.items?.filter((meeting) => {
            const startDate = new Date(meeting['start-dato']);
            const endDate = new Date(meeting['slutt-dato']);
            const selectedDateTime = new Date(selectedDate);

            return startDate <= selectedDateTime && selectedDateTime <= endDate;
        });
        result.map(item => {
            if (item['hvis-fysisk-lokalisasjon']) {
                orangeFlag = true
            }
        })
        return orangeFlag
    };


    const handlerNewMeetings = (selectedDate) => {
        

        setMeetings(events?.items?.filter((meeting) => {
            const startDate = new Date(meeting['start-dato']);
            const endDate = new Date(meeting['slutt-dato']);
            const selectedDateTime = new Date(selectedDate);

            return startDate <= selectedDateTime && selectedDateTime <= endDate;
        }));

        setVisibleClearButton(true);

    };

    const handleClearFilter = () => {
        setVisibleClearButton(false);
        setMeetings(events.items.slice(0, visibleMeetings ));
        // Reset any other filter-related state variables if needed
    };



    const isInckudedDato = (selectedDate) => {
        let flag = false
        events?.items?.map((meeting) => {
            const startDate = new Date(meeting['start-dato']);
            const endDate = new Date(meeting['slutt-dato']);
            const selectedDateTime = new Date(selectedDate);

            if (startDate <= selectedDateTime && selectedDateTime <= endDate) {
                flag = true
            }
        })
        return flag
    };


    const handleClick = () => {
        if (loaded && window.innerWidth < 1025 && !mobileClicked) {
            setHover(true)
            setMobileClicked(true)
            console.log("clicked mobile")
        } else {
            window.location.assign("https://www.vindel.no/hva-skjer/" + event?.slug)
            setMobileClicked(false)
            console.log("clicked desktop")
        }
    }
    const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

    const getMousePosition = () => {
        return { x: window.event.clientX, y: window.event.clientY };
    };
    addEventListener('mousemove', (event) => { getMousePosition() });

    return (


        <div className="mt-10 text-center relative gap-12  flex lg:items-start items-center lg:flex-row flex-col container  mx-auto ">
            <div className="flex flex-col w-[90%] lg:w-[55%] order-2 lg:order-1 ">
                <ol className="mt-4 divide-y divide-gray-100 text-sm leading-6 lg:col-span-7 xl:col-span-8">
                    {loading && <p>Loading...</p>}
                    {error && <p>Error: {error.message}</p>}
                    {!loading &&
                        events && meetings &&
                        meetings.map((meeting) => (
                            <li key={meeting?.id} className="relative  ">
                                <a className='flex items-center space-x-6 py-6 xl:static cursor-pointer' onClick={() => { window.location.assign("https://www.vindel.no/hva-skjer/" + meeting.slug) }}>
                                    <img src={meeting?.bilde?.url} alt={meeting?.bilde?.alt} className="h-[200px] w-[200px] object-cover flex-none rounded-xl" />
                                    <div className="flex flex-col ">
                                        <h3 className="pl-2 text-left text-xl font-semibold text-gray-900 xl:pl-3">{meeting.name}</h3>
                                        <dl className="mt-2 flex flex-col text-left text-gray-500 xl:flex-row">
                                            <div className="text-left flex items-start space-x-3">
                                                <dt className="mt-0.5">
                                                    <span className="sr-only">Date</span>
                                                    {/* <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" /> */}
                                                </dt>
                                                <dd className='ml-0 text-lg'>
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
                                </a>
                            </li>
                        ))}

                </ol>
                <div>
                    {meetings.length > 2 && (
                        <button
                            className="mt-4 bg-[#f6a24a]  hover:bg-[#ABA6FB] text-black px-6 py-4 rounded-md"
                            onClick={handleLoadMore}
                        >
                            Load More
                        </button>
                    )}
                </div>
            </div>
            <div className="flex lg:sticky lg:top-12 lg:left-0 lg:right-0 w-[90%] lg:w-[40%] pt-8 items-start text-gray-900 order-1 lg:order-2">
                <div className='w-full lg:sticky lg:top-20 lg:left-0 lg:right-0'>
                    <div className='flex flex-row w-full '>
                        <button
                            className="h-8 aspect-square bg-transparent hover:bg-blue-50 hover:shadow-md rounded-full flex flex-none items-center justify-center text-gray-400 hover:text-gray-500"
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
                            className="h-8 aspect-square bg-transparent hover:bg-blue-50 hover:shadow-md rounded-full flex flex-none items-center justify-center text-gray-400 hover:text-gray-500"
                            onClick={() => nextMonth()}
                        >
                            <span className="sr-only" >Next month</span>
                            {'>'}

                        </button>
                    </div>
                    <div className="w-full mt-6 grid grid-cols-7 text-xs leading-6 text-gray-500">
                        <div>M</div>
                        <div>T</div>
                        <div>O</div>
                        <div>T</div>
                        <div>F</div>
                        <div>L</div>
                        <div>S</div>
                    </div>
                    {calendarDates && (
                        <div className='isolate w-full relative'>
                            <div className="relative z-0 isolate w-full mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200">
                                {calendarDates && calendarDates.map((day, dayIdx) => (



                                    <div
                                        key={day?.date}
                                        className={classNames(
                                            'h-[3.25rem] mx-auto flex items-center justify-center relative w-full hover:bg-gray-100 focus:z-10',
                                            day.isCurrentMonth ? 'bg-white' : 'bg-gray-50',
                                            (day.isSelected || day.isToday) && '',
                                            day.isSelected && 'text-white',
                                            !day.isSelected && day.isCurrentMonth && !day.isToday && 'text-gray-900',
                                            !day.isSelected && !day.isCurrentMonth && !day.isToday && 'text-gray-400',
                                            
                                            calendarDates[dayIdx - 1]?.isToday && !day.isToday && !day.isSelected && 'text-orange-600 font-semibold',
                                            dayIdx === 0 && 'rounded-tl-lg',
                                            dayIdx === 6 && 'rounded-tr-lg',
                                            dayIdx === calendarDates.length - 7 && 'rounded-bl-lg',
                                            dayIdx === calendarDates.length - 1 && 'rounded-br-lg',
                                        )}

                                    >
                                        {events && events?.items?.length > 0 && (
                                            <div key={day?.date}>
                                                <div
                                                    
                                                    className={classNames(
                                                        'mx-auto flex h-7 w-7 items-center justify-center rounded-full',
                                                        day?.isSelected && day?.isToday && ' text-red-500',
                                                        day?.isSelected && !day?.isToday && ' text-red-500'
                                                    )}
                                                >
                                                    {new Date(new Date(day?.date)?.setDate(new Date(day?.date)?.getDate()-1))?.getDate()}
                                                 
                                                </div>
                                                {isInckudedDato(day?.date) && (<div
                                                    key={day?.date}
                                                    style={{
                                                        display: "grid",
                                                        gap: "1.5px",
                                                        gridTemplateColumns: "repeat(1,1fr)",
                                                        gridTemplateRows: `repeat(1, 1fr)`,
                                                    }}
                                                    className='aspect-square absolute left-0 right-0 top-0 w-10 h-10 mx-auto my-[0.35rem]'
                                                >
                                                    <div
                                                        id='filter button'
                                                        style={{
                                                            background: `linear-gradient(to right, ${setGray(day?.date) ? "gray" : "orange"} 50%, ${setOrange(day?.date) ? "orange" : "gray"} 50%)`,
                                                            
                                                        }}
                                                        onClick={() => handlerNewMeetings(day?.date)} // Pass the selected date as an argument
                                                        className='rounded-full opacity-30  cursor-pointer rotate-45 ease-in-out hover:ease-in-out hover:rotate-0 duration-300'

                                                    >
                                                    </div>
                                                </div>)}
                                            </div>
                                        )
                                        }



                                    </div>
                                ))}
                            </div>

                        </div>
                    )}

                    <div className='m-4'>
                        {visibleClearButton && (
                            <button
                                className="mt-4 bg-[#f6a24a] text-black hover:bg-[#ABA6FB] px-6 py-4 rounded-md"
                                onClick={handleClearFilter}
                            >
                                Clear filter
                            </button>
                        )}
                    </div>
                </div>

            </div>

        </div>

    )
}

ReactDOM.render(
    React.createElement(App, {}, null),
    document.getElementById('react-target')
);

// const Event = ({ event }) => {
//     const [hover, setHover] = useState(false)
//     const [loaded, setLoaded] = useState(false)
//     const [mobileClicked, setMobileClicked] = useState(false)
//     useEffect(() => { setLoaded(true) }, [])

//     const handleHover = (isHovered) => {
//         setHover(isHovered);
//         if (isHovered) {
//             const mousePosition = getMousePosition();
//             setHoverPosition({ x: mousePosition.x - 100, y: mousePosition.y - 120 });
//         }
//     };

//     const handleClick = () => {
//         if (loaded && window.innerWidth < 1025 && !mobileClicked) {
//             setHover(true)
//             setMobileClicked(true)
//         } else {
//             window.location.assign("https://www.vindel.no/hva-skjer/" + event.slug)
//             setMobileClicked(false)
//         }
//     }
//     const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

//     const getMousePosition = () => {
//         return { x: window.event.clientX, y: window.event.clientY };
//     };
//     addEventListener('mousemove', (event) => { getMousePosition() });
//     return (
//         <>
//             <div
//                 id="event"
//                 style={{
//                     gridRow: `${event.start[1] + 1}/ ${event.end[1] + 2}`, // hvor høyt
//                     gridColumn: `${event.start[0] + 1} / ${event.end[0] + 2}`, // hvor bredt
//                     display: "grid",
//                     gap: "1.5px",
//                     gridTemplateColumns: "repeat(1,1fr)",
//                     gridTemplateRows: `repeat(${(event.days === 1 && event.overlaps === 0) ? 1 : event.overlapMax + 1}, 1fr)` // hvor mange rader
//                 }}
//                 className={classNames(
//                     (event.squaredEnd && event.squaredStart) ? "w-[100%]"
//                         : event.squaredEnd ? "justify-self-end w-[97%]" : "",
//                     event.days === 1 ? 'aspect-square' : (event.days > 1 && !event.squaredEnd && !event.squaredStart) ? 'w-[90%]' : "", // if event is longer than one day
//                     event.overlaps > 0 ? "h-[80%]" : "h-[65%]",
//                     (!event.squaredEnd && !event.squaredStart) ? 'justify-self-center' : '',
//                 )}
//             >
//                 <div
//                     style={{
//                         gridRow: `${event.overlapIndex + 1}`,
//                         backgroundColor: event.color ?? "gray",
//                     }}
//                     onMouseEnter={() => { handleHover(true) }}
//                     onMouseLeave={() => { handleHover(false) }}
//                     onClick={() => { handleClick() }}
//                     className={classNames(
//                         (event.squaredEnd && event.squaredStart) ? "" :
//                             event.squaredEnd ? "rounded-l-full" :
//                                 event.squaredStart ? "rounded-r-full" : "rounded-full",
//                         hover ? "opacity-60" : "opacity-100",
//                         "opacity-90 relative z-1 cursor-pointer",
//                     )}>


//                 </div>
//             </div>
//             {hover &&
//                 <div
//                     style={{
//                         position: 'fixed',
//                         top: hoverPosition.y,
//                         left: hoverPosition.x,
//                         zIndex: 9999,
//                         cursorEvents: loaded && window.innerWidth > 1025 ? 'none' : 'auto'
//                     }}
//                     onClick={() => { window.location.assign("https://www.vindel.no/hva-skjer/" + event.slug) }}
//                     id="event-hover"
//                     className='max-h-24 flex flex-col justify-center bottom-6 bg-gray-600 text-white border border-white rounded-lg px-[8px] py-[10px] text-left max-w-xs'>
//                     <h3 className='truncate whitespace-nowrap font-bold text-md pb-1'>{event.name}</h3>
//                     <DatoComponent event={event} />
//                 </div>
//             }
//         </>
//     )
// }



const Event = ({ event }) => {
    const [hover, setHover] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [mobileClicked, setMobileClicked] = useState(false)
    useEffect(() => { setLoaded(true) }, [])

    const handleHover = (isHovered) => {
        setHover(isHovered);
        if (isHovered) {
            const mousePosition = getMousePosition();
            setHoverPosition({ x: mousePosition.x - 100, y: mousePosition.y - 120 });
        }
    };

    const handleClick = () => {
        if (loaded && window.innerWidth < 1025 && !mobileClicked) {
            setHover(true)
            setMobileClicked(true)
            console.log("clicked mobile")
        } else {
            window.location.assign("https://www.vindel.no/hva-skjer/" + event.slug)
            setMobileClicked(false)
            console.log("clicked desktop")
        }
    }
    const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

    const getMousePosition = () => {
        return { x: window.event.clientX, y: window.event.clientY };
    };
    addEventListener('mousemove', (event) => { getMousePosition() });
    return (
        <>

            <div
                id="event"
                style={{
                    gridRow: `${event.start[1] + 1}`, // hvor høyt
                    gridColumn: `${event.start[0] + 1} `, // hvor bredt
                }}
                className="h-[3.22rem] w-full "
            >
                <div
                    style={{
                        display: "grid",
                        gap: "1.5px",
                        gridTemplateColumns: "repeat(1,1fr)",
                        gridTemplateRows: `repeat(1, 1fr)` // hvor mange rader
                        // gridTemplateRows: `repeat(${(event.days === 1 && event.overlapsWith.length === 0) ? 1 : event.maxLayer + 1}, 1fr)` // hvor mange rader
                    }}
                    className='aspect-square w-10 h-10 mx-auto my-[0.35rem]'
                // className={classNames(
                //     (event.squaredEnd && event.squaredStart) ? ""                                               // event is in the middle of multi-day
                //         : event.squaredEnd ? "pl-[5%]"                                                          // event is in the end of multi-day
                //             : event.squaredStart ? "pl-0 pr-[5%]" : "",                             // event is in the start of multi-day
                //     (event.days === 1 && event.maxLayer === 0) ? 'aspect-square'                                // event has no overlaps and is only one day
                //         : (event.days === 1 && event.maxLayer > 0) ? 'px-3'                                     // event has overlaps and is only one day
                //             : (event.days > 1 && !event.squaredEnd && !event.squaredStart) ? 'w-[90%]' : "",    // if event is longer than one day
                //     event.maxLayer > 0 ? "h-[80%]" : "h-[65%]",
                //     (!event.squaredEnd && !event.squaredStart && event.maxLayer === 0) ? 'place-self-center' : '',
                // )}
                >
                    <div
                        style={{
                            gridRow: `${event.layer + 1}`,
                            backgroundColor: event.color ?? "gray",
                        }}
                        onMouseEnter={() => { handleHover(true) }}
                        onMouseLeave={() => { handleHover(false) }}
                        onClick={() => { handleClick() }}
                        className='rounded-full opacity-80  cursor-pointer'
                    // className={classNames(
                    //     (event.squaredEnd && event.squaredStart) ? "" :
                    //         event.squaredEnd ? "rounded-l-full" :
                    //             event.squaredStart ? "rounded-r-full" : "rounded-full",
                    //     hover ? "opacity-60" : "opacity-100",
                    //     "opacity-90 relative z-1 cursor-pointer",
                    // )}
                    >


                    </div>
                </div>

            </div>
            {hover &&
                <div
                    style={{
                        position: 'fixed',
                        top: hoverPosition.y,
                        left: hoverPosition.x,
                        zIndex: 9999,
                        cursorEvents: loaded && window.innerWidth > 1025 ? 'none' : 'auto'
                    }}
                    onClick={() => { window.location.assign("https://www.vindel.no/hva-skjer/" + event.slug) }}
                    id="event-hover"
                    className='max-h-24 flex flex-col justify-center bottom-6 bg-gray-600 text-white border border-white rounded-lg px-[8px] py-[10px] text-left max-w-xs'>
                    <h3 className='truncate whitespace-nowrap font-bold text-md pb-1'>{event.name}</h3>
                    <DatoComponent event={event} />
                </div>
            }
        </>
    )
}
const DatoComponent = ({ event }) => {
    if (event.days > 1 && event.multipleWeeks > 0 || event.multipleMonths > 0) {
        const time = getNorwegianDate({ startDate: event.startDato, endDate: event.sluttDato, differentWeek, differentMonth })
        return (
            <>
                {time && time.map((t, i) => {
                    return (
                        <p className='whitespace-nowrap text-[0.7rem]' key={i} >{t}</p>
                    )
                })}
            </>
        )
    }
    else if (event.days === 1) {
        const time = getNorwegianDate({ startDate: event.startDato })
        return (
            <p className='whitespace-nowrap text-[0.7rem]'>{time}</p>
        )
    }
    else if (event.days > 1 && event.multipleWeeks === 0 && event.multipleMonths === 0) {
        const time = getNorwegianDate({ startDate: event.startDato, endDate: event.sluttDato })
        return (
            <>
                {time && time.map((t, i) => {
                    return (
                        <p className='whitespace-nowrap text-[0.7rem]' key={i} >{t}</p>
                    )
                })}
            </>
        )
    }
    else if (event.days > 1 && event.multipleWeeks > 0 && event.multipleMonths === 0) {
        const time = getNorwegianDate({ startDate: event.startDato, endDate: event.sluttDato, differentWeek })
        return (
            <>
                {time && time.map((t, i) => {
                    return (
                        <p className='whitespace-nowrap text-[0.7rem]' key={i} >{t}</p>
                    )
                })}
            </>
        )
    } else return
}

// const MeetingList = () => {
//     return (
//         <ol className="mt-4 divide-y divide-gray-100 text-sm leading-6 lg:col-span-7 xl:col-span-8">
//             {loading && <p>Loading...</p>}
//             {error && <p>Error: {error.message}</p>}
//             {!loading && events && events?.items.map((meeting) => (
//                 <li key={meeting.id} className="relative flex space-x-6 py-6 xl:static">
//                     <img src={meeting?.bilde?.url} alt={meeting?.bilde?.alt} className="h-14 w-14 flex-none rounded-full" />
//                     <div className="flex-auto">
//                         <h3 className="pr-10 font-semibold text-gray-900 xl:pr-0">{meeting.name}</h3>
//                         <dl className="mt-2 flex flex-col text-gray-500 xl:flex-row">
//                             <div className="flex items-start space-x-3">
//                                 <dt className="mt-0.5">
//                                     <span className="sr-only">Date</span>
//                                     {/* <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" /> */}
//                                 </dt>
//                                 <dd>
//                                     <time dateTime={meeting['start-dato']}>
//                                         {'fra ' + getDayAndTime(meeting['start-dato'])}
//                                     </time>
//                                     <time dateTime={meeting['start-dato']}>
//                                         {' - ' + getDayAndTime(meeting['slutt-dato'])}
//                                     </time>
//                                 </dd>
//                             </div>
//                             <div className="mt-2 flex items-start space-x-3 xl:mt-0 xl:ml-3.5 xl:border-l xl:border-gray-400 xl:border-opacity-50 xl:pl-3.5">
//                                 <dt className="mt-0.5">
//                                     <span className="sr-only">Location</span>
//                                     {/* <MapPinIcon className="h-5 w-5 text-gray-400" aria-hidden="true" /> */}
//                                 </dt>
//                                 <dd>{meeting?.['hvis-fysisk-lokalisasjon']}</dd>
//                             </div>
//                         </dl>
//                     </div>
//                     <Menu as="div" className="absolute top-6 right-0 xl:relative xl:top-auto xl:right-auto xl:self-center">
//                         <div>
//                             <Menu.Button className="-m-2 flex items-center rounded-full p-2 text-gray-500 hover:text-gray-600">
//                                 <span className="sr-only">Open options</span>
//                                 {/* <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" /> */}
//                             </Menu.Button>
//                         </div>

//                         <Transition
//                             as={Fragment}
//                             enter="transition ease-out duration-100"
//                             enterFrom="transform opacity-0 scale-95"
//                             enterTo="transform opacity-100 scale-100"
//                             leave="transition ease-in duration-75"
//                             leaveFrom="transform opacity-100 scale-100"
//                             leaveTo="transform opacity-0 scale-95"
//                         >
//                             <Menu.Items className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
//                                 <div className="py-1">
//                                     <Menu.Item>
//                                         {({ active }) => (
//                                             <a
//                                                 href="#"
//                                                 className={classNames(
//                                                     active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
//                                                     'block px-4 py-2 text-sm'
//                                                 )}
//                                             >
//                                                 Edit
//                                             </a>
//                                         )}
//                                     </Menu.Item>
//                                     <Menu.Item>
//                                         {({ active }) => (
//                                             <a
//                                                 href="#"
//                                                 className={classNames(
//                                                     active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
//                                                     'block px-4 py-2 text-sm'
//                                                 )}
//                                             >
//                                                 Cancel
//                                             </a>
//                                         )}
//                                     </Menu.Item>
//                                 </div>
//                             </Menu.Items>
//                         </Transition>
//                     </Menu>
//                 </li>
//             ))}
//         </ol>
//     )
// }