import { User } from "./user";

export interface Time {
    id: string;
    nome: string;
    owner: User;
    membros: string;
}