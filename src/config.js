import { useEffect, useState } from "react"

// todo: bruk den nye dataen til aa besteme hvis isSelected skal vaere true eller false
export function getDaysInMonth(month, year) {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
        date.setDate(date.getDate() + 1);
        days.push({
            date:new Date(date).toISOString(), 
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

// todo: bruk den nye dataen til aa besteme hvis isSelected skal vaere true eller false
export function getPreviousWeekdays(isoDate) {
    const date = new Date(isoDate);
    console.log('iso ', isoDate)
    const dayOfWeek = getDayOfWeek(isoDate);
    const weekdays = [];
    for (let i = dayOfWeek - 1; i >= 0; i--) {
        const previousDate = new Date(date);
        previousDate.setDate(previousDate.getDate() - (dayOfWeek - i));
        weekdays.push({
            date:previousDate.toISOString(), 
            isCurrentMonth: false, 
            isToday: previousDate.toDateString() === new Date().toDateString(),
            isSelected: false
        });
    }
    return weekdays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());; // array med dager i ISO format
}

// todo: bruk den nye dataen til aa besteme hvis isSelected skal vaere true eller false - er dayOfWeek i den nye arrayen?
export function getNextWeekdays(isoDate) {
    const date = new Date(isoDate);
    const dayOfWeek = getDayOfWeek(isoDate);
    const weekdays = [];
    for (let i = dayOfWeek + 1; i < 7; i++) {
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + (i - dayOfWeek));
        weekdays.push({
            date:nextDate.toISOString(),
            isCurrentMonth: false, 
            isToday: nextDate.toDateString() === new Date().toDateString(),
            isSelected: false
        });
    }
    return weekdays; // array med dager i ISO format
}


// todo: faa inn en array med alle selected datoer fra API-response 
// todo: gi tilgang til getDaysInMonth, getPreviousWeekdays, getNextWeekdays til den dataen
export function getCalenderDays(year, month, events) {
    const currentDays = getDaysInMonth(month, year, events);
    const previousDays = getPreviousWeekdays(currentDays[0].date, events)
    const nextDays = getNextWeekdays(currentDays.at(-1).date, events)
    return [...previousDays, ...currentDays, ...nextDays] // array med dager i ISO format
}




export function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

