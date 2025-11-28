export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5258';

export const API_ENDPOINTS = {
    register: `${API_URL}/api/Auth/register`,
    login: `${API_URL}/api/Auth/login`,
};
