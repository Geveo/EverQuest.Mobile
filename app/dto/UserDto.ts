import { BaseDto } from "./BaseDto";

export interface UserDto extends BaseDto{
    AccessLevel: string;
    ConcurrencyKey: string;
    CreatedOn: string;
    Email: string;
    Id: number;
    ImageURL: string;
    IsActive: number;
    JoinedOn: string;
    LastLogOn: string;
    LastUpdatedOn: string;
    Name: string;
    Source: string;
}