import { useEffect, useState } from "react"

/*The getDaysInMonth function takes two arguments month 
and year and returns an array of dates of all the days 
in the specified month and year.

It starts by creating a date object using the new Date 
constructor with year, month, and 1 as arguments, which 
represents the first day of the specified month and year.

Then, the function enters a while loop that continues until 
the date object's getMonth method returns a value that is no 
longer equal to month. For each iteration of the loop, the function 
pushes the date object converted to an ISO string format using the 
toISOString method into the days array.

Finally, the date object's setDate method is used to increase the date 
by 1 day for each iteration of the loop, allowing the loop to continue 
until all the days in the specified month and year have been added to 
the days array.*/ 
export function getDaysInMonth(month, year, selectedDate) {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
        date.setDate(date.getDate() + 1);
        let isSelected = false;
        if (selectedDate) isSelected = (date.toDateString() == new Date(selectedDate).toDateString());
        days.push({date:new Date(date).toISOString(), isCurrentMonth: true, isToday: date.toDateString() === new Date().toDateString(), isSelected: isSelected});
    }
    return days; // array med dager i ISO format
}
/*The getDayOfWeek function takes a single argument isoDate, which is a 
date in ISO string format. The function returns the day of the week 
(a number between 0 and 6) for the specified date.

It starts by creating a date object using the new Date constructor with the 
isoDate argument. Then, the function returns the value of the date object's 
getUTCDay method, which returns an integer representing the day of the week 
in Universal Time (UTC). The values are from 0 (Sunday) to 6 (Saturday).*/
export function getDayOfWeek(isoDate) {
    const date = new Date(isoDate);
    return date.getUTCDay(); // hvilken dag det er som et tall fra 0 til 6
}

/* The getPreviousWeekdays function takes a single argument isoDate, which 
is a date in ISO string format, and returns an array of the ISO string dates 
of the previous weekdays (Monday to Sunday) relative to the specified date.

It starts by creating a date object using the new Date constructor with the 
isoDate argument. Then, it calls the getDayOfWeek function to get the day of 
the week (0 to 6) for the specified date, which is stored in the dayOfWeek variable.

Next, the function initializes an empty array weekdays to store the ISO string dates 
of the previous weekdays. The function then enters a for loop that starts from 
dayOfWeek - 1 and decrements i for each iteration until i is greater than or equal to 0.

For each iteration of the loop, the function creates a previousDate object using the new 
Date constructor with the date object as the argument. The function then uses the previousDate 
object's setDate method to decrement the date by (dayOfWeek - i) days to get the previous weekday. 
The previousDate object is then converted to an ISO string format using the toISOString method and 
is pushed into the weekdays array.

Finally, the function returns the weekdays array containing the ISO string dates of the previous weekdays.*/  
export function getPreviousWeekdays(isoDate) {
    const date = new Date(isoDate);
    console.log('iso ', isoDate)
    const dayOfWeek = getDayOfWeek(isoDate);
    const weekdays = [];
    for (let i = dayOfWeek - 1; i >= 0; i--) {
        const previousDate = new Date(date);
        previousDate.setDate(previousDate.getDate() - (dayOfWeek - i));
        weekdays.push({date:previousDate.toISOString(), isCurrentMonth: false, isToday: previousDate.toDateString() === new Date().toDateString()});
    }
    return weekdays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());; // array med dager i ISO format
}

/* The getNextWeekdays function takes a single argument isoDate, which is a date in ISO string format, 
and returns an array of the ISO string dates of the next weekdays (Monday to Sunday) relative to the specified date.

It starts by creating a date object using the new Date constructor with the isoDate argument. Then, 
it calls the getDayOfWeek function to get the day of the week (0 to 6) for the specified date, which 
is stored in the dayOfWeek variable.

Next, the function initializes an empty array weekdays to store the ISO string dates of the next weekdays. 
The function then enters a for loop that starts from dayOfWeek + 1 and increments i for each iteration until 
i is less than 7.

For each iteration of the loop, the function creates a nextDate object using the new Date constructor with 
the date object as the argument. The function then uses the nextDate object's setDate method to increment 
the date by (i - dayOfWeek) days to get the next weekday. The nextDate object is then converted to an ISO 
string format using the toISOString method. The function pushes an object into the weekdays array that has 
a key of date and value of the ISO string, and a key of isCurrentMonth with a value of false.

Finally, the function returns the weekdays array containing the ISO string dates and the isCurrentMonth 
status of the next weekdays.*/
export function getNextWeekdays(isoDate) {
    const date = new Date(isoDate);
    const dayOfWeek = getDayOfWeek(isoDate);
    const weekdays = [];
    for (let i = dayOfWeek + 1; i < 7; i++) {
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + (i - dayOfWeek));
        weekdays.push({date:nextDate.toISOString(), isCurrentMonth: false, isToday: nextDate.toDateString() === new Date().toDateString()});
    }
    return weekdays; // array med dager i ISO format
}



