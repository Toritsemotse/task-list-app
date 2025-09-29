// for displaying user information
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

//for handling auth requests
export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}