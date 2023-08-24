import { useEffect, useState } from "react"

export function getDaysInMonth(month, year) {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
        date.setDate(date.getDate() + 1);
        days.push({
            date: new Date(date).toISOString(),
            isCurrentMonth: true,
            isToday: date.toLocaleDateString() === new Date().toLocaleDateString(),
            isSelected: false
        });
    }
    return days; // array med dager i ISO format
}

export function getDayOfWeek(isoDate) {
    const date = new Date(isoDate);
    const USday = date.getDay(); // hvilken dag det er som et tall fra 0 til 6
    return (USday - 1 + 6) % 7
}

export function getPreviousWeekdays(isoDate) {
    const date = new Date(isoDate); // the first date in the next month
    const dayOfWeek = getDayOfWeek(isoDate);
    const weekdays = [];

    for (let i = dayOfWeek - 1; i >= 0; i--) {
        const previousDate = new Date(date);
        previousDate.setDate(previousDate.getDate() - (dayOfWeek - i));
        weekdays.push({
            date: previousDate.toISOString(),
            isCurrentMonth: false,
            isToday: previousDate.toDateString() === new Date().toDateString(),
            isSelected: false
        });
    }
    return weekdays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());; // array med dager i ISO format
}

export function getNextWeekdays(isoDate) {
    const date = new Date(isoDate);
    const dayOfWeek = getDayOfWeek(isoDate);

    const weekdays = [];
    for (let i = dayOfWeek + 1; i <= 6; i++) {
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + (i - dayOfWeek));
        weekdays.push({
            date: nextDate.toISOString(),
            isCurrentMonth: false,
            isToday: nextDate.toDateString() === new Date().toDateString(),
            isSelected: false
        });
    }
    return weekdays; // array med dager i ISO format
}

export function getCalenderDays(year, month, events) {
    const currentDays = getDaysInMonth(month, year, events);
    const previousDays = getPreviousWeekdays(currentDays[0].date)
    const nextDays = getNextWeekdays(currentDays.at(-1).date)
    return [...previousDays, ...currentDays, ...nextDays] // array med dager i ISO format
}

export function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export const findFirstDayIndex = (isoDate) => {
    const date = new Date(isoDate);
    const month = date.getMonth();
    const year = date.getFullYear();

    // Calculate the day index (0 for Sunday, 1 for Monday, etc.)
    const dayIndex = (date.getDay() + 6) % 7;

    // Calculate the week index
    const firstDayOfMonth = (new Date(year, month, 1).getDay() - 1 + 6) % 7;

    const dayOfMonth = date.getDate();
    const isInTheSameWeek = (7 - firstDayOfMonth) > dayOfMonth
    let index
    if (isInTheSameWeek) {
        index = 0;
    } else {
        const daysLeftInFirstWeek = 7 - firstDayOfMonth
        const daysLeftAfterFirstWeek = dayOfMonth - daysLeftInFirstWeek

        index = Math.floor((7 + daysLeftAfterFirstWeek) / 7)
    }
    

    // // If the first day of the month is a Sunday, and the date is in the first week,
    // // the week index should be 0, not 1
    // if (firstDayOfMonth === 0 && dayOfMonth <= 7) {
    //     index = 0;
    // }

    // Calculate the month index (0 for January, 1 for February, etc.)
    const monthIndex = month;

    // Return the result as an array
    return [dayIndex, index, monthIndex];
}

export const sortEventsByStart = (events) => {
    return events.sort((a, b) => {
        if (a.start[0] === b.start[0]) {
            return a.start[1] - b.start[1];
        } else {
            return a.start[0] - b.start[0];
        }
    });
}

export const sortEventsByLength = (events) => {
    return events.sort((a, b) => b.days - a.days)
}

