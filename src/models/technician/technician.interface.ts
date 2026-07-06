export interface IupdateTechnicianProfile {
    name?: string;
    phone?: string;
    address?: string;
    avatarUrl?: string;
    skills?: string[];
    hourlyRate?: number;
    bio?: string;
    experienceYrs?: number;
    location?: string;
}

export interface ICreateService {
    title: string;
    description: string;
    price: number;
    durationMins: number;
    category : string
}