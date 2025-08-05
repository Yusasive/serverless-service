export enum UserType {
    Attendee = 'ATTENDEE',
    Admin = 'ADMIN',
    Exhibitor = 'EXHIBITOR',
    Organizer = 'ORGANIZER',
    Organizer_Staff = 'ORGANIZER_STAFF',
    Super_Admin = 'SUPER_ADMIN'
}

export interface Address {
    id: number;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    country: string;
    user_id: number;
    is_primary: boolean;
    post_code: string;
}

export interface SimpleUser {
    user_id: number;
    email: string;
    userType: string;
    first_name: string | null;
    last_name: string | null;
    phone: string;
}

export interface User extends SimpleUser {
    user_type: UserType;
    verified: boolean;
    is_active: boolean;
    profile_pic?: string | null;
    verification_code?: number;
    expiry?: Date;
    gender?: string;
    stripe_id?: string;
    payment_id?: string;
    parent_exhibitor_id?: number;
    address: Address[];
    parentExhibitor?: User;
    managedStaff?: User[];

    // Exhibitor specific fields
    company?: string | null;
    rating?: number;
    status?: string;
    pin_code?: string;
    lat?: number;
    lng?: number;

    // Staff specific fields (Organizer, Organizer_Staff, Super_Admin)
    ticket_number?: string;
    qr_code?: string;
    download?: string;
    staff_id?: string;
}


  