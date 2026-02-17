import React from 'react';

const StatusBadge = ({ status }) => {
    let badgeClass = 'badge-secondary';

    switch (status) {
        case 'ACTIVE':
        case 'AVAILABLE':
        case 'APPROVED':
            badgeClass = 'badge-success';
            break;
        case 'INACTIVE':
        case 'UNAVAILABLE':
        case 'REJECTED':
            badgeClass = 'badge-danger';
            break;
        case 'PENDING':
            badgeClass = 'badge-warning';
            break;
        default:
            badgeClass = 'badge-secondary';
    }

    return (
        <span className={`badge ${badgeClass}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
