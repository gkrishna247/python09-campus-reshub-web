import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import userService from '../services/userService';
import resourceService from '../services/resourceService';
import bookingService from '../services/bookingService';

const Dashboard = () => {
    const [counts, setCounts] = useState({
        users: 0,
        resources: 0,
        bookings: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, resourcesRes, bookingsRes] = await Promise.all([
                    userService.getUsers(),
                    resourceService.getResources(),
                    bookingService.getBookings(),
                ]);

                setCounts({
                    users: usersRes.count,
                    resources: resourcesRes.count,
                    bookings: bookingsRes.count,
                });
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="container">Loading dashboard...</div>;
    }

    return (
        <div className="container">
            <h1>Dashboard</h1>
            <div className="dashboard-grid">
                <Link to="/users" className="card">
                    <div className="card-title">Total Users</div>
                    <p className="card-number">{counts.users}</p>
                </Link>
                <Link to="/resources" className="card">
                    <div className="card-title">Total Resources</div>
                    <p className="card-number">{counts.resources}</p>
                </Link>
                <Link to="/bookings" className="card">
                    <div className="card-title">Total Bookings</div>
                    <p className="card-number">{counts.bookings}</p>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
