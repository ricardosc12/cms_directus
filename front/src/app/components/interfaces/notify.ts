import { User } from "./user"

export interface Notify {
    id: number;
    timestamp: string;
    status: "pending" | "approve" | "rejected";
    subject: "invite" | "request";
    message: string | null;
    collection: string | null;
    item: string | null;
    recipient: User;
    sender: User;
}