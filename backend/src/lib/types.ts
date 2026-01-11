export interface User {
    id: number;
    email: string;
    password?: string;
    created_at: Date;
    updated_at: Date;
}

export interface Expense {
    id: number;
    user_id: number;
    name: string;
    cost: number;
    is_income: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface Income {
    id: number;
    user_id: number;
    amount: number;
    created_at: Date;
    updated_at: Date;
}

export interface JWTPayload {
    userId: number;
    email: string;
}
