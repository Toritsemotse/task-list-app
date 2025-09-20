export interface User {
    id: string;
    name: string;
    // email: string;
}

export interface Task {
    id: string;
    title: string;
    status: 'in_progress' | 'completed';
    assignee: string;
    due_date: string; 
    details: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}