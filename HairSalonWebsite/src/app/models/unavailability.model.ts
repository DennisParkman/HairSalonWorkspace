enum TimePeriod 
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
    startDate: Date;
    endDate: Date;
    period: TimePeriod;
}