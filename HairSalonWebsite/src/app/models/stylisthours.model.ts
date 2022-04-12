export enum WeekDay
{
    Sunday,
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday
}

export class StylistHours
{
    id?: number;
    stylistID: number;
    day: WeekDay;
    startTime: string;
    endTime: string;

    static weekDayToString(t: WeekDay): string 
    {
        switch(t)
        {
            case WeekDay.Monday:
                return "Monday";
            case WeekDay.Tuesday:
                return "Tuesday"
            case WeekDay.Wednesday:
                return "Wednesday";
            case WeekDay.Thursday:
                return "Thursday";
            case WeekDay.Friday:
                return "Friday";
            case WeekDay.Saturday:
                return "Saturday"
            case WeekDay.Sunday:
                return "Sunday"
            default:
                return "I was an adventurer like you once, then I took an arrow to the knee."
        }
    }
}