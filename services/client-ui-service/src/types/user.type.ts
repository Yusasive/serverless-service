import { Address } from "./address.type";

export interface SimpleUser {
    _id: number;
    email: string;
    userType: string;
    firstName: string | null;
    lastName: string | null;
    phone: string;
}

export interface User extends SimpleUser{
    address: Address[];
    company: string;
    local: string;
    boothPreference: string;
    boothType: string;
    profileImage: string;
    twoFactorEnabled: boolean;
}