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
    stylistName: string;
    startDate: Date;
    endDate: Date;
    period: TimePeriod;
}