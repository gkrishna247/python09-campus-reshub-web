import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import bookingService from '../../services/bookingService';
import userService from '../../services/userService';
import resourceService from '../../services/resourceService';

const BookingForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        user_id: '',
        resource_id: '',
        booking_date: '',
        time_slot: '',
    });

    const [users, setUsers] = useState([]);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [conflictError, setConflictError] = useState(null);

    const timeSlots = [
        "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00",
        "13:00-14:00", "14:00-15:00", "15:00-16:00", "16:00-17:00"
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, resourcesRes] = await Promise.all([
                    userService.getUsers(),
                    resourceService.getResources()
                ]);
                setUsers(usersRes.data);
                setResources(resourcesRes.data);
            } catch (error) {
                console.error("Failed to load users or resources", error);
                toast.error("Failed to load form data");
            } finally {
                setDataLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
        if (conflictError) {
            setConflictError(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setConflictError(null);
        setLoading(true);

        try {
            await bookingService.createBooking(formData);
            toast.success("Booking created successfully");
            navigate('/bookings');
        } catch (error) {
            if (error.response) {
                if (error.response.status === 409) {
                    // Double booking conflict
                    setConflictError(error.response.data.message || "This resource is already booked for the selected date and time slot.");
                } else if (error.response.data && error.response.data.errors) {
                    setErrors(error.response.data.errors);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    if (dataLoading) {
        return <div className="container">Loading form data...</div>;
    }

    // Get today's date in YYYY-MM-DD format for min date attribute
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="container">
            <div className="form-container">
                <h2>New Booking</h2>

                {conflictError && (
                    <div className="alert alert-danger" style={{
                        color: '#721c24',
                        backgroundColor: '#f8d7da',
                        borderColor: '#f5c6cb',
                        padding: '.75rem 1.25rem',
                        marginBottom: '1rem',
                        borderRadius: '.25rem',
                        border: '1px solid transparent'
                    }}>
                        {conflictError}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>User <span className="text-danger">*</span></label>
                        <select
                            name="user_id"
                            value={formData.user_id}
                            onChange={handleChange}
                            className="form-control"
                            required
                        >
                            <option value="">-- Select User --</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>{user.name} ({user.role})</option>
                            ))}
                        </select>
                        {errors.user_id && <div className="error-message">{errors.user_id}</div>}
                    </div>

                    <div className="form-group">
                        <label>Resource <span className="text-danger">*</span></label>
                        <select
                            name="resource_id"
                            value={formData.resource_id}
                            onChange={handleChange}
                            className="form-control"
                            required
                        >
                            <option value="">-- Select Resource --</option>
                            {resources.map(resource => (
                                <option key={resource.id} value={resource.id}>{resource.name} ({resource.type})</option>
                            ))}
                        </select>
                        {errors.resource_id && <div className="error-message">{errors.resource_id}</div>}
                    </div>

                    <div className="form-group">
                        <label>Booking Date <span className="text-danger">*</span></label>
                        <input
                            type="date"
                            name="booking_date"
                            value={formData.booking_date}
                            onChange={handleChange}
                            className="form-control"
                            min={today}
                            required
                        />
                        {errors.booking_date && <div className="error-message">{errors.booking_date}</div>}
                    </div>

                    <div className="form-group">
                        <label>Time Slot <span className="text-danger">*</span></label>
                        <select
                            name="time_slot"
                            value={formData.time_slot}
                            onChange={handleChange}
                            className="form-control"
                            required
                        >
                            <option value="">-- Select Time Slot --</option>
                            {timeSlots.map(slot => (
                                <option key={slot} value={slot}>{slot}</option>
                            ))}
                        </select>
                        {errors.time_slot && <div className="error-message">{errors.time_slot}</div>}
                    </div>

                    <div className="mt-3">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Submitting...' : 'Create Booking'}
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ marginLeft: '10px' }}
                            onClick={() => navigate('/bookings')}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingForm;
