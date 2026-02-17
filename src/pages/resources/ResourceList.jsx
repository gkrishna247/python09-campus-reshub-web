import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import resourceService from '../../services/resourceService';
import StatusBadge from '../../components/StatusBadge';
import ConfirmDialog from '../../components/ConfirmDialog';

const ResourceList = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const response = await resourceService.getResources();
            setResources(response.data);
        } catch (error) {
            console.error("Failed to fetch resources", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    const handleDeleteClick = (id) => {
        setDeleteId(id);
    };

    const handleConfirmDelete = async () => {
        if (!deleteId) return;
        try {
            await resourceService.deleteResource(deleteId);
            toast.success("Resource deleted successfully");
            fetchResources();
        } catch (error) {
            console.error("Failed to delete resource", error);
        } finally {
            setDeleteId(null);
        }
    };

    return (
        <div className="container">
            <div className="justify-between mb-3">
                <h1>Resources</h1>
                <Link to="/resources/new" className="btn btn-primary">Add Resource</Link>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : resources.length === 0 ? (
                <p>No resources found.</p>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Capacity</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resources.map((resource) => (
                                <tr key={resource.id}>
                                    <td>{resource.name}</td>
                                    <td>{resource.type}</td>
                                    <td>{resource.capacity}</td>
                                    <td><StatusBadge status={resource.status} /></td>
                                    <td>
                                        <Link to={`/resources/${resource.id}/edit`} className="btn btn-sm btn-secondary mr-2">
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteClick(resource.id)}
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
                title="Delete Resource"
                message="Are you sure you want to delete this resource?"
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteId(null)}
            />
        </div>
    );
};

export default ResourceList;
