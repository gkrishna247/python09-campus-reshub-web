import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response.data; // Return the data directly for easier consumption
    },
    (error) => {
        if (error.response) {
            const { status, data } = error.response;

            if (status === 409) {
                toast.error("This resource is already booked for the selected date and time slot.");
            } else if (status === 400) {
                // Validation errors usually come in data.errors
                // We'll let the component handle specific field errors if needed,
                // but can show a generic message or the first error here.
                // For this requirement: "For 400 errors show validation messages."
                // We might not want to toast ALL validation errors if we show them inline.
                // Let's toast a summary if message is present.
                if (data.message) {
                    toast.error(data.message);
                }
            } else if (status === 500) {
                toast.error("Server error, please try again.");
            } else {
                toast.error(data.message || "An unexpected error occurred.");
            }
        } else if (error.request) {
            toast.error("Cannot connect to server. Please check if the backend is running.");
        } else {
            toast.error("An error occurred while setting up the request.");
        }
        return Promise.reject(error);
    }
);

export default api;
