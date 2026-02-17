import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import resourceService from '../../services/resourceService';

const ResourceForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        type: 'LAB',
        capacity: 1,
        status: 'AVAILABLE',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isEditMode) {
            const fetchResource = async () => {
                try {
                    setLoading(true);
                    const response = await resourceService.getResourceById(id);
                    const { name, type, capacity, status } = response.data;
                    setFormData({ name, type, capacity, status });
                } catch (error) {
                    console.error("Failed to fetch resource", error);
                    navigate('/resources');
                } finally {
                    setLoading(false);
                }
            };
            fetchResource();
        }
    }, [id, isEditMode, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        try {
            if (isEditMode) {
                await resourceService.updateResource(id, formData);
                toast.success("Resource updated successfully");
            } else {
                await resourceService.createResource(formData);
                toast.success("Resource created successfully");
            }
            navigate('/resources');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditMode && !formData.name) {
        return <div className="container">Loading resource...</div>;
    }

    return (
        <div className="container">
            <div className="form-container">
                <h2>{isEditMode ? 'Edit Resource' : 'Add New Resource'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                        {errors.name && <div className="error-message">{errors.name}</div>}
                    </div>

                    <div className="form-group">
                        <label>Type</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="form-control"
                        >
                            <option value="LAB">Lab</option>
                            <option value="CLASSROOM">Classroom</option>
                            <option value="EVENT_HALL">Event Hall</option>
                        </select>
                        {errors.type && <div className="error-message">{errors.type}</div>}
                    </div>

                    <div className="form-group">
                        <label>Capacity <span className="text-danger">*</span></label>
                        <input
                            type="number"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                            className="form-control"
                            min="1"
                            required
                        />
                        {errors.capacity && <div className="error-message">{errors.capacity}</div>}
                    </div>

                    <div className="form-group">
                        <label>Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="form-control"
                        >
                            <option value="AVAILABLE">Available</option>
                            <option value="UNAVAILABLE">Unavailable</option>
                        </select>
                        {errors.status && <div className="error-message">{errors.status}</div>}
                    </div>

                    <div className="mt-3">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Resource'}
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ marginLeft: '10px' }}
                            onClick={() => navigate('/resources')}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResourceForm;
