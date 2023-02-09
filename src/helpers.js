import { useEffect, useState } from "react"

export function getDaysInMonth(month, year) {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
        date.setDate(date.getDate() + 1);
        days.push({
            date: new Date(date).toISOString(),
            isCurrentMonth: true,
            isToday: date.toDateString() === new Date().toDateString(),
            isSelected: false
        });
    }
    return days; // array med dager i ISO format
}

export function getDayOfWeek(isoDate) {
    const date = new Date(isoDate);
    return date.getUTCDay(); // hvilken dag det er som et tall fra 0 til 6
}

export function getPreviousWeekdays(isoDate) {
    const date = new Date(isoDate);
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
    for (let i = dayOfWeek + 1; i < 7; i++) {
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
    const previousDays = getPreviousWeekdays(currentDays[0].date, events)
    const nextDays = getNextWeekdays(currentDays.at(-1).date, events)
    return [...previousDays, ...currentDays, ...nextDays] // array med dager i ISO format
}

export function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export const findStartIndex = (date, array) => {
    const day = getDayOfWeek(date)
    const weekIndex = array.findIndex((e) => e['slutt-dato'] === date)
    const week = Math.floor(weekIndex / 7)
    const month = new Date(date).getMonth()
    return [day, week, month]
};

export const findEndIndex = (date, array) => {
    const day = getDayOfWeek(date)
    const dayIndex = array.findIndex((e) => e.date.slice(0, 10) === date.slice(0, 10))
    const weekIndex = Math.ceil(dayIndex / 7) - 1
    const month = new Date(date).getMonth()
    return [day, weekIndex, month]
};

export const sortEvents = (events) => {
    return events.sort((a, b) => {
        if (a.start[0] === b.start[0]) {
            return a.start[1] - b.start[1];
        } else {
            return a.start[0] - b.start[0];
        }
    });
}

export const getOverlaps = (events) => {
    const compareWeeks = events.map((e) => {
        return getDaysBetween(e.start, e.end); // get all the days of the comparison event as an array
    })
    const eventsWithOverlap = events.map((event) => { // for each event 
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

    currentEventsData.map((event) => {
        if (event.multipleWeeks > 0 || event.multipleMonths > 0) {
            const newEventsArray = [];
            // todo - create a new event for every week returned here
            const newDatesArray = splitMultiWeeksWithMonthChange(event.start, event.end)
            newDatesArray[0].map((week) => {
                const isLastItem = newDatesArray.slice(-1)[0].toString() === week.toString()
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

            newArray.push(...newEventsArray)
        }
        else {
            newArray.push(event)
        }
    });

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

export function splitMultiWeeksWithoutMonthChange(start, end) {
    const weeks = [];
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