export const getOverlaps = (events) => {
    const compareWeeks = events.map((e) => {
        return { week: e, days: getDaysBetween(e.start, e.end) }; // get all the days of the comparison event as an array
    })
    const eventsWithOverlap = events.map((event) => { // for each event 
        let overlapCount = -1; // start with 0 overlaps (-1 because it will always match itself)
        let overlapMax = 0; // start with 0 max overlaps
        let overlapsWith_slugs = []; // array of events it overlaps with
        let eventDays = getDaysBetween(event.start, event.end); // get all the days of the event as an array
        compareWeeks.map((compareWeek) => {
            const anyDaysMatch = compareWeek.days.some(compareWeekDay =>
                eventDays.some(eventDay => compareWeekDay.toString() === eventDay.toString())
            ); // check if any of the days match
            if (anyDaysMatch) {
                compareWeek.days.forEach(compareWeekDay => { // for each day in the comparison week
                    eventDays.forEach(eventDay => { // for each day in the current event
                        if (compareWeekDay.toString() === eventDay.toString()) {
                            const day_overlap = eventDays.filter((e) => e.toString() === eventDay.toString()).length
                            if (day_overlap > overlapMax) {
                                overlapMax = day_overlap
                            }
                        }
                    })
                }
                )
                overlapCount++
                overlapsWith_slugs.push(compareWeek.week.slug)
            }; // if any of them match, add 1 to overlapCount && add the event to the overlapsWith array

        })
        return {
            ...event,
            overlaps: overlapCount,
            overlapsWith: overlapsWith_slugs.filter((e) => e !== event.slug),
            overlapMax: overlapMax
        }; // return the event with the correct overlapCount
    })
    return eventsWithOverlap
}

export const getDaysBetween = (start, end) => {
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
                for (let j = 0; j <= end[0]; j++) {
                    days.push([j, i]);
                }
                break;
        }
    }
    return days
}

export const getMultipleWeeks = (events) => {
    const eventsWithMW = events.map((event) => {
        return { ...event, multipleWeeks: event.end[1] - event.start[1] };
    })
    return eventsWithMW;
}

export const getMultipleMonths = (events) => {
    const eventsWithMM = events.map((event) => {
        return { ...event, multipleMonths: event.end[2] - event.start[2] };
    })
    return eventsWithMM;
}

export function splitMultiWeeks(currentEventsData) {
    const newArray = []
    
    
    currentEventsData && currentEventsData.map((event) => {
        if (event.multipleWeeks > 0 || event.multipleMonths > 0) {
            
            const newEventsArray = [];
            const newDatesArray = splitMultiWeeksWithMonthChange(event.start, event.end)
            newDatesArray[0].map((week) => {
                const isLastItem = newDatesArray[0][newDatesArray[0].length - 1].toString() === week.toString()
                const isFirstItem = newDatesArray[0][0].toString() === week.toString()
                const newSplitEvent = {
                    ...event,
                    start: week[0],
                    end: week[1],
                    multipleWeeks: 0,
                    multipleMonths: 0,
                    squaredEnd: !isLastItem,
                    squaredStart: !isFirstItem,
                    totalDays: event.days,
                    days: week[1][0] - week[0][0] + 1 // endDay - startDay + 1
                }
                newEventsArray.push(newSplitEvent)
            }) 
            newArray.push( ...newEventsArray)

        }
        else {
            newArray.push(event)
        }
        
    }
    );

    return newArray;
}

export function splitMultiWeeksWithMonthChange(start, end) {
    const weeks = [];
    for (let i = start[2]; i <= end[2]; i++) {
        const newStart = [start[0], start[1], i];
        const newEnd = [end[0], end[1], i];
        const newWeeks = splitMultiWeeksWithoutMonthChange(newStart, newEnd)
        weeks.push([...newWeeks]);
    }
    return weeks
}

