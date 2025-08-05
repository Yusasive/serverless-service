export type Response<T> = {
    data: T;
    message: string;
}

// For nested API responses like booth service
export type NestedResponse<T> = {
    message: string;
    data: {
        success: boolean;
        data: T;
    };
}