export function getCalenderDays(year, month, selectedDate) {
    const currentDays = getDaysInMonth(month, year, selectedDate);
    const previousDays = getPreviousWeekdays(currentDays[0].date)
    const nextDays = getNextWeekdays(currentDays.at(-1).date)
    return [...previousDays, ...currentDays, ...nextDays] // array med dager i ISO format
}




export const days = [
    // todo: make this automatic 

    // step 1: ha oversikt over hvilken måned er selected (done)
    // step 2: skrive funksjon som gir oss alle dager i denne måneden som en array (done)
    // step 3: finne ut hvilken dag er første dag (ex: lørdag) og gi den en verdi fra 0 til 6 (done)

    // step 4: få datoene i siste måned, etterpå velger de siste X dagene i siste måned slik at vi har akkurat de vi trenger (done)
    // step 5: gjøre det samme for neste måned (det ar automatisk trur e)
    // step 6: legge sammen alle 3 arrays og printe dem ut - array 1 har bare dato, array 2 har iscurrentmonth true, array 3 har også bare dato

    { date: '2021-12-27' },
    { date: '2021-12-28' },
    { date: '2021-12-29' },
    { date: '2021-12-30' },
    { date: '2021-12-31' },
    { date: '2022-01-01', isCurrentMonth: true },
    { date: '2022-01-02', isCurrentMonth: true },
    { date: '2022-01-03', isCurrentMonth: true },
    { date: '2022-01-04', isCurrentMonth: true },
    { date: '2022-01-05', isCurrentMonth: true },
    { date: '2022-01-06', isCurrentMonth: true },
    { date: '2022-01-07', isCurrentMonth: true },
    { date: '2022-01-08', isCurrentMonth: true },
    { date: '2022-01-09', isCurrentMonth: true },
    { date: '2022-01-10', isCurrentMonth: true },
    { date: '2022-01-11', isCurrentMonth: true },
    { date: '2022-01-12', isCurrentMonth: true, isToday: true },
    { date: '2022-01-13', isCurrentMonth: true },
    { date: '2022-01-14', isCurrentMonth: true },
    { date: '2022-01-15', isCurrentMonth: true },
    { date: '2022-01-16', isCurrentMonth: true },
    { date: '2022-01-17', isCurrentMonth: true },
    { date: '2022-01-18', isCurrentMonth: true },
    { date: '2022-01-19', isCurrentMonth: true },
    { date: '2022-01-20', isCurrentMonth: true },
    { date: '2022-01-21', isCurrentMonth: true },
    { date: '2022-01-22', isCurrentMonth: true, isSelected: true },
    { date: '2022-01-23', isCurrentMonth: true },
    { date: '2022-01-24', isCurrentMonth: true },
    { date: '2022-01-25', isCurrentMonth: true },
    { date: '2022-01-26', isCurrentMonth: true },
    { date: '2022-01-27', isCurrentMonth: true },
    { date: '2022-01-28', isCurrentMonth: true },
    { date: '2022-01-29', isCurrentMonth: true },
    { date: '2022-01-30', isCurrentMonth: true },
    { date: '2022-01-31', isCurrentMonth: true },
    { date: '2022-02-01' },
    { date: '2022-02-02' },
    { date: '2022-02-03' },
    { date: '2022-02-04' },
    { date: '2022-02-05' },
    { date: '2022-02-06' },
]

export function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