export function splitMultiWeeksWithoutMonthChange(start, end, index = 0) {
    const weeks = [];
    let currentIndex = index; // saves the index of the week we are currently on (used for finding the right index when printing)
    for (let i = start[1]; i <= end[1]; i++) {
        let week;
        if (i === start[1]) {
            week = [[start[0], i], [6, i]];
        } else if (i === end[1]) {
            week = [[0, i], [end[0], i]];
        } else {
            week = [[0, i], [6, i]];
        }
        weeks.push(week);
    }
    return weeks;
}

export function getDayAndTime(date) {
    const dateObject = new Date(date);
    const options = { weekday: 'long', hour: 'numeric', minute: 'numeric' };
    return dateObject.toLocaleString('no-NO', options);
}

export function getDateAndTime(date) {
    const dateObject = new Date(date);
    const options = { day: 'numeric', month: 'long', hour: 'numeric', minute: 'numeric' };
    return dateObject.toLocaleString('no-NO', options);
}


export function getNorwegianMonthName(monthIndex) {
    const norwegianMonthNames = [
        "Januar", "Februar", "Mars", "April", "Mai", "Juni",
        "Juli", "August", "September", "Oktober", "November", "Desember"
    ];
    return norwegianMonthNames[monthIndex];
}

export const findHowManyDays = (startDato, sluttDato) => {
    const startDatoen = new Date(startDato)
    const sluttDatoen = new Date(sluttDato)

    const differenceInTime = sluttDatoen.getTime() - startDatoen.getTime(); //finner ut hvor mye tid som er mellom slutt dato og start dato
    const differenceInDays = differenceInTime / (1000 * 3600 * 24); // finner ut hvor mange dager det er mange dager mellom slutt og start dato

    return Math.ceil(differenceInDays) // return days
};

export const checkOverlaps = (event, events, currentIndex, tempEvents) => {
    let j = currentIndex + 1
    event.overlapsWith.forEach((overlapEvent_slug) => {
        const overlapEvent = events.find((e) => e.slug === overlapEvent_slug)
        const overlap_isAlreadyInTemp = tempEvents.some((e) => e.slug === overlapEvent_slug) // if the overlap event is not in tempEvents, we should add it
        if (!overlap_isAlreadyInTemp) {
            tempEvents.push(
                {
                    ...overlapEvent,
                    overlapIndex: j,
                }
            )
            j++
        }
    })
}

export const createOverlapIndexes = (event_array) => {
    // const events = event_array.sort((a, b) => b.days - a.days)
    const events = event_array
    const tempEvents = []

    const eventsWithOverlap = events.map((event) => {
        let currentIndex = 0;

        if (event.overlaps === 0) {
            return {
                ...event,
                overlapIndex: 0
            }
        }
        const isAlreadyinTemp_event = tempEvents.some((e) => e.slug === event.slug) // if the event is not in tempEvents, we should return it with the current index
        if (!isAlreadyinTemp_event) {
            if (event.overlaps > 0) {
                checkOverlaps(event, events, currentIndex, tempEvents)
            }
            return (
                {
                    ...event,
                    overlapIndex: currentIndex
                }
            )
        }
        else {
            // if (event.overlaps > 0) {
            //     checkOverlaps(event, events, currentIndex - 1, tempEvents)
            // }
            return {                                                           // else return it with the index from tempEvents
                ...event,
                overlapIndex: tempEvents.find((e) => e.slug === event.slug).overlapIndex
            }
        }
    })

    // return eventIndex;
    return eventsWithOverlap
}

export function createLayers(events) {
    const sortedEvents = sortEventsByLength(events)
    const _Events = sortedEvents.map((e) => ({ ...e, layer: null }))

    const layer_results = createLayerIndex(_Events)

    // create maxLayer - the maximum number of layers per day for each day


    // for each day in my event, find how many other events are on that day, and store the highest result
    const results = createMaxLayer(layer_results)

    return results;
}

