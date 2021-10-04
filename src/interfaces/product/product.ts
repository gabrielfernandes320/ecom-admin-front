import { DateTime } from "luxon";
export interface IProduct {
    id: string;
    name: string;
    description: string;
    price: number;
    enabled: boolean;
    createdAt: DateTime;
    updatedAt: DateTime;
    deletetAt?: DateTime;
}
