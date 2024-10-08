import './styles.css'
import { Menu, Transition } from '@headlessui/react'
import React, { Fragment, useEffect, useState } from 'react'
import {
    classNames,
    getDayAndTime,
    getDateAndTime,
    getTime,
    getNorwegianMonthName,
    getNorwegianDate,
    extractAndModifySubstring,
    extractYear,
    extractMonth
} from './helpers'
import ReactDOM from 'react-dom'
import useStore from './utils/useStore'



const App = ({ event, }) => {
    const {
        year,
        month,
        calendarDates,
        setSelectedDate,
        currentEvents,
        events,
        meetings,
        setMeetings,
        loading,
        error,
        nextMonth,
        prevMonth
    } = useStore()
    // const [visibleClearButton, setVisibleClearButton] = useState(false);
    const [visibleMeetings, setVisibleMeetings] = useState(3);
    const [filterText, setFilterText] = useState('Fra idag');
    const [filterDato, setFilterDato] = useState(false);
    const meetingsPerPage = 3;
    const [kalenderFilterd, setkalenderFilterd] = useState(false);
    
    
    
    // useEffect(() => {
    //     if (meetings && meetings.length > 0) {
    //         const sortedMeetings = meetings
    //             .filter((meeting) => !meeting._draft) // Exclude draft meetings
    //             .sort((a, b) => new Date(b['start-dato']) - new Date(a['start-dato'])); // Sort by start date, newest to oldest

    //         const slicedMeetings = sortedMeetings.slice(0, visibleMeetings);
    //         setMeetings(slicedMeetings);
    //     }
    // }, [visibleMeetings]);



    const [hover, setHover] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [mobileClicked, setMobileClicked] = useState(false)
    // useEffect(() => {
    //     setLoaded(true);
    //     if (meetings && meetings.length > 0) {
    //         const sortedMeetings = meetings
    //             .filter((meeting) => !meeting._draft) // Exclude draft meetings
    //             .sort((a, b) => new Date(b['start-dato']) - new Date(a['start-dato'])); // Sort by start date, newest to oldest

    //         const slicedMeetings = sortedMeetings.slice(0, 3);
    //         setMeetings(slicedMeetings);
    //     }
    // }, [])


    // const handleLoadMore = () => {
    //     const totalMeetings = events?.items.length || 0;
    //     const newVisibleMeetings = Math.min(
    //         visibleMeetings + meetingsPerPage,
    //         totalMeetings
    //     );
    //     setVisibleMeetings(newVisibleMeetings);
    // };

    function isSameOrAfter(a, b) {
        return a.getFullYear() > b.getFullYear() ||
            a.getFullYear() === b.getFullYear() && a.getMonth() > b.getMonth() ||
            a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() >= b.getDate();
    }

    function isSameOrBefore(a, b) {
        return a.getFullYear() < b.getFullYear() ||
            a.getFullYear() === b.getFullYear() && a.getMonth() < b.getMonth() ||
            a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() <= b.getDate();
    }

    const handleClearFilter = () => {
        setkalenderFilterd(false);
        setVisibleMeetings(3);
        setMeetings(events?.items
            .filter((meeting) => !meeting._draft)
            .filter((meeting) => meeting['start-dato'] >= new Date().toISOString())
            .sort((a, b) => new Date(a['start-dato']) - new Date(b['start-dato']))// Sort by start date, newest to oldest
        );
        // const sortedMeetings = events.items
        //     .filter((meeting) => !meeting._draft) // Exclude draft meetings
        //     .sort((a, b) => new Date(b['start-dato']) - new Date(a['start-dato'])); // Sort by start date, newest to oldest
        // const slicedMeetings = sortedMeetings.slice(0, visibleMeetings);
        // setMeetings(slicedMeetings);
    };

    const handlerNewMeetings = (selectedDate) => {
    const selected = selectedDate instanceof Date ? selectedDate : new Date(selectedDate);

    const newMeetings = events?.items?.filter((meeting) => {
        const start = new Date(meeting['start-dato']);
        const end = new Date(meeting['slutt-dato']);
        // Adjust the comparison to include the day after the meeting
        end.setDate(end.getDate() + 1);
        start.setDate(start.getDate() + 1);
        return !meeting._draft && isSameOrAfter(selected, start) && isSameOrBefore(selected, end);
    });

    setMeetings(newMeetings);
    setkalenderFilterd(true);
    setFilterDato(true);
};

    const handleFromTodayMeetings = () => {
        setFilterDato(false)
        setFilterText('Fra idag')
    };

    const handleShowAllMeetings = () => {
        setFilterDato(false)
        setFilterText('Sist Publisert')
    };

    const handleShowOldEventsMeetings = () => {
        setFilterDato(false)
        setFilterText('Tidligere Arrangementer')
    };

    const sortedMeetings = meetings
        .filter((meeting) => !meeting._draft)
        .filter((meeting) => meeting['start-dato'] >= new Date().toISOString())
        .sort((a, b) => new Date(a['start-dato']) - new Date(b['start-dato']));
    


    function standarSortedMeetings() {
        const [sortedMeetings, setSortedMeetings] = useState(meetings)
        useEffect(() => {
            if (!filterDato && filterText === 'Fra idag') {
                const sortedMeetingsTemp = events?.items && events?.items
                    .filter((meeting) => !meeting._draft) // Exclude draft meetings
                    .filter((meeting) => meeting['slutt-dato'] >= new Date().toISOString())
                    .sort((a, b) => new Date(a['start-dato']) - new Date(b['start-dato'])); // Sort by start date, newest to oldest

                const slicedMeetings = sortedMeetingsTemp && sortedMeetingsTemp.slice(0, visibleMeetings);
                setSortedMeetings(slicedMeetings);
            }
            if (meetings && meetings.length > 0 && filterDato) {
                const slicedMeetings = meetings.slice(0, visibleMeetings);
                setSortedMeetings(slicedMeetings);
            }

        }, [])

        return (standarSortedMeetings)
    };    

    function RenderMeetings({ meetings, visibleMeetings, kalenderMeetings, kalenderFilterd }) {
        const [sortedMeetings, setSortedMeetings] = useState(meetings)
        const [sortedKalenderMeetings, setSortedKalenderMeetings] = useState(meetings)
        // console.log('Rendermeetings sortedMeetings', sortedMeetings);
        // console.log('Rendermeetings kalenderFilterd', kalenderFilterd);
        // console.log('Rendermeetings meetings', meetings);
 
        const meetingsToUse = kalenderFilterd ? kalenderMeetings : meetings; // Determine which list to use
        
        const [pages] = useState(Math.ceil(meetingsToUse.length / visibleMeetings));        
        const [currentPage, setCurrentPage] = useState(1);
        const pageLimit = 3;

        useEffect(()=> {
            renderTeporaryMeetings(currentPage) 
        }, [currentPage])

        function goToNextPage() {
            setCurrentPage((currentPage) => currentPage + 1);

        }

        function goToPreviousPage() {
            setCurrentPage((currentPage) => currentPage - 1);
            
        }

        const changePage = (event) => {
            const pageNumber = Number(event.target.textContent);
            setCurrentPage(pageNumber);
        };

       function renderTeporaryMeetings(num = currentPage) {
            const newMeetingsTemp = meetings && meetingsToUse?.slice(num * pageLimit - pageLimit, num * pageLimit)
            setSortedMeetings(newMeetingsTemp)
        }

        const getPaginatedData = () => {
            return sortedMeetings;
        };

        // const getPaginationGroup = () => {
        //     let start = Math.floor((currentPage - 1) / pageLimit) * pageLimit;
        //     return new Array(pageLimit).fill().map((_, idx) => start + idx + 1);
        // };

        const getPaginationGroup = () => {
            const totalNumPages = Math.ceil(meetingsToUse.length / pageLimit);
            const numPagesToShow = 3;
            let startPage, endPage;

            if (currentPage === 1) {
                startPage = 1;
                endPage = Math.min(numPagesToShow, totalNumPages);
            } else if (currentPage === totalNumPages) {
                startPage = Math.max(1, totalNumPages - numPagesToShow + 1);
                endPage = totalNumPages;
            } else {
                startPage = Math.max(1, currentPage - Math.floor(numPagesToShow / 2));
                endPage = Math.min(totalNumPages, currentPage + Math.floor(numPagesToShow / 2));
            }

            return [...Array((endPage + 1) - startPage).keys()].map(i => i + startPage);
        };

        // const newMeetings = meetings.filter((meeting) => {
        //     if (meeting['start-dato']>= new Date().toISOString()) {
        //         return meeting
        //     }   
        // }).sort((a, b) => new Date(a['start-dato']) - Date(b['start-dato']));
        
        return (
            <div>
                <ol className="mt-4 text-sm leading-6 lg:col-span-7 xl:col-span-8">
                    {loading && <p>Loading...</p>}
                    {error && <p>Error: {error.message}</p>}
                    {meetings && sortedMeetings && kalenderFilterd === false ? (
                        sortedMeetings
                            .map((meeting) => {
                                return (
                                    <li key={meeting?.id} className="relative  ">
                                        <a className='flex flex-col md:flex-row  justify-between py-6 xl:static cursor-pointer border-b-[1px] border-[#F9BB7A]' onClick={() => { window.location.assign("https://www.vindel.no/hva-skjer/" + meeting.slug) }}>
                                            <div className='flex md:space-x-6 xl:max-w-none md:max-w-lg flex-col md:flex-row'>
                                                <img src={meeting?.bilde?.url} alt={meeting?.bilde?.alt} className="md:h-[150px] md:w-[150px] h-[50vw] w-full object-cover flex-none self-center rounded-xl" />
                                                <div className="flex flex-col justify-between py-4 ">
                                                    <h3 className=" mb-2 md:pl-2 text-left md:text-xl text-md md:leading-7 leading-5 font-semibold text-gray-900 ">{meeting.name}</h3>
                                                    <div>
                                                        <div className='md:pl-2 flex flex-row gap-1 '>
                                                            <p className='text-xs leading-6 md:text-sm md:leading-7'>NÅR:</p>
                                                            <div className='flex flex-row flex-wrap'>
                                                                <time className='text-xs leading-6 md:text-sm md:leading-7' dateTime={meeting['start-dato']}>
                                                                    {getDateAndTime(meeting['start-dato'])}
                                                                </time>
                                                                <span className='text-xs leading-6 md:text-sm md:leading-7 mx-1'>- </span>
                                                                {!meeting?.['flere-dager'] && (<time className=' text-xs leading-6 md:text-sm md:leading-7' dateTime={meeting['slutt-dato']}>
                                                                    {getTime(meeting['slutt-dato'])}
                                                                </time>)}
                                                                {meeting?.['flere-dager'] && (<time className=' text-xs leading-6 md:text-sm md:leading-7' dateTime={meeting['slutt-dato']}>
                                                                    {getDateAndTime(meeting['slutt-dato'])}
                                                                </time>)}
                                                            </div>
                                                        </div>
                                                        <div className='md:pl-2 flex flex-row gap-1 '>
                                                            {meeting?.['hvis-fysisk-lokalisasjon'] && (
                                                                <p className='text-xs leading-6 md:text-sm md:leading-7'>HVOR:</p>
                                                            )}
                                                            <p className='text-xs leading-6 md:text-sm md:leading-7'>{meeting?.['hvis-fysisk-lokalisasjon']}</p>
                                                        </div>
                                                    </div>    
                                                    {/* <dl className="mt-2 flex flex-col text-left text-gray-500 xl:flex-row">
                                                        <div className="text-left flex items-start space-x-3">
                                                            <dt className="mt-0.5">
                                                                <span className="sr-only">Date</span>
                                                                
                                                            </dt>
                                                            <dd className='ml-0 text-lg'>
                                                                <time dateTime={meeting['start-dato']}>
                                                                    {getDateAndTime(meeting['start-dato'])}
                                                                </time>
                                                                <time dateTime={meeting['start-dato']}>
                                                                    {' - ' + getDateAndTime(meeting['slutt-dato'])}
                                                                </time>
                                                            </dd>
                                                        </div>
                                                        <div className="mt-2 flex items-start space-x-3 xl:mt-0 xl:ml-3.5 xl:border-l xl:border-gray-400 xl:border-opacity-50 xl:pl-3.5">
                                                            <dt className="mt-0.5">
                                                                <span className="sr-only">Location</span>
                                                            </dt>
                                                            <dd>{meeting?.['hvis-fysisk-lokalisasjon']}</dd>
                                                        </div>
                                                    </dl> */}
                                                </div>
                                            </div>
                                            <div className='md:flex md:flex-col-reverse '>
                                                <p className='text-xs lg:w-[225px] md:w-[151px] text-start' src={meeting?.bilde?.url}>Program og påmelding <span className='pl-2'>➔</span></p>

                                            </div>
                                            {/* <Menu as="div" className="absolute top-6 right-0 xl:relative xl:top-auto xl:right-auto xl:self-center">
                                                <div>
                                                    <Menu.Button className="-m-2 flex items-center rounded-full p-2 text-gray-500 hover:text-gray-600">
                                                        <span className="sr-only">Open options</span>
                                                        
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
                                            </Menu> */}
                                        </a>
                                    </li>
                                );
                            })
                    ) : null}
                    {meetings && sortedMeetings && kalenderMeetings && kalenderFilterd ? (
                        sortedMeetings
                            .map((meeting) => {
                                // console.log('kalenderMeetings', kalenderMeetings);
                                return (
                                    <li key={meeting?.id} className="relative  ">
                                        <a className='flex flex-col md:flex-row  justify-between py-6 xl:static cursor-pointer border-b-[1px] border-[#F9BB7A]' onClick={() => { window.location.assign("https://www.vindel.no/hva-skjer/" + meeting.slug) }}>
                                            <div className='flex md:space-x-6 xl:max-w-none md:max-w-lg flex-col md:flex-row'>
                                                <img src={meeting?.bilde?.url} alt={meeting?.bilde?.alt} className="md:h-[150px] md:w-[150px] h-[50vw] w-full object-cover self-center flex-none rounded-xl" />
                                                <div className="flex flex-col justify-between py-4 ">
                                                    <h3 className="mb-2 md:pl-2 text-left md:text-xl text-md md:leading-7 leading-5 font-semibold text-gray-900 ">{meeting.name}</h3>
                                                    <div>
                                                        <div className='md:pl-2 flex flex-row gap-1 '>
                                                            <p className='text-xs leading-6 md:text-sm md:leading-7'>NÅR:</p>
                                                            <div className='flex flex-row flex-wrap'>
                                                                <time className='text-xs leading-6 md:text-sm md:leading-7' dateTime={meeting['start-dato']}>
                                                                    {getDateAndTime(meeting['start-dato'])}
                                                                </time>
                                                                <span className='text-xs leading-6 md:text-sm md:leading-7 mx-1'>- </span>
                                                                {!meeting?.['flere-dager'] && (<time className=' text-xs leading-6 md:text-sm md:leading-7' dateTime={meeting['slutt-dato']}>
                                                                    {getTime(meeting['slutt-dato'])}
                                                                </time>)}
                                                                {meeting?.['flere-dager'] && (<time className=' text-xs leading-6 md:text-sm md:leading-7' dateTime={meeting['slutt-dato']}>
                                                                    {getDateAndTime(meeting['slutt-dato'])}
                                                                </time>)}
                                                            </div>
                                                        </div>
                                                        <div className='md:pl-2 flex flex-row gap-1 '>
                                                            {meeting?.['hvis-fysisk-lokalisasjon'] && (
                                                                <p className='text-xs leading-6 md:text-sm md:leading-7'>HVOR:</p>
                                                            )}
                                                            <p className='text-xs leading-6 md:text-sm md:leading-7'>{meeting?.['hvis-fysisk-lokalisasjon']}</p>
                                                        </div>
                                                    </div>
                                                    {/* <dl className="mt-2 flex flex-col text-left text-gray-500 xl:flex-row">
                                                        <div className="text-left flex items-start space-x-3">
                                                            <dt className="mt-0.5">
                                                                <span className="sr-only">Date</span>
                                                                
                                                            </dt>
                                                            <dd className='ml-0 text-lg'>
                                                                <time dateTime={meeting['start-dato']}>
                                                                    {getDateAndTime(meeting['start-dato'])}
                                                                </time>
                                                                <time dateTime={meeting['start-dato']}>
                                                                    {' - ' + getDateAndTime(meeting['slutt-dato'])}
                                                                </time>
                                                            </dd>
                                                        </div>
                                                        <div className="mt-2 flex items-start space-x-3 xl:mt-0 xl:ml-3.5 xl:border-l xl:border-gray-400 xl:border-opacity-50 xl:pl-3.5">
                                                            <dt className="mt-0.5">
                                                                <span className="sr-only">Location</span>
                                                            </dt>
                                                            <dd>{meeting?.['hvis-fysisk-lokalisasjon']}</dd>
                                                        </div>
                                                    </dl> */}
                                                </div>
                                            </div>
                                            <div className='md:flex md:flex-col-reverse '>
                                                <p className='text-xs lg:w-[225px] md:w-[151px] text-start' src={meeting?.bilde?.url}>Program og påmelding <span className='pl-2'>➔</span></p>

                                            </div>
                                            {/* <Menu as="div" className="absolute top-6 right-0 xl:relative xl:top-auto xl:right-auto xl:self-center">
                                                <div>
                                                    <Menu.Button className="-m-2 flex items-center rounded-full p-2 text-gray-500 hover:text-gray-600">
                                                        <span className="sr-only">Open options</span>
                                                        
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
                                            </Menu> */}
                                        </a>
                                    </li>
                                );
                            })
                    ) : null}
                </ol>
                {meetingsToUse.length > 3 && <div className="w-full">
                    <div div className="w-full flex justify-between pt-10">
                        {/* previous button */}
                        <div className='h-14 w-14'>
                            <button
                                onClick={() => { goToPreviousPage() }}
                                className={` h-14 w-14   ${currentPage === 1 ? 'hidden' : ''}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none">
                                    <path d="M14.293 16.9496L8.58603 11.2426L14.293 5.53564L15.707 6.94964L11.414 11.2426L15.707 15.5356L14.293 16.9496Z" fill="#4E4E4E" />
                                </svg>
                            </button>
                        </div> 
                        {/* show page numbers */}
                        <div className="flex justify-center md:gap-8 gap-4">
                            {getPaginationGroup(sortedMeetings).map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => { changePage(e); } }
                                    className={`h-12 w-12 md:h-14 md:w-14 rounded-full ${item <= pages ? '' : 'hidden'} ${currentPage === item ? 'bg-[#4D4D4D] text-white' : 'text-black bg-[#f6a24a]'}`}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                        <div className='h-14 w-14'>
                            {/* next button */}
                            <button
                                onClick={() => { goToNextPage() }}
                                className={` h-14 w-14  ${currentPage === pages ? 'hidden' : ''}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none">
                                    <path d="M9.70697 16.9496L15.414 11.2426L9.70697 5.53564L8.29297 6.94964L12.586 11.2426L8.29297 15.5356L9.70697 16.9496Z" fill="#4E4E4E" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    {/* {meetings && meetings.length > 3 && (
                        <button
                            className="mt-4 bg-[#f6a24a]  hover:bg-[#ABA6FB] text-black px-6 py-4 rounded-md"
                            onClick={handleLoadMore}
                        >
                            Last mere
                        </button>
                    )} */}
                </div>}
            </div>
        );
    };

    function ShowAllMeetings() {
        return (
            <div>
                <ol className="mt-4 text-sm leading-6 lg:col-span-7 xl:col-span-8">
                    <h2 className='text-2xl'>sist Publisert </h2>
                    {loading && <p>Loading...</p>}
                    {error && <p>Error: {error.message}</p>}
                    {!loading && events && meetings && (
                        meetings
                            .map((meeting) => {
                                return (
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
                                                                {getDateAndTime(meeting['start-dato'])}
                                                            </time>
                                                            <time dateTime={meeting['start-dato']}>
                                                                {' - ' + getDateAndTime(meeting['slutt-dato'])}
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
                                );
                            })
                    )}
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
        )
    };

    function ShowOldEventsMeetings() {
        return (
            <div>
                <ol className="mt-4 text-sm leading-6 lg:col-span-7 xl:col-span-8">
                    <h2 className='text-2xl'>Tidligere Arrangementer </h2>
                    {loading && <p>Loading...</p>}
                    {error && <p>Error: {error.message}</p>}
                    {!loading && events && meetings && (
                        meetings
                            .map((meeting) => {
                                return (
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
                                                                {getDateAndTime(meeting['start-dato'])}
                                                            </time>
                                                            <time dateTime={meeting['start-dato']}>
                                                                {' - ' + getDateAndTime(meeting['slutt-dato'])}
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
                                );
                            })
                    )}
                </ol>
                {/* <div>
                    {meetings.length > 2 && (
                        <button
                            className="mt-4 bg-[#f6a24a]  hover:bg-[#ABA6FB] text-black px-6 py-4 rounded-md"
                            onClick={handleLoadMore}
                        >
                            Load More
                        </button>
                    )}
                </div> */}
            </div>
        )
    };
    

    function ShowMeetingsError() {
        return (
            <div className="mt-[25%] divide-y divide-gray-100 text-sm leading-6 lg:col-span-7 xl:col-span-8">
                <h2 className='text-2xl'>Sorry did not find any events </h2>
            </div>
        )
    };

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




    

    const isIncludedDate = (selectedDate) => {
        let flag = false;
        // Adjust the comparison to include the day after the meeting
        const selected = selectedDate instanceof Date ? selectedDate : new Date(selectedDate);
        if (Array.isArray(events?.items)) {
            events.items.filter((meeting) => !meeting._draft).forEach((meeting) => {
                const start = new Date(meeting['start-dato']);
                const end = new Date(meeting['slutt-dato']);
                // Adjust the comparison to include two days after the meeting
                end.setDate(end.getDate() + 1);
                start.setDate(start.getDate() + 1);
                if (isSameOrAfter(selected, start) && isSameOrBefore(selected, end)) {
                    flag = true;
                }
            });
        }
        return flag;
    };



    const handleClick = () => {
        if (loaded && window.innerWidth < 1025 && !mobileClicked) {
            setHover(true)
            setMobileClicked(true)

        } else {
            window.location.assign("https://www.vindel.no/hva-skjer/" + event?.slug)
            setMobileClicked(false)

        }
    }
    const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

    const getMousePosition = () => {
        return { x: window.event.clientX, y: window.event.clientY };
    };
    addEventListener('mousemove', (event) => { getMousePosition() });

    return (
        <div className="mt-10 text-center relative gap-20  flex lg:items-start items-center lg:flex-row flex-col container  mx-auto ">
            <div className="flex flex-col h-full w-[90%] lg:w-[80%] order-2 lg:order-1 ">
                {/* <h2 className='text-2xl'>Sortere:</h2>
                <div className='flex flex-row justify-between '>
                    <button
                        className="mt-4 bg-[#f6a24a]  hover:bg-[#ABA6FB] text-black grow max-w-[150px] py-4 rounded-md"
                        onClick={handleShowAllMeetings}
                    >
                        Sist Publisert
                    </button>
                    <button
                        className="mt-4 bg-[#f6a24a]  hover:bg-[#ABA6FB] text-black grow max-w-[150px] py-4 rounded-md"
                        onClick={handleFromTodayMeetings}
                    >
                        Fra idag
                    </button>
                    <button
                        className="mt-4 bg-[#f6a24a]  hover:bg-[#ABA6FB] text-black grow max-w-[150px] py-4 rounded-md"
                        onClick={handleShowOldEventsMeetings}
                    >
                        Tidligere Arrangementer
                    </button>
                </div> */}
                <RenderMeetings kalenderMeetings={meetings} meetings={sortedMeetings} visibleMeetings={visibleMeetings} kalenderFilterd={kalenderFilterd} />
                {/* {visibleShowAllMeetings && <ShowAllMeetings /> || null} 
                {visibleShowOldEventsMeetings && <ShowOldEventsMeetings /> || null}  */}
            </div>
            <div className="flex lg:sticky lg:top-12 lg:left-0 lg:right-0 w-[90%] lg:w-[30%] pt-8 items-start text-gray-900 order-1 lg:order-2">
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
                                            'lg:h-[2.5rem] h-[3.25rem] mx-auto flex items-center justify-center relative w-full hover:bg-gray-100 focus:z-10',
                                            day.isCurrentMonth ? 'bg-white' : 'bg-gray-100',
                                            (day.isSelected || day.isToday) && '',
                                            day.isSelected && 'text-white',
                                            !day.isSelected && day.isCurrentMonth && !day.isToday && 'text-gray-900',
                                            !day.isSelected && !day.isCurrentMonth && !day.isToday && 'text-gray-500',

                                            calendarDates[dayIdx - 1]?.isToday && !day.isToday && !day.isSelected && 'text-orange-600 font-semibold',
                                            dayIdx === 0 && 'rounded-tl-lg',
                                            dayIdx === 6 && 'rounded-tr-lg',
                                            dayIdx === calendarDates.length - 7 && 'rounded-bl-lg',
                                            dayIdx === calendarDates.length - 1 && 'rounded-br-lg',
                                        )}>
                                        {events && events?.items?.length > 0 && (
                                            <div className='flex items-center justify-center'>
                                                <div
                                                    className={classNames(
                                                        'mx-auto flex h-7 w-7 items-center justify-center rounded-full',
                                                        day?.isSelected && day?.isToday && ' text-red-500',
                                                        day?.isSelected && !day?.isToday && ' text-red-500'
                                                    )}>
                                                    {extractAndModifySubstring(day?.date)}
                                                </div>
                                                <div>

                                                    {isIncludedDate(day?.date) && (
                                                        <div
                                                            style={{
                                                                display: "grid",
                                                                gap: "1.5px",
                                                                gridTemplateColumns: "repeat(1,1fr)",
                                                                gridTemplateRows: `repeat(1, 1fr)`,
                                                            }}
                                                            className='aspect-square absolute left-0 right-0 top-0 lg:w-7 lg:h-7 w-10 h-10 mx-auto my-[0.35rem]'
                                                        >
                                                            <div
                                                                id='filter button'
                                                                onClick={() => handlerNewMeetings(day?.date)} // Pass the selected date as an argument
                                                                className='rounded-full  bg-[#F6A24A] lg:text-xs cursor-pointer flex items-center justify-center '
                                                            >
                                                                {extractAndModifySubstring(day?.date)}
                                                            </div>
                                                            
                                                        </div>)}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                        </div>
                    )}

                    <div className='m-4'>

                        <button
                            className="mt-4 bg-[#4D4D4D] text-white hover:text-black hover:bg-[#f6a24a] px-5 py-3 rounded-md"
                            onClick={handleClearFilter}
                        >
                            Nullstill filter
                        </button>

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