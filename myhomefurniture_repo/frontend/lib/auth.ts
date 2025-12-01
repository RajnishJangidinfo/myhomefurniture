import { API_ENDPOINTS } from './config';

export interface RegisterData {
    username: string;
    password: string;
}

export interface LoginData {
    username: string;
    password: string;
}

export interface AuthResponse {
    token: string;
}

export const authService = {
    async register(data: RegisterData): Promise<{ message: string }> {
        try {
            const response = await fetch(API_ENDPOINTS.register, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const text = await response.text();
            let result;
            try {
                result = text ? JSON.parse(text) : {};
            } catch {
                result = { message: text || 'Unknown error occurred' };
            }

            if (!response.ok) {
                throw new Error(result.message || result.title || 'Registration failed');
            }

            return result;
        } catch (error) {
            throw error;
        }
    },

    async login(data: LoginData): Promise<AuthResponse> {
        try {
            const response = await fetch(API_ENDPOINTS.login, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const text = await response.text();
            let result;
            try {
                result = text ? JSON.parse(text) : {};
            } catch {
                result = { message: text || 'Unknown error occurred' };
            }

            if (!response.ok) {
                throw new Error(result.message || result.title || 'Login failed');
            }

            // Store token in localStorage
            if (typeof window !== 'undefined' && result.token) {
                localStorage.setItem('token', result.token);
            }

            return result;
        } catch (error) {
            throw error;
        }
    },

    logout() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
        }
    },

    getToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    },

    isAuthenticated(): boolean {
        return !!this.getToken();
    },

    async getProfile() {
        const token = this.getToken();
        if (!token) throw new Error('No token found');

        const response = await fetch(API_ENDPOINTS.login.replace('login', 'profile'), {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch profile');
        return response.json();
    },

    async updateProfile(data: any) {
        const token = this.getToken();
        if (!token) throw new Error('No token found');

        const response = await fetch(API_ENDPOINTS.login.replace('login', 'profile'), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Failed to update profile');
        return response.json();
    },

    async getAllUsers() {
        const token = this.getToken();
        if (!token) throw new Error('No token found');

        const response = await fetch(API_ENDPOINTS.login.replace('login', 'users'), {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch users');
        return response.json();
    },

    async updateUserById(id: string, data: any) {
        const token = this.getToken();
        if (!token) throw new Error('No token found');

        const response = await fetch(API_ENDPOINTS.login.replace('login', `users/${id}`), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Failed to update user');
        return response.json();
    },

    async deleteUser(id: string) {
        const token = this.getToken();
        if (!token) throw new Error('No token found');

        const response = await fetch(API_ENDPOINTS.login.replace('login', `users/${id}`), {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to delete user');
        return response.json();
    }
};
