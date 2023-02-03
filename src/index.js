import './styles.css'

import { Menu, Transition } from '@headlessui/react'
import React, { Fragment, useEffect, useState } from 'react'
import { classNames, days, getCalenderDays, useCalendar } from './config'

import ReactDOM from 'react-dom'
import { fetchEvents } from './utils/fetchEvents'
import useSWR from 'swr'

const App = () => {
    const { data, isLoading } = useSWR('events', fetchEvents())
    useEffect(() => { console.log('data: ', data) }, [data])
    const [year, setYear] = useState(new Date().getFullYear())
    const [month, setMonth] = useState(new Date().getMonth())
    const [calendarDates, setCalendarDates] = useState()
    const [selectedDate, setSelectedDate] = useState()

    function nextMonth() {
        if (month >= 0 && month < 11){
          setMonth(month + 1);
        } else {
          setYear(year + 1);
          setMonth(0);
        }
      }

      function prevMonth() {
        if (month > 0 && month <= 11){
          setMonth(month - 1);
        } else {
          setYear(year - 1);
          setMonth(11);
        }
      }

    
    useEffect(() => {
        setCalendarDates(getCalenderDays(year, month, selectedDate))
    }, [month, year, selectedDate])
console.log(calendarDates)
    return (

        <div className='w-full flex justify-center'>
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
                            <div className="isolate w-full mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200">
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
                                            dayIdx === days.length - 7 && 'rounded-bl-lg',
                                            dayIdx === days.length - 1 && 'rounded-br-lg'
                                        )}
                                        onClick={()=>setSelectedDate(day.date)}
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
                            {/* <button
                                type="button"
                                className="mt-8 w-full rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Add event
                            </button> */}
                        </div>

                    </div>
                    <ol className="mt-4 divide-y divide-gray-100 text-sm leading-6 lg:col-span-7 xl:col-span-8">
                    {!isLoading && data && data.items.map((meeting) => (
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
        </div>
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