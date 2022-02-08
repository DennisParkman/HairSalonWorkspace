export class Stylist 
{
    name!: string;
    id!: number;
    level!: number;
    bio!: string;

    Stylist(name: string, id: number, level: number, bio: string) 
    {
        this.name = name;
        this.id = id;
        this.level = level;
        this.bio = bio;
    }
}