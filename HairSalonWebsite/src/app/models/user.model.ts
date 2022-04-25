export enum UserRole
{
    Manager,
    Stylist,
    Receptionist,
    Client
}

export class User 
{
    id?: number;
    username: string;
    password: string;
    role: UserRole;

    static roleToString(r: UserRole): string 
    {
        switch(r)
        {
            case UserRole.Manager:
                return "Manager";
            case UserRole.Stylist:
                return "Stylist";
            case UserRole.Receptionist:
                return "Receptionist";
            case UserRole.Client:
                return "Client";
            default:
                return "Error"
        }
    }
}
