import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import userService from '../../services/userService';
import StatusBadge from '../../components/StatusBadge';
import ConfirmDialog from '../../components/ConfirmDialog';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [deleteId, setDeleteId] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await userService.getUsers(statusFilter);
            setUsers(response.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
            // Error handled by api interceptor
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [statusFilter]);

    const handleDeleteClick = (id) => {
        setDeleteId(id);
    };

    const handleConfirmDelete = async () => {
        if (!deleteId) return;
        try {
            await userService.deleteUser(deleteId);
            toast.success("User deleted successfully");
            fetchUsers();
        } catch (error) {
            console.error("Failed to delete user", error);
        } finally {
            setDeleteId(null);
        }
    };

    return (
        <div className="container">
            <div className="justify-between mb-3">
                <h1>Users</h1>
                <Link to="/users/new" className="btn btn-primary">Add User</Link>
            </div>

            <div className="mb-3">
                <label className="mr-2">Filter by Status:</label>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="form-control"
                    style={{ width: '200px', display: 'inline-block' }}
                >
                    <option value="ALL">All</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                </select>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone || '-'}</td>
                                    <td>{user.role}</td>
                                    <td><StatusBadge status={user.status} /></td>
                                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <Link to={`/users/${user.id}/edit`} className="btn btn-sm btn-secondary mr-2">
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteClick(user.id)}
                                            className="btn btn-sm btn-danger"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <ConfirmDialog
                isOpen={!!deleteId}
                title="Delete User"
                message="Are you sure you want to delete this user?"
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteId(null)}
            />
        </div>
    );
};

export default UserList;