function createLayerIndex(_Events) {
    const layer_results = _Events.map((event) => {

        // finding all layers 
        const compareEvents_layers = _Events.map((e) => {
            if (event.overlapsWith.some((c) => c === e.slug)) return e.layer
        }).filter((e) => e !== undefined)

        const filteredLayers = compareEvents_layers.filter((e) => e !== null)
        const ComparisonLength = filteredLayers.length

        // // if no other layers
        if (compareEvents_layers.filter((e) => e !== null).length === 0) {
            _Events[_Events.findIndex((e) => e.slug === event.slug)].layer = 0 // also update sortEvents event
            return {
                ...event,
                layer: 0
            }
        }

        // if there are other layers - place in the best layer
        else {
            for (let i = 0; i < (ComparisonLength - 1); i++) {
                if (!filteredLayers.includes(i)) {
                    _Events[_Events.findIndex((e) => e.slug === event.slug)].layer = i // also update sortEvents event
                    return {
                        ...event,
                        layer: i
                    }
                }
            }
            // if still not placed, create new layer
            _Events[_Events.findIndex((e) => e.slug === event.slug)].layer = ComparisonLength // also update sortEvents event
            return {
                ...event,
                layer: ComparisonLength
            }
        }
    })
    return layer_results
}

function createMaxLayer(layer_results) {
    const eventsDays = layer_results.map((e) => { return { week: e, days: getDaysBetween(e.start, e.end) } }) // a reference array of all the days for each event
    const results = layer_results.map((result, index) => {
        let maxLayer = 0

        const myDays = getDaysBetween(result.start, result.end)

        myDays.forEach((day) => { // for each day of mine
            let dayMax = 0

            result.overlapsWith.forEach((this_overlap) => { // for each slug it overlaps with
                // .week: full obj of overlap event
                // .days: all days of overlap event
                const overlapEvent = eventsDays.find((e) => e.week.slug === this_overlap)

                // check if on the day in question, if that event overlaps with the current event
                const isOverlapping = overlapEvent.days.some((d) => d.toString() === day.toString())

                // if it does, increment the count for that day in my event - else continue
                if (isOverlapping === true) {
                    dayMax++
                }
            })
            maxLayer = Math.max(maxLayer, dayMax)
        })

        return {
            ...result,
            maxLayer: maxLayer
        }
    })
    return results
}


export function getNorwegianDate({ startDate, endDate, differentWeek = false, differentMonth = false }) {
    const date = new Date(startDate);
    const end = new Date(endDate);
    const days = [
        'søndag',
        'mandag',
        'tirsdag',
        'onsdag',
        'torsdag',
        'fredag',
        'lørdag',
    ];
    const months = [
        'januar',
        'februar',
        'mars',
        'april',
        'mai',
        'juni',
        'juli',
        'august',
        'september',
        'oktober',
        'november',
        'desember',
    ];

    const dayOfWeek = days[date.getUTCDay()];
    const day = date.getUTCDate();
    const month = months[date.getUTCMonth()];
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const dayOfWeek_end = days[end.getUTCDay()];
    const day_end = end.getUTCDate();
    const month_end = months[end.getUTCMonth()];
    const hours_end = end.getUTCHours().toString().padStart(2, "0");
    const minutes_end = end.getUTCMinutes().toString().padStart(2, "0");

    if (!endDate) {
        return `${dayOfWeek}, ${day}. ${month} - kl ${hours}.${minutes}`;
    } else if (differentWeek && !differentMonth) {
        return [`fra: ${dayOfWeek}, ${day}. ${month} kl ${hours}.${minutes}`, `til: ${dayOfWeek_end}, ${day_end}. ${month_end} kl ${hours_end}.${minutes_end}`];
    } else if (!differentMonth) {
        return [`fra ${dayOfWeek} ${day}. ${month}`, `til ${dayOfWeek_end} ${day_end}. ${month_end}`];
    } else {
        return [`fra ${dayOfWeek} ${day}. ${month}`, `til ${dayOfWeek_end} ${day_end}. ${month_end}`];
    }
}