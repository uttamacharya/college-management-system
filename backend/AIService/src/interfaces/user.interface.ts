export interface UserContext {
    id: string;
    name: string;
    email: string;
    role: string;

    attendance?: number;

    marks?: {
        subject: string;
        score: number;
    }[];
}