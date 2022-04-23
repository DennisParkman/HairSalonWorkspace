export enum TimePeriod 
{
    Once,
    Daily,
    Weekly,
    Monthly,
    Yearly
}

export class Unavailability 
{
    id?: number;
    stylistID: number;
    stylistName?: string;
    startDate: Date;
    endDate: Date;
    period: TimePeriod;

    static timePeriodToString(t: TimePeriod): string 
    {
        switch(t)
        {
            case TimePeriod.Once:
                return "Once";
            case TimePeriod.Daily:
                return "Daily"
            case TimePeriod.Weekly:
                return "Weekly";
            case TimePeriod.Monthly:
                return "Monthly";
            case TimePeriod.Yearly:
                return "Yearly";
            default:
                return "Error"
        }
    }
}